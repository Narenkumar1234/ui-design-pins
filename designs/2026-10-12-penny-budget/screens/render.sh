#!/bin/bash
# Render patched Stitch HTML screens to 390x800 (matches phone frame inner area) PNGs (2x) for framing
cd "$(dirname "$0")"
for f in ${@:-*.html}; do n=${f%.html}
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=390,800 --virtual-time-budget=6000 --screenshot=$n.png $f >/dev/null 2>&1
  echo "$n.png"; done
