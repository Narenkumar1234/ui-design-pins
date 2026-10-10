/* ==========================================================================
   Flat Shop UI Kit · app.js  (shared by every page)
   - Products: loads data/products.json (falls back to window.PRODUCTS)
   - Cart store: add / update qty / remove, saved in localStorage
   - Promo codes + totals (FLAT20 = 20% off)
   - Theme toggle, header cart badge, toast, product shape SVGs
   No build step and no framework: plain ES2017 you can read top to bottom.
   ========================================================================== */

const CART_KEY = 'flatshop.cart';
const PROMO_KEY = 'flatshop.promo';
const THEME_KEY = 'flatshop.theme';

const PROMO_CODES = { FLAT20: 0.20 };   // code -> discount rate. Add your own here.
const FREE_SHIPPING_MIN = 50;           // free shipping when (subtotal - discount) >= this
const SHIPPING_FEE = 5;

/* ---------- Products ---------- */
// To use the Fake Store API instead, swap the URL for
// 'https://fakestoreapi.com/products' and map its fields (see README).
async function loadProducts() {
  // Opened by double-click (file://)? Browsers block fetch there, so use the JS copy.
  if (location.protocol === 'file:') return window.PRODUCTS || [];
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    // Network/server problem: fall back to the bundled copy.
    return window.PRODUCTS || [];
  }
}

/* ---------- Money ---------- */
const money = (n) => '$' + n.toFixed(2).replace(/\.00$/, '');

/* ---------- Cart store ---------- */
const Cart = {
  items() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
  },
  // Same product + size + color = one line in the cart.
  key: (id, size, color) => [id, size || '-', color || '-'].join('|'),
  add(product, { qty = 1, size = null, color = null } = {}) {
    const items = this.items();
    const key = this.key(product.id, size, color);
    const line = items.find((i) => i.key === key);
    if (line) line.qty += qty;
    else items.push({ key, id: product.id, name: product.name, price: product.price,
                      shape: product.shape, color: color || product.color, size, qty });
    this.save(items);
  },
  setQty(key, qty) {
    let items = this.items();
    if (qty <= 0) items = items.filter((i) => i.key !== key);   // stepping below 1 removes it
    else items.forEach((i) => { if (i.key === key) i.qty = qty; });
    this.save(items);
  },
  remove(key) { this.save(this.items().filter((i) => i.key !== key)); },
  clear() { this.save([]); localStorage.removeItem(PROMO_KEY); },
  count() { return this.items().reduce((n, i) => n + i.qty, 0); },
};

/* ---------- Promo + totals ---------- */
function getPromo() { return localStorage.getItem(PROMO_KEY); }
function applyPromo(code) {
  const clean = (code || '').trim().toUpperCase();
  if (!PROMO_CODES[clean]) return false;
  localStorage.setItem(PROMO_KEY, clean);
  return true;
}
function removePromo() { localStorage.removeItem(PROMO_KEY); }

function totals(items = Cart.items()) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const code = getPromo();
  const rate = PROMO_CODES[code] || 0;
  const discount = Math.round(subtotal * rate * 100) / 100;
  const afterDiscount = subtotal - discount;
  const shipping = items.length === 0 || afterDiscount >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return { subtotal, discount, code: rate ? code : null, shipping,
           total: Math.round((afterDiscount + shipping) * 100) / 100,
           toFreeShipping: Math.max(0, FREE_SHIPPING_MIN - afterDiscount) };
}

/* ---------- Theme ---------- */
function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

