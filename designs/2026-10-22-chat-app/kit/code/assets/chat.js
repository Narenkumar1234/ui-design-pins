/* Natter · chat.js — conversation: send, reactions, reply (tap or swipe), typing indicator + fake auto-reply, voice notes
   (record + playback with seek), photo attach preview (gallery or upload), location, action rail, chat info sheet. */
(() => {
  const { D, $, $$, esc, icon, chats, saveChats, chatInfo, avatar, person, fmt, now, toast, sheet, startCall, settings } = Natter;
  const qs = new URLSearchParams(location.search);
  let id = qs.get('id') || 'maya';
  if (!chats().find((c) => c.id === id)) id = chats()[0] ? chats()[0].id : 'maya';
  const C = () => chats().find((c) => c.id === id);
  const save = (fn) => { const list = chats(); const c = list.find((x) => x.id === id); fn(c); saveChats(list); return c; };
  save((c) => { c.unread = 0; });
  localStorage.setItem('natter.lastChat', id);
  const S = settings();
  document.body.dataset.wallpaper = S.wallpaper;
  if (S.wallpaper === 'dots') $('#thread').style.backgroundImage = 'radial-gradient(rgb(var(--primary) / .12) 1.2px, transparent 1.3px)', $('#thread').style.backgroundSize = '18px 18px';
  if (S.wallpaper === 'violet') $('#thread').style.background = 'linear-gradient(180deg, rgb(var(--primary) / .10), transparent 60%)';

  /* ---------- header ---------- */
  let typingWho = null;
  function head() {
    const c = C(), i = chatInfo(c);
    $('#h-av').innerHTML = avatar(i, 44, { cls: 'ring-2 ring-white/40' });
    $('#h-name').textContent = i.name;
    document.title = `Natter · ${i.name}`;
    const members = c.kind === 'group' ? c.members.map((m) => D.people[m].name.split(' ')[0]).join(', ') + ', You' : i.sub;
    $('#h-sub').textContent = typingWho ? (c.kind === 'group' ? `${D.people[typingWho].name.split(' ')[0]} is typing…` : 'typing…') : members;
  }

  /* ---------- rendering ---------- */
  const bars = (seed) => { let h = 0; for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return Array.from({ length: 30 }, (_, k) => { h = (h * 1103515245 + 12345) >>> 0; return 5 + ((h >>> 16) % 19) * (0.55 + 0.45 * Math.sin(k / 4.2) ** 2); }); };
  const who = (m) => (m.from === 'me' ? 'You' : D.people[m.from].name.split(' ')[0]);
  function body(m) {
    if (m.type === 'voice') {
      const b = bars(m.id).map((h) => `<i style="height:${h.toFixed(1)}px"></i>`).join('');
      return `<div class="voice"><button type="button" class="play" data-play="${m.id}" aria-label="Play voice note">${icon('play', 'text-[15px]')}</button>
        <span class="wave" data-wave="${m.id}" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="${m.dur}" aria-valuenow="0" tabindex="0">${b}</span><span class="dur" data-dur="${m.id}">${fmt(m.dur)}</span></div>`;
    }
    if (m.type === 'image') return `<img src="${esc(m.src)}" alt="${esc(m.text || 'Photo')}" loading="lazy">${m.text ? `<p class="cap">${esc(m.text)}</p>` : ''}`;
    if (m.type === 'location') return `<div class="w-[210px] max-w-full"><svg viewBox="0 0 210 110" class="block w-full rounded-[14px]" aria-hidden="true"><rect width="210" height="110" fill="#E9E6FF"/><path d="M0 70h210M0 30h210M60 0v110M150 0v110" stroke="#fff" stroke-width="8"/><path d="M0 92 C60 70 110 100 210 60" stroke="#C9C0FF" stroke-width="10" fill="none"/><circle cx="105" cy="52" r="20" fill="#5B3FD0" opacity=".18"/><path d="M105 64s-11-9.5-11-18a11 11 0 0 1 22 0c0 8.5-11 18-11 18z" fill="#5B3FD0"/><circle cx="105" cy="46" r="4" fill="#fff"/></svg>
      <p class="cap"><b class="font-semibold">Current location</b><br><span class="opacity-80 text-[12.5px]">Anna Nagar, Chennai</span></p></div>`;
    return esc(m.text).replace(/(\p{Extended_Pictographic}+)/gu, '<span class="emoji">$1</span>');
  }
  function msgHTML(m, c, prev) {
    const out = m.from === 'me', all = c.messages;
    const rep = m.replyTo && all.find((x) => x.id === m.replyTo);
    const quote = rep ? `<div class="quote"><b class="text-[11.5px] font-semibold">${esc(who(rep))}</b><span>${esc(rep.type === 'voice' ? 'Voice note · ' + fmt(rep.dur) : rep.type === 'image' ? 'Photo' : rep.text)}</span></div>` : '';
    const name = !out && c.kind === 'group' && (!prev || prev.from !== m.from) ? `<small class="text-[11.5px] font-semibold text-deep px-3 mb-1">${esc(D.people[m.from].name)}</small>` : '';
    const rx = Object.entries(m.reactions || {}).filter(([, v]) => v.length);
    const reacts = rx.length ? `<div class="reacts">${rx.map(([e, v]) => `<button type="button" class="react ${v.includes('me') ? 'mine' : ''}" data-react="${e}" data-mid="${m.id}" aria-label="${e} ${v.length}, toggle"><span class="emoji">${e}</span>${v.length > 1 ? `<span>${v.length}</span>` : ''}</button>`).join('')}</div>` : '';
    const tick = out ? (m.status === 'read' ? icon('checks', 'text-[15px] tick') : icon('check', 'text-[14px]')) : '';
    const kind = m.type === 'image' || m.type === 'location' ? 'imgb' : '';
    return `<div class="msg ${out ? 'out' : 'in'}" data-mid="${m.id}">${name}
      <div class="bubble ${kind}" tabindex="0" role="button" aria-haspopup="menu" aria-label="Message from ${esc(who(m))}. Tap to react or reply">${quote}${body(m)}</div>${reacts}
      <span class="meta">${esc(m.t)}${tick}</span></div>`;
  }
  function render() {
    const c = C();
    let h = '<span class="daysep">Today</span>';
    c.messages.forEach((m, k) => { h += msgHTML(m, c, c.messages[k - 1]); });
    if (typingWho || qs.get('typing')) h += `<div class="msg in typing" id="typing" aria-label="typing">${c.kind === 'group' ? `<small class="text-[11.5px] font-semibold text-deep px-3 mb-1">${esc(D.people[typingWho || c.members[0]].name)}</small>` : ''}<div class="bubble"><i></i><i></i><i></i></div></div>`;
    if (!c.messages.length && !typingWho) h += `<p class="text-center text-muted text-[13.5px] mt-10">Say hi to ${esc(chatInfo(c).name.split(' ')[0])} 👋</p>`;
    $('#thread').innerHTML = h; head(); paintVoice();
  }
  const toBottom = (smooth) => window.scrollTo({ top: document.body.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });

  /* ---------- sending + fake auto-reply ---------- */
  let replyTo = null, replyTimer, typeTimer;
  function push(m) {
    m.id = m.id || 'm' + Date.now() + Math.random().toString(36).slice(2, 5); m.from = m.from || 'me'; m.t = now();
    if (m.from === 'me') { m.status = 'sent'; if (replyTo) m.replyTo = replyTo; }
    save((c) => { c.messages.push(m); c.ts = Date.now(); if (m.from === 'me') c.typing = false; });
    if (m.from === 'me') { clearReply(); scheduleReply(); }
    render(); toBottom(true);
    return m;
  }
  function scheduleReply() {
    clearTimeout(replyTimer); clearTimeout(typeTimer);
    const c = C(); const from = c.kind === 'group' ? c.members[(c.ri || 0) % c.members.length] : c.id;
    typeTimer = setTimeout(() => { typingWho = from; render(); toBottom(true); }, 600);
    replyTimer = setTimeout(() => {
      typingWho = null;
      const list = chats(); const cc = list.find((x) => x.id === id); const pool = cc.replies && cc.replies.length ? cc.replies : ['👍'];
      const text = pool[(cc.ri || 0) % pool.length]; cc.ri = (cc.ri || 0) + 1;
      cc.messages.forEach((x) => { if (x.from === 'me') x.status = 'read'; });
      cc.messages.push({ id: 'r' + Date.now(), from, text, t: now() }); cc.ts = Date.now(); saveChats(list);
      render(); toBottom(true);
    }, 2000);
  }
  const input = $('#msg');
  function syncSend() { const has = input.value.trim().length > 0; $('#send').innerHTML = icon(has ? 'send' : 'mic', 'text-[19px]'); $('#send').setAttribute('aria-label', has ? 'Send message' : 'Record voice note'); }
  input.addEventListener('input', syncSend);
  $('#composer').addEventListener('submit', (e) => {
    e.preventDefault();
    if (recording) return stopRec(true);
    const text = input.value.trim();
    if (!text) return startRec();
    push({ text }); input.value = ''; syncSend(); input.focus();
  });

  /* emoji quick row */
  const QUICK = ['😀', '😂', '😍', '🥹', '👍', '🔥', '🎉', '🙏'];
  $('#emoji-row').innerHTML = QUICK.map((e) => `<button type="button" class="w-9 h-9 rounded-full text-[20px] grid place-items-center hover:bg-raised" data-emoji="${e}" aria-label="Insert ${e}">${e}</button>`).join('');
  $('#emoji-btn').addEventListener('click', () => { const r = $('#emoji-row'); r.classList.toggle('hidden'); $('#emoji-btn').setAttribute('aria-expanded', String(!r.classList.contains('hidden'))); });
  $('#emoji-row').addEventListener('click', (e) => { const b = e.target.closest('[data-emoji]'); if (!b) return; input.value += b.dataset.emoji; syncSend(); input.focus(); });

  /* ---------- reply ---------- */
  function setReply(mid) {
    const m = C().messages.find((x) => x.id === mid); if (!m) return; replyTo = mid;
    $('#reply-who').textContent = 'Replying to ' + who(m);
    $('#reply-text').textContent = m.type === 'voice' ? 'Voice note · ' + fmt(m.dur) : m.type === 'image' ? 'Photo' : m.type === 'location' ? 'Location' : m.text;
    $('#reply-bar').classList.remove('hidden'); input.focus();
  }
  function clearReply() { replyTo = null; $('#reply-bar').classList.add('hidden'); }
  $('#reply-x').addEventListener('click', clearReply);

  /* ---------- reactions + message menu ---------- */
  const picker = $('#picker'); let pickId = null;
  function toggleReact(mid, e) {
    save((c) => { const m = c.messages.find((x) => x.id === mid); m.reactions = m.reactions || {};
      Object.keys(m.reactions).forEach((k) => { if (k !== e) m.reactions[k] = m.reactions[k].filter((u) => u !== 'me'); });
      const arr = m.reactions[e] = m.reactions[e] || []; const at = arr.indexOf('me'); at >= 0 ? arr.splice(at, 1) : arr.push('me'); });
    render();
  }
  function openPicker(mid, el) {
    pickId = mid; const m = C().messages.find((x) => x.id === mid);
    picker.innerHTML = D.reactions.map((e) => `<button type="button" class="emoji" role="menuitem" data-pick="${e}" aria-label="React ${e}">${e}</button>`).join('')
      + `<span class="w-px bg-line mx-1"></span><button type="button" class="act" role="menuitem" data-do="reply">Reply</button>`
      + (m.type !== 'voice' && m.type !== 'image' ? '<button type="button" class="act" role="menuitem" data-do="copy">Copy</button>' : '')
      + (m.from === 'me' ? '<button type="button" class="act !text-pink" role="menuitem" data-do="delete">Delete</button>' : '');
    picker.classList.remove('hidden');
    const r = el.getBoundingClientRect(), pw = picker.offsetWidth, ph = picker.offsetHeight;
    let x = m.from === 'me' ? r.right - pw : r.left; x = Math.max(8, Math.min(window.innerWidth - pw - 8, x));
    let y = r.top - ph - 8; if (y < 80) y = r.bottom + 8;
    picker.style.left = x + 'px'; picker.style.top = y + 'px';
    $$('.msg.pick').forEach((n) => n.classList.remove('pick')); el.closest('.msg').classList.add('pick');
    pickY = window.scrollY; picker.querySelector('button').focus({ preventScroll: true });
  }
  function closePicker() { picker.classList.add('hidden'); $$('.msg.pick').forEach((n) => n.classList.remove('pick')); pickId = null; }
  picker.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !pickId) return; const mid = pickId; closePicker();
    if (b.dataset.pick) return toggleReact(mid, b.dataset.pick);
    if (b.dataset.do === 'reply') return setReply(mid);
    if (b.dataset.do === 'copy') { const t = C().messages.find((x) => x.id === mid).text || ''; Promise.resolve().then(() => navigator.clipboard && navigator.clipboard.writeText(t)).catch(() => {}); return toast('Copied'); }
    if (b.dataset.do === 'delete') { save((c) => { c.messages = c.messages.filter((x) => x.id !== mid); }); render(); toast('Message deleted'); }
  });
  document.addEventListener('pointerdown', (e) => { if (!picker.classList.contains('hidden') && !e.target.closest('#picker') && !e.target.closest('.bubble')) closePicker(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePicker(); $('#emoji-row').classList.add('hidden'); } });
  let pickY = 0;
  window.addEventListener('scroll', () => { if (!picker.classList.contains('hidden') && Math.abs(window.scrollY - pickY) > 60) closePicker(); }, { passive: true });

  /* thread clicks: play, seek, reaction pills, bubbles; swipe right to reply */
  let swipe = null, swiped = false;
  const thread = $('#thread');
  thread.addEventListener('click', (e) => {
    const p = e.target.closest('[data-play]'); if (p) return togglePlay(p.dataset.play);
    const w = e.target.closest('[data-wave]'); if (w) { const r = w.getBoundingClientRect(); return seek(w.dataset.wave, (e.clientX - r.left) / r.width); }
    const rp = e.target.closest('[data-react]'); if (rp) return toggleReact(rp.dataset.mid, rp.dataset.react);
    const b = e.target.closest('.bubble'); if (!b || swiped) { swiped = false; return; }
    const mid = b.closest('.msg').dataset.mid; if (!mid) return;
    pickId === mid ? closePicker() : openPicker(mid, b);
  });
  thread.addEventListener('dblclick', (e) => { const b = e.target.closest('.bubble'); if (b && !e.target.closest('.voice')) { closePicker(); toggleReact(b.closest('.msg').dataset.mid, '❤️'); } });
  thread.addEventListener('keydown', (e) => {
    const b = e.target.closest('.bubble'); if (b && (e.key === 'Enter' || e.key === ' ') && e.target === b) { e.preventDefault(); openPicker(b.closest('.msg').dataset.mid, b); }
    const w = e.target.closest('[data-wave]'); if (w && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); const m = C().messages.find((x) => x.id === w.dataset.wave); const cur = (play.id === m.id ? play.pos : (pos[m.id] || 0)); seek(m.id, Math.max(0, Math.min(1, (cur + (e.key === 'ArrowRight' ? 5 : -5)) / m.dur))); }
  });
  thread.addEventListener('pointerdown', (e) => { const b = e.target.closest('.bubble'); if (b && !e.target.closest('.voice')) swipe = { el: b.closest('.msg'), x: e.clientX, y: e.clientY }; });
  window.addEventListener('pointermove', (e) => { if (!swipe) return; const dx = e.clientX - swipe.x; if (dx > 8 && Math.abs(e.clientY - swipe.y) < 30) swipe.el.style.transform = `translateX(${Math.min(dx, 80)}px)`; });
  window.addEventListener('pointerup', (e) => {
    if (!swipe) return; const dx = e.clientX - swipe.x; swipe.el.style.transform = '';
    if (dx > 60) { swiped = true; setReply(swipe.el.dataset.mid); setTimeout(() => { swiped = false; }, 50); }
    swipe = null;
  });

  /* ---------- voice notes: playback (simulated, no audio file needed) ---------- */
  const play = { id: null, pos: 0, t: null }; const pos = {};
  function paintVoice() {
    C().messages.filter((m) => m.type === 'voice').forEach((m) => {
      const p = play.id === m.id ? play.pos : (pos[m.id] || 0); const f = p / m.dur;
      const w = thread.querySelector(`[data-wave="${m.id}"]`); if (!w) return;
      [...w.children].forEach((i, k, arr) => i.classList.toggle('done', k / arr.length < f));
      w.setAttribute('aria-valuenow', String(Math.round(p)));
      thread.querySelector(`[data-dur="${m.id}"]`).textContent = p > 0 ? fmt(p) : fmt(m.dur);
      const b = thread.querySelector(`[data-play="${m.id}"]`); const on = play.id === m.id && play.t;
      b.innerHTML = icon(on ? 'pause' : 'play', 'text-[15px]'); b.setAttribute('aria-label', on ? 'Pause voice note' : 'Play voice note'); b.setAttribute('aria-pressed', String(!!on));
    });
  }
  function stopPlay() { if (play.id) pos[play.id] = play.pos; clearInterval(play.t); play.t = null; }
  function togglePlay(mid) {
    const m = C().messages.find((x) => x.id === mid);
    if (play.id === mid && play.t) { stopPlay(); return paintVoice(); }
    stopPlay(); play.id = mid; play.pos = pos[mid] >= m.dur ? 0 : (pos[mid] || 0);
    const step = 0.1 * (Number(qs.get('speed')) || 1);
    play.t = setInterval(() => { play.pos = Math.min(m.dur, play.pos + step); if (play.pos >= m.dur) { stopPlay(); pos[mid] = 0; play.pos = 0; play.id = null; } paintVoice(); }, 100);
    paintVoice();
  }
  function seek(mid, f) { const m = C().messages.find((x) => x.id === mid); const p = Math.max(0, Math.min(1, f)) * m.dur; if (play.id === mid) play.pos = p; pos[mid] = p; paintVoice(); }

  /* recording (simulated timer -> voice note bubble) */
  let recording = false, recT, recS = 0;
  function startRec() {
    recording = true; recS = 0; $('#rec-t').textContent = '0:00';
    input.classList.add('hidden'); $('#attach').classList.add('hidden'); $('#emoji-btn').classList.add('hidden'); $('#rec').classList.remove('hidden');
    $('#send').innerHTML = icon('send', 'text-[19px]'); $('#send').setAttribute('aria-label', 'Send voice note');
    $('[data-rail="mic"]').setAttribute('aria-pressed', 'true');
    recT = setInterval(() => { recS++; $('#rec-t').textContent = fmt(recS); if (recS >= 120) stopRec(true); }, 1000);
  }
  function stopRec(send) {
    clearInterval(recT); recording = false;
    input.classList.remove('hidden'); $('#attach').classList.remove('hidden'); $('#emoji-btn').classList.remove('hidden'); $('#rec').classList.add('hidden');
    $('[data-rail="mic"]').setAttribute('aria-pressed', 'false'); syncSend();
    if (send) push({ type: 'voice', dur: Math.max(1, recS) });
  }
  $('#rec-cancel').addEventListener('click', () => { stopRec(false); toast('Recording discarded'); });

  /* ---------- photo attach: gallery tiles or real upload -> preview -> send ---------- */
  const ph = sheet('photo'); let photoSrc = null;
  const GAL = ['sunset-hike', 'desk-setup', 'coffee-run', 'team-lunch', 'concert'];
  $('#gallery').innerHTML = GAL.map((g) => `<button type="button" class="tile" data-src="img/${g}.svg" aria-label="Pick ${g.replace('-', ' ')}" aria-pressed="false"><img src="img/${g}.svg" alt=""></button>`).join('');
  function pickPhoto(src) {
    photoSrc = src; $('#photo-img').src = src; $('#photo-img').classList.remove('hidden'); $('#photo-none').classList.add('hidden'); $('#photo-err').textContent = '';
    $$('#gallery [data-src]').forEach((b) => { const on = b.dataset.src === src; b.setAttribute('aria-pressed', String(on)); b.style.boxShadow = on ? '0 0 0 3px rgb(var(--surface)), 0 0 0 5px rgb(var(--primary))' : ''; });
  }
  function openPhoto() { photoSrc = null; $('#photo-img').classList.add('hidden'); $('#photo-none').classList.remove('hidden'); $('#caption').value = ''; $$('#gallery [data-src]').forEach((b) => { b.style.boxShadow = ''; b.setAttribute('aria-pressed', 'false'); }); ph.open(); }
  $('#gallery').addEventListener('click', (e) => { const b = e.target.closest('[data-src]'); if (b) pickPhoto(b.dataset.src); });
  $('#upload').addEventListener('click', () => $('#file').click());
  $('#attach').addEventListener('click', openPhoto);
  $('#file').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return; if (!f.type.startsWith('image/')) { $('#photo-err').textContent = 'Please choose an image.'; return; }
    const img = new Image(); const url = URL.createObjectURL(f);
    img.onload = () => { const k = Math.min(1, 640 / img.width); const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); pickPhoto(cv.toDataURL('image/jpeg', 0.8)); if (!ph.el.classList.contains('open')) ph.open(); };
    img.onerror = () => { $('#photo-err').textContent = 'Could not read that image.'; };
    img.src = url; e.target.value = '';
  });
  $('#photo-send').addEventListener('click', () => {
    if (!photoSrc) { $('#photo-err').textContent = 'Pick a photo first.'; return; }
    ph.close(); push({ type: 'image', src: photoSrc, text: $('#caption').value.trim() });
  });

  /* ---------- action rail ---------- */
  $('#rail').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rail]'); if (!b) return; const k = b.dataset.rail;
    if (k === 'image') openPhoto();
    if (k === 'camera') { toast('Camera needs a real device · pick a photo instead'); openPhoto(); }
    if (k === 'mic') recording ? stopRec(true) : startRec();
    if (k === 'location') { push({ type: 'location' }); toast('Location shared'); }
  });

  /* ---------- calls + info sheet ---------- */
  $('#h-call').addEventListener('click', () => startCall(id, false));
  $('#h-video').addEventListener('click', () => startCall(id, true));
  const info = sheet('info');
  function renderInfo() {
    const c = C(), i = chatInfo(c);
    const media = c.messages.filter((m) => m.type === 'image');
    $('#i-title').textContent = c.kind === 'group' ? 'Group info' : 'Contact info';
    const members = c.kind === 'group' ? ['me', ...c.members].map((m) => { const p = person(m); const admin = (c.admin || 'me') === m;
      return `<li class="flex items-center gap-3 py-2">${avatar(m === 'me' ? { initials: D.me.initials, grad: D.me.grad } : m, 42, { online: m === 'me' ? false : undefined })}
        <span class="flex-1 min-w-0"><b class="block font-medium text-[14px]">${esc(m === 'me' ? 'You' : p.name)}</b><small class="text-muted text-[12px]">${esc(m === 'me' ? S.status : p.about)}</small></span>
        ${admin ? '<span class="h-6 px-2.5 rounded-full bg-primary/10 text-deep text-[11.5px] font-semibold grid place-items-center">Admin</span>' : ''}</li>`; }).join('') : '';
    $('#i-body').innerHTML = `
      <div class="flex flex-col items-center text-center mt-2">${avatar(i, 84)}<h3 class="text-[20px] font-semibold mt-3">${esc(i.name)}</h3><p class="text-muted text-[13px]">${esc(c.kind === 'group' ? `${c.members.length + 1} members` : D.people[c.id].about)}</p></div>
      <div class="mt-5 rounded-[24px] p-4 welcome flex items-center gap-3">
        <span class="flex -space-x-2.5">${(c.kind === 'group' ? c.members : [c.id]).slice(0, 3).map((m) => `<span class="ring !p-[2px] !bg-white/70">${avatar(m, 34, { online: false })}</span>`).join('')}</span>
        <span class="flex-1 min-w-0"><b class="block text-[14.5px] font-semibold">${c.kind === 'group' ? 'Group call' : 'Call ' + esc(i.name.split(' ')[0])}</b><small class="text-white/75 text-[12px]">Voice · video</small></span>
        <button type="button" data-icall="voice" class="btn-round !bg-white !text-[#5B3FD0] !w-10 !h-10" aria-label="Start voice call">${icon('phone', 'text-[17px]')}</button>
        <button type="button" data-icall="video" class="btn-round !bg-white !text-[#5B3FD0] !w-10 !h-10" aria-label="Start video call">${icon('video', 'text-[18px]')}</button></div>
      ${c.kind === 'group' ? `<h4 class="font-semibold mt-5">Members <span class="text-muted font-normal">${c.members.length + 1}</span></h4><ul class="mt-1 bg-surface rounded-[20px] px-4 py-1">${members}</ul>` : ''}
      <h4 class="font-semibold mt-5">Shared media <span class="text-muted font-normal" id="media-n">${media.length}</span></h4>
      <div class="grid grid-cols-3 gap-2 mt-2">${media.length ? media.map((m) => `<span class="tile"><img src="${esc(m.src)}" alt="${esc(m.text || 'Shared photo')}"></span>`).join('') : '<p class="col-span-3 text-muted text-[13px]">No photos yet.</p>'}</div>
      <div class="mt-5 bg-surface rounded-[20px]"><div class="set-row"><span class="set-ico">${icon('belloff')}</span><span class="flex-1 font-medium text-[14.5px]">Mute notifications</span>
        <button type="button" id="i-mute" class="switch" role="switch" aria-checked="${!!c.muted}" aria-label="Mute notifications"></button></div></div>`;
  }
  $('#info-open').addEventListener('click', () => { renderInfo(); info.open(); });
  $('#info').addEventListener('click', (e) => {
    const b = e.target.closest('[data-icall]'); if (b) { info.close(); return startCall(id, b.dataset.icall === 'video'); }
    if (e.target.closest('#i-mute')) { const c = save((x) => { x.muted = !x.muted; }); $('#i-mute').setAttribute('aria-checked', String(!!c.muted)); toast(c.muted ? 'Notifications muted' : 'Notifications on'); }
  });

  render(); toBottom(false); syncSend();
  if (qs.get('info')) { renderInfo(); info.open(); }
})();
