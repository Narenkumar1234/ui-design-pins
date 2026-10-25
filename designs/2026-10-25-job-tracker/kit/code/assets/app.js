/* Orbit UI Kit · app.js — shared core used by every page.
   Storage + state (localStorage, keys prefixed "orbit."), date/salary formatters, icons, the app shell (sidebar, top bar with search,
   mobile bottom nav), add / edit / delete modal, toast with undo, CSV export. Pages call Orbit.init('board') and listen for
   'orbit:change' (data changed) and 'orbit:search' (top-bar query changed). */
(function () {
  const D = window.ORBIT_DATA;
  const PFX = 'orbit.';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(PFX + k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(PFX + k, JSON.stringify(v)); },
    del(k) { localStorage.removeItem(PFX + k); },
  };

  /* ---------- clock + dates ---------- */
  const now = () => (D.demoNow ? new Date(D.demoNow) : new Date());
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { if (!s) return null; const [a, b] = s.split('T'); const [y, m, d] = a.split('-').map(Number); const [hh, mm] = (b || '00:00').split(':').map(Number); return new Date(y, m - 1, d, hh || 0, mm || 0); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const startOfWeek = (d) => { const x = startOfDay(d); const wd = (x.getDay() + 6) % 7; return addDays(x, -wd); }; // Monday
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fmtDate = (s) => { const d = typeof s === 'string' ? parse(s) : s; return d ? `${d.getDate()} ${MON[d.getMonth()]}` : '—'; };
  const fmtDay = (s) => { const d = typeof s === 'string' ? parse(s) : s; return d ? `${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}` : '—'; };
  const fmtTime = (s) => { const d = typeof s === 'string' ? parse(s) : s; return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : ''; };
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 864e5);
  const ago = (s) => { if (!s) return 'not applied yet'; const n = daysBetween(parse(s), now()); return n <= 0 ? 'applied today' : n === 1 ? 'applied yesterday' : n < 7 ? `applied ${n}d ago` : `applied ${Math.floor(n / 7)}w ago`; };
  const until = (s) => { const n = daysBetween(now(), parse(s)); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 ? `in ${n} days` : `${-n}d ago`; };

  /* ---------- settings + money ---------- */
  const DEF_SETTINGS = { name: D.user.name, goal: 5, currency: 'INR', reminders: true, reminderHours: 24, compact: false };
  const settings = () => ({ ...DEF_SETTINGS, ...ls.get('settings', {}) });
  const saveSettings = (s) => { ls.set('settings', s); emit('orbit:change', { what: 'settings' }); };
  const fmtSalary = (a) => {
    if (!a || !a.salary) return '—';
    const usd = settings().currency === 'USD'; const n = Number(a.salary);
    if (usd) return a.per === 'yr' ? `$${Math.round(n / 1000)}k/yr` : `$${n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k' : n}/mo`;
    if (a.per === 'yr') return `₹${+(n / 100000).toFixed(1)} LPA`;
    return `₹${n >= 1000 ? +(n / 1000).toFixed(1) + 'k' : n}/mo`;
  };
  const fmtSalaryLong = (a) => {
    if (!a || !a.salary) return '—';
    const usd = settings().currency === 'USD';
    return `${usd ? '$' : '₹'}${Number(a.salary).toLocaleString(usd ? 'en-US' : 'en-IN')} / ${a.per === 'yr' ? 'year' : 'month'}`;
  };

  /* ---------- applications ---------- */
  const STATUSES = D.statuses; const ST = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));
  function seedTimeline(a) {
    if (a.timeline) return a.timeline;
    const t = [];
    if (a.status === 'wishlist' || !a.applied) { t.push({ date: '2026-10-18', label: 'Saved to wishlist' }); return t; }
    const ap = parse(a.applied);
    t.push({ date: iso(addDays(ap, -2)), label: 'Saved to wishlist' }, { date: a.applied, label: `Applied via ${a.source || 'website'}` });
    if (a.status === 'interview') t.push({ date: iso(addDays(ap, 6)), label: 'Moved to Interview' });
    if (a.status === 'offer') t.push({ date: iso(addDays(ap, 9)), label: 'Moved to Interview' }, { date: iso(addDays(ap, 17)), label: 'Final round' }, { date: iso(addDays(ap, 27)), label: 'Offer received' });
    if (a.status === 'rejected') t.push({ date: iso(addDays(ap, 8)), label: 'Rejected' });
    return t;
  }
  const seed = () => D.applications.map((a) => ({ notes: '', contacts: [], interview: null, link: '', ...JSON.parse(JSON.stringify(a)), timeline: seedTimeline(a), updated: a.applied || '2026-10-18' }));
  let APPS = ls.get('apps', null);
  if (!Array.isArray(APPS)) { APPS = seed(); ls.set('apps', APPS); }
  const apps = () => APPS;
  const get = (id) => APPS.find((a) => a.id === id);
  const persist = (what, id) => { ls.set('apps', APPS); emit('orbit:change', { what, id }); };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app';
  function upsert(data) {
    let a = data.id && get(data.id);
    if (a) { Object.assign(a, data, { updated: iso(now()) }); persist('update', a.id); return a; }
    let id = slug(data.company); while (get(id)) id += '-' + Math.floor(Math.random() * 90 + 10);
    a = { notes: '', contacts: [], interview: null, link: '', source: 'Other', color: APPS.length % D.logoColors.length, ...data, id, updated: iso(now()),
      timeline: [{ date: iso(now()), label: data.status === 'wishlist' ? 'Saved to wishlist' : `Added as ${ST[data.status]}` }] };
    APPS.unshift(a); persist('create', id); return a;
  }
  function remove(id) { const i = APPS.findIndex((a) => a.id === id); if (i < 0) return null; const [a] = APPS.splice(i, 1); persist('delete', id); return { a, i }; }
  function restore(r) { if (!r) return; APPS.splice(r.i, 0, r.a); persist('create', r.a.id); }
  function move(id, status, index) {
    const a = get(id); if (!a || !ST[status]) return;
    const changed = a.status !== status;
    if (changed) {
      a.status = status; a.updated = iso(now());
      if (status !== 'wishlist' && !a.applied) a.applied = iso(now());
      a.timeline.push({ date: iso(now()), label: `Moved to ${ST[status]}` });
    }
    if (index != null) { // reorder within the target column
      const others = APPS.filter((x) => x !== a); const col = others.filter((x) => x.status === status);
      const before = col[index]; const at = before ? others.indexOf(before) : (col.length ? others.indexOf(col[col.length - 1]) + 1 : others.length);
      others.splice(at, 0, a); APPS.length = 0; APPS.push(...others);
    }
    persist('move', id); return changed;
  }
  function stats(list = APPS) {
    const by = Object.fromEntries(STATUSES.map((s) => [s.id, 0])); list.forEach((a) => by[a.status]++);
    const submitted = list.filter((a) => a.status !== 'wishlist').length;
    const responded = by.interview + by.offer + by.rejected;
    const t = now(); const ws = startOfWeek(t);
    const weeks = Array.from({ length: 8 }, (_, i) => { const s = addDays(ws, (i - 7) * 7); return { start: s, count: 0, label: fmtDate(s) }; });
    list.forEach((a) => { if (!a.applied) return; const d = parse(a.applied); const w = weeks.find((x) => d >= x.start && d < addDays(x.start, 7)); if (w) w.count++; });
    const upcoming = list.filter((a) => a.interview && a.interview.at && parse(a.interview.at) >= startOfDay(t)).sort((x, y) => parse(x.interview.at) - parse(y.interview.at));
    return { by, total: list.length, submitted, responded, rate: submitted ? Math.round((responded / submitted) * 100) : 0, weeks, thisWeek: weeks[7].count, upcoming };
  }

  /* ---------- icons (24px line icons) ---------- */
  const P = {
    dash: '<rect x="3" y="3" width="7.5" height="9" rx="2"/><rect x="13.5" y="3" width="7.5" height="5" rx="2"/><rect x="13.5" y="11" width="7.5" height="10" rx="2"/><rect x="3" y="15" width="7.5" height="6" rx="2"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx="1.6"/><rect x="9.5" y="4" width="5" height="11" rx="1.6"/><rect x="16" y="4" width="5" height="7" rx="1.6"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    money: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v5M18 9.5v5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>', arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>', chevR: '<path d="m9 6 6 6-6 6"/>', chevD: '<path d="m6 9 6 6 6-6"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10 5-3v10l-5-3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;
  const LOGO = `<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="rgb(var(--brand))"/><ellipse cx="16" cy="16" rx="11" ry="5.2" fill="none" stroke="#C6F35E" stroke-width="2" transform="rotate(-28 16 16)"/><circle cx="16" cy="16" r="4.2" fill="#F6F5F0"/><circle cx="25" cy="11.3" r="2.3" fill="#C6F35E"/></svg>`;
  const initials = (s) => String(s || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const mono = (a, cls = '') => { const c = D.logoColors[(a.color ?? 0) % D.logoColors.length]; const dark = c === '#C6F35E' || c === '#B8A57A'; return `<span class="mono ${cls}" style="background:${c};color:${dark ? '#14181A' : '#fff'}" aria-hidden="true">${esc(initials(a.company))}</span>`; };
  const pill = (st) => `<span class="pill-st" data-st="${st}"><span class="st-dot"></span>${ST[st]}</span>`;

  /* ---------- events ---------- */
  const emit = (n, detail) => document.dispatchEvent(new CustomEvent(n, { detail }));
  const on = (n, fn) => document.addEventListener(n, (e) => fn(e.detail || {}));

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg, undo) {
    let t = $('#toast'); if (t) t.remove(); clearTimeout(toastT);
    t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button type="button" id="toast-undo">Undo</button>' : ''}`;
    document.body.appendChild(t);
    if (undo) $('#toast-undo', t).onclick = () => { undo(); t.remove(); };
    toastT = setTimeout(() => t.remove(), undo ? 6000 : 2600);
  }

  /* ---------- CSV ---------- */
  const CSV_COLS = ['company', 'role', 'status', 'type', 'mode', 'location', 'salary', 'per', 'applied', 'interview', 'source', 'link', 'notes'];
  function toCSV(list = APPS) {
    const cell = (v) => { v = String(v ?? ''); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
    const rows = list.map((a) => CSV_COLS.map((k) => cell(k === 'interview' ? (a.interview?.at || '') : k === 'status' ? ST[a.status] : a[k])).join(','));
    return [CSV_COLS.join(','), ...rows].join('\n');
  }
  function exportCSV(list = APPS) {
    const blob = new Blob(['\ufeff' + toCSV(list)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `orbit-applications-${iso(now())}.csv`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast(`Exported ${list.length} applications`);
  }

  /* ---------- calendar invite (.ics, 60 min, 1 h alarm) ---------- */
  function downloadICS(a) {
    const d = parse(a.interview.at); const e = new Date(d.getTime() + 60 * 6e4);
    const f = (x) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}T${String(x.getHours()).padStart(2, '0')}${String(x.getMinutes()).padStart(2, '0')}00`;
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Orbit//Job Tracker//EN', 'BEGIN:VEVENT', `UID:${a.id}-${f(d)}@orbit`, `DTSTART:${f(d)}`, `DTEND:${f(e)}`, `SUMMARY:${a.interview.kind} · ${a.company}`, `DESCRIPTION:${a.role} at ${a.company}`, `LOCATION:${a.interview.where || ''}`, 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Interview reminder', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); const l = document.createElement('a'); l.href = url; l.download = `${a.id}-interview.ics`; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Calendar invite downloaded');
  }
  /* ---------- theme ---------- */
  const isDark = () => document.documentElement.classList.contains('dark');
  function setTheme(t) {
    ls.set('theme', t);
    const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark); $$('[data-theme-toggle]').forEach(paintToggle); emit('orbit:theme', { t });
  }
  const paintToggle = (b) => { b.innerHTML = icon(isDark() ? 'sun' : 'moon'); b.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode'); };

  /* ---------- shell ---------- */
  const NAV = [['dashboard', 'index.html', 'Dashboard', 'dash'], ['board', 'board.html', 'Board', 'board'], ['interviews', 'interviews.html', 'Interviews', 'cal'], ['settings', 'settings.html', 'Settings', 'cog']];
  function shell(pageId) {
    const st = stats(); const s = settings(); const goalPct = Math.min(100, Math.round((st.thisWeek / Math.max(1, s.goal)) * 100));
    const navCur = pageId === 'application' ? 'board' : pageId;
    $('#sidebar').innerHTML = `
      <a href="index.html" class="flex items-center gap-2.5 px-2 mb-8"><span>${LOGO}</span><span class="font-display text-[22px] font-bold tracking-tight">Orbit</span></a>
      <nav class="flex flex-col gap-1" aria-label="Main">${NAV.map(([id, href, label, ic]) => `<a class="nav-item" data-nav="${id}" href="${href}"${id === navCur ? ' aria-current="page"' : ''}>${icon(ic)}${label}${id === 'interviews' && st.upcoming.length ? `<span class="badge">${st.upcoming.length}</span>` : ''}</a>`).join('')}</nav>
      <div class="mt-auto card p-4" id="goal-card">
        <p class="label">Weekly goal</p>
        <p class="mt-1 font-display text-[22px] font-bold"><span id="goal-n">${st.thisWeek}</span><span class="text-muted text-[16px] font-medium"> / ${s.goal} applications</span></p>
        <div class="mt-3 h-2 rounded-full bg-line overflow-hidden"><div class="h-full rounded-full bg-lime" style="width:${goalPct}%"></div></div>
        <p class="mt-2 text-[12px] text-muted">${st.thisWeek >= s.goal ? 'Goal hit. Nice work!' : `${s.goal - st.thisWeek} more to hit your goal`}</p>
      </div>`;
    $('#topbar').innerHTML = `
      <a href="index.html" class="lg:hidden flex items-center gap-2 mr-1" aria-label="Orbit home">${LOGO}<span class="font-display text-[19px] font-bold hidden sm:inline">Orbit</span></a>
      <div class="relative flex-1 min-w-0 max-w-[460px]" id="search-wrap">
        <label class="sr-only" for="search">Search applications</label>
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">${icon('search', 'sm')}</span>
        <input id="search" class="input !h-[42px] !rounded-full !pl-10 !pr-12 !bg-card" type="search" autocomplete="off" placeholder="Search companies, roles…" value="${esc(new URLSearchParams(location.search).get('q') || '')}">
        <kbd class="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted border border-line rounded-md px-1.5 py-0.5">/</kbd>
        <div id="search-pop" class="srch-pop hidden"></div>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <button type="button" class="btn-icon" data-theme-toggle></button>
        <button type="button" class="btn btn-primary hidden sm:inline-flex" data-add>${icon('plus', 'sm')}Add application</button>
        <a href="settings.html" class="hidden sm:grid w-[42px] h-[42px] rounded-full place-items-center font-display font-bold text-[14px] bg-lime text-[#14181A]" aria-label="Profile and settings" id="avatar">${esc(initials(s.name))}</a>
      </div>`;
    const mn = document.createElement('nav'); mn.className = 'mnav'; mn.id = 'mnav'; mn.setAttribute('aria-label', 'Main');
    mn.innerHTML = NAV.map(([id, href, label, ic]) => `<a href="${href}" data-nav="${id}"${id === navCur ? ' aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`).join('');
    document.body.appendChild(mn);
    const fab = document.createElement('button'); fab.type = 'button'; fab.className = 'sm:hidden fixed right-5 bottom-[90px] z-40 w-14 h-14 rounded-full grid place-items-center btn-primary shadow-lg'; fab.setAttribute('data-add', ''); fab.setAttribute('aria-label', 'Add application'); fab.id = 'fab'; fab.innerHTML = icon('plus');
    document.body.appendChild(fab);
    $$('[data-theme-toggle]').forEach((b) => { paintToggle(b); b.onclick = () => { setTheme(isDark() ? 'light' : 'dark'); toast(isDark() ? 'Dark mode on' : 'Light mode on'); }; });
    $$('[data-add]').forEach((b) => (b.onclick = () => openModal()));
    initSearch(pageId);
  }
  function refreshShell(pageId) { const g = $('#sidebar'); if (!g) return; const mn = $('#mnav'), fab = $('#fab'); mn && mn.remove(); fab && fab.remove(); const q = $('#search')?.value; shell(pageId); if (q) $('#search').value = q; }

  /* ---------- search (top bar) ---------- */
  function initSearch(pageId) {
    const inp = $('#search'), pop = $('#search-pop'); let sel = -1;
    const match = (q) => { q = q.trim().toLowerCase(); return !q ? [] : APPS.filter((a) => `${a.company} ${a.role} ${a.location} ${ST[a.status]}`.toLowerCase().includes(q)); };
    const render = () => {
      const q = inp.value; emit('orbit:search', { q });
      if (pageId === 'board' || !q.trim()) { pop.classList.add('hidden'); return; }
      const r = match(q).slice(0, 6); sel = Math.min(sel, r.length - 1);
      pop.innerHTML = `<div class="menu !static" role="listbox" id="search-list">${r.length ? r.map((a, i) => `<a role="option" href="application.html?id=${a.id}" data-id="${a.id}"${i === sel ? ' aria-selected="true"' : ''}>${mono(a, 'sm')}<span class="min-w-0 flex-1"><b class="block truncate font-semibold">${esc(a.company)}</b><span class="block truncate text-[12px] text-muted">${esc(a.role)}</span></span>${pill(a.status)}</a>`).join('') : `<p class="px-3 py-3 text-[13px] text-muted">No applications match “${esc(q)}”</p>`}</div>`;
      pop.classList.remove('hidden');
    };
    inp.addEventListener('input', () => { sel = -1; render(); });
    inp.addEventListener('keydown', (e) => {
      const items = $$('#search-list [role=option]');
      if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); sel = (sel + 1) % items.length; render(); }
      else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; render(); }
      else if (e.key === 'Enter' && items.length && pageId !== 'board') { e.preventDefault(); location.href = items[Math.max(0, sel)].getAttribute('href'); }
      else if (e.key === 'Escape') { inp.value = ''; render(); inp.blur(); }
    });
    document.addEventListener('click', (e) => { if (!$('#search-wrap').contains(e.target)) pop.classList.add('hidden'); });
    inp.addEventListener('focus', () => inp.value && render());
    document.addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || $('.scrim');
      if (typing) return;
      if (e.key === '/') { e.preventDefault(); inp.focus(); }
      else if (e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openModal(); }
    });
    if (inp.value) emit('orbit:search', { q: inp.value });
  }

  /* ---------- add / edit / delete modal ---------- */
  function openModal(app, defaults = {}) {
    const a = app || { company: '', role: '', type: 'Internship', mode: 'Remote', location: '', salary: '', per: 'mo', status: 'applied', applied: iso(now()), source: 'LinkedIn', link: '', notes: '', interview: null, ...defaults };
    const opt = (list, v) => list.map((x) => { const [val, lab] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}"${val === v ? ' selected' : ''}>${esc(lab)}</option>`; }).join('');
    const prev = document.activeElement;
    const sc = document.createElement('div'); sc.className = 'scrim'; sc.id = 'modal';
    sc.innerHTML = `<form class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title" novalidate>
      <div class="flex items-center gap-3 mb-5"><h2 id="m-title" class="font-display text-[22px] font-bold flex-1">${app ? 'Edit application' : 'Add application'}</h2><button type="button" class="btn-icon" data-close aria-label="Close">${icon('x')}</button></div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="field"><label for="f-company">Company *</label><input id="f-company" name="company" class="input" value="${esc(a.company)}" placeholder="e.g. Northwind" required><p class="err">Company is required</p></div>
        <div class="field"><label for="f-role">Role *</label><input id="f-role" name="role" class="input" value="${esc(a.role)}" placeholder="e.g. Frontend Intern" required><p class="err">Role is required</p></div>
        <div class="field"><label for="f-status">Status</label><select id="f-status" name="status" class="select">${opt(STATUSES.map((s) => [s.id, s.label]), a.status)}</select></div>
        <div class="field"><label for="f-type">Type</label><select id="f-type" name="type" class="select">${opt(['Internship', 'Full-time', 'Part-time', 'Contract'], a.type)}</select></div>
        <div class="field"><label for="f-mode">Work mode</label><select id="f-mode" name="mode" class="select">${opt(['Remote', 'Hybrid', 'On-site'], a.mode)}</select></div>
        <div class="field"><label for="f-location">Location</label><input id="f-location" name="location" class="input" value="${esc(a.location)}" placeholder="Bengaluru"></div>
        <div class="field"><label for="f-salary">Salary / stipend</label><div class="flex gap-2"><input id="f-salary" name="salary" class="input" inputmode="numeric" value="${esc(a.salary)}" placeholder="45000"><select name="per" class="select !w-[112px] flex-none" aria-label="Per">${opt([['mo', '/ month'], ['yr', '/ year']], a.per)}</select></div></div>
        <div class="field"><label for="f-applied">Applied on</label><input id="f-applied" name="applied" type="date" class="input" value="${esc(a.applied)}"></div>
        <div class="field"><label for="f-int">Interview (optional)</label><input id="f-int" name="interview" type="datetime-local" class="input" value="${esc(a.interview?.at || '')}"></div>
        <div class="field"><label for="f-source">Source</label><select id="f-source" name="source" class="select">${opt(D.sources, a.source)}</select></div>
        <div class="field sm:col-span-2"><label for="f-link">Job link</label><input id="f-link" name="link" type="url" class="input" value="${esc(a.link)}" placeholder="https://"></div>
        <div class="field sm:col-span-2"><label for="f-notes">Notes</label><textarea id="f-notes" name="notes" class="textarea" placeholder="Prep notes, referral, questions to ask…">${esc(a.notes)}</textarea></div>
      </div>
      <div class="flex flex-wrap items-center gap-2 mt-6">
        ${app ? `<button type="button" class="btn btn-danger" id="m-del">${icon('trash', 'sm')}<span>Delete</span></button>` : ''}
        <span class="flex-1"></span>
        <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        <button type="submit" class="btn btn-primary" id="m-save">${app ? 'Save changes' : 'Add application'}</button>
      </div></form>`;
    document.body.appendChild(sc); document.body.style.overflow = 'hidden';
    const form = $('form', sc);
    const close = () => { sc.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); prev && prev.focus && prev.focus(); };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('input,select,textarea,button', form).filter((x) => !x.disabled); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    };
    document.addEventListener('keydown', onKey);
    sc.addEventListener('mousedown', (e) => { if (e.target === sc) close(); });
    $$('[data-close]', sc).forEach((b) => (b.onclick = close));
    setTimeout(() => $('#f-company', sc).focus(), 30);
    const del = $('#m-del', sc);
    if (del) del.onclick = () => {
      if (!del.dataset.confirm) { del.dataset.confirm = '1'; $('span', del).textContent = 'Click again to delete'; return; }
      const r = remove(app.id); close(); toast(`Deleted ${app.company}`, () => restore(r)); emit('orbit:deleted', { id: app.id });
    };
    form.onsubmit = (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(form).entries()); let ok = true;
      ['company', 'role'].forEach((k) => { const bad = !fd[k].trim(); form[k].closest('.field').classList.toggle('invalid', bad); if (bad) { ok = false; } });
      if (!ok) { form.querySelector('.invalid input').focus(); return; }
      const intAt = fd.interview; const keepKind = app?.interview?.kind || 'Interview';
      const data = { company: fd.company.trim(), role: fd.role.trim(), status: fd.status, type: fd.type, mode: fd.mode, location: fd.location.trim() || (fd.mode === 'Remote' ? 'Remote' : ''), salary: fd.salary ? Number(String(fd.salary).replace(/[^0-9.]/g, '')) || '' : '', per: fd.per, applied: fd.status === 'wishlist' && !fd.applied ? '' : fd.applied, source: fd.source, link: fd.link.trim(), notes: fd.notes, interview: intAt ? { at: intAt, kind: keepKind, where: app?.interview?.where || 'Google Meet' } : null };
      if (app) { if (app.status !== data.status) app.timeline.push({ date: iso(now()), label: `Moved to ${ST[data.status]}` }); data.id = app.id; }
      const saved = upsert(data); close(); toast(app ? 'Changes saved' : `Added ${saved.company}`); emit('orbit:saved', { id: saved.id });
    };
    return sc;
  }

  function init(pageId) {
    if (new URLSearchParams(location.search).has('still')) document.documentElement.classList.add('still');
    shell(pageId);
    on('orbit:change', () => refreshShell(pageId));
    window.addEventListener('storage', (e) => { if (e.key === PFX + 'apps') { APPS = ls.get('apps', []); emit('orbit:change', { what: 'sync' }); } });
  }
  function resetDemo() { APPS = seed(); ls.set('apps', APPS); ls.del('settings'); emit('orbit:change', { what: 'reset' }); }
  function clearAll() { APPS = []; ls.set('apps', APPS); emit('orbit:change', { what: 'clear' }); }

  window.Orbit = { $, $$, esc, ls, now, iso, parse, addDays, startOfDay, startOfWeek, fmtDate, fmtDay, fmtTime, daysBetween, ago, until, MON, DAY,
    settings, saveSettings, fmtSalary, fmtSalaryLong, STATUSES, ST, apps, get, upsert, remove, restore, move, stats, icon, LOGO, mono, pill, initials,
    emit, on, toast, toCSV, exportCSV, downloadICS, setTheme, isDark, openModal, init, resetDemo, clearAll, persist };
})();
