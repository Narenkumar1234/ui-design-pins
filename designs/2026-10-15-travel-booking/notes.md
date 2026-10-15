# Roam Travel Booking App · Thu Oct 15, 2026 · keyword ROAM
- Status: DRAFT for approval. Not posted. Kit not published on Gumroad yet.
- Product: Roam (travel booking / destination explorer mobile app), soft glassmorphism + clean minimal, light + dark
- Keyword: ROAM (unused; SHOP, PULSE, PENNY, KLAR in keyword-log.md, HABIT reserved for the Streaky spare)
- Slug: travel-booking · kit /workspace/products/travel-booking-ui-kit/ (+ /workspace/products/travel-booking-ui-kit.zip) · price $3
- Reference (style): Instagram @steve_mikey_ "TRAVEL APP" post https://www.instagram.com/p/DZmNk8_DArC/
  Used for: deep teal-navy slide background, white/pale-sky screens, azure gradient accent (active chip / CTA / nav), coral heart + gold star,
  rounded geometric sans, frosted pills over tall photo cards, Top Facilities row + full-width Book button, and the slide ideas:
  blurred teal-tinted photo background, huge ghosted italic wordmark (~8-9% white) behind the phones, phones bleeding off the slide edges (panorama).
  Kept from our v2 template: hook headline with one bold phrase, handle header + page count, callouts, Comment KEYWORD CTA slide, 1000x1500 pin.
- Stitch project 11564962150265373680 (stitch/project_id.txt); design systems Roam Light/Dark (Plus Jakarta Sans, ROUND_TWELVE, #3B8CF5);
  gen via stitch/mk.py + stitch/gen.py, download via /workspace/stitch/download.py. Raw Stitch HTML/PNG in stitch/.
- screens/: fix.py cleans the Stitch HTML: swaps Stitch's AI images for local Unsplash photos (img/, CREDITS.md), renames places to match the photos
  (Ha Long Bay, Lauterbrunnen, Zermatt, Cinque Terre, Lago di Braies), green "Verified" chip -> azure, grey band/odd 844px canvas on light detail,
  duplicate status bar on dark explore, icon-only/wrong-active nav on dark home -> labelled nav with Home active, "Top Pick 2025" -> 2026,
  dark/light prices made consistent, spacing tightened so content sits above the floating nav. render.sh -> 390x800 @2x (780x1600) -> final/screens/.
- Slides: src/ = template-v2 + Roam overrides (style.css: teal-navy blurred photo bg, ghost wordmark, glass chips, azure callouts;
  render.py: panorama phones, free-position callouts with SVG lines, GRID=1 debug grid). Re-run: `cd src && python3 render.py config.json`.
- Palette: Light #FFFFFF / wash #E6F2FD-#F4F9FF / ink #101C2C / muted #8A94A6 / accent #3B8CF5 -> #5AA7FF
  Dark #0F1E2E / wash #17324A / card #1A2B3E / ink #F2F6FB / muted #8A9BB0 · coral #E8573A · gold #F5B223 · slides #17324A -> #1E4560
- Fonts: Plus Jakarta Sans (all), ghost wordmark Plus Jakarta Sans ExtraBold Italic
- Photos: Unsplash License (free to use), ids listed in img/CREDITS.md and the kit's code/img/CREDITS.md
- Project idea for students: build Roam as a 3-page portfolio app: data-driven cards from a JS array, live search + chip filters,
  favourites + dark mode in localStorage, a detail page read from ?id=, and a booking bottom sheet with a guests stepper and live total.
  Stretch: Trips screen from saved bookings, filters sheet, map view, port to React.
