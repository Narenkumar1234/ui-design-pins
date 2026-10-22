/* Natter · chats.js — chat list: search, filters, stories row + viewer + add story, long-press actions, new chat / new group */
(() => {
  const { D, $, $$, esc, icon, get, set, chats, saveChats, chatInfo, avatar, preview, lastMsg, toast, nav, sheet, now } = Natter;
  nav('chats');
  const q = new URLSearchParams(location.search);
  let filter = q.get('filter') || get('filter', 'all'), term = '';

  /* ---------- list ---------- */
  const order = (list) => list.map((c, i) => [c, i]).sort((a, b) => (!!b[0].pinned - !!a[0].pinned) || ((b[0].ts || 0) - (a[0].ts || 0)) || (a[1] - b[1])).map((x) => x[0]);
  function render() {
    const all = chats();
    $('#unread-n').textContent = all.filter((c) => c.unread).length;
    $$('#filters [data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const t = term.trim().toLowerCase();
    const list = order(all).filter((c) => (filter === 'all') || (filter === 'unread' && c.unread) || (filter === 'groups' && c.kind === 'group') || (filter === 'pinned' && c.pinned))
      .filter((c) => !t || chatInfo(c).name.toLowerCase().includes(t) || preview(c).toLowerCase().includes(t));
    $('#list').innerHTML = list.map((c) => {
      const i = chatInfo(c), m = lastMsg(c);
      const pv = c.typing ? '<span class="text-deep font-medium italic">typing…</span>' : esc(preview(c));
      const tick = m && m.from === 'me' ? icon(m.status === 'read' ? 'checks' : 'check', 'text-[15px] text-deep') : '';
      return `<li><a href="chat.html?id=${c.id}" class="row" data-chat="${c.id}">
        ${avatar(i, 52)}
        <span class="min-w-0 flex-1"><span class="flex items-center gap-1.5"><b class="font-semibold text-[15px] truncate">${esc(i.name)}</b>
          ${c.kind === 'group' ? icon('users', 'text-[14px] text-muted') : ''}${c.pinned ? icon('pin', 'text-[13px] text-deep') : ''}${c.muted ? icon('belloff', 'text-[13px] text-muted') : ''}</span>
          <span class="flex items-center gap-1 text-[13px] text-muted font-light truncate mt-0.5">${tick}<span class="truncate">${pv}</span></span></span>
        <span class="flex flex-col items-end gap-1.5 flex-none"><small class="text-[11.5px] ${c.unread ? 'text-deep font-semibold' : 'text-muted'}">${esc(m ? m.t : '')}</small>
          ${c.unread ? `<span class="badge ${c.kind === 'group' ? 'p' : ''} ${c.muted ? '!bg-muted' : ''}">${c.unread}</span>` : '<span class="h-[22px]"></span>'}</span>
      </a></li>`;
    }).join('');
    $('#empty').classList.toggle('hidden', list.length > 0);
  }
  $('#filters').addEventListener('click', (e) => { const b = e.target.closest('[data-filter]'); if (!b) return; filter = b.dataset.filter; set('filter', filter); render(); });
  $('#q').addEventListener('input', (e) => { term = e.target.value; render(); });
  $('#find').addEventListener('click', () => $('#q').focus());
  $('#q-mic').addEventListener('click', () => toast('Voice search is a demo'));
  $('#clear').addEventListener('click', () => { term = ''; $('#q').value = ''; filter = 'all'; set('filter', filter); render(); });

  /* ---------- long-press / right-click actions ---------- */
  const act = sheet('act'); let actId = null;
  function openActions(id) {
    actId = id; const c = chats().find((x) => x.id === id), i = chatInfo(c);
    $('#act-head').innerHTML = `${avatar(i, 44)}<span><b class="block font-semibold">${esc(i.name)}</b><small class="text-muted text-[12.5px]">${esc(i.sub)}</small></span>`;
    $('#act-pin').textContent = c.pinned ? 'Unpin chat' : 'Pin chat';
    $('#act-read').textContent = c.unread ? 'Mark as read' : 'Mark as unread';
    $('#act-mute').textContent = c.muted ? 'Unmute' : 'Mute';
    act.open();
  }
  let pressT, pressed = false;
  $('#list').addEventListener('contextmenu', (e) => { const a = e.target.closest('[data-chat]'); if (!a) return; e.preventDefault(); openActions(a.dataset.chat); });
  $('#list').addEventListener('pointerdown', (e) => { const a = e.target.closest('[data-chat]'); if (!a || e.button !== 0) return; pressed = false; pressT = setTimeout(() => { pressed = true; openActions(a.dataset.chat); }, 520); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => $('#list').addEventListener(ev, () => clearTimeout(pressT)));
  $('#list').addEventListener('click', (e) => { if (pressed) { e.preventDefault(); pressed = false; } });
  $('#act').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return; const list = chats(); const c = list.find((x) => x.id === actId); const k = b.dataset.act;
    if (k === 'pin') { c.pinned = !c.pinned; toast(c.pinned ? 'Chat pinned' : 'Chat unpinned'); }
    if (k === 'read') { c.unread = c.unread ? 0 : 1; toast(c.unread ? 'Marked as unread' : 'Marked as read'); }
    if (k === 'mute') { c.muted = !c.muted; toast(c.muted ? 'Muted' : 'Unmuted'); }
    if (k === 'delete') { list.splice(list.indexOf(c), 1); toast('Chat deleted'); }
    saveChats(list); act.close(); render();
  });

  /* ---------- stories ---------- */
  const seen = () => get('seen', []);
  const mine = () => get('mystory', null);
  function renderStories() {
    const s = seen(), my = mine();
    const meAv = avatar({ initials: D.me.initials, grad: D.me.grad }, 58, { online: false });
    let h = `<button type="button" class="flex flex-col items-center gap-1.5 flex-none w-[66px]" id="my-story" aria-label="${my ? 'View your story' : 'Add to your story'}">
      <span class="relative ${my ? 'ring' : 'p-[3px] rounded-full border-2 border-dashed border-primary/50'}">${meAv}
        <i class="absolute -right-0.5 -bottom-0.5 w-6 h-6 rounded-full bg-primary text-white grid place-items-center ring-[3px] ring-bg">${icon('plus', 'text-[14px]')}</i></span>
      <small class="text-[12px] text-muted">Your story</small></button>`;
    h += D.stories.map((st, k) => `<button type="button" class="flex flex-col items-center gap-1.5 flex-none w-[66px]" data-story="${k}" aria-label="View ${esc(D.people[st.id].name)}'s story">
      <span class="ring ${s.includes(st.id) ? 'seen' : ''}">${avatar(st.id, 58, { online: false })}</span><small class="text-[12px] truncate max-w-full">${esc(D.people[st.id].name.split(' ')[0])}</small></button>`).join('');
    $('#story-row').innerHTML = h;
  }
  const feed = () => { const my = mine(); return (my ? [Object.assign({ id: 'me' }, my)] : []).concat(D.stories); };
  let vi = 0, vt, vstart, list = [];
  const viewer = $('#viewer');
  function showStory(k) {
    if (k < 0) k = 0; if (k >= list.length) return closeViewer();
    vi = k; const st = list[k]; const p = st.id === 'me' ? { name: 'You', initials: D.me.initials, grad: D.me.grad } : D.people[st.id];
    $('#v-bg').style.background = st.img ? `center / cover no-repeat url(${st.img})` : st.bg;
    $('#v-av').innerHTML = avatar(p, 40, { online: false }); $('#v-name').textContent = p.name; $('#v-time').textContent = st.t || 'now'; $('#v-text').textContent = st.text;
    $('#v-bars').innerHTML = list.map((_, n) => `<span class="story-bar"><i style="width:${n < k ? 100 : 0}%"></i></span>`).join('');
    if (st.id !== 'me') { const s = seen(); if (!s.includes(st.id)) { s.push(st.id); set('seen', s); } }
    clearInterval(vt); vstart = Date.now();
    const bar = $$('#v-bars i')[k];
    vt = setInterval(() => { const p2 = Math.min(1, (Date.now() - vstart) / 4500); bar.style.width = p2 * 100 + '%'; if (p2 >= 1 && document.activeElement !== $('#v-input')) showStory(vi + 1); }, 60);
  }
  function openViewer(k) { list = feed(); viewer.classList.add('open'); viewer.setAttribute('aria-hidden', 'false'); showStory(k); }
  function closeViewer() { clearInterval(vt); viewer.classList.remove('open'); viewer.setAttribute('aria-hidden', 'true'); renderStories(); }
  $('#story-row').addEventListener('click', (e) => {
    const b = e.target.closest('[data-story]'); if (b) return openViewer(+b.dataset.story + (mine() ? 1 : 0));
    if (e.target.closest('#my-story')) { if (mine() && !e.target.closest('i')) openViewer(0); else addStory.open(); }
  });
  $('#v-next').addEventListener('click', () => showStory(vi + 1));
  $('#v-prev').addEventListener('click', () => showStory(vi - 1));
  $('#v-close').addEventListener('click', closeViewer);
  document.addEventListener('keydown', (e) => { if (!viewer.classList.contains('open')) return; if (e.key === 'Escape') closeViewer(); if (e.key === 'ArrowRight') showStory(vi + 1); if (e.key === 'ArrowLeft') showStory(vi - 1); });
  $('#v-reply').addEventListener('submit', (e) => {
    e.preventDefault(); const txt = $('#v-input').value.trim(); const st = list[vi]; if (!txt || st.id === 'me') return;
    const all = chats(); const c = all.find((x) => x.id === st.id);
    if (c) { c.messages.push({ id: 'm' + Date.now(), from: 'me', text: `Replied to story: ${txt}`, t: now(), status: 'sent' }); c.ts = Date.now(); saveChats(all); }
    $('#v-input').value = ''; toast('Reply sent'); render();
  });

  /* add text story */
  const BGS = ['linear-gradient(135deg,#5B3FD0,#B39BFF)', 'linear-gradient(135deg,#FF5C8A,#FF9F43)', 'linear-gradient(135deg,#1E1B3A,#5B3FD0)', 'linear-gradient(135deg,#36C2B4,#7B61FF)'];
  let bg = BGS[0]; const addStory = sheet('add-story');
  $('#story-bgs').innerHTML = BGS.map((b, k) => `<button type="button" data-bg="${k}" class="w-10 h-10 rounded-full" style="background:${b}" aria-label="Background ${k + 1}" aria-pressed="${k === 0}"></button>`).join('');
  $('#story-bgs').addEventListener('click', (e) => { const b = e.target.closest('[data-bg]'); if (!b) return; bg = BGS[+b.dataset.bg]; $('#story-preview').style.background = bg;
    $$('#story-bgs [data-bg]').forEach((x) => { x.setAttribute('aria-pressed', String(x === b)); x.style.boxShadow = x === b ? '0 0 0 3px rgb(var(--surface)), 0 0 0 5px rgb(var(--primary))' : ''; }); });
  $('#story-text').addEventListener('input', (e) => { $('#story-preview').textContent = e.target.value || 'Say something'; $('#story-err').textContent = ''; });
  $('#post-story').addEventListener('click', () => {
    const text = $('#story-text').value.trim(); if (!text) { $('#story-err').textContent = 'Type something for your story.'; return; }
    set('mystory', { text, bg, t: 'now' }); addStory.close(); $('#story-text').value = ''; renderStories(); toast('Story shared');
  });

  /* ---------- new chat / new group ---------- */
  const nw = sheet('new'); let mode = 'dm'; const picked = new Set();
  function renderContacts() {
    $('#contacts').innerHTML = Object.entries(D.people).map(([id, p]) => `<li><button type="button" data-person="${id}" class="w-full flex items-center gap-3 p-2 rounded-[16px] hover:bg-bg text-left" aria-pressed="${picked.has(id)}">
      ${avatar(id, 44)}<span class="flex-1 min-w-0"><b class="block font-medium text-[14.5px]">${esc(p.name)}</b><small class="text-muted text-[12px]">${esc(p.about)}</small></span>
      ${mode === 'group' ? `<span class="w-6 h-6 rounded-full grid place-items-center ${picked.has(id) ? 'bg-primary text-white' : 'border-2 border-line'}">${picked.has(id) ? icon('check', 'text-[14px]') : ''}</span>` : icon('chevron', 'text-muted')}</button></li>`).join('');
  }
  function setMode(m) {
    mode = m; picked.clear(); $('#new-err').textContent = '';
    $$('#new [data-mode]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === m)));
    $('#group-name').classList.toggle('hidden', m !== 'group'); $('#create-group').classList.toggle('hidden', m !== 'group');
    $('#new-hint').textContent = m === 'group' ? 'Name it and pick at least 2 people.' : 'Pick someone to start chatting.'; $('#new-title').textContent = m === 'group' ? 'New group' : 'New chat';
    renderContacts();
  }
  $('#new-chat').addEventListener('click', () => { setMode('dm'); nw.open(); });
  $('#new').addEventListener('click', (e) => {
    const t = e.target.closest('[data-mode]'); if (t) return setMode(t.dataset.mode);
    const p = e.target.closest('[data-person]'); if (!p) return; const id = p.dataset.person;
    if (mode === 'dm') {
      const all = chats(); if (!all.find((c) => c.id === id)) { all.unshift({ id, kind: 'dm', unread: 0, ts: Date.now(), messages: [], replies: ['Hey! 👋', 'What is up?'] }); saveChats(all); }
      location.href = 'chat.html?id=' + id; return;
    }
    picked.has(id) ? picked.delete(id) : picked.add(id); $('#new-err').textContent = ''; renderContacts();
  });
  $('#create-group').addEventListener('click', () => {
    const name = $('#group-name').value.trim();
    if (!name) { $('#new-err').textContent = 'Give your group a name.'; return; }
    if (picked.size < 2) { $('#new-err').textContent = 'Pick at least 2 people.'; return; }
    const id = 'g' + Date.now(); const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const all = chats(); all.unshift({ id, kind: 'group', name, initials, grad: ['#5B3FD0', '#FF5C8A'], members: [...picked], admin: 'me', unread: 0, ts: Date.now(),
      messages: [{ id: 'x1', from: 'me', text: `Created "${name}"`, t: now(), status: 'sent' }], replies: ['Yay, new group! 🎉', 'Hi all'] });
    saveChats(all); nw.close(); $('#group-name').value = ''; render(); toast('Group created');
  });

  renderStories(); render();
  if (location.hash === '#stories') { const s = seen(); const k = D.stories.findIndex((st) => !s.includes(st.id)); openViewer((k < 0 ? 0 : k) + (mine() ? 1 : 0)); }
})();
window.addEventListener('hashchange', () => { if (location.hash === '#stories') { const b = document.querySelector('#story-row [data-story]'); b && b.click(); history.replaceState(null, '', location.pathname + location.search); } });
