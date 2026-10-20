"""Gumroad preview images for Hearth Smart Home App UI Kit (charcoal + one orange, warm greige, Outfit)."""
import subprocess, os, shutil, tempfile
D=os.path.dirname(os.path.abspath(__file__))+'/'; OUT=D+'../previews/'
os.makedirs(OUT, exist_ok=True)
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:Outfit,sans-serif;overflow:hidden;position:relative;color:#1A1A1A;background:#CFC8C2}
body.dk{background:#1A1A1A;color:#F5F2EE}
.glow{position:absolute;left:50%;top:60%;width:1300px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.3) 0,rgba(255,255,255,.1) 40%,rgba(255,255,255,0) 68%)}
.dk .glow{background:radial-gradient(ellipse,rgba(242,118,46,.16) 0,rgba(242,118,46,.05) 40%,rgba(242,118,46,0) 68%)}
.ph{position:absolute;background:#F7F4F0;border-radius:46px;padding:9px;z-index:3;box-shadow:0 0 0 2px #BDB5AD,0 44px 70px -26px rgba(60,44,30,.45)}
.ph.dk{background:#111;box-shadow:0 0 0 2px #3a3a3a,0 0 0 4px #0b0b0b,0 44px 70px -26px rgba(30,20,10,.6)}
.ph img{display:block;width:100%;border-radius:37px}
h1,h2{font-weight:600;letter-spacing:-1.5px;line-height:1.02}
em{font-style:normal;color:#E0661F}.dk em{color:#F68C4E}
.pill{display:inline-block;background:#F5F2EE;border-radius:999px;padding:9px 18px;font:500 15px Outfit;color:#1A1A1A}
.pill.a{background:#F2762E;color:#fff}.dk .pill{background:#2A2A2A;color:#F5F2EE}.dk .pill.a{background:#F2762E}
.tag{font:600 13px Outfit;letter-spacing:4px;text-transform:uppercase;color:#E0661F}p.s{color:#5E5852}.dk p.s{color:#8C8782}
.z{position:relative;z-index:5}"""
F='<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">'
def ph(s,x,y,w,dark=False,z=3,crop=None):
    st=f'left:{x}px;top:{y}px;width:{w}px;z-index:{z}'
    return f'<div class="ph{" dk" if dark else ""}" style="{st}"><img src="{s}"></div>'
def page(n,w,h,body,cls=''):
    p=D+n+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8">{F}<style>{CSS}</style></head><body class="{cls}" style="width:{w}px;height:{h}px"><div class="glow"></div>{body}</body></html>')
    prof=tempfile.mkdtemp()
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--user-data-dir={prof}',f'--window-size={w},{h}','--virtual-time-budget=6000',f'--screenshot={OUT}{n}.png',f'file://{p}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    shutil.rmtree(prof,True); print(n,os.path.getsize(OUT+n+'.png'))
M='../design/mockups/'
# cover: hook left, staggered phones right (cropped by the edges, like the post)
page('cover-1280x720',1280,720,f'''<div class="z" style="position:absolute;left:64px;top:90px;width:560px"><div class="tag">UI kit · HTML + Tailwind</div>
<h1 style="font-size:70px;margin-top:20px">Smart home,<br>made <em>warm</em></h1>
<p class="s" style="font-size:20px;line-height:1.5;margin-top:20px">Hearth: a smart home control app with Welcome, Home, Room (thermostat + lights) and Energy pages. Charcoal + one orange, light and dark.</p>
<div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><span class="pill a">Light + dark</span><span class="pill">4 pages</span><span class="pill">Working dial + dimmer</span><span class="pill">$3 kit</span></div>
<p style="position:absolute;top:540px;font:600 22px Outfit">@code.in.30s</p></div>
{ph(M+"dark-welcome.png",690,96,270,True,4)}{ph(M+"dark-home.png",990,-190,270,True,3)}{ph(M+"dark-climate.png",990,410,270,True,3)}''')
page('thumbnail-600x600',600,600,f'''<h2 class="z" style="position:absolute;left:36px;top:34px;font-size:54px">Hearth<em>.</em></h2>
<p class="s z" style="position:absolute;left:38px;top:100px;font-size:17px">Smart home UI kit</p>
{ph(M+"dark-home.png",60,160,215,True,4)}{ph(M+"light-climate.png",320,110,215,False,3)}''')
def gal(n,t,s,shots,darks,cls=''):
    body=f'<div class="z" style="position:absolute;left:64px;top:46px"><h2 style="font-size:46px">{t}</h2><p class="s" style="font-size:19px;margin-top:8px">{s}</p></div>'
    xs=[300,680] if len(shots)==2 else [130,490,850]
    for i,sh in enumerate(shots): body+=ph(sh,xs[i],190+(0 if i%2==0 else 40),300,darks[i])
    page(n,1280,720,body,cls)
gal('gallery-1-light-vs-dark','Charcoal and <em>warm light</em>','Same orange accent in both themes. One toggle, saved in localStorage.',[M+'dark-home.png',M+'light-home.png'],[True,False])
gal('gallery-2-climate-lights','Thermostat dial + <em>dimmer</em>','Drag the 270° dial, pick Cool / Heat / Dry / Fan, dim lamps, set colour temperature.',[M+'dark-climate.png',M+'light-lights.png',M+'dark-lights.png'],[True,False,True])
gal('gallery-3-energy-scenes','Energy charts + <em>scenes</em>','Day / week / month usage, top devices, one-tap scenes that switch real device state, add-device sheet.',[M+'light-energy.png',M+'dark-scenes.png','shots/state-add-dark.png'],[False,True,True],'dk')
gal('gallery-4-stitch','Original <em>Google Stitch</em> designs','The Stitch screens (PNG + HTML) the kit was built from are included in design/.',['../design/stitch/stitch-dark-onboarding.png','../design/stitch/stitch-dark-home.png','../design/stitch/stitch-light-room.png'],[True,True,False])
