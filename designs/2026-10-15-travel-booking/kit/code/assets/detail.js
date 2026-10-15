/* Roam UI Kit · detail.js — destination detail: hero gallery, facilities, read more, booking sheet */
(() => {
  const { $, $$, money, k, byId, toast } = Roam;
  const id = new URLSearchParams(location.search).get('id') || 'braies';
  const d = byId(id) || byId('braies');
  let guests = 2;

  function fill() {
    document.title = `Roam · ${d.name}`;
    $('#hero').src = d.img; $('#hero').alt = `${d.name}, ${d.country}`;
    $('#badge').textContent = d.badge;
    $('#name').textContent = d.name;
    $('#country').textContent = d.country;
    $('#rating').textContent = d.rating;
    $('#reviews').textContent = `(${k(d.reviews)} reviews)`;
    $('#days').textContent = `${d.days} days`;
    $('#about').textContent = d.about;
    $('#price').textContent = money(d.price);
    $('#incl').hidden = !d.allInclusive;
    $('#like').dataset.like = d.id; $('#like').setAttribute('aria-pressed', String(Roam.isFav(d.id)));
    // thumbnails: use gallery, pad with other destinations' photos
    const pics = [...new Set([...d.gallery, ...window.ROAM_DATA.filter((x) => x.id !== d.id).map((x) => x.img)])].slice(0, 3);
    $('#thumbs').innerHTML = pics.map((p, i) =>
      `<button type="button" data-pic="${p}" class="w-11 h-11 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-white' : 'border-transparent'}" aria-label="Show photo ${i + 1}"><img src="${p}" alt="" class="w-full h-full object-cover"></button>`).join('');
    $('#facilities').innerHTML = window.ROAM_FACILITIES.map((f) => `
      <li class="flex flex-col items-center gap-2 rounded-2xl bg-soft border border-accent/10 py-3.5 px-1 text-center">
        <span class="w-10 h-10 rounded-full bg-card grid place-items-center text-accent shadow-soft">${icon(f.icon, 'text-[19px]')}</span>
        <span class="text-[11px] font-semibold leading-tight">${f.label}</span></li>`).join('');
  }
  function total() { $('#g-count').textContent = guests; $('#g-total').textContent = money(d.price * guests); $('#g-minus').disabled = guests <= 1; }

  document.addEventListener('DOMContentLoaded', () => {
    fill();
    $('#thumbs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pic]'); if (!b) return;
      $('#hero').src = b.dataset.pic;
      $$('#thumbs [data-pic]').forEach((x) => x.classList.toggle('border-white', x === b));
      $$('#thumbs [data-pic]').forEach((x) => x.classList.toggle('border-transparent', x !== b));
    });
    $('#more').addEventListener('click', () => {
      const open = $('#about').classList.toggle('line-clamp-3') === false;
      $('#more').firstChild.textContent = open ? 'Show less ' : 'Read more ';
      $('#more').setAttribute('aria-expanded', String(open));
    });
    $('#back').addEventListener('click', () => (history.length > 1 ? history.back() : (location.href = 'index.html')));
    $('#share').addEventListener('click', async () => {
      try { if (navigator.share) await navigator.share({ title: d.name, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast('Link copied'); } }
      catch { toast('Link ready to share'); }
    });
    // booking sheet
    const sheet = $('#sheet');
    const today = new Date(); const iso = (x) => x.toISOString().slice(0, 10);
    const start = new Date(today); start.setDate(start.getDate() + 14);
    const end = new Date(start); end.setDate(end.getDate() + d.days);
    $('#from').value = iso(start); $('#to').value = iso(end); $('#from').min = iso(today); $('#to').min = iso(start);
    $('#from').addEventListener('change', () => { $('#to').min = $('#from').value; if ($('#to').value < $('#from').value) $('#to').value = $('#from').value; });
    $('#sheet-title').textContent = `Book ${d.name}`;
    $('#book').addEventListener('click', () => { total(); sheet.showModal(); });
    $('#g-minus').addEventListener('click', () => { guests = Math.max(1, guests - 1); total(); });
    $('#g-plus').addEventListener('click', () => { guests = Math.min(8, guests + 1); total(); });
    $('#sheet-close').addEventListener('click', () => sheet.close());
    $('#sheet-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const trips = JSON.parse(localStorage.getItem('roam.trips') || '[]');
      trips.push({ id: d.id, from: $('#from').value, to: $('#to').value, guests, total: d.price * guests });
      localStorage.setItem('roam.trips', JSON.stringify(trips));
      sheet.close(); toast(`Booked! ${guests} ${guests === 1 ? 'guest' : 'guests'} · ${d.name}`);
    });
  });
})();
