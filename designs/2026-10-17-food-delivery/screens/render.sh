#!/bin/bash
# Render cleaned screens at 390x800 @2x (780x1600) with headless Chrome, then copy to ../final/screens/
cd "$(dirname "$0")"
for f in ${@:-*.html}; do n=${f%.html}
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=390,800 --virtual-time-budget=9000 --screenshot=$n.png "file://$(pwd)/$f" >/dev/null 2>&1
  python3 -c "from PIL import Image;i=Image.open('$n.png');print('$n.png',i.size)"
  cp $n.png ../final/screens/$n.png
done
