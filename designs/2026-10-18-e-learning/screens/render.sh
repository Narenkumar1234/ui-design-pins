#!/bin/bash
# Render kit pages as phone screens: 390x820 @2x (780x1640), fresh Chrome profile per shot, then copy to ../final/screens/
# Usage: ./render.sh [name=page?query ...]   e.g. light-home=index.html?theme=light
cd "$(dirname "$0")"
KIT=/workspace/products/e-learning-ui-kit/code
DEF="light-home=index.html?theme=light light-explore=explore.html?theme=light light-course=course.html?id=js-basics&theme=light dark-home=index.html?theme=dark dark-explore=explore.html?theme=dark dark-course=course.html?id=js-basics&theme=dark light-progress=progress.html?theme=light dark-progress=progress.html?theme=dark"
for pair in ${@:-$DEF}; do n=${pair%%=*}; page=${pair#*=}
  P=$(mktemp -d)
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --user-data-dir=$P --force-device-scale-factor=2 \
    --window-size=390,820 --virtual-time-budget=6000 --screenshot=$n.png "file://$KIT/$page&shot=1" >/dev/null 2>&1
  rm -rf $P
  python3 -c "from PIL import Image;i=Image.open('$n.png');print('$n.png',i.size)"
  cp $n.png ../final/screens/$n.png
done
