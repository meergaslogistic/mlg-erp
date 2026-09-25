// Auth + ACL for Admin / Entry Operator panels
(function () {
  const USER_KEY = 'mlg_erp_users_v1';
  const SESSION_KEY = 'mlg_erp_session_v1';
  const OTP_KEY = 'mlg_erp_otp_v1';

  const MODULES = [
    { id: 'purchase', label: 'Purchase / Loading' },
    { id: 'sale', label: 'Sale' },
    { id: 'payment', label: 'Payments' },
    { id: 'diesel', label: 'Diesel & Cash' },
    { id: 'parties', label: 'Parties & Ledgers' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'quotation', label: 'Quotations' },
    { id: 'reports', label: 'Reports' },
    { id: 'masterLedger', label: 'Master Ledger' },
    { id: 'master', label: 'Master Data' }
  ];

  function defaultOperatorAcl() {
    const acl = {};
    MODULES.forEach(m => {
      acl[m.id] = { view: true, create: true, edit: false, delete: false, pdf: false };
    });
    acl.dashboard = { view: true };
    acl.guide = { view: true };
    acl.settings = { view: true };
    return acl;
  }

  async function hashPin(text) {
    const raw = String(text || '');
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mlg:' + raw));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 2166136261;
    const s = 'mlg:' + raw;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16);
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || '{"users":[]}'); } catch (e) { return { users: [] }; }
  }
  function saveUsers(db) {
    localStorage.setItem(USER_KEY, JSON.stringify(db));
  }
  function session() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function setSession(s) {
    if (!s) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  async function signup({ username, password, displayName, email, role }) {
    const u = String(username || '').trim();
    const p = String(password || '');
    const mail = String(email || '').trim().toLowerCase();
    if (u.length < 3) return { ok: false, msg: 'Username must be at least 3 characters' };
    if (p.length < 4) return { ok: false, msg: 'Password must be at least 4 characters' };
    if (!mail || mail.indexOf('@') < 0) return { ok: false, msg: 'Valid recovery email is required' };
    const db = loadUsers();
    if (db.users.some(x => x.username.toLowerCase() === u.toLowerCase())) {
      return { ok: false, msg: 'Username already taken' };
    }
    if (db.users.some(x => String(x.email || '').toLowerCase() === mail)) {
      return { ok: false, msg: 'Email already registered' };
    }
    const hasAdmin = db.users.some(x => x.role === 'admin');
    let finalRole = role === 'admin' ? 'admin' : 'operator';
    if (!hasAdmin) finalRole = 'admin';
    const rec = {
      id: 'u' + Date.now(),
      username: u,
      displayName: String(displayName || u).trim(),
      email: mail,
      role: finalRole,
      passwordHash: await hashPin(p),
      createdAt: new Date().toISOString()
    };
    db.users.push(rec);
    if (!db.operatorAcl) db.operatorAcl = defaultOperatorAcl();
    saveUsers(db);
    const s = { userId: rec.id, username: rec.username, displayName: rec.displayName, role: rec.role, email: rec.email };
    setSession(s);
    return { ok: true, session: s, firstAdmin: !hasAdmin };
  }

  async function login(username, password, role) {
    const u = String(username || '').trim().toLowerCase();
    const want = role === 'admin' ? 'admin' : 'operator';
    const db = loadUsers();
    const rec = db.users.find(x => x.username.toLowerCase() === u || String(x.email || '').toLowerCase() === u);
    if (!rec) return { ok: false, msg: 'Account not found on this desk' };
    if (rec.role !== want) {
      return { ok: false, msg: want === 'admin'
        ? 'This account is Entry Operator. Open the Operator desk.'
        : 'This account is Admin. Open the Admin desk.' };
    }
    const h = await hashPin(password);
    if (h !== rec.passwordHash) return { ok: false, msg: 'Incorrect password' };
    const s = { userId: rec.id, username: rec.username, displayName: rec.displayName, role: rec.role, email: rec.email };
    setSession(s);
    return { ok: true, session: s };
  }

  function logout() { setSession(null); }

  async function updateAccount(userId, { username, password, displayName, email, currentPassword }) {
    const db = loadUsers();
    const rec = db.users.find(x => x.id === userId);
    if (!rec) return { ok: false, msg: 'User not found' };
    if (currentPassword) {
      const h = await hashPin(currentPassword);
      if (h !== rec.passwordHash) return { ok: false, msg: 'Current password is wrong' };
    }
    if (username) {
      const u = String(username).trim();
      if (u.length < 3) return { ok: false, msg: 'Username too short' };
      if (db.users.some(x => x.id !== userId && x.username.toLowerCase() === u.toLowerCase())) {
        return { ok: false, msg: 'Username already taken' };
      }
      rec.username = u;
    }
    if (displayName) rec.displayName = String(displayName).trim();
    if (email) rec.email = String(email).trim().toLowerCase();
    if (password) {
      if (String(password).length < 4) return { ok: false, msg: 'New password too short' };
      rec.passwordHash = await hashPin(password);
    }
    saveUsers(db);
    const s = session();
    if (s && s.userId === userId) {
      s.username = rec.username;
      s.displayName = rec.displayName;
      s.email = rec.email;
      setSession(s);
    }
    return { ok: true, session: session() };
  }

  function makeOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async function requestOtp(identity) {
    const q = String(identity || '').trim().toLowerCase();
    const db = loadUsers();
    const rec = db.users.find(x => x.username.toLowerCase() === q || String(x.email || '').toLowerCase() === q);
    if (!rec) return { ok: false, msg: 'No account matches this username or email' };
    const otp = makeOtp();
    const pack = { userId: rec.id, email: rec.email, otp, expires: Date.now() + 10 * 60 * 1000 };
    localStorage.setItem(OTP_KEY, JSON.stringify(pack));
    let mailed = false;
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(rec.email), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'MLG ERP recovery code',
          name: rec.displayName || rec.username,
          message: 'Your MLG ERP recovery code is ' + otp + '. It expires in 10 minutes. If you did not request this, ignore the email.'
        })
      });
      mailed = !!(res && res.ok);
    } catch (e) { mailed = false; }
    return { ok: true, mailed, emailHint: rec.email.replace(/(.{2}).+(@.+)/, '$1***$2'), demoOtp: mailed ? '' : otp };
  }

  async function resetWithOtp({ otp, username, password }) {
    let pack;
    try { pack = JSON.parse(localStorage.getItem(OTP_KEY) || 'null'); } catch (e) { pack = null; }
    if (!pack || String(pack.otp) !== String(otp || '').trim()) return { ok: false, msg: 'Invalid recovery code' };
    if (Date.now() > pack.expires) return { ok: false, msg: 'Recovery code expired. Request a new one.' };
    const result = await updateAccount(pack.userId, { username, password });
    if (result.ok) localStorage.removeItem(OTP_KEY);
    return result;
  }

  function getAcl() {
    const db = loadUsers();
    return db.operatorAcl || defaultOperatorAcl();
  }
  function setAcl(acl) {
    const db = loadUsers();
    db.operatorAcl = acl;
    saveUsers(db);
    return acl;
  }

  window.MLGAuth = {
    MODULES, defaultOperatorAcl, hashPin,
    loadUsers, session, setSession,
    signup, login, logout, updateAccount,
    requestOtp, resetWithOtp, getAcl, setAcl
  };
})();
