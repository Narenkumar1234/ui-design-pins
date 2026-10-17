# Ember Food Delivery App · Sat Oct 17, 2026 · keyword EMBER
- Status: DRAFT for approval. Not posted. Kit not published on Gumroad. Nothing pushed to GitHub. keyword-log.md NOT updated (add EMBER only after posting).
- Product: Ember (food delivery / customer ordering mobile app), warm editorial minimal, light + espresso dark
- Keyword: EMBER (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, KLAR, HABIT, ROAM are taken)
- Slug: food-delivery · kit /workspace/products/food-delivery-ui-kit/ (+ /workspace/products/food-delivery-ui-kit.zip) · price $3
  Gumroad slug food-delivery-ui-kit -> https://narenkumar1.gumroad.com/l/food-delivery-ui-kit (once published)
- Reference (style): Instagram @codew_ithshivam, "Claude" panel of https://www.instagram.com/p/DdEJEOOppnl/
  Used for: cream bg, orange/terracotta accent, serif headline + italic orange phrase, geometric sans UI, big overhead bowl hero,
  search bar, round category chips, orange->peach promo card with a code chip, Popular near you 2-col cards, 5-icon tab bar,
  16-24px radius, warm espresso (not neon) dark mode. Slides adapted to it too: cream slide bg, Newsreader headlines with an
  italic orange phrase, a floating overhead bowl on the cover, promo-code + Add to cart chips, espresso night slide.
  Kept from our v2 template: handle header + page count, fanned phones, callouts, Comment KEYWORD CTA slide, 1000x1500 pin.
- Stitch project 5164044061089870205 (stitch/project_id.txt); design systems "Ember Light"/"Ember Dark" (Newsreader + DM Sans,
  ROUND_TWELVE, FIDELITY); gen via stitch/gen.py (curl-based stitch/curlcall.py with retries), light cart via stitch/gen_nods.py
  (generated WITHOUT the design system after repeated connection drops; colours/fonts matched by prompt + cleanup).
  Raw Stitch HTML/PNG in stitch/. The project also holds an unused test screen.
- screens/: fix.py cleans the Stitch HTML: Stitch AI images -> local Unsplash photos (img/, CREDITS.md), circle-cut bowl PNGs,
  names/copy matched to the photos (Sesame Tofu Bowl, Harvest Bowl Co., Napoli Wood Fire), off-palette colours removed,
  serif card names + rating pill on dark home, duplicate/odd rows removed on detail + cart, spacing tightened above the tab bar.
  render.sh -> 390x800 @2x (780x1600) -> final/screens/.
- Slides: src/ = template-v2 + Ember overrides (style.css: cream bg, Newsreader h1 with italic orange em, bowl, chips, espresso
  night slide, orange/espresso callout pills; render.py: fan + mapped callouts, GRID=1 debug grid).
  Re-run: `cd src && python3 render.py config.json`. Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500).
- Palette:
  Light bg #FBF4EC · card #FFFFFF · line #F0E3D6 · ink #2B1D14 · muted #8C7B6E · peach #FDE3D2 · accent #E8622C -> #C9502A
        promo gradient #E8622C -> #F6A77A · gold #F2A93B · green #4E9A5B
  Dark  bg #1B1411 · card #2A201B · line #3A2A22 · ink #F8EDE3 · muted #A8968A · accent #F0703A -> #D4572B · green #6FBF7C
- Fonts: Newsreader (headings, italic accent) + DM Sans (UI)
- Photos: Unsplash License, ids in img/CREDITS.md and the kit's code/img/CREDITS.md
- Kit: 5 pages (Home, Restaurant, Dish, Cart, Track) x light/dark, Tailwind CDN, vanilla JS cart/promo EMBER30/favs/theme in
  localStorage, SVG tracking map; Playwright test /workspace/products/_test_ember/test.py 49/49 pass, 0 console errors.
- Project idea for students: build Ember full-stack: React/Next.js front end from this kit, Node + Express API, MongoDB
  (restaurants, dishes, orders, users), auth + order history, promo codes server-side, Stripe test-mode checkout,
  live order tracking with Socket.IO, dark mode. Stretch: restaurant admin dashboard, ratings/reviews, PWA.
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt (copies in final/).
