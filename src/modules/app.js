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
    pdfOptions: { show: false, header: true, footer: true, logo: false, type: null, data: null },

    titles: {
      dashboard: 'Dashboard',
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
      loadingDate: '', bowser: '', party: '', city: '', plant: '',
      qty: '', rate: '', amount: '', unloadDate: '', source: ''
    },
    saleForm: {
      date: '', bowser: '', party: '', city: '', plant: '',
      qty: '', rate: '', amount: ''
    },
    paymentForm: {
      date: '', type: 'Received', party: '', fromParty: '', toParty: '',
      slip: '', tid: '', bank: '', amount: ''
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
      // Load from localStorage if exists (persistence)
      this.loadFromStorage();
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
        balance: newBalance
      });
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

    savePurchase() {
      const f = this.purchaseForm;
      if (!f.loadingDate || !f.bowser || !f.party || !f.qty) {
        this.showToast('Please fill required fields');
        return;
      }
      const status = f.unloadDate ? 'Delivered' : 'On Route';
      this.purchases.unshift({
        id: Date.now(),
        date: f.loadingDate,
        bowser: f.bowser,
        party: f.party,
        city: f.city,
        plant: f.plant,
        qty: f.qty,
        rate: f.rate,
        amount: f.amount,
        status
      });

      // Auto stock if going to RPG
      const isRpg = (f.party || '').toUpperCase().includes('RPG') || (f.party || '').toUpperCase().includes('STOCK');
      if (isRpg && status === 'Delivered') {
        const inv = this.inventories[0];
        inv.movements.unshift({
          date: formatDateDisplay(f.unloadDate || f.loadingDate),
          type: 'In',
          qty: f.qty,
          remarks: `${f.bowser} – ${f.source || 'Purchase'}`
        });
      }

      // Auto ledger if normal party (not stock)
      if (!isRpg) {
        const amt = parseAmount(f.amount);
        this.postToLedger(f.party, `Purchase / Loading • ${f.qty} MT`, amt, 0, {
          qty: f.qty, rate: f.rate, bowser: f.bowser, date: f.loadingDate
        });
      }

      this.showToast(status === 'Delivered'
        ? 'Purchase saved • Delivered + Ledger/Stock updated'
        : 'Purchase saved • On Route');
      this.purchaseForm = {
        loadingDate: '', bowser: '', party: '', city: '', plant: '',
        qty: '', rate: '', amount: '', unloadDate: '', source: ''
      };
      this.saveToStorage();
    },

    saveSale() {
      const f = this.saleForm;
      if (!f.date || !f.bowser || !f.party || !f.qty) {
        this.showToast('Please fill required fields');
        return;
      }
      const amt = parseAmount(f.amount);
      this.sales.unshift({
        id: Date.now(),
        date: f.date,
        bowser: f.bowser,
        party: f.party,
        city: f.city,
        plant: f.plant,
        qty: f.qty,
        rate: f.rate,
        amount: f.amount
      });

      // Auto Ledger – Debit party
      this.postToLedger(f.party, `Sale • ${f.qty} MT`, amt, 0, {
        qty: f.qty, rate: f.rate, bowser: f.bowser, date: f.date
      });

      // Stock reduce if from RPG
      if ((f.plant || '').toUpperCase().includes('RPG') || (f.plant || '').toUpperCase().includes('STOCK')) {
        const inv = this.inventories[0];
        inv.movements.unshift({
          date: formatDateDisplay(f.date),
          type: 'Out',
          qty: f.qty,
          remarks: `Sale to ${f.party}`
        });
      }

      this.showToast('Sale saved • Party Ledger auto-updated');
      this.saleForm = { date: '', bowser: '', party: '', city: '', plant: '', qty: '', rate: '', amount: '' };
      this.saveToStorage();
    },

    savePayment() {
      const f = this.paymentForm;
      const amt = parseFloat(f.amount) || 0;
      const tid = (f.tid || f.slip || '').trim();

      if (f.type === 'Transfer') {
        if (!f.date || !f.fromParty || !f.toParty || !f.amount) {
          this.showToast('Transfer: Date, From Party, To Party, Amount required');
          return;
        }
        this.payments.unshift({
          id: Date.now(),
          date: f.date,
          type: 'Transfer',
          party: f.fromParty + ' → ' + f.toParty,
          fromParty: f.fromParty,
          toParty: f.toParty,
          slip: f.slip,
          tid,
          bank: f.bank,
          amount: amt
        });
        this.postToLedger(
          f.fromParty,
          `Payment Received (sent to ${f.toParty})` + (tid ? ` • TID ${tid}` : ''),
          0, amt,
          { date: f.date, tid, fromParty: f.fromParty, toParty: f.toParty }
        );
        this.postToLedger(
          f.toParty,
          `Payment Made (from ${f.fromParty})` + (tid ? ` • TID ${tid}` : ''),
          amt, 0,
          { date: f.date, tid, fromParty: f.fromParty, toParty: f.toParty }
        );
        this.showToast('Slip transfer saved • both ledgers updated');
      } else {
        if (!f.date || !f.party || !f.amount) {
          this.showToast('Please fill required fields');
          return;
        }
        const fromParty = f.type === 'Received' ? f.party : (f.fromParty || 'Self');
        const toParty = f.type === 'Made' ? f.party : (f.toParty || 'Self');
        this.payments.unshift({
          id: Date.now(),
          date: f.date,
          type: f.type,
          party: f.party,
          fromParty,
          toParty,
          slip: f.slip,
          tid,
          bank: f.bank,
          amount: amt
        });
        if (f.type === 'Received') {
          this.postToLedger(
            f.party,
            `Payment Received` + (tid ? ` • TID ${tid}` : '') + (f.bank ? ` • ${f.bank}` : ''),
            0, amt,
            { date: f.date, tid, fromParty, toParty }
          );
        } else {
          this.postToLedger(
            f.party,
            `Payment Made` + (tid ? ` • TID ${tid}` : '') + (f.bank ? ` • ${f.bank}` : ''),
            amt, 0,
            { date: f.date, tid, fromParty, toParty }
          );
        }
        this.showToast('Payment saved • Party Ledger auto-updated');
      }

      this.paymentForm = {
        date: '', type: 'Received', party: '', fromParty: '', toParty: '',
        slip: '', tid: '', bank: '', amount: ''
      };
      this.saveToStorage();
    },

    adjustStock() {
      const inv = this.currentInv;
      if (!inv || !this.stockForm.qty) return;
      inv.movements.unshift({
        date: formatDateDisplay(new Date()),
        type: this.stockForm.type,
        qty: this.stockForm.qty,
        remarks: this.stockForm.notes || 'Manual adjustment'
      });
      this.showToast('Stock updated');
      this.stockForm.qty = '';
      this.stockForm.notes = '';
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

    openPdfOptions(type, data) {
      this.pdfOptions = {
        show: true,
        header: true,
        footer: true,
        logo: false,
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

    async applyPageChrome(doc, opts, pageNumber) {
      const pageW = 210;
      const pageH = 297;
      const STD_MARGIN = 14;
      const FIXED = 60; // 6cm

      const HEADER_H = pageW * (715 / 2600);   // ~57.75mm natural
      const FOOTER_H = pageW * (1555 / 2600);  // ~125.6mm natural full watermark
      const FOOTER_BAR_H = pageW * (436 / 2600); // ~35mm solid bar

      const useHeader = !!(opts && opts.header);
      const useFooter = !!(opts && opts.footer);
      const useLogo = !!(opts && opts.logo);
      const anyChrome = useHeader || useFooter || useLogo;

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
        // Side borders only, from 6cm top to 6cm bottom
        const sideTop = FIXED;
        const sideBottom = pageH - FIXED;
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.7);
        doc.line(3.5, sideTop, 3.5, sideBottom);           // left
        doc.line(pageW - 3.5, sideTop, pageW - 3.5, sideBottom); // right
        doc.setDrawColor(20, 184, 166);
        doc.setLineWidth(0.3);
        doc.line(4.6, sideTop, 4.6, sideBottom);
        doc.line(pageW - 4.6, sideTop, pageW - 4.6, sideBottom);
      }

      // Footer FIRST (watermark under content)
      if (useFooter) {
        const footerImg = await this.loadAssetImage('footer.png');
        if (footerImg) {
          doc.addImage(footerImg, 'PNG', -1, pageH - FOOTER_H, pageW + 2, FOOTER_H, undefined, 'FAST');
        }
      }

      // Header
      if (useHeader) {
        const headerImg = await this.loadAssetImage('header.png');
        if (headerImg) {
          // Slight horizontal bleed (-1mm … +1mm) removes hairline white gap on sides when printing
          doc.addImage(headerImg, 'PNG', -1, 0, pageW + 2, HEADER_H, undefined, 'FAST');
        }
      }

      // Logo
      if (useLogo) {
        const logoImg = await this.loadAssetImage('logo.png');
        if (logoImg) {
          const logoSize = 20;
          doc.addImage(logoImg, 'PNG', pageW - STD_MARGIN - logoSize, useHeader ? 5 : STD_MARGIN, logoSize, logoSize, undefined, 'FAST');
        }
      }

      // Content margins
      let contentTop = STD_MARGIN + 4;
      let contentBottom = pageH - STD_MARGIN;
      if (useHeader || useLogo) contentTop = FIXED;      // 6cm from top
      if (useFooter) contentBottom = pageH - FIXED;     // 6cm from bottom

      return { contentTop, contentBottom, pageW, pageH, HEADER_H, FOOTER_H, useHeader, useFooter, useLogo, anyChrome };
    },

    async downloadPartyLedgerPDF(party, opts, mode) {
      if (!party) return;
      this.showToast('Generating PDF...');

      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const optsSafe = opts || { header: true, footer: true, logo: false };

        // Draw chrome on page 1
        let chrome = await this.applyPageChrome(doc, optsSafe, 1);
        let y = chrome.contentTop;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('PARTY LEDGER', 14, y);

        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text((party.name || '') + (party.city ? '  •  ' + party.city : ''), 14, y);

        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text('Outstanding Balance:', 14, y);

        const bal = Number(party.balance || 0);
        doc.setTextColor(bal > 0 ? 220 : 5, bal > 0 ? 38 : 150, bal > 0 ? 38 : 105);
        doc.text(this.fmtMoney(bal) + ' PKR', 62, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated: ' + new Date().toLocaleString('en-GB'), chrome.pageW - 14, y, { align: 'right' });

        const ledgerChrono = [...(party.ledger || [])].reverse();
        const rows = ledgerChrono.map((e, i) => [
          String(i + 1),
          e.date || '',
          e.narration || '',
          this.getBowser(e),
          this.getTid(e),
          this.getFrom(e),
          this.getTo(e),
          this.getQty(e),
          this.getRate(e) ? this.fmtMoney(this.getRate(e)) : '',
          e.debit ? this.fmtMoney(e.debit) : '',
          e.credit ? this.fmtMoney(e.credit) : '',
          this.fmtMoney(e.balance)
        ]);

        const bottomMargin = chrome.pageH - chrome.contentBottom;
        const self = this;

        doc.autoTable({
          startY: y + 6,
          head: [['S#', 'Date', 'Desc / Narration', 'Bowser', 'TID', 'From', 'To', 'Qty', 'Rate', 'Debit', 'Credit', 'Balance']],
          body: rows.length ? rows : [['—', '—', 'No entries yet', '', '', '', '', '', '', '', '', '']],
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
            // Debit col 9 → red; Credit col 10 → green
            if (data.section === 'body') {
              if (data.column.index === 9 && data.cell.raw) {
                data.cell.styles.textColor = [220, 38, 38];
              }
              if (data.column.index === 10 && data.cell.raw) {
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
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 14 },
            2: { cellWidth: 32 },
            3: { cellWidth: 16 },
            4: { cellWidth: 18 },
            5: { cellWidth: 18 },
            6: { cellWidth: 18 },
            7: { cellWidth: 12, halign: 'right' },
            8: { cellWidth: 14, halign: 'right' },
            9: { cellWidth: 18, halign: 'right' },
            10: { cellWidth: 18, halign: 'right' },
            11: { cellWidth: 18, halign: 'right', fontStyle: 'bold' }
          },
          margin: { left: 14, right: 14, top: chrome.contentTop, bottom: Math.max(bottomMargin, 14) },
          didDrawPage: async function (data) {
            // Re-apply header/footer/border on every page (multi-page)
            if (data.pageNumber > 1) {
              // Note: autoTable calls this after page is added; we redraw chrome
              // Using sync image cache so no await needed on page 2+
            }
          }
        });

        // Redraw chrome on all pages (footer under content already on p1;
        // for extra pages need header/footer)
        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          doc.setPage(p);
          if (p > 1) {
            await self.applyPageChrome(doc, optsSafe, p);
          }
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
          fields.push(['Bank / Account', entry.bank || '—']);
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
