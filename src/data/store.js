// store.js
/**
 * MLG Advanced ERP – Central Data Store
 * All business data lives here. Designed for easy migration to real backend later.
 */

const initialMaster = {
  bowser: [
    'TMQ 013','JU 3050','JQ 2432','TMQ 588','TLX 297','TLX 586','TMP 012','TLX 288',
    'TAT 188','TMN 806','TMR 025','JQ 3148','TMP 200','TMU 062','TMP 010','TMP 100',
    'TMQ 015','TMP 017','TLF 863','TMN 006','NLA 026','TLX 645','TLA 701','TLH 912'
  ],
  party: [
    'Bugti Plant','VTR LPG','VTR Gas','Royal Gas','Zulfiqar LPG','Farhan Gas',
    'Bhatti Associates','Aziz Plant','Dilshad Enterprises','Al Macca Gas',
    'Jahanzaib Gas','NEW JAMALI','Arshad Gas','Lal Energy','Umar Energy',
    'Hussain Gas','Sachal Gas','RPG Plant - STOCK','Heaven Gas','Salam LPG'
  ],
  city: [
    'Karachi','Jamshoro','Multan','Sukkur','Qazi Ahmed','Liyyah','Nawabshah',
    'Kashmore','JACCOBABAD','Sadiqabad','Dogran'
  ],
  plant: [
    'Mand','BP 250','Allanaz - Karachi','Jamshoro - Bugti','RPG STOCK - Karachi',
    'Hothi Nisar BP 250','Salam Gas','Gwadar','Turbat','RPG Plant - STOCK'
  ],
  bank: [
    'MLG HBL Account','VTR Meezan Bank','VTR HBL Bank',
    'MBL Pak Rice Commission Agent','HBL Wakeel Ahmed Enterprises',
    'UBL Ibadat LPG PVT LTD','ASK Bank Wakeel Ahmed Enterprises',
    'ABL Pak Rice Commission Agent','BALH Ibadat Rice Mills',
    'BALF Ibadat Rice Mills','MCB Shabeer Ahmed Enterprises',
    'FB Saddam Enterprises','Meezan - Naik Muhammad Enterprises'
  ],
  source: [
    'Mehman bandar - Meer Gas','Bandar - Meer Gas','Aftab - Meer Gas',
    'bandar Abbas - Meer Gas','Asloia Aftab - Meer Gas','Bandar Asloia - Meer Gas',
    'Botan - Meer Gas','Jamshoro - Meer Gas'
  ]
};

const initialInventories = [
  {
    id: 'rpg',
    name: 'RPG Plant – STOCK',
    type: 'Stock',
    qty: 312.0,
    qtyLabel: '~ 312.0',
    status: 'Available',
    statusClass: 'bg-emerald-50 text-emerald-700',
    typeClass: 'bg-teal-50 text-teal-700',
    movements: [
      { date: '24-Jun-26', type: 'In', qty: '52.320', remarks: 'TMQ 013 – Bandar Botan' },
      { date: '22-Jun-26', type: 'In', qty: '48.240', remarks: 'TMP 010 – bandar Abbas' },
      { date: '18-Jun-26', type: 'In', qty: '47.750', remarks: 'TMQ 588 – Bandar Asloia' }
    ]
  }
  // Future inventories can be added here. System already supports multi-inventory UI.
];

