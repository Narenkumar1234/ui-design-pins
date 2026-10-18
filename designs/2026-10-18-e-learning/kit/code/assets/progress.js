/* Lumo UI Kit · progress.js — streak, stats, weekly minutes chart with a daily goal, courses in progress, badges */
(() => {
  const L = Lumo; L.boot('Learning');
  const { $, $$, D } = L;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], full = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function render() {
    const w = L.week(), t = L.todayIdx(), s = L.streak(), goal = L.get('goal', D.user.goal);
    $('#streak-n').textContent = s;
    $('#streak-tip').textContent = w[t] ? 'You studied today. Nice!' : s ? `Study today to make it ${s + 1}` : 'Finish one lesson to start a streak';
    $('#days').innerHTML = w.map((m, i) => `<span class="flex-1 flex flex-col items-center gap-1">
      <span class="w-8 h-8 rounded-full grid place-items-center text-[12px] font-extrabold ${m ? 'pill-primary' : i === t ? 'bg-surface ring-2 ring-primary text-deep' : 'bg-surface/70 text-ink/40'}">${m ? L.icon('check', 'text-[15px] !stroke-[2.6]') : days[i]}</span>
      <span class="text-[11px] font-bold text-ink/50">${days[i]}</span></span>`).join('');

    $('#s-lessons').textContent = L.totalDone();
    $('#s-mins').textContent = w.reduce((a, b) => a + b, 0);
    $('#s-badges').textContent = `${L.badges().length}/${D.badges.length}`;

    // chart: bars scaled to max(goal, best day); dashed goal line
    const max = Math.max(goal, ...w) * 1.1, H = 92;
    $('#chart').innerHTML = `<div class="absolute left-0 right-0 border-t-2 border-dashed border-primary/40" style="bottom:${22 + (goal / max) * H}px"></div>`
      + `<div class="absolute inset-0 flex items-end justify-between gap-2">${w.map((m, i) => `
        <div class="flex-1 flex flex-col items-center gap-1.5" title="${full[i]}: ${m} min">
          <span class="w-full max-w-[26px] rounded-full ${i === t ? 'pill-primary' : m >= goal ? 'bg-primary/70' : 'bg-primary/30'}" style="height:${Math.max(6, (m / max) * H)}px"></span>
          <span class="text-[11px] font-bold ${i === t ? 'text-deep' : 'text-muted'}">${days[i]}</span></div>`).join('')}</div>`;
    $$('#goal [data-g]').forEach((b) => { const on = +b.dataset.g === goal; b.className = `px-2.5 h-7 rounded-full text-[12px] font-extrabold ${on ? 'bg-surface shadow-soft text-ink' : 'text-muted'}`; b.setAttribute('aria-pressed', String(on)); });
    $('#goal-note').textContent = `Daily goal: ${goal} min · ${w.filter((m) => m >= goal).length} of 7 days hit`;

    // courses in progress (started, not finished)
    const prog = L.progress();
    const list = D.courses.filter((c) => prog[c.id] && prog[c.id].done.length < c.lessons.length);
    $('#inprog').innerHTML = list.map((c) => { const cp = prog[c.id]; return `
      <a href="course.html?id=${c.id}" class="bg-surface rounded-card shadow-card p-3 flex items-center gap-3">
        <span class="tone-${c.tone} w-14 h-14 rounded-[18px] grid place-items-center shrink-0"><img src="${L.img(c.img)}" alt="" class="clay w-11 h-11 object-contain"></span>
        <span class="flex-1 min-w-0"><b class="block font-display font-semibold text-[16px] truncate">${c.title}</b>
          <span class="text-[12px] text-muted font-bold">Next: ${c.lessons[cp.current]} · ${L.pct(c.id)}%</span>
          <span class="bar block mt-1.5 !h-1.5"><i style="width:${L.pct(c.id)}%"></i></span></span>
        <span class="w-9 h-9 rounded-full pill-primary grid place-items-center shrink-0">${L.icon('play', 'text-[13px]')}</span></a>`; }).join('')
      || '<p class="text-muted">No courses in progress. <a class="text-deep font-bold" href="explore.html">Explore</a></p>';

    const got = L.badges();
    $('#badges').innerHTML = D.badges.map((b) => { const on = got.includes(b.id); return `
      <div class="flex flex-col items-center gap-1 text-center ${on ? '' : 'opacity-40 grayscale'}" title="${on ? 'Unlocked' : 'Locked'}">
        <span class="w-[68px] h-[68px] rounded-full ${on ? 'tone-sky' : 'bg-raised'} grid place-items-center"><img src="${L.img(b.img)}" alt="" class="clay w-12 h-12 object-contain"></span>
        <span class="text-[11px] font-bold leading-tight">${b.name}</span>${on ? '' : `<span class="text-[10px] text-muted font-bold flex items-center gap-0.5">${L.icon('lock', 'text-[11px]')}Locked</span>`}</div>`; }).join('');
  }
  $('#goal').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b) return; L.set('goal', +b.dataset.g); render(); L.toast(`Daily goal set to ${b.dataset.g} min`); });
  render();
})();
