/* Folio · Reader: original placeholder text per page, tap-to-highlight paragraphs (saved per book + page), Aa sheet (size, line height, theme),
   prev / next (buttons, ← → keys, swipe) that update your page, today's minutes (1 min per page) and the streak. URL: reader.html?id=long-noon */
(function () {
  const F = window.Folio; const $ = (s) => document.querySelector(s);
  const id = new URLSearchParams(location.search).get('id') || F.state.current;
  const b = F.book(id) || F.book(F.state.current);
  const PER = 4; // paragraphs per page
  function pageText(pg) { const pr = F.D.prose; const seed = (pg * 7 + b.pages) % pr.length; return Array.from({ length: PER }, (_, i) => pr[(seed + i * 3) % pr.length]); }
  function render() {
    const l = F.lib(b.id); const pg = Math.max(1, l.page || 1); const r = F.state.reader; const hl = (l.hl || {})[pg] || [];
    $('#btitle').textContent = b.title; $('#chap').textContent = `Chapter ${Math.max(1, Math.ceil(pg / 20))}`;
    const t = $('#text'); t.style.fontSize = r.size + 'px'; t.style.lineHeight = r.leading;
    t.innerHTML = pageText(pg).map((p, i) => `<p data-i="${i}" tabindex="0">${hl.includes(i) ? `<mark>${p}</mark>` : p}</p>`).join('');
    $('#bar').style.width = F.pct(b.id) + '%';
    $('#pos').textContent = l.page >= b.pages ? `Finished · ${b.pages} pages` : `p. ${pg} / ${b.pages} · ${F.minsLeft(b.id)} min left`;
    $('#prev').disabled = pg <= 1; $('#prev').style.opacity = pg <= 1 ? .4 : 1;
  }
  function turn(d) {
    const l = F.lib(b.id); const pg = Math.max(1, l.page || 1); const n = Math.max(1, Math.min(b.pages, pg + d)); if (n === pg) return;
    const wasDone = l.status === 'done'; F.setPage(b.id, n); if (d > 0) F.logMinutes(1, 1);
    if (!wasDone && F.lib(b.id).status === 'done') F.toast(`Finished ${b.title}! 🎉`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function settings() {
    $('#aa').setAttribute('aria-expanded', 'true');
    const close = F.sheet(`<h2 class="h-title text-[22px]">Text</h2>
      <div class="flex items-center justify-between mt-5"><span class="font-semibold">Size</span><div class="stepper" data-min="14" data-max="26" data-step="1" data-val="${F.state.reader.size}"><button type="button" data-dec aria-label="Smaller text">A−</button><output class="num"></output><button type="button" data-inc aria-label="Bigger text">A+</button></div></div>
      <div class="flex items-center justify-between mt-4"><span class="font-semibold">Line height</span><div class="seg" id="lh">${[1.5, 1.7, 1.9].map((v) => `<button type="button" data-lh="${v}" aria-pressed="${F.state.reader.leading === v}">${{ 1.5: 'Tight', 1.7: 'Comfy', 1.9: 'Airy' }[v]}</button>`).join('')}</div></div>
      <div class="flex items-center justify-between mt-4"><span class="font-semibold">Theme</span><div class="seg" id="th"><button type="button" data-t="light" aria-pressed="${!document.documentElement.classList.contains('dark')}">Light</button><button type="button" data-t="dark" aria-pressed="${document.documentElement.classList.contains('dark')}">Dark</button></div></div>
      <button type="button" class="pill pill-ink w-full mt-7" data-done>Done</button>`, (el, close) => {
      F.stepper(el); const st = el.querySelector('.stepper');
      st.addEventListener('click', () => { F.state.reader.size = +st.dataset.val; F.save(); });
      el.querySelector('#lh').addEventListener('click', (e) => { const x = e.target.closest('[data-lh]'); if (!x) return; F.state.reader.leading = +x.dataset.lh; F.save(); el.querySelectorAll('[data-lh]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
      el.querySelector('#th').addEventListener('click', (e) => { const x = e.target.closest('[data-t]'); if (!x) return; F.setTheme(x.dataset.t); el.querySelectorAll('[data-t]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
      el.querySelector('[data-done]').onclick = () => close();
    });
    setTimeout(() => $('#aa').setAttribute('aria-expanded', 'false'), 300);
    return close;
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('#back').innerHTML = F.icon('back', ''); $('#back').href = `book.html?id=${b.id}`; $('#aa').innerHTML = F.icon('text', '');
    $('#prev').innerHTML = F.icon('back', ''); $('#next').innerHTML = F.icon('chev', '');
    if (F.state.current !== b.id && F.lib(b.id).status === 'reading') { F.state.current = b.id; F.save(); }
    render();
    $('#prev').onclick = () => turn(-1); $('#next').onclick = () => turn(1); $('#aa').onclick = settings;
    const toggle = (p) => { const l = F.lib(b.id); const pg = Math.max(1, l.page || 1); l.hl = l.hl || {}; const a = l.hl[pg] || []; const i = +p.dataset.i;
      l.hl[pg] = a.includes(i) ? a.filter((x) => x !== i) : [...a, i]; F.save(); F.toast(a.includes(i) ? 'Highlight removed' : 'Highlighted'); };
    $('#text').addEventListener('click', (e) => { const p = e.target.closest('p[data-i]'); if (p) toggle(p); });
    $('#text').addEventListener('keydown', (e) => { const p = e.target.closest('p[data-i]'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(p); } });
    document.addEventListener('keydown', (e) => { if (document.querySelector('.sheet')) return; if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); });
    let x0 = null; document.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 60) turn(dx < 0 ? 1 : -1); x0 = null; });
  });
  document.addEventListener('folio:change', render);
})();
