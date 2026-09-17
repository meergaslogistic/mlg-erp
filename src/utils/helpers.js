// helpers.js
/**
 * Utility helpers – formatting, calculations, etc.
 */

function fmt(n, decimals = 2) {
  return Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: decimals });
}

function fmtMoney(n) {
  return Number(n || 0).toLocaleString('en-PK');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateDisplay(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');
  } catch {
    return d;
  }
}

function calcAmount(qty, rate) {
  const q = parseFloat(qty) || 0;
  const r = parseFloat(rate) || 0;
  if (!q || !r) return '';
  return (q * r).toLocaleString('en-PK', { maximumFractionDigits: 0 });
}

function parseAmount(str) {
  return parseFloat(String(str || '0').replace(/,/g, '')) || 0;
}
window.MLGHelpers = { fmt, fmtMoney, today, formatDateDisplay, calcAmount, parseAmount };
