/* Orbit UI Kit · interviews.js — month calendar (Mon-start, prev / next / today, arrow-key day selection), day agenda,
   all upcoming interviews with .ics download, and a schedule form (moves Wishlist / Applied cards to Interview). */
(function () {
  const O = window.Orbit; const { $, $$, esc, icon } = O;
  O.init('interviews');
  const qs = new URLSearchParams(location.search);
  const t0 = O.now();
  let sel = O.startOfDay(t0); let view = new Date(t0.getFullYear(), t0.getMonth(), 1);
  if (qs.get('date')) { const d = O.parse(qs.get('date')); if (d) { sel = d; view = new Date(d.getFullYear(), d.getMonth(), 1); } }
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const withInt = () => O.apps().filter((a) => a.interview && a.interview.at);
  const onDay = (d) => withInt().filter((a) => O.iso(O.parse(a.interview.at)) === O.iso(d)).sort((x, y) => x.interview.at.localeCompare(y.interview.at));
  const item = (a, ics) => { const d = O.parse(a.interview.at); const past = d < O.startOfDay(t0);
    return `<li class="flex items-center gap-3 p-3 min-w-0 rounded-2xl border border-line ${past ? 'opacity-60' : ''}" data-int="${a.id}">${O.mono(a, 'sm')}
      <a href="application.html?id=${a.id}" class="min-w-0 flex-1"><b class="block truncate text-[14px] font-semibold">${esc(a.company)} · ${esc(a.interview.kind)}</b><span class="block truncate text-[12.5px] text-muted">${O.fmtDay(d)}, ${O.fmtTime(d)} · ${esc(a.role)}</span></a>
      ${ics && !past ? `<button type="button" class="btn-icon !w-9 !h-9" data-ics="${a.id}" aria-label="Download calendar invite for ${esc(a.company)}">${icon('down', 'sm')}</button>` : `<span class="tag flex-none">${past ? 'done' : O.until(d)}</span>`}</li>`; };
  function render() {
    $('#prev').innerHTML = icon('chevL'); $('#next').innerHTML = icon('chevR');
    $('#month').textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const start = O.startOfWeek(view); const endM = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    const cells = Math.ceil((O.daysBetween(start, endM) + 1) / 7) * 7;
    $('#cal').innerHTML = Array.from({ length: cells }, (_, i) => { const d = O.addDays(start, i); const ev = onDay(d); const isSel = O.iso(d) === O.iso(sel);
      return `<button type="button" role="gridcell" class="d${d.getMonth() !== view.getMonth() ? ' out' : ''}${O.iso(d) === O.iso(t0) ? ' today' : ''}" data-date="${O.iso(d)}" aria-selected="${isSel}" tabindex="${isSel ? 0 : -1}" aria-label="${O.fmtDay(d)}${ev.length ? ', ' + ev.length + ' interview' + (ev.length > 1 ? 's' : '') : ''}">
        <span class="n">${d.getDate()}</span>${ev.map((a) => `<span class="ev${O.parse(a.interview.at) < O.startOfDay(t0) ? ' past' : ''}">${O.fmtTime(a.interview.at)} ${esc(a.company)}</span>`).join('')}</button>`; }).join('');
    $('#day-h').textContent = O.iso(sel) === O.iso(t0) ? `Today · ${O.fmtDay(sel)}` : O.fmtDay(sel);
    const de = onDay(sel);
    $('#day').innerHTML = de.length ? de.map((a) => item(a, true)).join('') : `<li class="text-[13.5px] text-muted">No interviews on this day.</li>`;
    const up = O.stats().upcoming;
    $('#int-sub').textContent = `${up.length} upcoming · ${withInt().length - up.length} done`;
    $('#ilist').innerHTML = up.length ? up.map((a) => item(a, true)).join('') : `<li class="text-[13.5px] text-muted">Nothing scheduled.</li>`;
    $$('[data-ics]').forEach((b) => (b.onclick = () => O.downloadICS(O.get(b.dataset.ics))));
    $$('#cal .d').forEach((b) => (b.onclick = () => select(O.parse(b.dataset.date), true)));
    const s = $('#s-app'); const cur = s.value || qs.get('app') || '';
    s.innerHTML = O.apps().filter((a) => a.status !== 'rejected').map((a) => `<option value="${a.id}"${a.id === cur ? ' selected' : ''}>${esc(a.company)} · ${esc(a.role)}</option>`).join('');
  }
  function select(d, focus) {
    sel = O.startOfDay(d); if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
    $('#s-at').value = `${O.iso(sel)}T10:00`; render(); if (focus) $(`#cal [data-date="${O.iso(sel)}"]`)?.focus();
  }
  $('#cal').addEventListener('keydown', (e) => { const m = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (m) { e.preventDefault(); select(O.addDays(sel, m), true); } });
  $('#prev').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); };
  $('#next').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); };
  $('#today-btn').onclick = () => select(t0, false);
  $('#sched').onsubmit = (e) => {
    e.preventDefault(); const at = $('#s-at').value; const f = $('#s-at').closest('.field'); f.classList.toggle('invalid', !at); if (!at) { $('#s-at').focus(); return; }
    const a = O.get($('#s-app').value); if (!a) return;
    a.interview = { at, kind: $('#s-kind').value, where: 'Google Meet' }; a.timeline.push({ date: O.iso(O.now()), label: `${$('#s-kind').value} scheduled` });
    if (a.status === 'wishlist' || a.status === 'applied') O.move(a.id, 'interview'); else O.persist('interview', a.id);
    sel = O.startOfDay(O.parse(at)); view = new Date(sel.getFullYear(), sel.getMonth(), 1); render(); O.toast(`Interview with ${a.company} saved`);
  };
  O.on('orbit:change', render);
  $('#s-at').value = `${O.iso(sel)}T10:00`;
  render();
})();
