# Nimbus Weather App · Sat Oct 24, 2026 · keyword NIMBUS
- Status: live Oct 24, 2026. Instagram: https://www.instagram.com/p/De3gGYXDdpS/ · Gumroad: https://narenkumar1.gumroad.com/l/weather-app-ui-kit · keyword NIMBUS.
- Product: Nimbus (glassmorphism weather mobile app for students), blue-to-peach sky with frosted-glass cards, starry navy night mode
- Keyword: NIMBUS (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT, KLAR, ROAM, EMBER, LUMO, HEARTH, NATTER are taken)
- Slug: weather-app · kit /workspace/products/weather-app-ui-kit/ (+ /workspace/products/weather-app-ui-kit.zip, 51 files, ~11.6 MB) · price $3
  Gumroad slug weather-app-ui-kit -> https://narenkumar1.gumroad.com/l/weather-app-ui-kit
- Reference (style only, credit @iabout_tech (https://www.instagram.com/p/DZWEAsMo_oj/) "iOS 27 brings a new design to the Weather app"): screenshot ref/ref.png (saved by the
  computer-use agent; no message with the post URL reached this run, so the URL is not recorded here; add it from the agent's message).
  Started from a classic glassmorphism look, then adapted once ref.png appeared: centred location + big thin temperature hero,
  a "Highlights" glass card with plain-language bullets, an icon segmented toggle on the hourly card, glass cards on a moody sky,
  and slides with a centred headline over a rounded panel with upright phones (made into a frosted-glass "stage"), thin
  titanium-style phone frames (one warm orange frame on the CTA).
  Not copied: Apple branding / iOS name, copy, screens, layouts, icons or city data. Our own gradient SVG weather icons, peach
  horizon palette, AQI / compass / sun arc / pressure tiles, cities manager, charts and night sky. v2 rule kept: the cover still
  has fanned phones.
  Kept from our v2 template: handle header, hook cover with fanned phones, light screens with callouts, dark slide, Comment KEYWORD
  CTA slide, 1000x1500 pin with palette / fonts / build-it card.
- Stitch project 6546686147262882040 "Nimbus Weather App UI (code.in.30s)" (stitch/project_id.txt); design systems "Nimbus Light"
  (assets/2811715665149221054) / "Nimbus Dark" (assets/13712065153622114671), SORA, ROUND_FULL, custom colour #4FA3F7, tertiary
  #FFB238 (stitch/design_systems.json). gen via stitch/gen.py (curl-based curlcall.py with retries); ALL 7 generated on the first
  attempt (53-109 s each, see run.log): light home, light forecast, light cities, light details, dark home, dark forecast, dark details.
  Raw HTML/PNG in stitch/ (screens.json has ids). Stitch screens were the layout starting point (hero, glass stat row, hourly card,
  10-day range bars, AQI/UV tiles, sun arc); the kit pages were hand-written from them. Fixed vs Stitch: "San Francisco" on the
  forecast screens -> Bengaluru, baked-in phone status bar removed, emoji-like icons -> our gradient SVG icon set, off-palette
  greens/yellows -> palette tokens only.
- Screens: final phone screens are rendered straight from the hand-written kit, so slides and kit match 1:1.
  screens/shoot.py (Playwright via http://127.0.0.1:8783 serving the kit, 390x820 @2x -> 780x1640, fresh context per shot,
  animations frozen) -> final/screens/
  Screens: {light,dark}-{home,home2 (scrolled),forecast,cities,details,settings,sheet}.png (dark = New York at 03:30 via ?city=nyc).
- Slides: src/ = template-v2 + Nimbus overrides (style.css: sky gradient #B9DCFF -> #DDEEFF -> #FFE6CC slides with a sun glow,
  Sora 600 centred h1 with a thin sky-blue em, frosted-glass stage panel, titanium phone frames, navy callout pills with sky-ringed
  dots, starry navy night slide, deep-sky CTA slide with a round white arrow; render.py renders with Playwright because headless
  --screenshot stalls on backdrop-filter; src/rects.py dumps element positions used to aim the callouts; src/previews.py makes the
  Gumroad cover, thumbnail and galleries). Re-run: `cd src && /workspace/.venv-pw/bin/python render.py config.json` (ONLY=slide-2
  to render one). Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500). QA copies in final/_qa/.
- Palette:
  Slides sky #B9DCFF / #DDEEFF / #FFE6CC · night slide #071026 -> #1D3B78 · CTA #1F6FD6 -> #86C6FF
  Light sky #4FA3F7 -> #8CCBFF -> #FFD6A5 · glass white 26% + white 60% border, blur 24px · ink #0F2A4A · muted #3F5E82 ·
        accent #2F80E0 · sun #FFB238 · rain #2578DE
  Dark  sky #071026 -> #0F2350 -> #1D3B78 + stars · glass white 7.5% / 16% · ink #EAF4FF · muted #9FB5D8 · accent #78B6FF ·
        sun/moon #FFC861 · rain #6EB0FF
  AQI #3DD68C · #FFD54A · #FF8A3D · #FF5A5F · #A35BFF · #8B2F3C
- Fonts: Sora 200 (numerals), 600 (headings), 400/500 (UI, body). Not used before (avoided Poppins, Outfit, Manrope/Inter,
  Plus Jakarta, Newsreader/DM Sans, Fredoka/Nunito).
- Kit: 5 pages (Home, Forecast, Cities, Details, Settings) x light/dark, Tailwind CDN, vanilla JS:
  home with centred location, city pager (swipe/dots), tap temperature for °C/°F, Highlights card (rain alert + tomorrow's trend,
  dismiss per city per day), stats, 24 hourly pills (tap to preview an hour, Back to now) with Conditions / Rain / Wind tabs, next 3
  days, AQI + UV minis; forecast with Temperature / Rain / Wind seg, 24h SVG chart (tap, drag, arrow keys, tooltip), 10-day list
  with expandable rows, deep links ?metric&day&h; cities with search (Enter adds top result), add up to 12 of 20, Edit mode
  (reorder, remove, keeps one), tap to activate; details with 8 tiles (AQI, UV, wind compass, sun arc, humidity, feels like,
  pressure gauge, visibility) + info sheets (hash deep links); settings with units + preview, Day / Night / Auto theme, animated sky,
  rain alerts, daily summary + time, live weather toggle (Open-Meteo, 15-min cache, 7 s timeout, offline fallback), clear cache,
  reset demo. Deterministic mock forecast engine (seeded per city + day, fixed demo clock). All state in localStorage (nimbus.*).
  Kit also has README.md, LICENSE.txt, listing.md, design/stitch (7 PNG + 7 HTML), design/mockups (14), previews (6).
  Playwright test /workspace/products/_test_nimbus/test.py 142/142 pass, 0 console errors (aborted-fetch lines ignored only in the
  offline-fallback check), no horizontal overflow at 360/390/768/1280 on 8 page variants, live mode tested with a mocked Open-Meteo
  route (run: /workspace/.venv-pw/bin/python test.py).
- Project idea for students: build Nimbus full-stack: Next.js (App Router) front end from this kit, route handler
  /api/weather?lat&lon proxying Open-Meteo / OpenWeather server-side (keys hidden, response normalised), caching in Redis (Upstash)
  or the Next data cache keyed by rounded lat/lon with a 10-15 min TTL + stale-while-revalidate, rate limiting, auth (NextAuth /
  Clerk) + saved cities and alert prefs in Postgres (Prisma), geocoding search, installable PWA with offline last-known forecast,
  Web Push (VAPID) + a cron job that sends "rain in 1 hour" alerts for saved cities.
  Stretch: Air Quality API, radar map tiles, weather-based theming at the edge, i18n units, Lighthouse 95+.
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt, notes.md (copies in final/).
