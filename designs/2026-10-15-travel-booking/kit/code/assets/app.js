/* Roam UI Kit · app.js — shared helpers: theme toggle, favourites, tab bar, toast, card templates */
const Roam = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => '$' + n.toLocaleString('en-US');
  const byId = (id) => window.ROAM_DATA.find((d) => d.id === id);
  const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n));

  /* ---------- theme ---------- */
  function syncThemeButtons() {
    const dark = document.documentElement.classList.contains('dark');
    $$('[data-theme-toggle]').forEach((b) => {
      b.innerHTML = icon(dark ? 'sun' : 'moon');
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(dark));
    });
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('roam.theme', dark ? 'dark' : 'light');
    syncThemeButtons();
  }

  /* ---------- favourites (localStorage) ---------- */
  const FAV = 'roam.favs';
  const favs = () => new Set(JSON.parse(localStorage.getItem(FAV) || '["kyoto","braies"]'));
  const isFav = (id) => favs().has(id);
  function toggleFav(id) {
    const s = favs(); s.has(id) ? s.delete(id) : s.add(id);
    localStorage.setItem(FAV, JSON.stringify([...s]));
    $$(`[data-like="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', String(s.has(id))));
    toast(s.has(id) ? `Saved ${byId(id).name} to your trips` : `Removed ${byId(id).name}`);
  }
  const likeBtn = (d, cls = 'glass w-9 h-9') =>
    `<button type="button" class="like ${cls} rounded-full grid place-items-center transition" data-like="${d.id}" aria-pressed="${isFav(d.id)}" aria-label="Save ${d.name}">${icon('heart', 'text-[18px]')}</button>`;

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
    const tabs = [['home', 'Home', 'index.html', 'home'], ['explore', 'Explore', 'explore.html', 'compass'], ['trips', 'Trips', '#trips', 'luggage'], ['profile', 'Profile', '#profile', 'user']];
    nav.className = 'tabbar';
    nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = tabs.map(([id, label, href, ic]) =>
      `<a href="${href}" data-tab="${id}" ${id === active ? 'aria-current="page"' : ''}>${icon(ic, 'text-[19px]')}<span>${label}</span></a>`).join('');
    $$('a[href^="#"]', nav).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast(`${a.textContent.trim()} screen: build it next!`); }));
  }

  /* ---------- card templates ---------- */
  const tallCard = (d) => `
    <a href="detail.html?id=${d.id}" class="dest-card group snap-start flex-none w-[176px] h-[236px] md:w-auto md:h-[300px] relative rounded-card overflow-hidden shadow-card">
      <img src="${d.img}" alt="${d.name}, ${d.country}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">
      <div class="absolute top-3 inset-x-3 flex items-center justify-between">
        <span class="glass-dark rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1">${icon('star', 'fill text-gold text-[13px]')}${d.rating}</span>
        ${likeBtn(d)}
      </div>
      <div class="absolute bottom-2.5 inset-x-2.5 glass-panel rounded-2xl p-3">
        <p class="flex items-center gap-1 text-xs font-bold truncate">${icon('pin', 'text-accent text-[13px]')}${d.name}, ${d.country}</p>
        <div class="flex items-center justify-between mt-1.5">
          <p><span class="text-sm font-extrabold">${money(d.price)}</span><span class="text-[10px] text-muted"> / person</span></p>
          <span class="w-6 h-6 rounded-full bg-accent/15 text-accent grid place-items-center">${icon('arrow-right', 'text-[13px]')}</span>
        </div>
      </div>
    </a>`;
  const listRow = (d) => `
    <li><a href="detail.html?id=${d.id}" class="flex items-center gap-3.5 bg-card border border-line rounded-2xl p-3 shadow-soft hover:border-accent/40 transition">
      <img src="${d.img}" alt="" class="w-16 h-16 rounded-xl object-cover flex-none" loading="lazy">
      <div class="flex-1 min-w-0">
        <p class="font-bold text-sm truncate">${d.name}, ${d.country}</p>
        <p class="flex items-center gap-2 mt-1 text-[11px] text-muted">
          <span class="flex items-center gap-1">${icon('calendar', 'text-[12px]')}${d.days} days</span><span>•</span>
          <span class="flex items-center gap-1">${icon('star', 'fill text-gold text-[12px]')}<b class="text-ink font-semibold">${d.rating}</b> (${k(d.reviews)})</span>
        </p>
      </div>
      <div class="text-right flex-none"><p class="font-bold">${money(d.price)}</p><p class="text-[10px] text-muted">/ person</p></div>
    </a></li>`;
  const gridCard = (d) => `
    <a href="detail.html?id=${d.id}" class="dest-card group block bg-card border border-line rounded-card overflow-hidden shadow-soft">
      <div class="relative h-28 md:h-36 overflow-hidden">
        <img src="${d.img}" alt="${d.name}" class="w-full h-full object-cover" loading="lazy">
        <div class="absolute top-2 right-2">${likeBtn(d, 'glass w-8 h-8')}</div>
        <span class="absolute bottom-2 left-2 glass-dark rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">${icon('star', 'fill text-gold text-[11px]')}${d.rating}</span>
      </div>
      <div class="p-3">
        <p class="text-[13px] font-bold truncate">${d.name}, ${d.country}</p>
        <div class="flex items-center justify-between mt-1"><p><b class="text-sm">${money(d.price)}</b><span class="text-[10px] text-muted"> /person</span></p>
          <span class="text-accent">${icon('arrow-right', 'text-[14px]')}</span></div>
      </div>
    </a>`;

  /* ---------- boot ---------- */
  function boot() {
    tabbar(); syncThemeButtons();
    document.addEventListener('click', (e) => {
      const tb = e.target.closest('[data-theme-toggle]'); if (tb) { toggleTheme(); return; }
      const lb = e.target.closest('[data-like]'); if (lb) { e.preventDefault(); e.stopPropagation(); toggleFav(lb.dataset.like); }
    });
  }
  return { $, $$, money, byId, k, boot, toast, toggleFav, isFav, likeBtn, tallCard, listRow, gridCard };
})();
document.addEventListener('DOMContentLoaded', Roam.boot);
