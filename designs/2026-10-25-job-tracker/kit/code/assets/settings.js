/* Orbit UI Kit · settings.js — profile name + avatar, weekly goal stepper, theme (Light / Dark / System), currency with preview,
   reminders, data tools (export / import CSV, reset demo, clear all with confirm). */
(function () {
  const O = window.Orbit; const { $, $$ } = O;
  O.init('settings');
  const upd = (patch) => { const s = { ...O.settings(), ...patch }; O.saveSettings(s); };
  function render() {
    const s = O.settings();
    if (document.activeElement !== $('#s-name')) $('#s-name').value = s.name;
    $('#pf-av').textContent = O.initials(s.name);
    if (document.activeElement !== $('#s-goal')) $('#s-goal').value = s.goal;
    const th = O.ls.get('theme', 'light');
    $$('#theme-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === th)));
    $$('#cur-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === s.currency)));
    $('#cur-prev').textContent = `${O.fmtSalary({ salary: 45000, per: 'mo' })} · ${O.fmtSalary({ salary: 1400000, per: 'yr' })}`;
    $('#s-rem').setAttribute('aria-checked', String(!!s.reminders)); $('#s-hours').value = String(s.reminderHours); $('#s-hours').disabled = !s.reminders;
    $('#data-count').textContent = `${O.apps().length} applications`;
  }
  $('#s-name').oninput = (e) => upd({ name: e.target.value.trim() || 'Student' });
  const setGoal = (n) => { n = Math.max(1, Math.min(30, Math.round(+n || 1))); $('#s-goal').value = n; upd({ goal: n }); };
  $('#s-goal').onchange = (e) => setGoal(e.target.value);
  $('#goal-dec').onclick = () => setGoal(O.settings().goal - 1);
  $('#goal-inc').onclick = () => setGoal(O.settings().goal + 1);
  $$('#theme-seg button').forEach((b) => (b.onclick = () => { O.setTheme(b.dataset.t); render(); }));
  $$('#cur-seg button').forEach((b) => (b.onclick = () => upd({ currency: b.dataset.c })));
  $('#s-rem').onclick = () => upd({ reminders: !O.settings().reminders });
  $('#s-hours').onchange = (e) => upd({ reminderHours: +e.target.value });
  $('#export').onclick = () => O.exportCSV();
  $('#reset').onclick = () => { O.resetDemo(); O.toast('Demo data restored'); };
  const clr = $('#clear');
  clr.onclick = () => { if (!clr.dataset.confirm) { clr.dataset.confirm = '1'; clr.textContent = 'Click again to clear'; setTimeout(() => { delete clr.dataset.confirm; clr.textContent = 'Clear all'; }, 4000); return; } delete clr.dataset.confirm; clr.textContent = 'Clear all'; O.clearAll(); O.toast('All applications cleared'); };
  // CSV import: same columns as the export (header row required). Quoted fields with commas / newlines are supported.
  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false; text = text.replace(/^\ufeff/, '');
    for (let i = 0; i < text.length; i++) { const c = text[i];
      if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += c; }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim()));
  }
  $('#import').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return; const rows = parseCSV(await f.text()); const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
    const byLabel = Object.fromEntries(O.STATUSES.map((s) => [s.label.toLowerCase(), s.id])); let n = 0;
    rows.forEach((r) => { const o = Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])); if (!o.company || !o.role) return;
      O.upsert({ company: o.company, role: o.role, status: byLabel[(o.status || '').toLowerCase()] || (O.ST[o.status] ? o.status : 'applied'), type: o.type || 'Internship', mode: o.mode || 'Remote', location: o.location || '', salary: +o.salary || '', per: o.per === 'yr' ? 'yr' : 'mo', applied: o.applied || '', source: o.source || 'Other', link: o.link || '', notes: o.notes || '', interview: o.interview ? { at: o.interview, kind: 'Interview', where: '' } : null }); n++; });
    e.target.value = ''; O.toast(`Imported ${n} applications`);
  };
  O.on('orbit:change', render); O.on('orbit:theme', render);
  render();
})();
