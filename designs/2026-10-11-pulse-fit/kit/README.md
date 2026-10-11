# Pulse Fit UI Kit

Neo-brutalist fitness tracker mini-app in **HTML + Tailwind CSS + vanilla JS**.
Open `code/index.html` — zero npm, zero build step.

Designed for students and beginner front-end developers who want a portfolio project
that looks bold and actually works (streaks, rest timer, exercise checklist, dark mode).

## What's inside

| Page | File | Features |
|------|------|----------|
| Today / Home | `code/index.html` | Greeting, streak badge, today's workout card, quick stats |
| Workout | `code/workout.html` | Exercise list (sets×reps), rest timer, Start/Complete CTA |
| Progress | `code/progress.html` | Weekly bars, PR cards, consistency calendar dots |

All three pages support **light + dark** via a Theme tab in the bottom nav
(preference saved in `localStorage`).

## Quick start

1. Unzip the kit.
2. Open `code/index.html` in Chrome / Firefox / Edge (double-click is fine).
3. Tap **Theme** in the bottom nav to flip light/dark.
4. On Workout: tap **Start Workout**, check off exercises, then **Complete Workout**
   to bump your streak.

> Tip: for `fetch('data/workout.json')` to work, serve the folder with any static
> server (`npx serve code`, VS Code Live Server, etc.). Opening via `file://`
> still works — the kit falls back to `data/workout.js`.

## Features that actually work

- **Light / dark toggle** — Tailwind `dark:` + CSS variables, saved as `pulsefit.theme`
- **Streak counter** — `pulsefit.streak` in localStorage; increments when you complete today's workout
- **Exercise checklist** — tap a row to mark done; progress bar fills; saved per day
- **Rest timer** — countdown with Pause / Resume / Reset (defaults from exercise `restSec`)
- **Complete Workout** CTA — requires all exercises checked; then marks the day done
- **Weekly bar chart** — pure CSS geometric bars from sample week data
- **PR cards + consistency dots** — sample Oct calendar

## File structure

```
pulse-fit-ui-kit/
├── README.md
├── LICENSE.txt
├── code/
│   ├── index.html
│   ├── workout.html
│   ├── progress.html
│   ├── assets/
│   │   ├── theme.js      # Tailwind config + flash-free theme apply
│   │   ├── styles.css    # palette CSS variables + neo-brutal utilities
│   │   ├── app.js        # shared: streak, theme, nav, toast, timer helpers
│   │   ├── home.js
│   │   ├── workout.js
│   │   └── progress.js
│   └── data/
│       ├── workout.json
│       └── workout.js    # file:// fallback
└── design/               # reference screenshots (mobile light/dark)
```

## Palette (neo-brutalism)

**Light:** bg `#FFF8E7`, cards `#FFFFFF`, ink `#111111`, muted `#5A5A5A`,
lime `#C8F542`, pink `#FF5C8A`, blue `#4D7CFE`, yellow `#FFE566`,
outlines `#111111`, hard shadow `4px 4px 0 #111`.

**Dark:** bg `#0E0F12`, cards `#1A1C24`, ink `#F5F5F0`, muted `#A0A3B0`,
lime `#D4FF5E`, pink `#FF7AA2`, blue `#6B8FFF`, yellow `#FFE566`,
outlines `#F5F5F0`, hard shadows `#000000`.

Fonts: **Space Grotesk** (headlines) + **Inter** (body).

## Customise

- Edit hex values in `assets/styles.css` (`:root` / `.dark`) to re-skin.
- Change exercises in `data/workout.json` (and mirror in `workout.js` for file://).
- Swap the bottom-nav Theme tab for a header toggle if you prefer.

## Going to production

The Tailwind CDN is perfect for learning. For production:

1. Install Tailwind CLI or Vite + Tailwind.
2. Point content paths at your HTML/JS.
3. Replace the CDN script with your built CSS.
4. Keep the CSS variables so theming still works.

## License

See `LICENSE.txt`. Personal + commercial projects OK. Don't resell the kit itself.

Built for [@code.in.30s](https://instagram.com/code.in.30s) · Comment **PULSE** on the IG post to get the link.
