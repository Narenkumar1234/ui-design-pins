/* Orbit UI Kit · dashboard.js — stat cards, weekly SVG bar chart (4 / 8 weeks, hover + keyboard tooltip), upcoming interviews,
   pipeline stacked bar, recent activity, "next up" card + reminder banner. Re-renders on every data change. */
(function () {
  const O = window.Orbit; const { $, $$, esc, icon } = O;
  O.init('dashboard');
  let range = O.ls.get('range', 8);
  const statCard = (k, label, val, sub, ic, cls = '') => `<div class="card ${cls} p-4 sm:p-5 min-w-0" data-stat="${k}">
      <div class="flex items-center gap-2"><span class="w-8 h-8 rounded-full grid place-items-center ${cls ? 'bg-[#14181A]/10' : 'bg-soft'}" style="${cls ? '' : 'background:rgb(var(--soft))'}">${icon(ic, 'sm')}</span><p class="text-[13px] font-medium ${cls ? 'text-[#14181A]/70' : 'text-muted'} truncate">${label}</p></div>
      <p class="num font-display text-[38px] sm:text-[44px] font-bold leading-none mt-4">${val}</p>
      <p class="text-[12.5px] mt-2 ${cls ? 'text-[#14181A]/70' : 'text-muted'} truncate">${sub}</p></div>`;
  function ring(p) {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg width="64" height="64" viewBox="0 0 64 64" class="hidden sm:block absolute right-5 top-5" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="rgba(20,24,26,.14)" stroke-width="8"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="#1F4D3A" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(c * p) / 100} ${c}" transform="rotate(-90 32 32)"/></svg>`;
  }
  function render() {
    const s = O.stats(); const set = O.settings(); const t = O.now();
    const h = t.getHours(); const first = set.name.split(' ')[0] || 'there';
    $('#greet').textContent = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${first}`;
    $('#today').textContent = `${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][t.getDay()]}, ${O.fmtDate(t)} · ${s.thisWeek} applied this week`;
    const nextInt = s.upcoming[0];
    $('#stats').innerHTML =
      statCard('total', 'Applications', s.submitted, `+${s.thisWeek} this week · ${s.by.wishlist} in wishlist`, 'board') +
      statCard('interviews', 'Interviews', s.by.interview, nextInt ? `Next: ${esc(nextInt.company)}, ${O.until(nextInt.interview.at).toLowerCase()}` : 'None scheduled', 'video') +
      statCard('offers', 'Offers', s.by.offer, s.by.offer ? `${s.by.offer === 1 ? '1 offer' : s.by.offer + ' offers'} to review` : 'Keep going', 'flag') +
      `<div class="relative">${statCard('rate', 'Response rate', s.rate + '%', `${s.responded} of ${s.submitted} replied`, 'trend', 'card-lime')}${ring(s.rate)}</div>`;
    // chart
    const weeks = s.weeks.slice(8 - range); const max = Math.max(set.goal, ...weeks.map((w) => w.count), 1) + 1;
    const W = Math.max(300, Math.round($('#chart').clientWidth || 640)), H = W < 520 ? 200 : 230, padL = 24, padB = 28, bw = (W - padL) / weeks.length; const small = W < 520;
    const y = (v) => H - padB - (v / max) * (H - padB - 10);
    const grid = [0, Math.round(max / 2), max].map((v) => `<line x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="rgb(var(--line))"/><text x="0" y="${y(v) + 4}" font-size="11" fill="rgb(var(--muted))">${v}</text>`).join('');
    const bars = weeks.map((w, i) => { const cur = i === weeks.length - 1; const bh = Math.max(4, H - padB - y(w.count)); const x = padL + i * bw + bw * 0.2;
      return `<g class="wk" data-i="${i}" tabindex="0" role="img" aria-label="Week of ${w.label}: ${w.count} applications"><rect class="bar" x="${x}" y="${H - padB - bh}" width="${bw * 0.6}" height="${bh}" rx="10" fill="${cur ? '#C6F35E' : 'rgb(var(--brand))'}" ${cur ? 'stroke="rgb(var(--brand))" stroke-opacity=".35"' : ''}/>
        <text x="${x + bw * 0.3}" y="${H - padB - bh - 8}" text-anchor="middle" font-size="12" font-weight="600" fill="rgb(var(--ink))" font-family="Space Grotesk">${w.count}</text>
        <text x="${x + bw * 0.3}" y="${H - 8}" text-anchor="middle" font-size="${small ? 10 : 11.5}" fill="rgb(var(--muted))">${cur ? (small ? 'Now' : 'This wk') : small ? w.label.split(' ')[0] : w.label}</text></g>`; }).join('');
    const goal = `<line x1="${padL}" x2="${W}" y1="${y(set.goal)}" y2="${y(set.goal)}" stroke="rgb(var(--coral))" stroke-dasharray="5 5" stroke-width="1.5"/><text x="${W}" y="${y(set.goal) - 6}" text-anchor="end" font-size="11" font-weight="600" fill="rgb(var(--coral))">goal ${set.goal}</text>`;
    $('#chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" class="block overflow-visible" role="group" aria-label="Applications per week">${grid}${goal}${bars}</svg><div id="tip" class="hidden absolute card px-3 py-2 text-[12.5px] pointer-events-none shadow-lg"></div>`;
    const total = weeks.reduce((a, w) => a + w.count, 0);
    $('#chart-sub').textContent = `${total} in ${range} weeks · goal ${set.goal} / week`;
    $$('#range button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.w === range)));
    const tip = $('#tip');
    $$('#chart .wk').forEach((g) => { const show = () => { const w = weeks[g.dataset.i]; const r = g.getBoundingClientRect(), cr = $('#chart').getBoundingClientRect();
        tip.innerHTML = `<b>${w.count} applications</b><br><span class="text-muted">Week of ${w.label}</span>`; tip.classList.remove('hidden');
        tip.style.left = Math.min(cr.width - 150, Math.max(0, r.left - cr.left + r.width / 2 - 70)) + 'px'; tip.style.top = Math.max(0, r.top - cr.top - 58) + 'px'; };
      g.addEventListener('mouseenter', show); g.addEventListener('focus', show); g.addEventListener('mouseleave', () => tip.classList.add('hidden')); g.addEventListener('blur', () => tip.classList.add('hidden')); });
    // upcoming
    $('#upcoming').innerHTML = s.upcoming.length ? s.upcoming.slice(0, 3).map((a, i) => { const d = O.parse(a.interview.at);
      return `<li><a href="application.html?id=${a.id}" class="flex items-center gap-3 p-2.5 -mx-1 rounded-2xl hover:bg-[rgb(var(--soft))]">
        <span class="w-12 flex-none rounded-xl text-center py-1.5 ${i === 0 ? 'bg-lime text-[#14181A]' : 'bg-[rgb(var(--soft))]'}"><span class="block text-[11px] font-semibold uppercase">${O.DAY[d.getDay()]}</span><span class="block font-display text-[19px] font-bold leading-tight">${d.getDate()}</span></span>
        <span class="min-w-0 flex-1"><b class="block truncate font-semibold text-[14.5px]">${esc(a.company)}</b><span class="block truncate text-[12.5px] text-muted">${esc(a.role)} · ${esc(a.interview.kind)}</span></span>
        <span class="tag">${O.fmtTime(d)}</span></a></li>`; }).join('') : `<li class="text-[13.5px] text-muted py-4">No interviews yet. Move a card to Interview on the board.</li>`;
    // pipeline
    const tot = Math.max(1, s.total);
    const segs = O.STATUSES.map((st) => ({ ...st, n: s.by[st.id] })).filter((x) => x.n);
    const col = { wishlist: 'rgb(var(--slate))', applied: 'rgb(var(--steel))', interview: '#C6F35E', offer: 'rgb(var(--brand))', rejected: 'rgb(var(--coral))' };
    $('#pipe').innerHTML = `<div class="flex h-4 rounded-full overflow-hidden gap-[3px]" role="img" aria-label="Pipeline">${segs.map((x) => `<span style="width:${(x.n / tot) * 100}%;background:${col[x.id]}" title="${x.label} ${x.n}"></span>`).join('')}</div>
      <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3 mt-5">${O.STATUSES.map((st) => `<li data-st="${st.id}"><a href="board.html?status=${st.id}" class="flex items-center gap-2 text-[13px] text-muted hover:text-ink"><span class="st-dot"></span>${st.label}</a><p class="num font-display text-[24px] font-bold leading-tight mt-0.5" data-n="${st.id}">${s.by[st.id]}</p></li>`).join('')}</ul>`;
    // activity
    const ev = O.apps().flatMap((a) => a.timeline.map((e) => ({ ...e, a }))).sort((x, y) => (y.date > x.date ? 1 : y.date < x.date ? -1 : 0)).slice(0, 5);
    $('#activity').innerHTML = ev.map((e, i) => `<li class="${i ? 'done' : 'next'}"><span class="nd"></span><a href="application.html?id=${e.a.id}" class="block"><p class="text-[13.5px] leading-snug"><b class="font-semibold">${esc(e.a.company)}</b> <span class="text-muted">· ${esc(e.label)}</span></p><p class="text-[12px] text-muted">${O.fmtDate(e.date)}</p></a></li>`).join('') || '<li class="text-muted text-[13px]">Nothing yet.</li>';
    // next up
    const n = nextInt;
    $('#nextup').innerHTML = n ? `<p class="eyebrow !text-[#C6F35E]">Next up</p>
      <p class="font-display text-[44px] font-bold leading-none mt-3 num">${Math.max(0, O.daysBetween(t, O.parse(n.interview.at)))}<span class="text-[18px] font-semibold"> days</span></p>
      <p class="mt-2 text-[14px] text-white/80 leading-snug">to your <b class="text-white">${esc(n.interview.kind.toLowerCase())}</b> at ${esc(n.company)}</p>
      <a href="application.html?id=${n.id}" class="btn btn-lime mt-auto pt-0 w-full" style="margin-top:auto">Open prep notes ${icon('arrowR', 'sm')}</a>`
      : `<p class="eyebrow !text-[#C6F35E]">Next up</p><p class="font-display text-[22px] font-bold mt-3">No interviews yet</p><p class="text-white/80 text-[13.5px] mt-1">Apply to ${set.goal} roles this week.</p><button type="button" class="btn btn-lime mt-auto w-full" data-add2>Add application</button>`;
    const a2 = $('[data-add2]'); if (a2) a2.onclick = () => O.openModal();
    // reminder banner
    $('#remind')?.remove();
    if (set.reminders && n) { const hrs = (O.parse(n.interview.at) - t) / 36e5; if (hrs > 0 && hrs <= set.reminderHours) {
      const b = document.createElement('div'); b.id = 'remind'; b.className = 'card card-lime p-3.5 px-4 mb-4 flex items-center gap-3 text-[14px]';
      b.innerHTML = `${icon('bell')}<span class="flex-1 min-w-0"><b>${esc(n.company)}</b> ${esc(n.interview.kind.toLowerCase())} ${O.until(n.interview.at).toLowerCase()} at ${O.fmtTime(n.interview.at)}</span><a class="font-semibold underline" href="application.html?id=${n.id}">Prep</a>`;
      $('#stats').before(b); } }
  }
  $$('#range button').forEach((b) => (b.onclick = () => { range = +b.dataset.w; O.ls.set('range', range); render(); }));
  $('#export').onclick = () => O.exportCSV();
  O.on('orbit:change', render); O.on('orbit:theme', render);
  let rz; let lastW = 0; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { const w = $('#chart').clientWidth; if (Math.abs(w - lastW) > 8) { lastW = w; render(); } }, 120); });
  render();
})();
