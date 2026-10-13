#!/bin/bash
cd "$(dirname "$0")"
for f in ${@:-*.html}; do n=${f%.html}
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=390,800 --virtual-time-budget=8000 --screenshot=$n.png "file://$(pwd)/$f" >/dev/null 2>&1
  echo "$n.png $(identify -format '%wx%h' $n.png 2>/dev/null || echo '?')"
done
