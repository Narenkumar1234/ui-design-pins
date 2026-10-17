/* Ember UI Kit · track.js — simulated live tracking. A real app would poll an API or use WebSockets.
   Demo timeline (seconds after placing): 0 confirmed → 6 preparing → 16 on the way (courier moves) → 60 delivered. */
(() => {
  const { $, dish, money, toast } = Ember;
  let order = JSON.parse(localStorage.getItem('ember.order') || 'null');
  if (!order) { // opened directly: show a demo order that is already on the way
    order = { id: 'EM24816', placed: Date.now() - 30000, total: 22.75, demo: true,
      items: [{ dish: 'tofu-bowl', qty: 1, unit: 16 }, { dish: 'margherita', qty: 1, unit: 12 }, { dish: 'matcha', qty: 1, unit: 4.5 }] };
    $('#demo-note').hidden = false;
  }
  const STEPS = [['Order confirmed', 'Harvest Bowl Co. got your order', 'check', 0], ['Preparing your food', 'The kitchen is cooking it fresh', 'chef', 6], ['On the way', 'Ravi is riding to you', 'scooter', 16], ['Delivered', 'Enjoy your meal!', 'home', 60]];
  const TOTAL = 60, ETA_MIN = 28;
  $('#oid').textContent = '#' + order.id;
  $('#sum').innerHTML = order.items.map((l) => `<li class="flex justify-between"><span>${l.qty} × ${dish(l.dish).name}</span><span>${money(l.unit * l.qty)}</span></li>`).join('');
  $('#sum-total').textContent = money(order.total);

  const route = $('#route'), done = $('#route-done'), courier = $('#courier');
  const len = route.getTotalLength();
  done.style.strokeDasharray = `${len}`;
  let delivered = false;
  function tick() {
    const s = (Date.now() - order.placed) / 1000;
    const stage = STEPS.filter((x) => s >= x[3]).length - 1;
    $('#steps').innerHTML = STEPS.map(([t, sub, ic], i) => `
      <li class="step flex items-center gap-3" data-state="${i < stage || stage === 3 ? 'done' : i === stage ? 'now' : 'todo'}">
        <span class="dot w-9 h-9 rounded-full border-2 border-line grid place-items-center text-muted flex-none">${icon(ic, 'text-[16px]')}</span>
        <span><span class="t block text-[14px] font-semibold">${t}</span><span class="block text-xs text-muted">${sub}</span></span></li>`).join('');
    $('#status').textContent = STEPS[stage][0];
    const ride = Math.min(1, Math.max(0, (s - 16) / (TOTAL - 16)));
    const p = route.getPointAtLength(ride * len);
    courier.setAttribute('transform', `translate(${p.x} ${p.y})`);
    done.style.strokeDashoffset = `${len * (1 - ride)}`;
    $('#bar').style.width = `${Math.max(5, Math.min(100, (s / TOTAL) * 100))}%`;
    $('#eta').textContent = Math.max(0, Math.ceil(ETA_MIN * (1 - s / TOTAL)));
    if (stage === 3 && !delivered) { delivered = true; toast('Delivered! Enjoy your meal'); }
  }
  tick(); const timer = setInterval(() => { tick(); if (delivered) clearInterval(timer); }, 1000);
  $('#call').addEventListener('click', () => toast('Calling Ravi… (demo)'));
  $('#chat').addEventListener('click', () => toast('Chat: build it next!'));
})();
