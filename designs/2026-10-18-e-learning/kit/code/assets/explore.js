/* Lumo UI Kit · explore.js — staggered subject grid, filter pills, live search, subject bottom sheet */
(() => {
  const L = Lumo; L.boot('Explore');
  const { $, $$, D } = L;
  const counts = { coding: 24, design: 18, science: 15, languages: 20, writing: 11, exams: 9 }; // catalogue size shown on cards
  let filter = 'all';

  const courseRow = (k) => `
    <a href="course.html?id=${k.id}" class="bg-surface rounded-card shadow-card p-3 flex items-center gap-3">
      <span class="tone-${k.tone} w-14 h-14 rounded-[18px] grid place-items-center shrink-0"><img src="${L.img(k.img)}" alt="" class="clay w-11 h-11 object-contain"></span>
      <span class="flex-1 min-w-0"><b class="block font-display font-semibold text-[16px] leading-snug truncate">${k.title}</b>
        <span class="text-[13px] text-muted font-semibold">${k.teacher} · ${k.lessons.length} lessons</span>
        <span class="bar block mt-1.5 !h-1.5"><i style="width:${L.pct(k.id)}%"></i></span></span>
      <svg class="icon text-[20px] text-muted"><use href="#i-arrow"/></svg></a>`;

  function renderGrid() {
    const list = D.categories.filter((c) => filter === 'all' || c.tags.includes(filter));
    $('#grid').innerHTML = list.map((c) => `
      <button type="button" data-cat="${c.id}" class="tone-${c.tone} rounded-tile p-4 pt-3 text-left shadow-soft transition hover:-translate-y-0.5 w-full">
        <img src="${L.img(c.img)}" alt="" class="clay w-full h-[112px] object-contain" draggable="false">
        <b class="block font-display font-semibold text-[19px] mt-2">${c.name}</b>
        <span class="text-[13px] text-ink/55 font-bold">${counts[c.id]} courses</span>
      </button>`).join('') || '<p class="col-span-2 text-muted text-center py-10">Nothing here yet.</p>';
    $('#grid').classList.toggle('flat', list.length < 3);
  }

  function openSheet(id) {
    const c = L.cat(id); const list = D.courses.filter((k) => k.cat === id);
    $('#sheet-art').className = `tone-${c.tone} w-14 h-14 rounded-[18px] grid place-items-center`;
    $('#sheet-art').innerHTML = `<img src="${L.img(c.img)}" alt="" class="clay w-11 h-11 object-contain">`;
    $('#sheet-title').textContent = c.name;
    $('#sheet-sub').textContent = `${list.length} featured of ${counts[id]} courses`;
    $('#sheet-list').innerHTML = list.map(courseRow).join('');
    $('#sheet').classList.add('open'); $('#scrim').classList.add('open'); $('#sheet-close').focus();
  }
  const closeSheet = () => { $('#sheet').classList.remove('open'); $('#scrim').classList.remove('open'); };

  function search(q) {
    q = q.trim().toLowerCase();
    $('#results').classList.toggle('hidden', !q); $('#grid').classList.toggle('hidden', !!q); $('#filters').classList.toggle('hidden', !!q);
    if (!q) return;
    const hits = D.courses.filter((k) => (k.title + ' ' + k.teacher + ' ' + L.cat(k.cat).name).toLowerCase().includes(q));
    $('#res-label').textContent = hits.length ? `${hits.length} result${hits.length > 1 ? 's' : ''}` : 'No courses found';
    $('#res-list').innerHTML = hits.map(courseRow).join('');
  }

  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f; $$('#filters .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); renderGrid();
  });
  $('#grid').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) openSheet(b.dataset.cat); });
  $('#scrim').addEventListener('click', closeSheet); $('#sheet-close').addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  $('#search-btn').addEventListener('click', () => {
    const w = $('#search-wrap'); const open = w.classList.toggle('hidden') === false;
    w.classList.toggle('flex', open); $('#search-btn').setAttribute('aria-expanded', String(open));
    if (open) $('#q').focus(); else { $('#q').value = ''; search(''); }
  });
  $('#q').addEventListener('input', (e) => search(e.target.value));

  renderGrid();
  const pre = new URLSearchParams(location.search).get('cat');
  if (pre && L.cat(pre)) openSheet(pre);
})();
