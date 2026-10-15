#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Roam travel variant (ref: @steve_mikey_ "TRAVEL APP").
Adds: blurred teal-tinted photo background, huge ghosted italic wordmark, panorama phones that bleed off the edges,
frosted glass chips on the cover. Usage: python3 render.py config.json"""
import json,os,sys,subprocess,html
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def u(p): return 'file://'+os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','CSS','TAILWIND','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
def phone(src,w,rot=0,x=0,y=0,z=1,dark=False,cls=''):
  return f'''<div class="phone{' dk' if dark else ''} {cls}" style="width:{w}px;transform:translate({x}px,{y}px) rotate({rot}deg);z-index:{z}">
  <div class="scr"><div class="sb"><span>9:41</span><span class="ic">▂▄▆ ◔ ▮</span></div><img src="{u(src)}"><div class="notch"></div><div class="home"></div></div></div>'''
def pano(scr,dark=False,w=340,spread=400,lift=36,rot=0,top=None,cw=None):
  """Panorama row: centre phone in front, side phones pushed out so they bleed off the slide edges."""
  n=len(scr); mid=(n-1)/2; s=''
  for i,p in enumerate(scr):
    d=i-mid; ww=cw if (cw and d==0) else w
    s+=phone(p,ww,rot=d*rot,x=d*spread-ww/2,y=abs(d)*lift,z=10-int(abs(d)*2),dark=dark[i] if isinstance(dark,list) else dark)
  st=f' style="top:{top}px"' if top is not None else ''
  return f'<div class="fan"{st}>{s}</div>'
def bg(photo,ghost,gy=560,gsize=330):
  return f'''<div class="bgimg" style="background-image:url('{u(photo)}')"></div><div class="tint"></div><div class="glow"></div>
<div class="ghost" style="top:{gy}px;font-size:{gsize}px">{ghost}</div>'''
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">
<header><b>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer>{grid(W,H)}</body></html>'''
def callouts(cs):
  """Free callouts: label pill at (lx,ly) [top-left], dot at (dx,dy); line from the nearest label edge to the dot."""
  s='';ln=''
  for c in cs:
    lx,ly,dx,dy=c['lx'],c['ly'],c['dx'],c['dy']; w=c.get('w',len(c['label'])*10.5+32); h=38
    sx=lx+w if dx>lx+w else (lx if dx<lx else lx+w/2); sy=ly+h/2 if (dx>lx+w or dx<lx) else (ly+h if dy>ly+h else ly)
    ln+=f'<line x1="{sx}" y1="{sy}" x2="{dx}" y2="{dy}"/>'
    s+=f'<div class="co2" style="left:{lx}px;top:{ly}px;width:{w}px">{html.escape(c["label"])}</div><em class="dot" style="left:{dx-8}px;top:{dy-8}px"></em>'
  return f'<svg class="colines" width="1080" height="1500">{ln}</svg>{s}'
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.5);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.5);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def chips(cs):
  return ''.join(f'<div class="gchip {c.get("cls","")}" style="{c["pos"]}">{c["html"]}</div>' for c in cs)
def shot(name,body,i,n,W,H,cls=''):
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png')
  subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={W},{H}',
    '--virtual-time-budget=6000',f'--screenshot={png}',f'file://{f}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print('wrote',png)
L,D=C['light'],C['dark']; A=C['app']; K=C['keyword']; N=4; W,H=1080,1350; BG=C['bg_photo']; G=C.get('ghost',A.upper())
# 1 cover: hook + panorama (dark | light hero | light detail) over ghost wordmark
shot('slide-1',f'''{bg(BG,G,gy=C.get('cover_ghost_y',600),gsize=420)}<h1>{C["hook"]}</h1><p class="sub">{C["hook_sub"]}</p>
{chips(C.get('cover_chips',[]))}{pano([D[0],L[0],L[2]],dark=[True,False,False],w=280,cw=304,spread=372,lift=46,rot=6,top=C.get('cover_top',610))}''',1,N,W,H,'cover')
# 2 light + callouts
shot('slide-2',f'''{bg(BG,C.get('ghost_light','LIGHT'),gy=372,gsize=340)}<h1 class="m">{C["light_title"]}</h1><p class="sub">{C["light_sub"]}</p>
<div class="stage">{pano(L,w=330,spread=392,lift=36)}{callouts(C.get("callouts",[]))}</div>''',2,N,W,H)
# 3 dark
shot('slide-3',f'''{bg(BG,C.get('ghost_dark','DARK'),gy=372,gsize=340)}<h1 class="m">{C["dark_title"]}</h1><p class="sub">{C["dark_sub"]}</p>
<div class="stage">{pano(D,dark=True,w=330,spread=392,lift=36)}{callouts(C.get("dark_callouts",[]))}</div>''',3,N,W,H,'night')
# 4 CTA
steps=''.join(f'<div class="st"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<4 else '') for j,s in enumerate(['Design','HTML','Tailwind','Responsive','Kit']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
shot('slide-4',f'''{bg(BG,G,gy=980,gsize=300)}<h1 class="m">Comment <span class="kw">{K}</span><br>to get the <b>HTML/CSS</b></h1>
<p class="sub">{C["cta_sub"]}</p><div class="steps">{steps}</div><ul class="ben">{bul}</ul>
<div class="mini">{phone(L[0],230,-6,0,0,1)}{phone(D[0],230,6,0,0,2,True)}</div>''',4,N,W,H,'cta')
# pinterest pin
shot('pin',f'''{bg(BG,G,gy=455,gsize=320)}<h1 class="pin">{C["pin_title"]}</h1><p class="sub">{C["pin_sub"]}</p>
<div class="stage pinst">{pano([L[1],L[0],D[0]],dark=[False,False,True],w=290,cw=322,spread=340,lift=40,rot=5,top=590)}</div>
<div class="pinfoot">Light + Dark · HTML / CSS / Tailwind kit</div>''',1,1,1000,1500,'pinb')
