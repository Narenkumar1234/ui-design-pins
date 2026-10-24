/* Nimbus UI Kit · cities.js — saved cities (glass cards with local time, condition, H/L), search + add from the catalog,
   edit mode (reorder ↑ ↓, remove, keeps at least one), tap a card to make it active and open Home. */
(() => {
  const N = Nimbus, { $, esc } = N;
  let editing = false;

  function card(id) {
    const w = N.mock(N.city(id)), c = w.city, act = id === N.activeId(), list = N.saved(), i = list.indexOf(id);
    return `<li class="relative fade-in" data-row="${id}">
      <button type="button" class="city glass ${act ? 'hi' : ''} w-full flex items-center gap-3 p-4 pr-3 text-left" data-city="${id}" ${act ? 'aria-current="true"' : ''} aria-label="${esc(c.name)}, ${N.deg(w.now.t)}, ${esc(N.condText(w.now.cond, w.now.night))}" ${editing ? 'tabindex="-1"' : ''} style="${act ? 'box-shadow:0 0 0 2px rgb(255 255 255 / .9), 0 24px 44px -28px rgb(var(--gs) / .55)' : ''}">
        <span class="flex-1 min-w-0">
          <span class="flex items-center gap-1.5 text-[18px] font-semibold truncate">${esc(c.name)}${c.home ? `<span class="text-muted">${N.icon('nav', 'text-[14px]')}</span>` : ''}</span>
          <span class="block text-[12px] text-muted mt-0.5">${c.home ? 'My location · ' : ''}${N.localClock(w.local)}</span>
          <span class="block text-[13px] font-medium mt-3">${esc(N.condText(w.now.cond, w.now.night))}</span>
        </span>
        ${editing ? '' : `<span class="-my-2">${N.wxIcon(w.now.cond, w.now.night, 62)}</span>`}
        ${editing ? '<span class="w-[124px]"></span>' : `<span class="text-right"><b class="num text-[46px] block">${N.deg(w.now.t)}</b><span class="text-[11px] text-muted whitespace-nowrap">H ${N.deg(w.daily[0].hi)} L ${N.deg(w.daily[0].lo)}</span></span>`}
      </button>
      ${editing ? `<div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
        <button type="button" class="btn-round !w-9 !h-9" data-move="-1" data-id="${id}" aria-label="Move ${esc(c.name)} up" ${i === 0 ? 'disabled style="opacity:.35"' : ''}>${N.icon('up', 'text-[16px]')}</button>
        <button type="button" class="btn-round !w-9 !h-9" data-move="1" data-id="${id}" aria-label="Move ${esc(c.name)} down" ${i === list.length - 1 ? 'disabled style="opacity:.35"' : ''}>${N.icon('down', 'text-[16px]')}</button>
        <button type="button" class="btn-round !w-9 !h-9 !text-[#E5484D]" data-remove="${id}" aria-label="Remove ${esc(c.name)}">${N.icon('trash', 'text-[16px]')}</button></div>` : ''}
    </li>`;
  }
  function render() {
    const list = N.saved(); N.sky(N.weather().now.cond);
    $('#list').innerHTML = list.map(card).join('');
    $('#count').textContent = list.length;
    $('#edit').textContent = editing ? 'Done' : 'Edit'; $('#edit').setAttribute('aria-pressed', editing);
    $('#hint').textContent = editing ? 'Reorder or remove' : 'Tap a city to open it';
    search();
  }
  function matches(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    return N.D.catalog.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)).slice(0, 6);
  }
  function search() {
    const q = $('#q').value, res = matches(q), saved = N.saved();
    $('#clear').classList.toggle('hidden', !q);
    $('#results-wrap').classList.toggle('hidden', !q.trim());
    $('#empty').classList.toggle('hidden', !!res.length); $('#results').classList.toggle('hidden', !res.length); $('#empty-q').textContent = q.trim();
    $('#results').innerHTML = res.map((c) => { const w = N.mock(c), has = saved.includes(c.id);
      return `<li class="flex items-center gap-3 p-2 pl-3"><span>${N.wxIcon(w.now.cond, w.now.night, 34)}</span>
        <span class="flex-1 min-w-0"><b class="block text-[15px] font-semibold truncate">${esc(c.name)}</b><span class="text-[12px] text-muted">${esc(c.country)} · ${N.deg(w.now.t)} · ${esc(N.condText(w.now.cond, w.now.night))}</span></span>
        <button type="button" class="${has ? 'btn-ghost' : 'btn-sun !h-9 !px-4 !text-[13px]'}" data-add="${c.id}" ${has ? 'disabled aria-label="Already saved"' : `aria-label="Add ${esc(c.name)}"`}>${has ? N.icon('check', 'text-[15px]') + 'Saved' : N.icon('plus', 'text-[15px]') + 'Add'}</button></li>`; }).join('');
  }
  function add(id) {
    const list = N.saved(); if (list.includes(id)) { N.toast('Already in your cities'); return; }
    if (list.length >= 12) { N.toast('You can save up to 12 cities'); return; }
    list.push(id); N.saveCities(list); $('#q').value = ''; render(); N.toast(`${N.city(id).name} added`);
    const el = document.querySelector(`[data-row="${id}"]`); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('#s-ic').innerHTML = N.icon('search', 'text-[20px]'); $('#clear').innerHTML = N.icon('x', 'text-[16px]');
    const q = new URLSearchParams(location.search); if (q.get('q')) $('#q').value = q.get('q'); if (q.get('edit')) editing = true;
    render();
    $('#q').addEventListener('input', search);
    $('#search').addEventListener('submit', (e) => { e.preventDefault(); const r = matches($('#q').value).find((c) => !N.saved().includes(c.id)); if (r) add(r.id); else if ($('#q').value.trim()) N.toast('Nothing new to add'); });
    $('#clear').addEventListener('click', () => { $('#q').value = ''; search(); $('#q').focus(); });
    $('#results').addEventListener('click', (e) => { const b = e.target.closest('[data-add]'); if (b && !b.disabled) add(b.dataset.add); });
    $('#edit').addEventListener('click', () => { editing = !editing; render(); });
    $('#list').addEventListener('click', (e) => {
      const mv = e.target.closest('[data-move]'), rm = e.target.closest('[data-remove]'), c = e.target.closest('[data-city]');
      const list = N.saved();
      if (mv) { const i = list.indexOf(mv.dataset.id), j = i + +mv.dataset.move; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; N.saveCities(list); render(); return; }
      if (rm) { if (list.length <= 1) { N.toast('Keep at least one city'); return; } const id = rm.dataset.remove; N.saveCities(list.filter((x) => x !== id)); if (N.get('active') === id) N.del('active'); render(); N.toast(`${N.city(id).name} removed`); return; }
      if (c && !editing) { N.setActive(c.dataset.city); location.href = 'index.html'; }
    });
    document.addEventListener('nimbus:theme', render);
  });
})();
