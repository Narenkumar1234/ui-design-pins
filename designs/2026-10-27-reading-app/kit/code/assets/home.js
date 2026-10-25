/* Folio · Home: greeting, streak card (last 7 days), current book with progress + Continue, daily goal ring, also reading, up next. */
(function () {
  const F = window.Folio; const $ = (s) => document.querySelector(s);
  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  function render() {
    const s = F.state, u = F.D.user;
    $('#greet').textContent = F.greeting() + ',';
    $('#name').textContent = u.first; $('#avatar').textContent = u.first[0];
    // streak + last 7 days bars (today in orange)
    const n = F.streak(); $('#streak-n').textContent = n; $('#flame').innerHTML = F.icon('flame');
    $('#streak-sub').textContent = F.today() > 0 ? `${F.today()} min today · streak safe` : 'Read today to keep it going';
    $('#best').textContent = `Best ${F.stats().longest}`;
    const w = F.last7(); const max = Math.max(...w.map((d) => d.min), F.state.dailyGoal);
    $('#week').innerHTML = w.map((d) => `<i class="${d.today ? 'hi' : ''}" style="height:${Math.max(10, (d.min / max) * 100)}%;${d.today ? '' : `background:rgb(var(--onhero) / ${d.min ? .3 : .12})`}" title="${d.min} min"></i>`).join('');
    $('#week-l').innerHTML = w.map((d) => `<span class="${d.today ? 'text-accent' : 'opacity-60'}">${DAYS[d.d.getDay()]}</span>`).join('');
    // current book
    const reading = F.byStatus('reading');
    if (!reading.find((b) => b.id === s.current)) s.current = (reading[0] || F.D.books[0]).id;
    const b = F.book(s.current), l = F.lib(b.id), p = F.pct(b.id);
    $('#cr-count').textContent = `${reading.length} book${reading.length === 1 ? '' : 's'}`;
    $('#current').innerHTML = `<a href="book.html?id=${b.id}" class="w-[104px] flex-none" aria-label="Open ${F.esc(b.title)}">${F.cover(b.id)}</a>
      <div class="min-w-0 flex-1 flex flex-col">
        <span class="chip h-7 px-3 text-[12px] self-start">${b.genre}</span>
        <a href="book.html?id=${b.id}" class="h-title text-[21px] mt-2 truncate">${F.esc(b.title)}</a>
        <p class="text-muted text-[14px]">${F.esc(b.author)}</p>
        <div class="mt-auto pt-3"><div class="flex justify-between text-[13px] font-semibold num"><span>Page ${l.page} of ${b.pages}</span><span class="text-accent">${p}%</span></div>
          <div class="track mt-1.5"><i style="width:${p}%"></i></div>
          <a href="reader.html?id=${b.id}" class="pill pill-ink pill-sm w-full mt-3">Continue ${F.icon('arrow', 'ico !w-4 !h-4')}</a></div>
      </div>`;
    // goal ring
    const g = s.dailyGoal, t = F.today(), gp = Math.min(100, Math.round((t / g) * 100));
    $('#ring').style.strokeDashoffset = 97.4 * (1 - gp / 100); $('#ring-pct').textContent = gp + '%';
    $('#goal-txt').textContent = t >= g ? `${t} / ${g} min · goal reached` : `${t} / ${g} min · ${g - t} min to go`;
    // also reading (other books in progress): tap to make current
    const others = reading.filter((x) => x.id !== b.id);
    $('#others').innerHTML = others.length ? others.map((x) => `<div class="tile p-3 flex items-center gap-3">
        <div class="w-[42px]">${F.cover(x.id)}</div>
        <div class="min-w-0 flex-1"><p class="font-bold truncate">${F.esc(x.title)}</p><div class="track mt-2"><i style="width:${F.pct(x.id)}%"></i></div></div>
        <span class="text-[13px] font-semibold text-muted num w-10 text-right">${F.pct(x.id)}%</span>
        <button type="button" class="btn-round !w-9 !h-9" data-cur="${x.id}" aria-label="Make ${F.esc(x.title)} your current book">${F.icon('chev', '')}</button></div>`).join('')
      : '<p class="text-muted text-[14px]">Nothing else in progress. Pick something from Up next.</p>';
    // up next = want to read
    $('#upnext').innerHTML = F.byStatus('want').map((x) => `<a href="book.html?id=${x.id}" class="w-[118px] flex-none">${F.cover(x.id)}
        <p class="font-bold text-[14px] mt-2 truncate">${F.esc(x.title)}</p><p class="text-muted text-[12px] flex items-center gap-1">${F.star(12)} ${x.rating} · ${x.pages} p</p></a>`).join('')
      || '<p class="text-muted text-[14px]">Your want-to-read list is empty.</p>';
  }
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-cur]'); if (c) { F.state.current = c.dataset.cur; F.save(); F.toast('Switched current book'); }
  });
  document.addEventListener('DOMContentLoaded', () => { render(); $('#log-btn').onclick = () => F.logSheet(F.state.current); });
  document.addEventListener('folio:change', render);
})();
