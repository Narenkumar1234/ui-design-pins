#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Nimbus glass weather app variant.
Style ref (layout/mood only): @iabout_tech "iOS 27 new Weather app design" — centred headline over a rounded panel with upright phones.
Adapted: sky-gradient slides, CENTRED headline, a frosted-glass "stage" panel, thin titanium phone frames (upright or softly fanned),
glass chips, screen-anchored callouts, a night slide with stars, a deep-sky Comment-KEYWORD CTA, and a 1000x1500 pin (palette, fonts, build-it).
Kept from v2: handle header + page count, hook cover with fanned phones, light slide + callouts, dark slide, CTA, pin.
Usage: /workspace/.venv-pw/bin/python render.py config.json   (GRID=1 debug grid, ONLY=slide-2,pin to render some)"""
import json,os,sys,subprocess,html,tempfile,shutil,math
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def ap(p): return os.path.abspath(os.path.join(base,p))
def u(p): return 'file://'+ap(p)
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','CSS','TAILWIND','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
SBH=34; SW=390; RATIO=19.3/9
def topcolor(src):
  im=Image.open(ap(src)).convert('RGB'); px=im.getpixel((im.width//2,3)); lum=.299*px[0]+.587*px[1]+.114*px[2]
  return '#%02x%02x%02x'%px, lum<140
def phone(src,w,cx,cy,rot,z,dark,cls=''):
  h=w*RATIO; col,light_text=topcolor(src)
  return f'''<div class="phone{' dk' if dark else ''} {cls}" style="width:{w}px;left:{cx-w/2:.1f}px;top:{cy-h/2:.1f}px;z-index:{z+10};transform:rotate({rot}deg)">
  <div class="scr" style="background:{col}"><div class="sb{' wt' if light_text else ''}"><span>9:41</span><span class="ic"><i></i><i></i><i></i><b></b></span></div><img src="{u(src)}"><div class="notch"></div><div class="home"></div></div></div>'''
class Fan:
  """Phones. items: (name, src, cx, cy, width, rot_deg, z, cls). pt() maps a screen point (css px of the 390-wide shot) to slide px."""
  def __init__(s,items):
    s.items=items
    s.html=''.join(phone(src,w,cx,cy,rot,z,n.startswith('dark'),cls) for n,src,cx,cy,w,rot,z,cls in items)
  def pt(s,i,sx,sy):
    n,src,cx,cy,w,rot,z,cls=s.items[i]; k=(w-18)/SW; h=w*RATIO
    x=cx-w/2+9+sx*k; y=cy-h/2+9+SBH+sy*k; a=math.radians(rot); dx,dy=x-cx,y-cy
    return cx+dx*math.cos(a)-dy*math.sin(a), cy+dx*math.sin(a)+dy*math.cos(a)
def callouts(fan,cs,W=1080,H=1350):
  s='';ln=''
  for c in cs:
    dx,dy=fan.pt(c['p'],c['sx'],c['sy']); lx,ly=c['lx'],c['ly']; w=c.get('w',len(c['label'])*10.4+46); h=46
    sx=lx+w if dx>lx+w else (lx if dx<lx else dx); sy=ly+h/2 if (dx>lx+w or dx<lx) else (ly+h if dy>ly+h else ly)
    ln+=f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{dx:.1f}" y2="{dy:.1f}"/>'
    s+=f'<div class="co2 {c.get("cls","")}" style="left:{lx}px;top:{ly}px;width:{w:.0f}px">{html.escape(c["label"])}</div><em class="dot" style="left:{dx-11:.1f}px;top:{dy-11:.1f}px"></em>'
  return f'<svg class="colines" width="{W}" height="{H}">{ln}</svg>{s}'
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def page(body,i,n,W,H,cls=''):
  stars='<div class="stars"></div>' if 'night' in cls else ''
  return f'''<!doctype html><html><head><meta charset="utf-8">
<style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">{stars}<div class="glow"></div><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
<header><b>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer>{grid(W,H)}</body></html>'''
def chips(cs): return ''.join(f'<div class="gchip {c.get("cls","")}" style="{c["pos"]}">{c["html"]}</div>' for c in cs)
def stage(st): return f'<div class="stage" style="{st}"></div>' if st else ''
_PW=None
def browser():
  global _PW
  if _PW is None:
    from playwright.sync_api import sync_playwright
    pw=sync_playwright().start(); _PW=pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  return _PW
def shot(name,body,i,n,W,H,cls=''):
  """Render with Playwright (headless --screenshot stalls on backdrop-filter pages)."""
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png'); pg=browser().new_page(viewport={'width':W,'height':H})
  pg.goto(f'file://{f}'); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
  pg.screenshot(path=png); pg.close(); print('wrote',png)
S=C['screens']; K=C['keyword']; N=4; W,H=1080,1350
def fan(spec): return Fan([(a[0],S[a[0]],a[1],a[2],a[3],a[4],a[5],a[6] if len(a)>6 else '') for a in spec])
only=os.environ.get('ONLY','').split(',') if os.environ.get('ONLY') else None
want=lambda n: not only or n in only
# 1 cover: centred hook + three softly fanned phones rising out of a glass stage
cv=C['cover']; f1=fan(cv['phones'])
if want('slide-1'): shot('slide-1',f'''<h1 class="c" style="top:{cv.get("h1_top",130)}px">{C["hook"]}</h1>
<p class="sub c" style="top:{cv.get("sub_top",360)}px">{C["hook_sub"]}</p>{stage(cv.get("stage"))}
{chips(cv.get('chips',[]))}{f1.html}''',1,N,W,H,'cover')
# 2 light: centred title, two upright phones on the glass stage + callouts
f2=fan(C['light_phones'])
if want('slide-2'): shot('slide-2',f'''<h1 class="m c">{C["light_title"]}</h1><p class="sub c">{C["light_sub"]}</p>{stage(C.get("light_stage"))}
{f2.html}{callouts(f2,C.get("callouts",[]))}''',2,N,W,H,'')
# 3 night
f3=fan(C['dark_phones'])
if want('slide-3'): shot('slide-3',f'''<h1 class="m c">{C["dark_title"]}</h1><p class="sub c">{C["dark_sub"]}</p>{stage(C.get("dark_stage"))}
{f3.html}{callouts(f3,C.get("dark_callouts",[]))}''',3,N,W,H,'night')
# 4 CTA (deep sky)
ct=C['cta']
steps=''.join(f'<div class="st"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<len(ct['steps'])-1 else '') for j,s in enumerate(ct['steps']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
f4=fan(ct['phones'])
if want('slide-4'): shot('slide-4',f'''<h1 class="m">Comment <span class="kw">{K}</span><br>to get the <em>HTML/CSS</em></h1>
<p class="sub" style="top:{ct.get("sub_top",330)}px;right:300px">{ct["sub"]}</p><div class="steps">{steps}</div><ul class="ben">{bul}</ul>{chips(ct.get('chips',[]))}{f4.html}
<div class="gobtn" style="{ct.get('go','left:60px;top:1130px')}"><svg viewBox="0 0 24 24"><path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/></svg></div>''',4,N,W,H,'cta skyb')
# Pinterest pin 1000x1500
P=C['pin']; fp=fan(P['phones'])
sw=''.join(f'<div class="sw"><i class="{"gl" if "%" in c else ""}" style="background:{c.split(" ")[0]}"></i><b>{n}</b><small>{c}</small></div>' for n,c in P['palette'])
feat=''.join(f'<span>{x}</span>' for x in P['features'])
if want('pin'): shot('pin',f'''<h1 class="pin c" style="top:112px">{C["pin_title"]}</h1><p class="sub c pinsub">{P.get("sub","")}</p>{stage(P.get("stage"))}
{fp.html}
<div class="pal" style="left:{P.get("pal_left",60)}px;top:{P["pal_top"]}px">{sw}</div>
<div class="card" style="left:60px;top:{P["card_top"]}px;width:330px;height:{P.get("card_h",260)}px"><div class="tagl">Fonts</div>
<h3 style="margin-top:10px">Sora</h3><p style="margin-top:2px">Numerals 200 · headings 600 · body 400</p>
<p style="margin-top:12px"><b class="ink">Glass</b> white 26% · 1px white/60 border · blur 24px · 28px radius</p></div>
<div class="card" style="left:410px;top:{P["card_top"]}px;width:530px;height:{P.get("card_h",260)}px"><div class="tagl">Build it</div>
<h3 style="margin-top:10px">{P["idea"]}</h3><p style="margin-top:6px"><b class="ink">Stack:</b> {P["stack"]}</p><div class="chipz">{feat}</div></div>''',1,1,1000,1500,'pinb')
