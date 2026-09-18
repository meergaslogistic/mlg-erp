// app.js – Main application
/**
 * MLG Advanced ERP – Main Application Module
 * Alpine.js reactive core + Auto Ledger engine
 */


function createApp() {
    const { fmt, fmtMoney, calcAmount, parseAmount, formatDateDisplay, today } = window.MLGHelpers;
    const { initialMaster, initialInventories, samplePurchases, sampleSales, createInitialParties } = window.MLGStore;

  return {
    // ========== UI State ==========
    section: 'dashboard',
    sidebarOpen: false,
    partySearch: '',
    activeParty: null,
    showAddParty: false,
    newPartyName: '',
    newPartyCity: '',
    selectedInv: 'rpg',
    toast: { show: false, msg: '' },
    clockNow: '',
    clockDate: '',
    greeting: 'Welcome',
    greetIcon: '☀️',
    pdfOptions: { show: false, header: true, footer: true, logo: false, watermark: true, type: null, data: null },

    titles: {
      dashboard: 'Dashboard',
      guide: 'Data Flow & Documents',
      parties: 'Parties & Ledgers',
      inventory: 'Inventory',
      purchase: 'LPG Purchase / Loading',
      sale: 'LPG Sale',
      payment: 'Payments',
      diesel: 'Diesel & Cash',
      master: 'Master Data'
    },

    nav: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
      { id: 'guide', label: 'Data Flow', icon: 'fas fa-route' },
      { id: 'parties', label: 'Parties & Ledgers', icon: 'fas fa-users' },
      { id: 'purchase', label: 'Purchase / Loading', icon: 'fas fa-truck-loading' },
      { id: 'sale', label: 'Sale', icon: 'fas fa-file-invoice-dollar' },
      { id: 'payment', label: 'Payments', icon: 'fas fa-money-bill-wave' },
      { id: 'inventory', label: 'Inventory', icon: 'fas fa-warehouse' },
      { id: 'diesel', label: 'Diesel & Cash', icon: 'fas fa-gas-pump' },
      { id: 'master', label: 'Master Data', icon: 'fas fa-database' }
    ],

    // ========== Business Data ==========
    master: JSON.parse(JSON.stringify(initialMaster)),
    inventories: JSON.parse(JSON.stringify(initialInventories)),
    parties: [],
    purchases: [...samplePurchases],
    sales: [...sampleSales],
    payments: [],
    dieselEntries: [],

    totals: {
      purchased: 1743.83,
      sold: 1744.73,
      stock: 312,
      soldOut: 0
    },

    // ========== Forms ==========
    purchaseForm: {
      dealType: 'stock',
      loadingDate: '', bowser: '', party: 'RPG Plant - STOCK', city: '', plant: '',
      qty: '', rate: '', amount: '', unloadDate: '', source: '', remarks: ''
    },
    saleForm: {
      dealType: 'from_stock',
      date: '', bowser: '', party: '', city: '', plant: 'RPG STOCK - Karachi',
      qty: '', rate: '', amount: '', remarks: ''
    },
    paymentForm: {
      date: '', type: 'Received', party: '', fromParty: '', toParty: '',
      slip: '', tid: '', bank: '', amount: '', remarks: '', proofName: '', proofData: ''
    },
    stockForm: {
      location: 'RPG Plant – STOCK', type: 'In', qty: '', notes: ''
    },
    dieselForm: {
      date: '', bowser: '', type: 'Diesel', location: 'Mand', qty: '', rate: '', amount: ''
    },

    masterSections: [
      { key: 'party', title: 'Parties' },
      { key: 'bowser', title: 'Bowsers' },
      { key: 'city', title: 'Cities' },
      { key: 'plant', title: 'Filling Plants / Boarders' },
      { key: 'bank', title: 'Banks / Accounts' },
      { key: 'source', title: 'Sources / Descriptions' }
    ],

    recentActivity: [
      { title: 'Sale – Aziz Plant', sub: 'NLA 026 • 30.305 T', value: '11.38M', color: 'text-emerald-600' },
      { title: 'Purchase – RPG Stock', sub: 'TMQ 013 • 52.32 T', value: '+52.32', color: 'text-teal-600' },
      { title: 'Payment Received', sub: 'NEW JAMALI', value: '2.7M', color: 'text-blue-600' }
    ],

    // ========== Computed ==========
    get currentInv() {
      return this.inventories.find(i => i.id === this.selectedInv) || this.inventories[0];
    },
    get filteredParties() {
      const q = (this.partySearch || '').toLowerCase();
      return this.parties.filter(p =>
        !q || p.name.toLowerCase().includes(q) || (p.city || '').toLowerCase().includes(q)
      );
    },

    // ========== Lifecycle ==========
    init() {
      this.parties = createInitialParties(this.master.party);
      this.refreshDatalists();
      this.loadFromStorage();
      this.recalcTotals();
      this.tickClock();
      this._clockTimer = setInterval(() => this.tickClock(), 1000);
    },

    tickClock() {
      const now = new Date();
      this.clockNow = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.clockDate = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      const h = now.getHours();
      if (h < 12) { this.greeting = 'Good Morning'; this.greetIcon = '☀️'; }
      else if (h < 17) { this.greeting = 'Good Afternoon'; this.greetIcon = '🌤️'; }
      else { this.greeting = 'Good Evening'; this.greetIcon = '🌙'; }
    },

    openBusinessProfile() {
      this.showToast('Business profile — coming soon');
    },

    startWork(kind) {
      if (kind === 'buy_stock') {
        this.purchaseForm.dealType = 'stock';
        this.purchaseForm.party = 'RPG Plant - STOCK';
        this.go('purchase');
      } else if (kind === 'buy_direct') {
        this.purchaseForm.dealType = 'direct';
        this.purchaseForm.party = '';
        this.go('purchase');
      } else if (kind === 'sell_stock') {
        this.saleForm.dealType = 'from_stock';
        this.saleForm.plant = 'RPG STOCK - Karachi';
        this.go('sale');
      } else if (kind === 'sell_direct') {
        this.saleForm.dealType = 'direct';
        this.saleForm.plant = '';
        this.go('sale');
      } else if (kind === 'pay') {
        this.go('payment');
      } else if (kind === 'ledger') {
        this.go('parties');
      }
    },

    setPurchaseDeal(type) {
      this.purchaseForm.dealType = type;
      if (type === 'stock') this.purchaseForm.party = 'RPG Plant - STOCK';
    },

    setSaleDeal(type) {
      this.saleForm.dealType = type;
      if (type === 'from_stock') this.saleForm.plant = 'RPG STOCK - Karachi';
    },

    recalcTotals() {
      const sumQty = (arr) => (arr || []).reduce((s, r) => s + (parseFloat(r.qty) || 0), 0);
      this.totals.purchased = Math.round(sumQty(this.purchases) * 1000) / 1000;
      this.totals.sold = Math.round(sumQty(this.sales) * 1000) / 1000;
      const inv = this.inventories[0];
      this.totals.stock = inv ? (parseFloat(inv.qty) || 0) : 0;
    },

    // ========== Navigation ==========
    go(id) {
      this.section = id;
      this.sidebarOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    showToast(msg) {
      this.toast = { show: true, msg };
      setTimeout(() => { this.toast.show = false; }, 2800);
    },

    // ========== Helpers exposed to template ==========
    fmt, fmtMoney, formatDateDisplay,

    // ========== Datalists ==========
    refreshDatalists() {
      const map = {
        bowser: 'bowserList', party: 'partyList', city: 'cityList',
        plant: 'plantList', bank: 'bankList', source: 'sourceList'
      };
      Object.keys(map).forEach(k => {
        const el = document.getElementById(map[k]);
        if (el) {
          el.innerHTML = (this.master[k] || []).map(v => `<option value="${v}">`).join('');
        }
      });
    },

    // ========== Persistence (LocalStorage) ==========
    saveToStorage() {
      try {
        const payload = {
          parties: this.parties,
          purchases: this.purchases,
          sales: this.sales,
          payments: this.payments,
          inventories: this.inventories,
          master: this.master,
          totals: this.totals
        };
        localStorage.setItem('mlg_erp_v4', JSON.stringify(payload));
      } catch (e) { console.warn('Storage save failed', e); }
    },

    loadFromStorage() {
      try {
        const raw = localStorage.getItem('mlg_erp_v4');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.parties) this.parties = data.parties;
        if (data.purchases) this.purchases = data.purchases;
        if (data.sales) this.sales = data.sales;
        if (data.payments) this.payments = data.payments;
        if (data.inventories) this.inventories = data.inventories;
        if (data.master) this.master = data.master;
        if (data.totals) this.totals = data.totals;
        this.refreshDatalists();
      } catch (e) { console.warn('Storage load failed', e); }
    },

    // ========== Party & Auto Ledger Engine ==========
    openPartyLedger(p) {
      this.activeParty = p;
    },

    confirmAddParty() {
      const name = (this.newPartyName || '').trim();
      if (!name) return;
      if (!this.master.party.includes(name)) {
        this.master.party.push(name);
        this.parties.push({
          id: 'p' + Date.now(),
          name,
          city: this.newPartyCity || '',
          balance: 0,
          last: 'New',
          ledger: []
        });
        this.refreshDatalists();
        this.saveToStorage();
        this.showToast(`"${name}" added successfully`);
      }
      this.showAddParty = false;
      this.newPartyName = '';
      this.newPartyCity = '';
    },

    addMasterItem(key) {
      const val = prompt(`Add new ${key}:`);
      if (val && val.trim() && !this.master[key].includes(val.trim())) {
        this.master[key].push(val.trim());
        this.refreshDatalists();
        this.saveToStorage();
        this.showToast(`Added to ${key}`);
      }
    },

    /**
     * CORE: Auto post to Party Ledger
     * This is the heart of the system – every Sale / Payment / relevant Purchase
     * automatically creates a ledger entry and updates running balance.
     */
    postToLedger(partyName, narration, debit = 0, credit = 0, extra = {}) {
      if (!partyName) return;
      let p = this.parties.find(x => (x.name || '').toLowerCase() === partyName.toLowerCase());
      if (!p) {
        p = {
          id: 'p' + Date.now(),
          name: partyName,
          city: '',
          balance: 0,
          last: '—',
          ledger: []
        };
        this.parties.push(p);
      }
      const debitN = Number(debit) || 0;
      const creditN = Number(credit) || 0;
      const newBalance = (Number(p.balance) || 0) + debitN - creditN;
      p.balance = newBalance;
      p.last = formatDateDisplay(new Date());
      p.ledger.unshift({
        date: extra.date ? formatDateDisplay(extra.date) : formatDateDisplay(new Date()),
        narration: narration || '',
        bowser: extra.bowser || '',
        tid: extra.tid || '',
        fromParty: extra.fromParty || '',
        toParty: extra.toParty || '',
        qty: extra.qty != null && extra.qty !== '' ? String(extra.qty) : '',
        rate: extra.rate != null && extra.rate !== '' ? String(extra.rate) : '',
        debit: debitN,
        credit: creditN,
        balance: newBalance,
        sourceType: extra.sourceType || '',
        sourceId: extra.sourceId || ''
      });
    },

    rebuildPartyBalance(p) {
      if (!p || !p.ledger) return;
      const chrono = [...p.ledger].reverse();
      let bal = 0;
      chrono.forEach(e => {
        bal = bal + (Number(e.debit) || 0) - (Number(e.credit) || 0);
        e.balance = bal;
      });
      p.balance = bal;
      p.ledger = chrono.reverse();
    },

    removeLedgerBySource(sourceType, sourceId) {
      (this.parties || []).forEach(p => {
        const before = (p.ledger || []).length;
        p.ledger = (p.ledger || []).filter(e => !(e.sourceType === sourceType && String(e.sourceId) === String(sourceId)));
        if (p.ledger.length !== before) this.rebuildPartyBalance(p);
      });
    },

    removeStockBySource(sourceId) {
      const inv = this.inventories[0];
      if (!inv) return;
      const hit = (inv.movements || []).filter(m => String(m.sourceId) === String(sourceId));
      hit.forEach(m => {
        const q = parseFloat(m.qty) || 0;
        const cur = parseFloat(inv.qty) || 0;
        inv.qty = Math.round((m.type === 'Out' ? cur + q : cur - q) * 1000) / 1000;
      });
      inv.movements = (inv.movements || []).filter(m => String(m.sourceId) !== String(sourceId));
      inv.qtyLabel = '~ ' + inv.qty;
      inv.status = inv.qty > 0 ? 'Available' : 'Empty';
      this.totals.stock = inv.qty;
    },

    confirmDelete(label) {
      return window.confirm('Delete this ' + label + '? Linked stock and ledger lines will be reversed.');
    },

    deletePurchase(row) {
      if (!row || !this.confirmDelete('purchase')) return;
      this.removeLedgerBySource('purchase', row.id);
      this.removeStockBySource(row.id);
      this.purchases = this.purchases.filter(x => x.id !== row.id);
      this.recalcTotals();
      this.saveToStorage();
      this.showToast('Purchase deleted and linked records reversed');
    },

    deleteSale(row) {
      if (!row || !this.confirmDelete('sale')) return;
      this.removeLedgerBySource('sale', row.id);
      this.removeStockBySource(row.id);
      this.sales = this.sales.filter(x => x.id !== row.id);
      this.recalcTotals();
      this.saveToStorage();
      this.showToast('Sale deleted and linked records reversed');
    },

    deletePayment(row) {
      if (!row || !this.confirmDelete('payment')) return;
      this.removeLedgerBySource('payment', row.id);
      this.payments = this.payments.filter(x => x.id !== row.id);
      this.saveToStorage();
      this.showToast('Payment deleted and ledger reversed');
    },

    deleteMovement(m, idx) {
      if (!this.confirmDelete('stock movement')) return;
      if (m && m.sourceId) this.removeStockBySource(m.sourceId);
      else {
        const inv = this.inventories[0];
        if (!inv) return;
        const q = parseFloat(m.qty) || 0;
        const cur = parseFloat(inv.qty) || 0;
        inv.qty = Math.round((m.type === 'Out' ? cur + q : cur - q) * 1000) / 1000;
        inv.movements.splice(idx, 1);
        inv.qtyLabel = '~ ' + inv.qty;
        this.totals.stock = inv.qty;
      }
      this.recalcTotals();
      this.saveToStorage();
      this.showToast('Stock movement removed');
    },

    editPurchase(row) {
      this.purchaseForm = {
        dealType: row.dealType || ((row.party || '').toUpperCase().includes('STOCK') ? 'stock' : 'direct'),
        loadingDate: row.date || '',
        bowser: row.bowser || '',
        party: row.party || '',
        city: row.city || '',
        plant: row.plant || '',
        source: row.source || '',
        qty: row.qty || '',
        rate: row.rate || '',
        amount: row.amount || '',
        unloadDate: row.unloadDate || '',
        remarks: row.remarks || '',
        editingId: row.id
      };
      this.go('purchase');
      this.showToast('Edit mode — save to replace this purchase');
    },

    editSale(row) {
      this.saleForm = {
        dealType: row.dealType || ((row.plant || '').toUpperCase().includes('STOCK') || (row.plant || '').toUpperCase().includes('RPG') ? 'from_stock' : 'direct'),
        date: row.date || '',
        bowser: row.bowser || '',
        party: row.party || '',
        city: row.city || '',
        plant: row.plant || '',
        qty: row.qty || '',
        rate: row.rate || '',
        amount: row.amount || '',
        remarks: row.remarks || '',
        editingId: row.id
      };
      this.go('sale');
      this.showToast('Edit mode — save to replace this sale');
    },

    editPayment(row) {
      this.paymentForm = {
        date: row.date || '',
        type: row.type || 'Received',
        party: row.party || '',
        fromParty: row.fromParty || '',
        toParty: row.toParty || '',
        slip: row.slip || '',
        tid: row.tid || '',
        bank: row.bank || '',
        amount: row.amount || '',
        remarks: row.remarks || '',
        proofName: row.proofName || '',
        proofData: row.proofData || '',
        editingId: row.id
      };
      this.go('payment');
      this.showToast('Edit mode — save to replace this payment');
    },

    calcPurchase() {
      this.purchaseForm.amount = calcAmount(this.purchaseForm.qty, this.purchaseForm.rate);
    },

    calcSale() {
      this.saleForm.amount = calcAmount(this.saleForm.qty, this.saleForm.rate);
    },

    getBowser(e) {
      if (!e) return '';
      if (e.bowser) return e.bowser;
      const m = String(e.narration || '').match(/\b([A-Z]{2,4}\s?-?\s?\d{2,5})\b/i);
      return m ? m[1].toUpperCase() : '';
    },

    getQty(e) {
      if (!e) return '';
      if (e.qty) return e.qty;
      const m = String(e.narration || '').match(/(\d+(?:\.\d+)?)\s*(?:T|Ton|MT)\b/i);
      return m ? m[1] : '';
    },

    getTid(e) {
      if (!e) return '';
      if (e.tid) return e.tid;
      const m = String(e.narration || '').match(/\b(\d{8,20})\b/);
      return m ? m[1] : '';
    },

    getFrom(e) {
      if (!e) return '';
      return e.fromParty || '';
    },

    getTo(e) {
      if (!e) return '';
      return e.toParty || '';
    },

    getRate(e) {
      if (!e) return '';
      if (e.rate) return e.rate;
      const bowser = this.getBowser(e);
      const qty = String(this.getQty(e) || '');
      const fromPurchase = (this.purchases || []).find(p =>
        (!bowser || String(p.bowser || '').toUpperCase() === bowser.toUpperCase()) &&
        (!qty || String(p.qty || '') === qty) &&
        p.rate
      );
      if (fromPurchase && fromPurchase.rate) return fromPurchase.rate;
      const fromSale = (this.sales || []).find(s =>
        (!bowser || String(s.bowser || '').toUpperCase() === bowser.toUpperCase()) &&
        (!qty || String(s.qty || '') === qty) &&
        s.rate
      );
      if (fromSale && fromSale.rate) return fromSale.rate;
      const q = parseFloat(qty);
      const debit = Number(e.debit) || 0;
      if (q && debit) return Math.round(debit / q);
      return '';
    },

    formatLedgerDesc(e) {
      if (!e) return '';
      const parts = [];
      const base = String(e.narration || '').replace(/\s+/g, ' ').trim();
      if (base) parts.push(base);

      const bowser = this.getBowser(e);
      const qty = this.getQty(e);
      const rate = this.getRate(e);
      const tid = this.getTid(e);
      const fromP = this.getFrom(e);
      const toP = this.getTo(e);

      const extra = [];
      if (bowser && !base.toUpperCase().includes(String(bowser).toUpperCase())) extra.push('Bowser ' + bowser);
      if (qty && !base.includes(String(qty))) extra.push('Qty ' + qty + ' MT');
      if (rate) extra.push('Rate ' + this.fmtMoney(rate));
      if (tid && !base.includes(String(tid))) extra.push('TID ' + tid);
      if (fromP && toP) extra.push('From ' + fromP + ' To ' + toP);
      else if (fromP && !base.toLowerCase().includes(fromP.toLowerCase())) extra.push('From ' + fromP);
      else if (toP && !base.toLowerCase().includes(toP.toLowerCase())) extra.push('To ' + toP);

      if (extra.length) parts.push(extra.join(' | '));
      return parts.filter(Boolean).join('  •  ');
    },

    applyStockMove(type, qty, remarks, dateStr, sourceId) {
      const inv = this.inventories[0];
      if (!inv) return;
      const q = parseFloat(qty) || 0;
      const current = parseFloat(inv.qty) || 0;
      const signedType = type === 'Out' ? 'Out' : 'In';
      const next = signedType === 'Out' ? current - q : current + q;
      inv.qty = Math.round(next * 1000) / 1000;
      inv.qtyLabel = '~ ' + inv.qty;
      inv.status = inv.qty > 0 ? 'Available' : 'Empty';
      inv.statusClass = inv.qty > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500';
      inv.movements.unshift({
        date: dateStr || formatDateDisplay(new Date()),
        type: signedType,
        qty: String(qty),
        remarks: remarks || '',
        sourceId: sourceId || ''
      });
      this.totals.stock = inv.qty;
    },

    rebuildLedgerNarration(kind, f) {
      const bits = [];
      bits.push(kind);
      if (f.bowser) bits.push('Bowser ' + f.bowser);
      if (f.qty) bits.push(f.qty + ' MT');
      if (f.plant) bits.push('Plant ' + f.plant);
      if (f.source) bits.push('Source ' + f.source);
      if (f.city) bits.push(f.city);
      if (f.remarks) bits.push(f.remarks);
      if (!f.rate) bits.push('Rate pending');
      return bits.join(' • ');
    },

    savePurchase() {
      const f = this.purchaseForm;
      if (!f.loadingDate || !f.bowser || !f.party || !f.qty) {
        this.showToast('Date, bowser, party and quantity are required. Rate can be added later.');
        return;
      }
      if (f.editingId) {
        const old = this.purchases.find(x => x.id === f.editingId);
        if (old) {
          this.removeLedgerBySource('purchase', old.id);
          this.removeStockBySource(old.id);
          this.purchases = this.purchases.filter(x => x.id !== old.id);
        }
      }
      if (f.dealType === 'stock' && !f.unloadDate) f.unloadDate = f.loadingDate;
      const status = f.dealType === 'stock' ? 'Delivered' : (f.unloadDate ? 'Delivered' : 'On Route');
      const isRpg = f.dealType === 'stock' || (f.party || '').toUpperCase().includes('RPG') || (f.party || '').toUpperCase().includes('STOCK');
      const rec = {
        id: Date.now(),
        date: f.loadingDate,
        bowser: f.bowser,
        party: f.party,
        city: f.city,
        plant: f.plant,
        source: f.source,
        remarks: f.remarks,
        qty: f.qty,
        rate: f.rate || '',
        amount: f.rate ? calcAmount(f.qty, f.rate) : '',
        status,
        unloadDate: f.unloadDate || '',
        ratePending: !f.rate,
        dealType: f.dealType || (isRpg ? 'stock' : 'direct')
      };
      this.purchases.unshift(rec);

      if (isRpg && status === 'Delivered') {
        this.applyStockMove(
          'In',
          f.qty,
          `${f.bowser} – ${f.source || f.remarks || 'Stock purchase'}`,
          formatDateDisplay(f.unloadDate || f.loadingDate),
          rec.id
        );
      }

      // Direct party purchase (not stock): ledger me record — amount 0 ho to Rate pending
      if (!isRpg) {
        const amt = parseAmount(rec.amount);
        this.postToLedger(f.party, this.rebuildLedgerNarration('Purchase / Loading', f), amt, 0, {
          qty: f.qty, rate: f.rate, bowser: f.bowser, date: f.loadingDate,
          sourceType: 'purchase', sourceId: rec.id
        });
      }

      this.showToast(isRpg
        ? (status === 'Delivered' ? 'Purchase STOCK me In ho gaya' : 'Purchase On Route — unload par STOCK In hoga')
        : (rec.ratePending ? 'Purchase party ledger me • Rate pending' : 'Purchase party ledger me save'));
      this.purchaseForm = {
        dealType: f.dealType || 'stock',
        loadingDate: '', bowser: '', party: isRpg ? 'RPG Plant - STOCK' : '', city: '', plant: '',
        qty: '', rate: '', amount: '', unloadDate: '', source: '', remarks: '', editingId: null
      };
      this.recalcTotals();
      this.saveToStorage();
    },

    /** Excel-style: pehle Ton, baad mein rate — amount + ledger auto update */
    applyPendingRate(kind, id, newRate) {
      const rate = parseFloat(newRate);
      if (!rate) {
        this.showToast('Valid rate daalein');
        return;
      }
      const list = kind === 'sale' ? this.sales : this.purchases;
      const rec = list.find(x => x.id === id);
      if (!rec) return;
      rec.rate = String(rate);
      rec.amount = calcAmount(rec.qty, rate);
      rec.ratePending = false;
      const amt = parseAmount(rec.amount);
      const partyName = rec.party;
      const p = this.parties.find(x => (x.name || '').toLowerCase() === String(partyName || '').toLowerCase());
      if (p && p.ledger) {
        const row = p.ledger.find(e =>
          String(e.bowser || '') === String(rec.bowser || '') &&
          String(e.qty || '') === String(rec.qty || '') &&
          (!e.rate || e.narration && e.narration.includes('Rate pending'))
        );
        if (row) {
          const oldDebit = Number(row.debit) || 0;
          row.rate = String(rate);
          row.debit = amt;
          row.narration = String(row.narration || '').replace(/\s*•\s*Rate pending/g, '') + ' • Rate updated';
          const diff = amt - oldDebit;
          p.balance = (Number(p.balance) || 0) + diff;
          row.balance = (Number(row.balance) || 0) + diff;
        }
      }
      this.showToast('Rate save • Amount ' + rec.amount);
      this.saveToStorage();
    },

    saveSale() {
      const f = this.saleForm;
      if (!f.date || !f.bowser || !f.party || !f.qty) {
        this.showToast('Date, bowser, party and quantity are required. Rate is optional.');
        return;
      }
      if (f.editingId) {
        const old = this.sales.find(x => x.id === f.editingId);
        if (old) {
          this.removeLedgerBySource('sale', old.id);
          this.removeStockBySource(old.id);
          this.sales = this.sales.filter(x => x.id !== old.id);
        }
      }
      const rec = {
        id: Date.now(),
        date: f.date,
        bowser: f.bowser,
        party: f.party,
        city: f.city,
        plant: f.plant,
        remarks: f.remarks,
        qty: f.qty,
        rate: f.rate || '',
        amount: f.rate ? calcAmount(f.qty, f.rate) : '',
        ratePending: !f.rate,
        dealType: f.dealType || 'direct'
      };
      this.sales.unshift(rec);

      this.postToLedger(f.party, this.rebuildLedgerNarration('Sale', f), parseAmount(rec.amount), 0, {
        qty: f.qty, rate: f.rate, bowser: f.bowser, date: f.date,
        sourceType: 'sale', sourceId: rec.id
      });

      const fromStock = f.dealType === 'from_stock' || (f.plant || '').toUpperCase().includes('RPG') || (f.plant || '').toUpperCase().includes('STOCK');
      if (fromStock) {
        this.applyStockMove('Out', f.qty, `Sale to ${f.party}` + (f.remarks ? ' • ' + f.remarks : ''), formatDateDisplay(f.date), rec.id);
      }

      this.showToast(rec.ratePending ? 'Sale ledger me • Rate pending' : 'Sale saved • Party Ledger auto-updated');
      this.saleForm = {
        dealType: f.dealType || 'from_stock',
        date: '', bowser: '', party: '', city: '',
        plant: fromStock ? 'RPG STOCK - Karachi' : '',
        qty: '', rate: '', amount: '', remarks: '', editingId: null
      };
      this.recalcTotals();
      this.saveToStorage();
    },

    savePayment() {
      const f = this.paymentForm;
      const amt = parseFloat(f.amount) || 0;
      const tid = (f.tid || f.slip || '').trim();
      if (f.editingId) {
        this.removeLedgerBySource('payment', f.editingId);
        this.payments = this.payments.filter(x => x.id !== f.editingId);
      }

      if (f.type === 'Transfer') {
        if (!f.date || !f.fromParty || !f.toParty || !f.amount) {
          this.showToast('Transfer: Date, From Party, To Party, Amount required');
          return;
        }
        const note = (f.remarks || '').trim();
        const payId = Date.now();
        this.payments.unshift({
          id: payId,
          date: f.date,
          type: 'Transfer',
          party: f.fromParty + ' → ' + f.toParty,
          fromParty: f.fromParty,
          toParty: f.toParty,
          slip: f.slip,
          tid,
          bank: f.bank,
          amount: amt,
          remarks: note,
          proofName: f.proofName || '',
          proofData: f.proofData || ''
        });
        this.postToLedger(
          f.fromParty,
          `Direct / Slip payment to ${f.toParty}` + (tid ? ` • TID ${tid}` : '') + (f.slip ? ` • Slip ${f.slip}` : '') + (f.bank ? ` • ${f.bank}` : '') + (note ? ` • ${note}` : ''),
          0, amt,
          { date: f.date, tid, fromParty: f.fromParty, toParty: f.toParty, sourceType: 'payment', sourceId: payId }
        );
        this.postToLedger(
          f.toParty,
          `Direct / Slip received from ${f.fromParty}` + (tid ? ` • TID ${tid}` : '') + (f.slip ? ` • Slip ${f.slip}` : '') + (f.bank ? ` • ${f.bank}` : '') + (note ? ` • ${note}` : ''),
          amt, 0,
          { date: f.date, tid, fromParty: f.fromParty, toParty: f.toParty, sourceType: 'payment', sourceId: payId }
        );
        this.showToast('Transfer saved on both ledgers with TID / slip');
      } else {
        if (!f.date || !f.party || !f.amount) {
          this.showToast('Please fill required fields');
          return;
        }
        const fromParty = f.type === 'Received' ? f.party : (f.fromParty || 'Self');
        const toParty = f.type === 'Made' ? f.party : (f.toParty || 'Self');
        const note = (f.remarks || '').trim();
        const payId = Date.now();
        this.payments.unshift({
          id: payId,
          date: f.date,
          type: f.type,
          party: f.party,
          fromParty,
          toParty,
          slip: f.slip,
          tid,
          bank: f.bank,
          amount: amt,
          remarks: note,
          proofName: f.proofName || '',
          proofData: f.proofData || ''
        });
        if (f.type === 'Received') {
          this.postToLedger(
            f.party,
            `Payment Received` + (tid ? ` • TID ${tid}` : '') + (f.slip ? ` • Slip ${f.slip}` : '') + (f.bank ? ` • ${f.bank}` : '') + (note ? ` • ${note}` : ''),
            0, amt,
            { date: f.date, tid, fromParty, toParty, sourceType: 'payment', sourceId: payId }
          );
        } else {
          this.postToLedger(
            f.party,
            `Payment Made` + (tid ? ` • TID ${tid}` : '') + (f.slip ? ` • Slip ${f.slip}` : '') + (f.bank ? ` • ${f.bank}` : '') + (note ? ` • ${note}` : ''),
            amt, 0,
            { date: f.date, tid, fromParty, toParty, sourceType: 'payment', sourceId: payId }
          );
        }
        this.showToast('Payment saved to party ledger');
      }

      this.paymentForm = {
        date: '', type: 'Received', party: '', fromParty: '', toParty: '',
        slip: '', tid: '', bank: '', amount: '', remarks: '', proofName: '', proofData: '', editingId: null
      };
      this.saveToStorage();
    },

    adjustStock() {
      if (!this.stockForm.qty) return;
      const t = this.stockForm.type;
      if (t === 'Adjustment') {
        const inv = this.inventories[0];
        const target = parseFloat(this.stockForm.qty) || 0;
        const cur = parseFloat(inv.qty) || 0;
        const diff = Math.round((target - cur) * 1000) / 1000;
        if (diff === 0) return;
        this.applyStockMove(diff > 0 ? 'In' : 'Out', Math.abs(diff), this.stockForm.notes || 'Physical count adjustment', formatDateDisplay(new Date()), 'adj-' + Date.now());
      } else {
        this.applyStockMove(
          t === 'Out' ? 'Out' : 'In',
          this.stockForm.qty,
          this.stockForm.notes || 'Manual exception (use only for count variance)',
          formatDateDisplay(new Date()),
          'adj-' + Date.now()
        );
      }
      this.showToast('Exception stock movement posted');
      this.stockForm.qty = '';
      this.stockForm.notes = '';
      this.recalcTotals();
      this.saveToStorage();
    },

    saveDiesel() {
      const f = this.dieselForm;
      if (!f.date || !f.bowser) return;
      this.dieselEntries.unshift({
        id: Date.now(),
        ...f
      });
      this.showToast('Diesel / Cash entry saved');
      this.dieselForm = { date: '', bowser: '', type: 'Diesel', location: 'Mand', qty: '', rate: '', amount: '' };
      this.saveToStorage();
    },

    // ========== PDF EXPORT (Header/Footer/Logo toggles + 6cm margins + page border) ==========
    _imgCache: {},

    async loadAssetImage(name) {
      if (this._imgCache[name]) return this._imgCache[name];
      try {
        const res = await fetch('./assets/' + name);
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        this._imgCache[name] = dataUrl;
        return dataUrl;
      } catch (e) {
        console.warn('Asset load failed:', name, e);
        return null;
      }
    },

    onProofFile(ev) {
      const file = ev && ev.target && ev.target.files && ev.target.files[0];
      if (!file) {
        this.paymentForm.proofName = '';
        this.paymentForm.proofData = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const raw = String(reader.result || '');
        const img = new Image();
        img.onload = () => {
          const maxW = 1280;
          const scale = img.width > maxW ? maxW / img.width : 1;
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          this.paymentForm.proofName = file.name;
          this.paymentForm.proofData = c.toDataURL('image/jpeg', 0.72);
        };
        img.onerror = () => {
          this.paymentForm.proofName = file.name;
          this.paymentForm.proofData = raw;
        };
        img.src = raw;
      };
      reader.readAsDataURL(file);
    },

    clearProof() {
      this.paymentForm.proofName = '';
      this.paymentForm.proofData = '';
    },

    openPdfOptions(type, data) {
      this.pdfOptions = {
        show: true,
        header: true,
        footer: true,
        logo: false,
        watermark: true,
        type: type,
        data: data
      };
    },

    confirmPdfDownload(action) {
      // action: 'download' | 'print'
      const opts = { ...this.pdfOptions };
      this.pdfOptions.show = false;
      const mode = action || 'download';
      if (opts.type === 'ledger') {
        this.downloadPartyLedgerPDF(opts.data, opts, mode);
      } else if (opts.type === 'sale' || opts.type === 'purchase' || opts.type === 'payment') {
        this.downloadSingleEntryPDF(opts.type, opts.data, opts, mode);
      }
    },

    /** Deliver PDF: same bytes for download and print (identical output) */
    deliverPdf(doc, filename, mode) {
      if (mode === 'print') {
        // Same PDF bytes as download – open and print (set Margins = None in dialog)
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        // Hidden iframe print avoids some browser chrome margins vs new-tab print
        let frame = document.getElementById('mlg-print-frame');
        if (!frame) {
          frame = document.createElement('iframe');
          frame.id = 'mlg-print-frame';
          frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
          document.body.appendChild(frame);
        }
        frame.onload = () => {
          try {
            frame.contentWindow.focus();
            frame.contentWindow.print();
          } catch (e) {
            // Fallback: new tab
            window.open(url, '_blank');
          }
        };
        frame.src = url;
        setTimeout(() => { try { frame.contentWindow.print(); } catch (e) {} }, 800);
      } else {
        doc.save(filename);
      }
    },

    drawWatermark(doc) {
      const pageW = 210;
      const pageH = 297;
      const wm = this._imgCache && this._imgCache['watermark.png'];
      if (!wm) return;
      const wmW = 168;
      const wmH = wmW * (916 / 1716);
      doc.addImage(wm, 'PNG', (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH, undefined, 'FAST');
    },

    async applyPageChrome(doc, opts, pageNumber, layer) {
      const pageW = 210;
      const pageH = 297;
      const STD_MARGIN = 14;
      const layerMode = layer || 'all';

      const HEADER_H = pageW * (724 / 2172);
      const FOOTER_H = pageW * (725 / 2170);
      const FOOTER_SHIFT = 14;

      const useHeader = !!(opts && opts.header);
      const useFooter = !!(opts && opts.footer);
      const useLogo = !!(opts && opts.logo);
      const useWatermark = opts && opts.watermark !== false;
      const anyChrome = useHeader || useFooter || useLogo || useWatermark;

      // Border rules:
      // - No checkbox → full complete page border
      // - Any checkbox on → only left + right side borders (between 6cm top/bottom)
      if (!anyChrome) {
        // Full border
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.7);
        doc.rect(3.5, 3.5, pageW - 7, pageH - 7);
        doc.setDrawColor(20, 184, 166);
        doc.setLineWidth(0.3);
        doc.rect(4.6, 4.6, pageW - 9.2, pageH - 9.2);
      } else {
        const sideTop = useHeader ? HEADER_H : 14;
        const sideBottom = useFooter ? (pageH - (FOOTER_H - FOOTER_SHIFT)) : (pageH - 14);
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.7);
        doc.line(3.5, sideTop, 3.5, sideBottom);           // left
        doc.line(pageW - 3.5, sideTop, pageW - 3.5, sideBottom); // right
        doc.setDrawColor(20, 184, 166);
        doc.setLineWidth(0.3);
        doc.line(4.6, sideTop, 4.6, sideBottom);
        doc.line(pageW - 4.6, sideTop, pageW - 4.6, sideBottom);
      }

      if ((layerMode === 'all' || layerMode === 'under') && useWatermark) {
        await this.loadAssetImage('watermark.png');
        this.drawWatermark(doc);
      }

      if (layerMode === 'under') {
        let contentTopU = STD_MARGIN + 4;
        let contentBottomU = pageH - STD_MARGIN;
        if (useHeader) contentTopU = HEADER_H + 6;
        if (useFooter) contentBottomU = pageH - (FOOTER_H - FOOTER_SHIFT) - 4;
        return { contentTop: contentTopU, contentBottom: contentBottomU, pageW, pageH, HEADER_H, FOOTER_H, useHeader, useFooter, useLogo, useWatermark, anyChrome };
      }

      if (useFooter) {
        const footerImg = await this.loadAssetImage('footer.png');
        if (footerImg) {
          doc.addImage(footerImg, 'PNG', 0, pageH - FOOTER_H + FOOTER_SHIFT, pageW, FOOTER_H, undefined, 'FAST');
        }
      }

      if (useHeader) {
        const headerImg = await this.loadAssetImage('header.png');
        if (headerImg) {
          doc.addImage(headerImg, 'PNG', 0, 0, pageW, HEADER_H, undefined, 'FAST');
        }
      }

      if (useLogo) {
        const logoImg = await this.loadAssetImage('logo.png');
        if (logoImg) {
          const logoSize = 18;
          doc.addImage(logoImg, 'PNG', pageW - STD_MARGIN - logoSize, useHeader ? Math.max(4, HEADER_H - logoSize - 2) : STD_MARGIN, logoSize, logoSize, undefined, 'FAST');
        }
      }

      let contentTop = STD_MARGIN + 4;
      let contentBottom = pageH - STD_MARGIN;
      if (useHeader) contentTop = HEADER_H + 6;
      else if (useLogo) contentTop = STD_MARGIN + 18;
      if (useFooter) contentBottom = pageH - (FOOTER_H - FOOTER_SHIFT) - 4;

      return { contentTop, contentBottom, pageW, pageH, HEADER_H, FOOTER_H, useHeader, useFooter, useLogo, useWatermark, anyChrome };
    },

    async downloadPartyLedgerPDF(party, opts, mode) {
      if (!party) return;
      this.showToast('Generating PDF...');

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const optsSafe = opts || { header: true, footer: true, logo: false, watermark: true };
        await this.loadAssetImage('watermark.png');
        await this.loadAssetImage('header.png');
        await this.loadAssetImage('footer.png');
        await this.loadAssetImage('logo.png');

        let chrome = await this.applyPageChrome(doc, optsSafe, 1, 'all');
        let y = chrome.contentTop;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('PARTY LEDGER', 8, y);

        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text((party.name || '') + (party.city ? '  •  ' + party.city : ''), 8, y);

        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text('Outstanding Balance:', 8, y);

        const bal = Number(party.balance || 0);
        doc.setTextColor(bal > 0 ? 220 : 5, bal > 0 ? 38 : 150, bal > 0 ? 38 : 105);
        doc.text(this.fmtMoney(bal) + ' PKR', 56, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated: ' + new Date().toLocaleString('en-GB'), chrome.pageW - 8, y, { align: 'right' });

        const ledgerChrono = [...(party.ledger || [])].reverse();
        const rows = ledgerChrono.map((e, i) => [
          String(i + 1),
          e.date || '',
          this.formatLedgerDesc(e),
          e.debit ? this.fmtMoney(e.debit) : '',
          e.credit ? this.fmtMoney(e.credit) : '',
          this.fmtMoney(e.balance)
        ]);

        const bottomMargin = chrome.pageH - chrome.contentBottom;
        const self = this;

        doc.autoTable({
          startY: y + 6,
          head: [['S#', 'Date', 'Description', 'Debit', 'Credit', 'Balance']],
          body: rows.length ? rows : [['—', '—', 'No entries yet', '', '', '']],
          theme: 'plain',
          styles: {
            fontSize: 8,
            cellPadding: 2.0,
            overflow: 'linebreak',
            textColor: [30, 41, 59],
            lineColor: [200, 210, 220],
            lineWidth: 0.15,
            fillColor: false
          },
          didParseCell: function (data) {
            if (data.section === 'body') {
              if (data.column.index === 3 && data.cell.raw) {
                data.cell.styles.textColor = [220, 38, 38];
              }
              if (data.column.index === 4 && data.cell.raw) {
                data.cell.styles.textColor = [5, 150, 105];
              }
            }
          },
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
            lineWidth: 0
          },
          alternateRowStyles: {
            fillColor: false
          },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 20 },
            2: { cellWidth: 84 },
            3: { cellWidth: 24, halign: 'right' },
            4: { cellWidth: 24, halign: 'right' },
            5: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
          },
          margin: { left: 8, right: 8, top: chrome.contentTop, bottom: Math.max(bottomMargin, 14) },
          willDrawPage: function (data) {
            if (data.pageNumber > 1 && optsSafe.watermark !== false) {
              self.drawWatermark(doc);
            }
          }
        });

        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 2; p <= totalPages; p++) {
          doc.setPage(p);
          await self.applyPageChrome(doc, optsSafe, p, 'over');
        }

        const safeName = (party.name || 'Party').replace(/[^a-z0-9]/gi, '_');
        const fname = 'Ledger_' + safeName + '_' + new Date().toISOString().slice(0, 10) + '.pdf';
        this.deliverPdf(doc, fname, mode || 'download');
        this.showToast(mode === 'print' ? 'Print dialog opened – set Margins to None' : 'Party Ledger PDF downloaded');
      } catch (err) {
        console.error(err);
        this.showToast('PDF generation failed');
      }
    },

    async downloadSingleEntryPDF(type, entry, opts, mode) {
      if (!entry) return;
      this.showToast('Generating PDF...');

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const chrome = await this.applyPageChrome(doc, opts || { header: true, footer: true, logo: false });
        let y = chrome.contentTop;

        const titles = {
          sale: 'LPG SALE ENTRY',
          purchase: 'LPG PURCHASE / LOADING ENTRY',
          payment: 'PAYMENT VOUCHER'
        };

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text(titles[type] || 'ENTRY', 14, y);

        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text('Single Transaction Document', 14, y);

        y += 12;

        const fields = [];
        if (type === 'sale' || type === 'purchase') {
          fields.push(['Date', entry.date || '—']);
          fields.push(['Bowser', entry.bowser || '—']);
          fields.push(['Party', entry.party || '—']);
          if (entry.city) fields.push(['City', entry.city]);
          if (entry.plant) fields.push(['Filling Plant', entry.plant]);
          fields.push(['Quantity (Ton)', String(entry.qty || '—')]);
          if (entry.rate) fields.push(['Rate', this.fmtMoney(entry.rate)]);
          fields.push(['Amount (PKR)', String(entry.amount || '—')]);
          if (entry.status) fields.push(['Status', entry.status]);
        } else if (type === 'payment') {
          fields.push(['Date', entry.date || '—']);
          fields.push(['Type', entry.type || '—']);
          fields.push(['Party', entry.party || '—']);
          fields.push(['Slip / Voucher', entry.slip || '—']);
          fields.push(['TID', entry.tid || '—']);
          fields.push(['From Party', entry.fromParty || '—']);
          fields.push(['To Party', entry.toParty || '—']);
          fields.push(['Bank / Account', entry.bank || '—']);
          fields.push(['Remarks', entry.remarks || '—']);
          fields.push(['Proof file', entry.proofName || (entry.proofData ? 'Attached' : '—')]);
          fields.push(['Amount (PKR)', this.fmtMoney(entry.amount)]);
        }

        fields.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.text(label, 20, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(String(value), 65, y);
          y += 8;
        });

        y += 6;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(20, y, chrome.pageW - 20, y);

        if (type === 'payment' && entry.proofData) {
          y += 8;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text('Transaction proof', 20, y);
          y += 4;
          try {
            const fmt = String(entry.proofData).indexOf('image/png') >= 0 ? 'PNG' : 'JPEG';
            doc.addImage(entry.proofData, fmt, 20, y, 80, 50);
          } catch (e) {}
        }

        const safe = (entry.party || entry.bowser || 'Entry').replace(/[^a-z0-9]/gi, '_');
        const fname = type + '_' + safe + '_' + (entry.date || 'doc') + '.pdf';
        this.deliverPdf(doc, fname, mode || 'download');
        this.showToast(mode === 'print' ? 'Print dialog opened' : 'Entry PDF downloaded');
      } catch (err) {
        console.error(err);
        this.showToast('PDF failed');
      }
    }

  };
}

window.createApp = createApp;
