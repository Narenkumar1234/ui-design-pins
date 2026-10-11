(async function () {
  const data = await loadWorkout();
  const u = data.user;
  const t = data.today;
  document.getElementById('greeting').textContent = u.name;
  const streak = getStreak(u.streak);
  document.getElementById('streak-n').textContent = streak;
  document.getElementById('w-title').textContent = t.title;
  document.getElementById('w-dur').textContent = t.durationMin + ' min';
  document.getElementById('w-diff').textContent = t.difficulty;
  document.getElementById('w-ex').textContent = t.exercises.length + ' exercises';
  document.getElementById('stat-kcal').textContent = t.kcal;
  document.getElementById('stat-min').textContent = t.durationMin;
  document.getElementById('stat-wo').textContent = isWorkoutDoneToday() ? '1' : '0';
  const preview = document.getElementById('preview');
  preview.innerHTML = t.exercises.slice(0, 4).map((e) =>
    `<li>• <b class="text-ink">${e.name}</b> — ${e.sets}×${e.reps}</li>`
  ).join('') + (t.exercises.length > 4 ? `<li class="text-muted">+ ${t.exercises.length - 4} more</li>` : '');
  if (isWorkoutDoneToday()) {
    document.getElementById('done-banner').classList.remove('hidden');
  }
  renderBottomNav('home');
})();
