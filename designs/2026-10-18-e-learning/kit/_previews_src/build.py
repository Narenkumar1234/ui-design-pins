"""Gumroad preview images for Lumo E-learning App UI Kit (pastel 3D clay, sky blue + periwinkle, Fredoka)."""
import subprocess, os, shutil, tempfile
D=os.path.dirname(os.path.abspath(__file__))+'/'; OUT=D+'../previews/'
os.makedirs(OUT, exist_ok=True)
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:Nunito,sans-serif;overflow:hidden;position:relative;color:#1F2A44;background:linear-gradient(180deg,#CFE3FF 0%,#DCEBFF 50%,#E8F1FF 100%)}
.glow{position:absolute;left:50%;top:60%;width:1300px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.85) 0,rgba(255,255,255,.3) 40%,rgba(255,255,255,0) 68%)}
.ph{position:absolute;background:#fff;border-radius:46px;padding:9px;z-index:3;box-shadow:0 0 0 2px #D5E3F8,0 44px 70px -26px rgba(46,84,150,.42)}
.ph.dk{background:#0C1220;box-shadow:0 0 0 2px #2A3A5C,0 44px 70px -26px rgba(8,14,30,.6)}
.ph img{display:block;width:100%;border-radius:37px}
h1,h2{font-family:Fredoka,Nunito,sans-serif;font-weight:600;letter-spacing:-1px;line-height:1.04}
em{font-style:normal;color:#4F86E3}
.pill{display:inline-block;background:#fff;border-radius:999px;padding:9px 18px;font:800 15px Nunito;color:#1F2A44;box-shadow:0 10px 22px -14px rgba(46,84,150,.5)}
.pill.a{background:linear-gradient(135deg,#8FB8F5,#5F96EC);color:#fff}
.tag{font:800 13px Nunito;letter-spacing:4px;text-transform:uppercase;color:#4F86E3}p.s{color:#5F6F8E;font-weight:600}
.clay{position:absolute;z-index:4;filter:drop-shadow(0 24px 22px rgba(46,84,150,.28))}
.z{position:relative;z-index:5}"""
F='<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">'
def ph(s,x,y,w,dark=False,z=3): return f'<div class="ph{" dk" if dark else ""}" style="left:{x}px;top:{y}px;width:{w}px;z-index:{z}"><img src="shots/{s}"></div>'
def clay(n,x,y,w,r=0): return f'<img class="clay" src="../code/img/{n}.png" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({r}deg)">'
def page(n,w,h,body):
    p=D+n+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8">{F}<style>{CSS}</style></head><body style="width:{w}px;height:{h}px"><div class="glow"></div>{body}</body></html>')
    prof=tempfile.mkdtemp()
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--user-data-dir={prof}',f'--window-size={w},{h}','--virtual-time-budget=6000',f'--screenshot={OUT}{n}.png',f'file://{p}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    shutil.rmtree(prof,True); print(n,os.path.getsize(OUT+n+'.png'))
page('cover-1280x720',1280,720,f'''<div class="z" style="position:absolute;left:64px;top:84px;width:540px"><div class="tag">UI kit · HTML + Tailwind</div>
<h1 style="font-size:68px;margin-top:20px">Study apps can<br>be this <em>cute</em></h1>
<p class="s" style="font-size:20px;line-height:1.5;margin-top:20px">Lumo: e-learning app with Home, Explore, Lesson player and Progress. Pastel 3D clay, light + navy dark.</p>
<div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><span class="pill a">Light + dark</span><span class="pill">4 pages</span><span class="pill">Working player + quiz</span><span class="pill">$3 kit</span></div>
<p style="position:absolute;top:540px;font:600 22px Fredoka">@code.in.30s</p></div>
{clay("bulb",1112,-14,150)}{ph("mobile-light-home.png",650,150,270,False,4)}{ph("mobile-dark-explore.png",945,188,250,True,3)}''')
page('thumbnail-600x600',600,600,f'''<h2 class="z" style="position:absolute;top:30px;width:100%;text-align:center;font-size:56px">Lumo<em>.</em></h2>
{ph("mobile-light-home.png",70,140,215,False,4)}{ph("mobile-dark-course.png",315,170,215,True,3)}{clay("bulb",478,2,112)}''')
def gal(n,t,s,shots,darks,clays=''):
    body=f'<div class="z" style="position:absolute;left:64px;top:46px"><h2 style="font-size:46px">{t}</h2><p class="s" style="font-size:19px;margin-top:8px">{s}</p></div>'
    xs=[300,680] if len(shots)==2 else [130,490,850]
    for i,sh in enumerate(shots): body+=ph(sh,xs[i],190,300,darks[i])
    page(n,1280,720,body+clays)
gal('gallery-1-light-vs-dark','Light and <em>navy dark</em>','Sky blue + periwinkle by day, deep navy by night. One toggle, saved in localStorage.',['mobile-light-home.png','mobile-dark-home.png'],[False,True],clay('pencil',1030,250,170,10)+clay('books',80,330,180,-6))
gal('gallery-2-explore-lesson','Explore + <em>lesson player</em>','Staggered pastel subject grid, live search, play / seek / speed, lessons, notes and quiz.',['mobile-light-explore.png','mobile-light-course.png','mobile-dark-explore.png'],[False,False,True])
gal('gallery-3-progress-quiz','Streak, goals + <em>quiz</em>','7-day streak, weekly minutes chart with a goal line, badges and an instant-feedback quiz.',['mobile-light-progress.png','mobile-dark-progress.png','state-quiz-light.png'],[False,True,False])
gal('gallery-4-stitch','Original <em>Google Stitch</em> designs','Stitch mobile screens (PNG + HTML) and the 3D clay sticker sheet included.',['../../design/stitch-light-home.png','../../design/stitch-dark-home.png','../../design/stitch-light-course.png'],[False,True,False])
