"""Gumroad previews for the Orbit kit: cover 1280x720, thumbnail 600x600, gallery 1-3 = slide 2, slide 3, pin; gallery 4 = Stitch designs.
Uses the slide style (dot grid, browser-window frames, phone). Run with /workspace/.venv-pw/bin/python previews.py"""
import os,shutil,sys
sys.argv=[sys.argv[0],os.path.join(os.path.dirname(os.path.abspath(__file__)),'config.json')]
os.environ['ONLY']='none'  # import render helpers without rendering slides
import render as R
P='/workspace/pins/2026-10-25-job-tracker/'; ST=P+'stitch/'; OUT='/workspace/products/job-tracker-ui-kit/previews/'; os.makedirs(OUT,exist_ok=True)
R.out=OUT
def shot(name,W,H,body,cls):
  f=OUT+'_'+name+'.html'; open(f,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{R.CSS} header,footer{{display:none}}</style></head><body class="{cls}" style="width:{W}px;height:{H}px"><div class="dots"></div><div class="glow" style="top:{H*0.35:.0f}px"></div>{body}</body></html>')
  pg=R.browser().new_page(viewport={'width':W,'height':H}); pg.goto('file://'+f); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
  pg.screenshot(path=OUT+name+'.png'); pg.close(); os.remove(f); print('wrote',name)
F=R.Frames
cv=F([{"k":"win","s":"dark-board","x":600,"y":150,"w":560,"rot":-6,"z":1,"crop":[248,0,1192,900],"url":"orbit.app/board"},
      {"k":"win","s":"light-dashboard","x":660,"y":110,"w":600,"z":2,"url":"orbit.app/dashboard"},
      {"k":"ph","s":"light-mboard","x":1080,"y":300,"w":180,"rot":7,"z":3}])
shot('cover-1280x720',1280,720,f'''<h1 style="top:120px;left:60px;right:auto;width:560px;font-size:66px">Orbit<span class="acc">Job Tracker UI Kit</span></h1>
<p class="sub" style="top:300px;left:62px;right:auto;width:520px;font-size:24px">Dashboard, kanban board, application detail, interview calendar + settings. Light + dark in HTML, Tailwind and vanilla JS.</p>
<div class="chip" style="left:60px;top:470px"><i></i>$3 · no build step</div><div class="chip" style="left:300px;top:470px"><i></i>Drag &amp; drop + CSV</div>
<p style="position:absolute;left:62px;bottom:52px;font:600 20px Geist;color:#EEF3EC;z-index:20">code.in.30s</p>{cv.html}''','dk')
th=F([{"k":"win","s":"light-board","x":40,"y":190,"w":470,"rot":-3,"z":1,"crop":[248,0,1192,860],"url":"orbit.app/board"},
      {"k":"ph","s":"dark-mboard","x":400,"y":250,"w":170,"rot":6,"z":2}])
shot('thumbnail-600x600',600,600,f'''<h1 class="c" style="top:44px;left:0;right:0;font-size:58px">Orbit <em>UI</em></h1>
<p class="sub c" style="top:118px;left:0;right:0;font-size:20px">Job tracker dashboard kit · light + dark</p>{th.html}''','lt')
items=[("light-dashboard","Dashboard · light"),("light-board","Board · light"),("light-detail","Detail · light"),("dark-dashboard","Dashboard · dark")]
imgs=''.join(f'<div style="position:absolute;left:{60+(i%2)*590}px;top:{220+(i//2)*370}px;width:570px;height:330px;border-radius:20px;overflow:hidden;z-index:10;border:1.5px solid #E6E4DC;box-shadow:0 30px 60px -30px rgba(20,24,26,.45)"><img src="file://{ST}{n}.png" style="width:100%"></div><p style="position:absolute;left:{60+(i%2)*590}px;top:{556+(i//2)*370}px;width:570px;text-align:center;font:500 18px Geist;color:#5E6660;z-index:10">{lab}</p>' for i,(n,lab) in enumerate(items))
shot('gallery-4-stitch',1280,960,f'''<h1 class="c" style="top:60px;font-size:56px">Original <em>Google Stitch</em> designs</h1>
<p class="sub c" style="top:144px;font-size:22px">5 Stitch screens (PNG + HTML) included in design/stitch/</p>{imgs}''','lt')
for src,dst in [('slide-2','gallery-1-light'),('slide-3','gallery-2-dark'),('pin','gallery-3-palette-pin')]:
  shutil.copy(P+'final/'+src+'.png',OUT+dst+'.png'); print('copied',dst)
