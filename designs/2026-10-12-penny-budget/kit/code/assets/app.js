/* Penny UI Kit · shared app.js: storage, seed data, money formatting, nav, toast */
const KEYS = { theme: 'penny.theme', tx: 'penny.tx', budget: 'penny.budget', seeded: 'penny.seeded' };
const CATS = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Fun'],
  income: ['Salary', 'Freelance', 'Gift', 'Other'],
};
// Thin 1.5px line icons (inline SVG paths)
const ICONS = {
  Food: '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v6M7 7h4M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/>',
  Transport: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l1.5-4M16 21l-1.5-4"/><circle cx="8.5" cy="14" r=".6"/><circle cx="15.5" cy="14" r=".6"/>',
  Shopping: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  Bills: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/>',
  Health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  Fun: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
  Salary: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  Freelance: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/>',
  Gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5-.5M12 9c2-4 6-3 5-.5"/>',
  Other: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  insights: '<path d="M5 20V11M12 20V5M19 20v-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  theme: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>', chevR: '<path d="M9 6l6 6-6 6"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M20 12H5M11 6l-6 6 6 6"/>', trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
};
const icon = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.Other}</svg>`;

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const money = (n) => '₹' + inr.format(Math.round(n * 100) / 100);
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------- seed data ---------- */
async function loadSeed() {
  if (location.protocol === 'file:') return window.PENNY_SEED;
  try { const r = await fetch('data/seed.json'); if (!r.ok) throw 0; return await r.json(); }
  catch { return window.PENNY_SEED; }
}
// Builds dated transactions around *today*, so the demo always looks current.
function buildSeed(seed, now = new Date()) {
  const tx = [];
  const today = now.getDate();
  seed.thisMonth.forEach((t) => {
    const d = new Date(now.getFullYear(), now.getMonth(), Math.min(t.day, today));
    tx.push({ id: uid(), type: t.type, cat: t.cat, name: t.name, amount: t.amount, account: t.account, date: isoDate(d) });
  });
  // previous months: salary + spend split by this month's category shares
  const shares = {}; let spent = 0;
  seed.thisMonth.filter((t) => t.type === 'expense').forEach((t) => { shares[t.cat] = (shares[t.cat] || 0) + t.amount; spent += t.amount; });
  seed.history.slice().reverse().forEach((total, i) => {
    const m = new Date(now.getFullYear(), now.getMonth() - (i + 1), 1);
    tx.push({ id: uid(), type: 'income', cat: 'Salary', name: 'Salary · Acme Labs', amount: 53000, account: 'Bank · HDFC', date: isoDate(m) });
    let left = total; const cats = Object.keys(shares);
    cats.forEach((c, j) => {
      const amt = j === cats.length - 1 ? left : Math.round((total * shares[c]) / spent);
      left -= amt;
      tx.push({ id: uid(), type: 'expense', cat: c, name: `${c} (monthly total)`, amount: amt, account: 'UPI · HDFC', date: isoDate(new Date(m.getFullYear(), m.getMonth(), 5 + j * 4)) });
    });
  });
  return tx;
}
async function ensureData() {
  if (!localStorage.getItem(KEYS.seeded)) {
    const seed = await loadSeed();
    localStorage.setItem(KEYS.tx, JSON.stringify(buildSeed(seed)));
    if (!localStorage.getItem(KEYS.budget)) localStorage.setItem(KEYS.budget, String(seed.budget));
    localStorage.setItem(KEYS.seeded, '1');
  }
}
function resetDemo() { localStorage.removeItem(KEYS.seeded); localStorage.removeItem(KEYS.tx); localStorage.removeItem(KEYS.budget); }

/* ---------- state ---------- */
function getTx() { try { return JSON.parse(localStorage.getItem(KEYS.tx)) || []; } catch { return []; } }
function saveTx(list) { localStorage.setItem(KEYS.tx, JSON.stringify(list)); }
function addTx(t) { const list = getTx(); const item = { id: uid(), ...t }; list.push(item); saveTx(list); return item; }
function deleteTx(id) { saveTx(getTx().filter((t) => t.id !== id)); }
function getBudget() { const n = parseFloat(localStorage.getItem(KEYS.budget)); return Number.isFinite(n) ? n : 30000; }
function setBudget(n) { localStorage.setItem(KEYS.budget, String(n)); }

const sortTx = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
function inMonth(list, d) { const k = monthKey(d); return list.filter((t) => t.date.startsWith(k)); }
function totals(list) {
  let income = 0, spent = 0; const byCat = {};
  list.forEach((t) => {
    if (t.type === 'income') income += t.amount;
    else { spent += t.amount; byCat[t.cat] = (byCat[t.cat] || 0) + t.amount; }
  });
  return { income, spent, net: income - spent, byCat };
}

/* ---------- UI helpers ---------- */
function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(KEYS.theme, dark ? 'dark' : 'light');
}
let toastTimer;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div'); el.id = 'toast';
    el.className = 'toast hide fixed left-1/2 bottom-28 -translate-x-1/2 z-50 rounded-full bg-ink text-bg text-sm px-4 py-2.5';
    document.body.appendChild(el);
  }
  el.textContent = msg; el.classList.remove('hide');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.add('hide'), 2200);
}
function txRow(t) {
  const sign = t.type === 'income' ? '+' : '−';
  const color = t.type === 'income' ? 'text-accent' : 'text-ink';
  const d = new Date(t.date + 'T00:00');
  return `<li data-id="${t.id}" class="flex items-center gap-3 py-3.5 cursor-pointer" role="button" tabindex="0">
    <span class="w-10 h-10 rounded-full border border-line text-muted grid place-items-center flex-none">${icon(t.cat)}</span>
    <span class="min-w-0 flex-1"><span class="block text-[15px] truncate">${escapeHtml(t.name)}</span>
      <span class="block text-xs text-muted mt-0.5">${t.cat} · ${d.getDate()} ${MONTHS[d.getMonth()]}</span></span>
    <span class="num text-[15px] font-medium ${color}">${sign}${money(t.amount)}</span></li>`;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function renderNav(active) {
  const item = (href, key, label) => `<a href="${href}" class="flex flex-col items-center gap-1 text-[11px] ${active === key ? 'text-accent font-semibold' : 'text-muted'}" ${active === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${label}</span></a>`;
  const nav = document.getElementById('bottom-nav');
  nav.className = 'fixed bottom-0 inset-x-0 bg-bg/95 backdrop-blur border-t border-line';
  nav.innerHTML = `<div class="max-w-md mx-auto grid grid-cols-4 items-center h-20 px-6 pb-2">
    ${item('index.html', 'home', 'Home')}${item('insights.html', 'insights', 'Insights')}
    <a href="add.html" aria-label="Add transaction" class="justify-self-center w-12 h-12 rounded-full bg-accent text-on-accent grid place-items-center">${icon('plus')}</a>
    <button data-theme-toggle class="flex flex-col items-center gap-1 text-[11px] text-muted">${icon('theme')}<span>Theme</span></button></div>`;
  nav.querySelector('[data-theme-toggle]').addEventListener('click', toggleTheme);
}
