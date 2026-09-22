// app.js – Main application
/**
 * MLG Advanced ERP – Main Application Module
 * Alpine.js reactive core + Auto Ledger engine
 */


function createApp() {
    const { fmt, fmtMoney, calcAmount, parseAmount, formatDateDisplay, today } = window.MLGHelpers;
    const { initialMaster, initialInventories, samplePurchases, sampleSales, samplePayments, sampleDiesel, sampleQuotations, createInitialParties } = window.MLGStore;

  return {
    // ========== UI State ==========
    section: 'dashboard',
    globalQuery: '',
    masterQuery: '',
    ledgerFilter: { q:'', month:'' },
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
    pdfOptions: { show: false, header: false, footer: false, watermark: true, type: null, data: null },

    titles: {
      dashboard: 'Dashboard',
      guide: 'Data Flow & Documents',
      parties: 'Parties & Ledgers',
      inventory: 'Inventory',
      purchase: 'LPG Purchase / Loading',
      sale: 'LPG Sale',
      payment: 'Payments',
      masterLedger: 'Master Ledger',
      diesel: 'Diesel & Cash',
      quotation: 'Quotations',
      reports: 'Reports',
      settings: 'Settings',
      master: 'Master Data'
    },

    nav: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
      { id: 'guide', label: 'Data Flow', icon: 'fas fa-route' },
      { id: 'parties', label: 'Parties & Ledgers', icon: 'fas fa-users' },
      { id: 'purchase', label: 'Purchase / Loading', icon: 'fas fa-truck-loading' },
      { id: 'sale', label: 'Sale', icon: 'fas fa-file-invoice-dollar' },
      { id: 'payment', label: 'Payments', icon: 'fas fa-money-bill-wave' },
      { id: 'masterLedger', label: 'Master Ledger', icon: 'fas fa-book' },
      { id: 'inventory', label: 'Inventory', icon: 'fas fa-warehouse' },
      { id: 'diesel', label: 'Diesel & Cash', icon: 'fas fa-gas-pump' },
      { id: 'quotation', label: 'Quotations', icon: 'fas fa-file-alt' },
      { id: 'reports', label: 'Reports', icon: 'fas fa-chart-pie' },
      { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
      { id: 'master', label: 'Master Data', icon: 'fas fa-database' }
    ],

    // ========== Business Data ==========
    master: JSON.parse(JSON.stringify(initialMaster)),
    inventories: JSON.parse(JSON.stringify(initialInventories)),
    parties: [],
    purchases: [...samplePurchases],
    sales: [...sampleSales],
    payments: [...(samplePayments||[])],
    dieselEntries: [...(sampleDiesel||[])],
    quotations: [...(sampleQuotations||[])],
    activeQuotation: null,
    quotationFilter: { q:'', party:'', month:'' },
    ledgerBank: 'ALL',
    purchaseFilter: { q:'', brand:'', bowser:'', party:'', city:'', plant:'', month:'', status:'' },
    saleFilter: { q:'', brand:'', bowser:'', party:'', city:'', plant:'', month:'', dealType:'' },
    paymentFilter: { q:'', type:'', party:'', bank:'' },
    dieselFilter: { q:'', type:'', bowser:'', location:'' },
    partyFilter: { q:'', city:'', outstanding:'' },
    invFilter: { q:'' },
    masterFilter: { q:'' },
    ledgerFilter: { q:'', tid:'' },
    report: {
      type: 'summary', from: '', to: '', party: '', bank: '', bowser: '', month: ''
    },
    settings: {
      company: 'Meer Logistics & Gas Energy',
      slogan: 'Your Trust, Our Priority',
      address: '',
      phone: '',
      email: '',
      website: '',
      defaultWatermark: true,
      defaultLetterhead: true
    },

    totals: {
      purchased: 1743.83,
      sold: 1744.73,
      stock: 312,
      soldOut: 0
    },

    // ========== Forms ==========
    purchaseForm: {
      showForm: false,
      addToStock: false,
      alsoCreateSale: false,
      saleRate: '',
      dealType: 'purchase',
      loadingDate: '', bowser: '', party: '', city: '', plant: '',
      qty: '', rate: '', amount: '', unloadDate: '', source: '', brand: '',
      tradingParty: 'MLG', remarks: '',
      narrOpts: { bowser: true, qty: true, loadedFrom: true, brand: false, city: false, rate: false, remarks: true },
      loadFroms: [],
      sources: [{ date: '', bowser: '', location: '', loadedParty: '', brand: '', city: '', qty: '', rate: '' }],
      splits: []
    },
    saleForm: {
      showForm: false,
      dealType: 'from_stock',
      date: '', bowser: '', party: '', city: '', plant: 'RPG STOCK - Karachi',
      qty: '', rate: '', amount: '', remarks: '', brand: '', source: '',
      linkedPurchaseId: '',
      loadFroms: [],
      splits: [
        { destType: 'party', party: '', city: '', qty: '', unloadDate: '' }
      ]
    },
    paymentForm: {
      showForm: false,
      showBowser: false, showTid: false, showSlip: false, showBank: false, showNote: false,
      date: '', type: 'Received', party: '', fromParty: '', toParty: 'MLG',
      slip: '', tid: '', bank: '', fromBank: '', amount: '', receiveAmount: '', remarks: '', proofName: '', proofData: '',
      lines: [{ party: '', bank: '', tid: '', slip: '', amount: '', note: '' }]
    },
    stockForm: {
      showForm: false,
      location: 'RPG Plant – STOCK', type: 'In', qty: '', notes: ''
    },
    dieselForm: {
      showForm: false,
      date: '', bowser: '', type: 'Diesel', description: '', boarder: 'Mand',
      unit: 'Drum', qty: '', rate: '', amount: '', remarks: ''
    },
    quotationForm: {
      showForm: false,
      quotationNo: '', referenceNo: '', date: '', party: '', city: '',
      subject: 'Quotation for Supply of LPG',
      body: '',
      product: 'LPG (Liquefied Petroleum Gas)',
      qty: '', unit: 'Metric Ton', rate: '', amount: '',
      validity: '7 days', delivery: 'As per agreed loading point',
      terms: 'Rate is exclusive of taxes unless stated. Quantity subject to weighbridge. Payment as per agreed terms.',
      status: 'Draft',
      usePermanentContact: true,
      address: '', phone: '', email: '', website: ''
    },

    masterSections: [
      { key: 'party', title: 'Parties' },
      { key: 'bowser', title: 'Bowsers' },
      { key: 'city', title: 'Cities' },
      { key: 'plant', title: 'Filling Plants / Boarders' },
      { key: 'bank', title: 'Banks / Accounts' },
      { key: 'source', title: 'Type / Origin of Goods / Brand' }
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
      this.tickClock();
      this._clockTimer = setInterval(() => this.tickClock(), 1000);
      this.loadAssetImage('watermark.png');
      this.loadAssetImage('header.png');
      this.loadAssetImage('footer.png');
      this.parties = createInitialParties(this.master.party);
      this.refreshDatalists();
      try {
        this.loadFromStorage();
        this.seedLedgersFromBooks();
        this.recalcTotals();
      } catch (e) { console.warn('init data', e); }
      if (!this.paymentForm.date) this.paymentForm.date = today();
      if (!this.paymentForm.toParty && this.paymentForm.type === 'Received') this.paymentForm.toParty = 'MLG';
      if (!this.paymentForm.lines || !this.paymentForm.lines.length) {
        this.paymentForm.lines = [this.blankPaymentLine()];
      }
    },

    seedLedgersFromBooks() {
      /* Ledgers rebuild from live Sale / Purchase / Payment saves. */
    },

    tickClock() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      const ss = String(now.getSeconds()).padStart(2,'0');
      this.clockNow = hh + ':' + mm + ':' + ss;
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
      if (type === 'stock') {
        this.purchaseForm.party = 'RPG Plant - STOCK';
        this.purchaseForm.splits = [
          { destType: 'stock', party: 'RPG Plant - STOCK', city: '', plant: '', qty: this.purchaseForm.qty || '', rate: '', unloadDate: '', origin: '' }
        ];
      } else {
        this.purchaseForm.party = '';
        this.purchaseForm.splits = [
          { destType: 'party', party: '', city: '', plant: '', qty: this.purchaseForm.qty || '', rate: '', unloadDate: '', origin: '' }
        ];
      }
    },

    addPurchaseSplit() {
      if (!this.purchaseForm.splits) this.purchaseForm.splits = [];
      this.purchaseForm.splits.push({ destType: 'party', party: '', city: '', plant: '', qty: '', rate: '', unloadDate: '', origin: '' });
      this.purchaseForm.dealType = this.purchaseForm.splits.length > 1 ? 'split' : this.purchaseForm.dealType;
    },
    blankPurchaseSource(copyDate) {
      const first = (this.purchaseForm.sources || [])[0] || {};
      return { date: copyDate || first.date || this.purchaseForm.loadingDate || '', bowser: '', location: '', loadedParty: '', brand: '', city: '', qty: '', rate: '' };
    },
    togglePurchaseDestinations() {
      this.purchaseForm.showDestinations = !this.purchaseForm.showDestinations;
      if (this.purchaseForm.showDestinations && (!this.purchaseForm.splits || !this.purchaseForm.splits.length)) {
        this.purchaseForm.splits = [
          { destType: this.purchaseForm.dealType === 'direct' ? 'party' : 'stock',
            party: this.purchaseForm.dealType === 'direct' ? '' : 'RPG Plant - STOCK',
            city: '', plant: '', qty: this.purchaseForm.qty || '', rate: '', unloadDate: '', origin: '' }
        ];
      }
    },
    /** Supplier name from sources for table / filters */
    purchaseLoadedPartyLabel(row) {
      if (!row) return '';
      if (row.loadedParty) return row.loadedParty;
      const parts = (row.sources || []).map(s => (s.loadedParty || '').trim()).filter(Boolean);
      return parts.length ? [...new Set(parts)].join(' + ') : '';
    },
    copyFirstSource(i) {
      const first = (this.purchaseForm.sources || [])[0];
      if (!first || !this.purchaseForm.sources[i]) return;
      const keepQty = this.purchaseForm.sources[i].qty;
      this.purchaseForm.sources[i] = { ...first };
      if (keepQty) this.purchaseForm.sources[i].qty = keepQty;
      this.recalcPurchaseFromSources();
    },
    sameAsFirst(i, field) {
      const first = (this.purchaseForm.sources || [])[0];
      if (!first || !this.purchaseForm.sources[i]) return;
      this.purchaseForm.sources[i][field] = first[field];
    },
    sourceLineAmount(src) {
      const q = parseFloat(src && src.qty) || 0;
      const r = parseFloat(src && src.rate) || 0;
      if (!q || !r) return '';
      return (q * r).toLocaleString('en-PK', { maximumFractionDigits: 0 });
    },
    addPurchaseSource() {
      if (!this.purchaseForm.sources || !this.purchaseForm.sources.length) {
        this.purchaseForm.sources = [this.blankPurchaseSource()];
        return;
      }
      const first = this.purchaseForm.sources[0] || {};
      this.purchaseForm.sources.push(this.blankPurchaseSource(first.date || this.purchaseForm.loadingDate || ''));
    },
    removePurchaseSource(i) {
      if (!this.purchaseForm.sources || this.purchaseForm.sources.length <= 1) return;
      this.purchaseForm.sources.splice(i, 1);
      this.recalcPurchaseFromSources();
    },
    syncSourceDates() {
      const d = this.purchaseForm.loadingDate;
      (this.purchaseForm.sources || []).forEach(s => { if (!s.date) s.date = d; });
    },
    purchaseSourceQty() {
      return (this.purchaseForm.sources || []).reduce((s, r) => s + (parseFloat(r.qty) || 0), 0);
    },
    recalcPurchaseFromSources() {
      const qty = this.purchaseSourceQty();
      this.purchaseForm.qty = qty || '';
      const rated = (this.purchaseForm.sources || []).filter(s => parseFloat(s.rate) && parseFloat(s.qty));
      if (rated.length) {
        const amt = rated.reduce((s, r) => s + (parseFloat(r.qty) * parseFloat(r.rate)), 0);
        this.purchaseForm.amount = Number(amt).toLocaleString('en-PK', { maximumFractionDigits: 0 });
        this.purchaseForm.rate = rated[0].rate;
      }
      const first = (this.purchaseForm.sources || [])[0] || {};
      this.purchaseForm.source = first.location || '';
      this.purchaseForm.brand = first.brand || '';
      this.purchaseForm.city = first.city || this.purchaseForm.city;
      this.purchaseForm.bowser = first.bowser || this.purchaseForm.bowser;
      this.purchaseForm.loadingDate = first.date || this.purchaseForm.loadingDate;
    },

    togglePaymentForm() { this.paymentForm.showForm = !this.paymentForm.showForm; },
    paymentSummary() {
      const rows = this.payments || [];
      const inn = rows.filter(p => p.type==='Received').reduce((s,p)=>s+(parseFloat(p.amount)||0),0);
      const out = rows.filter(p => p.type==='Made' || p.type==='Paid').reduce((s,p)=>s+(parseFloat(p.amount)||0),0);
      return { in: inn, out };
    },
    saleProfit(s) {
      const q=parseFloat(s.qty)||0, r=parseFloat(s.rate)||0, b=parseFloat(s.baseRate)||0;
      if (!q || !r || !b) return 0;
      return (r-b)*q;
    },
    saleProfitLabel(s) {
      if (!s.baseRate || !s.rate) return '';
      return Number(this.saleProfit(s)).toLocaleString('en-PK', {maximumFractionDigits:0});
    },
    shortLedgerWord(e) {
      if (!e) return '';
      const src = String(e.sourceType || '').toLowerCase();
      if (src === 'purchase') return 'Purchase';
      if (src === 'sale') return 'Sale';
      if (src === 'payment') {
        const raw = String(e.customerNarration || e.narration || '').toLowerCase();
        if (raw.includes('transfer') || raw.includes('direct')) return 'Transfer';
        if (raw.includes('paid') || raw.includes('made') || raw.includes('payment made')) return 'Paid';
        return 'Received';
      }
      const t = String(e.customerNarration || e.narration || '').toLowerCase();
      if (t.includes('purchase')) return 'Purchase';
      if (t.includes('sale')) return 'Sale';
      if (t.includes('transfer') || t.includes('direct')) return 'Transfer';
      if (t.includes('paid') || t.includes('made')) return 'Paid';
      if (t.includes('received') || t.includes('payment')) return 'Received';
      return '';
    },
    customerLedgerNarration(e) {
      return this.shortLedgerWord(e) || 'Entry';
    },
    toggleSaleForm() { this.saleForm.showForm = !this.saleForm.showForm; },
    resetSaleFilters() { this.saleFilter = { q:'', brand:'', bowser:'', party:'', city:'', plant:'', month:'', dealType:'' }; },
    saleSummary() {
      const rows = this.sales || [];
      const ton = rows.reduce((s,r)=>s+(parseFloat(r.qty)||0),0);
      const amount = rows.reduce((s,r)=>s+(parseAmount(r.amount)||0),0);
      const fromStock = rows.filter(r => r.dealType === 'from_stock').length;
      const direct = rows.filter(r => r.dealType !== 'from_stock').length;
      return { ton, amount, fromStock, direct };
    },
    linkablePurchases() {
      const used = new Set((this.sales||[]).map(s => String(s.linkedPurchaseId||'')).filter(Boolean));
      return (this.purchases||[]).filter(p => {
        const toParty = p.dealType === 'direct' || p.dealType === 'split' || (p.party && !String(p.party).toUpperCase().includes('STOCK'));
        return toParty && !used.has(String(p.id));
      }).slice(0, 40);
    },
    applyLinkedPurchase() {
      const id = this.saleForm.linkedPurchaseId;
      const p = (this.purchases||[]).find(x => String(x.id) === String(id));
      if (!p) return;
      this.saleForm.dealType = 'direct';
      this.saleForm.date = '';
      this.saleForm.bowser = p.bowser || '';
      this.saleForm.party = (p.party||'').split(' + ')[0].replace(/\s+\d+(\.\d+)?T$/,'') || p.party;
      this.saleForm.city = p.city || '';
      this.saleForm.plant = p.plant || '';
      this.saleForm.brand = p.brand || p.source || '';
      this.saleForm.qty = p.unloadQty || p.qty || '';
      this.saleForm.remarks = 'Linked purchase ' + (p.bowser||'') + ' / ' + (p.date||'');
      this.calcSale();
      this.showToast('Purchase trip fill ho gaya. Sirf sale rate likhein.');
    },
    createSaleFromPurchase(p, saleRate) {
      const party = (p.party||'').split(' + ')[0].replace(/\s+\d+(\.\d+)?T$/,'') || p.party;
      const qty = p.unloadQty || p.qty || '';
      const rec = {
        id: Date.now()+1,
        date: p.unloadDate || p.date,
        bowser: p.bowser,
        party,
        city: p.city || '',
        plant: p.plant || '',
        brand: p.brand || p.source || '',
        remarks: 'Auto from purchase ' + (p.bowser||''),
        qty,
        rate: saleRate || '',
        amount: saleRate ? calcAmount(qty, saleRate) : '',
        ratePending: !saleRate,
        dealType: 'direct',
        linkedPurchaseId: p.id
      };
      this.sales.unshift(rec);
      if (saleRate) {
        const n = this.rebuildLedgerNarration('Sale', rec, { bowser: true, qty: true, loadedFrom: false, brand: false, city: false, rate: false, remarks: true });
        this.postToLedger(party, n, parseAmount(rec.amount), 0, {
          qty, rate: saleRate, bowser: p.bowser, date: rec.date, sourceType: 'sale', sourceId: rec.id, customerNarration: n
        });
      }
      p.linkedSaleId = rec.id;
    },
    togglePurchaseForm() {
      this.purchaseForm.showForm = !this.purchaseForm.showForm;
    },
    resetPurchaseFilters() {
      this.purchaseFilter = { q:'', brand:'', bowser:'', party:'', city:'', plant:'', month:'', status:'' };
    },
    sheetDate(d) {
      if (!d) return '';
      if (/[A-Za-z]/.test(String(d)) && String(d).includes('-')) return d;
      return formatDateDisplay(d);
    },
    sheetUnloadQty(r) {
      if (r.unloadQty !== undefined && r.unloadQty !== null && r.unloadQty !== '') return r.unloadQty;
      if (r.status && String(r.status).toLowerCase().includes('route')) return '';
      return r.qty || '';
    },
    purchaseSummary() {
      const rows = this.purchases || [];
      const ton = rows.reduce((s, r) => s + (parseFloat(r.loadQty || r.qty) || 0), 0);
      const amount = rows.reduce((s, r) => s + (parseAmount(r.amount) || 0), 0);
      const pending = rows.filter(r => !r.unloadDate || String(r.status||'').toLowerCase().includes('route')).length;
      const ratePending = rows.filter(r => !r.rate || r.ratePending).length;
      return { ton, amount, pending, ratePending };
    },

    removePurchaseSplit(i) {
      if (!this.purchaseForm.splits || this.purchaseForm.splits.length <= 1) return;
      this.purchaseForm.splits.splice(i, 1);
    },

    purchaseSplitQtyTotal() {
      return (this.purchaseForm.splits || []).reduce((s, r) => s + (parseFloat(r.qty) || 0), 0);
    },

    addLoadFrom(formKey) {
      const f = this[formKey] || this.purchaseForm;
      if (!f.loadFroms) f.loadFroms = [];
      f.loadFroms.push({ location: '', city: '', qty: '' });
    },
    removeLoadFrom(formKey, i) {
      const f = this[formKey] || this.purchaseForm;
      if (!f.loadFroms) return;
      f.loadFroms.splice(i, 1);
    },
    addSaleSplit() {
      if (!this.saleForm.splits) this.saleForm.splits = [];
      this.saleForm.splits.push({ destType: 'party', party: '', city: '', qty: '', unloadDate: '' });
    },
    removeSaleSplit(i) {
      if (!this.saleForm.splits || this.saleForm.splits.length <= 1) return;
      this.saleForm.splits.splice(i, 1);
    },
    saleSplitQtyTotal() {
      return (this.saleForm.splits || []).reduce((s, r) => s + (parseFloat(r.qty) || 0), 0);
    },
    applyRowFilter(rows, f) {
      const q = (f.q || '').toLowerCase();
      return (rows || []).filter(r => {
        const blob = [r.date, r.bowser, r.party, r.city, r.plant, r.source, r.brand, r.qty, r.amount, r.status].join(' ').toLowerCase();
        if (q && !blob.includes(q)) return false;
        if (f.brand && r.brand !== f.brand && r.source !== f.brand) return false;
        if (f.bowser && r.bowser !== f.bowser) return false;
        if (f.party && r.party !== f.party) return false;
        if (f.city && r.city !== f.city) return false;
        if (f.plant && r.plant !== f.plant) return false;
        if (f.status && r.status !== f.status) return false;
        if (f.dealType && r.dealType !== f.dealType) return false;
        if (f.month) {
          const d = String(r.date || r.loadDate || '');
          if (!d.toLowerCase().includes(f.month.toLowerCase().slice(0,3))) return false;
        }
        return true;
      });
    },
    filteredPaymentRows() {
      const f = this.paymentFilter || {};
      const q = (f.q || '').toLowerCase();
      return (this.payments || []).filter(p => {
        const blob = [p.date, p.type, p.party, p.fromParty, p.toParty, p.bank, p.tid, p.slip, p.amount, p.remarks].join(' ').toLowerCase();
        if (q && !blob.includes(q)) return false;
        if (f.type && p.type !== f.type) return false;
        if (f.party && !blob.includes(f.party.toLowerCase())) return false;
        if (f.bank && String(p.bank||'') !== f.bank && !(p.lines||[]).some(l => l.bank === f.bank)) return false;
        return true;
      });
    },
    filteredDieselRows() {
      const f = this.dieselFilter || {};
      const q = (f.q || '').toLowerCase();
      return (this.dieselEntries || []).filter(d => {
        const blob = [d.date, d.bowser, d.type, d.location, d.amount, d.qty].join(' ').toLowerCase();
        if (q && !blob.includes(q)) return false;
        if (f.type && d.type !== f.type) return false;
        if (f.bowser && d.bowser !== f.bowser) return false;
        if (f.location && String(d.location||'') !== f.location) return false;
        return true;
      });
    },
    filteredPartyRows() {
      const f = this.partyFilter || {};
      const q = (f.q || this.partySearch || '').toLowerCase();
      return (this.parties || []).filter(p => {
        if (q && !((p.name||'').toLowerCase().includes(q) || (p.city||'').toLowerCase().includes(q))) return false;
        if (f.city && p.city !== f.city) return false;
        if (f.outstanding === 'yes' && !(Number(p.balance) > 0)) return false;
        if (f.outstanding === 'no' && Number(p.balance) > 0) return false;
        return true;
      });
    },
    reportRows() {
      const r = this.report || {};
      const inRange = (d) => {
        if (!d) return true;
        const s = String(d);
        if (r.month && !s.toLowerCase().includes(r.month.toLowerCase().slice(0,3))) return false;
        return true;
      };
      const matchParty = (name) => !r.party || String(name||'') === r.party;
      const matchBowser = (b) => !r.bowser || String(b||'') === r.bowser;
      const matchBank = (b) => !r.bank || String(b||'') === r.bank;
      const type = r.type || 'summary';
      if (type === 'purchases') {
        return (this.filteredPurchaseRows ? this.filteredPurchaseRows() : this.purchases).filter(x => inRange(x.date) && matchParty(x.party) && matchBowser(x.bowser))
          .map(x => ({ c1:x.date, c2:x.bowser, c3:x.party, c4:x.qty, c5:x.amount, c6:x.source||x.brand||'' }));
      }
      if (type === 'sales') {
        return (this.filteredSaleRows ? this.filteredSaleRows() : this.sales).filter(x => inRange(x.date) && matchParty(x.party) && matchBowser(x.bowser))
          .map(x => ({ c1:x.date, c2:x.bowser, c3:x.party, c4:x.qty, c5:x.amount, c6:x.plant||'' }));
      }
      if (type === 'pnl') {
        return this.sales.filter(x => inRange(x.date) && matchParty(x.party) && matchBowser(x.bowser))
          .map(x => ({ c1:x.date, c2:x.bowser, c3:x.party, c4:x.qty, c5:x.amount, c6: this.saleProfitLabel(x) }));
      }
      if (type === 'payments') {
        const rows = this.filteredPaymentRows ? this.filteredPaymentRows() : this.payments;
        return (rows||[]).filter(x => inRange(x.date) && matchParty(x.party||x.fromParty||x.toParty) && matchBank(x.bank))
          .map(x => ({ c1:x.date, c2:x.type, c3:x.party||x.fromParty||x.toParty||'', c4:x.bank||'', c5:x.tid||x.slip||'', c6:x.amount }));
      }
      if (type === 'diesel') {
        const rows = this.filteredDieselRows ? this.filteredDieselRows() : (this.dieselEntries||[]);
        return (rows||[]).filter(x => inRange(x.date) && matchBowser(x.bowser))
          .map(x => ({ c1:x.date, c2:x.type, c3:x.bowser, c4:x.location||'', c5:x.qty||'', c6:x.amount }));
      }
      if (type === 'outstanding') {
        return this.parties.filter(p => Number(p.balance) > 0 && matchParty(p.name))
          .map(p => ({ c1:p.name, c2:p.city||'', c3:p.last||'', c4:'', c5:p.balance, c6:'' }));
      }
      if (type === 'ledger') {
        return this.masterLedgerRows().filter(x => inRange(x.date) && matchBank(x.bank))
          .map(x => ({ c1:x.date, c2:x.description, c3:x.bank, c4:x.tid, c5:x.amount, c6:x.balance }));
      }
      if (type === 'monthly') {
        const map = {};
        const bump = (key, field, qty, amt) => {
          if (!map[key]) map[key] = { c1:key, c2:0, c3:0, c4:0, c5:0, c6:0 };
          map[key][field] += Number(qty||0);
          if (field === 'c2') map[key].c5 += parseAmount(amt);
          if (field === 'c3') map[key].c6 += parseAmount(amt);
        };
        this.purchases.filter(x => inRange(x.date) && matchParty(x.party)).forEach(x => bump(String(x.date).replace(/^[0-9]+-/,'').replace(/-[0-9]+$/,'' ) || x.date, 'c2', x.qty, x.amount));
        this.sales.filter(x => inRange(x.date) && matchParty(x.party)).forEach(x => bump(String(x.date).replace(/^[0-9]+-/,'').replace(/-[0-9]+$/,'') || x.date, 'c3', x.qty, x.amount));
        return Object.values(map);
      }
      // summary
      return [
        { c1:'Total Purchased (Ton)', c2:this.totals.purchased, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Total Sold (Ton)', c2:this.totals.sold, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Available Stock (Ton)', c2:this.totals.stock, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Purchase records', c2:this.purchases.length, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Sale records', c2:this.sales.length, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Payment records', c2:this.payments.length, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Parties', c2:this.parties.length, c3:'', c4:'', c5:'', c6:'' },
        { c1:'Outstanding parties', c2:this.parties.filter(p => Number(p.balance)>0).length, c3:'', c4:'', c5:this.parties.reduce((s,p)=>s+(Number(p.balance)||0),0), c6:'' }
      ];
    },
    reportHeaders() {
      const t = (this.report && this.report.type) || 'summary';
      const map = {
        summary: ['Metric','Value','','','Amount',''],
        monthly: ['Month','Purchase Ton','Sale Ton','','Purchase Amount','Sale Amount'],
        purchases: ['Date','Bowser','Party','Qty','Amount','Brand / Source'],
        sales: ['Date','Bowser','Party','Qty','Amount','Plant'],
        payments: ['Date','Type','Party','Bank','TID / Slip','Amount'],
        diesel: ['Date','Type','Bowser','Location','Qty','Amount'],
        outstanding: ['Party','City','Last','','Outstanding',''],
        ledger: ['Date','Description','Bank','TID','Amount','Balance'],
        pnl: ['Date','Bowser','Party','Qty','Amount','Profit'],
        stock: ['Location','Type','Qty','Status','','']
      };
      return map[t] || map.summary;
    },
    async downloadReportPDF(opts, mode) {
      opts = opts || this.pdfOptions || { header:false, footer:false, watermark:true };
      this.showToast('Generating PDF...');
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
        await this.loadAssetImage('watermark.png');
        await this.loadAssetImage('header.png');
        await this.loadAssetImage('footer.png');
        const HEADER_H = opts.header ? 210 * (438 / 2480) : 0;
        const FOOTER_H = opts.footer ? 210 * (229 / 2480) : 0;
        const contentTop = (HEADER_H || 14) + 6;
        const bottomMargin = (FOOTER_H || 14) + 4;
        const title = 'MLG Report — ' + ((this.report && this.report.type) || 'summary');
        const headers = [this.reportHeaders()];
        const body = (this.reportRows() || []).map(r => [r.c1,r.c2,r.c3,r.c4,r.c5,r.c6].map(v => v==null?'':String(v)));
        const self = this;
        doc.autoTable({
          startY: contentTop + 10,
          margin: { top: contentTop, left: 12, right: 12, bottom: bottomMargin },
          head: headers,
          body,
          theme: 'plain',
          styles: { fontSize: 8, textColor:[15,23,42], fillColor: false, lineColor:[203,213,225], lineWidth:0.12, cellPadding:1.6 },
          alternateRowStyles: { fillColor: false },
          headStyles: { fillColor:[15,39,68], textColor:255, lineWidth:0 },
          willDrawPage: function() {
            if (opts.watermark !== false) self.drawWatermark(doc);
          },
          didDrawPage: function() {
            const pageW = 210, pageH = 297;
            const HH = pageW * (438 / 2480);
            const FH = pageW * (229 / 2480);
            if (opts.footer && self._imgCache['footer.png']) {
              try { doc.addImage(self._imgCache['footer.png'], 'PNG', 0, pageH - FH, pageW, FH, undefined, 'FAST'); } catch (e) {}
            }
            if (opts.header && self._imgCache['header.png']) {
              try { doc.addImage(self._imgCache['header.png'], 'PNG', 0, 0, pageW, HH, undefined, 'FAST'); } catch (e) {}
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(15,23,42);
            doc.text(self.settings.company || 'Meer Logistics & Gas Energy', 14, contentTop - 2);
            doc.setFontSize(9);
            doc.text(title, 14, contentTop + 4);
          }
        });
        this.deliverPdf(doc, 'MLG-Report.pdf', mode || 'download');
      } catch (e) {
        console.warn(e);
        this.showToast('PDF generation failed');
      }
    },
    exportBackup() {
      const payload = { parties:this.parties, purchases:this.purchases, sales:this.sales, payments:this.payments, inventories:this.inventories, master:this.master, dieselEntries:this.dieselEntries, quotations:this.quotations, settings:this.settings };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)], {type:'application/json'}));
      a.download = 'mlg-erp-backup.json';
      a.click();
    },
    resetAllData() {
      if (!confirm('Delete all saved ERP data on this browser?')) return;
      localStorage.removeItem('mlg_erp_v7');
      location.reload();
    },
    filteredPurchaseRows() { return this.applyRowFilter(this.purchases || [], this.purchaseFilter || {}); },
    filteredSaleRows() { return this.applyRowFilter(this.sales || [], this.saleFilter || {}); },
    uniqueField(rows, key) {
      return [...new Set((rows || []).map(r => r[key]).filter(Boolean))];
    },
    filteredMasterLedgerRows() {
      let rows = this.masterLedgerRows();
      const q = (this.ledgerFilter && this.ledgerFilter.q || '').toLowerCase();
      const month = this.ledgerFilter && this.ledgerFilter.month;
      if (month) rows = rows.filter(r => String(r.date||'').toLowerCase().includes(month.toLowerCase().slice(0,3)));
      if (q) rows = rows.filter(r => [r.bank,r.tid,r.sender,r.receiver,r.description].join(' ').toLowerCase().includes(q));
      return rows;
    },
    masterLedgerTotals() {
      const rows = this.filteredMasterLedgerRows();
      const inn = rows.filter(r => r.amount>0).reduce((s,r)=>s+r.amount,0);
      const out = rows.filter(r => r.amount<0).reduce((s,r)=>s+Math.abs(r.amount),0);
      const bal = rows.length ? rows[rows.length-1].balance : 0;
      return { inn, out, bal };
    },
    setReportPreset(type, month) {
      this.report.type = type;
      if (month !== undefined) this.report.month = month;
      this.showToast('Report ready: ' + type);
    },
    filteredMasterList(key) {
      const q = (this.masterQuery||'').toLowerCase();
      return (this.master[key]||[]).filter(v => !q || String(v).toLowerCase().includes(q));
    },
    globalHits() {
      const q = (this.globalQuery||'').toLowerCase().trim();
      if (q.length < 2) return [];
      const hits = [];
      (this.purchases||[]).forEach(r => {
        const blob = [r.bowser,r.party,r.brand,r.city,r.plant].join(' ').toLowerCase();
        if (blob.includes(q)) hits.push({ id:'p'+r.id, section:'purchase', title: (r.bowser||'')+' '+ (r.party||''), sub: (r.date||'')+' purchase' });
      });
      (this.sales||[]).forEach(r => {
        const blob = [r.bowser,r.party,r.city,r.plant].join(' ').toLowerCase();
        if (blob.includes(q)) hits.push({ id:'s'+r.id, section:'sale', title: (r.bowser||'')+' '+ (r.party||''), sub: (r.date||'')+' sale' });
      });
      (this.payments||[]).forEach(r => {
        const blob = [r.party,r.bank,r.tid,r.slip].join(' ').toLowerCase();
        if (blob.includes(q)) hits.push({ id:'y'+r.id, section:'payment', title: (r.type||'')+' '+(r.party||''), sub: String(r.amount||'') });
      });
      (this.parties||[]).forEach(r => {
        if ((r.name||'').toLowerCase().includes(q)) hits.push({ id:r.id, section:'parties', title: r.name, sub: 'Party ledger' });
      });
      return hits.slice(0, 12);
    },
    paymentKind(type) {
      const t = String(type || '').toLowerCase();
      if (t === 'paid' || t === 'made') return 'Made';
      if (t === 'transfer') return 'Transfer';
      return 'Received';
    },

    masterLedgerRows() {
      const bank = this.ledgerBank;
      const rows = [];
      (this.payments || []).forEach(p => {
        const kind = this.paymentKind(p.type);
        const lines = (p.lines && p.lines.length) ? p.lines : [{
          party: p.toParty || p.party || '', bank: p.bank || '', tid: p.tid || '', amount: p.amount, note: p.remarks || ''
        }];
        lines.forEach(l => {
          const ourBank = kind === 'Made'
            ? (p.fromBank || l.bank || p.bank || 'Cash / Bank')
            : (l.bank || p.bank || 'Cash / Bank');
          if (kind === 'Transfer') return;
          if (bank !== 'ALL' && ourBank !== bank) return;
          const amt = parseFloat(l.amount || p.amount) || 0;
          const sender = p.fromParty || (kind === 'Received' ? (p.party || l.party || '') : 'MLG');
          const receiver = p.toParty || (kind === 'Made' ? (l.party || p.party || '') : 'MLG');
          rows.push({
            date: p.date,
            description: kind === 'Made' ? 'Paid' : 'Received',
            bank: ourBank,
            tid: l.tid || p.tid || '',
            sender,
            receiver,
            amountIn: kind === 'Received' ? amt : 0,
            amountOut: kind === 'Made' ? amt : 0
          });
        });
      });
      let bal = 0;
      return rows.map((r, i) => {
        bal += (r.amountIn || 0) - (r.amountOut || 0);
        return { serial: i + 1, ...r, amount: (r.amountIn || 0) - (r.amountOut || 0), balance: bal };
      });
    },

    onSplitTypeChange(row) {
      if (row.destType === 'stock') row.party = 'RPG Plant - STOCK';
      else if (row.party === 'RPG Plant - STOCK') row.party = '';
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
      const loadFrom = document.getElementById('loadFromList');
      if (loadFrom) {
        const merged = [...new Set([...(this.master.source || []), ...(this.master.plant || [])])];
        loadFrom.innerHTML = merged.map(v => `<option value="${v}">`).join('');
      }
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
        localStorage.setItem('mlg_erp_v7', JSON.stringify(payload));
      } catch (e) { console.warn('Storage save failed', e); }
    },

    loadFromStorage() {
      try {
        const raw = localStorage.getItem('mlg_erp_v7');
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
          ledger: [],
          isBank: !!(extra.isBank || String(partyName).indexOf('MLG • ') === 0)
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
        voucher: extra.voucher || extra.tid || extra.slip || '',
        narration: narration || '',
        customerNarration: extra.customerNarration || narration || '',
        bowser: extra.bowser || '',
        tid: extra.tid || '',
        fromParty: extra.fromParty || '',
        toParty: extra.toParty || '',
        qty: extra.qty != null && extra.qty !== '' ? String(extra.qty) : '',
        rate: extra.rate != null && extra.rate !== '' ? String(extra.rate) : '',
        baseRate: extra.baseRate || '',
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
      const sources = (row.sources && row.sources.length) ? row.sources.map(s => ({
        date: s.date || '', bowser: s.bowser || '', location: s.location || '',
        loadedParty: s.loadedParty || row.loadedParty || row.party || '',
        brand: s.brand || '', city: s.city || '', qty: s.qty || '', rate: s.rate || ''
      })) : [{
        date: row.date || '', bowser: row.bowser || '', location: row.source || row.plant || '',
        loadedParty: row.loadedParty || row.party || '',
        brand: row.brand || '', city: row.city || '', qty: row.loadQty || row.qty || '', rate: row.rate || ''
      }];
      this.purchaseForm = {
        showForm: true,
        addToStock: !!(row.addToStock || row.dealType === 'stock'),
        dealType: 'purchase',
        loadingDate: row.date || '',
        bowser: row.bowser || '',
        party: row.loadedParty || row.party || '',
        city: row.city || '',
        plant: row.plant || row.source || '',
        source: row.source || row.plant || '',
        brand: row.brand || '',
        qty: row.loadQty || row.qty || '',
        rate: row.rate || '',
        amount: row.amount || '',
        remarks: row.remarks || '',
        tradingParty: row.tradingParty || 'MLG',
        sources,
        splits: [],
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
      const first = (row.lines && row.lines[0]) || {};
      const kind = this.paymentKind(row.type);
      const amt = first.amount || row.amount || '';
      this.paymentForm = {
        showForm: true,
        date: row.date || today(),
        type: kind,
        party: row.fromParty || row.party || '',
        fromParty: row.fromParty || (kind === 'Received' ? (row.party || '') : (kind === 'Made' ? 'MLG' : '')),
        toParty: row.toParty || first.party || (kind === 'Received' ? 'MLG' : (row.party || '')),
        slip: first.slip || row.slip || '',
        tid: first.tid || row.tid || '',
        bank: first.bank || row.bank || '',
        fromBank: row.fromBank || '',
        amount: amt,
        receiveAmount: amt,
        remarks: row.remarks || '',
        proofName: row.proofName || '',
        proofData: row.proofData || '',
        editingId: row.id,
        lines: [{
          party: first.party || row.toParty || row.party || '',
          bank: first.bank || row.bank || '',
          tid: first.tid || row.tid || '',
          slip: first.slip || row.slip || '',
          amount: amt,
          note: first.note || ''
        }]
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
      return this.shortLedgerWord(e) || 'Entry';
    },

    ledgerVoucher(e) {
      if (!e) return '—';
      return e.voucher || e.tid || e.slip || '—';
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

    rebuildLedgerNarration(kind) {
      const k = String(kind || '').toLowerCase();
      if (k.includes('purchase')) return 'Purchase';
      if (k.includes('sale')) return 'Sale';
      if (k.includes('transfer')) return 'Transfer';
      if (k.includes('made') || k.includes('paid')) return 'Paid';
      if (k.includes('received') || k.includes('payment')) return 'Received';
      return kind || 'Entry';
    },

    savePurchase() {
      const f = this.purchaseForm;
      this.recalcPurchaseFromSources();
      const sources = (f.sources || []).map(s => ({
        date: s.date || f.loadingDate || '',
        bowser: s.bowser || f.bowser || '',
        location: (s.location || '').trim(),
        loadedParty: (s.loadedParty || '').trim(),
        brand: s.brand || '',
        city: s.city || '',
        qty: s.qty,
        rate: s.rate || ''
      })).filter(s => s.location || parseFloat(s.qty) || s.bowser || s.loadedParty);
      if (!sources.length && (f.source || f.qty)) {
        sources.push({ date: f.loadingDate, location: f.source || '', loadedParty: '', brand: f.brand || '', city: f.city || '', qty: f.qty, rate: f.rate || '' });
      }
      const loadQty = sources.reduce((s, r) => s + (parseFloat(r.qty) || 0), 0) || (parseFloat(f.qty) || 0);
      f.bowser = f.bowser || (sources[0] && sources[0].bowser) || '';
      f.loadingDate = f.loadingDate || (sources[0] && sources[0].date) || '';
      if (!f.loadingDate || !f.bowser || !loadQty) {
        this.showToast('Loading date, bowser aur qty zaroori hain.');
        return;
      }
      f.qty = loadQty;
      f.source = (sources[0] && sources[0].location) || f.source;
      f.brand = sources.map(s => s.brand).filter(Boolean).join(' + ') || f.brand;
      const loadedPartyLabel = [...new Set(sources.map(s => (s.loadedParty || '').trim()).filter(Boolean))].join(' + ');
      const rate = f.rate || (sources[0] && sources[0].rate) || '';
      const addToStock = !!f.addToStock;

      if (f.editingId) {
        const old = this.purchases.find(x => x.id === f.editingId);
        if (old) {
          this.removeLedgerBySource('purchase', old.id);
          this.removeStockBySource(old.id);
          this.purchases = this.purchases.filter(x => x.id !== old.id);
        }
      }

      const rec = {
        id: Date.now(),
        date: formatDateDisplay(f.loadingDate) || f.loadingDate,
        loadDate: formatDateDisplay(f.loadingDate) || f.loadingDate,
        bowser: f.bowser,
        party: loadedPartyLabel || '',
        loadedParty: loadedPartyLabel || '',
        city: (sources[0] && sources[0].city) || f.city || '',
        plant: f.source || '',
        source: f.source || '',
        brand: f.brand || (sources[0] && sources[0].brand) || '',
        remarks: f.remarks || '',
        qty: loadQty,
        loadQty: loadQty,
        unit: 'Ton',
        rate: rate,
        amount: rate ? calcAmount(loadQty, rate) : (f.amount || ''),
        status: 'Loaded',
        ratePending: !rate,
        dealType: addToStock ? 'stock' : 'purchase',
        addToStock,
        tradingParty: f.tradingParty || 'MLG',
        sources,
        splits: []
      };
      this.purchases.unshift(rec);

      /* Loaded Party (supplier) → CREDIT only. Unload/sale = Sale menu. */
      const narrOpts = f.narrOpts || { bowser: true, qty: true, loadedFrom: true, brand: false, city: false, rate: false, remarks: true };
      let supplierPosted = 0;
      sources.forEach(src => {
        const partyName = (src.loadedParty || '').trim();
        if (!partyName) return;
        const q = parseFloat(src.qty) || 0;
        const srcRate = src.rate || rate || '';
        const lineAmt = srcRate ? calcAmount(q, srcRate) : '';
        const narrPayload = {
          bowser: src.bowser || f.bowser,
          qty: src.qty,
          source: src.location || f.source,
          location: src.location || f.source,
          brand: src.brand || f.brand,
          city: src.city || f.city,
          rate: srcRate,
          remarks: f.remarks || ''
        };
        const narr = this.rebuildLedgerNarration('Purchase', narrPayload, narrOpts);
        this.postToLedger(
          partyName,
          narr,
          0,
          parseAmount(lineAmt),
          {
            qty: src.qty, rate: srcRate, bowser: src.bowser || f.bowser, date: src.date || f.loadingDate,
            sourceType: 'purchase', sourceId: rec.id,
            customerNarration: narr
          }
        );
        supplierPosted++;
        if (!this.master.party.some(n => String(n).toLowerCase() === partyName.toLowerCase())) {
          this.master.party.push(partyName);
          this.refreshDatalists();
        }
      });

      if (addToStock) {
        this.applyStockMove(
          'In',
          loadQty,
          `${f.bowser} – ${loadQty}T purchase to stock` + (f.source ? ` from ${f.source}` : ''),
          formatDateDisplay(f.loadingDate),
          rec.id
        );
      }

      this.showToast(
        supplierPosted
          ? ('Purchase saved — supplier CREDIT' + (addToStock ? ' + stock IN' : ''))
          : (addToStock ? 'Purchase + stock IN (Loaded Party set karein for ledger)' : 'Purchase saved (Loaded Party set karein for supplier ledger)')
      );
      this.purchaseForm = {
        showForm: true,
        addToStock: false,
        alsoCreateSale: false,
        saleRate: '',
        dealType: 'purchase',
        loadingDate: '', bowser: '', party: '', city: '', plant: '',
        qty: '', rate: '', amount: '', unloadDate: '', source: '', brand: '', remarks: '', editingId: null,
        tradingParty: 'MLG',
        narrOpts: { bowser: true, qty: true, loadedFrom: true, brand: false, city: false, rate: false, remarks: true },
        sources: [{ date: '', bowser: '', location: '', loadedParty: '', brand: '', city: '', qty: '', rate: '' }],
        splits: []
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

      if (kind === 'purchase') {
        /* Update CREDIT on each Loaded Party (supplier) for this purchase */
        const suppliers = [];
        if (rec.sources && rec.sources.length) {
          rec.sources.forEach(s => { if ((s.loadedParty || '').trim()) suppliers.push((s.loadedParty || '').trim()); });
        }
        if (!suppliers.length && rec.loadedParty) suppliers.push(rec.loadedParty);
        const unique = [...new Set(suppliers)];
        unique.forEach(partyName => {
          const p = this.parties.find(x => (x.name || '').toLowerCase() === String(partyName).toLowerCase());
          if (!p || !p.ledger) return;
          const row = p.ledger.find(e =>
            String(e.sourceType || '') === 'purchase' &&
            String(e.sourceId || '') === String(rec.id)
          ) || p.ledger.find(e =>
            String(e.bowser || '') === String(rec.bowser || '') &&
            String(e.qty || '') === String(rec.qty || '') &&
            (Number(e.credit) >= 0) &&
            (!e.rate || (e.narration && e.narration.includes('Rate pending')))
          );
          if (row) {
            const oldCredit = Number(row.credit) || 0;
            row.rate = String(rate);
            row.credit = amt;
            row.narration = String(row.narration || '').replace(/\s*•\s*Rate pending/g, '') + ' • Rate updated';
            const diff = amt - oldCredit;
            p.balance = (Number(p.balance) || 0) - diff;
            row.balance = (Number(row.balance) || 0) - diff;
          }
        });
      } else {
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
        date: formatDateDisplay(f.date) || f.date,
        bowser: f.bowser,
        party: f.party,
        city: f.city,
        plant: f.plant,
        brand: f.brand || '',
        remarks: f.remarks,
        qty: f.qty,
        rate: f.rate || '',
        baseRate: f.baseRate || '',
        amount: f.rate ? calcAmount(f.qty, f.rate) : '',
        ratePending: !f.rate,
        dealType: f.dealType || 'direct',
        linkedPurchaseId: f.linkedPurchaseId || '',
        splits: f.splits || []
      };
      this.sales.unshift(rec);

      const saleNarr = this.rebuildLedgerNarration('Sale', {
        bowser: f.bowser, qty: f.qty, source: f.plant || f.source, brand: f.brand,
        city: f.city, rate: f.rate, remarks: f.remarks
      }, { bowser: true, qty: true, loadedFrom: !!f.plant, brand: !!f.brand, city: !!f.city, rate: false, remarks: !!f.remarks });
      /* Sale = customer DEBIT (they owe us) */
      this.postToLedger(f.party, saleNarr, parseAmount(rec.amount), 0, {
        qty: f.qty, rate: f.rate, bowser: f.bowser, date: f.date,
        sourceType: 'sale', sourceId: rec.id,
        customerNarration: saleNarr
      });

      const fromStock = f.dealType === 'from_stock' || (f.plant || '').toUpperCase().includes('RPG') || (f.plant || '').toUpperCase().includes('STOCK');
      if (fromStock) {
        this.applyStockMove('Out', f.qty, `Sale to ${f.party}` + (f.remarks ? ' • ' + f.remarks : ''), formatDateDisplay(f.date), rec.id);
      }

      this.showToast(rec.ratePending ? 'Sale ledger me • Rate pending' : 'Sale saved • Party Ledger auto-updated');
      this.saleForm = {
        showForm: true,
        dealType: f.dealType || 'from_stock',
        date: '', bowser: '', party: '', city: '',
        plant: fromStock ? 'RPG STOCK - Karachi' : '',
        qty: '', rate: '', amount: '', remarks: '', brand: '', source: '',
        linkedPurchaseId: '', editingId: null
      };
      this.recalcTotals();
      this.saveToStorage();
    },

    blankPaymentLine(bank) {
      return { party: '', bank: bank || '', tid: '', slip: '', amount: '', note: '' };
    },

    resetPaymentForm(type) {
      const lastBank = (this.paymentForm && this.paymentForm.bank) || '';
      const lastFromBank = (this.paymentForm && this.paymentForm.fromBank) || '';
      const keepType = this.paymentKind(type || (this.paymentForm && this.paymentForm.type) || 'Received');
      this.paymentForm = {
        showForm: true,
        date: today(),
        type: keepType,
        party: '',
        fromParty: keepType === 'Made' ? 'MLG' : '',
        toParty: keepType === 'Received' ? 'MLG' : '',
        slip: '', tid: '', bank: lastBank, fromBank: lastFromBank,
        amount: '', receiveAmount: '',
        remarks: '', proofName: '', proofData: '', editingId: null,
        lines: [this.blankPaymentLine(lastBank)]
      };
    },

    onPaymentTypeChange() {
      const t = this.paymentKind(this.paymentForm.type);
      this.paymentForm.type = t;
      if (t === 'Received') {
        if (!this.paymentForm.toParty || this.paymentForm.toParty === this.paymentForm.fromParty) this.paymentForm.toParty = 'MLG';
        if (this.paymentForm.fromParty === 'MLG') this.paymentForm.fromParty = '';
      } else if (t === 'Made') {
        if (!this.paymentForm.fromParty || this.paymentForm.fromParty === this.paymentForm.toParty) this.paymentForm.fromParty = 'MLG';
        if (this.paymentForm.toParty === 'MLG') this.paymentForm.toParty = '';
      } else {
        if (this.paymentForm.fromParty === 'MLG') this.paymentForm.fromParty = '';
        if (this.paymentForm.toParty === 'MLG') this.paymentForm.toParty = '';
      }
    },

    syncReceiveAmount() {
      this.paymentForm.receiveAmount = this.paymentForm.amount;
    },

    addPaymentLine() {},
    removePaymentLine() {},

    paymentLinesTotal() {
      return parseFloat(this.paymentForm.amount) || 0;
    },

    companyLedgerName(bank) {
      const b = String(bank || '').trim();
      return b ? ('MLG • ' + b) : 'MLG • Cash / Bank';
    },

    buildCustomerPaymentNarration(line, header, type) {
      return this.rebuildLedgerNarration(type || (header && header.type) || 'Received');
    },

    paymentRefNote() {
      return '';
    },

    normalizePaymentLines() {
      const f = this.paymentForm;
      const amount = parseFloat(f.receiveAmount || f.amount) || 0;
      if (!(amount > 0)) return [];
      return [{
        party: String(f.toParty || f.party || '').trim(),
        bank: String(f.bank || '').trim(),
        tid: String(f.tid || f.slip || '').trim(),
        slip: String(f.slip || f.tid || '').trim(),
        amount,
        note: String(f.remarks || '').trim()
      }];
    },

    findDuplicatePaymentTid(tid, excludeId) {
      const t = String(tid || '').trim().toLowerCase();
      if (!t) return null;
      return (this.payments || []).find(p => {
        if (excludeId && String(p.id) === String(excludeId)) return false;
        if (String(p.tid || '').trim().toLowerCase() === t) return p;
        return (p.lines || []).some(l => String(l.tid || '').trim().toLowerCase() === t);
      }) || null;
    },

    paymentTargetLabel(p) {
      if (!p) return '—';
      if (p.lines && p.lines.length) {
        const names = [];
        p.lines.forEach(l => {
          const n = l.party || p.toParty || p.party;
          if (n && names.indexOf(n) === -1) names.push(n);
        });
        if (names.length) return names.join(', ');
      }
      return p.toParty || (p.type === 'Made' || p.type === 'Received' ? p.party : '') || '—';
    },

    paymentFromLabel(p) {
      if (!p) return '—';
      if (p.fromParty) return p.fromParty;
      if (p.type === 'Received') return p.party || '—';
      if (p.type === 'Made') return p.fromParty || 'MLG';
      return p.party || '—';
    },

    savePayment() {
      const f = this.paymentForm;
      if (!f.date) {
        this.showToast('Date is required');
        return;
      }
      this.syncReceiveAmount();
      const amount = parseFloat(f.receiveAmount || f.amount) || 0;
      if (!(amount > 0)) {
        this.showToast('Amount is required');
        return;
      }

      const type = this.paymentKind(f.type || 'Received');
      const fromParty = String(f.fromParty || f.party || (type === 'Made' ? 'MLG' : '')).trim();
      const toParty = String(f.toParty || (type === 'Received' ? 'MLG' : '')).trim();
      const fromBank = String(f.fromBank || '').trim();
      const toBank = String(f.bank || '').trim();
      const tid = String(f.tid || f.slip || '').trim();
      const slip = String(f.slip || f.tid || '').trim();

      if (!fromParty) {
        this.showToast('Sender party is required');
        return;
      }
      if (!toParty) {
        this.showToast('Receiver is required');
        return;
      }
      if (type !== 'Transfer' && !fromBank && !toBank) {
        this.showToast('Add sender or receiver bank / title');
        return;
      }

      const dup = this.findDuplicatePaymentTid(tid, f.editingId);
      if (tid && dup) {
        this.showToast('TID ' + tid + ' already used on ' + (dup.date || 'another payment'));
        return;
      }

      if (f.editingId) {
        this.removeLedgerBySource('payment', f.editingId);
        this.payments = this.payments.filter(x => x.id !== f.editingId);
      }

      const note = String(f.remarks || '').trim();
      const payId = f.editingId || Date.now();
      const partyNameForLine = type === 'Received' ? fromParty : toParty;
      const filled = [{
        party: partyNameForLine,
        bank: toBank,
        tid, slip,
        amount,
        note
      }];

      this.payments.unshift({
        id: payId,
        date: f.date,
        type,
        party: type === 'Transfer' ? (fromParty + ' → ' + toParty) : (type === 'Received' ? fromParty : toParty),
        fromParty,
        toParty,
        slip,
        tid,
        bank: toBank,
        fromBank,
        amount,
        remarks: note,
        proofName: f.proofName || '',
        proofData: f.proofData || '',
        lines: filled
      });

      const word = this.rebuildLedgerNarration(type);
      const extraBase = {
        date: f.date,
        tid,
        voucher: tid || slip || '',
        fromParty,
        toParty,
        sourceType: 'payment',
        sourceId: payId,
        customerNarration: word
      };

      if (type === 'Received') {
        /* Party paid us: party CREDIT, our bank DEBIT */
        this.postToLedger(fromParty, word, 0, amount, extraBase);
        this.postToLedger(this.companyLedgerName(toBank || fromBank), word, amount, 0, { ...extraBase, isBank: true });
      } else if (type === 'Made') {
        /* We paid party: party DEBIT, our bank CREDIT */
        this.postToLedger(toParty, word, amount, 0, extraBase);
        this.postToLedger(this.companyLedgerName(fromBank || toBank), word, 0, amount, { ...extraBase, isBank: true });
      } else {
        /* Party-to-party: sender CREDIT, receiver DEBIT */
        this.postToLedger(fromParty, word, 0, amount, extraBase);
        this.postToLedger(toParty, word, amount, 0, extraBase);
      }

      this.showToast('Saved ' + fmtMoney(amount) + ' • ' + word + ' posted to ledgers');
      this.resetPaymentForm(type);
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
      if (!f.date) { this.showToast('Date required'); return; }
      const qty = parseFloat(f.qty) || 0;
      const rate = parseFloat(f.rate) || 0;
      const amount = f.amount || (qty && rate ? String(qty * rate) : (f.type==='Cash' ? f.qty : ''));
      const prev = (this.dieselEntries[0] && parseFloat(this.dieselEntries[0].gross)) || 0;
      const gross = prev + (parseFloat(amount) || 0);
      this.dieselEntries.unshift({
        id: Date.now(),
        date: f.date, bowser: f.bowser, type: f.type,
        description: f.description || f.type,
        boarder: f.boarder || f.location || '',
        location: f.boarder || f.location || '',
        unit: f.unit || (f.type==='Cash' ? 'PKR' : 'Drum'),
        qty: f.qty, rate: f.rate, amount, gross
      });
      this.showToast('Diesel / Cash saved');
      this.dieselForm = { showForm: true, date: f.date, bowser: '', type: f.type, description: '', boarder: f.boarder || 'Mand', unit: f.unit, qty: '', rate: '', amount: '', remarks: '' };
      this.saveToStorage();
    },
    dieselGross(rows) {
      return (rows||[]).reduce((s,r)=>s+(parseFloat(r.amount)||0),0);
    },
    nextQuotationNo() {
      const n = (this.quotations||[]).length + 1;
      return 'MLG-Q-' + new Date().getFullYear() + '-' + String(n).padStart(3,'0');
    },
    polishText(s) {
      if (!s) return '';
      let t = String(s).replace(/\s+/g,' ').trim();
      t = t.replace(/\s+,/g, ',').replace(/\s+\./g, '.');
      t = t.replace(/(^|[.!?]\s+)([a-z])/g, (_,a,b)=>a+b.toUpperCase());
      t = t.replace(/\bi\b/g,'I');
      return t;
    },
    polishQuotation() {
      const f = this.quotationForm;
      f.subject = this.polishText(f.subject);
      f.body = this.polishText(f.body);
      f.terms = this.polishText(f.terms);
      f.delivery = this.polishText(f.delivery);
      this.showToast('Wording polished');
    },
    calcQuotation() {
      const q=parseFloat(this.quotationForm.qty)||0, r=parseFloat(this.quotationForm.rate)||0;
      this.quotationForm.amount = q&&r ? (q*r).toLocaleString('en-PK',{maximumFractionDigits:0}) : '';
    },
    saveQuotation() {
      const f = this.quotationForm;
      if (!f.party || !f.subject) { this.showToast('Party and subject required'); return; }
      this.polishQuotation();
      const rec = {
        id: Date.now(),
        quotationNo: f.quotationNo || this.nextQuotationNo(),
        referenceNo: f.referenceNo || '',
        date: f.date || today(),
        party: f.party, city: f.city || '',
        subject: f.subject, body: f.body, product: f.product,
        qty: f.qty, unit: f.unit, rate: f.rate, amount: f.amount,
        validity: f.validity, delivery: f.delivery, terms: f.terms,
        status: f.status || 'Draft',
        address: f.usePermanentContact ? (this.settings.address||'') : (f.address||this.settings.address||''),
        phone: f.usePermanentContact ? (this.settings.phone||'') : (f.phone||this.settings.phone||''),
        email: f.usePermanentContact ? (this.settings.email||'') : (f.email||this.settings.email||''),
        website: f.usePermanentContact ? (this.settings.website||'') : (f.website||this.settings.website||'')
      };
      if (f.editingId) {
        this.quotations = this.quotations.filter(x => x.id !== f.editingId);
        rec.id = f.editingId;
      }
      this.quotations.unshift(rec);
      this.activeQuotation = rec;
      this.quotationForm.showForm = false;
      this.showToast('Quotation ' + rec.quotationNo + ' saved');
      this.saveToStorage();
    },
    openQuotation(q) { this.activeQuotation = q; },
    quoteContact(q, key) {
      if (!q) return this.settings[key] || '';
      return (q[key] != null && q[key] !== '') ? q[key] : (this.settings[key] || '');
    },
    savePermanentContact() {
      this.saveToStorage();
      this.showToast('Company contact saved permanently');
    },
    async downloadQuotationPDF(q, mode, opts) {
      q = q || this.activeQuotation;
      if (!q) { this.showToast('Select a quotation first'); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4', compress:true });
      await this.loadAssetImage('watermark.png');
      await this.loadAssetImage('header.png');
      await this.loadAssetImage('footer.png');
      const chrome = await this.applyPageChrome(doc, opts || { header:false, footer:false, watermark:true }, 1, 'all');
      const addr = this.quoteContact(q,'address');
      const phone = this.quoteContact(q,'phone');
      const email = this.quoteContact(q,'email');
      const web = this.quoteContact(q,'website');
      doc.setTextColor(15, 40, 90);
      doc.setFontSize(7.5);
      let hy = 12;
      const rx = 198;
      if (addr) { doc.text(addr, rx, hy, { align:'right', maxWidth: 78 }); hy += 4.2; }
      if (phone) { doc.text('Tel  ' + phone, rx, hy, { align:'right' }); hy += 3.8; }
      if (email) { doc.text(email, rx, hy, { align:'right' }); hy += 3.8; }
      if (web) { doc.text(web, rx, hy, { align:'right' }); }
      // content starts at 42mm — never inside the 4cm header band
      let y = Math.max(chrome && chrome.contentTop ? chrome.contentTop + 8 : 48, 48);
      doc.setTextColor(20, 30, 50);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('QUOTATION', 105, y, { align:'center' });
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(q.quotationNo || '', 18, y);
      doc.setFont(undefined, 'normal');
      doc.text(this.sheetDate(q.date), 192, y, { align:'right' });
      y += 7;
      doc.setFont(undefined, 'bold');
      doc.text('To:', 18, y);
      doc.setFont(undefined, 'normal');
      doc.text((q.party||'') + (q.city ? ', ' + q.city : ''), 28, y);
      y += 6;
      if (q.referenceNo) {
        doc.setFont(undefined, 'bold'); doc.text('Ref:', 18, y);
        doc.setFont(undefined, 'normal'); doc.text(String(q.referenceNo), 28, y);
        y += 6;
      }
      doc.setFont(undefined, 'bold'); doc.text('Subject:', 18, y);
      doc.setFont(undefined, 'normal');
      const sub = doc.splitTextToSize(q.subject || '', 160);
      doc.text(sub, 36, y);
      y += sub.length * 4.5 + 3;
      const body = doc.splitTextToSize(q.body || 'We are pleased to submit our quotation for supply of LPG as under.', 174);
      doc.text(body, 18, y);
      y += body.length * 4.5 + 6;
      doc.setDrawColor(180, 200, 220);
      doc.setLineWidth(0.2);
      doc.rect(18, y-5, 174, 16);
      doc.setFont(undefined, 'bold');
      doc.text('Product', 20, y);
      doc.text('Qty', 95, y);
      doc.text('Rate', 128, y);
      doc.text('Amount', 170, y);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.text(String(q.product||'LPG'), 20, y);
      doc.text(String(q.qty||'') + ' ' + String(q.unit||''), 95, y);
      doc.text(String(q.rate||''), 128, y);
      doc.text(String(q.amount||''), 170, y);
      y += 12;
      doc.setFont(undefined, 'bold'); doc.text('Delivery:', 18, y);
      doc.setFont(undefined, 'normal'); doc.text(String(q.delivery||''), 38, y, { maxWidth: 154 });
      y += 7;
      doc.setFont(undefined, 'bold'); doc.text('Validity:', 18, y);
      doc.setFont(undefined, 'normal'); doc.text(String(q.validity||''), 38, y);
      y += 8;
      const terms = doc.splitTextToSize('Terms: ' + (q.terms||''), 174);
      doc.text(terms, 18, y);
      y = Math.min(y + terms.length * 4.5 + 16, 250);
      doc.text('For Meer Logistics & Gas Energy', 192, y, { align:'right' });
      y += 16;
      doc.setFont(undefined, 'bold');
      doc.text('Authorized Signatory', 192, y, { align:'right' });
      this.deliverPdf(doc, (q.quotationNo||'quotation') + '.pdf', mode || 'download');
    },
    filteredQuotations() {
      const f = this.quotationFilter || {};
      const q = (f.q||'').toLowerCase();
      return (this.quotations||[]).filter(r => {
        const blob = [r.quotationNo,r.referenceNo,r.party,r.subject,r.date].join(' ').toLowerCase();
        if (q && !blob.includes(q)) return false;
        if (f.party && r.party !== f.party) return false;
        return true;
      });
    },

    // ========== PDF EXPORT (Header/Footer/Logo toggles + 6cm margins + page border) ==========
    _imgCache: {},

    async loadAssetImage(name) {
      if (this._imgCache[name]) return this._imgCache[name];
      const dataUrl = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth || img.width;
            c.height = img.naturalHeight || img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            resolve(c.toDataURL('image/png'));
          } catch (e) { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = './assets/' + name + '?v=letterhead2';
      });
      if (dataUrl) this._imgCache[name] = dataUrl;
      return dataUrl;
    },
    stampLetterhead(doc, opts) {
      opts = opts || {};
      const pageW = 210, pageH = 297;
      const HEADER_H = pageW * (438 / 2480);
      const FOOTER_H = pageW * (229 / 2480);
      if (opts.watermark !== false) this.drawWatermark(doc);
      if (opts.footer && this._imgCache['footer.png']) {
        try { doc.addImage(this._imgCache['footer.png'], 'PNG', 0, pageH - FOOTER_H, pageW, FOOTER_H, undefined, 'FAST'); } catch (e) {}
      }
      if (opts.header && this._imgCache['header.png']) {
        try { doc.addImage(this._imgCache['header.png'], 'PNG', 0, 0, pageW, HEADER_H, undefined, 'FAST'); } catch (e) {}
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
        header: false,
        footer: false,
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
      } else if (opts.type === 'quotation') {
        this.downloadQuotationPDF(opts.data, mode, opts);
      } else if (opts.type === 'register') {
        if (opts.data) this.report.type = opts.data;
        this.downloadReportPDF(opts, mode);
      } else if (opts.type === 'sale' || opts.type === 'purchase' || opts.type === 'payment') {
        this.downloadSingleEntryPDF(opts.type, opts.data, opts, mode);
      } else {
        this.downloadReportPDF(opts, mode);
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
      const nat = 1353 / 1447;
      let wmW = 190;
      let wmH = wmW * nat;
      if (wmH > pageH) { wmH = pageH; wmW = wmH / nat; }
      const x = (pageW - wmW) / 2;
      const y = (pageH - wmH) / 2;
      doc.addImage(wm, 'PNG', x, y, wmW, wmH, undefined, 'FAST');
    },

    async applyPageChrome(doc, opts, pageNumber, layer) {
      const pageW = 210;
      const pageH = 297;
      const STD_MARGIN = 14;
      const layerMode = layer || 'all';

      const HEADER_H = pageW * (438 / 2480);
      const FOOTER_H = pageW * (229 / 2480);
      const FOOTER_SHIFT = 0;
      const HEADER_LOGO = { x: 6.67, y: 7.44, size: 43.9 };

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

      // Logo option removed from PDFs. Header already carries the mark when checked.

      let contentTop = STD_MARGIN + 4;
      let contentBottom = pageH - STD_MARGIN;
      if (useHeader) contentTop = HEADER_H + 6;
      else if (useLogo) contentTop = HEADER_LOGO.y + HEADER_LOGO.size + 6;
      if (useFooter) contentBottom = pageH - (FOOTER_H - FOOTER_SHIFT) - 4;

      return { contentTop, contentBottom, pageW, pageH, HEADER_H, FOOTER_H, useHeader, useFooter, useLogo, useWatermark, anyChrome };
    },

    async downloadPartyLedgerPDF(party, opts, mode) {
      if (!party) return;
      this.showToast('Generating PDF...');

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const optsSafe = opts || { header: false, footer: false, logo: false, watermark: true };
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
        doc.setFontSize(10);
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
        const rows = ledgerChrono.map((e, i) => {
          const desc = this.formatLedgerDesc(e);
          /* Append bowser/qty only if not already in short desc — keep one clean line */
          const extra = [];
          if (e.bowser && !desc.toUpperCase().includes(String(e.bowser).toUpperCase())) extra.push(String(e.bowser));
          if (e.qty && !desc.includes(String(e.qty))) extra.push(String(e.qty) + ' MT');
          const fullDesc = extra.length ? (desc + ' • ' + extra.join(' • ')) : desc;
          return [
            String(i + 1),
            e.date || '',
            this.ledgerVoucher(e),
            fullDesc,
            e.debit ? this.fmtMoney(e.debit) : '',
            e.credit ? this.fmtMoney(e.credit) : '',
            this.fmtMoney(e.balance)
          ];
        });

        const bottomMargin = chrome.pageH - chrome.contentBottom;
        const self = this;
        /* A4 usable width ~194mm with 8mm margins */
        doc.autoTable({
          startY: y + 6,
          head: [['S#', 'Date', 'Voucher', 'Description', 'Debit', 'Credit', 'Balance']],
          body: rows.length ? rows : [['—', '—', '—', 'No entries yet', '', '', '']],
          theme: 'plain',
          styles: {
            font: 'helvetica',
            fontSize: 7.5,
            cellPadding: { top: 2, bottom: 2, left: 1.5, right: 1.5 },
            overflow: 'linebreak',
            cellWidth: 'wrap',
            valign: 'top',
            textColor: [30, 41, 59],
            lineColor: [200, 210, 220],
            lineWidth: 0.15,
            fillColor: false
          },
          didParseCell: function (data) {
            if (data.section === 'body') {
              if (data.column.index === 4 && data.cell.raw) {
                data.cell.styles.textColor = [220, 38, 38];
              }
              if (data.column.index === 5 && data.cell.raw) {
                data.cell.styles.textColor = [5, 150, 105];
              }
            }
          },
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7.5,
            lineWidth: 0,
            overflow: 'linebreak',
            valign: 'middle'
          },
          alternateRowStyles: {
            fillColor: false
          },
          columnStyles: {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 18, overflow: 'linebreak' },
            2: { cellWidth: 18, overflow: 'linebreak' },
            3: { cellWidth: 78, overflow: 'linebreak' },
            4: { cellWidth: 22, halign: 'right', overflow: 'linebreak' },
            5: { cellWidth: 22, halign: 'right', overflow: 'linebreak' },
            6: { cellWidth: 24, halign: 'right', fontStyle: 'bold', overflow: 'linebreak' }
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
        const chrome = await this.applyPageChrome(doc, opts || { header: false, footer: false, logo: false, watermark: true });
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
        doc.setFontSize(10);
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
          fields.push(['From', entry.fromParty || entry.party || '—']);
          fields.push(['To', this.paymentTargetLabel(entry)]);
          fields.push(['Lines', String((entry.lines && entry.lines.length) || 1)]);
          fields.push(['TID', entry.tid || '—']);
          fields.push(['Slip / Voucher', entry.slip || '—']);
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

        if (type === 'payment' && entry.lines && entry.lines.length) {
          y += 8;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text('Allocation lines (auto posted to both ledgers)', 20, y);
          y += 4;
          if (doc.autoTable) {
            doc.autoTable({
              startY: y,
              head: [['Party / Account', 'Bank', 'TID', 'Slip', 'Amount']],
              body: entry.lines.map(l => [
                l.party || '—',
                l.bank || '—',
                l.tid || '—',
                l.slip || '—',
                this.fmtMoney(l.amount)
              ]),
              theme: 'plain',
              styles: { fontSize: 8, fillColor: false, textColor:[15,23,42], lineColor:[203,213,225], lineWidth:0.12 },
              alternateRowStyles: { fillColor: false },
              headStyles: { fillColor: [15, 23, 42], textColor:255 },
              margin: { left: 20, right: 20 }
            });
            y = doc.lastAutoTable.finalY;
          }
        }

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
