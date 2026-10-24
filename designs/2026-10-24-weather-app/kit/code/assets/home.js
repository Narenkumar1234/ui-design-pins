/* Nimbus UI Kit · home.js — current weather: hero, rain alert, stats, hourly pills (tap to preview an hour), next days, AQI/UV minis.
   Swipe the hero (or press ← / →, or tap the dots) to move between saved cities. */
(() => {
  const N = Nimbus, { $, esc } = N;
  let sel = 0; // selected hour index (0 = now)
  let hm = N.get('hourMetric', 'cond'); // what the hourly pills show under the icon: temp, rain % or wind

  function render() {
    const id = N.activeId(), w = N.weather(id), c = w.city, saved = N.saved();
    const h = w.hourly[sel] || w.hourly[0], isNow = sel === 0;
    const cond = isNow ? w.now.cond : h.cond, night = isNow ? w.now.night : h.night, t = isNow ? w.now.t : h.t;
    N.sky(cond);
    $('#loc-pin').innerHTML = N.icon(c.home ? 'nav' : 'pin', 'text-[12px]'); $('#loc-kind').textContent = c.home ? 'My location' : c.country; $('#loc-chev').innerHTML = N.icon('down', 'text-[16px]');
    $('#city').textContent = c.name;
    $('#date').textContent = `${N.dateLine(w.local)} · ${N.localClock(w.local)}`;
    $('#pager').innerHTML = saved.map((s, i) => `<button type="button" role="tab" aria-label="${esc(N.city(s).name)}" aria-selected="${s === id}" data-city="${s}" class="p-1 -m-1"><i class="${s === id ? 'on' : ''}" style="display:block;width:${s === id ? 18 : 6}px;height:6px;border-radius:9px;background:rgb(var(--ink)/${s === id ? .8 : .25})"></i></button>`).join('');
    $('#hero-icon').innerHTML = N.wxIcon(cond, night, 140);
    $('#temp').textContent = N.temp(t);
    $('#cond').textContent = N.condText(cond, night);
    const d0 = w.daily[0];
    $('#hilo').textContent = `H ${N.deg(d0.hi)} · L ${N.deg(d0.lo)}` + (isNow ? ` · Feels ${N.deg(w.now.feels)}` : ` · Rain ${h.rain}%`);
    const bn = $('#back-now'); bn.classList.toggle('hidden', isNow); bn.innerHTML = `Showing ${N.hourLabel(h.h)} · Back to now ${N.icon('x', 'text-[14px]')}`;

    // highlights: rain alert (first rainy hour in the next 12h), dismissible per city + day
    const rainy = w.hourly.slice(1, 13).find((x) => x.rain >= 50);
    const key = `${c.id}-${w.local.date}`; const dismissed = N.get('alertDismissed', []);
    const rainOn = N.settings().rainAlerts && !!rainy;
    $('#alert').classList.toggle('hidden', dismissed.includes(key)); $('#hl-rain').classList.toggle('hidden', !rainOn);
    if (rainy) { $('#alert-t').textContent = `${rainy.cond === 't' ? 'Storms' : rainy.cond === 'w' ? 'Snow' : 'Rain'} likely around ${N.hourLabel(rainy.h)}`; $('#alert-s').textContent = `${rainy.rain}% chance, grab an umbrella.`; }
    const d1 = w.daily[1], diff = d1.hi - d0.hi;
    $('#trend').textContent = diff <= -2 ? `Tomorrow cools down: high of ${N.deg(d1.hi)}, ${Math.abs(diff)}° lower than today.` : diff >= 2 ? `Tomorrow warms up: high of ${N.deg(d1.hi)}, ${diff}° higher than today.` : `Tomorrow looks similar, high of ${N.deg(d1.hi)}.`;
    $('#trend-ic').innerHTML = N.icon('thermo', 'text-[16px] text-muted'); $('#hl-ic').innerHTML = N.icon('info', 'text-[14px]');
    $('#alert-ic').innerHTML = N.icon('umbrella', 'text-[16px] text-sky'); $('#alert-x').innerHTML = N.icon('x', 'text-[18px]'); $('#alert-x').dataset.key = key;

    const stat = (ic, val, lab, sid) => `<div class="flex flex-col items-center gap-1.5 border-r last:border-r-0 border-white/40 dark:border-white/10" data-stat="${sid}">${N.icon(ic, 'text-[22px] text-muted')}<b class="text-[15px] font-semibold">${val}</b><span class="text-[11px] text-muted">${lab}</span></div>`;
    $('#stats').innerHTML = stat('wind', N.wind(isNow ? w.now.wind : h.wind), 'Wind', 'wind') + stat('drop', `${w.now.hum}%`, 'Humidity', 'hum') + stat('umbrella', `${h.rain}%`, 'Rain', 'rain');

    $('#hours').innerHTML = w.hourly.map((x, i) => `<button type="button" class="hour" data-h="${i}" aria-pressed="${i === sel}" aria-label="${i ? N.hourLabel(x.h) : 'Now'}, ${N.deg(x.t)}, ${esc(N.condText(x.cond, x.night))}">
      <small>${i ? N.hourLabel(x.h) : 'Now'}</small>${N.wxIcon(x.cond, x.night, 38)}<span class="rp">${hm === 'cond' && x.rain >= 20 ? x.rain + '%' : ''}</span><span class="t">${hm === 'rain' ? x.rain + '%' : hm === 'wind' ? N.windNum(x.wind)[0] : N.deg(x.t)}</span></button>`).join('');
    N.$$('#hm [data-hm]').forEach((b) => { b.setAttribute('aria-selected', b.dataset.hm === hm); b.innerHTML = N.icon({ cond: 'thermo', rain: 'umbrella', wind: 'wind' }[b.dataset.hm], 'text-[15px]'); });
    $('#ch1').innerHTML = N.icon('chevron', 'text-[14px]');

    const mn = Math.min(...w.daily.slice(0, 4).map((d) => d.lo)), mx = Math.max(...w.daily.slice(0, 4).map((d) => d.hi));
    $('#next').innerHTML = w.daily.slice(1, 4).map((d) => `<li class="flex items-center gap-3 py-2 px-1"><span class="w-12 text-[14px] font-medium">${N.DAYS[d.dow]}</span>${N.wxIcon(d.cond, false, 28)}
      <span class="w-9 text-[11px] font-semibold text-rain">${d.rain >= 20 ? d.rain + '%' : ''}</span><span class="w-8 text-right text-[13px] text-muted">${N.deg(d.lo)}</span>
      <span class="range flex-1"><i style="left:${(d.lo - mn) / (mx - mn || 1) * 100}%;right:${(mx - d.hi) / (mx - mn || 1) * 100}%"></i></span><span class="w-8 text-[13px] font-semibold">${N.deg(d.hi)}</span></li>`).join('');

    const a = N.aqiInfo(w.now.aqi);
    $('#mini-aqi').innerHTML = `<span class="label flex items-center gap-1.5">${N.icon('leaf', 'text-[14px]')}Air quality</span><b class="num text-[40px] block mt-3">${w.now.aqi}</b><span class="text-[13px] font-medium">${a.short || a.label}</span><div class="scale aqi mt-3"><b style="left:${Math.min(100, w.now.aqi / 3)}%"></b></div>`;
    $('#mini-uv').innerHTML = `<span class="label flex items-center gap-1.5">${N.icon('sun', 'text-[14px]')}UV index</span><b class="num text-[40px] block mt-3">${w.now.uvMax}</b><span class="text-[13px] font-medium">${N.uvInfo(w.now.uvMax)}</span><div class="scale uv mt-3"><b style="left:${Math.min(100, w.now.uvMax / 11 * 100)}%"></b></div>`;
    $('#src').textContent = w.source === 'live' ? 'Live data · Open-Meteo' : 'Demo data · turn on live weather in Settings';
    document.title = `Nimbus · ${c.name} ${N.deg(w.now.t)}`;
  }

  function go(step) {
    const s = N.saved(), i = s.indexOf(N.activeId()); const n = s[(i + step + s.length) % s.length];
    if (new URLSearchParams(location.search).get('city')) history.replaceState(null, '', location.pathname);
    N.setActive(n); sel = 0; render(); $('#hero').classList.remove('fade-in'); void $('#hero').offsetWidth; $('#hero').classList.add('fade-in');
    N.live(render, { quiet: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    $('#refresh').innerHTML = N.icon('refresh', 'text-[19px]');
    $('#hours').addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (!b) return; sel = +b.dataset.h; render(); });
    $('#hm').addEventListener('click', (e) => { const b = e.target.closest('[data-hm]'); if (!b) return; hm = b.dataset.hm; N.set('hourMetric', hm); render(); });
    $('#back-now').addEventListener('click', () => { sel = 0; render(); });
    $('#temp-btn').addEventListener('click', () => { const u = N.settings().temp === 'c' ? 'f' : 'c'; N.setSetting('temp', u); render(); N.toast(`Showing °${u.toUpperCase()}`); });
    $('#alert-x').addEventListener('click', (e) => { const d = N.get('alertDismissed', []); d.push(e.currentTarget.dataset.key); N.set('alertDismissed', d); render(); });
    $('#pager').addEventListener('click', (e) => { const b = e.target.closest('[data-city]'); if (!b) return; const s = N.saved(); go(s.indexOf(b.dataset.city) - s.indexOf(N.activeId())); });
    $('#refresh').addEventListener('click', async (e) => {
      const b = e.currentTarget; b.classList.add('spin');
      const ok = N.settings().live ? await N.refreshLive(N.activeId(), true) : (await new Promise((r) => setTimeout(r, 600)), null);
      b.classList.remove('spin'); render(); N.toast(ok === false ? 'Offline · showing demo data' : ok ? 'Updated · live data' : 'Updated just now');
    });
    let x0 = null;
    const hero = $('#hero');
    hero.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; x0 = e.clientX; });
    hero.addEventListener('pointerup', (e) => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); });
    document.addEventListener('keydown', (e) => { if (e.target.matches('input, textarea') || document.querySelector('#sheet.open')) return; if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
    N.live(render);
  });
})();
