/* Folio UI Kit · app.js — shared core: state in localStorage, book helpers, CSS covers, streak + stats, icons, bottom nav, sheet, toast.
   Every page loads data.js then app.js, then its own page script. window.Folio is the public API. */
(function () {
  const D = window.FOLIO_DATA;
  const KEY = 'folio.state';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const seed = () => ({ library: clone(D.library), current: D.current, log: clone(D.log), dailyGoal: D.dailyGoal, favGenres: clone(D.favGenres),
    reader: { size: 18, leading: 1.7 }, extraDone: 0, extraPages: 0, extraMin: 0 });

  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.library) return Object.assign(seed(), s); } catch (e) { /* ignore broken JSON */ }
    return seed();
  }
  let state = load();
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); document.dispatchEvent(new CustomEvent('folio:change')); }
  function reset() { localStorage.removeItem(KEY); state = seed(); save(); }

  /* ---------- dates (demo clock) ---------- */
  const now = () => (D.demoNow ? new Date(D.demoNow) : new Date());
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  function greeting() { const h = now().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }

  /* ---------- books ---------- */
  const book = (id) => D.books.find((b) => b.id === id);
  const lib = (id) => (state.library[id] = state.library[id] || { status: null, page: 0, shelf: false });
  const pct = (id) => Math.round((lib(id).page / book(id).pages) * 100);
  const minsLeft = (id) => Math.round(((book(id).pages - lib(id).page) / book(id).pages) * book(id).hours * 60);
  const byStatus = (s) => D.books.filter((b) => lib(b.id).status === s);
  function setPage(id, page) {
    const l = lib(id), b = book(id); const was = l.status;
    l.page = Math.max(0, Math.min(b.pages, Math.round(page)));
    if (l.page >= b.pages) { l.status = 'done'; if (was !== 'done') state.extraDone++; }
    else if (l.page > 0 && l.status !== 'reading') { l.status = 'reading'; l.started = l.started || ymd(now()); }
    save();
  }
  function logMinutes(min, pages) {
    const k = ymd(now()); state.log[k] = (state.log[k] || 0) + min; state.extraMin += min; state.extraPages += pages || 0; save();
  }
  const today = () => state.log[ymd(now())] || 0;
  function streak() {
    let d = now(), n = 0;
    if (!(state.log[ymd(d)] > 0)) d = addDays(d, -1);          // today not logged yet: streak still counts until midnight
    while (state.log[ymd(d)] > 0) { n++; d = addDays(d, -1); }
    return n;
  }
  function last7() {
    return Array.from({ length: 7 }, (_, i) => { const d = addDays(now(), i - 6); return { d, min: state.log[ymd(d)] || 0, today: i === 6 }; });
  }
  function stats() {
    const s = D.stats;
    return { booksRead: s.booksRead + state.extraDone, pages: s.pages + state.extraPages, hours: Math.round(s.hours + state.extraMin / 60),
      longest: Math.max(s.longest, streak()), perMonth: s.perMonth.map((n, i) => (i === s.monthNow ? n + state.extraDone : n)), monthNow: s.monthNow };
  }

  /* ---------- covers: flat graphic / typographic designs in pure CSS (no images) ---------- */
  const C = { ink: '#141414', paper: '#F5F4F0', or: '#E8742A', grey: '#8A8A8A', sand: '#D9D6CE' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function cover(id, cls = '') {
    const b = book(id); const t = esc(b.title), a = esc(b.author);
    const L = {
      sun: [C.or, `<i class="s" style="width:92cqw;height:92cqw;right:-30cqw;bottom:-22cqw;background:${C.ink}"></i><i class="s" style="width:18cqw;height:18cqw;left:12cqw;bottom:30cqw;background:${C.paper}"></i>
        <b class="t" style="top:10cqw;font-size:17cqw;color:${C.ink}">${t}</b><span class="a" style="bottom:8cqw;color:${C.paper}">${a}</span>`],
      split: [C.ink, `<i style="left:0;right:0;bottom:0;height:46%;background:${C.or}"></i>
        <i style="left:9cqw;right:9cqw;bottom:10cqw;height:24cqw;background:repeating-linear-gradient(180deg,${C.ink} 0 2cqw,transparent 2cqw 5cqw)"></i>
        <b class="t" style="top:10cqw;font-size:16cqw;color:${C.paper}">${t}</b><span class="a" style="top:47%;color:${C.grey}">${a}</span>`],
      arc: [C.paper, `<i class="s" style="width:120cqw;height:120cqw;left:-10cqw;bottom:-72cqw;background:${C.or}"></i><i style="left:9cqw;right:9cqw;top:56%;height:1.4cqw;background:${C.ink}"></i>
        <b class="t" style="top:11cqw;font-size:16cqw;color:${C.ink}">${t}</b><span class="a" style="top:62%;color:${C.ink}">${a}</span>`],
      stripe: [C.sand, `<i style="inset:0;background:repeating-linear-gradient(135deg,${C.ink} 0 5cqw,transparent 5cqw 11cqw)"></i><i style="left:7cqw;right:7cqw;top:24%;height:44%;background:${C.paper};border-radius:2cqw"></i>
        <b class="t" style="top:31%;font-size:15cqw;color:${C.ink}">${t}</b><span class="a" style="top:57%;color:${C.or}">${a}</span>`],
      grid: [C.ink, `<i style="inset:0;background:radial-gradient(circle,${C.or} 1.3cqw,transparent 1.5cqw) 0 0/11cqw 11cqw;opacity:.85;top:58%"></i>
        <b class="t" style="top:10cqw;font-size:13.5cqw;color:${C.paper}">${t}</b><span class="a" style="top:50%;color:${C.or}">${a}</span>`],
      dots: [C.grey, `<i style="inset:0;background:radial-gradient(circle,${C.paper} 2.4cqw,transparent 2.6cqw) 4cqw 4cqw/14cqw 14cqw;opacity:.35"></i><i class="s" style="width:20cqw;height:20cqw;right:12cqw;top:44%;background:${C.or}"></i>
        <b class="t" style="bottom:20cqw;font-size:15cqw;color:${C.paper}">${t}</b><span class="a" style="bottom:9cqw;color:${C.ink}">${a}</span>`],
      type: [C.paper, `<b style="right:-4cqw;bottom:-22cqw;font-size:110cqw;font-weight:900;line-height:1;color:${C.or}">F</b>
        <b class="t" style="top:10cqw;font-size:13cqw;color:${C.ink};right:24cqw">${t}</b><span class="a" style="bottom:8cqw;color:${C.ink};right:50cqw">${a}</span>`],
      mono: [C.ink, `<i class="s" style="width:64cqw;height:64cqw;left:18cqw;top:30%;border:1.4cqw solid ${C.paper};background:transparent"></i><i style="width:6cqw;left:47cqw;top:22%;height:62%;background:${C.or};border-radius:9cqw"></i>
        <b class="t" style="top:8cqw;font-size:15cqw;color:${C.paper}">${t}</b><span class="a" style="bottom:7cqw;color:${C.grey}">${a}</span>`],
    }[b.cover];
    return `<div class="cover ${cls}" style="background:${L[0]}" role="img" aria-label="${t} by ${a}, cover">${L[1]}</div>`;
  }

  /* ---------- icons (24px line set) ---------- */
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
    shelf: '<path d="M5 4h3v16H5zM10 4h3v16h-3zM15.2 4.6l2.9-.8 3.6 15.4-2.9.8z"/>',
    read: '<path d="M3 5.5C5.5 4.3 8.5 4.3 12 6.5c3.5-2.2 6.5-2.2 9-1V19c-2.5-1.2-5.5-1.2-9 1-3.5-2.2-6.5-2.2-9-1z"/><path d="M12 6.5V20"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    bookmark: '<path d="M6.5 4h11v16.5L12 16.5l-5.5 4z"/>',
    share: '<path d="M12 4v11M7.5 8.5 12 4l4.5 4.5"/><path d="M5 13v6h14v-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    flame: '<path d="M12 3c.6 3.2 4.8 5.4 4.8 10a4.8 4.8 0 0 1-9.6 0c0-2.3 1.3-3.6 2.3-4.6.2 1.6.9 2.6 1.9 3 0-3.4.3-5.8.6-8.4z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    page: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5V8h4"/>',
    arrow: '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
    chev: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    text: '<path d="M4 18 8.5 6h1L14 18M5.6 14h6.8M15 18l3-7.5h.6L21.5 18M15.8 16h5"/>',
  };
  const icon = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;
  const starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>';
  const star = (size = 14) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="fill:rgb(var(--star))" aria-hidden="true"><path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>`;

  /* ---------- shell: bottom nav, theme toggle, toast, sheet ---------- */
  function nav(active) {
    const items = [['home', 'index.html', 'Home'], ['shelf', 'shelf.html', 'Shelf'], ['read', `reader.html?id=${state.current}`, 'Reader'], ['user', 'profile.html', 'Profile']];
    const el = document.createElement('nav'); el.className = 'nav'; el.setAttribute('aria-label', 'Main');
    el.innerHTML = items.map(([i, href, label]) => `<a href="${href}" aria-label="${label}"${i === active ? ' aria-current="page"' : ''}>${icon(i, '')}</a>`).join('');
    document.body.appendChild(el);
  }
  const theme = () => { try { return JSON.parse(localStorage.getItem('folio.theme')) || 'light'; } catch (e) { return 'light'; } };
  function setTheme(t) {
    localStorage.setItem('folio.theme', JSON.stringify(t));
    const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark); document.dispatchEvent(new CustomEvent('folio:theme'));
  }
  function bindThemeToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      const paint = () => { const d = document.documentElement.classList.contains('dark'); b.innerHTML = icon(d ? 'sun' : 'moon', ''); b.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode'); };
      paint(); b.addEventListener('click', () => { setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'); });
      document.addEventListener('folio:theme', paint);
    });
  }
  let tt;
  function toast(msg) {
    let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200);
  }
  /** sheet(html, onMount) opens a bottom sheet; returns close(). Esc / scrim click closes; focus returns to the opener. */
  function sheet(html, onMount) {
    const opener = document.activeElement;
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const el = document.createElement('div'); el.className = 'sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="grab"></div>${html}`; document.body.append(scrim, el);
    requestAnimationFrame(() => { scrim.classList.add('open'); el.classList.add('open'); });
    const close = () => { scrim.classList.remove('open'); el.classList.remove('open'); document.removeEventListener('keydown', onKey); setTimeout(() => { scrim.remove(); el.remove(); }, 280); opener && opener.focus && opener.focus(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    scrim.addEventListener('click', close); document.addEventListener('keydown', onKey);
    onMount && onMount(el, close); const f = el.querySelector('button, input'); f && setTimeout(() => f.focus(), 60);
    return close;
  }
  /** stepper inside a container: <div class="stepper" data-min data-max data-step data-val> */
  function stepper(root) {
    root.querySelectorAll('.stepper').forEach((s) => {
      const o = s.querySelector('output'); const min = +s.dataset.min, max = +s.dataset.max, step = +s.dataset.step;
      const set = (v) => { s.dataset.val = Math.max(min, Math.min(max, v)); o.textContent = s.dataset.val; };
      s.querySelector('[data-dec]').onclick = () => set(+s.dataset.val - step); s.querySelector('[data-inc]').onclick = () => set(+s.dataset.val + step); set(+s.dataset.val);
    });
  }
  /** "Log a session" sheet for a book: pages + minutes → updates progress, today's minutes and the streak. */
  function logSheet(id, done) {
    const b = book(id), l = lib(id);
    sheet(`<h2 class="h-title text-[22px]">Log a session</h2><p class="text-muted text-[14px] mt-1">${esc(b.title)} · now on page ${l.page} of ${b.pages}</p>
      <div class="flex items-center justify-between mt-6"><span class="font-semibold">Pages read</span>
        <div class="stepper" data-min="0" data-max="${b.pages - l.page}" data-step="5" data-val="${Math.min(20, b.pages - l.page)}"><button type="button" data-dec aria-label="Fewer pages">−</button><output class="num">20</output><button type="button" data-inc aria-label="More pages">+</button></div></div>
      <div class="flex items-center justify-between mt-4"><span class="font-semibold">Minutes</span>
        <div class="stepper" data-min="5" data-max="240" data-step="5" data-val="15"><button type="button" data-dec aria-label="Fewer minutes">−</button><output class="num">15</output><button type="button" data-inc aria-label="More minutes">+</button></div></div>
      <button type="button" class="pill pill-ink w-full mt-7 h-[52px]" data-save>Save session</button>`, (el, close) => {
      stepper(el);
      el.querySelector('[data-save]').onclick = () => {
        const [p, m] = [...el.querySelectorAll('.stepper')].map((s) => +s.dataset.val);
        setPage(id, l.page + p); logMinutes(m, p); close();
        toast(lib(id).status === 'done' ? `Finished ${b.title}! 🎉` : `+${p} pages · ${m} min logged`); done && done();
      };
    });
  }
  /** rating stars widget (yours): returns HTML; call bindStars(el, id) */
  const starsHtml = (n) => `<div class="stars" role="radiogroup" aria-label="Your rating">${[1, 2, 3, 4, 5].map((i) => `<button type="button" role="radio" aria-checked="${i === n}" aria-label="${i} star${i > 1 ? 's' : ''}" data-r="${i}" class="${i <= n ? 'on' : ''}">${starSvg}</button>`).join('')}</div>`;

  window.Folio = { D, get state() { return state; }, save, reset, now, ymd, addDays, greeting, book, lib, pct, minsLeft, byStatus, setPage, logMinutes, today, streak, last7, stats,
    cover, icon, star, starsHtml, esc, nav, theme, setTheme, bindThemeToggles, toast, sheet, stepper, logSheet };
  document.addEventListener('DOMContentLoaded', () => { nav(document.body.dataset.nav); bindThemeToggles(); });
  // keep pages in sync when another tab changes the state
  window.addEventListener('storage', (e) => { if (e.key === KEY) { state = load(); document.dispatchEvent(new CustomEvent('folio:change')); } });
})();
