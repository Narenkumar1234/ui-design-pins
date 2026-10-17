/* Ember UI Kit · dish.js — dish.html?id=tofu-bowl : extras, quantity stepper, live total, add to cart */
(() => {
  const { D, $, $$, dish, rest, money, stars, add, likeBtn, toast, unitPrice } = Ember;
  const d = dish(new URLSearchParams(location.search).get('id')) || D.dishes[0];
  const r = rest(d.r);
  let qty = 1;
  document.title = `Ember · ${d.name}`;
  $('#hero').src = d.cut || d.img; $('#hero').alt = `${d.name}, overhead`;
  $('#rest').textContent = r.name; $('#rest').href = `restaurant.html?id=${r.id}`; $('#back').href = `restaurant.html?id=${r.id}`;
  $('#name').textContent = d.name; $('#price').textContent = money(d.price); $('#desc').textContent = d.desc;
  $('#like-slot').innerHTML = likeBtn(d.id, d.name, 'w-10 h-10 surface');
  $('#meta').innerHTML = `<span class="pill">${stars(d.rating, d.reviews)}</span><span class="pill">${icon('clock', 'text-accent text-[14px]')}${d.time}</span><span class="pill">${icon('flame', 'text-accent text-[14px]')}${d.kcal} kcal</span>`;
  $('#extras-wrap').hidden = !d.extras.length;
  $('#extras').innerHTML = d.extras.map((e) => `
    <label class="surface rounded-2xl p-2.5 pr-4 flex items-center gap-3 cursor-pointer hover:border-accent/40 transition">
      <img src="${e.img}" alt="" class="w-11 h-11 rounded-full object-cover">
      <span class="flex-1 text-[14px] font-semibold">${e.name}</span>
      <span class="text-[13px] text-muted mr-1">+${money(e.price)}</span>
      <input type="checkbox" class="sr-only" value="${e.id}" ${e.on ? 'checked' : ''}><span class="check">${icon('check', 'text-[14px]')}</span>
    </label>`).join('');

  const chosen = () => $$('#extras input:checked').map((i) => i.value);
  function update() {
    $('#qty').textContent = qty; $('#minus').disabled = qty <= 1;
    $('#btn-total').textContent = money(unitPrice(d, chosen()) * qty);
  }
  $('#extras').addEventListener('change', update);
  $('#minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); update(); });
  $('#plus').addEventListener('click', () => { qty = Math.min(20, qty + 1); update(); });
  $('#add').addEventListener('click', () => {
    add(d.id, qty, chosen());
    toast(`Added ${qty} × ${d.name}`);
    $('#add').innerHTML = `${icon('check', 'text-[18px] inline -mt-0.5')} Added · <a href="cart.html" class="underline">View cart</a>`;
    setTimeout(() => { $('#add').innerHTML = 'Add to cart · <span id="btn-total"></span>'; qty = 1; update(); }, 1800);
  });
  update();
})();
