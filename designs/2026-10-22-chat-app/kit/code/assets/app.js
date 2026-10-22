/* Natter UI Kit · app.js — shared helpers: icons, theme, chat store (localStorage), avatars, bottom nav, toast, sheets, call overlay */
const Natter = (() => {
  const D = window.NATTER;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- icons: thin rounded line set (24px grid) ---------- */
  const P = {
    chat: '<path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L4.5 19.5l1.3-4A7.5 7.5 0 1 1 20 11.5z"/>',
    phone: '<path d="M5 4.5h3.2l1.6 4-2 1.3a10 10 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z"/>',
    video: '<rect x="3.5" y="6.5" width="12" height="11" rx="3"/><path d="m15.5 10.5 5-3v9l-5-3"/>',
    stories: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="3.2 2.4"/><circle cx="12" cy="12" r="4"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    users: '<circle cx="9" cy="9" r="3.3"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.8a3.3 3.3 0 0 1 0 6.4M17.5 14a6 6 0 0 1 3.5 5.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>',
    back: '<path d="M14.5 6 8.5 12l6 6"/>',
    chevron: '<path d="m9.5 6 6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
    more: '<circle cx="12" cy="6" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18" r="1.3"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    send: '<path d="M4.5 12 20 4.5 15.5 20l-3.2-6.3z"/><path d="m12.3 13.7 7.7-9.2"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
    micoff: '<path d="M9 9V6.5a3 3 0 0 1 5.6-1.5M15 11.5v0a3 3 0 0 1-4.6 2.5M5.5 11.5a6.5 6.5 0 0 0 10.7 5M18.5 11.5a6.4 6.4 0 0 1-.5 2.4M12 18v2.5M4 4l16 16"/>',
    camera: '<path d="M4 8.5A2 2 0 0 1 6 6.5h1.8l1.4-2h5.6l1.4 2H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.4"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><circle cx="9" cy="9.5" r="1.7"/><path d="m4 17 5-4.5 4 3.5 2.5-2 4.5 4"/>',
    location: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.2 4.2 0 0 0 7 0"/><circle cx="9.2" cy="9.8" r=".6" fill="currentColor"/><circle cx="14.8" cy="9.8" r=".6" fill="currentColor"/>',
    clip: '<path d="m19 11.5-7.3 7.3a4.5 4.5 0 0 1-6.4-6.4l7.6-7.6a3 3 0 0 1 4.3 4.3l-7.4 7.4a1.5 1.5 0 0 1-2.1-2.1l6.8-6.8"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<rect x="6.5" y="5" width="3.8" height="14" rx="1.2"/><rect x="13.7" y="5" width="3.8" height="14" rx="1.2"/>',
    check: '<path d="m5.5 12.5 4 4 9-9"/>',
    checks: '<path d="m2.5 12.5 4 4 9-9M11 16.5l1 0 9-9"/>',
    reply: '<path d="M9.5 7 4.5 12l5 5"/><path d="M5 12h9a5.5 5.5 0 0 1 5.5 5.5V19"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    trash: '<path d="M4.5 7h15M10 7V5h4v2M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.5h6.4a1.5 1.5 0 0 0 1.5-1.5l.8-12"/>',
    close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    belloff: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 .7-2.7M9.3 6a5.5 5.5 0 0 1 8.2 5v4M5 18h13M10 20.5a2.2 2.2 0 0 0 4 0M4 4l16 16"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.6 0-.9.7-1.7 1.8-1.7h2a3.9 3.9 0 0 0 3.9-3.9C20.5 6.8 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="11.5" r="1"/><circle cx="10.5" cy="7.6" r="1"/><circle cx="15" cy="7.8" r="1"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.5a2.4 2.4 0 0 1 4.6.9c0 1.7-2.3 2-2.3 3.6"/><circle cx="12" cy="16.8" r=".5" fill="currentColor"/>',
    logout: '<path d="M14 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h7M10 12h10M16.5 8.5 20 12l-3.5 3.5"/>',
    edit: '<path d="M4.5 19.5 5.3 15 15.6 4.7a2 2 0 0 1 2.8 0l.9.9a2 2 0 0 1 0 2.8L9 18.7z"/><path d="m13.5 6.8 3.7 3.7"/>',
    callin: '<path d="M17.5 6.5 8 16M8 9.5V16h6.5"/>',
    callout: '<path d="M7 17 16.5 7.5M10 7.5h6.5V14"/>',
    pin: '<path d="M14.5 4.5 19.5 9.5l-2.5 1-3.5 3.5.5 4-1 1-4-4-4.5 4.5M9 15l-4-4 1-1 4 .5L13.5 7z"/>',
    volume: '<path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    file: '<path d="M7 3.5h7l4.5 4.5v11A1.5 1.5 0 0 1 17 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M13.5 3.5V8h4.5"/>',
  };
  const FILLED = new Set(['play', 'pause']);
  function sprite() {
    if ($('#natter-icons')) return;
    const s = Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
    document.body.insertAdjacentHTML('afterbegin', `<svg id="natter-icons" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`);
  }
  const icon = (name, cls = '') => `<svg class="icon ${FILLED.has(name) ? 'fill' : ''} ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* ---------- theme ---------- */
  const isDark = () => document.documentElement.classList.contains('dark');
  function syncThemeButtons() {
    $$('[data-theme-toggle]').forEach((b) => {
      if (b.classList.contains('switch')) { b.setAttribute('aria-checked', String(isDark())); return; }
      b.innerHTML = icon(isDark() ? 'sun' : 'moon', 'text-[19px]');
      b.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(isDark()));
    });
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('natter.theme', dark ? 'dark' : 'light');
    syncThemeButtons();
  }

  /* ---------- store (natter.*) ---------- */
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem('natter.' + k)); return v ?? d; } catch { return d; } };
  const set = (k, v) => localStorage.setItem('natter.' + k, JSON.stringify(v));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function chats() {
    let list = get('chats', null);
    if (!Array.isArray(list)) { list = clone(D.chats); set('chats', list); }
    return list;
  }
  const saveChats = (list) => set('chats', list);
  const chat = (id) => chats().find((c) => c.id === id);
  function updateChat(id, fn) { const list = chats(); const c = list.find((x) => x.id === id); if (c) { fn(c); saveChats(list); } return c; }
  const settings = () => Object.assign({ receipts: true, lastSeen: true, notify: true, preview: true, wallpaper: 'plain', status: D.me.status, name: D.me.name, bio: D.me.bio }, get('settings', {}));
  const saveSettings = (patch) => set('settings', Object.assign(settings(), patch));

  /* people + chat display helpers */
  const person = (id) => (id === 'me' ? Object.assign({}, D.me, { name: settings().name }) : D.people[id]);
  function chatInfo(c) {
    if (c.kind === 'group') return { name: c.name, initials: c.initials, grad: c.grad, online: false, sub: `${c.members.length + 1} members` };
    const p = D.people[c.id];
    return { name: p.name, initials: p.initials, grad: p.grad, online: p.online, sub: p.online ? 'online' : (p.seen || 'offline') };
  }
  function avatar(who, size = 48, opts = {}) {
    const p = typeof who === 'string' ? (D.people[who] || person(who) || {}) : who;
    const fs = Math.round(size * (p.initials && p.initials.length > 2 ? 0.3 : 0.36));
    return `<span class="av ${opts.cls || ''}" style="width:${size}px;height:${size}px;font-size:${fs}px;background:linear-gradient(135deg,${p.grad[0]},${p.grad[1]})" aria-hidden="true">${esc(p.initials)}${opts.online ?? p.online ? '<i class="on"></i>' : ''}</span>`;
  }
  const lastMsg = (c) => c.messages[c.messages.length - 1];
  function preview(c) {
    const m = lastMsg(c); if (!m) return '';
    const who = m.from === 'me' ? 'You: ' : (c.kind === 'group' ? D.people[m.from].name.split(' ')[0] + ': ' : '');
    const body = m.type === 'voice' ? 'Voice note · ' + fmt(m.dur) : m.type === 'image' ? 'Photo' + (m.text ? ' · ' + m.text : '') : m.type === 'location' ? 'Location' : m.text;
    return who + body;
  }
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const unreadTotal = () => chats().reduce((n, c) => n + (c.unread || 0), 0);

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800);
  }

  /* ---------- bottom nav ---------- */
  function nav(active) {
    const items = [['chats', 'index.html', 'chat', 'Chats'], ['calls', 'calls.html', 'phone', 'Calls'], ['stories', 'index.html#stories', 'stories', 'Stories'], ['profile', 'profile.html', 'user', 'Profile']];
    const n = unreadTotal();
    document.body.insertAdjacentHTML('beforeend', `<div class="navfade"></div>
    <nav class="navbar fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] h-[66px] rounded-full flex items-center justify-around px-3" aria-label="Main">
      ${items.map(([k, href, ic, lbl]) => `<a href="${href}" data-nav="${k}" class="h-11 rounded-full flex items-center justify-center gap-1.5 px-3 ${k === active ? 'pillon' : ''}" ${k === active ? 'aria-current="page"' : ''} aria-label="${lbl}">
        ${icon(ic, 'text-[22px]')}<span class="lbl hidden text-[13px] font-semibold">${lbl}</span>${k === 'chats' && n && active !== 'chats' ? `<span class="nb">${n}</span>` : ''}</a>`).join('')}
    </nav>`);
  }

  /* ---------- sheets ---------- */
  function sheet(id) {
    const el = $('#' + id), sc = $('#' + id + '-scrim');
    const open = () => { el.classList.add('open'); sc && sc.classList.add('open'); el.setAttribute('aria-hidden', 'false'); const f = el.querySelector('input,button,select'); f && setTimeout(() => f.focus(), 60); };
    const close = () => { el.classList.remove('open'); sc && sc.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); };
    sc && sc.addEventListener('click', close);
    el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.classList.contains('open')) close(); });
    return { open, close, el };
  }

  /* ---------- call overlay (voice / video, with timer, mute, speaker, end) ---------- */
  let callTimer;
  function startCall(id, video = false) {
    const c = chat(id) || { id, kind: 'dm' }; const info = c.kind ? chatInfo(c) : chatInfo({ id, kind: 'dm' });
    let el = $('#call');
    if (!el) {
      document.body.insertAdjacentHTML('beforeend', `<div id="call" class="overlay fixed inset-0 z-[85] welcome flex flex-col items-center text-center px-6 pt-20 pb-12" role="dialog" aria-modal="true" aria-label="Call">
        <div id="call-av"></div><h2 id="call-name" class="text-[26px] font-semibold mt-6"></h2><p id="call-state" class="text-white/75 text-[14px] mt-1">Calling…</p>
        <div class="flex-1"></div>
        <div class="flex items-center gap-5">
          <button type="button" id="call-mute" class="btn-round glass !w-14 !h-14" aria-pressed="false" aria-label="Mute">${icon('micoff', 'text-[22px]')}</button>
          <button type="button" id="call-speaker" class="btn-round glass !w-14 !h-14" aria-pressed="false" aria-label="Speaker">${icon('volume', 'text-[22px]')}</button>
          <button type="button" id="call-video" class="btn-round glass !w-14 !h-14" aria-pressed="false" aria-label="Video">${icon('video', 'text-[22px]')}</button>
          <button type="button" id="call-end" class="btn-round !w-16 !h-16 !bg-[#FF5C8A] !text-white" aria-label="End call">${icon('phone', 'text-[24px] rotate-[135deg]')}</button>
        </div></div>`);
      el = $('#call');
      ['call-mute', 'call-speaker', 'call-video'].forEach((b) => $('#' + b).addEventListener('click', (e) => { const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(on)); e.currentTarget.style.background = on ? '#fff' : ''; e.currentTarget.style.color = on ? '#5B3FD0' : ''; }));
      $('#call-end').addEventListener('click', endCall);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.classList.contains('open')) endCall(); });
    }
    $('#call-av').innerHTML = `<div class="ring !bg-white/30">${avatar(info, 120, { online: false })}</div>`;
    $('#call-name').textContent = info.name; $('#call-state').textContent = video ? 'Video calling…' : 'Calling…';
    $('#call-video').setAttribute('aria-pressed', String(video)); $('#call-video').style.background = video ? '#fff' : ''; $('#call-video').style.color = video ? '#5B3FD0' : '';
    el.classList.add('open'); el.dataset.id = id;
    let s = 0; clearInterval(callTimer);
    callTimer = setInterval(() => { s++; if (s >= 2) $('#call-state').textContent = fmt(s - 2); }, 1000);
    const log = get('calllog', []); log.unshift({ id: 'c' + Date.now(), who: id, dir: 'out', video, t: 'Today, ' + now(), dur: '0:00' }); set('calllog', log);
  }
  function endCall() {
    const el = $('#call'); if (!el) return; clearInterval(callTimer);
    const st = $('#call-state').textContent; const log = get('calllog', []); if (log[0]) { log[0].dur = /\d:\d\d/.test(st) ? st : '0:00'; set('calllog', log); }
    el.classList.remove('open'); toast('Call ended'); document.dispatchEvent(new CustomEvent('natter:callend'));
  }

  function init() {
    sprite(); syncThemeButtons();
    $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
    if (new URLSearchParams(location.search).get('shot')) document.documentElement.classList.add('shot');
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

  return { D, $, $$, esc, icon, get, set, chats, saveChats, chat, updateChat, chatInfo, avatar, person, preview, lastMsg, fmt, now, unreadTotal,
    toast, nav, sheet, startCall, endCall, isDark, toggleTheme, settings, saveSettings, sprite, syncThemeButtons };
})();
