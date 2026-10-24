/* Nimbus UI Kit · app.js — shared helpers: storage, settings, cities, mock forecast engine, optional Open-Meteo live data,
   units, weather + line icons, sky background, bottom nav, sheet, toast, theme. Every page loads data.js then app.js. */
const Nimbus = (() => {
  const D = window.NIMBUS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- localStorage (all keys prefixed nimbus.) ---------- */
  const get = (k, d = null) => { try { const v = localStorage.getItem('nimbus.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const set = (k, v) => localStorage.setItem('nimbus.' + k, JSON.stringify(v));
  const del = (k) => localStorage.removeItem('nimbus.' + k);

  const DEFAULTS = { temp: 'c', wind: 'kmh', time: '24', rainAlerts: true, daily: true, dailyTime: '07:30', live: false, motion: true };
  const settings = () => ({ ...DEFAULTS, ...(get('settings', {}) || {}) });
  const setSetting = (k, val) => { const s = settings(); s[k] = val; set('settings', s); };

  /* ---------- cities ---------- */
  const city = (id) => D.catalog.find((c) => c.id === id);
  const saved = () => { const s = get('cities', null); const list = (Array.isArray(s) && s.length ? s : D.defaultCities).filter(city); return list.length ? list : D.defaultCities.slice(); };
  const saveCities = (list) => set('cities', list);
  const activeId = () => { const q = new URLSearchParams(location.search).get('city'); if (q && city(q)) return q; const a = get('active'); const s = saved(); return s.includes(a) ? a : s[0]; };
  const setActive = (id) => set('active', id);

  /* ---------- clock: fixed demo time unless live data is on ---------- */
  const now = () => (settings().live ? new Date() : new Date(D.demoNow));
  const local = (c, t = now()) => { const d = new Date(t.getTime() + c.tz * 3600e3); return { h: d.getUTCHours(), m: d.getUTCMinutes(), dow: d.getUTCDay(), date: d.getUTCDate(), mon: d.getUTCMonth() }; };
  const hm = (s) => { const [a, b] = s.split(':').map(Number); return a + b / 60; };
  const isNight = (c, h, sun) => { const r = hm((sun || c).rise), st = hm((sun || c).set); return h < r || h >= st; };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const LONGDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---------- deterministic mock forecast ---------- */
  const rng = (seed) => { let s = 7; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const rainPct = (cond, r) => ({ s: 0, p: 5, c: 20, r: 60, t: 75, f: 0, w: 55 }[cond] + Math.round(r() * ({ s: 5, p: 12, c: 18, r: 30, t: 20, f: 6, w: 30 }[cond])));
  function pick(c, r, h) {
    const x = r(); let k = x < c.wet * .45 ? 'r' : x < c.wet ? 'c' : x < c.wet + .3 ? 'p' : 's';
    if (k === 'r' && c.storm && r() < .35) k = 't';
    if (k === 'r' && c.snow) k = 'w';
    if (c.fog && h != null && h >= 5 && h < 11) k = 'f';
    return k;
  }
  function mock(c) {
    const lp = local(c), r = rng(c.id);
    const tempAt = (h) => c.base + c.amp * Math.cos(2 * Math.PI * (h - 15) / 24);
    const hourly = [];
    for (let i = 0; i < 24; i++) {
      const h = (lp.h + i) % 24;
      const cond = i === 0 ? c.cond : c.hp ? c.hp[h] : pick(c, r, h);
      hourly.push({ h, t: Math.round(tempAt(h) + (i ? (r() - .5) * 1.2 : 0)), cond, rain: rainPct(cond, r), night: isNight(c, h), wind: Math.round(c.wind * (.7 + r() * .6)) });
    }
    const daily = [];
    for (let i = 0; i < 10; i++) {
      const cond = i === 0 ? c.cond : c.dp ? c.dp[i] : pick(c, r, null);
      const wet = cond === 'r' || cond === 't' || cond === 'w';
      let hi = Math.round(c.base + c.amp + (r() - .5) * 3 - (wet ? 1.5 : 0)), lo = Math.round(c.base - c.amp + (r() - .5) * 2);
      if (i === 0) { hi = Math.max(hi, ...hourly.filter((x, j) => j < 24 - lp.h).map((x) => x.t)); lo = Math.min(lo, hourly[0].t); }
      daily.push({ i, dow: (lp.dow + i) % 7, cond, hi, lo, rain: rainPct(cond, r), uv: Math.max(0, Math.round(c.uv + (r() - .5) * 2 - (wet ? 2 : 0))),
        wind: Math.round(c.wind * (.7 + r() * .6)), rise: c.rise, set: c.set });
    }
    const t0 = hourly[0].t;
    const feels = t0 >= 20 ? Math.round(t0 + (c.hum - 40) * .07) : Math.round(t0 - c.wind * .08);
    const a = 17.27, b = 237.7, g = (a * t0) / (b + t0) + Math.log(c.hum / 100); const dew = Math.round((b * g) / (a - g));
    return {
      source: 'demo', city: c, local: lp,
      now: { t: t0, cond: c.cond, night: isNight(c, lp.h + lp.m / 60), feels, hum: c.hum, dew, wind: c.wind, dir: c.dir, gust: Math.round(c.wind * 1.6),
        aqi: c.aqi, uv: isNight(c, lp.h) ? 0 : c.uv, uvMax: c.uv, pressure: c.pressure, vis: c.vis, rise: c.rise, set: c.set,
        precip: +(hourly.reduce((s, x) => s + (x.rain > 50 ? x.rain / 60 : 0), 0)).toFixed(1) },
      hourly, daily,
    };
  }

  /* ---------- optional live data (Open-Meteo, free, no key). Cached 15 min per city, falls back to demo data offline ---------- */
  const WMO = (n) => n === 0 ? 's' : n <= 2 ? 'p' : n === 3 ? 'c' : n <= 48 ? 'f' : n <= 67 || (n >= 80 && n <= 82) ? 'r' : n <= 77 || n === 85 || n === 86 ? 'w' : n >= 95 ? 't' : 'c';
  const LIVE_TTL = 15 * 60e3;
  function fromLive(c, j) {
    const base = mock(c); const cur = j.current; const sun = { rise: j.daily.sunrise[0].slice(11, 16), set: j.daily.sunset[0].slice(11, 16) };
    const start = Math.max(0, j.hourly.time.findIndex((t) => t.slice(0, 13) === cur.time.slice(0, 13)));
    const hourly = j.hourly.time.slice(start, start + 24).map((t, k) => { const h = +t.slice(11, 13); const i = start + k;
      return { h, t: Math.round(j.hourly.temperature_2m[i]), cond: WMO(j.hourly.weather_code[i]), rain: j.hourly.precipitation_probability[i] ?? 0, night: isNight(c, h, sun), wind: base.now.wind }; });
    const daily = j.daily.time.map((t, i) => ({ i, dow: new Date(t + 'T12:00:00Z').getUTCDay(), cond: WMO(j.daily.weather_code[i]), hi: Math.round(j.daily.temperature_2m_max[i]),
      lo: Math.round(j.daily.temperature_2m_min[i]), rain: j.daily.precipitation_probability_max[i] ?? 0, uv: Math.round(j.daily.uv_index_max[i] ?? 0), wind: base.now.wind,
      rise: j.daily.sunrise[i].slice(11, 16), set: j.daily.sunset[i].slice(11, 16) }));
    const lp = { ...base.local, h: +cur.time.slice(11, 13), m: +cur.time.slice(14, 16) };
    return { ...base, source: 'live', local: lp, hourly: hourly.length ? hourly : base.hourly, daily: daily.length ? daily : base.daily,
      now: { ...base.now, t: Math.round(cur.temperature_2m), cond: WMO(cur.weather_code), feels: Math.round(cur.apparent_temperature), hum: cur.relative_humidity_2m,
        wind: Math.round(cur.wind_speed_10m), dir: cur.wind_direction_10m, pressure: Math.round(cur.surface_pressure), rise: sun.rise, set: sun.set,
        night: isNight(c, lp.h + lp.m / 60, sun), uvMax: daily[0] ? daily[0].uv : base.now.uv } };
  }
  function weather(id = activeId()) {
    const c = city(id) || city(D.defaultCities[0]);
    if (settings().live) { const cache = get('live.' + c.id); if (cache && cache.json) { try { return fromLive(c, cache.json); } catch (e) { /* bad cache: use demo */ } } }
    return mock(c);
  }
  async function refreshLive(id = activeId(), force = false) {
    const c = city(id); if (!c) return false;
    const cache = get('live.' + c.id);
    if (!force && cache && Date.now() - cache.at < LIVE_TTL) return true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=10`;
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 7000);
    try {
      const res = await fetch(url, { signal: ctl.signal }); if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json(); fromLive(c, json); set('live.' + c.id, { at: Date.now(), json }); return true;
    } catch (e) { return false; } finally { clearTimeout(tm); }
  }
  const clearLiveCache = () => Object.keys(localStorage).filter((k) => k.startsWith('nimbus.live.')).forEach((k) => localStorage.removeItem(k));

  /* ---------- units + formatting ---------- */
  const temp = (c) => (settings().temp === 'f' ? Math.round(c * 9 / 5 + 32) : Math.round(c));
  const deg = (c) => `${temp(c)}°`;
  const wind = (kmh) => { const u = settings().wind; return u === 'mph' ? `${Math.round(kmh * .621)} mph` : u === 'ms' ? `${(kmh / 3.6).toFixed(1)} m/s` : `${Math.round(kmh)} km/h`; };
  const windNum = (kmh) => wind(kmh).split(' ');
  const clock = (s) => { if (settings().time === '24') return s; let [h, m] = s.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')} ${ap}`; };
  const hourLabel = (h) => settings().time === '24' ? `${String(h).padStart(2, '0')}:00` : `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`;
  const localClock = (lp) => clock(`${String(lp.h).padStart(2, '0')}:${String(lp.m).padStart(2, '0')}`);
  const dateLine = (lp) => `${LONGDAYS[lp.dow]}, ${lp.date} ${MONTHS[lp.mon]}`;
  const compass = (d) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(((d % 360) / 45)) % 8];
  const condText = (cond, night) => (night && D.nightText[cond]) || D.condText[cond];
  const aqiInfo = (v) => v <= 50 ? { label: 'Good', color: '#3DD68C', tip: 'Air quality is great. Perfect for a run outside.' }
    : v <= 100 ? { label: 'Moderate', color: '#FFD54A', tip: 'Acceptable. Very sensitive people should take it easy outdoors.' }
    : v <= 150 ? { label: 'Unhealthy for sensitive groups', short: 'Sensitive', color: '#FF8A3D', tip: 'Kids, older adults and people with asthma should limit long outdoor activity.' }
    : v <= 200 ? { label: 'Unhealthy', color: '#FF5A5F', tip: 'Wear a mask outdoors and keep windows closed.' }
    : v <= 300 ? { label: 'Very unhealthy', color: '#A35BFF', tip: 'Avoid outdoor activity.' } : { label: 'Hazardous', color: '#8B2F3C', tip: 'Stay indoors.' };
  const uvInfo = (v) => v <= 2 ? 'Low' : v <= 5 ? 'Moderate' : v <= 7 ? 'High' : v <= 10 ? 'Very high' : 'Extreme';

  /* ---------- weather icons (soft flat shapes with gradients). wxIcon(cond, night, size) ---------- */
  let gid = 0;
  function wxIcon(cond, night = false, size = 40) {
    const id = 'g' + (++gid);
    const defs = `<defs>
      <radialGradient id="${id}s" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFE68A"/><stop offset="1" stop-color="#FFA92E"/></radialGradient>
      <radialGradient id="${id}m" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFF4C8"/><stop offset="1" stop-color="#FFC861"/></radialGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D3E4F7"/></linearGradient>
      <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F1FA"/><stop offset="1" stop-color="#A9BDD6"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4FF"/><stop offset="1" stop-color="#2F80E0"/></linearGradient></defs>`;
    const sun = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 1.45}" fill="#FFC64D" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}s)"/>`;
    const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 1.3}" fill="#FFE7A3" opacity=".08"/><path d="M${x + r * .35} ${y - r} a${r} ${r} 0 1 0 ${r * .65} ${r * 1.55} a${r * .78} ${r * .78} 0 0 1 -${r * .65} -${r * 1.55}z" fill="url(#${id}m)"/>`;
    const cloud = (x, y, s, f = 'c', op = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><path d="M14 40h30a11 11 0 0 0 1.5-21.9A15 15 0 0 0 17 16.5 11.8 11.8 0 0 0 14 40z" fill="url(#${id}${f})"/><path d="M14 40h30a11 11 0 0 0 4-.8" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/></g>`;
    const drops = (n = 3) => [0, 1, 2].slice(0, n).map((k) => `<path d="M${22 + k * 9} ${48 + (k % 2) * 3}l-2.6 6.2a2.8 2.8 0 1 0 5.2 0z" fill="url(#${id}r)"/>`).join('');
    const flakes = [0, 1, 2].map((k) => `<g transform="translate(${23 + k * 9} ${52 + (k % 2) * 3})" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M0-3.5v7M-3 -1.8l6 3.6M-3 1.8l6-3.6"/></g>`).join('');
    const sky = night ? moon : sun;
    const body = {
      s: night ? moon(32, 32, 15) : sun(32, 32, 15),
      p: sky(night ? 24 : 25, 24, 12) + cloud(4, 14, .95),
      c: cloud(14, 4, .8, 'd', .9) + cloud(2, 14, .95),
      r: cloud(4, 2, .95, 'd') + drops(3),
      t: cloud(4, 2, .95, 'd') + `<path d="M33 40l-7 11h6l-3 9 9-13h-6l3-7z" fill="#FFC861" stroke="#FFAE2E" stroke-width=".8" stroke-linejoin="round"/>` + `<path d="M20 50l-2.4 5.6a2.6 2.6 0 1 0 4.8 0z" fill="url(#${id}r)"/>`,
      f: sky(32, 22, 11) + `<g stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".9"><path d="M12 38h40M18 46h32M14 54h26"/></g>`,
      w: cloud(4, 2, .95) + flakes,
    }[cond] || '';
    return `<svg class="wx" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${esc(condText(cond, night))}">${defs}${body}</svg>`;
  }

  /* ---------- line icons ---------- */
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-5v6h-4A1.5 1.5 0 0 1 4 19z"/>',
    chart: '<path d="M4 19.5h16"/><path d="M5 15l4-5 4 3 6-7"/><circle cx="19" cy="6" r="1.2"/>',
    cities: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    gauge: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="m12 16 3.5-4.5"/><circle cx="12" cy="16" r="1.2"/><path d="M4.5 19.5h15"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2.6-1.5L14 2.6h-4l-.5 2.5A7.6 7.6 0 0 0 6.9 6.6l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 2.6 1.5l.5 2.5h4l.5-2.5a7.6 7.6 0 0 0 2.6-1.5l2.3 1 2-3.4z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>', x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    back: '<path d="M14.5 6 8.5 12l6 6"/>', chevron: '<path d="m9.5 6 6 6-6 6"/>', down: '<path d="m6 9.5 6 6 6-6"/>', up: '<path d="m6 14.5 6-6 6 6"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    nav: '<path d="M20 4 4 10.5l6.5 2.5L13 19.5z"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    wind: '<path d="M3.5 9h11a3 3 0 1 0-3-3"/><path d="M3.5 13h15a3 3 0 1 1-3 3"/><path d="M3.5 17h7"/>',
    drop: '<path d="M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z"/>',
    umbrella: '<path d="M3.5 12a8.5 8.5 0 0 1 17 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0M12 3.5v0"/>',
    thermo: '<path d="M10 14.5V5.5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 11v6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 14-14 0 9-5.5 14-13 14"/><path d="M5 19 13 11"/>',
    sunrise: '<path d="M4 18.5h16M7 15a5 5 0 0 1 10 0"/><path d="M12 4v4M9.5 6.5 12 4l2.5 2.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17v.1"/>',
    edit: '<path d="M4.5 19.5h4l10-10-4-4-10 10z"/>', trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.2 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.2-3.6-8.5S9.5 5.9 12 3.5z"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- sky background, theme, nav, toast, sheet ---------- */
  function sky(cond) {
    if (!$('.sky')) document.body.insertAdjacentHTML('afterbegin', '<div class="sky" aria-hidden="true"><i class="stars"></i><i class="orb"></i><i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i></div>');
    if (cond) document.body.dataset.wx = cond;
    document.body.classList.toggle('still', !settings().motion);
  }
  const themePref = () => get('theme', 'light') || 'light';
  function applyTheme(pref = themePref()) {
    const dark = pref === 'dark' || (pref === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    $$('[data-theme-toggle]').forEach((b) => { b.innerHTML = icon(dark ? 'sun' : 'moon', 'text-[19px]'); b.setAttribute('aria-label', dark ? 'Switch to day theme' : 'Switch to night theme'); });
    return dark;
  }
  function setTheme(pref) { set('theme', pref); applyTheme(pref); document.dispatchEvent(new CustomEvent('nimbus:theme')); }
  const NAV = [['index.html', 'home', 'Home'], ['forecast.html', 'chart', 'Forecast'], ['cities.html', 'cities', 'Cities'], ['details.html', 'gauge', 'Details'], ['settings.html', 'gear', 'Settings']];
  function nav() {
    const cur = document.body.dataset.page; const el = $('#nav'); if (!el) return;
    el.className = 'nav'; el.setAttribute('aria-label', 'Main');
    el.innerHTML = NAV.map(([href, ic, label]) => `<a href="${href}" data-nav="${ic}" ${href.startsWith(cur) ? 'aria-current="page"' : ''}>${icon(ic, 'text-[22px]')}<span>${label}</span></a>`).join('');
  }
  let toastT;
  function toast(msg) {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }
  let lastFocus;
  function sheet(html, onOpen) {
    let s = $('#sheet');
    if (!s) {
      document.body.insertAdjacentHTML('beforeend', '<div class="scrim" id="scrim"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"></div>');
      s = $('#sheet'); $('#scrim').addEventListener('click', closeSheet);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && s.classList.contains('open')) closeSheet(); });
    }
    lastFocus = document.activeElement;
    s.innerHTML = `<div class="grab"></div>${html}`; $('#scrim').classList.add('open'); s.classList.add('open'); s.focus();
    $$('[data-close]', s).forEach((b) => b.addEventListener('click', closeSheet));
    if (onOpen) onOpen(s);
  }
  function closeSheet() { const s = $('#sheet'); if (!s) return; s.classList.remove('open'); $('#scrim').classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  function boot() {
    sky(); applyTheme(); nav();
    $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')));
    if (themePref() === 'auto') matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme());
  }

  /* after a live refresh: re-render or tell the user we are offline */
  async function live(render, { force = false, quiet = false } = {}) {
    if (!settings().live) return null;
    const ok = await refreshLive(activeId(), force);
    if (ok) render(); else if (!quiet) toast('Offline · showing demo data');
    return ok;
  }

  return { D, $, $$, esc, get, set, del, settings, setSetting, DEFAULTS, city, saved, saveCities, activeId, setActive, now, local, hm, isNight, DAYS, LONGDAYS, MONTHS,
    weather, mock, refreshLive, clearLiveCache, live, temp, deg, wind, windNum, clock, hourLabel, localClock, dateLine, compass, condText, aqiInfo, uvInfo,
    wxIcon, icon, sky, applyTheme, setTheme, themePref, nav, toast, sheet, closeSheet, boot };
})();
document.addEventListener('DOMContentLoaded', Nimbus.boot);
