/* Folio · Library: search, status tabs (All / Reading / Want / Finished / On shelf), genre chips, cover grid with progress.
   URL params: ?tab=reading&genre=Sci-fi&q=salt (kept in sync while you filter). */
(function () {
  const F = window.Folio; const $ = (s) => document.querySelector(s);
  const TABS = [['all', 'All'], ['reading', 'Reading'], ['want', 'Want'], ['done', 'Finished'], ['shelf', 'On shelf']];
  const P = new URLSearchParams(location.search);
  let tab = TABS.some((t) => t[0] === P.get('tab')) ? P.get('tab') : 'all', genre = P.get('genre') || 'All', q = P.get('q') || '';
  const match = (b, t) => { const l = F.lib(b.id); return t === 'all' || (t === 'shelf' ? l.shelf : l.status === t); };
  function render() {
    $('#tabs').innerHTML = TABS.map(([k, n]) => `<button type="button" role="tab" class="chip" aria-selected="${k === tab}" aria-pressed="${k === tab}" data-tab="${k}">${n} <span class="ct">${F.D.books.filter((b) => match(b, k)).length}</span></button>`).join('');
    $('#genres').innerHTML = ['All', ...F.D.genres].map((g) => `<button type="button" class="chip !h-8 !text-[13px] ${g === genre ? '' : '!bg-transparent border !border-line'}" aria-pressed="${g === genre}" data-genre="${g}" style="${g === genre ? 'background:rgb(var(--accent));color:#141414' : ''}">${g}</button>`).join('');
    const ql = q.trim().toLowerCase();
    const list = F.D.books.filter((b) => match(b, tab) && (genre === 'All' || b.genre === genre) && (!ql || (b.title + ' ' + b.author).toLowerCase().includes(ql)));
    $('#count').textContent = `${list.length} book${list.length === 1 ? '' : 's'}`;
    $('#grid').innerHTML = list.map((b) => { const l = F.lib(b.id); const p = F.pct(b.id);
      return `<a href="book.html?id=${b.id}" class="min-w-0">${F.cover(b.id)}<p class="font-bold text-[13px] mt-2 truncate">${F.esc(b.title)}</p>
        ${l.status === 'reading' ? `<div class="track mt-1.5 !h-1"><i style="width:${p}%"></i></div><p class="text-[11px] text-muted mt-1 num">${p}%</p>`
          : l.status === 'done' ? `<p class="text-[12px] text-muted flex items-center gap-1">${F.star(11)} ${l.mine || b.rating}</p>` : `<p class="text-[12px] text-muted truncate">${F.esc(b.author)}</p>`}</a>`; }).join('')
      || `<div class="col-span-3 md:col-span-6 card p-6 text-center"><p class="font-extrabold">No books here</p><p class="text-muted text-[14px] mt-1">Try another filter or clear the search.</p><button type="button" class="pill pill-ink pill-sm mt-4" id="clear">Clear filters</button></div>`;
    const c = $('#clear'); if (c) c.onclick = () => { tab = 'all'; genre = 'All'; q = ''; $('#q').value = ''; sync(); };
  }
  function sync() { const u = new URLSearchParams(); if (tab !== 'all') u.set('tab', tab); if (genre !== 'All') u.set('genre', genre); if (q) u.set('q', q);
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : '')); render(); }
  document.addEventListener('DOMContentLoaded', () => {
    $('#s-ico').innerHTML = F.icon('search'); $('#q').value = q; render();
    $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; sync(); } });
    $('#genres').addEventListener('click', (e) => { const b = e.target.closest('[data-genre]'); if (b) { genre = b.dataset.genre; sync(); } });
    $('#q').addEventListener('input', (e) => { q = e.target.value; sync(); });
  });
  document.addEventListener('folio:change', render);
})();
