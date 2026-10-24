/* Nimbus UI Kit · settings.js — units (°C/°F, km/h · mph · m/s, 24h/12h) with live preview, theme Day/Night/Auto,
   animated sky, rain alerts, daily summary time, live Open-Meteo toggle with status, clear cache, reset demo. */
(() => {
  const N = Nimbus, { $, $$ } = N;
  function render() {
    const s = N.settings(), w = N.weather();
    N.sky(w.now.cond);
    $$('[data-group]').forEach((g) => { const cur = g.dataset.group === 'theme' ? N.themePref() : s[g.dataset.group];
      $$('button', g).forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === String(cur))); });
    $$('[data-toggle]').forEach((b) => b.setAttribute('aria-checked', !!s[b.dataset.toggle]));
    $('#daily-time').value = s.dailyTime; $('#time-row').classList.toggle('opacity-40', !s.daily); $('#daily-time').disabled = !s.daily;
    $('#preview').textContent = `Preview: ${N.deg(w.now.t)} · ${N.wind(w.now.wind)} · sunset ${N.clock(w.now.set)}`;
    const cache = N.get('live.' + N.activeId());
    $('#live-status').textContent = !s.live ? 'Off · using demo data' : cache ? `On · Open-Meteo · updated ${new Date(cache.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'On · waiting for data…';
  }
  document.addEventListener('DOMContentLoaded', () => {
    render();
    $$('[data-group]').forEach((g) => g.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return;
      if (g.dataset.group === 'theme') N.setTheme(b.dataset.v); else N.setSetting(g.dataset.group, b.dataset.v); render(); }));
    $$('[data-toggle]').forEach((b) => b.addEventListener('click', async () => {
      const k = b.dataset.toggle, v = !N.settings()[k]; N.setSetting(k, v); render();
      if (k === 'live' && v) { const ok = await N.refreshLive(N.activeId(), true); render(); N.toast(ok ? 'Live weather on' : 'Offline · showing demo data'); }
      else N.toast(`${b.getAttribute('aria-label')} ${v ? 'on' : 'off'}`);
    }));
    $('#daily-time').addEventListener('change', (e) => { N.setSetting('dailyTime', e.target.value); N.toast(`Daily summary at ${N.clock(e.target.value)}`); });
    $('#clear-cache').addEventListener('click', () => { N.clearLiveCache(); render(); N.toast('Cached forecasts cleared'); });
    $('#reset').addEventListener('click', () => { Object.keys(localStorage).filter((k) => k.startsWith('nimbus.')).forEach((k) => localStorage.removeItem(k)); N.applyTheme('light'); render(); N.toast('Demo reset'); });
    document.addEventListener('nimbus:theme', render);
  });
})();
