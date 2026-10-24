"""Gumroad previews for the Nimbus kit: cover 1280x720, thumbnail 600x600, gallery 1-3 = slide 2, slide 3, pin; gallery 4 = Stitch designs.
Uses the slide style (sky gradient, glass stage, titanium phones). Run with /workspace/.venv-pw/bin/python previews.py"""
import os,shutil
from PIL import Image
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); CSS=open(os.path.join(HERE,'style.css')).read()
P='/workspace/pins/2026-10-24-weather-app/'; SC=P+'final/screens/'; ST=P+'stitch/'; OUT='/workspace/products/weather-app-ui-kit/previews/'; os.makedirs(OUT,exist_ok=True)
def topcolor(src):
  im=Image.open(src).convert('RGB'); px=im.getpixel((im.width//2,3)); return '#%02x%02x%02x'%px, (.299*px[0]+.587*px[1]+.114*px[2])<140
def phone(n,cx,cy,w,rot,z,cls=''):
  src=SC+n+'.png'; h=w*19.3/9; col,wt=topcolor(src)
  return f'''<div class="phone{' dk' if n.startswith('dark') else ''} {cls}" style="width:{w}px;left:{cx-w/2:.1f}px;top:{cy-h/2:.1f}px;z-index:{z+10};transform:rotate({rot}deg)"><div class="scr" style="background:{col}"><div class="sb{' wt' if wt else ''}"><span>9:41</span><span class="ic"><i></i><i></i><i></i><b></b></span></div><img src="file://{src}"><div class="notch"></div><div class="home"></div></div></div>'''
fan=lambda items: ''.join(phone(*a) for a in items)
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  def shot(name,W,H,body,cls=''):
    f=os.path.join(OUT,'_'+name+'.html'); stars='<div class="stars"></div>' if 'night' in cls else ''
    open(f,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} header,footer{{display:none}}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">{stars}<div class="glow"></div><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>{body}</body></html>')
    pg=b.new_page(viewport={'width':W,'height':H}); pg.goto('file://'+f); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+name+'.png'); pg.close(); os.remove(f); print('wrote',name)
  shot('cover-1280x720',1280,720,f'''<h1 style="top:110px;font-size:60px;width:660px;letter-spacing:-2.4px">Nimbus<br><em>Weather App UI Kit</em></h1>
<p class="sub" style="top:290px;width:540px;font-size:24px">Home, Forecast, Cities, Details + Settings. Glass light + dark in HTML, Tailwind and vanilla JS.</p>
<div class="gchip v" style="left:60px;top:440px;font-size:20px"><i></i>$3 · no build step</div><div class="gchip" style="left:300px;top:440px;font-size:20px"><i></i>Live Open-Meteo toggle</div>
<p style="position:absolute;left:62px;bottom:52px;font-size:20px;font-weight:600;color:#0F2A4A;z-index:20">code.in.30s</p>
<div class="stage" style="left:700px;top:90px;width:540px;height:700px"></div>
{fan([("light-forecast",800,500,230,-8,1),("dark-home",1150,500,230,8,1),("light-home",975,470,250,0,2)])}''')
  shot('thumbnail-600x600',600,600,f'''<h1 class="c" style="top:40px;left:0;right:0;font-size:50px;letter-spacing:-2px">Nimbus <em>UI</em></h1>
<p class="sub c" style="top:106px;left:0;right:0;font-size:19px">Glass weather app kit · light + dark</p>
<div class="stage" style="left:30px;right:30px;top:160px;height:500px;border-radius:44px"></div>
{fan([("light-forecast",165,440,170,-8,1),("dark-home",435,440,170,8,1),("light-home",300,420,185,0,2)])}''')
  imgs=''.join(f'<div style="position:absolute;left:{60+i*300}px;top:230px;width:270px;height:612px;border-radius:30px;overflow:hidden;z-index:10;box-shadow:0 30px 60px -30px rgba(15,42,74,.5);border:2px solid rgba(255,255,255,.8)"><img src="file://{ST}{n}.png" style="width:100%"></div><p style="position:absolute;left:{60+i*300}px;top:860px;width:270px;text-align:center;font-size:18px;color:#3F5E82;z-index:10">{lab}</p>' for i,(n,lab) in enumerate([("light-home","Home · light"),("light-cities","Cities · light"),("light-details","Details · light"),("dark-home","Home · dark")]))
  shot('gallery-4-stitch',1280,960,f'''<h1 class="c" style="top:70px;font-size:56px;letter-spacing:-2px">Original <em>Google Stitch</em> designs</h1>
<p class="sub c" style="top:150px;font-size:22px">7 Stitch screens (PNG + HTML) included in design/stitch/</p>{imgs}''')
  b.close()
for src,dst in [('slide-2','gallery-1-light'),('slide-3','gallery-2-dark'),('pin','gallery-3-palette-pin')]:
  shutil.copy(P+'final/'+src+'.png',OUT+dst+'.png'); print('copied',dst)
