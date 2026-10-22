/* Natter · profile.js — identity card, edit name/bio (validation), status picker, privacy + preference toggles, wallpaper, storage, reset, log out */
(() => {
  const { D, $, $$, esc, avatar, chats, settings, saveSettings, toast, nav, sheet } = Natter;
  nav('profile');
  function render() {
    const s = settings(), list = chats();
    const initials = s.name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'ME';
    $('#me-av').innerHTML = avatar({ initials, grad: D.me.grad }, 96, { online: false });
    $('#me-name').textContent = s.name; $('#me-bio').textContent = s.bio; $('#status-t').textContent = s.status;
    $('#n-chats').textContent = list.length; $('#n-groups').textContent = list.filter((c) => c.kind === 'group').length;
    $('#n-media').textContent = list.reduce((n, c) => n + c.messages.filter((m) => m.type === 'image' || m.type === 'voice').length, 0);
    $$('[data-set]').forEach((b) => b.setAttribute('aria-checked', String(!!s[b.dataset.set])));
    $$('[data-wall]').forEach((b) => { b.setAttribute('aria-checked', String(b.dataset.wall === s.wallpaper)); b.setAttribute('aria-selected', String(b.dataset.wall === s.wallpaper)); });
    let bytes = 0; for (let k = 0; k < localStorage.length; k++) { const key = localStorage.key(k); if (key.startsWith('natter.')) bytes += key.length + (localStorage.getItem(key) || '').length; }
    $('#storage-kb').textContent = (bytes * 2 / 1024).toFixed(1) + ' KB';
  }
  $$('[data-set]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.set; const v = !settings()[k]; saveSettings({ [k]: v }); render(); toast(`${b.getAttribute('aria-label')} ${v ? 'on' : 'off'}`); }));
  $('#wall').addEventListener('click', (e) => { const b = e.target.closest('[data-wall]'); if (!b) return; saveSettings({ wallpaper: b.dataset.wall }); render(); toast('Wallpaper: ' + b.textContent); });

  const ed = sheet('ed');
  $('#edit').addEventListener('click', () => { const s = settings(); $('#ed-name').value = s.name; $('#ed-bio').value = s.bio; $('#ed-err').textContent = ''; ed.open(); });
  $('#ed-save').addEventListener('click', () => {
    const name = $('#ed-name').value.trim(), bio = $('#ed-bio').value.trim();
    if (name.length < 2) { $('#ed-err').textContent = 'Name needs at least 2 characters.'; return; }
    saveSettings({ name, bio }); ed.close(); render(); toast('Profile saved');
  });
  const st = sheet('st');
  $('#st-list').innerHTML = D.statuses.map((s) => `<button type="button" class="chip !bg-raised" data-status="${esc(s)}">${esc(s)}</button>`).join('');
  $('#status').addEventListener('click', () => { $$('#st-list [data-status]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === settings().status))); st.open(); });
  $('#st-list').addEventListener('click', (e) => { const b = e.target.closest('[data-status]'); if (!b) return; saveSettings({ status: b.dataset.status }); st.close(); render(); toast('Status: ' + b.dataset.status); });

  $('#storage').addEventListener('click', () => toast('Natter keeps everything in localStorage'));
  $('#help').addEventListener('click', () => toast('Help center opens here'));
  $('#reset').addEventListener('click', () => { const t = localStorage.getItem('natter.theme'); Object.keys(localStorage).filter((k) => k.startsWith('natter.')).forEach((k) => localStorage.removeItem(k)); if (t) localStorage.setItem('natter.theme', t); render(); toast('Demo data reset'); });
  $('#logout').addEventListener('click', () => { localStorage.removeItem('natter.onboarded'); location.href = 'welcome.html'; });
  render();
})();
