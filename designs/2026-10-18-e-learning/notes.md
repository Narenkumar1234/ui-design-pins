# Lumo E-learning App · Sun Oct 18, 2026 · keyword LUMO
- Status: live (posted Oct 18, 2026). Instagram: https://www.instagram.com/p/DeoH9J2Izou/ · Gumroad: https://narenkumar1.gumroad.com/l/e-learning-ui-kit · keyword-log.md updated (keyword LUMO, empty DMed list). Code-only mirror prepared locally at designs/2026-10-18-e-learning/ (no PNG/JPG/ZIP).
- Product: Lumo (e-learning / online course mobile app for students), pastel 3D clay, light + deep-navy dark
- Keyword: LUMO (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT, KLAR, ROAM, EMBER are taken)
- Slug: e-learning · kit /workspace/products/e-learning-ui-kit/ (+ /workspace/products/e-learning-ui-kit.zip) · price $3
  Gumroad slug e-learning-ui-kit -> https://narenkumar1.gumroad.com/l/e-learning-ui-kit (once published)
- Reference (style only, credit @uiux.build): https://www.instagram.com/uiux.build/p/DeCsqRAjYxk/ ("MILO" pastel claymorphism app)
  Adapted: pale sky gradient slide bg, pale blue-white screens, periwinkle pills, peach / cream / lavender tiles, navy ink,
  chunky rounded headings, 20-28px radii, no hard borders, glossy 3D clay objects with cute faces, staggered 2-col grid,
  straight (not fanned) side-by-side phones with the bigger phone lower. Not copied: brand, copy, screens, layouts, art.
  Kept from our v2 template: handle header + page count, hook cover, light screens with callouts, dark slide,
  Comment KEYWORD CTA slide, 1000x1500 pin with palette / fonts / build-it card.
- Stitch project 6757499251026242897 (stitch/project_id.txt); design systems "Lumo Light"/"Lumo Dark" (stitch/design_systems.json,
  Quicksand + Nunito Sans because Stitch has no Fredoka/Nunito enum). gen via stitch/gen.py (curl-based curlcall.py with
  retries; the design system is dropped after 3 failed attempts). Generated: light home, light course, dark home,
  dark explore + a clay sticker sheet (art-art). Raw HTML/PNG in stitch/. Light explore + dark course kept failing on
  connection drops (see run.log); those screens were hand-built in the kit instead.
- Screens: the final phone screens are rendered straight from the hand-written kit (Stitch screens were the layout
  starting point), so slides and kit match 1:1. screens/render.sh -> 390x820 @2x (780x1640) -> final/screens/.
- Clay art: 8 Stitch-generated clay illustrations cut out with rembg (img/, img/CREDITS.md).
- Slides: src/ = template-v2 + Lumo overrides (style.css: sky gradient + white glow, Fredoka h1 with periwinkle em,
  straight phones, navy / periwinkle callout pills, floating clay objects, navy night slide; render.py Row layout).
  Re-run: `cd src && python3 render.py config.json`. Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500).
- Palette:
  Slide bg #CFE3FF -> #E8F1FF
  Light bg #F4F8FF · card #FFFFFF · raised #EAF2FF · ink #1F2A44 · muted #8A94A8 · primary #8FB8F5 -> #6FA3F0 · primary text #4F86E3
        tiles peach #FBD9D6 · cream #FFE9C2 · lavender #E4DBF2 · sky #D6E6FF · mint #6CC8A0 · honey #F5B94A
  Dark  bg #121A2B · card #1C2740 · raised #24314F · ink #EEF3FF · muted #8E9BB8 · primary #9CC2F7 -> #7FAEF3
        tiles #3A2C3A · #393526 · #2F2B4A · #213656 · mint #78D6AC
- Fonts: Fredoka 600 (headings) + Nunito (UI / body)
- Kit: 4 pages (Home, Explore, Lesson player, My learning) x light/dark, Tailwind CDN, vanilla JS: simulated player
  (play/seek/speed), lessons, notes, quiz + badge, bookmarks, streak, weekly goal chart, search/filter/bottom sheet,
  theme, all in localStorage. Playwright test /workspace/products/_test_lumo/test.py 77/77 pass, 0 console errors,
  no overflow at 360/390/768/1280.
- Project idea for students: build Lumo full-stack: React/Next.js front end from this kit, Node + Express API, MongoDB
  (users, courses, lessons, progress, quiz attempts), JWT auth, course + lesson CRUD for teachers, video lessons on
  Cloudinary, per-user progress, streaks and quiz scores, dark mode. Stretch: certificates, push reminders, PWA, admin stats.
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt (copies in final/).
