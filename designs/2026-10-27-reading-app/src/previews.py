"""Gumroad previews for the Folio kit: cover 1280x720, thumbnail 600x600, gallery 1-3 = slide 2, slide 4, pin; gallery 4 = Stitch designs.
Reuses phone/page helpers from render.py. Run: /workspace/.venv-pw/bin/python previews.py"""
import os,sys,shutil
HERE=os.path.dirname(os.path.abspath(__file__))
sys.argv=[__file__,os.path.join(HERE,'config.json')]
src=open(os.path.join(HERE,'render.py')).read(); exec(src[:src.index('_PW=None')])
P='/workspace/pins/2026-10-27-reading-app/'; SC=P+'final/screens/'; ST=P+'stitch/'
OUT='/workspace/products/reading-app-ui-kit/previews/'; os.makedirs(OUT,exist_ok=True)
def ph(n,cx,cy,w,rot=0,z=1): return phone(SC+n+'.png',w,cx,cy,rot,z)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  def shot(name,W,H,body,cls=''):
    f=os.path.join(OUT,'_'+name+'.html')
    open(f,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} header,footer{{display:none}}</style></head><body class="{cls}" style="width:{W}px;height:{H}px"><div class="floor"></div>{body}</body></html>')
    pg=b.new_page(viewport={'width':W,'height':H}); pg.goto('file://'+f); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+name+'.png'); pg.close(); os.remove(f); print('wrote',name)
  shot('cover-1280x720',1280,720,f'''<h1 style="top:110px;font-size:66px;width:620px;letter-spacing:-2.4px">Folio<br><em>Reading Tracker</em><br>UI Kit</h1>
<p class="sub" style="top:345px;width:560px;font-size:24px;right:auto">Home, Book, Library, Reader + Profile. Light + dark in HTML, Tailwind and vanilla JS.</p>
<div class="fchip o" style="left:60px;top:470px"><i></i>$3 · no build step</div><div class="fchip k" style="left:320px;top:470px"><i></i>Streaks + highlights</div>
<p style="position:absolute;left:62px;bottom:52px;font-size:20px;font-weight:700;color:#141414;z-index:20">code.in.30s</p>
{ph("light-detail",830,480,240,-7,1)}{ph("dark-home",1110,480,240,7,1)}{ph("light-home",970,450,262,0,2)}''')
  shot('thumbnail-600x600',600,600,f'''<h1 class="c" style="top:38px;left:0;right:0;font-size:52px;letter-spacing:-2px">Folio <em>UI</em></h1>
<p class="sub c" style="top:104px;left:0;right:0;font-size:19px">Reading tracker kit · light + dark</p>
{ph("light-detail",165,440,180,-7,1)}{ph("dark-home",435,440,180,7,1)}{ph("light-home",300,410,200,0,2)}''')
  imgs=''.join(f'<div style="position:absolute;left:{70+i*290}px;top:230px;width:270px;height:585px;border-radius:30px;overflow:hidden;z-index:10;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.4);border:6px solid #141414"><img src="file://{ST}{n}.png" style="width:100%;height:100%;object-fit:cover;object-position:top"></div><p style="position:absolute;left:{70+i*290}px;top:835px;width:270px;text-align:center;font-size:18px;color:#5F5F5F;z-index:10;font-weight:600">{lab}</p>' for i,(n,lab) in enumerate([("light-detail","Book · light"),("light-profile","Profile · light"),("light-reader","Reader · light"),("dark-home","Home · dark")]))
  shot('gallery-4-stitch',1280,960,f'''<h1 class="c" style="top:70px;font-size:56px;letter-spacing:-2px">Original <em>Google Stitch</em> designs</h1>
<p class="sub c" style="top:150px;font-size:22px">6 Stitch screens (PNG + HTML) included in design/stitch/</p>{imgs}''')
  b.close()
for s,d in [('slide-2','gallery-1-light'),('slide-4','gallery-2-dark'),('pin','gallery-3-palette-pin')]:
  shutil.copy(P+'final/'+s+'.png',OUT+d+'.png'); print('copied',d)
