/* Ember UI Kit · icons.js — inline SVG sprite (24×24 rounded stroke icons).
   HTML: <svg class="icon"><use href="#i-search"/></svg>   ·   JS: icon('search', 'text-[18px]') */
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 20Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    receipt: '<path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    chevdown: '<path d="m6 9 6 6 6-6"/>',
    chevleft: '<path d="m15 18-6-6 6-6"/>',
    chevright: '<path d="m9 18 6-6-6-6"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9Z"/>',
    clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6.5-4-10-2.5 2-3 4.5-3 6-1-1-1.6-2-1.8-3.5C8 9.5 5 12 5 15c0 4.3 3 7 7 7Z"/>',
    pin: '<path d="M19.5 10c0 5.6-7.5 11.5-7.5 11.5S4.5 15.6 4.5 10a7.5 7.5 0 0 1 15 0Z"/><circle cx="12" cy="10" r="2.6"/>',
    bag: '<path d="M5 8h14l-1.2 12.1a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    tag: '<path d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h3"/>',
    phone: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L8 10.9a16 16 0 0 0 5.1 5.1l1.4-1.4a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z"/>',
    chat: '<path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.4A8.5 8.5 0 1 1 21 12Z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    burger: '<path d="M4 10a8 6 0 0 1 16 0Z"/><path d="M3 13.5h18M5 17h14a1 1 0 0 1 0 0 3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"/>',
    pizza: '<path d="M12 21 3.5 5.5A15 15 0 0 1 20.5 5.5Z"/><path d="M4.8 8a13 13 0 0 1 14.4 0"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="13.5" r="1"/><circle cx="12" cy="17" r=".8"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M8 20h8M14 7.5c1.5-1.5 3-1.8 5-1.5M10 8 8.5 3.5M12 8V3"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-15-1 10-6 15-15 15Z"/><path d="M5 19 13 11"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    scooter: '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 17h7M15 6h3l2.5 8.5M12 17l-1-6h-6M5 8h5"/>',
    chef: '<path d="M7 14.5A4 4 0 0 1 6.5 6.6a5.5 5.5 0 0 1 11 0A4 4 0 0 1 17 14.5V20H7Z"/><path d="M7 17h10"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${Object.entries(P).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${d}</symbol>`).join('')}</svg>`;
  document.body.insertAdjacentHTML('afterbegin', svg);
  window.icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
})();
