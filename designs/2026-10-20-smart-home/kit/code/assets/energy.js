/* Hearth UI Kit · energy.js — Day / Week / Month usage chart (tap a bar), top devices from your live device list,
   scenes that switch devices (saved in localStorage) and a CSV export. */
(() => {
  const { D, $, $$, icon, typeIcon, devices, applyScene, esc, toast, get, set } = Hearth;
  Hearth.boot('Energy');
  let range = ['day', 'week', 'month'].includes(new URLSearchParams(location.search).get('range')) ? new URLSearchParams(location.search).get('range') : get('range', 'week');
  let sel = null;
  const LBL = { day: ['Today', 'yesterday'], week: ['This week', 'last week'], month: ['This month', 'last month'] };
  const fmt = (n) => (n >= 100 ? n.toFixed(1) : n.toFixed(1));
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  $$('[data-range]').forEach((b) => b.addEventListener('click', () => { range = b.dataset.range; set('range', range); sel = null; render(); }));
  function render() {
    const E = D.energy[range], total = E.values.reduce((a, b) => a + b, 0), max = Math.max(...E.values);
    if (sel == null) sel = E.values.indexOf(max);
    $$('[data-range]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.range === range)));
    $('#range-label').textContent = LBL[range][0];
    $('#total').textContent = fmt(total); $('#cost').textContent = inr(total * E.rate);
    const d = Math.round(((total - E.prev) / E.prev) * 100); $('#delta').textContent = `${d > 0 ? '+' : ''}${d}% vs ${LBL[range][1]}`;
    $('#bars').innerHTML = E.values.map((v, i) => `<button type="button" aria-pressed="${i === sel}" data-i="${i}" aria-label="${E.labels[i]}: ${v} kWh"><i style="height:${Math.max(8, (v / max) * 112)}px"></i><span>${E.labels[i]}</span></button>`).join('');
    $$('#bars [data-i]').forEach((b) => b.addEventListener('click', () => { sel = +b.dataset.i; render(); }));
    requestAnimationFrame(() => {
      const b = $(`#bars [data-i="${sel}"]`), bar = b.querySelector('i'), box = $('#bars').getBoundingClientRect(), r = bar.getBoundingClientRect();
      const tip = $('#tip'); tip.textContent = `${E.values[sel]} kWh`;
      tip.style.left = Math.min(box.width - 34, Math.max(34, r.left - box.left + r.width / 2)) + 'px'; tip.style.top = (r.top - box.top - 4) + 'px';
    });
    renderTop(total);
  }
  /* top devices: weekly kWh from data.js scaled to the selected range, only devices that are on or used */
  function renderTop(total) {
    const scale = { day: 1 / 7, week: 1, month: 4.3 }[range];
    const list = devices().slice().sort((a, b) => b.kw - a.kw).slice(0, 3), max = list[0].kw;
    $('#top').innerHTML = list.map((d, i) => `<div class="flex items-center gap-3 py-2.5 ${i ? 'border-t border-line' : ''}">
      <span class="w-10 h-10 rounded-full grid place-items-center flex-none ${i === 0 ? 'bg-primary text-white' : 'bg-raised text-muted'}">${icon(typeIcon[d.type] || 'plug', 'text-[19px]')}</span>
      <div class="flex-1 min-w-0"><div class="flex justify-between gap-2 text-[14px]"><b class="font-medium truncate">${esc(d.name)}</b><span class="text-muted flex-none">${(d.kw * scale).toFixed(1)} kWh</span></div>
      <div class="ubar ${i === 0 ? 'hot' : ''} mt-2"><i style="width:${(d.kw / max) * 100}%"></i></div></div></div>`).join('');
  }
  function renderScenes() {
    const active = get('scene', null);
    $('#scene-grid').innerHTML = D.scenes.map((s) => `<button type="button" class="scene" data-scene="${s.id}" aria-pressed="${s.id === active}">
      <span class="flex items-start justify-between"><span class="ico">${icon(s.icon, 'text-[20px]')}</span>
      <span class="meta text-[12px] text-muted">${s.id === active ? 'Active' : ''}</span></span>
      <b class="block font-medium text-[16px] mt-5">${s.name}</b><span class="meta block text-[13px] text-muted mt-0.5">${s.note}</span></button>`).join('');
    $$('#scene-grid [data-scene]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.scene;
      if (get('scene', null) === id) { set('scene', null); toast('Scene stopped'); renderScenes(); return; }
      const n = applyScene(id); toast(`${D.scenes.find((s) => s.id === id).name} on · ${n} change${n === 1 ? '' : 's'}`); renderScenes(); render();
    }));
  }
  $('#export').addEventListener('click', () => {
    const E = D.energy[range]; const csv = 'period,kwh\n' + E.labels.map((l, i) => `${l},${E.values[i]}`).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `hearth-energy-${range}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Report downloaded (CSV)');
  });
  window.addEventListener('resize', () => render());
  const sq = new URLSearchParams(location.search).get('scene'); // e.g. energy.html?scene=movie runs a scene on load (demo links)
  if (sq && D.scenes.some((s) => s.id === sq) && get('scene', null) !== sq) applyScene(sq);
  render(); renderScenes();
  if (location.hash === '#scenes' || new URLSearchParams(location.search).get('at') === 'scenes')
    document.fonts.ready.then(() => window.scrollTo(0, document.documentElement.scrollHeight));
})();
