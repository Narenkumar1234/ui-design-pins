/* Folio · Profile / stats: identity, 2x2 stat tiles (longest streak in orange), yearly goal, shelf row, favourite genre chips, books-per-month bars, settings. */
(function () {
  const F = window.Folio; const $ = (s) => document.querySelector(s);
  const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const fmt = (n) => n.toLocaleString('en-IN');
  function render() {
    const u = F.D.user, st = F.stats(), s = F.state;
    $('#initials').textContent = u.name.split(' ').map((w) => w[0]).join(''); $('#badge').innerHTML = F.icon('flame', 'ico !w-3.5 !h-3.5');
    $('#uname').textContent = u.name; $('#handle').textContent = u.handle;
    $('#fwing').textContent = `Following ${u.following}`; $('#fwers').textContent = `Followers ${u.followers}`;
    const tile = (k, v, unit, ic, hot) => `<div class="rounded-tile p-4 ${hot ? 'bg-accent text-[#141414]' : 'tile'}"><div class="flex items-center justify-between"><span class="text-[13px] font-semibold ${hot ? '' : 'text-muted'}">${k}</span>${F.icon(ic, `ico !w-[18px] !h-[18px] ${hot ? '' : 'text-muted'}`)}</div>
      <p class="mt-3"><b class="text-[32px] font-extrabold num leading-none">${v}</b> <span class="text-[13px] font-semibold ${hot ? '' : 'text-muted'}">${unit}</span></p></div>`;
    $('#tiles').innerHTML = tile('Books read', st.booksRead, 'books', 'read') + tile('Pages', fmt(st.pages), 'pages', 'page') + tile('Hours', st.hours, 'hrs', 'clock') + tile('Longest streak', st.longest, 'days', 'flame', true);
    const g = u.yearGoal; $('#yg-t').textContent = `${Math.min(st.booksRead, g)} / ${g}`; $('#yg').style.width = Math.min(100, (st.booksRead / g) * 100) + '%';
    $('#yg-s').textContent = st.booksRead >= g ? 'Goal reached. Time for a bigger one?' : `${g - st.booksRead} books to go · on track`;
    const shelf = F.D.books.filter((b) => F.lib(b.id).shelf);
    $('#shelf-n').textContent = shelf.length;
    $('#shelf').innerHTML = shelf.map((b) => `<a href="book.html?id=${b.id}" class="w-[96px] flex-none">${F.cover(b.id)}<p class="font-bold text-[13px] mt-2 truncate">${F.esc(b.title)}</p></a>`).join('') || '<p class="text-muted text-[14px]">Your shelf is empty.</p>';
    $('#genres').innerHTML = F.D.genres.map((gn) => `<button type="button" class="chip" aria-pressed="${s.favGenres.includes(gn)}" data-g="${gn}">${gn}</button>`).join('');
    const max = Math.max(...st.perMonth, 1);
    $('#months').innerHTML = st.perMonth.map((n, i) => `<i class="${i === st.monthNow ? 'hi' : ''}" style="height:${Math.max(6, (n / max) * 100)}%;${i > st.monthNow ? 'opacity:.45' : ''}" title="${n} books"></i>`).join('');
    $('#months-l').innerHTML = M.map((m, i) => `<span class="${i === st.monthNow ? 'text-accent' : ''}">${m}</span>`).join('');
    document.querySelectorAll('#theme-seg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === F.theme()));
    const gEl = $('#goal'); gEl.dataset.val = s.dailyGoal; gEl.querySelector('output').textContent = s.dailyGoal;
  }
  document.addEventListener('DOMContentLoaded', () => {
    render();
    $('#genres').addEventListener('click', (e) => { const c = e.target.closest('[data-g]'); if (!c) return; const f = F.state.favGenres, g = c.dataset.g;
      F.state.favGenres = f.includes(g) ? f.filter((x) => x !== g) : [...f, g]; F.save(); });
    $('#theme-seg').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) { F.setTheme(b.dataset.t); render(); } });
    F.stepper(document.querySelector('#goal').parentElement);
    $('#goal').addEventListener('click', () => { const v = +$('#goal').dataset.val; if (v !== F.state.dailyGoal) { F.state.dailyGoal = v; F.save(); } });
    let armed = false;
    $('#reset').onclick = (e) => { if (!armed) { armed = true; e.target.textContent = 'Tap again to reset'; setTimeout(() => { armed = false; e.target.textContent = 'Reset demo data'; }, 2500); return; }
      F.reset(); F.toast('Demo data restored'); e.target.textContent = 'Reset demo data'; armed = false; };
  });
  document.addEventListener('folio:change', render);
})();
