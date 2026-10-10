# Flat Shop App UI — Light + Dark

Flat-design shopping app with home, product detail, and cart. Light and dark themes as a two-slide Instagram carousel. Screens designed with **Google Stitch**, then framed into the pin/carousel layout. Posted on Instagram: https://www.instagram.com/p/DeUPQmJG3Ek/

Sellable pack: [Flat Shop UI Kit on Gumroad](https://narenkumar1.gumroad.com/l/flat-shop-ui-kit)

## Screens (×2 themes)
- **Home** — search, category chips, featured product grid, "20% off" promo banner
- **Product detail** — size + color pickers, rating, sticky Add to Cart bar with qty stepper
- **Cart** — free-shipping banner, qty steppers, FLAT20 coupon, order summary, Checkout

## Light palette
| Role | Hex |
|------|-----|
| Background | `#F5F1E8` |
| Cards | `#FFFFFF` |
| Text / outlines | `#1C1B22` |
| Coral (primary) | `#D9432C` |
| Blue | `#2F5BEA` |
| Green | `#1E9E6A` |
| Yellow | `#FFC83D` |

## Dark palette
| Role | Hex |
|------|-----|
| Background | `#14151B` |
| Cards | `#1C1E26` |
| Inputs / chips | `#2A2D38` |
| Text | `#F3F2EE` |
| Coral (primary) | `#FF6A4D` |
| Blue | `#5B7FFF` |
| Green | `#2EBF84` |
| Yellow | `#FFD15C` |

## Fonts
- System / Inter-style UI (framed posts use Inter/Poppins-compatible stacks in CSS)

## Stack (project idea)
- HTML + CSS + JavaScript (or React)
- Tailwind CSS (`dark:` variants for theme toggle)
- Fake Store API for products
- localStorage for cart + totals
- Promo code logic (`FLAT20` = 20% off)

## Source layout
- `src/template.html` + `src/build.py` — generate framed pin/IG HTML for light & dark
- `src/_pinterest-*.html`, `src/_instagram-*.html` — generated framed layouts
- `screens/*.html` — per-screen Stitch-derived HTML (light/dark × home/detail/cart)
- `stitch/` — raw Stitch HTML exports + `screens.json` (no PNGs)
- `kit/` — sellable Gumroad pack source (`code/` app + README + LICENSE + listing)

## Outputs (not committed — regenerate locally)
PNG renders are **not** stored in this repo. The framed HTML still references
`../screens/*.png`; run `build.py` to recreate them from the HTML screens, then
screenshot the framed layouts:

```bash
cd designs/2026-10-10-flat-shop
python3 src/build.py
```

That writes local `screens/*.png` plus `pinterest-*.png` / `instagram-*.png`.
Also kept: `pinterest.txt`, `instagram-caption.txt`.

## Caption / keyword
Instagram post keyword for the free kit DM: **SHOP**
