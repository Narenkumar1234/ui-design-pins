/* Hearth UI Kit · room.js — room switcher, Climate (thermostat dial, modes, fan, schedule) and Lights (brightness,
   colour temperature, lamps, schedule) tabs, plus the slide-to-toggle power pill. All state saved in localStorage. */
(() => {
  const { D, $, $$, icon, devices, device, update, room, esc, toast, get, set, slidePill, openAdd } = Hearth;
  Hearth.boot(null);
  const qs = new URLSearchParams(location.search);
  let roomId = D.rooms.some((r) => r.id === qs.get('id')) ? qs.get('id') : get('lastRoom', 'living');
  let tab = qs.get('tab') === 'lights' ? 'lights' : qs.get('tab') === 'climate' ? 'climate' : get('lastTab', 'climate');
  const MIN = 16, MAX = 30, R = 112, C = 2 * Math.PI * R, SWEEP = 0.75; // 270° dial
  const ac = () => devices().find((d) => d.room === roomId && d.type === 'ac');
  const light = () => devices().find((d) => d.room === roomId && d.type === 'light');
  const active = () => (tab === 'climate' ? ac() : light());

  /* ----- room chips + tabs ----- */
  $('#rooms').innerHTML = D.rooms.map((r) => `<button type="button" class="chip" data-room="${r.id}">${icon(r.icon, 'text-[17px]')}${r.name}</button>`).join('');
  $$('#rooms [data-room]').forEach((b) => b.addEventListener('click', () => { roomId = b.dataset.room; set('lastRoom', roomId); render(); }));
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; set('lastTab', tab); render(); }));
  $$('[data-add]').forEach((b) => b.addEventListener('click', () => { Hearth.boot && openAdd(); }));

  /* ----- thermostat dial ----- */
  const ticks = []; for (let i = 0; i <= 28; i++) { const a = (135 + (270 * i) / 28) * Math.PI / 180; const r1 = 96, r2 = i % 7 === 0 ? 102 : 99;
    ticks.push(`<line class="tick" x1="${134 + r1 * Math.cos(a)}" y1="${134 + r1 * Math.sin(a)}" x2="${134 + r2 * Math.cos(a)}" y2="${134 + r2 * Math.sin(a)}" stroke-width="2" stroke-linecap="round"/>`); }
  $('#ticks').innerHTML = ticks.join('');
  ['#track', '#arc'].forEach((s) => { $(s).setAttribute('transform', 'rotate(135 134 134)'); });
  $('#track').setAttribute('stroke-dasharray', `${C * SWEEP} ${C}`);
  function drawDial(t, on) {
    const f = (t - MIN) / (MAX - MIN);
    $('#arc').setAttribute('stroke-dasharray', `${Math.max(0.001, C * SWEEP * f)} ${C}`);
    $('#arc').style.opacity = on ? 1 : 0.35;
    const a = (135 + 270 * f) * Math.PI / 180; $('#knob').setAttribute('cx', 134 + R * Math.cos(a)); $('#knob').setAttribute('cy', 134 + R * Math.sin(a));
    $('#temp').textContent = t; $('#dial').setAttribute('aria-valuenow', t); $('#dial').setAttribute('aria-valuetext', `${t} degrees`);
  }
  function setTemp(t) { const d = ac(); if (!d) return; t = Math.max(MIN, Math.min(MAX, Math.round(t))); if (t === d.target) return; update(d.id, { target: t }); drawDial(t, d.on); }
  $('#minus').addEventListener('click', () => setTemp(ac().target - 1));
  $('#plus').addEventListener('click', () => setTemp(ac().target + 1));
  $('#dial').addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowRight'].includes(e.key)) { e.preventDefault(); setTemp(ac().target + 1); }
    if (['ArrowDown', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); setTemp(ac().target - 1); }
  });
  let dragging = false;
  function fromPointer(e) {
    const r = $('#dial').getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    let deg = Math.atan2(y, x) * 180 / Math.PI; if (deg < 0) deg += 360;             // 0 = right, clockwise
    let rel = deg - 135; if (rel < 0) rel += 360;                                       // 0 = start of the arc
    if (rel > 270) rel = rel > 315 ? 0 : 270;                                           // bottom gap snaps to the nearest end
    setTemp(MIN + (rel / 270) * (MAX - MIN));
  }
  $('#dial').addEventListener('pointerdown', (e) => { if (!ac()) return; dragging = true; $('#dial').setPointerCapture(e.pointerId); fromPointer(e); });
  $('#dial').addEventListener('pointermove', (e) => { if (dragging) fromPointer(e); });
  $('#dial').addEventListener('pointerup', () => { dragging = false; });

  /* modes + fan + schedule */
  $('#modes').innerHTML = D.modes.map((m) => `<button type="button" data-mode="${m.id}" class="flex flex-col items-center gap-1.5 text-[13px] text-muted group">
      <span class="w-14 h-14 rounded-full bg-surface grid place-items-center transition group-aria-pressed:bg-primary group-aria-pressed:text-white group-aria-pressed:shadow-glow">${icon(m.icon, 'text-[22px]')}</span>${m.name}</button>`).join('');
  $$('#modes [data-mode]').forEach((b) => b.addEventListener('click', () => { const d = ac(); update(d.id, { mode: b.dataset.mode, on: true }); render(); }));
  const FAN = ['Low', 'Medium', 'High'];
  $('#fan').innerHTML = FAN.map((n, i) => `<button type="button" data-fan="${i + 1}" aria-label="${n}" class="w-8 h-8 rounded-full text-[13px] font-medium bg-raised text-muted aria-pressed:bg-primary aria-pressed:text-white">${i + 1}</button>`).join('');
  $$('#fan [data-fan]').forEach((b) => b.addEventListener('click', () => { const d = ac(); update(d.id, { fan: +b.dataset.fan }); render(); }));
  const sched = (id, key) => $(id).addEventListener('click', () => { const s = get(key, true); set(key, !s); $(id).setAttribute('aria-checked', String(!s)); toast(!s ? 'Schedule on' : 'Schedule paused'); });
  sched('#ac-sched', 'sched.' + 'ac'); sched('#light-sched', 'sched.' + 'light');

  /* ----- lights ----- */
  const tempOf = (k) => D.temps.find((t) => t.k === k) || D.temps[0];
  $('#temps').innerHTML = D.temps.map((t) => `<button type="button" data-k="${t.k}" class="text-center text-[12px] text-muted"><span class="swatch block" style="background:${t.hex}"></span><span class="block mt-1.5">${t.name}</span></button>`).join('');
  $$('#temps [data-k]').forEach((b) => b.addEventListener('click', () => { const d = light(); update(d.id, { temp: +b.dataset.k }); drawLight(); }));
  $('#bri').addEventListener('input', (e) => { const d = light(); update(d.id, { brightness: +e.target.value, on: true }); drawLight(); syncPower(); });
  function drawLight() {
    const d = light(); if (!d) return; const t = tempOf(d.temp);
    $('#bri').value = d.brightness; $('#bri').style.setProperty('--p', d.brightness + '%');
    $('#bri-val').textContent = d.on ? d.brightness : 0; $('#light-name').textContent = d.name; $('#temp-label').textContent = `${t.name} · ${t.k}K`;
    $('#glow').style.background = `radial-gradient(circle, ${t.hex} 0, ${t.hex}88 38%, transparent 70%)`;
    $('#glow').style.opacity = d.on ? (0.25 + 0.75 * d.brightness / 100).toFixed(2) : 0;
    $('#bulb').style.color = d.on ? '' : 'rgb(var(--muted))';
    $$('#temps [data-k]').forEach((b) => b.querySelector('.swatch').setAttribute('aria-pressed', String(+b.dataset.k === d.temp)));
    const names = ['Ceiling', 'Floor lamp', 'Sofa strip', 'Reading lamp'].slice(0, d.lamps);
    const lamps = get('lamps.' + d.id, names.map(() => true));
    $('#lamps').innerHTML = names.map((n, i) => `<div class="bg-surface rounded-[18px] pl-4 pr-3 h-[56px] flex items-center justify-between gap-2">
      <span class="text-[14px] font-medium truncate">${n}</span><button type="button" class="switch" role="switch" data-lamp="${i}" aria-checked="${d.on && lamps[i] !== false}" aria-label="${n}"></button></div>`).join('');
    $$('#lamps [data-lamp]').forEach((b) => b.addEventListener('click', () => {
      const l = get('lamps.' + d.id, names.map(() => true)); const i = +b.dataset.lamp; l[i] = !(d.on && l[i] !== false); set('lamps.' + d.id, l);
      update(d.id, { on: l.some(Boolean) }); drawLight(); syncPower();
    }));
  }

  /* ----- power pill ----- */
  function syncPower() {
    const d = active(); $('#power').classList.toggle('opacity-40', !d);
    $('#power-label').textContent = d ? (d.on ? `Slide to turn off` : `Slide to turn on`) : 'No device';
    $('#power .knob').style.background = d && d.on ? '' : 'rgb(var(--muted))';
    const r = room(roomId), list = devices().filter((x) => x.room === roomId);
    $('#room-sub').textContent = `${list.length} devices · ${list.filter((x) => x.on).length} on`;
  }
  slidePill($('#power'), () => {
    const d = active(); if (!d) return; const nd = update(d.id, { on: !d.on }); toast(`${nd.name} ${nd.on ? 'on' : 'off'}`); render();
  });

  function render() {
    $$('#rooms [data-room]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.room === roomId)));
    $('#room-name').textContent = room(roomId).name; document.title = `Hearth · ${room(roomId).name}`;
    $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    $('#p-climate').classList.toggle('hidden', tab !== 'climate'); $('#p-lights').classList.toggle('hidden', tab !== 'lights');
    const a = ac(); $('#climate-none').classList.toggle('hidden', !!a); $('#climate-box').classList.toggle('hidden', !a);
    if (a) {
      const m = D.modes.find((x) => x.id === a.mode) || D.modes[0];
      $('#ac-name').textContent = a.name; $('#ac-status').textContent = a.on ? m.status : 'Off'; $('#ac-status').classList.toggle('on', a.on);
      $('#inside').textContent = D.climate.inside + '°'; drawDial(a.target, a.on);
      $$('#modes [data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === a.mode)));
      $$('#fan [data-fan]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.fan === a.fan)));
      $('#fan-label').textContent = FAN[a.fan - 1];
    }
    $('#ac-sched').setAttribute('aria-checked', String(get('sched.ac', true))); $('#light-sched').setAttribute('aria-checked', String(get('sched.light', true)));
    const l = light(); $('#lights-none').classList.toggle('hidden', !!l); $('#lights-box').classList.toggle('hidden', !l);
    if (l) drawLight();
    syncPower();
  }
  document.addEventListener('hearth:devices', () => syncPower());
  render();
  $('#rooms [aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
})();
