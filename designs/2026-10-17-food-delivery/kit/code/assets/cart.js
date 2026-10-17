/* Ember UI Kit · cart.js — line items with steppers, promo code, bill summary, payment choice, place order */
(() => {
  const { D, $, $$, dish, money, cart, setQty, totals, toast } = Ember;
  const PAY = [['card', 'Visa ••4242', 'card'], ['upi', 'UPI', 'phone'], ['cash', 'Cash', 'bag']];
  let pay = localStorage.getItem('ember.pay') || 'card';

  $('#pay').innerHTML = PAY.map(([id, label, ic]) => `
    <label class="cursor-pointer"><input type="radio" name="pay" value="${id}" class="peer sr-only" ${id === pay ? 'checked' : ''}>
      <span class="surface flex flex-col items-center gap-1.5 rounded-2xl py-3 text-xs font-semibold peer-checked:border-accent peer-checked:text-accent peer-checked:bg-soft/40 transition">${icon(ic, 'text-[19px]')}${label}</span></label>`).join('');
  $('#pay').addEventListener('change', (e) => { pay = e.target.value; localStorage.setItem('ember.pay', pay); });

  function render() {
    const c = cart(); const empty = c.length === 0;
    $('#full').hidden = empty; $('#place-bar').hidden = empty; $('#empty').hidden = !empty; $('#clear').hidden = empty;
    if (empty) return;
    const n = c.reduce((s, l) => s + l.qty, 0);
    $('#items-h').textContent = `${n} item${n === 1 ? '' : 's'}`;
    $('#items').innerHTML = c.map((l) => {
      const d = dish(l.dish);
      const note = d.extras.filter((e) => l.extras.includes(e.id)).map((e) => e.name).join(', ') || D.restaurants.find((r) => r.id === d.r).name;
      return `<li class="surface rounded-card p-2.5 flex items-center gap-3 shadow-soft">
        <img src="${d.img}" alt="${d.name}" class="w-16 h-16 rounded-2xl object-cover flex-none">
        <div class="flex-1 min-w-0"><p class="font-semibold truncate">${d.name}</p><p class="text-xs text-muted truncate">${note}</p><p class="mt-1 font-bold text-[14px]">${money(l.unit * l.qty)}</p></div>
        <div class="stepper scale-90 origin-right"><button type="button" data-dec="${l.key}" aria-label="Decrease ${d.name}">${l.qty === 1 ? icon('trash', 'text-[15px]') : '−'}</button><output>${l.qty}</output><button type="button" data-inc="${l.key}" aria-label="Increase ${d.name}">+</button></div>
      </li>`;
    }).join('');
    const t = totals();
    $('#sub').textContent = money(t.sub);
    $('#fee').innerHTML = t.delivery ? money(t.delivery) : '<span class="text-leaf">Free</span>';
    $('#disc-row').hidden = !t.applied; $('#disc').textContent = '−' + money(t.discount); $('#disc-code').textContent = D.promo.code;
    $('#total').textContent = money(t.total); $('#place-total').textContent = money(t.total);
    if (t.applied) { $('#promo').value = D.promo.code; $('#promo-msg').innerHTML = `<b class="text-accent">${D.promo.code} applied</b> · you save ${money(t.discount)}`; }
  }

  $('#items').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    const line = (key) => cart().find((l) => l.key === key);
    if (inc) setQty(inc.dataset.inc, line(inc.dataset.inc).qty + 1);
    if (dec) { const l = line(dec.dataset.dec); setQty(l.key, l.qty - 1); if (l.qty === 1) toast(`Removed ${dish(l.dish).name}`); }
    render();
  });
  $('#promo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = $('#promo').value.trim().toUpperCase();
    if (code === D.promo.code) { localStorage.setItem('ember.promo', code); toast('Promo applied'); }
    else { localStorage.removeItem('ember.promo'); $('#promo-msg').innerHTML = `<span class="text-accent">“${code || ' '}” isn't a valid code.</span> Try ${D.promo.code}.`; }
    render();
  });
  $('#clear').addEventListener('click', () => { localStorage.removeItem('ember.cart'); Ember.updateBadges(); render(); toast('Cart cleared'); });
  $('#change').addEventListener('click', () => toast('Address picker: build it next!'));
  $('#place').addEventListener('click', () => {
    const t = totals();
    const order = { id: 'EM' + String(Date.now()).slice(-5), placed: Date.now(), items: cart(), total: t.total, pay };
    localStorage.setItem('ember.order', JSON.stringify(order));
    localStorage.removeItem('ember.cart'); localStorage.removeItem('ember.promo');
    location.href = 'track.html';
  });
  render();
})();