const samplePurchases = [
  { id: 1, date: '1-Jun-26', brand: 'Mehman bandar - Meer Gas', unloadDate: '5-Jun-26', bowser: 'TMQ 013', party: 'Bugti Plant', city: 'Jamshoro', plant: 'Mand', unit: 'Ton', qty: '47.490', loadQty: '47.490', unloadQty: '47.490', baseRate: '', rate: '312200.00', amount: '14,826,378', status: 'Delivered' },
  { id: 2, date: '1-Jun-26', brand: 'Bandar - Meer Gas', unloadDate: '4-Jun-26', bowser: 'JU 3050', party: 'VTR Gas', city: 'Qazi Ahmed', plant: 'Mand', unit: 'Ton', qty: '48.470', loadQty: '48.470', unloadQty: '48.470', baseRate: '', rate: '312200.00', amount: '15,132,334', status: 'Delivered' },
  { id: 3, date: '2-Jun-26', brand: 'Aftab - Meer Gas', unloadDate: '6-Jun-26', bowser: 'JQ 2432', party: 'Zulfiqar LPG', city: 'Karachi', plant: 'Mand', unit: 'Ton', qty: '48.960', loadQty: '48.960', unloadQty: '48.960', baseRate: '', rate: '312200.00', amount: '15,285,312', status: 'Delivered' },
  { id: 4, date: '3-Jun-26', brand: 'bandar Abbas - Meer Gas', unloadDate: '6-Jun-26', bowser: 'TMQ 588', party: 'RPG Plant - STOCK', city: 'Karachi', plant: 'Mand', unit: 'Ton', qty: '50.420', loadQty: '50.420', unloadQty: '50.420', baseRate: '', rate: '312200.00', amount: '15,741,124', status: 'Delivered' },
  { id: 5, date: '4-Jun-26', brand: 'Asloia Aftab - Meer Gas', unloadDate: '7-Jun-26', bowser: 'TLX 297', party: 'Bugti Plant', city: 'Jamshoro', plant: 'BP 250', unit: 'Ton', qty: '46.845', loadQty: '46.845', unloadQty: '46.650', baseRate: '', rate: '314760.00', amount: '14,744,932', status: 'Delivered' },
  { id: 6, date: '5-Jun-26', brand: 'Jamshoro - Meer Gas', unloadDate: '5-Jun-26', bowser: 'TLF 863', party: 'Bhatti Associates', city: 'Multan', plant: 'Jamshoro - Bugti', unit: 'Ton', qty: '29.805', loadQty: '29.805', unloadQty: '29.805', baseRate: '4425', rate: '375000.00', amount: '11,176,875', status: 'Delivered' },
  { id: 7, date: '8-Jun-26', brand: 'Bandar Abbas - Meer Gas', unloadDate: '12-Jun-26', bowser: 'TLX 586', party: 'RPG Plant - STOCK', city: 'Karachi', plant: 'Mand', unit: 'Ton', qty: '48.500', loadQty: '48.500', unloadQty: '48.500', baseRate: '', rate: '312200.00', amount: '15,141,700', status: 'Delivered' },
  { id: 8, date: '10-Jun-26', brand: 'Mehman - Meer Gas', unloadDate: '13-Jun-26', bowser: 'TMQ 013', party: 'Bugti Plant', city: 'Jamshoro', plant: 'Mand', unit: 'Ton', qty: '49.980', loadQty: '49.980', unloadQty: '49.980', baseRate: '', rate: '312200.00', amount: '15,603,756', status: 'Delivered' }
];

const sampleSales = [
  { id: 1, date: '7-Jun-26', bowser: 'NLA 026', party: 'Aziz Plant', city: 'Sadiqabad', plant: 'RPG STOCK - Karachi', qty: '30.305', rate: '375424', amount: '11,377,216' },
  { id: 2, date: '4-Jun-26', bowser: 'NLA 026', party: 'Royal Gas', city: 'Sukkur', plant: 'RPG STOCK - Karachi', qty: '18.000', rate: '370763', amount: '6,673,729' },
  { id: 3, date: '13-Jun-26', bowser: 'NLA 026', party: 'Royal Gas', city: 'Sukkur', plant: 'RPG STOCK - Karachi', qty: '26.500', rate: '418000', amount: '11,077,000' }
];

