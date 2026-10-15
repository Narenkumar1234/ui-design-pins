/* Roam UI Kit · explore.js — category chips, search, big feature card + nearby grid */
(() => {
  const { $, $$, money, k, likeBtn, gridCard, toast } = Roam;
  let type = 'beaches', query = '';

  const feature = (d) => `
    <a href="detail.html?id=${d.id}" class="dest-card group relative block h-[300px] md:h-[380px] rounded-[24px] overflow-hidden shadow-card">
      <img src="${d.img}" alt="${d.name}, ${d.country}" class="absolute inset-0 w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"></div>
      <div class="absolute top-4 inset-x-4 flex items-center justify-between">
        <span class="glass rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">${icon('flame', 'text-[14px]')}${d.trending ? 'Trending' : d.badge}</span>
        ${likeBtn(d, 'glass w-10 h-10')}
      </div>
      <div class="absolute bottom-3 inset-x-3 glass-panel rounded-[20px] p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="flex items-center gap-1 text-xs text-muted truncate">${icon('pin', 'text-accent text-[13px]')}${d.area ? d.area + ', ' + d.country : d.country}</p>
          <span class="flex-none rounded-full bg-card/70 border border-line px-2.5 py-1 text-xs font-bold flex items-center gap-1">${icon('star', 'fill text-gold text-[13px]')}${d.rating} <span class="text-muted font-medium">(${k(d.reviews)})</span></span>
        </div>
        <p class="text-xl font-bold truncate mt-1">${d.name}</p>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-line/70">
          <p><b class="text-2xl font-extrabold">${money(d.price)}</b><span class="text-xs text-muted"> / person</span></p>
          <span class="w-10 h-10 rounded-full grad grid place-items-center">${icon('arrow-right', 'text-[18px]')}</span>
        </div>
      </div>
    </a>`;

  function render() {
    const q = query.trim().toLowerCase();
    const list = window.ROAM_DATA
      .filter((d) => (q ? `${d.name} ${d.country} ${d.type}`.toLowerCase().includes(q) : d.type === type))
      .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating);
    $('#feature').innerHTML = list[0] ? feature(list[0]) : '';
    $('#grid').innerHTML = list.slice(1).map(gridCard).join('');
    $('#empty').hidden = list.length > 0;
    $('#nearby').hidden = list.length < 2;
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('#chips [data-type]').forEach((c) => c.addEventListener('click', () => {
      type = c.dataset.type; query = ''; $('#search').value = '';
      $$('#chips [data-type]').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      render();
    }));
    $('#search').addEventListener('input', (e) => { query = e.target.value; render(); });
    $('#search-form').addEventListener('submit', (e) => e.preventDefault());
    $('#filters').addEventListener('click', () => toast('Filters sheet: add price + dates next'));
    $('#bell').addEventListener('click', () => toast('No new notifications'));
    render();
  });
})();
