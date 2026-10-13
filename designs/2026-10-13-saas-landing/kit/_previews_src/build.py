"""Gumroad preview images for Klar SaaS Landing Page UI Kit (light grey + indigo)."""
import subprocess, os
D=os.path.dirname(os.path.abspath(__file__))+'/'; OUT=D+'../previews/'
os.makedirs(OUT, exist_ok=True)
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;overflow:hidden;position:relative;color:#111827;
background:#F4F4F6;background-image:radial-gradient(ellipse at 70% 60%,#FAFAFB 0,#F4F4F6 60%)}
.ph{position:absolute;background:#ECECEE;border-radius:40px;padding:8px;box-shadow:0 0 0 2px #D4D4D8,0 30px 60px rgba(0,0,0,.18)}
.ph.dk{background:#1d1d1f;box-shadow:0 0 0 2px #3a3a3c,0 30px 60px rgba(0,0,0,.45)}
.ph img{display:block;width:100%;border-radius:32px}h1,h2{font-family:Manrope,sans-serif}
b.g{color:#4F46E5}
.pill{display:inline-block;border:1.5px solid #E5E7EB;background:#fff;border-radius:999px;padding:8px 16px;font:500 15px Inter;color:#111827}
.pill.a{border-color:#4F46E5;background:#EEF2FF;color:#4F46E5}
.tag{font:500 14px Inter;letter-spacing:4px;text-transform:uppercase;color:#6B7280}p.s{color:#6B7280}"""
F='<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet">'
def ph(s,x,y,w,dark=False): return f'<div class="ph{" dk" if dark else ""}" style="left:{x}px;top:{y}px;width:{w}px"><img src="shots/{s}"></div>'
def page(n,w,h,body):
    p=D+n+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8">{F}<style>{CSS}</style></head><body style="width:{w}px;height:{h}px">{body}</body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}','--virtual-time-budget=5000',f'--screenshot={OUT}{n}.png',f'file://{p}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print(n,os.path.exists(OUT+n+'.png'), os.path.getsize(OUT+n+'.png') if os.path.exists(OUT+n+'.png') else 0)
page('cover-1280x720',1280,720,f'''<div style="position:absolute;left:64px;top:80px;width:470px"><div class="tag">UI kit · HTML + Tailwind</div>
<h1 style="font:800 58px/1.05 Manrope;letter-spacing:-2px;margin-top:22px">If I were designing<br>your <b class="g">SaaS landing</b></h1>
<p class="s" style="font:400 20px/1.5 Inter;margin-top:20px">Klar: minimal sales-analytics landing page. One indigo accent. Light + dark.</p>
<div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><span class="pill a">Light + dark</span><span class="pill">Hero → FAQ</span><span class="pill">$3 kit</span></div>
<p style="position:absolute;top:540px;font:700 22px Manrope">@code.in.30s</p></div>
{ph("mobile-light-hero.png",580,70,250)}{ph("mobile-dark-hero.png",880,50,260,True)}''')
page('thumbnail-600x600',600,600,f'''{ph("mobile-light-hero.png",70,110,200)}{ph("mobile-dark-hero.png",330,90,200,True)}
<h2 style="position:absolute;top:26px;width:100%;text-align:center;font:800 36px Manrope">Klar<b class="g">.</b></h2>''')
def gal(n,t,s,shots,darks=None):
    darks=darks or [False]*len(shots)
    body=f'<div style="position:absolute;left:64px;top:50px"><h2 style="font:800 40px Manrope;letter-spacing:-1px">{t}</h2><p class="s" style="font:400 19px Inter;margin-top:8px">{s}</p></div>'
    xs=[290,690] if len(shots)==2 else [130,490,850]
    for i,sh in enumerate(shots): body+=ph(sh,xs[i],170,300,darks[i] if i < len(darks) else False)
    page(n,1280,720,body)
gal('gallery-1-light-vs-dark','Light and dark, one toggle','Near-white by day, deep zinc by night — same indigo accent',['mobile-light-hero.png','mobile-dark-hero.png'],[False,True])
gal('gallery-2-bento','Bento features that sell','Live pipelines, team insights, revenue chart, alerts',['mobile-light-features.png','mobile-dark-features.png'],[False,True])
gal('gallery-3-pricing','Pricing with a highlighted plan','Growth in indigo, Free + Pro beside it, FAQ accordion below',['mobile-light-pricing.png','mobile-dark-pricing.png'],[False,True])
gal('gallery-4-stitch','Original Google Stitch designs','6 mobile screens included, light + dark',['stitch-light-hero.png','stitch-dark-hero.png','mobile-light-features.png'],[False,True,False])
