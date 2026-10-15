import sys,glob
from PIL import Image,ImageDraw
fs=sorted(sys.argv[2:]); W,H=260,200; cols=6; rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*W,rows*(H+16)),'white'); d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB'); im.thumbnail((W-6,H-6)); x,y=(i%cols)*W,(i//cols)*(H+16)
    S.paste(im,(x+3,y+3)); d.text((x+3,y+H),f.split('/')[-1][2:20],fill='black')
S.save(sys.argv[1])
