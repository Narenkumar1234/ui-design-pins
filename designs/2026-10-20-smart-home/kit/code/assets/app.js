/* Hearth UI Kit · app.js — shared helpers: icons, theme toggle, device store (localStorage), nav + FAB, add-device sheet, toast */
const Hearth = (() => {
  const D = window.HEARTH;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- icons: thin rounded line set (24px grid) ---------- */
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    bolt: '<path d="M13 3.5 5.5 13.5H12l-1 7 7.5-10H12z"/>',
    gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>',
    bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    back: '<path d="M14.5 6 8.5 12l6 6"/>',
    chevron: '<path d="m9.5 6 6 6-6 6"/>',
    down: '<path d="m7 10 5 5 5-5"/>',
    more: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
    power: '<path d="M12 4v7"/><path d="M7.2 7.2a7 7 0 1 0 9.6 0"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    bulb: '<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3.5a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2v1.2h5.2v-1.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z"/>',
    ac: '<rect x="3.5" y="5" width="17" height="8" rx="2.5"/><path d="M7 10h10M8 16.5c0 1.5-1 2-1 3M12 16.5v3M16 16.5c0 1.5 1 2 1 3"/>',
    tv: '<rect x="3.5" y="5" width="17" height="11.5" rx="2.5"/><path d="M9 20h6"/>',
    wifi: '<path d="M4 9.5a12 12 0 0 1 16 0M7 12.8a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r=".6"/>',
    plug: '<path d="M9 3.5v4M15 3.5v4M7 7.5h10v3a5 5 0 0 1-10 0z"/><path d="M12 15.5v5"/>',
    purifier: '<rect x="6.5" y="3.5" width="11" height="17" rx="3"/><path d="M9.5 8h5M9.5 11h5M9.5 14h5"/>',
    speaker: '<rect x="6" y="3.5" width="12" height="17" rx="3"/><circle cx="12" cy="14" r="3"/><circle cx="12" cy="7.5" r=".8"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M6 10h12M9 6v2M9 13v3"/>',
    sofa: '<path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"/><path d="M3.5 13a1.5 1.5 0 0 1 3 0v1.5h11V13a1.5 1.5 0 0 1 3 0v4.5h-17zM6 17.5V19M18 17.5V19"/>',
    bed: '<path d="M3.5 18.5V7M3.5 14h17v4.5M20.5 14v-2a3 3 0 0 0-3-3H11v5"/><circle cx="7.5" cy="11" r="1.6"/>',
    pot: '<path d="M4.5 10h15M6 10v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6M3 10h1.5M19.5 10H21M9.5 6.5c0-1 1-1 1-2M13.5 6.5c0-1 1-1 1-2"/>',
    desk: '<path d="M3.5 9.5h17M5.5 9.5v10M18.5 9.5v10M13 13h5.5"/><path d="M8 9.5 10 4.5h2"/>',
    snow: '<path d="M12 3.5v17M4.6 7.75l14.8 8.5M4.6 16.25l14.8-8.5"/><path d="m9.5 4.8 2.5 2 2.5-2M9.5 19.2l2.5-2 2.5 2"/>',
    flame: '<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.5-2.4-5.6-3.6-8.8-2.2 1.7-2.8 3.9-2.8 5.4-1-1-1.6-2.1-1.8-3.4C7.8 10 5.5 12 5.5 14.8 5.5 18.4 8.1 21 12 21z"/>',
    drop: '<path d="M12 3.5c3 3.8 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6.2 5.5-10z"/>',
    fan: '<circle cx="12" cy="12" r="1.6"/><path d="M12 10.4c0-3.5.8-6.4 3-6.4 2 0 2.2 3.4-3 6.4zM13.4 12.8c3 1.8 5 4 3.9 5.9-1 1.7-4-.1-3.9-5.9zM10.6 12.8c-3 1.7-6 2.4-7 .5-1-1.7 2-3.3 7-.5z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M8 5v14M16 5v14M3.5 9.5H8M3.5 14.5H8M16 9.5h4.5M16 14.5h4.5"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    thermo: '<path d="M10 14.2V5.5a2 2 0 0 1 4 0v8.7a4 4 0 1 1-4 0z"/><path d="M12 9v6.5"/>',
    humid: '<path d="M12 4c2.6 3.2 4.8 6 4.8 8.7a4.8 4.8 0 0 1-9.6 0C7.2 10 9.4 7.2 12 4z"/><path d="M10 13.5a2 2 0 0 0 2 2"/>',
    minus: '<path d="M6 12h12"/>',
    arrowdown: '<path d="M12 5v13M6.5 12.5 12 18l5.5-5.5"/>',
    close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
  };
  const FILLED = new Set(['bolt']);
  function sprite() {
    if ($('#hearth-icons')) return;
    const s = Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
    document.body.insertAdjacentHTML('afterbegin', `<svg id="hearth-icons" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`);
  }
  const icon = (name, cls = '') => `<svg class="icon ${FILLED.has(name) ? 'fill' : ''} ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const typeIcon = { light: 'bulb', ac: 'ac', tv: 'tv', wifi: 'wifi', plug: 'plug', purifier: 'purifier', speaker: 'speaker', fridge: 'fridge' };

  /* ---------- theme ---------- */
  const isDark = () => document.documentElement.classList.contains('dark');
  function syncThemeButtons() {
    $$('[data-theme-toggle]').forEach((b) => {
      b.innerHTML = icon(isDark() ? 'sun' : 'moon', 'text-[19px]');
      b.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(isDark()));
    });
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('hearth.theme', dark ? 'dark' : 'light');
    syncThemeButtons(); document.dispatchEvent(new CustomEvent('hearth:theme'));
  }

  /* ---------- store: devices / scenes in localStorage (hearth.*) ---------- */
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem('hearth.' + k)); return v ?? d; } catch { return d; } };
  const set = (k, v) => localStorage.setItem('hearth.' + k, JSON.stringify(v));
  function devices() {
    let list = get('devices', null);
    if (!Array.isArray(list)) { list = JSON.parse(JSON.stringify(D.devices)); set('devices', list); }
    return list;
  }
  const device = (id) => devices().find((d) => d.id === id);
  function update(id, patch) {
    const list = devices(); const d = list.find((x) => x.id === id); if (!d) return null;
    Object.assign(d, patch); set('devices', list); document.dispatchEvent(new CustomEvent('hearth:devices', { detail: { id } })); return d;
  }
  function addDevice(dev) {
    const list = devices(); list.push(dev); set('devices', list); document.dispatchEvent(new CustomEvent('hearth:devices', { detail: { id: dev.id } }));
  }
  const room = (id) => D.rooms.find((r) => r.id === id) || D.rooms[0];
  const onCount = (list = devices()) => list.filter((d) => d.on).length;
  function applyScene(id) {
    const sc = D.scenes.find((s) => s.id === id); if (!sc) return 0;
    const list = devices(); let changed = 0;
    list.forEach((d) => {
      let want;
      if (sc.set === '*off') want = (sc.keep || []).includes(d.id) ? d.on : false; else if (d.id in sc.set) want = sc.set[d.id];
      if (want !== undefined && want !== d.on) { d.on = want; changed++; }
      if (sc.dim && sc.dim[d.id] != null && d.brightness !== sc.dim[d.id]) { d.brightness = sc.dim[d.id]; changed += want === undefined ? 1 : 0; }
      if (sc.target && sc.target[d.id] != null) d.target = sc.target[d.id];
    });
    set('devices', list); set('scene', id); document.dispatchEvent(new CustomEvent('hearth:devices', {}));
    return changed;
  }
  /* device subtitle, e.g. "4 lamps · 80%" or "22° · Cool" */
  function meta(d) {
    if (d.type === 'light') return d.on ? `${d.lamps} lamp${d.lamps > 1 ? 's' : ''} · ${d.brightness}%` : `${d.lamps} lamp${d.lamps > 1 ? 's' : ''}`;
    if (d.type === 'ac') return d.on ? `${d.target}° · ${(D.modes.find((m) => m.id === d.mode) || D.modes[0]).name}` : `Set to ${d.target}°`;
    if (d.type === 'wifi') return d.on ? `${d.clients} devices` : 'Offline';
    if (d.type === 'purifier') return d.on ? 'Auto · PM2.5 12' : 'Idle';
    if (d.type === 'fridge') return d.on ? '4° · Eco' : 'Off';
    if (d.type === 'tv') return d.on ? 'Netflix' : 'Standby';
    return d.on ? 'Running' : 'Standby';
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- UI bits ---------- */
  let tt;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1900);
  }
  function navbar(active) {
    const left = [['home', 'Home', 'index.html'], ['grid', 'Rooms', 'room.html']];
    const right = [['bolt', 'Energy', 'energy.html'], ['gear', 'Settings', '#settings']];
    const a = ([ic, label, href]) => `<a href="${href}" ${label === active ? 'aria-current="page"' : ''} aria-label="${label}"
      class="flex-1 h-[56px] flex flex-col items-center justify-center text-[11px] font-medium transition">${icon(ic, 'text-[22px]')}</a>`;
    const nav = document.createElement('nav');
    nav.className = 'navbar fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] rounded-full px-3 flex items-center';
    nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = left.map(a).join('') + `<button type="button" id="fab" class="fab mx-2" aria-label="Add device">${icon('plus', 'text-[26px]')}</button>` + right.map(a).join('');
    const fade = document.createElement('div'); fade.className = 'navfade'; document.body.append(fade, nav);
    nav.querySelector('a[href="#settings"]').addEventListener('click', (e) => { e.preventDefault(); toast('Settings: your next feature to build'); });
    $('#fab').addEventListener('click', openAdd);
  }
  /* add-device bottom sheet (opened by the + FAB) */
  function addSheet() {
    if ($('#add-sheet')) return;
    const types = ['light', 'ac', 'tv', 'plug', 'speaker', 'purifier'];
    document.body.insertAdjacentHTML('beforeend', `
    <div id="add-scrim" class="scrim fixed inset-0 z-50 bg-black/50"></div>
    <section id="add-sheet" class="sheet fixed z-[60] bottom-0 inset-x-0 mx-auto w-full max-w-md bg-surface rounded-t-[30px] px-5 pt-3 pb-7" role="dialog" aria-modal="true" aria-labelledby="add-title">
      <div class="w-10 h-1.5 rounded-full bg-raised mx-auto"></div>
      <div class="flex items-center justify-between mt-4"><h2 id="add-title" class="text-[22px] font-semibold">Add a device</h2>
        <button type="button" id="add-close" class="btn-round !bg-raised" aria-label="Close">${icon('close')}</button></div>
      <form id="add-form" class="mt-4 space-y-3" novalidate>
        <label class="block"><span class="text-[13px] text-muted">Name</span><input id="add-name" class="field mt-1" placeholder="e.g. Balcony lights" maxlength="24" autocomplete="off"></label>
        <label class="block"><span class="text-[13px] text-muted">Room</span>
          <select id="add-room" class="field mt-1">${D.rooms.map((r) => `<option value="${r.id}">${r.name}</option>`).join('')}</select></label>
        <div><span class="text-[13px] text-muted">Type</span>
          <div id="add-types" class="grid grid-cols-3 gap-2 mt-1">${types.map((t, i) => `<button type="button" data-type="${t}" aria-pressed="${i === 0}" class="chip !justify-center !bg-raised aria-pressed:!bg-primary">${icon(typeIcon[t], 'text-[18px]')}<span>${{ ac: 'AC', tv: 'TV' }[t] || t[0].toUpperCase() + t.slice(1)}</span></button>`).join('')}</div></div>
        <p id="add-err" class="text-[13px] text-deep h-4"></p>
        <button class="pill-primary w-full h-14 rounded-full font-semibold text-[16px]">Add device</button>
      </form>
    </section>`);
    let type = 'light';
    $$('#add-types [data-type]').forEach((b) => b.addEventListener('click', () => {
      type = b.dataset.type; $$('#add-types [data-type]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    $('#add-close').addEventListener('click', closeAdd); $('#add-scrim').addEventListener('click', closeAdd);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAdd(); });
    $('#add-form').addEventListener('submit', (e) => {
      e.preventDefault(); const name = $('#add-name').value.trim();
      if (name.length < 2) { $('#add-err').textContent = 'Give your device a name'; $('#add-name').focus(); return; }
      const dev = { id: 'd' + Date.now().toString(36), name, type, room: $('#add-room').value, on: true, kw: 2 };
      if (type === 'light') Object.assign(dev, { lamps: 1, brightness: 70, temp: 2700 });
      if (type === 'ac') Object.assign(dev, { target: 23, mode: 'cool', fan: 2, kw: 30 });
      addDevice(dev); closeAdd(); $('#add-form').reset(); $('#add-err').textContent = ''; toast(`${name} added to ${room(dev.room).name}`);
    });
  }
  function openAdd() { addSheet(); $('#add-scrim').classList.add('open'); $('#add-sheet').classList.add('open'); setTimeout(() => $('#add-name').focus(), 50); }
  function closeAdd() { if (!$('#add-sheet')) return; $('#add-scrim').classList.remove('open'); $('#add-sheet').classList.remove('open'); }

  /* slide-to-confirm pill: drag the orange knob to the end (or click / press Enter) to fire onDone */
  function slidePill(el, onDone) {
    const knob = $('.knob', el), fill = $('.fillbar', el); let x0 = null, dx = 0, moved = false;
    const max = () => el.clientWidth - knob.offsetWidth - 14;
    const setX = (x) => { dx = Math.max(0, Math.min(max(), x)); knob.style.transform = `translateX(${dx}px)`; if (fill) fill.style.width = (dx + knob.offsetWidth + 7) + 'px'; };
    const reset = () => { knob.style.transition = 'transform .3s'; if (fill) fill.style.transition = 'width .3s'; setX(0); if (fill) fill.style.width = '0';
      setTimeout(() => { knob.style.transition = ''; if (fill) fill.style.transition = ''; }, 300); };
    knob.addEventListener('pointerdown', (e) => { x0 = e.clientX; moved = false; knob.setPointerCapture(e.pointerId); });
    knob.addEventListener('pointermove', (e) => { if (x0 == null) return; if (Math.abs(e.clientX - x0) > 4) moved = true; setX(e.clientX - x0); });
    knob.addEventListener('pointerup', () => { if (x0 == null) return; x0 = null; const done = dx > max() * 0.8; reset(); if (done) onDone(); });
    el.addEventListener('click', (e) => { if (moved) { moved = false; return; } onDone(); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDone(); } });
  }

  function boot(active) {
    sprite();
    if (active) navbar(active);
    syncThemeButtons();
    $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
  }
  return { D, $, $$, icon, typeIcon, boot, toast, get, set, devices, device, update, room, onCount, applyScene, meta, esc, isDark, openAdd, slidePill };
})();
