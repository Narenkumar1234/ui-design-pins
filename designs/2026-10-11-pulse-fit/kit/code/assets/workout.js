(async function () {
  const data = await loadWorkout();
  const t = data.today;
  document.getElementById('w-title').textContent = t.title;

  let remaining = t.exercises[0]?.restSec || 90;
  let running = false;
  let tick = null;
  const timerEl = document.getElementById('timer');
  const toggleBtn = document.getElementById('timer-toggle');

  function paintTimer() { timerEl.textContent = fmtTime(remaining); }
  paintTimer();

  function startTimer() {
    if (tick) return;
    running = true;
    toggleBtn.textContent = 'Pause';
    tick = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(tick); tick = null; running = false;
        toggleBtn.textContent = 'Start';
        toast('Rest done — next set!');
        return;
      }
      remaining -= 1;
      paintTimer();
    }, 1000);
  }
  function pauseTimer() {
    running = false;
    toggleBtn.textContent = 'Resume';
    if (tick) { clearInterval(tick); tick = null; }
  }

  toggleBtn.addEventListener('click', () => {
    if (running) pauseTimer(); else startTimer();
  });
  document.getElementById('timer-reset').addEventListener('click', () => {
    pauseTimer();
    remaining = t.exercises[0]?.restSec || 90;
    paintTimer();
    toggleBtn.textContent = 'Start';
  });

  const list = document.getElementById('ex-list');
  const prog = document.getElementById('ex-progress');
  let done = new Set(getExDone());

  function render() {
    prog.textContent = `${done.size} / ${t.exercises.length} done`;
    list.innerHTML = t.exercises.map((e) => {
      const on = done.has(e.id);
      return `<li>
        <button type="button" data-id="${e.id}" class="brut w-full p-3.5 text-left flex items-center gap-3 ${on ? 'bg-lime/40' : ''}">
          <span class="w-7 h-7 shrink-0 rounded-full border-[3px] border-outline flex items-center justify-center font-extrabold text-sm ${on ? 'bg-lime' : 'bg-card'}">${on ? '✓' : ''}</span>
          <span class="flex-1 min-w-0">
            <span class="font-display font-bold text-base block">${e.name}</span>
            <span class="text-xs font-bold text-muted">${e.sets}×${e.reps} · rest ${e.restSec}s</span>
          </span>
          <span class="brut-sm bg-pink text-ink px-2 py-0.5 text-[10px] font-extrabold uppercase">${e.sets} sets</span>
        </button>
        <div class="h-1.5 mt-1.5 mx-1 rounded bg-ink/10 overflow-hidden border border-outline/30">
          <div class="h-full bg-lime border-r-2 border-outline transition-all" style="width:${on ? 100 : 0}%"></div>
        </div>
      </li>`;
    }).join('');
    list.querySelectorAll('[data-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        done = new Set(toggleExDone(btn.dataset.id));
        remaining = t.exercises.find((x) => x.id === btn.dataset.id)?.restSec || remaining;
        paintTimer();
        render();
      });
    });
  }
  render();

  const cta = document.getElementById('cta');
  let started = false;
  function updateCta() {
    if (isWorkoutDoneToday()) {
      cta.textContent = 'Completed ✓';
      cta.classList.add('opacity-80');
      return;
    }
    if (done.size === t.exercises.length && done.size > 0) {
      cta.textContent = 'Complete Workout';
    } else if (started) {
      cta.textContent = `Keep Going (${done.size}/${t.exercises.length})`;
    } else {
      cta.textContent = 'Start Workout';
    }
  }
  updateCta();

  cta.addEventListener('click', () => {
    if (isWorkoutDoneToday()) { toast('Already done today'); return; }
    if (!started) {
      started = true;
      startTimer();
      toast('Workout started — rest timer running');
      updateCta();
      return;
    }
    if (done.size < t.exercises.length) {
      toast(`Mark all exercises done (${done.size}/${t.exercises.length})`);
      return;
    }
    markWorkoutDone();
    pauseTimer();
    updateCta();
    toast('Workout complete! Streak +1 🔥');
  });

  renderBottomNav('workout');
})();
