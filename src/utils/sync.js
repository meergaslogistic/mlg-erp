// Live workspace bus — all open ERP tabs update instantly (no refresh)
(function () {
  const CHANNEL = 'mlg-erp-live';
  const KEY = 'mlg_erp_v8';
  const META = 'mlg_erp_sync_meta';
  let tabId = 't' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  let applying = false;
  let bc = null;
  try { bc = new BroadcastChannel(CHANNEL); } catch (e) { bc = null; }

  function readMeta() {
    try { return JSON.parse(localStorage.getItem(META) || '{}'); } catch (e) { return {}; }
  }
  function writeMeta(rev) {
    localStorage.setItem(META, JSON.stringify({ rev: rev || Date.now(), tabId, at: Date.now() }));
  }

  function publish(payload) {
    if (applying) return;
    const rev = Date.now();
    payload = payload || {};
    payload._rev = rev;
    payload._tab = tabId;
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
      localStorage.setItem('mlg_erp_v7', JSON.stringify(payload));
      writeMeta(rev);
    } catch (e) { console.warn('sync persist', e); }
    if (bc) {
      try { bc.postMessage({ type: 'state', rev, tabId, payload }); } catch (e) {}
    }
    return rev;
  }

  function subscribe(onState) {
    if (bc) {
      bc.onmessage = (ev) => {
        const msg = ev && ev.data;
        if (!msg || msg.tabId === tabId || msg.type !== 'state') return;
        applying = true;
        try { onState(msg.payload, 'broadcast'); } catch (e) { console.warn(e); }
        applying = false;
      };
    }
    window.addEventListener('storage', (ev) => {
      if (ev.key !== KEY && ev.key !== META) return;
      if (!ev.newValue) return;
      let data = null;
      try {
        data = ev.key === KEY ? JSON.parse(ev.newValue) : JSON.parse(localStorage.getItem(KEY) || 'null');
      } catch (e) { return; }
      if (!data || data._tab === tabId) return;
      applying = true;
      try { onState(data, 'storage'); } catch (e) { console.warn(e); }
      applying = false;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data && data._tab !== tabId) onState(data, 'focus');
      } catch (e) {}
    });
  }

  window.MLGSync = { publish, subscribe, tabId, key: KEY };
})();
