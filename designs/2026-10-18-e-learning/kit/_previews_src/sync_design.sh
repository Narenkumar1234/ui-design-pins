#!/bin/sh
# copy Stitch screens + art sheet + final phone screens into the kit's design/ folder
S=/workspace/pins/2026-10-18-e-learning/stitch; K=/workspace/products/e-learning-ui-kit/design
mkdir -p $K/stitch-html $K/mockups
for f in $S/light-*.png $S/dark-*.png; do b=$(basename $f); cp $f $K/stitch-$b; done
for f in $S/light-*.html $S/dark-*.html; do b=$(basename $f); cp $f $K/stitch-html/$b; done; cp $S/art-art.html $K/stitch-html/clay-sticker-sheet.html
cp $S/art-art.png $K/stitch-clay-sticker-sheet.png
cp /workspace/pins/2026-10-18-e-learning/final/screens/*.png $K/mockups/
ls -R $K | head -40
