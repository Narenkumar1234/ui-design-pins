"""Gumroad preview images for Ember Food Delivery App UI Kit (cream + terracotta, serif)."""
import subprocess, os
D=os.path.dirname(os.path.abspath(__file__))+'/'; OUT=D+'../previews/'
os.makedirs(OUT, exist_ok=True)
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;overflow:hidden;position:relative;color:#2B1D14;background:radial-gradient(120% 90% at 85% 10%,#FDE3D2 0%,#FBF4EC 55%,#F6EADC 100%)}
.ghost{position:absolute;left:0;right:0;text-align:center;font-family:Newsreader,serif;font-style:italic;font-weight:400;letter-spacing:-8px;color:rgba(232,98,44,.07);line-height:1}
.ph{position:absolute;background:#fff;border-radius:44px;padding:9px;box-shadow:0 0 0 1.5px #EBDDCF,0 40px 70px -24px rgba(90,50,20,.35)}
.ph.dk{background:#140E0B;box-shadow:0 0 0 1.5px #3A2A22,0 40px 70px -24px rgba(40,20,10,.55)}
.ph img{display:block;width:100%;border-radius:35px}
h1,h2{font-family:Newsreader,serif;font-weight:400;letter-spacing:-1.5px}
em{font-style:italic;color:#E8622C}
.pill{display:inline-block;border:1.5px solid #EBDDCF;background:#fff;border-radius:999px;padding:8px 16px;font:600 15px 'DM Sans';color:#2B1D14}
.pill.a{border-color:transparent;background:linear-gradient(135deg,#E8622C,#C9502A);color:#fff}
.tag{font:700 13px 'DM Sans';letter-spacing:4px;text-transform:uppercase;color:#C9502A}p.s{color:#8C7B6E}
.z{position:relative;z-index:2}"""
F='<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
def ph(s,x,y,w,dark=False,rot=0): return f'<div class="ph{" dk" if dark else ""}" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg);z-index:3"><img src="shots/{s}"></div>'
def page(n,w,h,body,ghost='Ember',gy=None,gs=300):
    gy=h*0.42 if gy is None else gy
    p=D+n+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8">{F}<style>{CSS}</style></head><body style="width:{w}px;height:{h}px"><div class="ghost" style="top:{gy}px;font-size:{gs}px">{ghost}</div>{body}</body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}','--virtual-time-budget=6000',f'--screenshot={OUT}{n}.png',f'file://{p}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print(n,os.path.getsize(OUT+n+'.png'))
page('cover-1280x720',1280,720,f'''<div class="z" style="position:absolute;left:64px;top:80px;width:540px"><div class="tag">UI kit · HTML + Tailwind</div>
<h1 style="font-size:66px;line-height:1.02;margin-top:20px">A food app that<br>feels <em>warm</em></h1>
<p class="s" style="font:400 20px/1.5 'DM Sans';margin-top:20px">Ember: food delivery app with Home, Restaurant, Dish, Cart and live Tracking. Light + espresso dark.</p>
<div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><span class="pill a">Light + dark</span><span class="pill">5 pages</span><span class="pill">Working cart</span><span class="pill">$3 kit</span></div>
<p style="position:absolute;top:540px;font:700 22px 'DM Sans'">@code.in.30s</p></div>
<img src="bowl.png" style="position:absolute;right:-110px;top:-120px;width:380px;z-index:1;filter:drop-shadow(0 30px 40px rgba(90,50,20,.3))">
{ph("mobile-dark-home.png",640,110,250,True,-5)}{ph("mobile-light-home.png",880,70,265,False,4)}''',gy=430,gs=300)
page('thumbnail-600x600',600,600,f'''{ph("mobile-light-home.png",64,130,210,False,-4)}{ph("mobile-dark-dish.png",320,110,210,True,4)}
<h2 class="z" style="position:absolute;top:26px;width:100%;text-align:center;font-size:52px">Ember<em>.</em></h2>''',gy=280,gs=190)
def gal(n,t,s,shots,darks):
    body=f'<div class="z" style="position:absolute;left:64px;top:46px"><h2 style="font-size:46px">{t}</h2><p class="s" style="font:400 19px \'DM Sans\';margin-top:6px">{s}</p></div>'
    xs=[290,690] if len(shots)==2 else [130,490,850]
    for i,sh in enumerate(shots): body+=ph(sh,xs[i],180,300,darks[i])
    page(n,1280,720,body,gy=300,gs=340)
gal('gallery-1-light-vs-dark','Light and <em>espresso dark</em>','Cream + terracotta by day, warm brown by night. One toggle, saved in localStorage.',['mobile-light-home.png','mobile-dark-home.png'],[False,True])
gal('gallery-2-restaurant-dish','Restaurant + <em>dish detail</em>','Menu tabs, circle-cut photos, extras checklist, qty stepper and a live total CTA.',['mobile-light-restaurant.png','mobile-light-dish.png','mobile-dark-dish.png'],[False,False,True])
gal('gallery-3-cart-tracking','Cart, promo code + <em>live tracking</em>','Code EMBER30, bill summary, place order, then a simulated courier timeline.',['mobile-light-cart.png','mobile-dark-cart.png','mobile-light-track.png'],[False,True,False])
gal('gallery-4-stitch','Original <em>Google Stitch</em> designs','6 Stitch mobile screens (PNG + HTML) included, light + dark.',['../../design/stitch-light-home.png','../../design/stitch-dark-detail.png','../../design/stitch-light-cart.png'],[False,True,False])
