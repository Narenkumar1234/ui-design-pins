#!/bin/bash
# Render kit pages as phone screens: 390x820 @2x (780x1640), fresh Chrome profile per shot (clean localStorage), then copy to ../final/screens/
# Usage: ./render.sh [name=page?query ...]   e.g. dark-home=index.html?theme=dark
cd "$(dirname "$0")"
KIT=/workspace/products/smart-home-ui-kit/code
DEF="dark-welcome=welcome.html?theme=dark dark-home=index.html?theme=dark dark-climate=room.html?id=living&tab=climate&theme=dark dark-lights=room.html?id=living&tab=lights&theme=dark dark-energy=energy.html?theme=dark light-welcome=welcome.html?theme=light light-home=index.html?theme=light light-climate=room.html?id=living&tab=climate&theme=light light-lights=room.html?id=living&tab=lights&theme=light light-energy=energy.html?theme=light"
for pair in ${@:-$DEF}; do n=${pair%%=*}; page=${pair#*=}
  P=$(mktemp -d)
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --user-data-dir=$P --force-device-scale-factor=2 \
    --window-size=390,820 --virtual-time-budget=6000 --screenshot=$n.png "file://$KIT/$page&shot=1" >/dev/null 2>&1
  rm -rf $P
  python3 -c "from PIL import Image;i=Image.open('$n.png');print('$n.png',i.size)"
  cp $n.png ../final/screens/$n.png
done
