/* Roam UI Kit · home.js — chips filter, live search, featured cards + popular list */
(() => {
  const { $, $$, tallCard, listRow, toast } = Roam;
  let filter = 'all', query = '', sort = 'featured';
  const sorts = { featured: () => 0, price: (a, b) => a.price - b.price }; // featured = order in data.js

  function render() {
    const q = query.trim().toLowerCase();
    const list = window.ROAM_DATA
      .filter((d) => filter === 'all' || d.tags.includes(filter))
      .filter((d) => !q || `${d.name} ${d.country}`.toLowerCase().includes(q))
      .sort(sorts[sort]);
    $('#featured').innerHTML = list.slice(0, 6).map(tallCard).join('');
    $('#popular').innerHTML = (list.length > 2 ? list.slice(2, 6) : list).map(listRow).join(''); // skip the first two featured
    $('#empty').hidden = list.length > 0;
    $('#popular-wrap').hidden = list.length === 0;
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('#chips [data-filter]').forEach((c) => c.addEventListener('click', () => {
      filter = c.dataset.filter;
      $$('#chips [data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      render();
    }));
    $('#search').addEventListener('input', (e) => { query = e.target.value; render(); });
    $('#search-form').addEventListener('submit', (e) => e.preventDefault());
    $('#sort').addEventListener('click', () => {
      sort = sort === 'featured' ? 'price' : 'featured';
      toast(sort === 'price' ? 'Sorted by lowest price' : 'Sorted by featured'); render();
    });
    render();
  });
})();
