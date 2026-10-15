"""Gumroad preview images for Roam Travel Booking App UI Kit (teal-navy + azure, glass)."""
import subprocess, os
D=os.path.dirname(os.path.abspath(__file__))+'/'; OUT=D+'../previews/'
os.makedirs(OUT, exist_ok=True)
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;position:relative;color:#fff;background:#17324A}
.bgimg{position:absolute;inset:-50px;background:url(bg.jpg) center/cover;filter:blur(24px) brightness(.8)}
.tint{position:absolute;inset:0;background:linear-gradient(160deg,rgba(23,50,74,.9),rgba(30,69,96,.8) 50%,rgba(16,36,56,.93))}
.ghost{position:absolute;left:0;right:0;text-align:center;font-style:italic;font-weight:800;letter-spacing:-10px;color:rgba(255,255,255,.08);line-height:1}
.ph{position:absolute;background:#F4F9FF;border-radius:40px;padding:8px;box-shadow:0 0 0 2px rgba(255,255,255,.5),0 40px 70px -20px rgba(3,12,22,.7)}
.ph.dk{background:#0B1724;box-shadow:0 0 0 2px rgba(255,255,255,.2),0 40px 70px -20px rgba(0,0,0,.75)}
.ph img{display:block;width:100%;border-radius:32px}
b.g{background:linear-gradient(90deg,#5AA7FF,#A9D3FF);-webkit-background-clip:text;color:transparent}
.pill{display:inline-block;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);border-radius:999px;padding:8px 16px;font:600 15px 'Plus Jakarta Sans';color:#fff}
.pill.a{border-color:transparent;background:linear-gradient(90deg,#3B8CF5,#5AA7FF)}
.tag{font:600 14px 'Plus Jakarta Sans';letter-spacing:4px;text-transform:uppercase;color:rgba(230,242,253,.7)}p.s{color:rgba(230,242,253,.78)}
.z{position:relative;z-index:2}"""
F='<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,800&display=swap" rel="stylesheet">'
def ph(s,x,y,w,dark=False,rot=0): return f'<div class="ph{" dk" if dark else ""}" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg);z-index:3"><img src="shots/{s}"></div>'
def page(n,w,h,body,ghost='ROAM',gy=None,gs=300):
    gy=h*0.42 if gy is None else gy
    p=D+n+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8">{F}<style>{CSS}</style></head><body style="width:{w}px;height:{h}px"><div class="bgimg"></div><div class="tint"></div><div class="ghost" style="top:{gy}px;font-size:{gs}px">{ghost}</div>{body}</body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}','--virtual-time-budget=6000',f'--screenshot={OUT}{n}.png',f'file://{p}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print(n,os.path.exists(OUT+n+'.png'), os.path.getsize(OUT+n+'.png') if os.path.exists(OUT+n+'.png') else 0)
page('cover-1280x720',1280,720,f'''<div class="z" style="position:absolute;left:64px;top:84px;width:500px"><div class="tag">UI kit · HTML + Tailwind</div>
<h1 style="font:800 58px/1.05 'Plus Jakarta Sans';letter-spacing:-2px;margin-top:22px">If I were designing<br>your <b class="g">travel app</b></h1>
<p class="s" style="font:400 20px/1.5 'Plus Jakarta Sans';margin-top:20px">Roam: soft-glass destination explorer + booking app. Light + dark, one azure accent.</p>
<div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><span class="pill a">Light + dark</span><span class="pill">3 screens</span><span class="pill">$3 kit</span></div>
<p style="position:absolute;top:530px;font:700 22px 'Plus Jakarta Sans'">@code.in.30s</p></div>
{ph("kit-dark-home.png",640,90,250,True,-5)}{ph("kit-light-home.png",880,60,265,False,4)}''',gy=380,gs=330)
page('thumbnail-600x600',600,600,f'''{ph("kit-light-home.png",64,120,210,False,-4)}{ph("kit-dark-detail.png",320,100,210,True,4)}
<h2 class="z" style="position:absolute;top:28px;width:100%;text-align:center;font:800 40px 'Plus Jakarta Sans';letter-spacing:-1px">Roam<b class="g">.</b></h2>''',gy=260,gs=200)
def gal(n,t,s,shots,darks):
    body=f'<div class="z" style="position:absolute;left:64px;top:50px"><h2 style="font:800 40px \'Plus Jakarta Sans\';letter-spacing:-1px">{t}</h2><p class="s" style="font:400 19px \'Plus Jakarta Sans\';margin-top:8px">{s}</p></div>'
    xs=[290,690] if len(shots)==2 else [130,490,850]
    for i,sh in enumerate(shots): body+=ph(sh,xs[i],170,300,darks[i])
    page(n,1280,720,body,gy=300,gs=360)
gal('gallery-1-light-vs-dark','Light and dark, one toggle','Pale-sky glass by day, deep teal-navy by night. Same azure accent.',['kit-light-home.png','kit-dark-home.png'],[False,True])
gal('gallery-2-explore','Explore with chips + search','Beaches · Mountains · Cities · Lakes, live search, big feature card',['kit-light-explore.png','kit-dark-explore.png'],[False,True])
gal('gallery-3-booking','Detail page + booking sheet','Photo gallery, facilities, read more, guests stepper and total',['kit-light-detail.png','state-booking-sheet.png','kit-dark-detail.png'],[False,False,True])
gal('gallery-4-stitch','Original Google Stitch designs','6 Stitch mobile screens included, light + dark',['../../design/stitch-light-home.png','../../design/stitch-dark-explore.png','../../design/stitch-light-detail.png'],[False,True,False])
