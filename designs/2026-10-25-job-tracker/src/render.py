#!/usr/bin/env python3
"""UI Design Pins carousel template v2 — Orbit job-tracker web-app variant (desktop + mobile).
Style ref (style/layout only, nothing copied): @code.xr "Dashboard V2" — near-black slide, centred bold title with an accent word,
a full-width dashboard screenshot and an editor window with traffic-light dots showing code.
Adapted: dark/off-white slides with a soft dot grid, CENTRED headline with a lime accent line, browser-window frames for desktop
(traffic lights recoloured to the palette: coral / sand / lime), a phone for mobile, a code-window card with real kit JS,
screen-anchored callouts, Comment-KEYWORD CTA, and a 1000x1500 pin (palette, fonts, build-it).
Kept from v2: handle header + page count, hook cover with fanned frames, light slide + callouts, dark slide, CTA, pin.
Usage: /workspace/.venv-pw/bin/python render.py config.json   (GRID=1 debug grid, ONLY=slide-2,pin to render some)"""
import json,os,sys,html,math
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def ap(p): return os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','TAILWIND','JS','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
S=C['screens']; BAR=40
def shotsize(n):  # css px of the screenshot (shots are @2x)
  im=Image.open(ap(S[n])); return im.width/2, im.height/2
class Frames:
  """items: dicts {k:'win'|'ph', s:screen, x, y, w, rot, z, crop:[cx,cy,cw,ch] (win), url}. pt(i,sx,sy) maps a css point of the shot to slide px."""
  def __init__(s,items): s.items=items; s.html=''.join(s.one(it) for it in items)
  def geo(s,it):
    sw,sh=shotsize(it['s'])
    if it['k']=='win':
      cx,cy,cw,ch=it.get('crop',[0,0,sw,sh]); k=it['w']/cw; return dict(k=k,ox=cx,oy=cy,vh=ch*k,top=BAR,pad=0,h=BAR+ch*k,sw=sw)
    k=(it['w']-20)/sw; return dict(k=k,ox=0,oy=0,vh=sh*k,top=10,pad=10,h=sh*k+20,sw=sw)
  def one(s,it):
    g=s.geo(it); dark=it['s'].startswith('dark'); src='file://'+ap(S[it['s']])
    st=f"left:{it['x']}px;top:{it['y']}px;width:{it['w']}px;z-index:{it.get('z',1)+10};transform:rotate({it.get('rot',0)}deg)"
    if it['k']=='win':
      return f'''<div class="win{' dkw' if dark else ''}" style="{st}"><div class="bar"><i></i><i></i><i></i><span>{html.escape(it.get('url','orbit.app'))}</span></div>
<div class="vp" style="height:{g['vh']:.1f}px"><img src="{src}" style="width:{g['sw']*g['k']:.1f}px;left:{-g['ox']*g['k']:.1f}px;top:{-g['oy']*g['k']:.1f}px"></div></div>'''
    return f'''<div class="ph{' dkp' if dark else ''}" style="{st}"><div class="vp" style="height:{g['vh']:.1f}px"><img src="{src}"></div></div>'''
  def pt(s,i,sx,sy):
    it=s.items[i]; g=s.geo(it); w=it['w']; h=g['h']; cx,cy=it['x']+w/2,it['y']+h/2
    x=it['x']+g['pad']+(sx-g['ox'])*g['k']; y=it['y']+g['top']+(sy-g['oy'])*g['k']
    a=math.radians(it.get('rot',0)); dx,dy=x-cx,y-cy
    return cx+dx*math.cos(a)-dy*math.sin(a), cy+dx*math.sin(a)+dy*math.cos(a)
def callouts(fr,cs,W=1080,H=1350):
  """Pill labels + dashed leader lines. Default 'elbow': horizontal from the label edge to the dot's x, then straight up/down
  (stack labels in rows with targets ordered left→right so leaders never cross a pill). elbow:false = straight line."""
  s='';ln=''
  for j,c in enumerate(cs):
    dx,dy=fr.pt(c['p'],c['sx'],c['sy']); lx,ly=c['lx'],c['ly']; w=c.get('w',len(c['label'])*11.6+70); h=52
    if lx<=dx<=lx+w: pts=[(dx,ly if dy<ly else ly+h),(dx,dy)]
    elif c.get('elbow',True): ex=lx+w if dx>lx+w else lx; pts=[(ex,ly+h/2),(dx,ly+h/2),(dx,dy)]
    else: pts=[(lx+w if dx>lx+w else lx,ly+h/2),(dx,dy)]
    ln+='<polyline fill="none" points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)+'"/>'
    s+=f'<div class="co" style="left:{lx}px;top:{ly}px;width:{w:.0f}px"><i>{j+1}</i>{html.escape(c["label"])}</div><em class="dot" style="left:{dx-11:.1f}px;top:{dy-11:.1f}px"></em>'
  return f'<svg class="colines" width="{W}" height="{H}">{ln}</svg>{s}'
