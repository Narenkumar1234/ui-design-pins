# Flat Shop UI Kit

A flat-design e-commerce mini app for students and beginner front-end devs:
**Home → Product detail → Cart**, in **light and dark mode**, built with plain
**HTML + Tailwind CSS + vanilla JavaScript**. It isn't only a mockup: the cart,
promo code and theme toggle all work.

Made by **@code.in.30s**. Screens designed with Google Stitch, then rebuilt by hand
as clean, commented code.

---

## What's included

| | |
|---|---|
| **3 pages × 2 themes = 6 screens** | `index.html` (home), `product.html` (detail), `cart.html` (cart), each in light + dark |
| **Light / dark toggle** | Tailwind class-based `dark:` variants, choice saved in `localStorage`, respects the OS setting on first visit |
| **Working cart** | add to cart, quantity steppers, remove, line totals, cart badge, all saved in `localStorage` |
| **Promo code** | `FLAT20` = 20% off (add your own codes in one line) |
| **Order summary** | subtotal, discount, free shipping over $50 (otherwise $5), total, demo checkout |
| **Home** | search, category chips, product grid, promo banner ("Claim" applies FLAT20) |
| **Product detail** | size picker, color picker (recolors the product), qty stepper, sticky mobile "Add to cart" bar |
| **Product data** | local `data/products.json` (6 products), so it works without an API |
| **Responsive** | phone → tablet → desktop (2/3/4-column grid, sidebar summary on desktop) |
| **design/** | 12 reference screenshots (mobile + desktop, light + dark) |

No build tools, no npm, no framework.

---

## How to open it

**Option A: double-click (fastest).**
Open `code/index.html` in Chrome, Edge, Firefox or Safari. Everything works.
(Browsers block `fetch()` on `file://`, so the app automatically uses
`data/products.js`, a copy of `products.json`.)

**Option B: run a tiny local server (recommended while you edit).**
```bash
cd code
python3 -m http.server 5500      # then open http://localhost:5500
# or: npx serve .
# or: VS Code → "Live Server" extension → Open with Live Server
```
With a server the app loads `data/products.json` directly.

> Tailwind and the Google Fonts are loaded from a CDN, so you need an internet
> connection the first time a page loads.

---

## File structure

```
flat-shop-ui-kit/
├─ code/
│  ├─ index.html        Home: greeting, search, category chips, product grid, promo banner
│  ├─ product.html      Product detail (product.html?id=canvas-tote)
│  ├─ cart.html         Cart: line items, steppers, promo code, order summary, checkout
│  ├─ assets/
│  │  ├─ theme.js       Tailwind config + applies saved theme before paint (no flash)
│  │  ├─ styles.css     PALETTE (CSS variables for light + dark) + tiny helpers
│  │  ├─ app.js         Shared: product loading, Cart store, promo/totals, header, toast, SVG shapes
│  │  ├─ home.js        Home page logic
│  │  ├─ product.js     Product page logic
│  │  └─ cart.js        Cart page logic
│  └─ data/
│     ├─ products.json  Your product catalogue
│     └─ products.js    Same data for file:// (keep in sync)
├─ design/              Reference screenshots
├─ README.md
└─ LICENSE.txt
```

---

## Customise

### Colors
All colors live in **`code/assets/styles.css`** as CSS variables, once for light (`:root`)
and once for dark (`.dark`). Values are `R G B` so Tailwind opacity modifiers still work.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F5F1E8` | `#14151B` | page background |
| `--card` | `#FFFFFF` | `#1C1E26` | cards, inputs |
| `--chip` | `#F0ECE3` | `#2A2D38` | chips, steppers |
| `--ink` | `#1C1B22` | `#F3F2EE` | text (+ bold outlines in light) |
| `--muted` | `#5E5D68` | `#9C9EAD` | secondary text |
| `--line` | `#1C1B22` | `#30333F` | borders |
| `--coral` | `#D9432C` | `#FF6A4D` | primary buttons, prices |
| `--blue` | `#2F5BEA` | `#5B7FFF` | tiles, banner |
| `--green` | `#1E9E6A` | `#2EBF84` | tiles, success |
| `--yellow` | `#FFC83D` | `#FFD15C` | tiles, badges |

Example: to make the primary color purple, set `--coral: 124 58 237;` (`#7C3AED`).
Hex → RGB: `#7C3AED` → `124 58 237`.

### Fonts
Change the Google Fonts `<link>` in the HTML `<head>` and `fontFamily` in `assets/theme.js`.

### Products
Edit `code/data/products.json` (and copy it into `products.js` if you use double-click mode).
Fields: `id, name, category, price, rating, reviews, shape, color, colors[], sizes[], description`.
`shape` is one of `tote | orb | lamp | clock | arc | mug` (flat SVGs in `app.js` → `SHAPES`).
To use real photos instead, replace `shapeSVG(...)` with an `<img>` tag.

### Use the Fake Store API instead
In `assets/app.js` → `loadProducts()`:
```js
const res = await fetch('https://fakestoreapi.com/products');
const api = await res.json();
return api.map((p, n) => ({
  id: String(p.id), name: p.title, category: p.category, price: p.price,
  rating: p.rating.rate, reviews: p.rating.count, description: p.description,
  shape: 'orb', color: ['yellow', 'blue', 'green', 'coral'][n % 4],
  colors: ['yellow', 'blue', 'green', 'coral'], sizes: [], image: p.image,
}));
```
(Then show `p.image` with an `<img>` in `home.js` / `product.js`.)

### Promo codes, shipping
Top of `assets/app.js`:
```js
const PROMO_CODES = { FLAT20: 0.20, STUDENT10: 0.10 };
const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 5;
```

---

## Going to production
The Tailwind CDN script is perfect for learning and prototypes. For a real site, install
Tailwind CLI (`npx tailwindcss -o styles.out.css --minify`) with the config from
`theme.js`, and remove the CDN `<script>`. Checkout is a demo: connect Stripe, Razorpay
or similar in `cart.js` → `#checkout` handler.

## Ideas to extend (portfolio boosters)
- Wishlist (heart button) saved in localStorage
- Product reviews tab, related products row
- Checkout form with validation (name, address, card fields)
- Convert to React / Vue / Svelte components
- Sort by price, price-range filter

## License (summary)
Use it in unlimited personal **and** commercial projects (yours or your clients').
Don't resell or redistribute the kit itself, or the source files as a template/kit.
See `LICENSE.txt`.

Questions? DM **@code.in.30s** on Instagram.
