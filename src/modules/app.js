const MASTER = {
  parties: ["Bugti Plant","VTR LPG","VTR Gas","Royal Gas","Zulfiqar LPG","Farhan Gas","Bhatti Associates","Aziz Plant","Dilshad Enterprises","Al Macca Gas","Jahanzaib Gas","NEW JAMALI","Arshad Gas","Lal Energy","Umar Energy","Hussain Gas","Sachal Gas","RPG Plant - STOCK","Heaven Gas","Salam LPG","MLG","Al Macca"],
  bowsers: ["TMQ 013","JU 3050","JQ 2432","TMQ 588","TLX 297","TLX 586","TMP 012","TLX 288","TAT 188","TMN 806","TMR 025","JQ 3148","TMP 200","TMU 062","TMP 010","TMP 100","TMQ 015","TMP 017","TLF 863","TMN 006","NLA 026","TLX 645","TLA 701","TLH 912","TLY 407"],
  cities: ["Karachi","Jamshoro","Multan","Sukkur","Qazi Ahmed","Liyyah","Nawabshah","Kashmore","JACCOBABAD","Sadiqabad","Dogran"],
  plants: ["Mand","BP 250","Allanaz - Karachi","Jamshoro - Bugti","RPG STOCK - Karachi","Hothi Nisar BP 250","Salam Gas","Gwadar","Turbat","RPG Plant - STOCK","Taftan Border","Rum Flam Gas"],
  banks: ["MLG HBL Account","VTR Meezan Bank","VTR HBL Bank","MBL Pak Rice Commission Agent","HBL Wakeel Ahmed Enterprises","UBL Ibadat LPG PVT LTD","ASK Bank Wakeel Ahmed Enterprises","ABL Pak Rice Commission Agent","BALH Ibadat Rice Mills","BALF Ibadat Rice Mills","MCB Shabeer Ahmed Enterprises","FB Saddam Enterprises","Meezan - Naik Muhammad Enterprises"],
  brands: ["Mehman bandar - Meer Gas","Bandar - Meer Gas","Aftab - Meer Gas","bandar Abbas - Meer Gas","Bandar Abbas - Meer Gas","Asloia Aftab - Meer Gas","Bandar Asloia - Meer Gas","Botan - Meer Gas","Jamshoro - Meer Gas","Allanaz - Karachi","Meer Gas","Mehman - Meer Gas","Rum Flam Gas - Meer Gas","Bandar Aftab - Meer Gas"]
};

const PURCHASES = [
  {no:1, loadDate:"1-Jun-26", brand:"Mehman bandar - Meer Gas", unloadDate:"5-Jun-26", bowser:"TMQ 013", party:"Bugti Plant", city:"Jamshoro", plant:"Mand", unit:"Ton", loadQty:47.490, unloadQty:47.490, baseRate:"", rate:312200, amount:14826378, tradingParty:"MLG", loadedFrom:["Mand"]},
  {no:2, loadDate:"1-Jun-26", brand:"Bandar - Meer Gas", unloadDate:"4-Jun-26", bowser:"JU 3050", party:"VTR Gas", city:"Qazi Ahmed", plant:"Mand", unit:"Ton", loadQty:48.470, unloadQty:48.470, baseRate:"", rate:312200, amount:15132334, tradingParty:"MLG", loadedFrom:["Mand"]},
  {no:3, loadDate:"2-Jun-26", brand:"Aftab - Meer Gas", unloadDate:"6-Jun-26", bowser:"JQ 2432", party:"Zulfiqar LPG", city:"Karachi", plant:"Mand", unit:"Ton", loadQty:48.960, unloadQty:48.960, baseRate:"", rate:312200, amount:15285312, tradingParty:"MLG", loadedFrom:["Mand"]},
  {no:4, loadDate:"3-Jun-26", brand:"bandar Abbas - Meer Gas", unloadDate:"6-Jun-26", bowser:"TMQ 588", party:"RPG Plant - STOCK", city:"Karachi", plant:"Mand", unit:"Ton", loadQty:50.420, unloadQty:50.420, baseRate:"", rate:312200, amount:15741124, tradingParty:"MLG", loadedFrom:["Mand"]},
  {no:5, loadDate:"4-Jun-26", brand:"Asloia Aftab - Meer Gas", unloadDate:"7-Jun-26", bowser:"TLX 297", party:"Bugti Plant", city:"Jamshoro", plant:"BP 250", unit:"Ton", loadQty:46.845, unloadQty:46.650, baseRate:"", rate:314760, amount:14744932, tradingParty:"MLG", loadedFrom:["BP 250"]},
  {no:6, loadDate:"5-Jun-26", brand:"Jamshoro - Meer Gas", unloadDate:"5-Jun-26", bowser:"TLF 863", party:"Bhatti Associates", city:"Multan", plant:"Jamshoro - Bugti", unit:"Ton", loadQty:29.805, unloadQty:29.805, baseRate:4425, rate:375000, amount:11176875, tradingParty:"MLG", loadedFrom:["Jamshoro - Bugti"]},
  {no:7, loadDate:"8-Jun-26", brand:"Bandar Abbas - Meer Gas", unloadDate:"12-Jun-26", bowser:"TLX 586", party:"RPG Plant - STOCK", city:"Karachi", plant:"Mand", unit:"Ton", loadQty:48.500, unloadQty:48.500, baseRate:"", rate:312200, amount:15141700, tradingParty:"MLG", loadedFrom:["Mand","Taftan Border"]},
  {no:8, loadDate:"10-Jun-26", brand:"Mehman - Meer Gas", unloadDate:"13-Jun-26", bowser:"TMQ 013", party:"Bugti Plant", city:"Jamshoro", plant:"Mand", unit:"Ton", loadQty:49.980, unloadQty:49.980, baseRate:"", rate:312200, amount:15603756, tradingParty:"MLG", loadedFrom:["Mand"]},
  {no:9, loadDate:"13-Jun-26", brand:"Bandar Asloia - Meer Gas", unloadDate:"17-Jun-26", bowser:"TMR 025", party:"RPG Plant - STOCK", city:"Karachi", plant:"BP 250", unit:"Ton", loadQty:44.810, unloadQty:44.980, baseRate:"", rate:314760, amount:14104396, tradingParty:"MLG", loadedFrom:["BP 250","Mand"]},
  {no:10, loadDate:"16-Jun-26", brand:"Bandar Asloia - Meer Gas", unloadDate:"19-Jun-26", bowser:"JQ 3148", party:"RPG Plant - STOCK", city:"Karachi", plant:"BP 250", unit:"Ton", loadQty:41.430, unloadQty:41.450, baseRate:"", rate:314760, amount:13040507, tradingParty:"MLG", loadedFrom:["BP 250"]}
];

