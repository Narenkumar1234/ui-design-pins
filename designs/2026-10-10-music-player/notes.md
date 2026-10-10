# Music Player App UI — Dark Theme

Dark-theme music player concept for students. Three mobile screens plus a "Build it with" strip. Sample pin for @code.in.30s (not posted to Instagram).

## Screens
- **Library** — playlist cards + recently played
- **Now Playing** — album art, seek bar, play/pause, shuffle & repeat
- **Playlist** — track list with the current song highlighted

## Palette
| Role | Hex |
|------|-----|
| Background | `#0B0A14` |
| Surface / cards | `#13121D` |
| Purple accent | `#A855F7` |
| Pink accent | `#EC4899` |
| Orange highlight | `#F97316` |
| Muted text | `#A9A3C4` |

Accent gradient: `#A855F7` → `#EC4899` → `#F97316`

## Fonts
- **Poppins** — headings
- **Inter** — UI / body

## Stack (project idea)
- HTML + CSS + JavaScript (or React)
- Web Audio API / `<audio>` for play, seek, volume
- localStorage for playlists
- Flexbox + Grid

## Source files
- `src/pinterest.html` — 1000×1500 pin layout
- `src/instagram.html` — 1080×1350 Instagram layout
- Self-contained HTML/CSS (no local image assets)

## Outputs (not committed — regenerate locally)
PNG renders are **not** stored in this repo. Re-render with headless Chrome:

```bash
cd designs/2026-10-10-music-player
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1000,1500 --virtual-time-budget=3000 \
  --screenshot=pinterest.png src/pinterest.html

google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 --virtual-time-budget=3000 \
  --screenshot=instagram.png src/instagram.html
```

Also kept: `pinterest.txt`, `instagram-caption.txt`.
