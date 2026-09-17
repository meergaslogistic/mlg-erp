# MLG Advanced ERP – Meer Logistics & Gas Energy

## One-Click Start (No commands needed)

### Windows
1. Extract the ZIP
2. **Double-click `START.bat`**
3. Browser automatically opens → system ready

### Mac / Linux
1. Extract the ZIP
2. Double-click `START.sh` (or right-click → Run)
3. Browser opens automatically

---

## What is included

- **Complete multi-file project** (not a single HTML)
- Modern modular architecture
- Auto Party Ledger posting
- Inventory (RPG Plant – STOCK + multi-ready)
- Purchase / Sale / Payment / Diesel modules
- Master Data with live “Add New”
- LocalStorage persistence (data survives refresh)
- Zero-lag design (Alpine.js reactivity)

## Project Structure

```
mlg-complete-erp/
├── START.bat              ← Windows one-click
├── START.sh               ← Mac/Linux one-click
├── index.html             ← Entry point
├── styles/main.css
├── src/
│   ├── data/store.js      ← All business data
│   ├── utils/helpers.js   ← Formatters & calculations
│   └── modules/app.js     ← Main application + Auto Ledger engine
└── README.md
```

## How to Test

1. Open Parties → click any party (especially Aziz Plant) → see live Ledger
2. Go to Sale → enter a sale → check that party’s ledger (Debit appears automatically)
3. Go to Payment → receive payment → ledger Credit updates
4. Inventory → only RPG Plant shown + Sold Out card
5. Master Data → add new Party / Bowser etc. on the fly

Data is saved in browser LocalStorage so it persists across refreshes.

## Next Steps (when you are ready)

- Real backend (PostgreSQL + Hono/Elysia)
- Multi-user + roles
- Custom fields engine
- Offline sync
- Desktop wrapper (Electron / Tauri)
- Deployment

Just tell me when you want the next phase.


## New in this version

- **Official business logo** in sidebar + topbar
- **A4 PDF downloads** with your professional letterhead background
  - Party Ledger → full ledger PDF
  - Single Sale / Purchase entry → individual voucher PDF
- Letterhead is high-resolution so zoom does **not** blur
- Content sits cleanly in the white area of the letter pad

### How to download PDF
1. Open **Parties** → click any party → **Download PDF**
2. On Sale / Purchase tables → red PDF icon on each row
