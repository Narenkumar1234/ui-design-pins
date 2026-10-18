/* Lumo UI Kit · app.js — shared helpers: icons, theme toggle, progress store (localStorage), tab bar, toast */
const Lumo = (() => {
  const D = window.LUMO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const course = (id) => D.courses.find((c) => c.id === id);
  const cat = (id) => D.categories.find((c) => c.id === id);
  const img = (name) => `img/${name}.png`;

  /* ---------- icons: thin rounded outline set (24px grid) ---------- */
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5z"/>',
    book: '<path d="M12 6.5c-1.8-1.3-4.3-2-7.5-2v13c3.2 0 5.7.7 7.5 2 1.8-1.3 4.3-2 7.5-2v-13c-3.2 0-5.7.7-7.5 2z"/><path d="M12 6.5v13"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20c.9-3.6 3.7-5.5 7.2-5.5s6.3 1.9 7.2 5.5"/>',
    bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    back: '<path d="M14.5 6 8.5 12l6 6"/>',
    arrow: '<path d="M5 12h13"/><path d="m13 6.5 5.5 5.5-5.5 5.5"/>',
    play: '<path d="M8 5.8v12.4a1 1 0 0 0 1.5.9l10-6.2a1 1 0 0 0 0-1.8l-10-6.2A1 1 0 0 0 8 5.8z"/>',
    pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.5"/><rect x="13.5" y="5" width="4" height="14" rx="1.5"/>',
    bookmark: '<path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.5a1 1 0 0 1 1-1z"/>',
    star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.6l-5 2.6.9-5.6-4-3.9 5.6-.8z"/>',
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    flame: '<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.5-2.4-5.6-3.6-8.8-2.2 1.7-2.8 3.9-2.8 5.4-1-1-1.6-2.1-1.8-3.4C7.8 10 5.5 12 5.5 14.8 5.5 18.4 8.1 21 12 21z"/>',
    close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    note: '<path d="M6 4.5h8.5L18 8v11.5H6z"/><path d="M14 4.5V8.5h4M9 12.5h6M9 15.5h4"/>',
    quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.7v.3"/><path d="M12 16.8v.2"/>',
    chart: '<path d="M5 19.5V11M10 19.5V6M15 19.5v-6M20 19.5V9"/>',
    sparkle: '<path d="M12 4.5c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z"/>',
    speed: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="m12 16 3.5-4"/>',
  };
  const FILLED = new Set(['play', 'pause', 'star']);
  function sprite() {
    if ($('#lumo-icons')) return;
    const s = Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
    document.body.insertAdjacentHTML('afterbegin', `<svg id="lumo-icons" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`);
  }
  const icon = (name, cls = '') => `<svg class="icon ${FILLED.has(name) ? 'fill' : ''} ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* ---------- theme ---------- */
  function syncThemeButtons() {
    const dark = document.documentElement.classList.contains('dark');
    $$('[data-theme-toggle]').forEach((b) => {
      b.innerHTML = icon(dark ? 'sun' : 'moon', 'text-[19px]');
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(dark));
    });
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('lumo.theme', dark ? 'dark' : 'light');
    syncThemeButtons();
  }

  /* ---------- store ---------- */
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem('lumo.' + k)); return v ?? d; } catch { return d; } };
  const set = (k, v) => localStorage.setItem('lumo.' + k, JSON.stringify(v));
  /* progress = { courseId: { done: [lessonIndex], current: lessonIndex } } */
  function progress() {
    let p = get('progress', null);
    if (!p) {
      p = {};
      Object.entries(D.seedProgress).forEach(([id, n]) => { p[id] = { done: [...Array(n).keys()], current: n }; });
      set('progress', p);
    }
    return p;
  }
  const courseProg = (id) => progress()[id] || { done: [], current: 0 };
  function saveCourseProg(id, cp) { const p = progress(); p[id] = cp; set('progress', p); }
  const pct = (id) => Math.round((courseProg(id).done.length / course(id).lessons.length) * 100);
  const todayIdx = () => (new Date().getDay() + 6) % 7; // Mon = 0
  const monday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - todayIdx()); return d.toISOString().slice(0, 10); };
  /* week = minutes per day Mon..Sun. Seeded with demo minutes for the days before today, reset every Monday. */
  function week() {
    const w = get('week', null);
    if (w && w.start === monday()) return w.mins;
    const mins = D.week.map((m, i) => (i < todayIdx() ? m || 15 : 0));
    set('week', { start: monday(), mins }); return mins;
  }
  function addMinutes(m) { const mins = week(); mins[todayIdx()] += m; set('week', { start: monday(), mins }); }
  const lastCourse = () => get('last', 'ui-design');
  const totalDone = () => Object.values(progress()).reduce((n, c) => n + c.done.length, 0);
  /* streak = consecutive study days ending today (or yesterday if you have not studied yet today) */
  function streak() {
    const w = week(); let i = todayIdx(); if (!w[i]) i--; let s = 0;
    while (i >= 0 && w[i] > 0) { s++; i--; }
    return s;
  }
  function earn(id) { const b = get('badges', ['first', 'streak']); if (!b.includes(id)) { b.push(id); set('badges', b); toast('Badge unlocked: ' + D.badges.find((x) => x.id === id).name); } }
  const badges = () => get('badges', ['first', 'streak']);
  function toggleSaved(id) { const s = get('saved', []); const i = s.indexOf(id); i < 0 ? s.push(id) : s.splice(i, 1); set('saved', s); return i < 0; }
  const isSaved = (id) => get('saved', []).includes(id);

  /* ---------- UI bits ---------- */
  let tt;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800);
  }
  function tabbar(active) {
    const tabs = [['home', 'Home', 'index.html'], ['compass', 'Explore', 'explore.html'], ['book', 'Learning', 'progress.html'], ['user', 'Profile', '#profile']];
    const nav = document.createElement('nav');
    nav.className = 'tabbar fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] rounded-full p-2 flex justify-between';
    nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = tabs.map(([ic, label, href]) => `<a href="${href}" ${label === active ? 'aria-current="page"' : ''}
      class="flex-1 h-[52px] rounded-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition">${icon(ic, 'text-[21px]')}<span>${label}</span></a>`).join('');
    const fade = document.createElement('div'); fade.className = 'tabfade'; document.body.append(fade, nav);
    nav.querySelector('a[href="#profile"]').addEventListener('click', (e) => { e.preventDefault(); toast('Profile: your next feature to build'); });
  }
  const tile = (c, extra = '') => `<img src="${img(c.img)}" alt="" class="clay ${extra}" loading="lazy" draggable="false">`;

  function boot(active) {
    sprite();
    if (active) tabbar(active);
    syncThemeButtons();
    $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
  }
  return { D, $, $$, course, cat, img, icon, tile, boot, toast, get, set, progress, courseProg, saveCourseProg, pct, week, addMinutes,
    todayIdx, lastCourse, totalDone, streak, earn, badges, toggleSaved, isSaved };
})();