const SALES = [
  {no:1, loadDate:"10-Jun-26", brand:"Bandar - Meer Gas", unloadDate:"11-Jun-26", bowser:"JU 3050", party:"VTR Gas", city:"Qazi Ahmed", plant:"Mand", unit:"Ton", loadQty:20.000, unloadQty:20.000, baseRate:"", rate:325000, amount:6500000, loadedFrom:["RPG Plant - STOCK"]},
  {no:2, loadDate:"12-Jun-26", brand:"Aftab - Meer Gas", unloadDate:"14-Jun-26", bowser:"JQ 2432", party:"Zulfiqar LPG", city:"Karachi", plant:"Mand", unit:"Ton", loadQty:48.000, unloadQty:48.000, baseRate:"", rate:330000, amount:15840000, loadedFrom:["Mand","BP 250"]},
  {no:3, loadDate:"15-Jun-26", brand:"Jamshoro - Meer Gas", unloadDate:"16-Jun-26", bowser:"TLF 863", party:"Bhatti Associates", city:"Multan", plant:"Jamshoro - Bugti", unit:"Ton", loadQty:29.800, unloadQty:29.800, baseRate:"", rate:380000, amount:11324000, loadedFrom:["Jamshoro - Bugti"]},
  {no:4, loadDate:"18-Jun-26", brand:"Bandar Abbas - Meer Gas", unloadDate:"20-Jun-26", bowser:"TLX 288", party:"Royal Gas", city:"Sukkur", plant:"Allanaz - Karachi", unit:"Ton", loadQty:31.000, unloadQty:31.000, baseRate:"", rate:340000, amount:10540000, loadedFrom:["Allanaz - Karachi","Mand"]}
];

const PAYMENTS = [
  {serial:1, date:"1-Jun-26", bank:"MLG HBL Account", description:"Opening balance — MLG HBL Account", tid:"OB-001", sender:"—", receiver:"MLG HBL Account", amountIn:25000000, amountOut:0},
  {serial:2, date:"2-Jun-26", bank:"VTR Meezan Bank", description:"Opening balance — VTR Meezan Bank", tid:"OB-002", sender:"—", receiver:"VTR Meezan Bank", amountIn:8000000, amountOut:0},
  {serial:3, date:"3-Jun-26", bank:"VTR HBL Bank", description:"Opening balance — VTR HBL Bank", tid:"OB-003", sender:"—", receiver:"VTR HBL Bank", amountIn:5500000, amountOut:0},
  {serial:4, date:"5-Jun-26", bank:"MLG HBL Account", description:"Party receipt — VTR Gas / MLG HBL Account", tid:"TID-88421", sender:"VTR Gas", receiver:"MLG HBL Account", amountIn:6500000, amountOut:0},
  {serial:5, date:"6-Jun-26", bank:"MLG HBL Account", description:"Supplier payment — Bugti Plant / MLG HBL Account", tid:"TID-88490", sender:"MLG HBL Account", receiver:"Bugti Plant", amountIn:0, amountOut:14826378},
  {serial:6, date:"8-Jun-26", bank:"HBL Wakeel Ahmed Enterprises", description:"Transfer in — HBL Wakeel Ahmed Enterprises", tid:"TID-89011", sender:"Wakeel Ahmed Enterprises", receiver:"HBL Wakeel Ahmed Enterprises", amountIn:3200000, amountOut:0},
  {serial:7, date:"10-Jun-26", bank:"VTR Meezan Bank", description:"Sale receipt — Zulfiqar LPG / VTR Meezan Bank", tid:"TID-90102", sender:"Zulfiqar LPG", receiver:"VTR Meezan Bank", amountIn:4200000, amountOut:0},
  {serial:8, date:"12-Jun-26", bank:"MLG HBL Account", description:"Freight / diesel / MLG HBL Account", tid:"TID-90550", sender:"MLG HBL Account", receiver:"Diesel pump", amountIn:0, amountOut:185000},
  {serial:9, date:"14-Jun-26", bank:"UBL Ibadat LPG PVT LTD", description:"Party receipt — Royal Gas / UBL Ibadat LPG PVT LTD", tid:"TID-91120", sender:"Royal Gas", receiver:"UBL Ibadat LPG PVT LTD", amountIn:2100000, amountOut:0},
  {serial:10, date:"16-Jun-26", bank:"VTR HBL Bank", description:"Bank transfer — VTR HBL Bank to MLG HBL Account", tid:"TID-92001", sender:"VTR HBL Bank", receiver:"MLG HBL Account", amountIn:0, amountOut:1500000},
  {serial:11, date:"16-Jun-26", bank:"MLG HBL Account", description:"Bank transfer received — VTR HBL Bank / MLG HBL Account", tid:"TID-92001", sender:"VTR HBL Bank", receiver:"MLG HBL Account", amountIn:1500000, amountOut:0},
  {serial:12, date:"18-Jun-26", bank:"Meezan - Naik Muhammad Enterprises", description:"Receipt — Sachal Gas / Meezan - Naik Muhammad Enterprises", tid:"TID-93310", sender:"Sachal Gas", receiver:"Meezan - Naik Muhammad Enterprises", amountIn:1750000, amountOut:0}
];

