/* Flat Shop UI Kit · product.js: product detail with size/color pickers, qty, Add to cart.
   URL: product.html?id=canvas-tote */
(async function productPage() {
  const products = await loadProducts();
  const id = new URLSearchParams(location.search).get('id');
  const p = products.find((x) => x.id === id) || products[0];
  const root = document.getElementById('product');
  const state = { size: p.sizes[1] || p.sizes[0] || null, color: p.color, qty: 1 };
  document.title = `Flat Shop · ${p.name}`;

  const COLOR_NAMES = { yellow: 'Mustard Yellow', blue: 'Cobalt Blue', green: 'Fern Green', coral: 'Coral' };
  const box = 'rounded-xl border-2 border-ink dark:border-line bg-card';

  function render() {
    root.innerHTML = `
      <div class="md:grid md:grid-cols-2 md:gap-8 md:items-start">
        <!-- Hero tile -->
        <section>
          <div id="hero" class="tile tile-${state.color} relative aspect-[4/3] md:aspect-square rounded-xl border-2 border-ink dark:border-transparent grid place-items-center">
            <span class="absolute top-3 left-3 text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-[#1C1B22] text-white">${esc(p.category.toUpperCase())}</span>
            <span class="absolute top-3 right-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#1C1B22] border-2 border-[#1C1B22]">
              <span class="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>In stock</span>
            ${shapeSVG(p.shape, 'w-1/2 h-1/2 md:w-3/5 md:h-3/5')}
          </div>
        </section>

        <div class="mt-4 md:mt-0 space-y-4">
          <!-- Title + price -->
          <section class="${box} p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold tracking-widest uppercase text-muted">${esc(p.category)}</p>
                <h2 class="font-display font-extrabold text-2xl md:text-3xl leading-tight">${esc(p.name)}</h2>
              </div>
              <p class="font-display font-extrabold text-2xl md:text-3xl text-coral">${money(p.price)}</p>
            </div>
            <p class="mt-2 text-sm text-muted"><span class="font-bold text-ink">★ ${p.rating}</span> · ${p.reviews} reviews</p>
            <p class="mt-3 text-sm leading-relaxed">${esc(p.description)}</p>
          </section>

          ${p.sizes.length ? `
          <!-- Size picker -->
          <section class="${box} p-4">
            <h3 class="font-bold text-sm mb-3">Select size</h3>
            <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
              ${p.sizes.map((s) => `
                <button type="button" role="radio" aria-checked="${s === state.size}" data-size="${esc(s)}"
                  class="min-w-12 h-11 px-3 rounded-xl border-2 font-semibold text-sm
                  ${s === state.size ? 'bg-ink text-bg border-ink dark:bg-coral dark:text-on-coral dark:border-coral'
                                     : 'bg-card border-ink dark:border-line dark:bg-chip'}">${esc(s)}</button>`).join('')}
            </div>
          </section>` : ''}

          <!-- Color picker -->
          <section class="${box} p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-sm">Color: ${COLOR_NAMES[state.color] || state.color}</h3>
            </div>
            <div class="flex gap-3" role="radiogroup" aria-label="Color">
              ${p.colors.map((c) => `
                <button type="button" role="radio" aria-checked="${c === state.color}" data-color="${c}" aria-label="${COLOR_NAMES[c] || c}"
                  class="w-11 h-11 rounded-full p-1 border-2 ${c === state.color ? 'border-ink' : 'border-transparent'}">
                  <span class="tile-${c} block w-full h-full rounded-full border-2 border-ink dark:border-transparent"></span>
                </button>`).join('')}
            </div>
          </section>

          <!-- Qty + Add to cart: sticky bar on mobile, inline on desktop -->
          <section class="fixed md:static bottom-0 inset-x-0 z-20 bg-card md:bg-transparent border-t-2 md:border-0 border-ink dark:border-line p-3 md:p-0">
            <div class="max-w-6xl mx-auto flex items-center gap-3">
              <div class="flex items-center gap-1 h-12 px-1 rounded-xl border-2 border-ink dark:border-line bg-bg">
                <button type="button" data-qty="-1" aria-label="Decrease quantity" class="w-9 h-9 rounded-lg bg-card dark:bg-chip font-bold text-lg">−</button>
                <span id="qty" class="w-8 text-center font-bold" aria-live="polite">${state.qty}</span>
                <button type="button" data-qty="1" aria-label="Increase quantity" class="w-9 h-9 rounded-lg bg-card dark:bg-chip font-bold text-lg">+</button>
              </div>
              <button id="add" type="button" class="flex-1 h-12 rounded-xl bg-coral text-on-coral font-bold border-2 border-ink dark:border-coral flex items-center justify-center gap-2">
                Add to cart <span class="text-xs font-extrabold px-2 py-0.5 rounded bg-[#1C1B22] text-white">${money(p.price * state.qty)}</span>
              </button>
            </div>
          </section>
        </div>
      </div>`;
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.size) state.size = t.dataset.size;
    else if (t.dataset.color) state.color = t.dataset.color;
    else if (t.dataset.qty) state.qty = Math.min(99, Math.max(1, state.qty + Number(t.dataset.qty)));
    else if (t.id === 'add') {
      Cart.add(p, { qty: state.qty, size: state.size, color: state.color });
      toast(`${state.qty} × ${p.name} added to cart`);
      return;
    } else return;
    render();
  });

  render();
})();
