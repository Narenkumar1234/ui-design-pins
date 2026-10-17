#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Ember food-delivery variant (ref: @codew_ithshivam "Claude" warm editorial panel).
Cream background, Newsreader serif headline with an italic orange phrase, overhead bowl hero, fanned phones,
screen-anchored callouts (dot placed on a point of a phone's screen, auto-mapped through the phone rotation),
espresso dark slide, Comment-KEYWORD CTA slide and a 1000x1500 pin with palette, fonts and a build-it brief.
Usage: python3 render.py config.json   (GRID=1 for a debug grid)"""
import json,os,sys,subprocess,html,math
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def u(p): return 'file://'+os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','CSS','TAILWIND','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
SBH=34; RATIO=19.3/9
def phone(src,w,rot=0,x=0,y=0,z=1,dark=False):
  return f'''<div class="phone{' dk' if dark else ''}" style="width:{w}px;transform:translate({x}px,{y}px) rotate({rot}deg);z-index:{z}">
  <div class="scr"><div class="sb"><span>9:41</span><span class="ic">▂▄▆ ◔ ▮</span></div><img src="{u(src)}"><div class="notch"></div><div class="home"></div></div></div>'''
class Fan:
  """Phones in a fan around x=540 (or cx). Keeps geometry so callouts can target screen points."""
  def __init__(s,scr,top,w=300,spread=280,lift=30,rot=5,dark=False,cx=540,cw=None):
    s.items=[]; n=len(scr); mid=(n-1)/2; s.top=top; s.cx=cx; html_=''
    for i,p in enumerate(scr):
      d=i-mid; ww=cw if (cw and d==0) else w; x=d*spread-ww/2; y=abs(d)*lift; r=d*rot
      dk=dark[i] if isinstance(dark,list) else dark
      s.items.append((x,y,ww,r)); html_+=phone(p,ww,r,x,y,10-int(abs(d)*2),dk)
    s.html=f'<div class="fan" style="top:{top}px;left:{cx}px">{html_}</div>'
  def pt(s,i,sx,sy):
    """screen px (390-wide screenshot space) -> slide px"""
    x,y,w,r=s.items[i]; h=w*RATIO; k=(w-18)/390
    px=9+sx*k; py=9+SBH+sy*k; ox,oy=w/2,h  # transform-origin 50% 100%
    a=math.radians(r); dx,dy=px-ox,py-oy
    rx=ox+dx*math.cos(a)-dy*math.sin(a); ry=oy+dx*math.sin(a)+dy*math.cos(a)
    return s.cx+x+rx, s.top+y+ry
def callouts(fan,cs):
  s='';ln=''
  for c in cs:
    dx,dy=fan.pt(c['p'],c['sx'],c['sy']); lx,ly=c['lx'],c['ly']; w=c.get('w',len(c['label'])*10.2+36); h=40
    sx=lx+w if dx>lx+w else (lx if dx<lx else lx+w/2); sy=ly+h/2 if (dx>lx+w or dx<lx) else (ly+h if dy>ly+h else ly)
    ln+=f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{dx:.1f}" y2="{dy:.1f}"/>'
    s+=f'<div class="co2 {c.get("cls","")}" style="left:{lx}px;top:{ly}px;width:{w:.0f}px">{html.escape(c["label"])}</div><em class="dot" style="left:{dx-8:.1f}px;top:{dy-8:.1f}px"></em>'
  return f'<svg class="colines" width="1080" height="1500">{ln}</svg>{s}'
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">
<header><b>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer>{grid(W,H)}</body></html>'''
def chips(cs): return ''.join(f'<div class="gchip {c.get("cls","")}" style="{c["pos"]}">{c["html"]}</div>' for c in cs)
def bowl(src,x,y,d): return f'<div class="blob" style="left:{x-d*.35}px;top:{y-d*.35}px;width:{d*1.7}px;height:{d*1.7}px"></div><div class="bowl" style="left:{x}px;top:{y}px;width:{d}px;height:{d}px"><img src="{u(src)}"></div>'
def shot(name,body,i,n,W,H,cls=''):
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png')
  subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={W},{H}',
    '--virtual-time-budget=6000',f'--screenshot={png}',f'file://{f}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print('wrote',png)
L,D=C['light'],C['dark']; K=C['keyword']; N=4; W,H=1080,1350
cv=C['cover']
# 1 cover: hook + overhead bowl + fan (dark home | light home | light detail)
f1=Fan([D[0],L[0],L[1]],top=cv.get('fan_top',560),w=282,cw=300,spread=300,lift=40,rot=7,dark=[True,False,False])
B=cv['bowl']
shot('slide-1',f'''<h1>{C["hook"]}</h1><p class="sub" style="top:{cv.get("sub_top",360)}px;right:{cv.get("sub_right",420)}px">{C["hook_sub"]}</p>
{bowl(B["src"],B["x"],B["y"],B["d"])}{chips(C.get('cover_chips',[]))}{f1.html}''',1,N,W,H,'cover')
# 2 light + callouts
f2=Fan(L,top=C.get('stage_top',470),w=318,spread=322,lift=34,rot=5)
shot('slide-2',f'''<h1 class="m">{C["light_title"]}</h1><p class="sub">{C["light_sub"]}</p>
{f2.html}{callouts(f2,C.get("callouts",[]))}''',2,N,W,H)
# 3 dark (espresso)
f3=Fan(D,top=C.get('stage_top',470),w=318,spread=322,lift=34,rot=5,dark=True)
shot('slide-3',f'''<h1 class="m">{C["dark_title"]}</h1><p class="sub">{C["dark_sub"]}</p>
{f3.html}{callouts(f3,C.get("dark_callouts",[]))}''',3,N,W,H,'night')
# 4 CTA
steps=''.join(f'<div class="st"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<4 else '') for j,s in enumerate(['Design','HTML','Tailwind','Cart JS','Kit']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
shot('slide-4',f'''<h1 class="m">Comment <span class="kw">{K}</span><br>to get the <em>HTML/CSS</em></h1>
<p class="sub">{C["cta_sub"]}</p><div class="steps">{steps}</div><ul class="ben">{bul}</ul>
<div class="mini">{phone(L[0],230,-6,0,0,1)}{phone(D[1],230,6,0,0,2,True)}</div>''',4,N,W,H,'cta')
# Pinterest pin 1000x1500: title, 3 screens, palette, fonts, build-it brief
P=C['pin']
fp=Fan([L[1],L[0],D[0]],top=P.get('fan_top',330),w=250,cw=268,spread=262,lift=30,rot=6,dark=[False,False,True],cx=500)
sw=''.join(f'<div class="sw"><i style="background:{c}"></i><b>{n}</b><small>{c}</small></div>' for n,c in P['palette'])
feat=''.join(f'<span>{x}</span>' for x in P['features'])
shot('pin',f'''<h1 class="pin" style="font-size:76px;top:118px">{C["pin_title"]}</h1>
{fp.html}
<div class="pal" style="left:60px;top:{P.get("pal_top",1000)}px">{sw}</div>
<div class="card" style="left:60px;top:{P.get("card_top",1140)}px;width:330px;height:260px"><div class="tagl">Fonts</div>
<h3 style="margin-top:10px">Newsreader <em>Italic</em></h3><p style="margin-top:4px">Serif headings</p>
<h3 style="margin-top:14px;font-family:'DM Sans';font-weight:600;font-size:26px;letter-spacing:-.4px">DM Sans</h3><p style="margin-top:4px">UI text · 16-24px radius</p></div>
<div class="card" style="left:410px;top:{P.get("card_top",1140)}px;width:530px;height:260px"><div class="tagl">Build it</div>
<h3 style="margin-top:10px">{P["idea"]}</h3><p style="margin-top:6px"><b style="color:#2B1D14">Stack:</b> {P["stack"]}</p><div class="chipz">{feat}</div></div>''',1,1,1000,1500,'pinb')
