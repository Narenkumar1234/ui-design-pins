/* Nimbus UI Kit · details.js — AQI with pollutants, UV, wind compass, humidity + dew point, feels like, sunrise/sunset arc,
   pressure gauge, visibility. Every tile is a button that opens a glass sheet explaining the number. */
(() => {
  const N = Nimbus, { $, esc } = N;
  let w;
  const pollutants = (aqi) => [['PM2.5', Math.round(aqi * .36), 'µg/m³'], ['PM10', Math.round(aqi * .62), 'µg/m³'], ['O₃', Math.round(18 + aqi * .22), 'ppb'], ['NO₂', Math.round(6 + aqi * .12), 'ppb']];
  const mins = (s) => Math.round(N.hm(s) * 60);
  const dur = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;

  function sunArc(n) {
    const rise = mins(n.rise), set = mins(n.set), cur = w.local.h * 60 + w.local.m, p = Math.max(0, Math.min(1, (cur - rise) / (set - rise)));
    const cx = 160, cy = 108, r = 96, a = Math.PI * (1 - p), x = cx + r * Math.cos(a), y = cy - r * Math.sin(a), day = cur >= rise && cur < set;
    const arc = (to) => `M${cx - r},${cy} A${r},${r} 0 0 1 ${(cx + r * Math.cos(Math.PI * (1 - to))).toFixed(1)},${(cy - r * Math.sin(Math.PI * (1 - to))).toFixed(1)}`;
    return { p, day, left: day ? set - cur : 0, until: cur < rise ? rise - cur : rise + 1440 - cur, len: set - rise,
      svg: `<svg viewBox="0 0 320 122" class="w-full h-auto mt-2" aria-hidden="true"><defs><linearGradient id="sa" x1="0" x2="1"><stop offset="0" stop-color="#FFD36E"/><stop offset="1" stop-color="#FF9A3D"/></linearGradient></defs>
        <line x1="10" x2="310" y1="${cy}" y2="${cy}" stroke="rgb(var(--ink))" stroke-opacity=".18"/>
        <path d="${arc(1)}" fill="none" stroke="rgb(var(--ink))" stroke-opacity=".3" stroke-width="2" stroke-dasharray="4 6"/>
        ${day ? `<path d="${arc(p)}" fill="none" stroke="url(#sa)" stroke-width="4" stroke-linecap="round"/>` : ''}
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="#FFC64D" opacity="${day ? .3 : .12}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${day ? '#FFB238' : 'rgb(var(--muted))'}" stroke="#fff" stroke-width="2.5"/></svg>` };
  }
  function compass(dir, kmh) {
    const ticks = Array.from({ length: 36 }, (_, i) => { const a = i * 10 * Math.PI / 180, r1 = i % 9 ? 40 : 36; return `<line x1="${50 + Math.sin(a) * r1}" y1="${50 - Math.cos(a) * r1}" x2="${50 + Math.sin(a) * 44}" y2="${50 - Math.cos(a) * 44}" stroke="rgb(var(--ink))" stroke-opacity="${i % 9 ? .25 : .6}" stroke-width="${i % 9 ? 1 : 1.6}"/>`; }).join('');
    const [v, u] = N.windNum(kmh);
    return `<svg viewBox="0 0 100 100" class="w-[104px] h-[104px] mx-auto" aria-hidden="true">${ticks}
      ${[['N', 50, 21], ['E', 81, 53.5], ['S', 50, 86], ['W', 19, 53.5]].map(([l, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="8" font-weight="600" fill="rgb(var(--muted))">${l}</text>`).join('')}
      <g id="needle" transform="rotate(${dir} 50 50)" style="transition:transform .6s"><path d="M50 9 L55 22 L50 19 L45 22Z" fill="rgb(var(--sun))"/><line x1="50" y1="19" x2="50" y2="83" stroke="rgb(var(--sun))" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>
      <circle cx="50" cy="50" r="17" fill="rgb(var(--ink) / .07)" stroke="rgb(255 255 255 / .55)"/>
      <text x="50" y="51" text-anchor="middle" font-size="12" font-weight="600" fill="rgb(var(--ink))">${v}</text><text x="50" y="60" text-anchor="middle" font-size="6" fill="rgb(var(--muted))">${u}</text></svg>`;
  }
  function gauge(hpa) {
    const p = Math.max(0, Math.min(1, (hpa - 970) / 70)), a = Math.PI * (1 - p);
    return `<svg viewBox="0 0 100 60" class="w-[110px] mx-auto mt-1" aria-hidden="true"><path d="M10 52 A40 40 0 0 1 90 52" fill="none" stroke="rgb(var(--ink))" stroke-opacity=".15" stroke-width="7" stroke-linecap="round"/>
      <path d="M10 52 A40 40 0 0 1 ${(50 + 40 * Math.cos(a)).toFixed(1)} ${(52 - 40 * Math.sin(a)).toFixed(1)}" fill="none" stroke="rgb(var(--accent))" stroke-width="7" stroke-linecap="round"/>
      <line x1="50" y1="52" x2="${(50 + 30 * Math.cos(a)).toFixed(1)}" y2="${(52 - 30 * Math.sin(a)).toFixed(1)}" stroke="rgb(var(--ink))" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="52" r="3.5" fill="rgb(var(--ink))"/></svg>`;
  }
  const tile = (id, ic, label, body, span = '') => `<button type="button" class="glass tile ${span}" data-tile="${id}" id="t-${id}" aria-haspopup="dialog"><span class="label flex items-center gap-1.5">${N.icon(ic, 'text-[14px]')}${label}</span>${body}</button>`;

  const INFO = {
    aqi: () => { const a = N.aqiInfo(w.now.aqi); return [`Air quality · ${w.now.aqi}`, `<p class="text-[15px] font-semibold" style="color:${a.color}">${a.label}</p><p class="mt-1">${a.tip}</p>
      <div class="grid grid-cols-2 gap-2 mt-4">${pollutants(w.now.aqi).map(([n, v, u]) => `<div class="glass hi p-3" style="border-radius:18px"><span class="label">${n}</span><b class="block text-[20px] font-semibold mt-1">${v} <small class="text-[11px] text-muted font-normal">${u}</small></b></div>`).join('')}</div>
      <p class="text-[12px] text-muted mt-3">US AQI scale: 0–50 good, 51–100 moderate, 101–150 sensitive groups, 151–200 unhealthy, 201+ very unhealthy.</p>`]; },
    uv: () => [`UV index · ${w.now.uvMax}`, `<p class="font-semibold">${N.uvInfo(w.now.uvMax)} today</p><p class="mt-1">${w.now.uvMax >= 6 ? 'Use SPF 30+, sunglasses and a hat between 11:00 and 15:00.' : w.now.uvMax >= 3 ? 'Sunscreen is a good idea if you are outside for long.' : 'No protection needed for most people.'}</p>`],
    wind: () => [`Wind · ${N.wind(w.now.wind)}`, `<p>From the <b>${N.compass(w.now.dir)}</b> (${w.now.dir}°), gusts up to ${N.wind(w.now.gust)}.</p><p class="mt-1 text-muted">The arrow shows where the wind is coming from.</p>`],
    hum: () => [`Humidity · ${w.now.hum}%`, `<p>The dew point is <b>${N.deg(w.now.dew)}</b> right now.</p><p class="mt-1 text-muted">Dew point above 20° feels sticky; below 10° feels dry.</p>`],
    feels: () => [`Feels like · ${N.deg(w.now.feels)}`, `<p>${w.now.feels > w.now.t ? 'Humid air makes it feel warmer than the actual' : w.now.feels < w.now.t ? 'Wind makes it feel cooler than the actual' : 'Similar to the actual'} temperature of ${N.deg(w.now.t)}.</p>`],
    sun: () => { const s = sunArc(w.now); return ['Sunrise & sunset', `<p>Sunrise <b>${N.clock(w.now.rise)}</b> · sunset <b>${N.clock(w.now.set)}</b></p><p class="mt-1">Daylight today: ${dur(s.len)}. ${s.day ? `${dur(s.left)} of daylight left.` : `Sunrise in ${dur(s.until)}.`}</p>`]; },
    pressure: () => [`Pressure · ${w.now.pressure} hPa`, `<p>${w.now.pressure < 1005 ? 'Low pressure, often cloudier and wetter.' : w.now.pressure > 1018 ? 'High pressure, usually calm and clear.' : 'Normal pressure, steady weather.'}</p><p class="mt-1 text-muted">Average sea-level pressure is 1013 hPa.</p>`],
    vis: () => [`Visibility · ${w.now.vis} km`, `<p>${w.now.vis >= 10 ? 'Perfectly clear view.' : w.now.vis >= 5 ? 'Slight haze in the distance.' : 'Hazy, take care on the road.'}</p>`],
  };
  function info(id) {
    const [t, body] = INFO[id]();
    N.sheet(`<div class="flex items-center justify-between"><h2 id="sheet-title" class="text-[20px] font-semibold">${t}</h2><button type="button" class="btn-round !w-9 !h-9" data-close aria-label="Close">${N.icon('x', 'text-[16px]')}</button></div>
      <div class="text-[14px] leading-relaxed mt-3">${body}</div><button type="button" class="btn-sun w-full mt-5" data-close>Got it</button>`);
  }
  function render() {
    w = N.weather(); const n = w.now, a = N.aqiInfo(n.aqi), s = sunArc(n); N.sky(n.cond);
    $('#title').textContent = w.city.name; $('#sub').textContent = `Details · ${N.localClock(w.local)}`;
    $('#tiles').innerHTML =
      tile('aqi', 'leaf', 'Air quality', `<span class="flex items-end gap-3 mt-3"><b class="num text-[54px]">${n.aqi}</b><span class="pb-1"><b class="block text-[15px] font-semibold">${a.label}</b><span class="text-[12px] text-muted">US AQI · PM2.5 ${pollutants(n.aqi)[0][1]} µg/m³</span></span></span>
        <span class="scale aqi mt-4 block w-full"><b style="left:${Math.min(100, n.aqi / 3)}%"></b></span>
        <span class="flex justify-between text-[10px] text-muted mt-2 w-full"><span>0</span><span>100</span><span>200</span><span>300</span></span>`, 'col-span-2 !min-h-0') +
      tile('uv', 'sun', 'UV index', `<b class="num text-[44px] mt-3">${n.uvMax}</b><span class="text-[14px] font-semibold mt-1">${N.uvInfo(n.uvMax)}</span><span class="scale uv mt-auto block w-full"><b style="left:${Math.min(100, n.uvMax / 11 * 100)}%"></b></span>`) +
      tile('wind', 'wind', 'Wind', `<span class="mt-2 w-full">${compass(n.dir, n.wind)}</span><span class="text-[12px] text-muted text-center w-full">${N.compass(n.dir)} · gusts ${N.windNum(n.gust)[0]}</span>`) +
      tile('sun', 'sunrise', 'Sunrise · Sunset', `${s.svg}<span class="flex justify-between w-full text-[13px] -mt-1"><span><b class="font-semibold">${N.clock(n.rise)}</b><small class="block text-muted text-[11px]">Sunrise</small></span>
        <span class="text-center text-[12px] text-muted self-end">${s.day ? `${dur(s.left)} of daylight left` : `Sunrise in ${dur(s.until)}`}</span><span class="text-right"><b class="font-semibold">${N.clock(n.set)}</b><small class="block text-muted text-[11px]">Sunset</small></span></span>`, 'col-span-2 !min-h-0') +
      tile('hum', 'drop', 'Humidity', `<b class="num text-[44px] mt-3">${n.hum}%</b><span class="text-[12px] text-muted mt-auto">Dew point ${N.deg(n.dew)}</span><span class="range block w-full mt-2"><i style="left:0;right:${100 - n.hum}%;background:linear-gradient(90deg,#9FD6FF,#2F80E0)"></i></span>`) +
      tile('feels', 'thermo', 'Feels like', `<b class="num text-[44px] mt-3">${N.deg(n.feels)}</b><span class="text-[12px] text-muted mt-auto leading-snug">${n.feels > n.t ? 'Humidity makes it feel warmer' : n.feels < n.t ? 'Wind makes it feel cooler' : 'Same as actual'}</span>`) +
      tile('pressure', 'gauge', 'Pressure', `${gauge(n.pressure)}<b class="text-[20px] font-semibold text-center w-full">${n.pressure}<small class="text-[11px] text-muted font-normal"> hPa</small></b>`, 'md:col-span-2') +
      tile('vis', 'eye', 'Visibility', `<b class="num text-[44px] mt-3">${n.vis}<small class="text-[16px] font-normal"> km</small></b><span class="text-[12px] text-muted mt-auto">${n.vis >= 10 ? 'Perfectly clear' : n.vis >= 5 ? 'Slight haze' : 'Hazy'}</span>`, 'md:col-span-2');
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('#back').innerHTML = N.icon('back', 'text-[20px]');
    render();
    $('#tiles').addEventListener('click', (e) => { const t = e.target.closest('[data-tile]'); if (t) info(t.dataset.tile); });
    const fromHash = () => { const h = location.hash.slice(1); if (INFO[h]) { const el = $('#t-' + h); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' }); setTimeout(() => info(h), 250); } };
    fromHash(); window.addEventListener('hashchange', fromHash); // e.g. details.html#aqi from the Home minis
    document.addEventListener('nimbus:theme', render);
    N.live(render);
  });
})();
