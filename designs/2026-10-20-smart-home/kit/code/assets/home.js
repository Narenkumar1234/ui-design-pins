/* Hearth UI Kit · home.js — greeting, room filter chips, search, device cards with toggles, quick scenes */
(() => {
  const { D, $, $$, icon, typeIcon, devices, update, room, onCount, meta, esc, toast, get, set, applyScene } = Hearth;
  Hearth.boot('Home');
  const h = new Date().getHours();
  $('#greet').textContent = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${D.user.name}`;
  if (new URLSearchParams(location.search).get('shot')) $('#greet').textContent = `Hi, ${D.user.name}`; // stable text for screenshots
  $('#home-name').textContent = D.user.home; $('#avatar').textContent = D.user.initials;
  $('#inside').textContent = D.climate.inside + '°';
  const today = D.energy.day.values.reduce((a, b) => a + b, 0); $('#today-kwh').textContent = today.toFixed(1) + ' kWh';

  let filter = new URLSearchParams(location.search).get('room') || get('room', 'all');
  let q = '';
  const chips = [{ id: 'all', name: 'All' }, ...D.rooms];
  $('#rooms').innerHTML = chips.map((r) => `<button type="button" class="chip" data-room="${r.id}">${r.name}</button>`).join('');
  $$('#rooms [data-room]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.room; set('room', filter); render(); }));

  function card(d) {
    const href = d.type === 'light' ? `room.html?id=${d.room}&tab=lights` : d.type === 'ac' ? `room.html?id=${d.room}&tab=climate` : null;
    return `<article class="dev ${d.hero ? 'hero' : ''}" data-id="${d.id}" data-on="${d.on}">
      <div class="flex items-start justify-between">
        <span class="ico">${icon(typeIcon[d.type] || 'plug', 'text-[22px]')}</span>
        <button type="button" class="switch" role="switch" aria-checked="${d.on}" aria-label="${esc(d.name)} power"></button>
      </div>
      <span class="status ${d.on ? 'on' : ''} mt-5">${d.on ? (d.type === 'wifi' ? 'Online' : 'On') : 'Off'}</span>
      ${href ? `<a href="${href}" class="block mt-2 font-medium text-[16px] leading-tight truncate after:absolute after:inset-0 after:content-['']" data-open>${esc(d.name)}</a>` : `<h3 class="mt-2 font-medium text-[16px] leading-tight truncate">${esc(d.name)}</h3>`}
      <p class="meta text-[13px] mt-0.5 truncate">${esc(meta(d))}</p>
    </article>`;
  }
  function render() {
    $$('#rooms [data-room]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.room === filter)));
    const all = devices();
    const list = all.filter((d) => (filter === 'all' || d.room === filter) && (!q || (d.name + ' ' + room(d.room).name + ' ' + d.type).toLowerCase().includes(q)));
    $('#grid').innerHTML = list.map(card).join('');
    $('#empty').classList.toggle('hidden', list.length > 0);
    $('#on-count').textContent = `${onCount(all)} on`;
    $$('#grid .switch').forEach((s) => s.addEventListener('click', (e) => {
      e.stopPropagation(); const id = s.closest('[data-id]').dataset.id; const d = update(id, { on: s.getAttribute('aria-checked') !== 'true' });
      set('scene', null); toast(`${d.name} ${d.on ? 'on' : 'off'}`); render(); renderScenes();
    }));
  }
  $('#q').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); render(); });
  $('#clear').addEventListener('click', () => { $('#q').value = ''; q = ''; filter = 'all'; render(); });
  $('#bell').addEventListener('click', () => toast('3 new: front door locked, filter clean, AC schedule'));
  $('#home-pick').addEventListener('click', () => toast('Multiple homes: your next feature to build'));

  function renderScenes() {
    const active = get('scene', null);
    $('#quick-scenes').innerHTML = D.scenes.map((s) => `<button type="button" class="chip" data-scene="${s.id}" aria-pressed="${s.id === active}">${icon(s.icon, 'text-[17px]')}${s.name}</button>`).join('');
    $$('#quick-scenes [data-scene]').forEach((b) => b.addEventListener('click', () => {
      const n = applyScene(b.dataset.scene); toast(`${D.scenes.find((s) => s.id === b.dataset.scene).name} on · ${n} change${n === 1 ? '' : 's'}`); render(); renderScenes();
    }));
  }
  document.addEventListener('hearth:devices', () => render());
  render(); renderScenes();
})();
