# Folio Reading Tracker · Tue Oct 27, 2026 · keyword FOLIO
- Status: DRAFT for approval. Not posted. Kit not published on Gumroad. Nothing pushed to GitHub. keyword-log.md NOT updated (add FOLIO only after posting).
- Product: Folio, a minimal monochrome book reading tracker mobile app for students: one orange accent, CSS-drawn covers, light + near-black dark mode
- Keyword: FOLIO · Slug: reading-app · kit /workspace/products/reading-app-ui-kit/ (+ /workspace/products/reading-app-ui-kit.zip, 51 files, ~4.2 MB) · price $3
  Gumroad slug reading-app-ui-kit -> https://narenkumar1.gumroad.com/l/reading-app-ui-kit (once published)
- Reference (style only, credit @uxpected.abhi "Book Reading App UI Concept", https://www.instagram.com/p/CMUl7EoAp7s/; screenshot ref/ref.png):
  Taken from it: flat light-grey backdrop (#E6E6E6), straight phones side by side with the left one larger and in front, a monochrome UI
  with one warm accent, heavy geometric sans, full-round pills, small-radius covers, no heavy shadows.
  Not copied: their screens, copy, book covers/titles, icons or layout details. All books, authors, prose and covers are invented
  (CSS covers in 8 styles: sun, split, arc, stripe, grid, dots, type, mono). v2 rule kept: the cover slide still has fanned phones.
  Kept from template v2: handle header + page count, hook cover, light slides with callouts, dark slide, Comment KEYWORD CTA, 1000x1500 pin.
- Stitch project 11272431921498675969 "Folio" (stitch/project_id.txt); design systems "Folio Light" (assets/3872367097134657854) / "Folio Dark"
  (assets/17170237114526942315), LEXEND (Stitch has no Urbanist), ROUND_TWELVE, custom colour #E8742A (stitch/design_systems.json).
  Generated via stitch/gen.py + mk_light.py (curl-based curlcall.py): light home, light detail, light profile, light reader, dark home, dark detail,
  all 6 on the first attempt (26-47 s each; the first LIGHT design-system call returned 503 "service unavailable" and was re-run separately).
  Raw PNG + HTML in stitch/ (screens.json has ids); light-home came back on an odd 2560x2048 padded canvas. Stitch gave the layout cues
  (stat pills on detail, orange longest-streak tile, follow pills, "Folio •" header, streak card); the kit pages were hand-written from them.
  Changed vs Stitch: Lexend -> Urbanist, its sci-fi filler prose ("Station Echo-9") -> calmer original prose, its covers/icons -> our
  CSS covers + one line-icon set, radii unified to pills + 10px covers/tiles, colours limited to the palette tokens.
- Screens: final phone screens are rendered straight from the kit (screens/shoot.py, Playwright on http://127.0.0.1:8811, 390x844 @2x ->
  780x1688), so slides and kit match 1:1. final/screens/{light,dark}-{home,home2,detail,detail2,profile,profile2,reader,shelf}.png
- Slides: src/ (render.py + style.css + config.json, rects.py aims callouts, previews.py makes the Gumroad images).
  Re-run: `cd src && /workspace/.venv-pw/bin/python render.py config.json` (ONLY=slide-2 for one, GRID=1 for a debug grid).
  final/slide-1..5.png (1080x1350) + final/pin.png (1000x1500); QA copies in final/_qa/.
  1 hook cover (3 fanned phones + chips) · 2 "Monochrome, one accent" (home + book detail, callouts) · 3 "Stats that keep you reading"
  (profile + reader) · 4 dark "Dark mode, same accent" (home + library) · 5 orange CTA "Comment FOLIO to get the HTML/CSS".
- Palette:
  Slides backdrop #E6E6E6 · dark slide #161616 · CTA #E8742A
  Light  bg #F5F4F0 · card #FFFFFF · line #E7E5DF · soft #ECEAE4 · ink #141414 · muted #8A8A8A · accent #E8742A · star #F5C518 · inverse #141414
  Dark   bg #141414 · card #1E1E1E · line #2A2A2A · soft #262626 · ink #F5F4F0 · muted #8A8A8A · inverse button #F5F4F0 · hero card #222222
- Fonts: Urbanist 800-900 titles, 500-700 UI, 400 body (not used before; avoided Poppins, Outfit, Sora, Space Grotesk, Geist, Manrope/Inter,
  Plus Jakarta, Newsreader/DM Sans, Fredoka/Nunito).
- Kit: 5 pages (Home, Book, Library, Reader, Profile) x light/dark, Tailwind CDN, vanilla JS, window.Folio core, state in localStorage
  (folio.state, folio.theme), fixed demo clock 2026-10-27 19:30, 8 invented books, 12-day streak. Also README.md, LICENSE.txt (MIT + no resale),
  listing.md, design/stitch (6 PNG + 6 HTML), design/mockups (16), previews (6).
  Playwright test /workspace/products/_test_folio/test.py: 90/90 pass, 0 console errors, no horizontal overflow at 360/390/768/1280 on 8 page
  variants x 2 themes; interactions: log sheet, shelf toggle, rating, tabs + genre filter + URL sync + empty state, reader page turn (button +
  arrow key), highlight, Aa size, Esc closes sheet, theme save, genre chips, goal stepper, two-tap reset.
- Project idea for students: Folio full-stack: Next.js (App Router) front end from this kit; Open Library API search via a route handler with
  caching; Postgres + Prisma (users, books, user_books, sessions, highlights, follows); Auth.js or Clerk; streaks computed from sessions + a
  nightly cron for "keep your streak" emails/push; social follows + public shelves; stretch: PWA offline log, Goodreads CSV import, yearly wrapped.
