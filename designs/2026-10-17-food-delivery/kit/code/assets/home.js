/* Ember UI Kit · home.js — category chips, live search, sort, promo copy */
(() => {
  const { D, $, restCard, dishRow, toast } = Ember;
  let cat = 'all', q = '', sortByTime = false, showAll = false;
  const mins = (r) => parseInt(r.time, 10);

  $('#cats').innerHTML = D.categories.map((c) =>
    `<button type="button" class="cat" data-cat="${c.id}" aria-pressed="${c.id === cat}"><span class="disc">${icon(c.icon, 'text-[24px]')}</span>${c.label}</button>`).join('');

  function render() {
    const term = q.trim().toLowerCase();
    let rs = D.restaurants.filter((r) => (cat === 'all' || r.cat === cat) && (showAll || cat !== 'all' || term || r.popular));
    let ds = [];
    if (term) {
      ds = D.dishes.filter((d) => (d.name + ' ' + d.desc).toLowerCase().includes(term) && (cat === 'all' || Ember.rest(d.r).cat === cat));
      rs = rs.filter((r) => (r.name + ' ' + r.tags).toLowerCase().includes(term) || ds.some((d) => d.r === r.id));
    }
    if (sortByTime) rs = [...rs].sort((a, b) => mins(a) - mins(b));
    $('#grid').innerHTML = rs.map(restCard).join('');
    $('#empty').hidden = rs.length > 0 || ds.length > 0;
    $('#dish-wrap').hidden = ds.length === 0;
    $('#dishes').innerHTML = ds.map(dishRow).join('');
  }

  $('#cats').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    cat = b.dataset.cat;
    document.querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
  $('#search').addEventListener('input', (e) => { q = e.target.value; render(); });
  $('#search-form').addEventListener('submit', (e) => e.preventDefault());
  $('#filter').addEventListener('click', () => { sortByTime = !sortByTime; $('#filter').setAttribute('aria-pressed', String(sortByTime)); toast(sortByTime ? 'Sorted by fastest delivery' : 'Sorted by popularity'); render(); });
  $('#see-all').addEventListener('click', () => { showAll = !showAll; $('#see-all').textContent = showAll ? 'Show less' : 'See all'; render(); });
  $('#copy-code').addEventListener('click', async () => {
    localStorage.setItem('ember.promo', D.promo.code);
    try { await navigator.clipboard.writeText(D.promo.code); } catch (_) { /* clipboard needs https: still applied below */ }
    toast('EMBER30 copied · applied at checkout');
  });
  $('#bell').addEventListener('click', () => toast('Your order updates will show here'));
  $('#address').addEventListener('click', () => toast('Address picker: build it next!'));
  if (location.hash === '#search') setTimeout(() => $('#search').focus(), 50);
  render();
})();