/** Create parties with sample ledger for Aziz Plant (from real PDF) */
function createInitialParties(masterParties) {
  return masterParties.map((name, idx) => {
    const isAziz = name === 'Aziz Plant';
    return {
      id: 'p' + idx,
      name,
      city: isAziz ? 'Sadiqabad' : '',
      last: isAziz ? 'Sep-26' : '—',
      ledger: isAziz ? [
        { date: '7-Jun-26', narration: 'LPG Bowser NLA 026 • 30.305 T', debit: 11377216, credit: 0, balance: 11377216 },
        { date: '8-Jun-26', narration: 'UBL Ibadat LPG – Payment', debit: 0, credit: 5000000, balance: 6377216 },
        { date: '8-Jun-26', narration: 'UBL Ibadat LPG – Payment', debit: 0, credit: 5600000, balance: 777216 },
        { date: '29-Jun-26', narration: 'LPG Bowser NLA 026 • 25.795 T', debit: 9541964, credit: 0, balance: 10319180 },
        { date: '2-Jul-26', narration: 'US Gas – Payment', debit: 0, credit: 4541963, balance: 5777217 },
        { date: '16-Jul-26', narration: 'LPG Bowser NLA 026 • 31.01 T', debit: 10354186, credit: 0, balance: 16131403 },
        { date: '20-Jul-26', narration: 'Sale JU 3050 • 28.5 T', debit: 0, credit: 3200000, balance: 12931403 },
        { date: '22-Jul-26', narration: 'LPG Bowser TMQ 013 • 30.0 T', debit: 11250000, credit: 0, balance: 24181403 },
        { date: '25-Jul-26', narration: 'HBL Transfer – Payment', debit: 0, credit: 8000000, balance: 16181403 },
        { date: '28-Jul-26', narration: 'LPG Bowser JQ 2432 • 29.2 T', debit: 10950000, credit: 0, balance: 27131403 },
        { date: '1-Aug-26', narration: 'Meezan Bank – Payment', debit: 0, credit: 6500000, balance: 20631403 },
        { date: '5-Aug-26', narration: 'LPG Bowser TLX 297 • 31.5 T', debit: 11812500, credit: 0, balance: 32443903 },
        { date: '8-Aug-26', narration: 'Sale TMP 012 • 27.8 T', debit: 0, credit: 4100000, balance: 28343903 },
        { date: '12-Aug-26', narration: 'LPG Bowser TAT 188 • 30.1 T', debit: 11287500, credit: 0, balance: 39631403 },
        { date: '15-Aug-26', narration: 'UBL Ibadat LPG – Payment', debit: 0, credit: 9000000, balance: 30631403 },
        { date: '18-Aug-26', narration: 'LPG Bowser TMN 806 • 28.9 T', debit: 10837500, credit: 0, balance: 41468903 },
        { date: '22-Aug-26', narration: 'Cash / Adjustment', debit: 0, credit: 2500000, balance: 38968903 },
        { date: '26-Aug-26', narration: 'LPG Bowser TMR 025 • 32.0 T', debit: 12000000, credit: 0, balance: 50968903 },
        { date: '30-Aug-26', narration: 'US Gas – Payment', debit: 0, credit: 7500000, balance: 43468903 },
        { date: '3-Sep-26', narration: 'LPG Bowser JQ 3148 • 29.5 T', debit: 11062500, credit: 0, balance: 54531403 },
        { date: '7-Sep-26', narration: 'Sale TMP 200 • 26.0 T', debit: 0, credit: 3800000, balance: 50731403 },
        { date: '10-Sep-26', narration: 'LPG Bowser TMU 062 • 30.8 T', debit: 11550000, credit: 0, balance: 62281403 },
        { date: '14-Sep-26', narration: 'HBL Transfer – Payment', debit: 0, credit: 10000000, balance: 52281403 },
        { date: '17-Sep-26', narration: 'Purchase / Loading JU 3050 • 34.24 T', debit: 148183872, credit: 0, balance: 200465275 },
        { date: '17-Sep-26', narration: 'Purchase / Loading JQ 2432 • 21.2 T', debit: 496780944, credit: 0, balance: 697246219 },
        { date: '17-Sep-26', narration: 'Purchase / Loading JQ 2432 • 56.7678 T', debit: 497853606, credit: 0, balance: 1195099825 },
        { date: '17-Sep-26', narration: 'Purchase / Loading JU 3050 • 5.6 T', debit: 324184, credit: 0, balance: 1195424009 },
        { date: '17-Sep-26', narration: 'Purchase / Loading JQ 2432 • 32.1 T', debit: 103683, credit: 0, balance: 1195527692 },
        { date: '17-Sep-26', narration: 'Sale JU 3050 • 100 Ton', debit: 0, credit: 7000000, balance: 1188527692 },
        { date: '17-Sep-26', narration: 'Sale TMQ 013 • 50 Ton', debit: 0, credit: 3500000, balance: 1185027692 }
      ] : [],
      balance: isAziz ? 1185027692 : 0
    };
  });
}
window.MLGStore = { initialMaster, initialInventories, samplePurchases, sampleSales, createInitialParties };
