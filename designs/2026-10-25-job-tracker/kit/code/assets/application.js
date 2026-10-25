/* Orbit UI Kit · application.js — application detail (?id=northwind).
   Header with stage pill, "Move to <next stage>" + status menu, edit / delete; timeline with add-event form; next-step countdown
   with .ics download; notes with autosave; contacts (add / remove, mailto); salary & details. */
(function () {
  const O = window.Orbit; const { $, $$, esc, icon } = O;
  O.init('application');
  const id = new URLSearchParams(location.search).get('id') || 'northwind';
  const NEXT = { wishlist: 'applied', applied: 'interview', interview: 'offer' };
  let saveT;
  function render() {
    const a = O.get(id);
    if (!a) { $('#detail').innerHTML = `<div class="card p-10 text-center max-w-xl mx-auto mt-10" id="notfound"><p class="font-display text-[24px] font-bold">Application not found</p><p class="text-muted mt-1">It may have been deleted.</p><a href="board.html" class="btn btn-primary mt-5">Back to board</a></div>`; return; }
    document.title = `Orbit · ${a.company}`;
    const t = O.now(); const up = a.interview && a.interview.at && O.parse(a.interview.at) >= O.startOfDay(t);
    const next = NEXT[a.status];
    const tl = [...a.timeline].sort((x, y) => (x.date > y.date ? 1 : -1));
    $('#detail').innerHTML = `
      <a href="board.html" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink mb-3">${icon('arrowL', 'sm')}Board</a>
      <section class="card p-5 sm:p-6 flex flex-wrap items-center gap-4">
        ${O.mono(a, 'lg')}
        <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h1 id="d-role" class="font-display text-[26px] sm:text-[30px] font-bold tracking-tight leading-tight">${esc(a.role)}</h1><span id="d-status">${O.pill(a.status)}</span></div>
          <p class="text-muted mt-1 text-[14.5px]"><b class="text-ink font-semibold">${esc(a.company)}</b> · ${esc(a.location || '—')} · ${esc(a.mode)} · ${esc(a.type)}</p></div>
        <div class="flex flex-wrap gap-2 w-full sm:w-auto">
          <div class="relative"><button type="button" class="btn btn-ghost" id="st-btn" aria-haspopup="menu">${icon('flag', 'sm')}Status ${icon('chevD', 'sm')}</button></div>
          <button type="button" class="btn btn-ghost" id="edit">${icon('edit', 'sm')}Edit</button>
          ${next ? `<button type="button" class="btn btn-primary" id="advance">Move to ${O.ST[next]} ${icon('arrowR', 'sm')}</button>` : ''}
        </div>
      </section>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <section class="card p-5 lg:col-span-7 lg:row-span-2 min-w-0" aria-labelledby="tl-h">
          <h2 id="tl-h" class="font-display text-[18px] font-bold">Timeline</h2>
          <ol id="timeline" class="tl mt-4 flex flex-col gap-4">${tl.map((e) => `<li class="done"><span class="nd"></span><p class="text-[14.5px] font-medium">${esc(e.label)}</p><p class="text-[12.5px] text-muted">${O.fmtDay(e.date)}</p></li>`).join('')}
            ${up ? `<li class="next"><span class="nd"></span><p class="text-[14.5px] font-semibold">${esc(a.interview.kind)} <span class="tag tag-lime ml-1">upcoming</span></p><p class="text-[12.5px] text-muted">${O.fmtDay(a.interview.at)} · ${O.fmtTime(a.interview.at)} · ${esc(a.interview.where || '')}</p></li>` : ''}</ol>
          <form id="ev-form" class="flex flex-wrap gap-2 mt-5 pt-4 border-t border-line" novalidate>
            <label class="sr-only" for="ev-label">New event</label><input id="ev-label" class="input flex-1 min-w-[160px]" placeholder="Add an event, e.g. Sent thank-you email">
            <label class="sr-only" for="ev-date">Date</label><input id="ev-date" type="date" class="input !w-[160px]" value="${O.iso(t)}">
            <button type="submit" class="btn btn-primary">${icon('plus', 'sm')}Add</button></form>
        </section>
        <section class="card ${up ? 'card-lime' : ''} p-5 lg:col-span-5 min-w-0" id="nextstep" aria-labelledby="ns-h">
          <p id="ns-h" class="eyebrow ${up ? '!text-[#14181A]/70' : ''}">Next step</p>
          ${up ? `<p class="font-display text-[46px] font-bold leading-none mt-3 num">${O.daysBetween(t, O.parse(a.interview.at))}<span class="text-[18px] font-semibold"> days to interview</span></p>
            <p class="mt-2 text-[14px]"><b>${esc(a.interview.kind)}</b> · ${O.fmtDay(a.interview.at)}, ${O.fmtTime(a.interview.at)} · ${esc(a.interview.where || '')}</p>
            <div class="flex flex-wrap gap-2 mt-4"><button type="button" class="btn !bg-[#14181A] !text-[#C6F35E]" id="ics">${icon('cal', 'sm')}Add to calendar</button><a href="interviews.html" class="btn !bg-white/60 !text-[#14181A]">All interviews</a></div>`
          : `<p class="font-display text-[22px] font-bold mt-2">${a.status === 'offer' ? 'Review your offer' : a.status === 'rejected' ? 'Ask for feedback' : a.status === 'wishlist' ? 'Apply this week' : 'Follow up in 7 days'}</p>
            <p class="text-[13.5px] text-muted mt-1">${a.status === 'offer' ? 'Compare pay, learning and team before you reply.' : a.status === 'rejected' ? 'A short, polite email often gets useful notes.' : a.status === 'wishlist' ? 'Tailor your resume to the job description first.' : 'No reply yet? A short follow-up to the recruiter helps.'}</p>
            <button type="button" class="btn btn-ghost mt-4" id="sched">${icon('cal', 'sm')}Schedule interview</button>`}
        </section>
        <section class="card p-5 lg:col-span-5 min-w-0" aria-labelledby="sal-h">
          <h2 id="sal-h" class="font-display text-[18px] font-bold">Salary &amp; details</h2>
          <p id="d-salary" class="num font-display text-[30px] font-bold mt-2">${esc(O.fmtSalaryLong(a))}</p>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-[13.5px]">
            <div><dt class="text-muted text-[12px]">Location</dt><dd class="font-medium">${esc(a.location || '—')} · ${esc(a.mode)}</dd></div>
            <div><dt class="text-muted text-[12px]">Source</dt><dd class="font-medium">${esc(a.source || '—')}</dd></div>
            <div><dt class="text-muted text-[12px]">Applied</dt><dd class="font-medium">${a.applied ? O.fmtDay(a.applied) : 'Not yet'}</dd></div>
            <div><dt class="text-muted text-[12px]">Last update</dt><dd class="font-medium">${O.fmtDay(a.updated)}</dd></div>
            <div class="col-span-2 min-w-0"><dt class="text-muted text-[12px]">Job link</dt><dd class="font-medium truncate">${a.link ? `<a class="underline" href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.link.replace(/^https?:\/\//, ''))}</a>` : '—'}</dd></div>
          </dl>
        </section>
        <section class="card p-5 lg:col-span-7 min-w-0" aria-labelledby="nt-h">
          <div class="flex items-center"><h2 id="nt-h" class="font-display text-[18px] font-bold flex-1">Notes</h2><span id="saved" class="text-[12px] text-muted" aria-live="polite"></span></div>
          <label class="sr-only" for="notes">Notes</label><textarea id="notes" class="textarea mt-3 !min-h-[150px]" placeholder="Prep notes, questions to ask, follow-ups…">${esc(a.notes)}</textarea>
        </section>
        <section class="card p-5 lg:col-span-5 min-w-0" aria-labelledby="ct-h">
          <h2 id="ct-h" class="font-display text-[18px] font-bold">Contacts</h2>
          <ul id="contacts" class="mt-3 flex flex-col gap-2">${a.contacts.length ? a.contacts.map((c, i) => `<li class="flex items-center gap-3 p-2 -mx-1 rounded-2xl" data-ci="${i}"><span class="w-10 h-10 rounded-full grid place-items-center font-display font-bold text-[14px] flex-none" style="background:rgb(var(--soft))">${esc(O.initials(c.name))}</span><span class="min-w-0 flex-1"><b class="block truncate font-semibold text-[14px]">${esc(c.name)}</b><span class="block truncate text-[12.5px] text-muted">${esc(c.role || '')}</span></span>${c.email ? `<a class="btn-icon !w-9 !h-9" href="mailto:${esc(c.email)}" aria-label="Email ${esc(c.name)}">${icon('mail', 'sm')}</a>` : ''}<button type="button" class="btn-icon !w-9 !h-9" data-rm="${i}" aria-label="Remove ${esc(c.name)}">${icon('x', 'sm')}</button></li>`).join('') : '<li class="text-[13.5px] text-muted">No contacts yet. Add your recruiter or referrer.</li>'}</ul>
          <form id="ct-form" class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-line" novalidate>
            <input id="ct-name" class="input" placeholder="Name" aria-label="Contact name"><input id="ct-role" class="input" placeholder="Role" aria-label="Contact role">
            <input id="ct-email" type="email" class="input col-span-2 sm:col-span-1" placeholder="Email" aria-label="Contact email"><button type="submit" class="btn btn-ghost col-span-2 sm:col-span-1">${icon('plus', 'sm')}Add contact</button></form>
        </section>
      </div>`;
    wire(a);
  }
  function wire(a) {
    $('#edit').onclick = () => O.openModal(a);
    const adv = $('#advance'); if (adv) adv.onclick = () => { const to = NEXT[a.status]; O.move(a.id, to); O.toast(`Moved to ${O.ST[to]}`); };
    const ic = $('#ics'); if (ic) ic.onclick = () => O.downloadICS(a);
    const sc = $('#sched'); if (sc) sc.onclick = () => (location.href = `interviews.html?app=${a.id}`);
    $('#st-btn').onclick = (e) => {
      e.stopPropagation(); $('#st-menu')?.remove(); const m = document.createElement('div'); m.className = 'menu'; m.id = 'st-menu'; m.setAttribute('role', 'menu'); m.style.left = '0'; m.style.top = '48px';
      m.innerHTML = O.STATUSES.map((s) => `<button type="button" role="menuitem" data-to="${s.id}" data-st="${s.id}"${s.id === a.status ? ' aria-selected="true"' : ''}><span class="st-dot"></span>${s.label}</button>`).join('') + `<div class="sep"></div><button type="button" role="menuitem" data-del class="!text-[rgb(var(--coral))]">${icon('trash', 'sm')}Delete application</button>`;
      $('#st-btn').parentElement.appendChild(m); m.querySelector('button').focus();
      m.onclick = (ev) => { const b = ev.target.closest('button'); if (!b) return; m.remove();
        if (b.dataset.to && b.dataset.to !== a.status) { O.move(a.id, b.dataset.to); O.toast(`Moved to ${O.ST[b.dataset.to]}`); }
        if (b.hasAttribute('data-del')) { const r = O.remove(a.id); O.toast(`Deleted ${a.company}`, () => O.restore(r)); } };
      m.onkeydown = (ev) => { if (ev.key === 'Escape') { m.remove(); $('#st-btn').focus(); } };
    };
    $('#ev-form').onsubmit = (e) => { e.preventDefault(); const l = $('#ev-label').value.trim(); if (!l) { $('#ev-label').focus(); return; } a.timeline.push({ date: $('#ev-date').value || O.iso(O.now()), label: l }); a.updated = O.iso(O.now()); O.persist('event', a.id); O.toast('Event added'); };
    $('#notes').oninput = (e) => { clearTimeout(saveT); $('#saved').textContent = 'Saving…'; saveT = setTimeout(() => { a.notes = e.target.value; O.ls.set('apps', O.apps()); $('#saved').textContent = 'Saved'; }, 400); };
    $('#ct-form').onsubmit = (e) => { e.preventDefault(); const n = $('#ct-name').value.trim(); if (!n) { $('#ct-name').focus(); return; } a.contacts.push({ name: n, role: $('#ct-role').value.trim(), email: $('#ct-email').value.trim() }); O.persist('contact', a.id); O.toast('Contact added'); };
    $$('[data-rm]').forEach((b) => (b.onclick = () => { a.contacts.splice(+b.dataset.rm, 1); O.persist('contact', a.id); }));
  }
  document.addEventListener('click', (e) => { const m = $('#st-menu'); if (m && !m.contains(e.target)) m.remove(); });
  O.on('orbit:change', render);
  render();
})();
