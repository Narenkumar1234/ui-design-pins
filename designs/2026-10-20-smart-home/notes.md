# Hearth Smart Home App · Tue Oct 20, 2026 · keyword HEARTH
- Status: live Oct 20, 2026. Instagram: https://www.instagram.com/p/DetQYZBG1c5/ · Gumroad: https://narenkumar1.gumroad.com/l/smart-home-ui-kit · keyword HEARTH.
- Product: Hearth (smart home control mobile app for students), charcoal screens + one orange accent, warm off-white light mode
- Keyword: HEARTH (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT, KLAR, ROAM, EMBER, LUMO are taken)
- Slug: smart-home · kit /workspace/products/smart-home-ui-kit/ (+ /workspace/products/smart-home-ui-kit.zip) · price $3
  Gumroad slug smart-home-ui-kit -> https://narenkumar1.gumroad.com/l/smart-home-ui-kit (once published)
- Reference (style only, credit @appuinspiration; design by haiba.webdesign): https://www.instagram.com/p/DMYTjfzTdpZ/ (shipment-tracking app)
  Adapted: charcoal #1A1A1A screens + #2A2A2A cards, ONE orange accent (pills, toggles, FAB, active nav, one full-orange card),
  22px cards, pill search, Outfit, photo-hero onboarding with big white headline + pill "Get Started" slider, floating rounded
  nav with a centred orange + FAB, status chips, stepper dots, warm greige slide bg with a staggered 2-column grid of straight
  phones cropped by the slide edges (cover). Not copied: brand, copy, screens, layouts (shipments/map/orders -> smart home).
  Kept from our v2 template: handle header, hook cover, light screens with callouts, dark slide, Comment KEYWORD CTA slide,
  1000x1500 pin with palette / fonts / build-it card.
- Stitch project 11119557533319828808 (stitch/project_id.txt); design systems "Hearth Dark" (assets/14947798366003324628) /
  "Hearth Light" (assets/2916032249584630825), Outfit headline + body, ROUND_FULL, custom colour #F2762E (stitch/design_systems.json).
  gen via stitch/gen.py (curl-based curlcall.py with retries; design system dropped after 3 failed attempts). ALL 7 generated on the
  first attempt (no failures, see run.log): dark onboarding, dark home, dark climate/room, dark energy+scenes, light home,
  light room, light energy. Stitch also generated the living-room hero photo (stitch/hero-photo.png -> kit img/living-dusk.jpg).
  Raw HTML/PNG in stitch/. Stitch screens were the layout starting point; the kit pages were hand-written from them.
- Screens: the final phone screens are rendered straight from the hand-written kit, so slides and kit match 1:1.
  screens/render.sh -> 390x820 @2x (780x1640) -> final/screens/ ; screens/scenes.py (Playwright) for the scrolled Scenes view.
  Screens: {dark,light}-{welcome,home,climate,lights,energy,scenes}.png (welcome is always dark over the photo).
- Slides: src/ = template-v2 + Hearth overrides (style.css: greige #CFC8C2 / stone #E4DED7 slides, Outfit 600 h1 with orange em,
  straight phones, charcoal callout pills with orange-ringed dots, charcoal CTA slide; render.py Row layout + screen-anchored
  callouts; src/rects.py dumps element positions used to aim the callouts). Re-run: `cd src && python3 render.py config.json`
  (ONLY=slide-2 to render one). Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500). QA copies in final/_qa/.
- Palette:
  Slides greige #CFC8C2 · stone #E4DED7 · CTA charcoal #1A1A1A
  Dark  bg #1A1A1A · card #2A2A2A · raised #333333 · line #3A3A3A · ink #F5F2EE · muted #8C8782 · accent text #F68C4E
  Light bg #F5F2EE · card #FFFFFF · raised #ECE7E1 · line #E2DCD5 · ink #1A1A1A · muted #857F79 · accent text #D6601C
  Accent orange #F2762E (both) · online dot #5CB87A
- Fonts: Outfit 600 (headings) + Outfit 400/500 (UI / body)
- Kit: 4 pages (Welcome, Home, Room [Climate + Lights tabs], Energy + Scenes) x light/dark, Tailwind CDN, vanilla JS:
  slide-to-start / slide-to-power pills, device toggles, room filter + search, draggable 270° thermostat dial (+/-, keys),
  AC modes + fan speed + schedule, brightness slider + colour temps + per-lamp toggles, energy chart Day/Week/Month with
  tooltip, top devices, scenes that switch devices, add-device sheet from the + FAB, CSV export, theme, all in localStorage.
  Playwright test /workspace/products/_test_hearth/test.py 94/94 pass, 0 console errors, no overflow at 360/390/768/1280.
- Project idea for students: build Hearth full-stack: Next.js/React front end from this kit, Node + Express (or Next API routes),
  MongoDB or Postgres (users, homes, rooms, devices, scenes, energy_readings), WebSockets (Socket.IO) for live device state across
  tabs + MQTT (Mosquitto/HiveMQ) for simulated or real ESP32 devices, JWT auth with family members/roles, usage charts
  (Chart.js/Recharts). Stretch: schedules via a cron worker, push notifications, PWA, a device simulator script.
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt (copies in final/).
