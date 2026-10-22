# Natter Chat App · Thu Oct 22, 2026 · keyword NATTER
- Status: live Oct 22, 2026. Instagram: https://www.instagram.com/p/DeyWcjLo05S/ · Gumroad: https://narenkumar1.gumroad.com/l/chat-app-ui-kit · keyword NATTER.
- Product: Natter (friendly chat / messaging mobile app for students), pale lavender page + ONE saturated violet accent, deep violet-black dark mode
- Keyword: NATTER (unused; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT, KLAR, ROAM, EMBER, LUMO, HEARTH are taken)
- Slug: chat-app · kit /workspace/products/chat-app-ui-kit/ (+ /workspace/products/chat-app-ui-kit.zip, 59 files, ~6.3 MB) · price $3
  Gumroad slug chat-app-ui-kit -> https://narenkumar1.gumroad.com/l/chat-app-ui-kit
- Reference (style only, credit @colorhymn "Chat app design - Day 5"; 3D avatars by @amritpaldesign): https://www.instagram.com/p/CCVbXEmAzBg/
  Adapted: very pale lavender-white bg #F1F0FF, ONE violet accent #5B3FD0 (headers, sent bubbles, buttons, active nav), a vertical
  violet icon action rail in the conversation, a full-violet onboarding screen with a circular white arrow button, white cards +
  received bubbles, small pink/orange reaction accents, geometric sans (Poppins), fully rounded 18px bubbles with one tight 4px
  corner, chat list of rounded white cards under a stories row, airy whitespace, and slides with phones fanned diagonally (~20-22°)
  in an overlapping cascade with soft violet shadows.
  Not copied: brand ("Ping"), copy, screens, layouts, illustrations, and NO 3D clay avatars (we did clay for Lumo): avatars are
  initials on gradient circles; images are original abstract SVGs (no photos). Added a deep violet-black dark mode.
  Kept from our v2 template: handle header, hook cover with fanned phones, light screens with callouts, dark slide, Comment KEYWORD
  CTA slide, 1000x1500 pin with palette / fonts / build-it card.
- Stitch project 13700470284889579391 (stitch/project_id.txt); design systems "Natter Light" (assets/7366743755589531489) /
  "Natter Dark" (assets/4255819259862774359), ROUND_FULL, custom colour #5B3FD0 (stitch/design_systems.json). Stitch has no Poppins
  font enum, so the design systems use MONTSERRAT (closest geometric option); the kit + slides use Poppins.
  gen via stitch/gen.py (curl-based curlcall.py with retries); ALL 7 generated on the first attempt (no failures, see run.log):
  light onboarding, light chats, light conversation, dark chats, dark conversation, light group info/call, light profile.
  Raw HTML/PNG in stitch/ (screens.json has ids). Stitch screens were the layout starting point (its violet onboarding with floating
  mini cards, labelled pill nav, rail and reply quote were kept); the kit pages were hand-written from them. Fixed vs Stitch:
  gradient onboarding -> flat violet, photo/Figma-file image bubble -> abstract SVG, mixed avatar styles -> one initials style,
  stray blues/greens -> palette only.
- Screens: final phone screens are rendered straight from the hand-written kit, so slides and kit match 1:1.
  screens/shoot.py (Playwright, 390x820 @2x -> 780x1640, fresh context per shot) -> final/screens/
  Screens: {light,dark}-{welcome,chats,chat,calls,profile,group}.png (welcome is violet in both themes; group = squad info sheet).
- Slides: src/ = template-v2 + Natter overrides (style.css: lavender #F1F0FF / #E9E6FF slides, Poppins 700 h1 with violet em,
  phones rotated 20-22° in a cascade, ink callout pills with violet-ringed dots, deep violet-black dark slide, full-violet CTA slide
  with a round white arrow; render.py Fan layout with rotation-aware screen-anchored callouts; src/rects.py dumps element positions
  used to aim the callouts; src/previews.py makes the Gumroad cover + thumbnail). Re-run: `cd src && python3 render.py config.json`
  (ONLY=slide-2 to render one). Outputs final/slide-1..4.png (1080x1350) + final/pin.png (1000x1500). QA copies in final/_qa/.
- Palette:
  Slides lavender #F1F0FF (light slide) / #E9E6FF (cover + pin base) · dark slide #120E24 · CTA violet #5B3FD0
  Light bg #F1F0FF · card #FFFFFF · raised #E9E6FF · line #E2DFF5 · ink #1E1B3A · muted #8A87A6 · accent text #5B3FD0
  Dark  bg #120E24 · card #1C1733 · raised #262042 · line #2E2850 · ink #F1F0FF · muted #9893B8 · accent #6A4FE0 · accent text #A08BFF
        dark chat header #2B2163
  Accent violet #5B3FD0 · pink #FF5C8A (reactions, missed calls, end call, group badges) · orange #FF9F43 (live dot, reactions) · online #2EC48C
- Fonts: Poppins 700 (headings) + Poppins 300/400/500/600 (UI, previews, body); Noto Color Emoji for reactions
- Kit: 5 pages (Welcome, Chats, Conversation, Calls, Profile) x light/dark, Tailwind CDN, vanilla JS:
  3-step violet onboarding (dots, swipe, keys, arrow button with progress ring); chat list with pill search (names + text), stories
  row + story viewer (auto-advance, tap prev/next, reply into chat, seen rings) + add your own text story, All/Unread/Groups/Pinned
  filters, long-press / right-click actions (pin, read/unread, mute, delete), new chat + new group (validation); conversation with
  send, typing indicator + fake auto-reply, sent -> read ticks, emoji reactions (picker, double-tap heart, toggle pills), reply via
  menu or swipe right, copy, delete, emoji quick row, voice notes (record with timer/cancel, playback with waveform, seek by tap or
  arrow keys), photo attach (gallery tiles or real upload downscaled to 640px, preview + caption), location card, vertical violet
  action rail, voice/video call overlay (timer, mute, speaker, video, end), group info sheet (members, Admin chip, call card, shared
  media, mute); calls page (live group call timer + join, All/Missed, call back, logs your calls, clear history); profile (edit
  name/bio with validation, status picker, stats, privacy + notification toggles, wallpaper Plain/Dots/Violet, dark mode switch,
  storage used, reset demo, log out). All state in localStorage (natter.*).
  Playwright test /workspace/products/_test_chat/test.py 169/169 pass, 0 console errors, no horizontal overflow at 360/390/768/1280
  on all 6 page variants (run: /workspace/.venv-pw/bin/python test.py).
- Project idea for students: build Natter full-stack: React / Next.js front end from this kit, Node + Express (or Next route
  handlers), Socket.IO rooms per conversation for live messages, typing indicators, presence (online / last seen) and read receipts,
  MongoDB or Postgres (users, conversations, members + roles, messages with type/replyTo/reactions, stories with 24h TTL, calls),
  JWT auth (access + refresh, bcrypt), photo + voice uploads to Cloudinary or S3 (MediaRecorder for audio).
  Stretch: WebRTC voice/video calls (TURN server), push notifications (Web Push / FCM), end-to-end encryption (Signal protocol /
  libsodium), message search, PWA.
- Files: final/slide-1..4.png, final/pin.png, instagram-caption.txt, pinterest.txt (copies in final/).
