/* Flat Shop UI Kit · home.js: search, category chips, product grid, quick add. */
(async function home() {
  const products = await loadProducts();
  const grid = document.getElementById('grid');
  const chips = document.getElementById('chips');
  const search = document.getElementById('search-input');
  const state = { category: 'All', query: '' };

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  function renderChips() {
    chips.innerHTML = categories.map((c) => {
      const on = c === state.category;
      return `<button type="button" data-cat="${esc(c)}" aria-pressed="${on}"
        class="shrink-0 px-4 h-9 rounded-xl border-2 text-sm font-semibold
        ${on ? 'bg-ink text-bg border-ink dark:bg-coral dark:text-on-coral dark:border-coral'
             : 'bg-card border-ink dark:border-line'}">${esc(c)}</button>`;
    }).join('');
  }

  function card(p) {
    return `
      <article class="rounded-xl border-2 border-ink dark:border-line bg-card p-3 flex flex-col">
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="tile tile-${p.color} aspect-square rounded-lg border-2 border-ink dark:border-transparent grid place-items-center">
          ${shapeSVG(p.shape)}
        </a>
        <p class="mt-3 text-[11px] font-bold tracking-wider uppercase text-muted">${esc(p.category)}</p>
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="font-semibold leading-tight hover:text-coral">${esc(p.name)}</a>
        <div class="mt-auto pt-3 flex items-center justify-between">
          <span class="font-display font-extrabold text-coral dark:text-coral">${money(p.price)}</span>
          <button type="button" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)} to cart"
            class="w-8 h-8 rounded-lg bg-ink text-bg font-bold text-lg leading-none grid place-items-center dark:bg-chip dark:text-ink">+</button>
        </div>
      </article>`;
  }

  function renderGrid() {
    const q = state.query.trim().toLowerCase();
    const list = products.filter((p) =>
      (state.category === 'All' || p.category === state.category) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
    grid.innerHTML = list.map(card).join('');
    document.getElementById('empty').classList.toggle('hidden', list.length > 0);
    document.getElementById('result-count').textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
  }

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderChips(); renderGrid();
  });
  search.addEventListener('input', () => { state.query = search.value; renderGrid(); });

  // Quick add: first size, default color.
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const p = products.find((x) => x.id === btn.dataset.add);
    Cart.add(p, { size: p.sizes[0] || null, color: p.color });
    toast(`${p.name} added to cart`);
  });

  document.getElementById('claim').addEventListener('click', () => {
    applyPromo('FLAT20');
    toast('FLAT20 applied: 20% off at checkout');
  });

  if (location.hash === '#search') search.focus();
  renderChips(); renderGrid();
})();
