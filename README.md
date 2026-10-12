# UI Design Pins

Private reference repo for [@code.in.30s](https://www.instagram.com/code.in.30s/) — free front-end UI design concepts and project ideas for students.

**Code only.** Source HTML/CSS/JS, Stitch exports, and Gumroad kit code live here. Rendered PNGs for Instagram/Pinterest are regenerated locally (see below) and are not committed. Cloud copies of posts live on Instagram; sellable kits live on Gumroad.

## Folder layout

```
designs/<YYYY-MM-DD>-<slug>/
  src/                 # pin/carousel HTML (and build helpers)
  screens/             # per-screen HTML used inside phone frames (no PNGs)
  stitch/              # optional: raw Google Stitch HTML + screens.json
  kit/                 # optional: sellable pack (code/ + README + LICENSE + listing)
  notes.md             # palette, fonts, screens, stack, project idea
  pinterest.txt        # title, description, alt text, suggested board
  instagram-caption.txt

tools/stitch/          # Stitch MCP helper scripts (API key from env)
```

## How to run a kit

Flat Shop example:

```bash
cd designs/2026-10-10-flat-shop/kit/code
python3 -m http.server 5500   # open http://localhost:5500
# or open index.html directly in a browser
```

See `kit/README.md` for features (cart, FLAT20 promo, light/dark toggle).

## How to regenerate pin images

PNGs are gitignored. Rebuild them when you need to post.

**Self-contained pin (music player):**

```bash
cd designs/2026-10-10-music-player
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1000,1500 --virtual-time-budget=3000 \
  --screenshot=pinterest.png src/pinterest.html
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 --virtual-time-budget=3000 \
  --screenshot=instagram.png src/instagram.html
```

**Framed multi-screen pin (Flat Shop):**

```bash
cd designs/2026-10-10-flat-shop
python3 src/build.py
# Pulse Fit (runs from any directory, also renders the CTA slide):
python3 designs/2026-10-11-pulse-fit/src/build.py
# Penny Budget (patch raw Stitch HTML, render screens, then build all 5 slides):
cd designs/2026-10-12-penny-budget && cp stitch/*.html screens/ && (cd screens && python3 patch.py && ./render.sh) && python3 src/build.py
```

`build.py` screenshots each `screens/*.html` to local `screens/*.png` (needed by the framed templates), regenerates `src/_*.html` from `template.html`, then screenshots the Pinterest (1000×1500) and Instagram (1080×1350) layouts. Run it with the design folder as the working directory.

## tools/stitch

Minimal Google Stitch MCP client. Reads the API key from the environment — never commit keys.

```bash
export STITCH_API_KEY='your-key'   # from Stitch → profile → API settings
cd tools/stitch
python3 stitch.py list
python3 stitch.py call list_projects '{}'
# python3 mk_ds.py                  # create design systems (project id in script)
# python3 gen.py LIGHT home         # generate a screen
# python3 download.py PROJECT_ID OUTDIR
```

Scripts: `stitch.py` (RPC client), `mk_ds.py`, `gen.py`, `download.py`.

## Gallery

### Music Player App UI (dark theme)

- Folder: [designs/2026-10-10-music-player/](designs/2026-10-10-music-player/)
- Instagram: *not posted* (sample style pin)
- Gumroad: —

### Flat Shop App UI (flat design, light + dark)

- Folder: [designs/2026-10-10-flat-shop/](designs/2026-10-10-flat-shop/)
- Instagram: https://www.instagram.com/p/DeUPQmJG3Ek/
- Gumroad: https://narenkumar1.gumroad.com/l/flat-shop-ui-kit
- Kit source: [designs/2026-10-10-flat-shop/kit/](designs/2026-10-10-flat-shop/kit/)
- Stitch HTML: [designs/2026-10-10-flat-shop/stitch/](designs/2026-10-10-flat-shop/stitch/)

### Pulse Fit App UI (neo-brutalism, light + dark)

- Folder: [designs/2026-10-11-pulse-fit/](designs/2026-10-11-pulse-fit/)
- Instagram: https://www.instagram.com/p/DeWG_vjFKn7/
- Gumroad: https://narenkumar1.gumroad.com/l/pulse-fit-ui-kit
- Kit source: [designs/2026-10-11-pulse-fit/kit/](designs/2026-10-11-pulse-fit/kit/)
- Stitch HTML: [designs/2026-10-11-pulse-fit/stitch/](designs/2026-10-11-pulse-fit/stitch/)
- Comment keyword: PULSE

### Penny Budget App UI (minimalism, light + dark)

- Folder: [designs/2026-10-12-penny-budget/](designs/2026-10-12-penny-budget/)
- Instagram: https://www.instagram.com/p/DeYXyORERr7/
- Gumroad: https://narenkumar1.gumroad.com/l/penny-budget-ui-kit
- Kit source: [designs/2026-10-12-penny-budget/kit/](designs/2026-10-12-penny-budget/kit/)
- Stitch HTML: [designs/2026-10-12-penny-budget/stitch/](designs/2026-10-12-penny-budget/stitch/)
- Comment keyword: PENNY

## License / use

Design concepts here are private reference material for @code.in.30s. Recreate them in your own code for portfolio practice. Do not reclaim the Instagram posts or Gumroad product as your own listing without permission.
