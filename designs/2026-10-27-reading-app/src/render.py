#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Folio reading-tracker variant (5 slides + pin).
Style ref (layout/mood only): @uxpected.abhi "Book Reading App UI Concept" — flat light-grey backdrop, two STRAIGHT phones side by side
with the left one larger and in front, monochrome UI with one orange accent.
Adapted: #E6E6E6 slides, heavy Urbanist headline with one orange word, black thin-bezel phones (untilted on the inner slides),
white / black / orange chips, screen-anchored callouts, a near-black dark slide, an orange Comment-KEYWORD CTA, and a 1000x1500 pin.
Kept from v2: handle header + page count, hook cover with fanned phones, light slides + callouts, dark slide, CTA, pin.
Usage: /workspace/.venv-pw/bin/python render.py config.json   (GRID=1 debug grid, ONLY=slide-2,pin to render some)"""
import json,os,sys,html,math
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def ap(p): return os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','TAILWIND','JS','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
SW,SH,SB=390,844,34   # css size of a kit screenshot + status bar height
PAD=10
def ph_h(w): return (w-2*PAD)*(SH+SB)/SW+2*PAD
def topcolor(src):
  im=Image.open(ap(src)).convert('RGB'); px=im.getpixel((im.width//2,4)); lum=.299*px[0]+.587*px[1]+.114*px[2]
  return '#%02x%02x%02x'%px, lum<140
def phone(src,w,cx,cy,rot,z):
  h=ph_h(w); k=(w-2*PAD)/SW; col,wt=topcolor(src)
  return f'''<div class="phone" style="width:{w}px;height:{h:.1f}px;left:{cx-w/2:.1f}px;top:{cy-h/2:.1f}px;z-index:{z+10};transform:rotate({rot}deg)">
  <div class="scr" style="background:{col}"><div class="sb{' wt' if wt else ''}" style="height:{SB*k:.1f}px;padding:0 {26*k:.1f}px;font-size:{13*k:.1f}px"><span>9:41</span><span class="ic" style="transform:scale({k:.2f});transform-origin:right center"><i></i><i></i><i></i><b></b></span></div>
  <div class="notch" style="top:{8*k:.1f}px;height:{22*k:.1f}px"></div><img src="file://{ap(src)}" style="top:{SB*k:.1f}px"></div></div>'''
class Set:
  """Phones. items: [name, cx, cy, width, rot, z]. pt(i,sx,sy) maps a css point of the 390x844 shot to slide px."""
  def __init__(s,items,S): s.items=items; s.html=''.join(phone(S[n],w,cx,cy,r,z) for n,cx,cy,w,r,z in items)
  def pt(s,i,sx,sy):
    n,cx,cy,w,rot,z=s.items[i]; k=(w-2*PAD)/SW; h=ph_h(w)
    x=cx-w/2+PAD+sx*k; y=cy-h/2+PAD+(SB+sy)*k; a=math.radians(rot); dx,dy=x-cx,y-cy
    return cx+dx*math.cos(a)-dy*math.sin(a), cy+dx*math.sin(a)+dy*math.cos(a)
def callouts(st,cs,W=1080,H=1350):
  s='';ln=''
  for c in cs:
    dx,dy=st.pt(c['p'],c['sx'],c['sy']); lx,ly=c['lx'],c['ly']; w=c.get('w',len(c['label'])*11+52); h=48
    sx=lx+w if dx>lx+w else (lx if dx<lx else dx); sy=ly+h/2 if (dx>lx+w or dx<lx) else (ly+h if dy>ly+h else ly)
    ln+=f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{dx:.1f}" y2="{dy:.1f}"/>'
    s+=f'<div class="co2 {c.get("cls","")}" style="left:{lx}px;top:{ly}px;width:{w:.0f}px">{html.escape(c["label"])}</div><em class="dot" style="left:{dx-11:.1f}px;top:{dy-11:.1f}px"></em>'
  return f'<svg class="colines" width="{W}" height="{H}">{ln}</svg>{s}'
def chips(cs): return ''.join(f'<div class="fchip {c.get("cls","")}" style="{c["pos"]}">{c["html"]}</div>' for c in cs)
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px"><div class="floor"></div>
<header><b><i></i>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer>{grid(W,H)}</body></html>'''
_PW=None
def browser():
  global _PW
  if _PW is None:
    from playwright.sync_api import sync_playwright
    pw=sync_playwright().start(); _PW=pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  return _PW
def shot(name,body,i,n,W,H,cls=''):
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png'); pg=browser().new_page(viewport={'width':W,'height':H})
  pg.goto(f'file://{f}'); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
  pg.screenshot(path=png); pg.close(); print('wrote',png)
S=C['screens']; K=C['keyword']; N=5; W,H=1080,1350
only=os.environ.get('ONLY','').split(',') if os.environ.get('ONLY') else None
want=lambda n: not only or n in only
def slide(i,key,cls):
  sd=C[key]; st=Set(sd['phones'],S)
  shot(f'slide-{i}',f'''<h1 class="m {sd.get('align','c')}" style="top:{sd.get('h1_top',140)}px">{sd["title"]}</h1><p class="sub {sd.get('align','c')}" style="top:{sd.get('sub_top',230)}px">{sd["sub"]}</p>
{chips(sd.get('chips',[]))}{st.html}{callouts(st,sd.get("callouts",[]))}''',i,N,W,H,cls)
# 1 cover: hook + three phones (centre straight, sides softly fanned) + chips
cv=C['cover']; f1=Set(cv['phones'],S)
if want('slide-1'): shot('slide-1',f'''<h1 style="top:{cv.get("h1_top",130)}px">{C["hook"]}</h1>
<p class="sub" style="top:{cv.get("sub_top",360)}px">{C["hook_sub"]}</p>{chips(cv.get('chips',[]))}{f1.html}''',1,N,W,H,'cover')
if want('slide-2'): slide(2,'light','')
if want('slide-3'): slide(3,'light2','')
if want('slide-4'): slide(4,'dark','dk')
# 5 CTA (orange)
ct=C['cta']
steps=''.join(f'<div class="st{" on" if j==0 else ""}"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<len(ct['steps'])-1 else '') for j,s in enumerate(ct['steps']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
f5=Set(ct['phones'],S)
if want('slide-5'): shot('slide-5',f'''<h1 class="m" style="top:{ct.get("h1_top",140)}px;font-size:84px;letter-spacing:-3px">Comment <span class="kw">{K}</span><br>to get the <em>HTML/CSS</em></h1>
<p class="sub" style="top:{ct.get("sub_top",340)}px;right:400px">{ct["sub"]}</p><div class="steps" style="top:{ct.get("steps_top",470)}px">{steps}</div><ul class="ben" style="top:{ct.get("ben_top",600)}px">{bul}</ul>{chips(ct.get('chips',[]))}{f5.html}
<div class="gobtn" style="{ct.get('go','left:60px;top:1110px')}"><svg viewBox="0 0 24 24"><path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/></svg></div>''',5,N,W,H,'ob')
# Pinterest pin 1000x1500
P=C['pin']; fp=Set(P['phones'],S)
sw=''.join(f'<div class="sw"><i style="background:{c}"></i><b>{n}</b><small>{c}</small></div>' for n,c in P['palette'])
feat=''.join(f'<span>{x}</span>' for x in P['features'])
if want('pin'): shot('pin',f'''<h1 class="c" style="top:{P.get("h1_top",112)}px;font-size:76px;letter-spacing:-2.8px">{C["pin_title"]}</h1><p class="sub c" style="top:{P.get("sub_top",290)}px;font-size:26px">{P.get("sub","")}</p>
{chips(P.get('chips',[]))}{fp.html}
<div class="pal" style="left:{P.get("pal_left",58)}px;top:{P["pal_top"]}px">{sw}</div>
<div class="card" style="left:58px;top:{P["card_top"]}px;width:330px;height:{P.get("card_h",250)}px"><div class="tagl">Fonts</div>
<h3 style="margin-top:12px;font-size:34px;font-weight:900">Urbanist</h3><p style="margin-top:4px">Titles 800–900 · UI 500–700</p>
<p style="margin-top:12px"><b class="ink">Shape</b> full-round pills + chips · 10px covers + tiles · no heavy shadows</p></div>
<div class="card k" style="left:408px;top:{P["card_top"]}px;width:534px;height:{P.get("card_h",250)}px"><div class="tagl">Build it</div>
<h3 style="margin-top:12px">{P["idea"]}</h3><p style="margin-top:8px"><b class="ink">Stack:</b> {P["stack"]}</p><div class="chipz">{feat}</div></div>''',1,1,1000,1500,'pinb')
