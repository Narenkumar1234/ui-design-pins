/* Ember UI Kit · app.js — shared helpers: theme toggle, cart store (localStorage), favourites, tab bar, toast, templates */
const Ember = (() => {
  const D = window.EMBER;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => '$' + n.toFixed(2);
  const rest = (id) => D.restaurants.find((r) => r.id === id);
  const dish = (id) => D.dishes.find((d) => d.id === id);
  const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n));
  const fee = (r) => (r.fee ? money(r.fee) + ' delivery' : '<span class="text-leaf font-medium">Free delivery</span>');

  /* ---------- theme ---------- */
  function syncThemeButtons() {
    const dark = document.documentElement.classList.contains('dark');
    $$('[data-theme-toggle]').forEach((b) => {
      b.innerHTML = icon(dark ? 'sun' : 'moon', 'text-[18px]');
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(dark));
    });
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('ember.theme', dark ? 'dark' : 'light');
    syncThemeButtons();
  }

  /* ---------- cart (localStorage 'ember.cart') ----------
     line = { key, dish, qty, extras: [extraId], unit }  — key = dish + extras so variants stack separately */
  const CART = 'ember.cart';
  const cart = () => JSON.parse(localStorage.getItem(CART) || '[]');
  const saveCart = (c) => { localStorage.setItem(CART, JSON.stringify(c)); updateBadges(); };
  const count = () => cart().reduce((n, l) => n + l.qty, 0);
  const unitPrice = (d, extras) => d.price + d.extras.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0);
  function add(dishId, qty = 1, extras = []) {
    const d = dish(dishId); const key = [dishId, ...[...extras].sort()].join('+');
    const c = cart(); const line = c.find((l) => l.key === key);
    if (line) line.qty += qty; else c.push({ key, dish: dishId, qty, extras, unit: unitPrice(d, extras) });
    saveCart(c); return c;
  }
  function setQty(key, qty) {
    let c = cart(); const line = c.find((l) => l.key === key); if (!line) return c;
    line.qty = qty; if (qty <= 0) c = c.filter((l) => l.key !== key);
    saveCart(c); return c;
  }
  function totals(code = localStorage.getItem('ember.promo')) {
    const c = cart(); const sub = c.reduce((s, l) => s + l.unit * l.qty, 0);
    const rs = [...new Set(c.map((l) => dish(l.dish).r))];
    const delivery = rs.reduce((s, id) => s + rest(id).fee, 0);
    const p = D.promo; const applied = code && code.toUpperCase() === p.code && sub > 0;
    const discount = applied ? Math.min(Math.round(sub * p.pct) / 100, p.max) : 0;
    return { sub, delivery, discount, applied, total: Math.max(0, sub + delivery - discount) };
  }
  function updateBadges() {
    const n = count();
    $$('[data-cart-count]').forEach((b) => { b.textContent = n; b.hidden = n === 0; });
    const bar = $('#cartbar');
    if (bar) { bar.classList.toggle('show', n > 0); const t = $('#cartbar-total', bar); if (t) t.textContent = money(totals().sub); const c = $('#cartbar-count', bar); if (c) c.textContent = `${n} item${n === 1 ? '' : 's'}`; }
  }

  /* ---------- favourites ---------- */
  const FAV = 'ember.favs';
  const favs = () => new Set(JSON.parse(localStorage.getItem(FAV) || '["harvest"]'));
  const isFav = (id) => favs().has(id);
  function toggleFav(id, label) {
    const s = favs(); s.has(id) ? s.delete(id) : s.add(id);
    localStorage.setItem(FAV, JSON.stringify([...s]));
    $$(`[data-like="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', String(s.has(id))));
    toast(s.has(id) ? `Saved ${label}` : `Removed ${label}`);
  }
  const likeBtn = (id, label, cls = 'w-9 h-9 bg-white/90 text-[#2B1D14]') =>
    `<button type="button" class="like ${cls} rounded-full grid place-items-center shadow-soft transition" data-like="${id}" data-label="${label}" aria-pressed="${isFav(id)}" aria-label="Save ${label}">${icon('heart', 'text-[17px]')}</button>`;

  /* ---------- toast ---------- */
  let t;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show'); clearTimeout(t); t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- tab bar ---------- */
  function tabbar() {
    const nav = $('#tabbar'); if (!nav) return;
    const active = nav.dataset.active;
    const tabs = [['home', 'Home', 'index.html', 'home'], ['search', 'Search', 'index.html#search', 'search'], ['orders', 'Orders', 'track.html', 'receipt'], ['saved', 'Saved', '#saved', 'heart'], ['profile', 'Profile', '#profile', 'user']];
    nav.className = 'tabbar'; nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = tabs.map(([id, label, href, ic]) =>
      `<a href="${href}" data-tab="${id}" ${id === active ? 'aria-current="page"' : ''}>${icon(ic, 'text-[21px]')}<span>${label}</span></a>`).join('');
    $$('a[href^="#"]', nav).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast(`${a.textContent.trim()} screen: build it next!`); }));
    const orders = $('[data-tab="orders"]', nav);
    orders.addEventListener('click', (e) => { if (!localStorage.getItem('ember.order')) { e.preventDefault(); toast('No active order yet'); } });
    const search = $('[data-tab="search"]', nav);
    search.addEventListener('click', (e) => { const s = $('#search'); if (s) { e.preventDefault(); s.focus(); s.scrollIntoView({ block: 'center', behavior: 'smooth' }); } });
  }

  /* ---------- templates ---------- */
  const stars = (r, n) => `<span class="inline-flex items-center gap-1 text-xs font-semibold">${icon('star', 'fill text-gold text-[13px]')}${r}${n ? `<span class="text-muted font-normal">(${k(n)})</span>` : ''}</span>`;
  const restCard = (r) => `
    <a href="restaurant.html?id=${r.id}" class="surface block rounded-card p-2.5 shadow-card hover:-translate-y-0.5 transition">
      <div class="relative h-[118px] md:h-40 rounded-2xl overflow-hidden">
        <img src="${r.img}" alt="${r.name}" class="w-full h-full object-cover" loading="lazy">
        <span class="absolute top-2 right-2 bg-white/95 text-[#2B1D14] rounded-full px-2 py-0.5 shadow-soft">${stars(r.rating)}</span>
      </div>
      <h3 class="mt-2.5 px-1 font-serif text-[17px] font-semibold leading-tight truncate">${r.name}</h3>
      <p class="px-1 mt-1 text-[11.5px] text-muted truncate">${r.time} · ${fee(r)}</p>
    </a>`;
  const dishRow = (d) => `
    <li class="surface rounded-card p-2.5 flex items-center gap-3 shadow-soft">
      <a href="dish.html?id=${d.id}" class="flex items-center gap-3 flex-1 min-w-0">
        <img src="${d.img}" alt="${d.name}" class="w-[72px] h-[72px] rounded-2xl object-cover flex-none" loading="lazy">
        <span class="min-w-0"><span class="block font-semibold truncate">${d.name}</span>
          <span class="text-xs text-muted mt-0.5 line-clamp-1">${d.desc}</span>
          <span class="flex items-center gap-2 mt-1.5"><b class="text-accent text-sm">${money(d.price)}</b>${stars(d.rating)}</span></span>
      </a>
      <button type="button" data-quick-add="${d.id}" class="grad w-9 h-9 rounded-full grid place-items-center shadow-glow flex-none" aria-label="Add ${d.name} to cart">${icon('plus', 'text-[18px]')}</button>
    </li>`;

  function init() {
    syncThemeButtons(); tabbar(); updateBadges();
    document.addEventListener('click', (e) => {
      const tt = e.target.closest('[data-theme-toggle]'); if (tt) toggleTheme();
      const lk = e.target.closest('[data-like]'); if (lk) { e.preventDefault(); e.stopPropagation(); toggleFav(lk.dataset.like, lk.dataset.label); }
      const qa = e.target.closest('[data-quick-add]');
      if (qa) { const d = dish(qa.dataset.quickAdd); add(d.id, 1, d.extras.filter((x) => x.on).map((x) => x.id)); toast(`Added ${d.name}`); }
    });
  }
  document.addEventListener('DOMContentLoaded', init);
  return { D, $, $$, money, rest, dish, k, fee, stars, cart, add, setQty, totals, count, unitPrice, updateBadges, toast, restCard, dishRow, likeBtn, isFav };
})();