def codewin(cw):
  return f'''<div class="code" style="{cw['pos']}"><div class="bar"><i></i><i></i><i></i><span>{cw['file']}</span></div><pre>{cw['html']}</pre></div>'''
def chips(cs): return ''.join(f'<div class="chip" style="{c["pos"]}"><i></i>{c["html"]}</div>' for c in cs)
GRID=os.environ.get('GRID')
def grid(W,H):
  if not GRID: return ''
  g=''.join(f'<div style="position:absolute;left:{x}px;top:0;bottom:0;width:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{x}</span></div>' for x in range(0,W,50))
  g+=''.join(f'<div style="position:absolute;top:{y}px;left:0;right:0;height:1px;background:rgba(255,0,0,.45);z-index:99"><span style="color:red;font-size:11px">{y}</span></div>' for y in range(0,H,50))
  return g
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">
<div class="dots"></div><div class="glow"></div>
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
  pg.goto(f'file://{f}'); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
  pg.screenshot(path=png); pg.close(); print('wrote',png)
K=C['keyword']; N=4; W,H=1080,1350
only=os.environ.get('ONLY','').split(',') if os.environ.get('ONLY') else None
want=lambda n: not only or n in only
# 1 cover (dark): centred title + lime accent line, fanned browser windows + phone, code window
cv=C['cover']; f1=Frames(cv['frames'])
if want('slide-1'): shot('slide-1',f'''<h1 class="xl c" style="top:{cv.get("h1_top",120)}px">{C["hook"]}</h1>
<p class="sub c" style="top:{cv.get("sub_top",370)}px">{C["hook_sub"]}</p>{chips(cv.get("chips",[]))}{f1.html}{codewin(cv["code"])}''',1,N,W,H,'dk cover')
# 2 light: board window + mobile phone + callouts
L=C['light']; f2=Frames(L['frames'])
if want('slide-2'): shot('slide-2',f'''<h1 class="m c">{L["title"]}</h1><p class="sub c" style="top:{L.get("sub_top",218)}px">{L["sub"]}</p>
{f2.html}{callouts(f2,L.get("callouts",[]))}''',2,N,W,H,'lt')
# 3 dark
D=C['dark']; f3=Frames(D['frames'])
if want('slide-3'): shot('slide-3',f'''<h1 class="m c">{D["title"]}</h1><p class="sub c" style="top:{D.get("sub_top",218)}px">{D["sub"]}</p>
{f3.html}{callouts(f3,D.get("callouts",[]))}''',3,N,W,H,'dk')
# 4 CTA
ct=C['cta']
steps=''.join(f'<div class="st{" on" if j==0 else ""}"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<len(ct['steps'])-1 else '') for j,s in enumerate(ct['steps']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
f4=Frames(ct['frames'])
if want('slide-4'): shot('slide-4',f'''<h1 class="m" style="top:{ct.get("h1_top",120)}px;font-size:84px">Comment <span class="kw">{K}</span><br>to get the <em>HTML/CSS</em></h1>
<p class="sub" style="left:60px;top:{ct.get("sub_top",330)}px;right:200px">{ct["sub"]}</p><div class="steps" style="top:{ct.get("steps_top",440)}px">{steps}</div>
<ul class="ben" style="{ct.get("ben","left:60px;top:620px")}">{bul}</ul>{f4.html}{codewin(ct["code"]) if ct.get("code") else ""}
<div class="gobtn" style="{ct.get('go','left:60px;top:1130px')}"><svg viewBox="0 0 24 24"><path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/></svg></div>''',4,N,W,H,'lt cta')
# Pinterest pin 1000x1500
P=C['pin']; fp=Frames(P['frames'])
sw=''.join(f'<div class="sw"><i style="background:{c}"></i><span><b>{n}</b><small>{c}</small></span></div>' for n,c in P['palette'])
feat=''.join(f'<span>{x}</span>' for x in P['features'])
if want('pin'): shot('pin',f'''<h1 class="c" style="top:{P.get("h1_top",104)}px;font-size:70px">{C["pin_title"]}</h1><p class="sub c" style="top:{P.get("sub_top",270)}px;font-size:26px">{P.get("sub","")}</p>
{fp.html}
<div class="pal" style="left:50px;right:50px;top:{P["pal_top"]}px">{sw}</div>
<div class="card" style="left:50px;top:{P["card_top"]}px;width:340px;height:{P.get("card_h",270)}px"><div class="tagl">Fonts</div>
<h3 style="margin-top:14px">Space Grotesk</h3><p style="margin-top:2px">Headings &amp; numbers · 600–700</p>
<h3 style="margin-top:14px;font-family:Geist;font-weight:600">Geist</h3><p style="margin-top:2px">UI &amp; body · 400–600 · 20px card radius</p></div>
<div class="card fr" style="left:410px;top:{P["card_top"]}px;width:540px;height:{P.get("card_h",270)}px"><div class="tagl">Build it</div>
<h3 style="margin-top:14px">{P["idea"]}</h3><p style="margin-top:8px"><b class="ink">Stack:</b> {P["stack"]}</p><div class="chipz">{feat}</div></div>''',1,1,1000,1500,'lt pinb')