let page = "purchases";
let modalTarget = null;
let editingPurchase = null;
let editingSale = null;
let ledgerBank = "ALL";
const PF = { q:"", month:"June 2026", brand:"", bowser:"", party:"", city:"", plant:"", loadedFrom:"" };
const SF = { q:"", month:"June 2026", brand:"", bowser:"", party:"", city:"", plant:"", loadedFrom:"" };

const TITLES = {
  dashboard:"Dashboard", dataflow:"Data Flow", ledgers:"Parties & Ledgers",
  purchases:"Purchase / Loading", purchaseForm:"LPG Purchase / Loading Entry",
  sales:"Sale", saleForm:"LPG Sale Entry",
  payments:"Payments", paymentForm:"Payment Entry",
  masterLedger:"Master Ledger — Meer Gas",
  inventory:"Inventory", diesel:"Diesel & Cash", master:"Master Data"
};

document.querySelectorAll(".nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    page = btn.dataset.page;
    render();
  };
});

function opts(list, selected="") { return list.map(x => `<option ${x===selected?"selected":""}>${esc(x)}</option>`).join(""); }
function esc(s){ return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;"); }
function money(n){ return Number(n||0).toLocaleString("en-PK"); }
function num(n){ return Number(n||0).toFixed(3); }
function uniqueFrom(arr, key){
  return [...new Set(arr.map(r => Array.isArray(r[key]) ? r[key].join(" + ") : r[key]).filter(Boolean))].sort();
}

function render() {
  document.getElementById("pageTitle").textContent = TITLES[page] || page;
  const v = document.getElementById("view");
  const map = {
    master: masterView, purchases: purchaseListView, purchaseForm: purchaseFormView,
    sales: saleListView, saleForm: saleFormView, payments: paymentListView,
    paymentForm: paymentFormView, masterLedger: masterLedgerView
  };
  v.innerHTML = map[page] ? map[page]() : `<div class="card"><h3>${TITLES[page]}</h3><p class="note">Listing columns purchase sheet jaisi simple rehti hain.</p></div>`;
}

function masterCard(title, key) {
  return `<div class="card"><div class="card-head"><h3>${title}</h3><button class="add-link" onclick="openModal('${key}','${title}')">+ Add New</button></div>
    <div class="pills">${MASTER[key].map((x,i)=>`<span class="pill">${esc(x)} <span class="x" onclick="removeMaster('${key}',${i})">✕</span></span>`).join("")}</div></div>`;
}
function masterView() {
  return `<div class="grid-2">
    ${masterCard("Parties","parties")}
    ${masterCard("Bowsers","bowsers")}
    ${masterCard("Cities","cities")}
    ${masterCard("Filling Plants / Boarders","plants")}
    ${masterCard("Banks / Accounts","banks")}
    ${masterCard("Type / Origin of Goods / Brand","brands")}
  </div>`;
}
function sheetHead(title) {
  return `<div class="sheet-logo">
    <img src="logo.png" alt="MLG" />
    <div><strong>MEER LOGISTICS &amp; GAS ENERGY</strong>
    <div class="co">Your trust, our priority · Logistics, gas, trade and import export</div></div>
  </div>
  <h3 style="margin:4px 0 8px">${title}</h3>`;
}

function applyListFilter(rows, f) {
  return rows.filter(r => {
    const blob = [r.no,r.loadDate,r.brand,r.unloadDate,r.bowser,r.party,r.city,r.plant,(r.loadedFrom||[]).join(" ")].join(" ").toLowerCase();
    if (f.q && !blob.includes(f.q.toLowerCase())) return false;
    if (f.month && f.month !== "All months") {
      const mon = f.month.split(" ")[0].slice(0,3);
      if (!String(r.loadDate).includes(mon) && !String(r.unloadDate).includes(mon)) return false;
    }
    if (f.brand && r.brand !== f.brand) return false;
    if (f.bowser && r.bowser !== f.bowser) return false;
    if (f.party && r.party !== f.party) return false;
    if (f.city && r.city !== f.city) return false;
    if (f.plant && r.plant !== f.plant) return false;
    if (f.loadedFrom && !(r.loadedFrom||[]).includes(f.loadedFrom) && r.plant !== f.loadedFrom) return false;
    return true;
  });
}

function listShell(kind, f, all, rows, title, body, addFn) {
  const loadT = rows.reduce((s,r)=>s+Number(r.loadQty||0),0);
  const unloadT = rows.reduce((s,r)=>s+Number(r.unloadQty||0),0);
  const amtT = rows.reduce((s,r)=>s+Number(r.amount||0),0);
  const setF = kind === "purchase" ? "setPF" : "setSF";
  const reset = kind === "purchase" ? "resetPF" : "resetSF";
  const dl = kind === "purchase" ? "downloadPurchases" : "downloadSales";
  return `<div class="filters">
    <div class="filters-top">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <input class="btn" style="min-width:220px" placeholder="Search any text..." value="${esc(f.q)}" oninput="${setF}(this,'q')" />
        <select class="btn" onchange="${setF}(this,'month')">${opts(["All months","May 2026","June 2026"], f.month)}</select>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="${reset}()">Clear filters</button>
        <button class="btn" onclick="${dl}()">Download</button>
        <button class="btn" onclick="window.print()">Print</button>
        <button class="btn green" onclick="${addFn}">+ Add New</button>
      </div>
    </div>
    <div class="filters-grid">
      <div class="field"><label>LPG/GAS Quality</label><select onchange="${setF}(this,'brand')"><option value="">All</option>${opts(uniqueFrom(all,"brand"),f.brand)}</select></div>
      <div class="field"><label>Bowser No</label><select onchange="${setF}(this,'bowser')"><option value="">All</option>${opts(uniqueFrom(all,"bowser"),f.bowser)}</select></div>
      <div class="field"><label>Party</label><select onchange="${setF}(this,'party')"><option value="">All</option>${opts(uniqueFrom(all,"party"),f.party)}</select></div>
      <div class="field"><label>City</label><select onchange="${setF}(this,'city')"><option value="">All</option>${opts(uniqueFrom(all,"city"),f.city)}</select></div>
      <div class="field"><label>Filling Plant</label><select onchange="${setF}(this,'plant')"><option value="">All</option>${opts(uniqueFrom(all,"plant"),f.plant)}</select></div>
      <div class="field"><label>Loaded From</label><select onchange="${setF}(this,'loadedFrom')"><option value="">All</option>${opts(MASTER.plants,f.loadedFrom)}</select></div>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><span>Records</span><b>${rows.length}</b></div>
    <div class="stat"><span>Load Qty (Ton)</span><b>${loadT.toFixed(3)}</b></div>
    <div class="stat"><span>Unload Qty (Ton)</span><b>${unloadT.toFixed(3)}</b></div>
    <div class="stat"><span>Amount (PKR)</span><b>${money(amtT)}</b></div>
    <div class="stat"><span>Parties</span><b>${new Set(rows.map(r=>r.party)).size}</b></div>
  </div>
  <div class="sheet-wrap">
    ${sheetHead(title)}
    <div class="note" style="margin-bottom:6px">${rows.length} of ${all.length} rows</div>
    <table class="data">
      <thead><tr>
        <th>No</th><th>Loading Date</th><th>LPG/GAS Quality</th><th>Unloading Date</th>
        <th>Bowser No</th><th>Party</th><th>City</th><th>Filling Plant</th>
        <th>Unit</th><th>Load Qty</th><th>Unload Qty</th><th>Base Rate</th>
        <th>Rate</th><th>Amount (PKR)</th><th>Actions</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}
function txRows(rows, arr, editFn, delFn) {
  return rows.map(r => {
    const i = arr.indexOf(r);
    return `<tr>
      <td>${r.no}</td><td>${r.loadDate}</td><td>${esc(r.brand)}</td><td>${r.unloadDate}</td>
      <td>${esc(r.bowser)}</td><td>${esc(r.party)}</td><td>${esc(r.city)}</td><td>${esc(r.plant)}</td>
      <td>${r.unit}</td><td>${num(r.loadQty)}</td><td>${num(r.unloadQty)}</td>
      <td>${r.baseRate||""}</td>
      <td>${Number(r.rate).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      <td>${money(r.amount)}</td>
      <td class="actions">
        <button onclick="${editFn}(${i})">Edit</button>
        <button class="del" onclick="${delFn}(${i})">Delete</button>
        <button onclick="downloadRow('${editFn}',${i})">Download</button>
      </td></tr>`;
  }).join("");
}
function purchaseListView(){ const rows=applyListFilter(PURCHASES,PF); return listShell("purchase",PF,PURCHASES,rows,"LPG PURCHASE - June 2026", txRows(rows,PURCHASES,"editPurchase","deletePurchase"), "openNewPurchase()"); }
function saleListView(){ const rows=applyListFilter(SALES,SF); return listShell("sale",SF,SALES,rows,"LPG SALE - June 2026", txRows(rows,SALES,"editSale","deleteSale"), "openNewSale()"); }
function setPF(el,key){ PF[key]=el.value; render(); }
function setSF(el,key){ SF[key]=el.value; render(); }
function resetPF(){ Object.keys(PF).forEach(k=>PF[k]=k==="month"?"June 2026":""); render(); }
function resetSF(){ Object.keys(SF).forEach(k=>SF[k]=k==="month"?"June 2026":""); render(); }
function openNewPurchase(){ editingPurchase=null; page="purchaseForm"; render(); }
function openNewSale(){ editingSale=null; page="saleForm"; render(); }

function locationRow(loc="", qty="") {
  return `<div class="loc-card"><div class="loc-grid">
    <div class="field"><label>Loaded From (Location) <span class="req">*</span></label>
      <select class="loc-name"><option value="">Plant, border, ya supplier</option>${opts(MASTER.plants, loc)}</select></div>
    <div class="field"><label>City</label><select class="loc-city"><option value=""></option>${opts(MASTER.cities)}</select></div>
    <div class="field"><label>Qty from here (Ton)</label><input class="loc-qty" type="number" step="0.001" value="${qty||""}" placeholder="Optional split" /></div>
    <button class="icon-btn" type="button" onclick="this.closest('.loc-card').remove()">×</button>
  </div></div>`;
}
function destinationRow(pref="") {
  return `<div class="dest-card">
    <div class="dest-grid">
      <div class="field"><label>Type</label><select class="d-type"><option>Company stock</option><option ${pref==="Party"?"selected":""}>Party</option></select></div>
      <div class="field"><label>Destination</label><select class="d-dest">${opts(MASTER.parties, pref==="Party"?"":"RPG Plant - STOCK")}</select></div>
      <div class="field"><label>City</label><select class="d-city"><option value=""></option>${opts(MASTER.cities)}</select></div>
      <div class="field"><label>Qty (Ton) <span class="req">*</span></label><input class="d-qty" type="number" step="0.001" oninput="updateAlloc()" /></div>
      <div class="field"><label>Unload date</label><input class="d-date" type="date" /></div>
      <button class="icon-btn" type="button" onclick="this.closest('.dest-card').remove();updateAlloc()">×</button>
    </div>
    <div class="field" style="margin-top:8px;max-width:320px"><label>Filling Plant</label>
      <select class="d-plant"><option value=""></option>${opts(MASTER.plants)}</select></div>
  </div>`;
}
function entryChrome(sale) {
  return `<div class="mode-row">
      <div class="mode active" id="modeA" onclick="setMode('A')">
        <h4>${sale?"Deliver to a party":"Place in company stock"}</h4>
        <p>${sale?"Load split ho sakta hai — multiple parties / locations.":"Pehle stock line. Hissa party ko jana ho to destination add karein."}</p>
      </div>
      <div class="mode" id="modeB" onclick="setMode('B')">
        <h4>${sale?"Split across locations / parties":"Deliver directly to a party"}</h4>
        <p>Loaded From bhi multiple plants / borders se ho sakta hai.</p>
      </div>
    </div>`;
}
function purchaseFormView() {
  const e = editingPurchase;
  return `<div class="entry-wrap">
    ${entryChrome(false)}
    <div class="section-label">1. LOADING</div>
    <div class="form-grid">
      <div class="field"><label>Loading Date <span class="req">*</span></label><input type="date" id="loadDate" /></div>
      <div class="field"><label>Bowser / Vehicle Number <span class="req">*</span></label>
        <select id="bowser"><option value="">Select</option>${opts(MASTER.bowsers, e?e.bowser:"")}</select></div>
      <div class="field"><label>Type / Origin of Goods / Brand <span class="req">*</span></label>
        <select id="brand"><option value="">Select</option>${opts(MASTER.brands, e?e.brand:"")}</select></div>
    </div>
    <div class="section-label">LOADED FROM (LOCATION) — multiple allowed</div>
    <p class="hint" style="margin:-4px 0 8px">Loading date ke baad. Ek load kai plants / borders se aa sakta hai.</p>
    <div id="locs">${locationRow(e&&e.loadedFrom?e.loadedFrom[0]:"")}</div>
    <div class="row-actions"><span class="note">Do jagah se load ho to + Add location.</span>
      <button class="add-link" type="button" onclick="addLocation()">+ Add location</button></div>
    <div class="form-grid">
      <div class="field"><label>Purchasing Party / Trading Party <span class="req">*</span></label>
        <select id="tradingParty"><option value="">Select</option>${opts(MASTER.parties, e?e.tradingParty:"MLG")}</select></div>
      <div class="field"><label>Load Qty (Ton) <span class="req">*</span></label>
        <input id="loadQty" type="number" step="0.001" value="${e?e.loadQty:""}" oninput="calcAmount()" /></div>
      <div class="field"><label>Rate (optional)</label>
        <input id="rate" type="number" step="0.01" placeholder="Blank if later" value="${e&&e.rate?e.rate:""}" oninput="calcAmount()" /></div>
      <div class="field"><label>Amount (auto)</label><input id="amount" disabled /></div>
    </div>
    <div class="section-label">2. DESTINATIONS — LOAD CAN SPLIT</div>
    <div id="dests">${destinationRow()}</div>
    <div class="row-actions"><span class="note" id="alloc">Allocated 0 T of loaded 0 T.</span>
      <button class="add-link" type="button" onclick="addDestination()">+ Add destination</button></div>
    <div class="field" style="margin:8px 0 16px"><label>Narration / Details</label><input id="narration" placeholder="Party ledger note" /></div>
    <button class="primary" onclick="savePurchase()">Save Purchase</button>
    <button class="btn" style="margin-left:8px" onclick="page='purchases';render()">Back to list</button>
  </div>`;
}
function saleFormView() {
  const e = editingSale;
  return `<div class="entry-wrap">
    ${entryChrome(true)}
    <div class="section-label">1. LOADING / SALE</div>
    <div class="form-grid">
      <div class="field"><label>Loading Date <span class="req">*</span></label><input type="date" id="loadDate" /></div>
      <div class="field"><label>Bowser / Vehicle Number <span class="req">*</span></label>
        <select id="bowser"><option value="">Select</option>${opts(MASTER.bowsers, e?e.bowser:"")}</select></div>
      <div class="field"><label>Type / Origin of Goods / Brand <span class="req">*</span></label>
        <select id="brand"><option value="">Select</option>${opts(MASTER.brands, e?e.brand:"")}</select></div>
    </div>
    <div class="section-label">LOADED FROM (LOCATION) — multiple allowed</div>
    <p class="hint" style="margin:-4px 0 8px">Sale ka load bhi kai stock / plant / border locations se nikal sakta hai.</p>
    <div id="locs">${locationRow(e&&e.loadedFrom?e.loadedFrom[0]:"")}</div>
    <div class="row-actions"><span class="note">Multiple locations se load ho to + Add location.</span>
      <button class="add-link" type="button" onclick="addLocation()">+ Add location</button></div>
    <div class="form-grid">
      <div class="field"><label>Load Qty (Ton) <span class="req">*</span></label>
        <input id="loadQty" type="number" step="0.001" value="${e?e.loadQty:""}" oninput="calcAmount()" /></div>
      <div class="field"><label>Rate</label>
        <input id="rate" type="number" step="0.01" value="${e&&e.rate?e.rate:""}" oninput="calcAmount()" /></div>
      <div class="field"><label>Amount (auto)</label><input id="amount" disabled /></div>
    </div>
    <div class="section-label">2. DESTINATIONS — LOAD CAN SPLIT</div>
    <p class="hint" style="margin:-4px 0 8px">Ek load do parties ya do cities par split ho sakta hai.</p>
    <div id="dests">${destinationRow("Party")}</div>
    <div class="row-actions"><span class="note" id="alloc">Allocated 0 T of loaded 0 T.</span>
      <button class="add-link" type="button" onclick="addDestination('Party')">+ Add destination</button></div>
    <div class="field" style="margin:8px 0 16px"><label>Narration / Details</label><input id="narration" placeholder="Party ledger note" /></div>
    <button class="primary" onclick="saveSale()">Save Sale</button>
    <button class="btn" style="margin-left:8px" onclick="page='sales';render()">Back to list</button>
  </div>`;
}
function setMode(m){
  document.getElementById("modeA").classList.toggle("active", m==="A");
  document.getElementById("modeB").classList.toggle("active", m==="B");
}
function addLocation(){ document.getElementById("locs").insertAdjacentHTML("beforeend", locationRow()); }
function addDestination(pref){ document.getElementById("dests").insertAdjacentHTML("beforeend", destinationRow(pref||"")); }
function calcAmount(){
  const q=Number(document.getElementById("loadQty")?.value||0);
  const r=Number(document.getElementById("rate")?.value||0);
  const el=document.getElementById("amount"); if(el) el.value = r ? money(q*r) : "";
  updateAlloc();
}
function updateAlloc(){
  const loaded=Number(document.getElementById("loadQty")?.value||0);
  let used=0; document.querySelectorAll(".d-qty").forEach(i=>used+=Number(i.value||0));
  const el=document.getElementById("alloc");
  if(el) el.textContent=`Allocated ${used.toFixed(3)} T of loaded ${loaded.toFixed(3)} T.`;
}
function fmtDateInput(id){
  const v=document.getElementById(id)?.value; if(!v) return "";
  const d=new Date(v);
  return `${d.getDate()}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]}-${String(d.getFullYear()).slice(2)}`;
}
function collectLocs(){ return [...document.querySelectorAll(".loc-name")].map(s=>s.value).filter(Boolean); }
function collectDests(){
  return [...document.querySelectorAll(".dest-card")].map(c => ({
    type: c.querySelector(".d-type")?.value,
    dest: c.querySelector(".d-dest")?.value,
    city: c.querySelector(".d-city")?.value,
    plant: c.querySelector(".d-plant")?.value,
    qty: Number(c.querySelector(".d-qty")?.value||0),
    date: c.querySelector(".d-date")?.value
  }));
}
function savePurchase(){
  const brand=document.getElementById("brand").value, bowser=document.getElementById("bowser").value;
  const tradingParty=document.getElementById("tradingParty").value;
  const loadQty=Number(document.getElementById("loadQty").value||0);
  const rate=Number(document.getElementById("rate").value||0);
  const locs=collectLocs(), dests=collectDests();
  if(!fmtDateInput("loadDate") || !brand || !bowser || !tradingParty || !loadQty || !locs.length){
    alert("Loading Date, Loaded From, Bowser/Vehicle Number, Brand, Purchasing Party aur Load Qty required hain."); return;
  }
  const first=dests[0]||{};
  PURCHASES.unshift({ no:Math.max(0,...PURCHASES.map(x=>x.no))+1, loadDate:fmtDateInput("loadDate"), brand,
    unloadDate:first.date||"", bowser, party:first.dest||"", city:first.city||"", plant:first.plant||locs[0],
    unit:"Ton", loadQty, unloadQty:first.qty||loadQty, baseRate:"", rate, amount:loadQty*rate, tradingParty, loadedFrom:locs, dests });
  page="purchases"; render();
}
function saveSale(){
  const brand=document.getElementById("brand").value, bowser=document.getElementById("bowser").value;
  const loadQty=Number(document.getElementById("loadQty").value||0);
  const rate=Number(document.getElementById("rate").value||0);
  const locs=collectLocs(), dests=collectDests();
  if(!fmtDateInput("loadDate") || !brand || !bowser || !loadQty || !locs.length){
    alert("Loading Date, Loaded From, Bowser/Vehicle Number, Brand aur Load Qty required hain."); return;
  }
  const first=dests[0]||{};
  SALES.unshift({ no:Math.max(0,...SALES.map(x=>x.no))+1, loadDate:fmtDateInput("loadDate"), brand,
    unloadDate:first.date||"", bowser, party:first.dest||"", city:first.city||"", plant:first.plant||locs[0],
    unit:"Ton", loadQty, unloadQty: dests.reduce((s,d)=>s+Number(d.qty||0),0) || loadQty,
    baseRate:"", rate, amount:loadQty*rate, loadedFrom:locs, dests });
  page="sales"; render();
}
function editPurchase(i){ editingPurchase=PURCHASES[i]; page="purchaseForm"; render(); }
function deletePurchase(i){ if(confirm("Delete this purchase?")){ PURCHASES.splice(i,1); render(); } }
function editSale(i){ editingSale=SALES[i]; page="saleForm"; render(); }
function deleteSale(i){ if(confirm("Delete this sale?")){ SALES.splice(i,1); render(); } }
function toCSV(rows){
  const header=["No","Loading Date","LPG/GAS Quality","Unloading Date","Bowser No","Party","City","Filling Plant","Unit","Load Qty","Unload Qty","Base Rate","Rate","Amount (PKR)"];
  return header.join(",")+"\n"+rows.map(r=>[r.no,r.loadDate,r.brand,r.unloadDate,r.bowser,r.party,r.city,r.plant,r.unit,r.loadQty,r.unloadQty,r.baseRate||"",r.rate,r.amount].join(",")).join("\n");
}
function saveFile(name,text){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type:"text/csv"})); a.download=name; a.click(); }
function downloadPurchases(){ saveFile("LPG-PURCHASE-filtered.csv", toCSV(applyListFilter(PURCHASES,PF))); }
function downloadSales(){ saveFile("LPG-SALE-filtered.csv", toCSV(applyListFilter(SALES,SF))); }
function downloadRow(kind,i){
  const row = kind==="editPurchase" ? PURCHASES[i] : SALES[i];
  saveFile(`${kind==="editPurchase"?"purchase":"sale"}-${row.no}.csv`, toCSV([row]));
}

function paymentListView() {
  return `<div class="filters-top" style="margin-bottom:12px">
    <div class="note">Har payment save hote hi <b>Master Ledger — Meer Gas</b> aur us bank ki ledger update hoti hai.</div>
    <div style="display:flex;gap:8px">
      <button class="btn" onclick="downloadPayments()">Download</button>
      <button class="btn green" onclick="page='paymentForm';render()">+ Add Payment</button>
    </div>
  </div>
  <div class="sheet-wrap">
    ${sheetHead("PAYMENTS — source of Master Ledger")}
    <table class="data">
      <thead><tr>
        <th>Serial</th><th>Date</th><th>Description</th><th>Bank title</th>
        <th>TID</th><th>Sender</th><th>Receiver</th><th>In</th><th>Out</th><th>Actions</th>
      </tr></thead>
      <tbody>${PAYMENTS.map((p,i)=>`<tr>
        <td>${p.serial}</td><td>${p.date}</td><td>${esc(p.description)}</td><td>${esc(p.bank)}</td>
        <td>${esc(p.tid)}</td><td>${esc(p.sender)}</td><td>${esc(p.receiver)}</td>
        <td class="cr">${p.amountIn?money(p.amountIn):""}</td>
        <td class="dr">${p.amountOut?money(p.amountOut):""}</td>
        <td class="actions"><button class="del" onclick="deletePayment(${i})">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table>
  </div>`;
}
function paymentFormView() {
  return `<div class="entry-wrap">
    <div class="section-label">PAYMENT ENTRY — posts to Master Ledger</div>
    <div class="form-grid">
      <div class="field"><label>Date <span class="req">*</span></label><input type="date" id="pDate" /></div>
      <div class="field"><label>Bank title <span class="req">*</span></label>
        <select id="pBank"><option value="">Select Meer Gas bank</option>${opts(MASTER.banks)}</select></div>
      <div class="field"><label>TID</label><input id="pTid" placeholder="Transaction ID" /></div>
      <div class="field"><label>Sender <span class="req">*</span></label><input id="pSender" placeholder="Who sent" /></div>
      <div class="field"><label>Receiver <span class="req">*</span></label><input id="pReceiver" placeholder="Who received" /></div>
      <div class="field"><label>Type</label>
        <select id="pType"><option value="in">Receipt (In)</option><option value="out">Payment (Out)</option></select></div>
      <div class="field"><label>Amount (PKR) <span class="req">*</span></label><input id="pAmt" type="number" step="0.01" /></div>
      <div class="field" style="grid-column:1/-1"><label>Description</label>
        <input id="pDesc" placeholder="Auto-fills bank title if left blank" /></div>
    </div>
    <div style="margin-top:16px">
      <button class="primary" onclick="savePayment()">Save Payment</button>
      <button class="btn" style="margin-left:8px" onclick="page='payments';render()">Back</button>
      <span class="note" style="margin-left:10px">Yeh entry Master Ledger + selected bank ledger dono mein dikhegi.</span>
    </div>
  </div>`;
}
function savePayment(){
  const date=fmtDateInput("pDate") || "21-Sep-26";
  const bank=document.getElementById("pBank").value;
  const tid=document.getElementById("pTid").value || ("TID-"+Date.now().toString().slice(-6));
  const sender=document.getElementById("pSender").value;
  const receiver=document.getElementById("pReceiver").value;
  const type=document.getElementById("pType").value;
  const amt=Number(document.getElementById("pAmt").value||0);
  if(!bank || !sender || !receiver || !amt){ alert("Date, Bank title, Sender, Receiver aur Amount required hain."); return; }
  const desc=(document.getElementById("pDesc").value.trim()) || `${type==="in"?"Receipt":"Payment"} — ${bank}`;
  PAYMENTS.push({
    serial: Math.max(0,...PAYMENTS.map(x=>x.serial))+1, date, bank,
    description: desc.includes(bank)?desc:`${desc} / ${bank}`,
    tid, sender, receiver, amountIn: type==="in"?amt:0, amountOut: type==="out"?amt:0
  });
  ledgerBank = bank;
  page="masterLedger"; render();
}
function deletePayment(i){ if(confirm("Delete payment? Master Ledger se bhi hat jayegi.")){ PAYMENTS.splice(i,1); render(); } }
function downloadPayments(){
  saveFile("PAYMENTS.csv", "Serial,Date,Description,Bank title,TID,Sender,Receiver,In,Out\n"+
    PAYMENTS.map(p=>[p.serial,p.date,p.description,p.bank,p.tid,p.sender,p.receiver,p.amountIn||"",p.amountOut||""].join(",")).join("\n"));
}
function ledgerRows(bank) {
  const src = PAYMENTS.filter(p => bank==="ALL" || p.bank===bank).slice().sort((a,b)=>a.serial-b.serial);
  let bal = 0;
  return src.map(p => { bal += Number(p.amountIn||0) - Number(p.amountOut||0); return {...p, balance: bal}; });
}
function masterLedgerView() {
  const rows = ledgerRows(ledgerBank);
  const inT = rows.reduce((s,r)=>s+Number(r.amountIn||0),0);
  const outT = rows.reduce((s,r)=>s+Number(r.amountOut||0),0);
  const bal = rows.length ? rows[rows.length-1].balance : 0;
  return `<div class="filters">
    <div class="filters-top">
      <div>
        <strong>Meer Gas — Master Ledger</strong>
        <div class="note">Data Payments se aata hai. MLG kisi bhi bank ka alag ledger yahan dekh sakta hai.</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="downloadLedger()">Download</button>
        <button class="btn green" onclick="page='paymentForm';render()">+ Add Payment</button>
      </div>
    </div>
    <div class="tabs">
      <button class="tab ${ledgerBank==="ALL"?"active":""}" onclick="ledgerBank='ALL';render()">All banks</button>
      ${MASTER.banks.map(b=>`<button class="tab ${ledgerBank===b?"active":""}" onclick="setLedgerBank(this)">${esc(b)}</button>`).join("")}
    </div>
  </div>
  <div class="stats">
    <div class="stat"><span>Entries</span><b>${rows.length}</b></div>
    <div class="stat"><span>Total In</span><b class="cr">${money(inT)}</b></div>
    <div class="stat"><span>Total Out</span><b class="dr">${money(outT)}</b></div>
    <div class="stat"><span>Balance</span><b>${money(bal)}</b></div>
    <div class="stat"><span>View</span><b style="font-size:13px">${ledgerBank==="ALL"?"All Meer Gas banks":esc(ledgerBank)}</b></div>
  </div>
  <div class="sheet-wrap">
    ${sheetHead(ledgerBank==="ALL" ? "MASTER LEDGER — MEER GAS" : "BANK LEDGER — "+esc(ledgerBank))}
    <table class="data">
      <thead><tr>
        <th>Serial</th><th>Date</th><th>Description</th><th>Bank title</th>
        <th>TID</th><th>Sender</th><th>Receiver</th><th>Amount</th><th>Balance</th>
      </tr></thead>
      <tbody>${rows.map(r=>{
        const amt = Number(r.amountIn||0) - Number(r.amountOut||0);
        const cls = amt>=0?"cr":"dr";
        const shown = (amt>=0?"":"-") + money(Math.abs(amt));
        return `<tr>
          <td>${r.serial}</td><td>${r.date}</td><td>${esc(r.description)}</td><td>${esc(r.bank)}</td>
          <td>${esc(r.tid)}</td><td>${esc(r.sender)}</td><td>${esc(r.receiver)}</td>
          <td class="${cls}">${shown}</td><td>${money(r.balance)}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>
  </div>`;
}
function setLedgerBank(btn){ ledgerBank = btn.textContent; render(); }
function downloadLedger(){
  const rows=ledgerRows(ledgerBank);
  saveFile("MEER-GAS-LEDGER.csv", "Serial,Date,Description,Bank title,TID,Sender,Receiver,Amount,Balance\n"+
    rows.map(r=>[r.serial,r.date,r.description,r.bank,r.tid,r.sender,r.receiver,(r.amountIn||0)-(r.amountOut||0),r.balance].join(",")).join("\n"));
}
function openModal(key,title){ modalTarget=key; document.getElementById("modalTitle").textContent="Add "+title; document.getElementById("modalValue").value=""; document.getElementById("modal").classList.add("show"); }
function closeModal(){ document.getElementById("modal").classList.remove("show"); }
function saveModal(){ const val=document.getElementById("modalValue").value.trim(); if(val) MASTER[modalTarget].push(val); closeModal(); render(); }
function removeMaster(key,i){ MASTER[key].splice(i,1); render(); }

render();
