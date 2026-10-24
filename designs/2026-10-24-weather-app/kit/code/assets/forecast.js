/* Nimbus UI Kit · forecast.js — 24h chart (temperature line, rain bars or wind line) with tap / drag / arrow-key scrubbing,
   plus a 10-day list with temperature range bars; tap a day to expand its details. */
(() => {
  const N = Nimbus, { $, $$, esc } = N;
  const W = 340, H = 170, PX = 14, TOP = 30, BOT = 34;
  let sel = 0, metric = N.get('metric', 'temp'), open = N.get('openDay', null), w;

  const val = (x) => metric === 'temp' ? N.temp(x.t) : metric === 'rain' ? x.rain : x.wind;
  const fmt = (x) => metric === 'temp' ? N.deg(x.t) : metric === 'rain' ? `${x.rain}%` : N.wind(x.wind);
  const short = (x) => metric === 'temp' ? N.deg(x.t) : metric === 'rain' ? `${x.rain}%` : N.windNum(x.wind)[0];
  const xs = (i) => PX + i * (W - PX * 2) / 23;
  function smooth(pts) { // Catmull-Rom -> cubic bezier
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function chart() {
    const hs = w.hourly, v = hs.map(val);
    let lo = Math.min(...v), hi = Math.max(...v); if (metric === 'rain') { lo = 0; hi = 100; } if (hi - lo < 4) { hi += 2; lo -= 2; }
    const ys = (n) => TOP + (1 - (n - lo) / (hi - lo)) * (H - TOP - BOT);
    const pts = v.map((n, i) => [xs(i), ys(n)]);
    let g = `<defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--sun))" stop-opacity=".55"/><stop offset="1" stop-color="rgb(var(--sun))" stop-opacity="0"/></linearGradient>
      <linearGradient id="fl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6FC3FF"/><stop offset=".55" stop-color="#FFC861"/><stop offset="1" stop-color="#FF9A3D"/></linearGradient>
      <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4FF"/><stop offset="1" stop-color="#2F80E0"/></linearGradient></defs>`;
    for (let k = 0; k < 3; k++) { const y = TOP + k * (H - TOP - BOT) / 2; g += `<line x1="${PX}" x2="${W - PX}" y1="${y}" y2="${y}" stroke="rgb(var(--ink))" stroke-opacity=".08" stroke-dasharray="2 4"/>`; }
    if (metric === 'rain') {
      const bw = (W - PX * 2) / 24 - 3;
      g += v.map((n, i) => `<rect x="${(xs(i) - bw / 2).toFixed(1)}" y="${ys(Math.max(n, 2)).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H - BOT - ys(Math.max(n, 2))).toFixed(1)}" rx="3" fill="url(#fr)" opacity="${i === sel ? 1 : .55}"/>`).join('');
    } else {
      const line = smooth(pts);
      g += `<path d="${line} L${xs(23)},${H - BOT} L${xs(0)},${H - BOT}Z" fill="url(#fa)" opacity="${metric === 'temp' ? .9 : .5}"/>`;
      g += `<path d="${line}" fill="none" stroke="${metric === 'temp' ? 'url(#fl)' : 'rgb(var(--accent))'}" stroke-width="3" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < 24; i += 3) {
      g += `<text x="${xs(i)}" y="${H - 10}" text-anchor="middle" font-size="10" font-weight="500" fill="rgb(var(--muted))">${i ? N.hourLabel(hs[i].h).replace(':00', '') : 'Now'}</text>`;
      if (i !== sel) g += `<text x="${xs(i)}" y="${pts[i][1] - 9}" text-anchor="middle" font-size="10" font-weight="600" fill="rgb(var(--ink))" opacity=".75">${short(hs[i])}</text>`;
    }
    const [sx, sy] = pts[sel];
    g += `<line x1="${sx}" x2="${sx}" y1="${TOP - 6}" y2="${H - BOT}" stroke="rgb(var(--ink))" stroke-opacity=".35" stroke-dasharray="3 3"/>`;
    g += `<circle cx="${sx}" cy="${sy}" r="7" fill="#fff" stroke="rgb(var(--sun))" stroke-width="3.5"/>`;
    g += `<rect x="0" y="0" width="${W}" height="${H}" fill="transparent" id="hit"/>`;
    const svg = $('#chart'); svg.innerHTML = g; svg.setAttribute('aria-valuenow', sel); svg.setAttribute('aria-valuetext', `${sel ? N.hourLabel(hs[sel].h) : 'Now'}: ${fmt(hs[sel])}`);
    const tip = $('#tip'); tip.textContent = `${sel ? N.hourLabel(hs[sel].h) : 'Now'} · ${fmt(hs[sel])}`;
    const pct = sx / W * 100; tip.style.left = `clamp(52px, ${pct}%, calc(100% - 52px))`; tip.style.top = `${(sy / H) * 100}%`; tip.style.marginTop = '-14px';
    const h = hs[sel];
    $('#read-v').textContent = fmt(h);
    $('#read-t').textContent = `${sel ? N.hourLabel(h.h) : 'Now'} · ${N.condText(h.cond, h.night)}`;
    $('#read-ic').innerHTML = N.wxIcon(h.cond, h.night, 48);
  }
  function days() {
    const mn = Math.min(...w.daily.map((d) => d.lo)), mx = Math.max(...w.daily.map((d) => d.hi)), sp = mx - mn || 1;
    const nowT = w.now.t;
    $('#days').innerHTML = w.daily.map((d, i) => {
      const ex = open === i;
      return `<li class="border-b last:border-b-0 border-white/40 dark:border-white/10">
        <button type="button" class="row w-full flex items-center gap-2.5 py-2.5 px-2 rounded-2xl text-left" data-day="${i}" aria-expanded="${ex}" aria-controls="dd-${i}">
          <span class="w-[52px] text-[14px] font-medium">${i ? N.DAYS[d.dow] : 'Today'}</span>${N.wxIcon(d.cond, false, 30)}
          <span class="w-9 text-[11px] font-semibold text-rain">${d.rain >= 20 ? d.rain + '%' : ''}</span>
          <span class="w-8 text-right text-[13px] text-muted">${N.deg(d.lo)}</span>
          <span class="range flex-1 mx-1"><i style="left:${(d.lo - mn) / sp * 100}%;right:${(mx - d.hi) / sp * 100}%"></i>${i === 0 ? `<b style="left:${Math.max(0, Math.min(100, (nowT - mn) / sp * 100))}%" title="Now"></b>` : ''}</span>
          <span class="w-8 text-[13px] font-semibold">${N.deg(d.hi)}</span>
        </button>
        <div id="dd-${i}" class="${ex ? '' : 'hidden'} grid grid-cols-4 gap-2 px-2 pb-3 pt-1 text-center fade-in">
          ${[['umbrella', `${d.rain}%`, 'Rain'], ['sun', d.uv, 'UV'], ['wind', N.windNum(d.wind)[0], N.windNum(d.wind)[1]], ['sunrise', N.clock(d.rise), 'Sunrise']]
            .map(([ic, v, l]) => `<div class="glass hi py-2.5" style="border-radius:16px">${N.icon(ic, 'text-[16px] text-muted mx-auto')}<b class="block text-[13px] font-semibold mt-1">${v}</b><span class="text-[10px] text-muted">${l}</span></div>`).join('')}
          <p class="col-span-4 text-[12px] text-muted text-left mt-1">${esc(N.condText(d.cond, false))} · high ${N.deg(d.hi)}, low ${N.deg(d.lo)} · sunset ${N.clock(d.set)}</p>
        </div></li>`;
    }).join('');
  }
  function render() {
    w = N.weather(); N.sky(w.now.cond);
    $('#sub').textContent = `${w.city.name} · ${N.dateLine(w.local)}`;
    $$('[data-metric]').forEach((b) => b.setAttribute('aria-selected', b.dataset.metric === metric));
    chart(); days();
  }
  function pick(e) {
    const svg = $('#chart'), r = svg.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * W;
    const i = Math.max(0, Math.min(23, Math.round((x - PX) / ((W - PX * 2) / 23)))); if (i !== sel) { sel = i; chart(); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const q = new URLSearchParams(location.search); if (q.get('metric')) metric = q.get('metric'); if (q.get('day') != null) open = +q.get('day'); if (q.get('h')) sel = Math.max(0, Math.min(23, +q.get('h')));
    render();
    $$('[data-metric]').forEach((b) => b.addEventListener('click', () => { metric = b.dataset.metric; N.set('metric', metric); render(); }));
    const svg = $('#chart'); let drag = false;
    svg.addEventListener('pointerdown', (e) => { drag = true; pick(e); });
    svg.addEventListener('pointermove', (e) => { if (drag || e.pointerType === 'mouse') pick(e); });
    window.addEventListener('pointerup', () => { drag = false; });
    svg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); sel = Math.max(0, Math.min(23, sel + (e.key === 'ArrowRight' ? 1 : -1))); chart(); } if (e.key === 'Home') { sel = 0; chart(); } });
    $('#days').addEventListener('click', (e) => { const b = e.target.closest('[data-day]'); if (!b) return; const i = +b.dataset.day; open = open === i ? null : i; N.set('openDay', open); days(); });
    document.addEventListener('nimbus:theme', render);
    N.live(render);
  });
})();
