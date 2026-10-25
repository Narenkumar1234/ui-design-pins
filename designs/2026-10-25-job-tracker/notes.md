# Orbit Job Tracker · Sun Oct 25, 2026 · keyword ORBIT
- Status: live Oct 25, 2026. Instagram: https://www.instagram.com/p/De6GZ6wjbEn/ · Gumroad: https://narenkumar1.gumroad.com/l/job-tracker-ui-kit ($3) · keyword ORBIT · repo: https://github.com/Narenkumar1234/ui-design-pins/tree/main/designs/2026-10-25-job-tracker
- Product: Orbit, a job application tracker web dashboard for students and new grads (desktop web app + responsive mobile view): clean minimal bento dashboard, forest + one lime accent, green-black dark mode
- Keyword: ORBIT (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT, KLAR, ROAM, EMBER, LUMO, HEARTH, NATTER, NIMBUS are taken)
- Slug: job-tracker · kit /workspace/products/job-tracker-ui-kit/ (+ /workspace/products/job-tracker-ui-kit.zip, 49 files, ~7.8 MB) · price $3
  Gumroad slug job-tracker-ui-kit -> https://narenkumar1.gumroad.com/l/job-tracker-ui-kit (once published)
- Reference (style only, credit @code.xr "Dashboard V2"): screenshot ref/ref.png (+ ref_crop.png, full3.png). Post URL
  https://www.instagram.com/p/Ddf-7oiz126/ (URL reported by the reference-capture agent that opened the post).
  Adapted: bento grid of rounded white cards on a soft off-white canvas, big grotesk numerals, one bright highlight card, pill nav,
  a browser-window presentation with a code window beside the UI on the slides.
  Not copied: its copy, data, layout, icons or brand. Our own forest/lime palette, job-tracker content (17 fictional companies),
  kanban board, detail/interviews/settings pages, charts and icons.
  Kept from our v2 template: handle header, hook cover with fanned frames (2 browser windows + 1 phone + code window), light slide with
  callouts, dark slide, Comment KEYWORD CTA slide, 1000x1500 pin with palette / fonts / build-it card. Web-app adaptation: browser
  frames for desktop, a phone frame for the mobile view.
- Stitch project 2270660294596355138 "Orbit Job Tracker (code.in.30s)" (stitch/project_id.txt); design systems "Orbit Light"
  (assets/10599984407030352954) / "Orbit Dark" (assets/16290128366616987685), SPACE_GROTESK headings, GEIST body, ROUND_TWELVE,
  custom colour #1F4D3A (stitch/design_systems.json). gen via stitch/gen.py (curlcall.py); 5 screens: light dashboard, light board,
  light detail, light mobile board, dark dashboard (raw HTML/PNG in stitch/, screens.json has ids). Stitch screens were the layout
  starting point; the kit pages were hand-written from them with palette tokens only and our own data.
- Screens: rendered straight from the hand-written kit, so slides and kit match 1:1.
  screens/shoot.py (Playwright via http://127.0.0.1:8795 serving the kit; desktop 1440x900 @2x, mobile 390x844 @2x) -> final/screens/
  Screens: {light,dark}-{dashboard,board,detail (northwind),interviews,settings,mboard,mdash,mdetail}.png (16).
- Slides: src/ = template-v2 + Orbit overrides (style.css: off-white dot grid with a soft lime glow, browser .win frames with
  coral/sand/lime traffic lights + URL pill, .ph phone frames, .code window in JetBrains Mono (ligatures off), ink callout pills with
  elbow leaders, dark #0E1512 slide, CTA with steps/benefits and a lime go button). src/rects.py dumps element positions used to aim
  the callouts; src/previews.py makes the Gumroad cover, thumbnail and galleries.
  Re-run: `cd src && /workspace/.venv-pw/bin/python render.py config.json` (ONLY=slide-2 to render one, GRID=1 for a guide grid).
  Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500). QA copies in final/_qa/.
  Slide 1 cover (dark) "Job Tracker / Dashboard UI" · slide 2 (light) "Drag. Drop. Get hired." board + mobile, 4 callouts ·
  slide 3 (dark) "Looks sharp in dark mode" dashboard + mobile, 3 callouts · slide 4 CTA "Comment ORBIT to get the HTML/CSS".
- Palette:
  Light bg #F6F5F0 · card #FFFFFF · line #E6E4DC · ink #14181A · muted #5E6660 · forest #1F4D3A · lime #C6F35E
  Dark  bg #0E1512 · card #16211C · line #24332B · ink #EEF3EC · muted #9AA89F · primary #2E6B50 · lime #C6F35E
  Status Wishlist #8A948E · Applied #5B7C99 (dark #789CBA) · Interview #C6F35E · Offer #1F4D3A · Rejected #E07A5F (dark #EA8C72)
  Radius 20px cards, 16px kanban cards, full-round pills.
- Fonts: Space Grotesk 500-700 (headings, numerals), Geist 400-700 (UI, body). Not used before.
- Kit: 5 pages (Dashboard, Board, Application detail, Interviews, Settings) x light/dark/system, responsive, Tailwind CDN, vanilla JS:
  dashboard with 4 stat cards (lime response-rate ring), weekly SVG bar chart (4 / 8 weeks, goal line, tooltips), upcoming
  interviews, pipeline bar, recent activity, next-up countdown, reminder banner, CSV export; kanban board with drag and drop + undo,
  keyboard moves (Shift+arrows), card menu, filters, sort, search, add-to-column, mobile status tabs + FAB; detail with status menu,
  timeline, next step + .ics, notes autosave, contacts, edit/delete with undo; interviews month calendar (arrow keys), day panel,
  schedule form, .ics; settings (name, weekly goal, theme, INR/USD, reminders, CSV import/export, reset, clear, shortcuts). Global
  search (/), add modal (N). 17 fictional applications, fixed demo clock (Sun 25 Oct 2026 10:00). All state in localStorage (orbit.*).
  Kit also has README.md, LICENSE.txt, listing.md, design/stitch (5 PNG + 5 HTML), design/mockups (16), previews (6).
  Playwright test /workspace/products/_test_orbit/test.py 181/181 pass, 0 console/network errors, no horizontal overflow at
  360/390/768/1280 on 5 pages x 2 themes (run: /workspace/.venv-pw/bin/python test.py).
- Project idea for students: build Orbit full-stack: Next.js/React front end from this kit, Node/Express or Next API routes,
  Postgres + Prisma (users, applications, stages, events, contacts), auth (NextAuth / Clerk), cron jobs (Vercel Cron / node-cron)
  emailing interview + follow-up reminders (Resend / Nodemailer), resume uploads to S3 with presigned URLs, analytics (response rate,
  time to first reply, stage funnel). Stretch: Chrome extension to save job posts, Google Calendar sync, CSV/LinkedIn import.
- Known minor issues: slide-4 phone (mobile detail) shows a sliver of the timeline add form ("10/25/2026 Add") above the bottom nav;
  on mobile the detail page highlights "Board" in the bottom nav (by design).
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt, notes.md (copies in final/).
