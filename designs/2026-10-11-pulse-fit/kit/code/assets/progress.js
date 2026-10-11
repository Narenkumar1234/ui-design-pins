(async function () {
  const data = await loadWorkout();
  const week = data.week;
  const max = Math.max(...week.map((d) => d.workouts), 1);
  const total = week.reduce((s, d) => s + d.workouts, 0);
  document.getElementById('week-total').textContent = total + ' workouts';

  const accents = ['bg-blue', 'bg-card', 'bg-pink', 'bg-yellow', 'bg-card', 'bg-lime', 'bg-lime'];
  const bars = document.getElementById('bars');
  bars.innerHTML = week.map((d, i) => {
    const h = Math.max(12, Math.round((d.workouts / max) * 140));
    const fill = d.workouts === 0 ? 'bg-card' : accents[i];
    return `<div class="bar-col">
      <div class="bar-fill ${fill}" style="height:${h}px" title="${d.workouts}"></div>
      <span class="text-[11px] font-extrabold">${d.day}</span>
    </div>`;
  }).join('');

  const prs = document.getElementById('prs');
  prs.innerHTML = data.prs.map((p) => {
    const bg = p.accent === 'pink' ? 'bg-pink' : 'bg-lime';
    return `<div class="brut p-4 ${bg}">
      <p class="text-[11px] font-extrabold tracking-widest uppercase opacity-80">${p.name}</p>
      <p class="font-display font-bold text-2xl mt-1">${p.value}</p>
    </div>`;
  }).join('');

  const cal = document.getElementById('cal');
  cal.innerHTML = data.calendar.map((v) =>
    `<span class="cal-dot ${v ? 'done' : ''}" title="${v ? 'workout' : 'rest'}"></span>`
  ).join('');

  renderBottomNav('progress');
})();
