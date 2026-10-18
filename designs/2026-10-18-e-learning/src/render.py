#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Lumo e-learning variant (ref: @uiux.build "MILO" pastel 3D clay app).
Pale sky-blue gradient slides, chunky rounded Fredoka headlines with a periwinkle phrase, glossy 3D clay mascot,
STRAIGHT side-by-side phones (left one bigger + lower, like the reference) instead of the v2 fan, screen-anchored
callouts (dot placed on a point of a phone's screen), navy night slide, Comment-KEYWORD CTA slide and a 1000x1500 pin
with palette, fonts and a build-it brief.  Kept from v2: handle header + page count, footer tags, callouts, CTA, pin.
Usage: python3 render.py config.json   (GRID=1 for a debug grid)"""
import json,os,sys,subprocess,html,tempfile,shutil
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def u(p): return 'file://'+os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','CSS','TAILWIND','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
SBH=34; RATIO=19.3/9; SW=390  # screenshots are 390 css px wide (rendered @2x)
def phone(src,w,x,y,z=1,dark=False):
  return f'''<div class="phone{' dk' if dark else ''}" style="width:{w}px;left:{x}px;top:{y}px;z-index:{z}">
  <div class="scr"><div class="sb"><span>9:41</span><span class="ic"><i></i><i></i><i></i><b></b></span></div><img src="{u(src)}"><div class="notch"></div><div class="home"></div></div></div>'''
class Row:
  """Straight phones. items: (src, center_x, top_y, width, dark, z). Keeps geometry so callouts can target screen points."""
  def __init__(s,items):
    s.items=items; s.html=''.join(phone(src,w,cx-w/2,y,z,dk) for src,cx,y,w,dk,z in items)
  def pt(s,i,sx,sy):
    src,cx,y,w,dk,z=s.items[i]; k=(w-18)/SW
    return cx-w/2+9+sx*k, y+9+SBH+sy*k
def callouts(row,cs,W=1080,H=1500):
  s='';ln=''
  for c in cs:
    dx,dy=row.pt(c['p'],c['sx'],c['sy']); lx,ly=c['lx'],c['ly']; w=c.get('w',len(c['label'])*10.6+40); h=42
    sx=lx+w if dx>lx+w else (lx if dx<lx else dx); sy=ly+h/2 if (dx>lx+w or dx<lx) else (ly+h if dy>ly+h else ly)
    ln+=f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{dx:.1f}" y2="{dy:.1f}"/>'
    s+=f'<div class="co2 {c.get("cls","")}" style="left:{lx}px;top:{ly}px;width:{w:.0f}px">{html.escape(c["label"])}</div><em class="dot" style="left:{dx-9:.1f}px;top:{dy-9:.1f}px"></em>'
  return f'<svg class="colines" width="{W}" height="{H}">{ln}</svg>{s}'
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px"><div class="glow"></div>
<header><b>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer>{grid(W,H)}</body></html>'''
def chips(cs): return ''.join(f'<div class="gchip {c.get("cls","")}" style="{c["pos"]}">{c["html"]}</div>' for c in cs)
def clay(c): return f'<div class="cblob" style="left:{c["x"]-c["d"]*.3}px;top:{c["y"]-c["d"]*.3}px;width:{c["d"]*1.6}px;height:{c["d"]*1.6}px"></div>' if c.get('blob') else '' 
def clays(cs): return ''.join(clay(c)+f'<img class="clay {c.get("cls","")}" src="{u(c["src"])}" style="left:{c["x"]}px;top:{c["y"]}px;width:{c["d"]}px;transform:rotate({c.get("r",0)}deg)">' for c in cs)
def shot(name,body,i,n,W,H,cls=''):
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png'); prof=tempfile.mkdtemp()
  subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--user-data-dir={prof}',f'--window-size={W},{H}',
    '--virtual-time-budget=6000',f'--screenshot={png}',f'file://{f}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); shutil.rmtree(prof,True); print('wrote',png)
S=C['screens']; K=C['keyword']; N=4; W,H=1080,1350
def row(spec): return Row([(S[a],cx,y,w,a.startswith('dark'),z) for a,cx,y,w,z in spec])
# 1 cover: hook + clay mascot + two straight phones (left bigger + lower)
cv=C['cover']; r1=row(cv['phones'])
shot('slide-1',f'''<h1>{C["hook"]}</h1><p class="sub" style="top:{cv.get("sub_top",360)}px;right:{cv.get("sub_right",420)}px">{C["hook_sub"]}</p>
{clays(cv.get('clays',[]))}{chips(cv.get('chips',[]))}{r1.html}''',1,N,W,H,'cover')
# 2 light + callouts
r2=row(C['light_phones'])
shot('slide-2',f'''<h1 class="m">{C["light_title"]}</h1><p class="sub">{C["light_sub"]}</p>
{r2.html}{callouts(r2,C.get("callouts",[]))}''',2,N,W,H)
# 3 dark (navy)
r3=row(C['dark_phones'])
shot('slide-3',f'''<h1 class="m">{C["dark_title"]}</h1><p class="sub">{C["dark_sub"]}</p>
{r3.html}{callouts(r3,C.get("dark_callouts",[]))}''',3,N,W,H,'night')
# 4 CTA
ct=C['cta']
steps=''.join(f'<div class="st"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<4 else '') for j,s in enumerate(ct['steps']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
r4=row(ct['phones'])
shot('slide-4',f'''<h1 class="m">Comment <span class="kw">{K}</span><br>to get the <em>HTML/CSS</em></h1>
<p class="sub">{ct["sub"]}</p><div class="steps">{steps}</div><ul class="ben">{bul}</ul>{clays(ct.get('clays',[]))}{r4.html}''',4,N,W,H,'cta')
# Pinterest pin 1000x1500: title, 3 screens, palette, fonts, build-it brief
P=C['pin']; rp=row(P['phones'])
sw=''.join(f'<div class="sw"><i style="background:{c}"></i><b>{n}</b><small>{c}</small></div>' for n,c in P['palette'])
feat=''.join(f'<span>{x}</span>' for x in P['features'])
shot('pin',f'''<h1 class="pin" style="top:118px">{C["pin_title"]}</h1>{clays(P.get('clays',[]))}
{rp.html}
<div class="pal" style="left:60px;top:{P["pal_top"]}px">{sw}</div>
<div class="card" style="left:60px;top:{P["card_top"]}px;width:330px;height:{P.get("card_h",270)}px"><div class="tagl">Fonts</div>
<h3 style="margin-top:10px">Fredoka</h3><p style="margin-top:2px">Rounded headings · 600</p>
<h3 style="margin-top:12px;font-family:Nunito;font-weight:800;font-size:28px">Nunito</h3><p style="margin-top:2px">Body + UI · 24px cards, pill buttons</p></div>
<div class="card" style="left:410px;top:{P["card_top"]}px;width:530px;height:{P.get("card_h",270)}px"><div class="tagl">Build it</div>
<h3 style="margin-top:10px">{P["idea"]}</h3><p style="margin-top:6px"><b class="ink">Stack:</b> {P["stack"]}</p><div class="chipz">{feat}</div></div>''',1,1,1000,1500,'pinb')
