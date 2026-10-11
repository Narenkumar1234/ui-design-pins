"""Regenerate Pulse Fit framed pins (PNGs are local only, never committed).

Run from anywhere:  python3 designs/2026-10-11-pulse-fit/src/build.py
  1) screenshots screens/*.html -> screens/*.png (390x844) if missing
  2) builds src/_*.html from template.html
  3) screenshots pinterest-{light,dark}.png (1000x1500), instagram-{light,dark}.png (1080x1350)
     and instagram-cta.png (1080x1350, from src/cta.html) into the design folder
"""
import subprocess, time, os, glob
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CH=['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars']
for h in sorted(glob.glob('screens/*.html')):
  p=h[:-5]+'.png'
  if not os.path.exists(p):
    subprocess.run(CH+['--window-size=390,844','--virtual-time-budget=4000',f'--screenshot={p}',h],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
    print('screen',p)
T=open('src/template.html').read()
light=dict(bg='#FFF8E7',ink='#111111',muted='#5A5A5A',primary='#C8F542',onp='#111111',blue='#4D7CFE',pink='#FF5C8A',yellow='#FFE566',
 card='#FFFFFF',cardb='#111111',frame='#111111',frameb='#111111',tagbg='#C8F542',tagfg='#111111',tagbd='#111111',shadow='#111111')
dark=dict(bg='#0E0F12',ink='#F5F5F0',muted='#A0A3B0',primary='#D4FF5E',onp='#0E0F12',blue='#6B8FFF',pink='#FF7AA2',yellow='#FFE566',
 card='#1A1C24',cardb='#F5F5F0',frame='#000000',frameb='#F5F5F0',tagbg='#D4FF5E',tagfg='#0E0F12',tagbd='#F5F5F0',shadow='#000000')
sb={'light':('#FFF8E7','#FFF8E7','#FFF8E7'),'dark':('#0E0F12','#0E0F12','#0E0F12')}
for mode,pal in (('light',light),('dark',dark)):
  v=';'.join(f'--{k}:{x}' for k,x in pal.items()); M=mode.capitalize()
  for size,(w,h),title in (
    ('pin',(1000,1500),f'Pulse Fit App UI<br><span class="mode">— {M} Mode</span>'),
    ('ig',(1080,1350),f'Pulse Fit App UI <span class="mode">— {M}</span>'),
  ):
    name=('pinterest' if size=='pin' else 'instagram')+'-'+mode
    html=T.replace('%%VARS%%',v).replace('%%SIZE%%',size).replace('%%TITLE%%',title).replace('%%MODE%%',mode)\
      .replace('%%SBFG%%',pal['ink']).replace('%%SB_today%%',sb[mode][0]).replace('%%SB_workout%%',sb[mode][1]).replace('%%SB_progress%%',sb[mode][2])
    open(f'src/_{name}.html','w').write(html)
    out=f'{name}.png'
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',
      f'--window-size={w},{h}','--virtual-time-budget=4000',f'--screenshot={out}',f'src/_{name}.html'],
      stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
    print('wrote',out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')
subprocess.run(CH+['--window-size=1080,1350','--virtual-time-budget=4000','--screenshot=instagram-cta.png','src/cta.html'],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
print('wrote instagram-cta.png')
