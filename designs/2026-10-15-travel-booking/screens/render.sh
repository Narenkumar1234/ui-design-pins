#!/bin/bash
cd "$(dirname "$0")"
for f in ${@:-*.html}; do n=${f%.html}
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=390,800 --virtual-time-budget=8000 --screenshot=$n.png "file://$(pwd)/$f" >/dev/null 2>&1
  python3 -c "from PIL import Image;i=Image.open('$n.png');print('$n.png',i.size)"
done
