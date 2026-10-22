/* Natter · calls.js — live group call card, call history (All / Missed), call back (voice / video), clear log */
(() => {
  const { D, $, $$, esc, icon, get, set, chats, chatInfo, avatar, toast, nav, startCall } = Natter;
  nav('calls');
  let tab = new URLSearchParams(location.search).get('tab') || 'all';
  const sq = D.chats.find((c) => c.id === 'squad');
  $('#live-avs').innerHTML = sq.members.slice(0, 3).map((m) => `<span class="ring !p-[2px] !bg-white/70">${avatar(m, 38, { online: false })}</span>`).join('')
    + '<span class="w-[42px] h-[42px] rounded-full bg-white/20 grid place-items-center text-[12px] font-semibold ring-2 ring-white/40">+1</span>';
  let live = 768; setInterval(() => { live++; $('#live-t').textContent = `${Math.floor(live / 60)}:${String(live % 60).padStart(2, '0')}`; }, 1000);
  $('#join').addEventListener('click', () => startCall('squad', true));

  const info = (w) => { const c = chats().find((x) => x.id === w) || D.chats.find((x) => x.id === w); return c ? chatInfo(c) : chatInfo({ id: w, kind: 'dm' }); };
  function render() {
    const list = get('calllog', []).concat(get('cleared', false) ? [] : D.calls);
    const missed = list.filter((c) => c.dir === 'missed');
    $('#missed-n').textContent = missed.length ? `(${missed.length})` : '';
    $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    const rows = tab === 'missed' ? missed : list;
    $('#log').innerHTML = rows.map((c) => { const i = info(c.who); const ms = c.dir === 'missed';
      return `<li class="row" data-call="${c.id}">${avatar(i, 50)}
        <span class="flex-1 min-w-0"><b class="block font-semibold text-[15px] truncate ${ms ? 'text-pink' : ''}">${esc(i.name)}</b>
          <span class="flex items-center gap-1 text-[12.5px] text-muted font-light">${icon(c.dir === 'out' ? 'callout' : 'callin', `text-[15px] ${ms ? 'text-pink' : 'text-deep'}`)}<span class="truncate">${ms ? 'Missed · ' : ''}${esc(c.t)}${c.dur ? ' · ' + esc(c.dur) : ''}</span></span></span>
        <button type="button" class="btn-round !bg-primary/10 !text-deep !shadow-none" data-back="${c.who}" data-video="${c.video ? 1 : 0}" aria-label="Call ${esc(i.name)} back" title="${ms ? 'Missed' : c.dir === 'out' ? 'Outgoing' : 'Incoming'} call">${icon(c.video ? 'video' : 'phone', 'text-[19px]')}</button></li>`; }).join('');
    $('#log-empty').classList.toggle('hidden', rows.length > 0);
  }
  $('[role=tablist]').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; render(); } });
  $('#log').addEventListener('click', (e) => { const b = e.target.closest('[data-back]'); if (b) startCall(b.dataset.back, b.dataset.video === '1'); });
  $('#clear-log').addEventListener('click', () => { set('cleared', true); set('calllog', []); render(); toast('Call history cleared'); });
  document.addEventListener('natter:callend', render);
  render();
})();
