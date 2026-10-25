/* Folio · Book detail: CSS cover, facts, Add to shelf pill, status, progress (+ log), your rating, about (read more), readers also liked.
   URL: book.html?id=salt-signal */
(function () {
  const F = window.Folio; const $ = (s) => document.querySelector(s);
  const id = new URLSearchParams(location.search).get('id') || 'salt-signal';
  const b = F.book(id) || F.book('salt-signal');
  function render() {
    const l = F.lib(b.id), p = F.pct(b.id);
    document.title = `Folio · ${b.title}`;
    $('#cover').innerHTML = F.cover(b.id); $('#title').textContent = b.title; $('#author').textContent = b.author;
    const fact = (v, k) => `<div class="rounded-full border border-line bg-card h-[58px] flex flex-col items-center justify-center"><b class="text-[15px] font-extrabold flex items-center gap-1 num">${v}</b><span class="text-[11px] text-muted font-semibold uppercase tracking-wider">${k}</span></div>`;
    $('#facts').innerHTML = fact(`${b.rating}${F.star(13)}`, 'Rating') + fact(b.pages, 'Pages') + fact(b.genre, 'Genre') + fact(`${b.hours}h`, 'Read');
    const sb = $('#shelf-btn'); sb.classList.toggle('on', !!l.shelf); sb.setAttribute('aria-pressed', !!l.shelf);
    sb.innerHTML = l.shelf ? `${F.icon('check')} On your shelf` : `${F.icon('plus')} Add to shelf`;
    const bm = $('#bm'); bm.setAttribute('aria-pressed', l.status === 'want'); bm.innerHTML = F.icon('bookmark', '');
    bm.style.color = l.status === 'want' ? 'rgb(var(--accent))' : ''; bm.querySelector('svg').style.fill = l.status === 'want' ? 'currentColor' : 'none';
    bm.setAttribute('aria-label', l.status === 'want' ? 'Remove from want to read' : 'Save to want to read');
    const label = { reading: 'Reading', want: 'Want to read', done: 'Finished' }[l.status] || 'Not started';
    $('#prog').innerHTML = `<div class="flex items-center justify-between gap-3"><div class="min-w-0"><p class="font-extrabold text-[15px]">${label}</p>
        <p class="text-muted text-[13px] num">${l.page ? `Page ${l.page} of ${b.pages} · ${l.status === 'done' ? 'all done' : F.minsLeft(b.id) + ' min left'}` : `${b.pages} pages · about ${b.hours} h`}</p></div>
        ${l.status === 'done' ? `<span class="text-accent font-extrabold num">100%</span>` : `<button type="button" class="pill pill-line pill-sm" id="log">+ Log</button>`}</div>
      <div class="track mt-3"><i style="width:${p}%"></i></div>`;
    const lg = $('#log'); if (lg) lg.onclick = () => F.logSheet(b.id);
    $('#mine').innerHTML = F.starsHtml(l.mine || 0);
    $('#about').textContent = b.about;
    $('#liked').innerHTML = F.D.books.filter((x) => x.id !== b.id && (x.genre === b.genre || x.rating >= 4.4)).slice(0, 5)
      .map((x) => `<a href="book.html?id=${x.id}" class="w-[104px] flex-none">${F.cover(x.id)}<p class="font-bold text-[13px] mt-2 truncate">${F.esc(x.title)}</p><p class="text-muted text-[12px] flex items-center gap-1">${F.star(11)} ${x.rating}</p></a>`).join('');
    const cta = $('#cta'); cta.href = `reader.html?id=${b.id}`;
    cta.innerHTML = l.status === 'done' ? `Read again ${F.icon('arrow', 'ico')}` : l.page ? `Continue reading · p. ${l.page} ${F.icon('arrow', 'ico')}` : `Start reading ${F.icon('arrow', 'ico')}`;
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('#back').innerHTML = F.icon('back', ''); $('#share').innerHTML = F.icon('share', '');
    if (document.referrer && new URL(document.referrer).origin === location.origin) $('#back').addEventListener('click', (e) => { e.preventDefault(); history.back(); });
    render();
    $('#shelf-btn').onclick = () => { const l = F.lib(b.id); l.shelf = !l.shelf; F.save(); F.toast(l.shelf ? 'Added to your shelf' : 'Removed from your shelf'); };
    $('#bm').onclick = () => { const l = F.lib(b.id); if (l.status === 'want') l.status = null; else if (!l.status) l.status = 'want'; else { F.toast(`Already ${l.status === 'done' ? 'finished' : 'reading'}`); return; } F.save(); F.toast(l.status ? 'Saved to want to read' : 'Removed from want to read'); };
    $('#mine').addEventListener('click', (e) => { const r = e.target.closest('[data-r]'); if (!r) return; F.lib(b.id).mine = +r.dataset.r; F.save(); F.toast(`Rated ${r.dataset.r} / 5`); });
    $('#more').onclick = (e) => { const a = $('#about'); const open = a.classList.toggle('line-clamp-3') === false; e.target.textContent = open ? 'Show less' : 'Read more'; e.target.setAttribute('aria-expanded', open); };
    $('#share').onclick = async () => { const url = location.href; try { if (navigator.share) await navigator.share({ title: b.title, url }); else { await navigator.clipboard.writeText(url); F.toast('Link copied'); } } catch (err) { F.toast('Link: ' + b.id); } };
  });
  document.addEventListener('folio:change', render);
})();