/* ---------- UI helpers ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = n;
    el.classList.toggle('hidden', n === 0);
  });
}

let toastTimer;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.className = 'toast hide fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-8 z-50 ' +
      'bg-ink text-bg font-semibold text-sm px-4 py-3 rounded-xl';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('hide');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hide'), 1800);
}

// Escape text before putting it into innerHTML.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Product shapes (flat SVG "photos") ---------- */
// .fg = shape color, .cut = detail in the tile color. Colors come from styles.css.
const SHAPES = {
  tote: `<path class="fg" d="M36 40V27a14 14 0 0 1 28 0v13h-7V27a7 7 0 0 0-14 0v13z"/>
         <path class="fg" d="M22 40h56l-5 44H27z"/><rect class="cut" x="38" y="56" width="24" height="16" rx="2"/>`,
  orb:   `<circle class="fg" cx="50" cy="52" r="32"/><circle class="cut" cx="50" cy="52" r="16"/>
         <circle class="fg" cx="50" cy="52" r="7"/>`,
  lamp:  `<path class="fg" d="M50 16 84 72H16z"/><rect class="fg" x="30" y="78" width="40" height="8" rx="4"/>
         <circle class="cut" cx="50" cy="56" r="6"/>`,
  clock: `<rect class="fg" x="27" y="27" width="46" height="46" rx="6" transform="rotate(45 50 50)"/>
         <path class="cut" d="M48 34h4v18h-4z"/><path class="cut" d="M50 48h14v4H50z"/>`,
  arc:   `<path class="fg-stroke" d="M24 62V50a26 26 0 0 1 52 0v12" stroke-width="8" stroke-linecap="round"/>
         <rect class="fg" x="16" y="56" width="18" height="28" rx="7"/><rect class="fg" x="66" y="56" width="18" height="28" rx="7"/>`,
  mug:   `<rect class="fg" x="22" y="30" width="44" height="50" rx="8"/>
         <circle class="fg-stroke" cx="70" cy="52" r="11" stroke-width="7"/><rect class="cut" x="30" y="40" width="28" height="5" rx="2"/>`,
};
function shapeSVG(shape, sizeClass = 'w-1/2 h-1/2') {
  return `<svg viewBox="0 0 100 100" class="${sizeClass}" aria-hidden="true">${SHAPES[shape] || SHAPES.orb}</svg>`;
}

/* ---------- Icons (inline SVG, no icon font needed) ---------- */
const ICON = {
  cart: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  sun: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  back: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  home: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 10l8-6 8 6v10H4z"/><path d="M10 20v-6h4v6"/></svg>',
  close: '<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>',
};

/* ---------- Shared header + bottom nav ---------- */
// Each page has <header id="site-header" data-title="..." data-back="index.html">
function renderChrome() {
  const header = document.getElementById('site-header');
  if (header) {
    const back = header.dataset.back;
    const title = header.dataset.title || 'FLAT SHOP';
    header.className = 'sticky top-0 z-30 bg-bg border-b-2 border-ink dark:border-line';
    header.innerHTML = `
      <div class="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        ${back
          ? `<a href="${back}" aria-label="Back" class="w-10 h-10 grid place-items-center rounded-xl border-2 border-ink dark:border-line bg-card">${ICON.back}</a>`
          : `<a href="index.html" class="font-display font-extrabold text-lg tracking-tight">FLAT<span class="text-coral">SHOP</span></a>`}
        ${back ? `<h1 class="font-display font-bold text-lg">${esc(title)}</h1>` : ''}
        <div class="flex items-center gap-2">
          <button type="button" data-theme-toggle aria-label="Toggle dark mode"
            class="w-10 h-10 grid place-items-center rounded-xl border-2 border-ink dark:border-line bg-card">
            <span class="dark:hidden">${ICON.moon}</span><span class="hidden dark:inline">${ICON.sun}</span>
          </button>
          <a href="cart.html" aria-label="Cart" class="relative w-10 h-10 grid place-items-center rounded-xl border-2 border-ink dark:border-line bg-card">
            ${ICON.cart}
            <span data-cart-count class="hidden absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-coral text-on-coral text-[11px] font-bold grid place-items-center">0</span>
          </a>
        </div>
      </div>`;
  }
  // Mobile bottom nav (hidden on md+ screens)
  const nav = document.getElementById('bottom-nav');
  if (nav) {
    const page = document.body.dataset.page;
    const item = (href, icon, label, active) => `
      <a href="${href}" class="relative flex flex-col items-center gap-0.5 text-[11px] font-semibold ${active ? 'text-coral' : 'text-muted'}">
        ${icon}<span>${label}</span>
        ${label === 'Cart' ? '<span data-cart-count class="hidden absolute -top-1 right-0 translate-x-2 min-w-4 h-4 px-1 rounded-full bg-coral text-on-coral text-[10px] font-bold grid place-items-center">0</span>' : ''}
      </a>`;
    nav.className = 'md:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-card border-t-2 border-ink dark:border-line flex justify-around items-center';
    nav.innerHTML = item('index.html', ICON.home, 'Shop', page === 'home') +
                    item('index.html#search', ICON.search, 'Search', false) +
                    item('cart.html', ICON.cart, 'Cart', page === 'cart');
  }
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', renderChrome);
// Keep badges in sync if the cart changes in another tab.
window.addEventListener('storage', (e) => { if (e.key === CART_KEY) updateCartBadge(); });
