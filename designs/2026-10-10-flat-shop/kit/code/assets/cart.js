/* Flat Shop UI Kit · cart.js: line items, qty steppers, remove, promo code, totals, checkout. */
(function cartPage() {
  const root = document.getElementById('cart');
  const box = 'rounded-xl border-2 border-ink dark:border-line bg-card';
  let promoMessage = '';   // feedback under the promo field

  function line(i) {
    const meta = [i.size, i.color && i.color[0].toUpperCase() + i.color.slice(1)].filter(Boolean).join(' · ');
    return `
      <li class="${box} p-3 flex items-center gap-3" data-key="${esc(i.key)}">
        <a href="product.html?id=${encodeURIComponent(i.id)}" class="tile tile-${i.color} w-16 h-16 shrink-0 rounded-lg border-2 border-ink dark:border-transparent grid place-items-center">
          ${shapeSVG(i.shape, 'w-3/5 h-3/5')}
        </a>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="font-bold leading-tight truncate">${esc(i.name)}</p>
            <button type="button" data-remove aria-label="Remove ${esc(i.name)}" class="text-muted hover:text-coral p-1 -m-1">${ICON.close}</button>
          </div>
          <p class="text-xs text-muted">${esc(meta)}</p>
          <div class="mt-1.5 flex items-center justify-between">
            <span class="font-display font-extrabold text-coral" data-line-total>${money(i.price * i.qty)}</span>
            <div class="flex items-center gap-1 rounded-lg border-2 border-ink dark:border-line bg-bg p-0.5">
              <button type="button" data-step="-1" aria-label="Decrease" class="w-7 h-7 rounded-md bg-card dark:bg-chip font-bold">−</button>
              <span class="w-6 text-center text-sm font-bold" data-qty>${i.qty}</span>
              <button type="button" data-step="1" aria-label="Increase" class="w-7 h-7 rounded-md bg-card dark:bg-chip font-bold">+</button>
            </div>
          </div>
        </div>
      </li>`;
  }

  function render() {
    const items = Cart.items();
    if (!items.length) {
      root.innerHTML = `
        <section class="${box} p-8 text-center max-w-md mx-auto">
          <div class="tile tile-yellow w-20 h-20 mx-auto rounded-xl border-2 border-ink dark:border-transparent grid place-items-center">${shapeSVG('tote', 'w-3/5 h-3/5')}</div>
          <h2 class="mt-4 font-display font-extrabold text-2xl">Your cart is empty</h2>
          <p class="mt-1 text-sm text-muted">Add something geometric.</p>
          <a href="index.html" class="mt-5 inline-flex h-12 px-6 items-center rounded-xl bg-coral text-on-coral font-bold border-2 border-ink dark:border-coral">Start shopping</a>
        </section>`;
      return;
    }
    const t = totals(items);
    const count = items.reduce((n, i) => n + i.qty, 0);
    root.innerHTML = `
      <p class="mb-3 text-sm font-semibold text-muted"><span id="item-count">${count}</span> item${count === 1 ? '' : 's'} in bag</p>
      <div class="md:grid md:grid-cols-[1fr_360px] md:gap-6 md:items-start">
        <div class="space-y-3">
          <!-- Free shipping progress -->
          <section class="rounded-xl border-2 border-ink dark:border-transparent ${t.shipping === 0 ? 'bg-green' : 'bg-yellow'} text-[#1C1B22] p-3 text-sm font-semibold">
            ${t.shipping === 0 ? 'Free shipping unlocked!' : `Add ${money(t.toFreeShipping)} more for free shipping`}
          </section>
          <ul id="lines" class="space-y-3">${items.map(line).join('')}</ul>
        </div>

        <aside class="mt-4 md:mt-0 space-y-3">
          <!-- Promo code -->
          <form id="promo" class="rounded-xl border-2 border-dashed border-ink dark:border-line p-3">
            <label for="promo-input" class="text-[11px] font-bold tracking-widest uppercase text-muted">Promo code</label>
            <div class="mt-2 flex gap-2">
              <input id="promo-input" value="${esc(t.code || '')}" placeholder="Try FLAT20" autocomplete="off"
                class="flex-1 min-w-0 h-11 px-3 rounded-lg border-2 border-ink dark:border-line bg-card dark:bg-chip text-sm font-semibold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-muted outline-none focus:border-coral">
              ${t.code
                ? '<button type="button" id="promo-remove" class="h-11 px-4 rounded-lg border-2 border-ink dark:border-line font-bold text-sm">Remove</button>'
                : '<button type="submit" class="h-11 px-4 rounded-lg bg-ink text-bg font-bold text-sm">Apply</button>'}
            </div>
            <p id="promo-msg" class="mt-2 text-xs font-semibold ${promoMessage.startsWith('✓') ? 'text-green' : 'text-coral'}">${esc(promoMessage)}</p>
          </form>

          <!-- Order summary -->
          <section class="${box} p-4 text-sm">
            <h3 class="font-display font-bold text-base mb-3">Order summary</h3>
            <dl class="space-y-2">
              <div class="flex justify-between"><dt class="text-muted">Subtotal</dt><dd id="sum-subtotal" class="font-semibold">${money(t.subtotal)}</dd></div>
              ${t.code ? `<div class="flex justify-between"><dt class="text-muted">Discount (${t.code})</dt><dd id="sum-discount" class="font-semibold text-green">−${money(t.discount)}</dd></div>` : ''}
              <div class="flex justify-between"><dt class="text-muted">Shipping</dt><dd id="sum-shipping" class="font-semibold">${t.shipping ? money(t.shipping) : 'Free'}</dd></div>
              <div class="flex justify-between items-baseline pt-3 mt-1 border-t-2 border-ink dark:border-line">
                <dt class="font-display font-extrabold text-base">Total</dt><dd id="sum-total" class="font-display font-extrabold text-2xl">${money(t.total)}</dd></div>
            </dl>
          </section>

          <button id="checkout" type="button" class="w-full h-14 rounded-xl bg-ink text-bg font-bold flex items-center justify-between px-5">
            <span>Checkout</span><span>${money(t.total)} →</span>
          </button>
        </aside>
      </div>`;
  }

  root.addEventListener('click', (e) => {
    const li = e.target.closest('[data-key]');
    if (li && e.target.closest('[data-remove]')) { Cart.remove(li.dataset.key); render(); return; }
    const step = e.target.closest('[data-step]');
    if (li && step) {
      const item = Cart.items().find((i) => i.key === li.dataset.key);
      Cart.setQty(li.dataset.key, item.qty + Number(step.dataset.step));
      render(); return;
    }
    if (e.target.closest('#promo-remove')) { removePromo(); promoMessage = ''; render(); return; }
    if (e.target.closest('#checkout')) {
      // Demo only: plug in your payment provider here.
      const { total } = totals();
      Cart.clear();
      root.innerHTML = `
        <section class="${box} p-8 text-center max-w-md mx-auto">
          <div class="tile tile-green w-20 h-20 mx-auto rounded-full border-2 border-ink dark:border-transparent grid place-items-center text-3xl font-extrabold text-white dark:text-[#14151B]">✓</div>
          <h2 class="mt-4 font-display font-extrabold text-2xl">Order placed!</h2>
          <p class="mt-1 text-sm text-muted">Demo checkout: ${money(total)} charged to nobody.</p>
          <a href="index.html" class="mt-5 inline-flex h-12 px-6 items-center rounded-xl bg-coral text-on-coral font-bold border-2 border-ink dark:border-coral">Keep shopping</a>
        </section>`;
    }
  });

  root.addEventListener('submit', (e) => {
    if (e.target.id !== 'promo') return;
    e.preventDefault();
    const code = document.getElementById('promo-input').value;
    promoMessage = applyPromo(code)
      ? `✓ ${getPromo()} applied: ${PROMO_CODES[getPromo()] * 100}% off`
      : 'That code is not valid';
    render();
  });

  render();
})();
