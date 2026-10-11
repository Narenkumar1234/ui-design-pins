# Pulse Fit — Daily Design Pin · 2026-10-11

## Concept
Neo-brutalist fitness / workout tracker app for @code.in.30s UI Design Pins.

## Keyword
**PULSE** — Comment PULSE to get the HTML/CSS (CTA slide).

## Screens (× light + dark)
1. **Today / Home** — greeting, streak badge, today's workout card, quick stats (kcal / min / workouts), bottom nav
2. **Workout** — exercise list sets×reps, rest timer, Start/Complete CTA
3. **Progress** — weekly geometric bars, PR cards, consistency calendar dots

## Palette
### Light
- bg `#FFF8E7`, cards `#FFFFFF`, ink `#111111`, muted `#5A5A5A`
- lime `#C8F542`, pink `#FF5C8A`, blue `#4D7CFE`, yellow `#FFE566`
- outlines `#111111`, offset shadow `#111111`

### Dark
- bg `#0E0F12`, cards `#1A1C24`, ink `#F5F5F0`, muted `#A0A3B0`
- lime `#D4FF5E`, pink `#FF7AA2`, blue `#6B8FFF`, yellow `#FFE566`
- outlines `#F5F5F0`, hard shadows `#000000`

## Fonts
Space Grotesk (headlines) + Inter (body)

## Style rules
Neo-brutalism only: thick 3–4px outlines, hard `4px 4px 0` shadows, solid fills, no gradients/glows/blur/photos.

## Stack (kit)
HTML + Tailwind CDN + vanilla JS · localStorage streaks · rest timer · CSS bars

## Pricing (Gumroad suggestion)
Intro $3 / ₹149 → regular $6 / ₹299 (match Flat Shop)

## Stitch
Project: `projects/12900977978343663287`
Design systems: see `stitch/design_systems.json`

## Project idea (for students)
Build Pulse Fit as a 3-page HTML + Tailwind + vanilla JS app: a Today page with a working streak counter, a Workout page with a sets×reps checklist and a pause/resume rest timer, and a Progress page with CSS-only weekly bars, PR cards and a consistency grid. Add a light/dark toggle saved in localStorage.

## Slide revisions (approved 2026-10-11)
- CTA slide kicker changed from "FREE UI KIT" to "UI KIT" (the kit is paid on Gumroad).
- Title "— Light / — Dark" now dark text on a lime highlight block (4px outline + hard shadow) instead of lime text; the @code.in.30s footer handle got the same block for contrast.

## Rebuild
`python3 designs/2026-10-11-pulse-fit/src/build.py` (PNGs are local only; gitignored).
Kit: `cd designs/2026-10-11-pulse-fit/kit/code && python3 -m http.server 5500`
