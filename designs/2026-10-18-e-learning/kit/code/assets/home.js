/* Lumo UI Kit · home.js — greeting, continue CTA, progress card, picks + popular courses */
(() => {
  const L = Lumo; L.boot('Home');
  const { $, D } = L;
  const h = new Date().getHours();
  $('#greet').textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  $('#uname').textContent = D.user.name; $('#avatar').textContent = D.user.initial;

  // Continue where you left off
  const c = L.course(L.lastCourse()); const cp = L.courseProg(c.id); const n = c.lessons.length;
  $('#continue').href = `course.html?id=${c.id}`;
  $('#continue-label').textContent = `Continue: ${c.title}`;
  $('#prog-lesson').textContent = `Lesson ${Math.min(cp.current + 1, n)} of ${n}`;
  $('#prog-bar').style.width = L.pct(c.id) + '%';
  $('#prog-pct').textContent = `${L.pct(c.id)}% complete`;
  const s = L.streak();
  $('#streak').textContent = s ? `${s}-day streak` : 'Start a streak today';

  // Today's picks: first 3 categories (6 on desktop)
  $('#picks').innerHTML = D.categories.map((k, i) => `
    <a href="explore.html?cat=${k.id}" class="tone-${k.tone} rounded-[22px] pt-3 pb-3 px-2 flex flex-col items-center gap-1.5 shadow-soft ${i > 2 ? 'hidden md:flex' : ''}">
      <img src="${L.img(k.img)}" alt="" class="clay w-[62px] h-[62px] object-contain" draggable="false">
      <span class="font-display font-semibold text-[14px]">${k.name}</span></a>`).join('');

  // Popular courses
  const pop = [...D.courses].sort((a, b) => b.rating - a.rating).slice(0, 4);
  $('#pop-count').textContent = `${D.courses.length} courses`;
  $('#popular').innerHTML = pop.map((k) => `
    <a href="course.html?id=${k.id}" class="bg-surface rounded-card shadow-card p-3 flex items-center gap-3">
      <span class="tone-${k.tone} w-16 h-16 rounded-[18px] grid place-items-center shrink-0"><img src="${L.img(k.img)}" alt="" class="clay w-12 h-12 object-contain"></span>
      <span class="flex-1 min-w-0"><b class="block font-display font-semibold text-[16px] leading-snug truncate">${k.title}</b>
        <span class="text-[13px] text-muted font-semibold">${k.teacher} · ${k.lessons.length} lessons</span></span>
      <span class="flex items-center gap-1 text-[13px] font-bold"><svg class="icon fill text-[15px] text-[#F5B94A]"><use href="#i-star"/></svg>${k.rating}</span></a>`).join('');

  $('#bell').addEventListener('click', () => L.toast('No new notifications'));
})();
