/* Lumo UI Kit · course.js — lesson player (simulated), lesson list, notes, quiz, progress + streak */
(() => {
  const L = Lumo; L.boot(null);
  const { $, $$, D } = L;
  const id = new URLSearchParams(location.search).get('id') || L.lastCourse();
  const c = L.course(id) || D.courses[0];
  L.set('last', c.id);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const two = (n) => String(n + 1).padStart(2, '0');

  let cp = L.courseProg(c.id);
  let pos = L.get('pos.' + c.id, c.resumeAt || 0), playing = false, timer = null, speed = 1;
  const dur = () => Math.round(c.mins[cp.current] * 60);

  // static meta
  document.title = `Lumo · ${c.title}`;
  $('#title').textContent = c.title; $('#teacher').textContent = c.teacher; $('#t-init').textContent = c.teacher.replace('Dr. ', '')[0];
  $('#rating').textContent = c.rating; $('#count').textContent = `${c.lessons.length} lessons`;
  $('#tag').textContent = L.cat(c.cat).name; $('#tag').className = `tone-${L.cat(c.cat).tone} text-[12px] font-extrabold px-3 py-1 rounded-full`;
  $('#player').className = $('#player').className.replace(/tone-\w+/, 'tone-' + c.tone);
  $('#player-art').src = L.img(c.img);
  $('#notes').value = L.get('notes.' + c.id, '');

  function renderMeta() {
    const i = Math.min(cp.current, c.lessons.length - 1);
    $('#lesson-no').textContent = `Lesson ${i + 1}`;
    $('#now-chip').textContent = `${two(i)} · ${c.lessons[i]}`;
    $('#done-pct').textContent = `${L.pct(c.id)}% done`;
    const last = cp.done.length >= c.lessons.length;
    $('#next-label').textContent = last ? 'Course complete' : cp.current >= c.lessons.length - 1 ? 'Finish course' : 'Next lesson';
    $('#save').setAttribute('aria-pressed', String(L.isSaved(c.id)));
    $('#save').classList.toggle('!text-deep', L.isSaved(c.id));
    $('#save svg').classList.toggle('fill', L.isSaved(c.id));
  }
  function renderPlayer() {
    $('#scrub').max = dur(); $('#scrub').value = pos;
    $('#scrub').style.setProperty('--p', (pos / dur()) * 100 + '%');
    $('#time').textContent = `${fmt(pos)} / ${fmt(dur())}`;
    $('#play').innerHTML = L.icon(playing ? 'pause' : 'play', 'text-[15px]');
    $('#play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }
  function renderLessons() {
    $('#lessons').innerHTML = c.lessons.map((t, i) => {
      const done = cp.done.includes(i), now = i === cp.current;
      const badge = done ? `<span class="w-8 h-8 rounded-full bg-mint/20 text-mint grid place-items-center">${L.icon('check', 'text-[17px] !stroke-[2.6]')}</span>`
        : now ? `<span class="w-8 h-8 rounded-full pill-primary grid place-items-center">${L.icon('play', 'text-[13px]')}</span>`
        : `<span class="w-8 h-8 rounded-full bg-raised text-muted grid place-items-center text-[13px] font-extrabold">${i + 1}</span>`;
      return `<button type="button" data-i="${i}" class="flex items-center gap-3 rounded-[20px] px-3 h-[52px] text-left w-full ${now ? 'bg-primary/15 ring-1 ring-primary/30' : 'bg-surface shadow-soft'}" ${now ? 'aria-current="true"' : ''}>
        ${badge}<span class="flex-1 font-bold text-[15px] truncate ${done ? 'text-ink/70' : ''}">${t}</span>
        <span class="text-[12px] font-bold ${now ? 'text-deep' : 'text-muted'} tabular-nums">${fmt(c.mins[i] * 60)}</span></button>`;
    }).join('');
  }
  const save = () => { L.saveCourseProg(c.id, cp); L.set('pos.' + c.id, pos); };

  function complete() {
    const i = cp.current;
    if (!cp.done.includes(i)) { cp.done.push(i); L.addMinutes(Math.round(c.mins[i])); }
    if (L.totalDone() >= 10) L.earn('reader');
    if (cp.current < c.lessons.length - 1) { cp.current++; pos = 0; L.toast(`Lesson ${i + 1} done. Up next: ${c.lessons[cp.current]}`); }
    else { pos = dur(); L.toast('Course complete. Nice work!'); }
    stop(); save(); renderMeta(); renderPlayer(); renderLessons();
  }
  function stop() { playing = false; clearInterval(timer); }
  function play() {
    if (cp.done.length >= c.lessons.length) return L.toast('Course already complete');
    playing = true; timer = setInterval(() => {
      pos = Math.min(dur(), pos + speed); if (pos >= dur()) complete(); else { renderPlayer(); if (Math.round(pos) % 5 === 0) save(); }
    }, 1000);
  }

  $('#play').addEventListener('click', () => { playing ? stop() : play(); renderPlayer(); save(); });
  $('#scrub').addEventListener('input', (e) => { pos = +e.target.value; renderPlayer(); save(); });
  $('#speed').addEventListener('click', () => { speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1; $('#speed').textContent = speed + 'x'; });
  $('#next').addEventListener('click', () => (cp.done.length >= c.lessons.length ? L.toast('Course complete. Pick a new one in Explore') : complete()));
  $('#lessons').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]'); if (!b) return;
    stop(); cp.current = +b.dataset.i; pos = 0; save(); renderMeta(); renderPlayer(); renderLessons(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#save').addEventListener('click', () => { const on = L.toggleSaved(c.id); L.toast(on ? 'Saved to your list' : 'Removed from saved'); renderMeta(); });
  let nt; $('#notes').addEventListener('input', (e) => { clearTimeout(nt); nt = setTimeout(() => { L.set('notes.' + c.id, e.target.value); $('#notes-saved').textContent = 'Saved just now'; }, 300); });

  // Tabs
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    $$('#tabs [data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== b.dataset.tab));
    paintTabs();
  });
  function paintTabs() { $$('#tabs [data-tab]').forEach((x) => { const on = x.getAttribute('aria-selected') === 'true'; x.className = `h-9 rounded-full transition ${on ? 'bg-surface shadow-soft text-ink' : 'text-muted'}`; }); }

  // Quiz
  const Q = D.quiz[c.id] || D.quiz.default; const picked = {};
  function renderQuiz() {
    const score = Object.entries(picked).filter(([i, a]) => Q[i].ok === a).length, all = Object.keys(picked).length === Q.length;
    $('#quiz').innerHTML = Q.map((q, i) => `<div class="bg-surface rounded-card shadow-soft p-4"><p class="font-display font-semibold text-[16px] leading-snug">${i + 1}. ${q.q}</p>
      <div class="grid gap-2 mt-3">${q.a.map((a, j) => {
        const sel = picked[i] === j, show = picked[i] !== undefined, right = q.ok === j;
        const cls = show && right ? 'bg-mint/20 ring-1 ring-mint text-ink' : sel ? 'bg-peach ring-1 ring-[#E9A39C]' : 'bg-raised';
        return `<button type="button" data-q="${i}" data-a="${j}" ${show ? 'disabled' : ''} class="text-left rounded-2xl px-4 py-2.5 font-bold text-[14px] ${cls}">${a}</button>`; }).join('')}</div></div>`).join('')
      + (all ? `<div class="tone-cream rounded-card p-4 flex items-center gap-3"><img src="img/trophy.png" alt="" class="clay w-14"><div class="flex-1"><b class="font-display font-semibold text-[18px]">${score} / ${Q.length} correct</b><p class="text-[13px] text-ink/60 font-semibold">${score === Q.length ? 'Perfect! Badge unlocked.' : 'Review the lesson and try again.'}</p></div><button type="button" id="retry" class="chip">Retry</button></div>` : '');
    if (all && score === Q.length) L.earn('quiz');
  }
  $('#quiz').addEventListener('click', (e) => {
    if (e.target.id === 'retry') { Object.keys(picked).forEach((k) => delete picked[k]); return renderQuiz(); }
    const b = e.target.closest('[data-q]'); if (!b) return; picked[b.dataset.q] = +b.dataset.a; renderQuiz();
  });

  renderMeta(); renderPlayer(); renderLessons(); paintTabs(); renderQuiz();
})();
