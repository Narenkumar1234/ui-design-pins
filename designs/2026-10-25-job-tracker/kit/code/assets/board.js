/* Orbit UI Kit · board.js — kanban board.
   Drag-and-drop between and within columns (HTML5 DnD), keyboard moves (Shift + ← → to change column, Shift + ↑ ↓ to reorder,
   arrows to move focus, Enter to open, M for the menu), per-card menu (Move to / Open / Edit / Delete), undo toast,
   filter chips, sort, top-bar search, mobile status tabs, CSV export of what you see. */
(function () {
  const O = window.Orbit; const { $, $$, esc, icon } = O;
  O.init('board');
  const qs = new URLSearchParams(location.search);
  let filter = O.ls.get('filter', 'all'), sort = O.ls.get('sort', 'manual'), q = qs.get('q') || '';
  let tab = qs.get('status') || O.ls.get('tab', 'interview'); let focusId = null;
  const ORDER = O.STATUSES.map((s) => s.id);

  const visible = (a) => {
    if (filter === 'Remote' ? a.mode !== 'Remote' : filter !== 'all' && a.type !== filter) return false;
    if (!q.trim()) return true;
    return `${a.company} ${a.role} ${a.location} ${a.source}`.toLowerCase().includes(q.trim().toLowerCase());
  };
  const sorted = (list) => {
    if (sort === 'company') return [...list].sort((x, y) => x.company.localeCompare(y.company));
    if (sort === 'recent') return [...list].sort((x, y) => (y.updated || '').localeCompare(x.updated || '') || (y.applied || '').localeCompare(x.applied || ''));
    if (sort === 'salary') { const yr = (a) => (a.per === 'yr' ? +a.salary : +a.salary * 12) || 0; return [...list].sort((x, y) => yr(y) - yr(x)); }
    return list;
  };
  const card = (a) => {
    const up = a.interview && a.interview.at && O.parse(a.interview.at) >= O.startOfDay(O.now());
    return `<article class="kcard" draggable="true" tabindex="0" data-id="${a.id}" data-st="${a.status}" aria-label="${esc(a.role)} at ${esc(a.company)}, ${O.ST[a.status]}">
      <div class="flex items-center gap-2.5">${O.mono(a, 'sm')}
        <p class="min-w-0 flex-1 text-[13px] font-medium text-muted truncate">${esc(a.company)}</p>
        <button type="button" class="w-8 h-8 -mr-1 rounded-full grid place-items-center text-muted hover:bg-[rgb(var(--soft))] flex-none" data-menu aria-haspopup="menu" aria-label="Actions for ${esc(a.company)}">${icon('dots', 'sm')}</button></div>
      <a href="application.html?id=${a.id}" class="block mt-2.5 font-semibold text-[15px] leading-snug hover:underline" draggable="false">${esc(a.role)}</a>
      <div class="flex flex-wrap gap-1.5 mt-2.5"><span class="tag">${icon('pin', 'sm')}${esc(a.location || a.mode)}</span>${a.salary ? `<span class="tag">${esc(O.fmtSalary(a))}</span>` : ''}${a.type === 'Internship' ? '' : `<span class="tag">${esc(a.type)}</span>`}</div>
      <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-line text-[12px] text-muted">${up ? `<span class="tag tag-lime">${icon('video', 'sm')}${O.DAY[O.parse(a.interview.at).getDay()]} ${O.fmtTime(a.interview.at)}</span><span class="ml-auto font-semibold text-ink">${O.until(a.interview.at)}</span>` : `<span class="whitespace-nowrap">${O.ago(a.applied)}</span><span class="ml-auto min-w-0 truncate">${esc(a.source || '')}</span>`}</div>
    </article>`;
  };
  function render() {
    const all = O.apps(); const vis = all.filter(visible);
    $('#board-sub').textContent = `${vis.length}${vis.length !== all.length ? ' of ' + all.length : ''} applications`;
    $$('#filters [data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
    $('#filter-note').textContent = q.trim() ? `Matching “${q.trim()}”` : '';
    $('#sort').value = sort;
    $('#tabs').innerHTML = O.STATUSES.map((s) => `<button type="button" role="tab" class="chip" data-tab="${s.id}" aria-selected="${s.id === tab}" aria-pressed="${s.id === tab}" data-st="${s.id}"><span class="st-dot"></span>${s.label} <b class="cnt">${vis.filter((a) => a.status === s.id).length}</b></button>`).join('');
    $('#board').innerHTML = O.STATUSES.map((s) => { const list = sorted(vis.filter((a) => a.status === s.id));
      return `<section class="col${s.id === tab ? ' active' : ''}" data-col="${s.id}" data-st="${s.id}" aria-label="${s.label}">
        <h2 class="col-h"><span class="st-dot"></span>${s.label}<span class="count" data-count="${s.id}">${list.length}</span></h2>
        <div class="flex flex-col gap-2.5" data-list="${s.id}" role="list">${list.map(card).join('')}</div>
        <button type="button" class="add-slot" data-add-to="${s.id}">${icon('plus', 'sm')}Add to ${s.label}</button></section>`; }).join('');
    $('#empty').classList.toggle('hidden', vis.length > 0 || all.length === 0);
    $('#board').classList.toggle('hidden', vis.length === 0 && all.length > 0);
    const at = $('#tabs [aria-pressed="true"]'); if (at) { const tb = $('#tabs'); const r = at.offsetLeft + at.offsetWidth - tb.offsetLeft; if (r > tb.scrollLeft + tb.clientWidth) tb.scrollLeft = r - tb.clientWidth + 16; else if (at.offsetLeft - tb.offsetLeft < tb.scrollLeft) tb.scrollLeft = at.offsetLeft - tb.offsetLeft - 16; }
    wire();
    if (focusId) { const el = $(`.kcard[data-id="${focusId}"]`); if (el) el.focus(); focusId = null; }
  }
  function doMove(id, status, index, how) {
    const a = O.get(id); if (!a) return; const from = a.status; const snap = JSON.parse(JSON.stringify(O.apps()));
    const changed = O.move(id, status, sort === 'manual' ? index : null);
    if (status !== tab && window.innerWidth < 768 && how !== 'kbd') { /* stay on the current tab on mobile */ }
    const el = $(`.kcard[data-id="${id}"]`); if (el) el.classList.add('moved');
    if (changed) {
      $('#live').textContent = `${a.company} moved from ${O.ST[from]} to ${O.ST[status]}`;
      O.toast(`${a.company} → ${O.ST[status]}`, () => { const arr = O.apps(); arr.length = 0; arr.push(...snap); O.persist('undo'); focusId = id; });
    } else $('#live').textContent = `${a.company} reordered in ${O.ST[status]}`;
  }
  let menuEl = null;
  const closeMenu = () => { if (menuEl) { menuEl.remove(); menuEl = null; } };
  function openMenu(cardEl, btn) {
    closeMenu(); const a = O.get(cardEl.dataset.id);
    menuEl = document.createElement('div'); menuEl.className = 'menu'; menuEl.setAttribute('role', 'menu'); menuEl.id = 'card-menu';
    menuEl.innerHTML = `<p class="px-2.5 pt-1 pb-1.5 eyebrow">Move to</p>${O.STATUSES.filter((s) => s.id !== a.status).map((s) => `<button type="button" role="menuitem" data-to="${s.id}" data-st="${s.id}"><span class="st-dot"></span>${s.label}</button>`).join('')}
      <div class="sep"></div><a role="menuitem" href="application.html?id=${a.id}">${icon('arrowR', 'sm')}Open details</a><button type="button" role="menuitem" data-act="edit">${icon('edit', 'sm')}Edit</button><button type="button" role="menuitem" data-act="del" class="!text-[rgb(var(--coral))]">${icon('trash', 'sm')}Delete</button>`;
    cardEl.appendChild(menuEl); menuEl.style.right = '8px'; menuEl.style.top = '40px';
    const items = $$('[role=menuitem]', menuEl); items[0].focus();
    menuEl.addEventListener('keydown', (e) => { const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Escape') { e.stopPropagation(); closeMenu(); (btn || cardEl).focus(); } });
    menuEl.addEventListener('click', (e) => { e.stopPropagation(); const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.to) { focusId = a.id; closeMenu(); doMove(a.id, b.dataset.to, null, 'menu'); }
      else if (b.dataset.act === 'edit') { closeMenu(); O.openModal(a); }
      else if (b.dataset.act === 'del') { closeMenu(); const r = O.remove(a.id); O.toast(`Deleted ${a.company}`, () => O.restore(r)); } });
  }
  function wire() {
    let dragId = null;
    $$('.kcard').forEach((el) => {
      el.addEventListener('dragstart', (e) => { dragId = el.dataset.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); requestAnimationFrame(() => el.classList.add('dragging')); closeMenu(); });
      el.addEventListener('dragend', () => { el.classList.remove('dragging'); $$('.col').forEach((c) => c.classList.remove('drop')); });
      el.addEventListener('click', (e) => { if (e.target.closest('[data-menu]')) { e.stopPropagation(); openMenu(el, e.target.closest('[data-menu]')); } });
      el.addEventListener('dblclick', (e) => { if (!e.target.closest('button,a')) location.href = `application.html?id=${el.dataset.id}`; });
      el.addEventListener('keydown', (e) => {
        if (e.target !== el) return; const id = el.dataset.id, a = O.get(id), ci = ORDER.indexOf(a.status);
        const colCards = $$(`[data-list="${a.status}"] .kcard`); const ri = colCards.indexOf(el);
        if (e.key === 'Enter') { location.href = `application.html?id=${id}`; }
        else if (e.key === 'm' || e.key === 'M') { e.preventDefault(); openMenu(el); }
        else if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); const ni = ci + (e.key === 'ArrowRight' ? 1 : -1); if (ni < 0 || ni >= ORDER.length) return; focusId = id; if (window.innerWidth < 768) { tab = ORDER[ni]; O.ls.set('tab', tab); } doMove(id, ORDER[ni], null, 'kbd'); }
        else if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); if (sort !== 'manual') { O.toast('Switch sort to “My order” to reorder'); return; } const full = O.apps().filter((x) => x.status === a.status && x.id !== id); const cur = O.apps().filter((x) => x.status === a.status).indexOf(a); const ni = cur + (e.key === 'ArrowUp' ? -1 : 1); if (ni < 0 || ni > full.length) return; focusId = id; doMove(id, a.status, ni, 'kbd'); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = colCards[ri + (e.key === 'ArrowDown' ? 1 : -1)]; n && n.focus(); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); for (let k = ci + (e.key === 'ArrowRight' ? 1 : -1); k >= 0 && k < ORDER.length; k += e.key === 'ArrowRight' ? 1 : -1) { const cs = $$(`[data-list="${ORDER[k]}"] .kcard`); if (cs.length) { cs[Math.min(ri, cs.length - 1)].focus(); break; } } }
        else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); const r = O.remove(id); O.toast(`Deleted ${a.company}`, () => O.restore(r)); }
      });
    });
    $$('.col').forEach((col) => {
      col.addEventListener('dragover', (e) => { if (!dragId) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; $$('.col').forEach((c) => c.classList.toggle('drop', c === col)); });
      col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('drop'); });
      col.addEventListener('drop', (e) => {
        e.preventDefault(); const id = dragId || e.dataTransfer.getData('text/plain'); if (!id) return; col.classList.remove('drop');
        const status = col.dataset.col; const cards = $$(`.kcard`, col).filter((c) => c.dataset.id !== id);
        const before = cards.find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
        const full = O.apps().filter((x) => x.status === status && x.id !== id);
        const index = before ? full.findIndex((x) => x.id === before.dataset.id) : full.length;
        dragId = null; focusId = id; doMove(id, status, index, 'drag');
      });
    });
    $$('[data-add-to]').forEach((b) => (b.onclick = () => O.openModal(null, { status: b.dataset.addTo, applied: b.dataset.addTo === 'wishlist' ? '' : O.iso(O.now()) })));
    $$('#tabs [data-tab]').forEach((b) => (b.onclick = () => { tab = b.dataset.tab; O.ls.set('tab', tab); render(); }));
  }
  document.addEventListener('click', (e) => { if (menuEl && !menuEl.contains(e.target)) closeMenu(); });
  $$('#filters [data-f]').forEach((b) => (b.onclick = () => { filter = b.dataset.f; O.ls.set('filter', filter); render(); }));
  $('#sort').onchange = (e) => { sort = e.target.value; O.ls.set('sort', sort); render(); };
  $('#clear-f').onclick = () => { filter = 'all'; q = ''; $('#search').value = ''; O.ls.set('filter', 'all'); render(); };
  $('#export').onclick = () => O.exportCSV(O.apps().filter(visible));
  O.on('orbit:search', (d) => { q = d.q || ''; render(); });
  O.on('orbit:change', render);
  render();
})();
