"""Gumroad preview images for Penny UI Kit (minimal style)."""
import subprocess, os, html
D='/workspace/products/penny-budget-ui-kit/_previews_src/'; OUT='/workspace/products/penny-budget-ui-kit/previews/'
L=dict(bg='#FAFAF7',card='#FFFFFF',line='#ECEAE4',ink='#17181C',muted='#6E6F76',g='#1F7A5A',t='#C2553A')
K=dict(bg='#0F1012',card='#17181B',line='#26282D',ink='#EDEDEA',muted='#8E9097',g='#4FC59A',t='#E07A5F')
CSS="""*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;overflow:hidden;position:relative;-webkit-font-smoothing:antialiased}
.ph{position:absolute;background:#17181C;border-radius:40px;padding:8px}.ph.dk{background:#000;outline:1px solid #3A3D44}
.ph img{display:block;width:100%;border-radius:32px}
h1,h2,.d{font-family:Manrope,sans-serif}.tag{font:500 14px Inter;letter-spacing:4px;text-transform:uppercase}
.pill{display:inline-block;border:1px solid;border-radius:999px;padding:8px 16px;font:500 15px Inter}"""
def phone(src,x,y,w,dark=False): return f'<div class="ph{" dk" if dark else ""}" style="left:{x}px;top:{y}px;width:{w}px"><img src="shots/{src}"></div>'
def page(name,w,h,body,bg):
    p=D+name+'.html'; open(p,'w').write(f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body style="width:{w}px;height:{h}px;background:{bg}">{body}</body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}','--virtual-time-budget=3000',f'--screenshot={OUT}{name}.png',p],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    print(name, os.path.exists(OUT+name+'.png'))
# cover: split light/dark
cover=f'''<div style="position:absolute;left:640px;top:0;width:640px;height:720px;background:{K["bg"]}"></div>
<div style="position:absolute;left:64px;top:70px;width:440px">
 <div class="tag" style="color:{L["muted"]}">UI kit · HTML + Tailwind</div>
 <h1 style="font:700 64px/1.04 Manrope;letter-spacing:-2.5px;color:{L["ink"]};margin-top:22px">Penny<br>Budget App</h1>
 <p style="font:400 21px/1.5 Inter;color:{L["muted"]};margin-top:20px">A minimalist expense tracker that actually works. Budget, transactions and insights saved in localStorage.</p>
 <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:10px"><span class="pill" style="color:{L["g"]};border-color:{L["g"]}">Light + dark</span><span class="pill" style="color:{L["ink"]};border-color:{L["line"]}">3 pages</span><span class="pill" style="color:{L["ink"]};border-color:{L["line"]}">Zero setup</span></div>
 <p class="d" style="position:absolute;top:530px;font:700 22px Manrope;color:{L["ink"]}">@code.in.30s</p></div>
{phone("mobile-light-home.png",560,70,250)}{phone("mobile-dark-insights.png",880,110,250,True)}'''
page('cover-1280x720',1280,720,cover,L['bg'])
thumb=f'''<div style="position:absolute;left:300px;top:0;width:300px;height:600px;background:{K["bg"]}"></div>
{phone("mobile-light-home.png",60,90,200)}{phone("mobile-dark-home.png",340,90,200,True)}
<div style="position:absolute;left:0;right:0;top:28px;text-align:center"><span style="font:700 34px Manrope;letter-spacing:-1px;color:{L["ink"]};background:{L["bg"]};padding:4px 14px;border-radius:12px">Penny<span style="color:{L["g"]}">.</span></span></div>'''
page('thumbnail-600x600',600,600,thumb,L['bg'])
def gallery(name,title,sub,shots,bg,P,dark=False):
    xs=[110,470,830]
    body=f'''<div style="position:absolute;left:64px;top:52px"><h2 style="font:700 40px Manrope;letter-spacing:-1.2px;color:{P["ink"]}">{title}</h2><p style="font:400 19px Inter;color:{P["muted"]};margin-top:8px">{sub}</p></div>'''
    for i,(s,dk) in enumerate(shots): body+=phone(s,xs[i]+(0 if len(shots)==3 else 180),170,300 if len(shots)==3 else 300,dk)
    page(name,1280,720,body,bg)
gallery('gallery-1-light-vs-dark','Light and dark, one toggle','Tailwind dark: classes + CSS variables, saved in localStorage',[('mobile-light-home.png',False),('mobile-dark-home.png',True)],L['bg'],L)
gallery('gallery-2-add-expense','Add expense with a custom keypad','Amount input, category chips, note, date, account. Expense or income.',[('mobile-light-add.png',False),('mobile-dark-add.png',True)],L['bg'],L)
gallery('gallery-3-insights','Insights that compute themselves','Week / Month / Year totals, slim CSS bar chart, spending by category',[('mobile-dark-insights.png',True),('mobile-light-insights.png',False)],K['bg'],K)
tree="""penny-budget-ui-kit/
├── README.md
├── LICENSE.txt
├── code/
│   ├── index.html      overview
│   ├── add.html        add expense
│   ├── insights.html   insights
│   ├── assets/
│   │   ├── theme.js  styles.css
│   │   ├── app.js    home.js
│   │   └── add.js    insights.js
│   └── data/ seed.json  seed.js
└── design/  12 reference PNGs"""
feats=['Light / dark toggle (saved)','Add, view and delete transactions','Editable monthly budget + progress','Month switcher on Overview','Week / Month / Year insights','Category breakdown + CSS bar chart','₹ formatting with Intl.NumberFormat','Works offline from file://']
g4=f'''<div style="position:absolute;left:64px;top:56px"><h2 style="font:700 40px Manrope;letter-spacing:-1.2px;color:{L["ink"]}">What's inside</h2>
<div style="margin-top:24px;width:600px;border:1px solid {L["line"]};border-radius:16px;background:#fff;padding:22px 24px;font:400 15px/1.75 'JetBrains Mono',monospace;color:{L["ink"]};white-space:pre">{html.escape(tree)}</div></div>
<div style="position:absolute;left:720px;top:140px;width:500px;display:flex;flex-direction:column;gap:10px">
{''.join(f'<div style="display:flex;align-items:center;gap:12px;border:1px solid {L["line"]};border-radius:12px;background:#fff;padding:12px 16px;font:500 17px Inter;color:{L["ink"]}"><span style="flex:none;width:22px;height:22px;border-radius:50%;border:1px solid {L["g"]};color:{L["g"]};display:grid;place-items:center;font:600 12px Inter">✓</span>{html.escape(f)}</div>' for f in feats)}</div>
<p style="position:absolute;left:64px;bottom:40px;font:700 22px Manrope;color:{L["ink"]}">@code.in.30s</p>'''
page('gallery-4-whats-inside',1280,720,g4,L['bg'])
