#!/usr/bin/env python3
"""UI Design Pins carousel template v2 (+ Klar browser mock on cover).
Usage: python3 render.py config.json"""
import json,os,sys,subprocess,html
HERE=os.path.dirname(os.path.abspath(__file__))
cfg_path=os.path.abspath(sys.argv[1]); C=json.load(open(cfg_path)); base=os.path.dirname(cfg_path)
out=os.path.join(base,C.get('out','.')); os.makedirs(out,exist_ok=True)
def u(p): return 'file://'+os.path.abspath(os.path.join(base,p))
HANDLE=C.get('handle','code.in.30s'); TAGS=C.get('tags',['HTML','CSS','TAILWIND','UI'])
CSS=open(os.path.join(HERE,'style.css')).read()
def phone(src,w,rot=0,x=0,y=0,z=1,dark=False):
  return f'''<div class="phone{' dk' if dark else ''}" style="width:{w}px;transform:translate({x}px,{y}px) rotate({rot}deg);z-index:{z}">
  <div class="scr"><div class="sb"><span>9:41</span><span class="ic">▂▄▆ ◔ ▮</span></div><img src="{u(src)}"><div class="notch"></div><div class="home"></div></div></div>'''
def fan(scr,dark=False,w=300,spread=245,lift=40):
  n=len(scr); mid=(n-1)/2; s=''
  for i,p in enumerate(scr):
    d=i-mid; s+=phone(p,w,rot=d*5,x=d*spread-w/2,y=abs(d)*lift,z=10-int(abs(d)*2),dark=dark)
  return f'<div class="fan">{s}</div>'
def page(body,i,n,W,H,cls=''):
  return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body class="{cls}" style="width:{W}px;height:{H}px">
<header><b>{HANDLE}</b><span>{(str(i)+" / "+str(n)+" &nbsp;→") if n>1 else ""}</span></header>{body}
<footer><b>{HANDLE}</b><span>{' / '.join(TAGS)}</span></footer></body></html>'''
def callouts(cs):
  s=''
  for c in cs:
    side=c.get('side','l')
    s+=f'<div class="co {side}" style="top:{c["y"]}px;{"left" if side=="l" else "right"}:{c.get("x",40)}px"><span class="lb">{html.escape(c["label"])}</span><i style="width:{c.get("len",90)}px"></i><em></em></div>'
  return s
def browser_mock():
  if not C.get('browser_mock'): return ''
  return '''<div class="browser"><div class="bar"><i></i><i></i><i></i></div><div class="body">
    <div class="stat"><span>Monthly recurring revenue</span><b>$48,240</b><span class="pill">+12.4% MoM</span></div>
    <svg viewBox="0 0 300 50" style="width:100%;height:50px;margin-top:12px" preserveAspectRatio="none"><path d="M0,40 C40,38 60,28 100,30 C140,32 160,12 200,16 C240,20 260,8 300,10" fill="none" stroke="#4F46E5" stroke-width="2.5"/><path d="M0,40 C40,38 60,28 100,30 C140,32 160,12 200,16 C240,20 260,8 300,10 L300,50 L0,50 Z" fill="#4F46E5" opacity=".12"/></svg>
  </div></div>
  <div class="floatcard"><span>Pipeline health</span><b>On track</b><div class="meter"><i></i></div><span style="display:block;margin-top:6px">$312k weighted</span></div>'''
def chips_html():
  s=''
  for c in C.get('chips',[]):
    s+=f'<div class="chip" style="{c["pos"]}"><b>{html.escape(c["v"])}</b>{html.escape(c["t"])}</div>'
  return s
def shot(name,body,i,n,W,H,cls=''):
  f=os.path.join(out,f'_{name}.html'); open(f,'w').write(page(body,i,n,W,H,cls))
  png=os.path.join(out,f'{name}.png')
  subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={W},{H}',
    '--virtual-time-budget=6000',f'--screenshot={png}',f'file://{f}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); print('wrote',png)
L,D=C['light'],C['dark']; A=C['app']; K=C['keyword']; N=4; W,H=1080,1350
# 1 cover
shot('slide-1',f'''<h1>{C["hook"]}</h1><p class="sub">{C["hook_sub"]}</p>{browser_mock()}{chips_html()}{fan([D[0],L[0],L[1],L[2]],w=262,spread=218,lift=30)}''',1,N,W,H,'cover')
# 2 light + callouts
shot('slide-2',f'''<h1 class="m">{C["light_title"]}</h1><p class="sub">{C["light_sub"]}</p>
<div class="stage">{fan(L,w=310,spread=290,lift=30)}{callouts(C.get("callouts",[]))}</div>''',2,N,W,H)
# 3 dark
shot('slide-3',f'''<h1 class="m">{C["dark_title"]}</h1><p class="sub">{C["dark_sub"]}</p>
<div class="stage">{fan(D,dark=True,w=310,spread=290,lift=30)}{callouts(C.get("dark_callouts",[]))}</div>''',3,N,W,H,'night')
# 4 CTA
steps=''.join(f'<div class="st"><span>{j+1:02d}</span>{s}</div>'+('<i class="ar">→</i>' if j<4 else '') for j,s in enumerate(['Design','HTML','Tailwind','Responsive','Kit']))
bul=''.join(f'<li><b>✓</b>{b}</li>' for b in C['benefits'])
shot('slide-4',f'''<h1 class="m">Comment <span class="kw">{K}</span><br>to get the <b>HTML/CSS</b></h1>
<p class="sub">{C["cta_sub"]}</p><div class="steps">{steps}</div><ul class="ben">{bul}</ul>
<div class="mini">{phone(L[0],210,-6,0,0,1)}{phone(D[0],210,6,0,0,2,True)}</div>''',4,N,W,H,'cta')
# pinterest pin
shot('pin',f'''<h1 class="pin">{C["pin_title"]}</h1><p class="sub">{C["pin_sub"]}</p>
<div class="stage pinst">{fan([L[0],L[1],D[0],D[1]],w=225,spread=175,lift=28)}</div>
<div class="pinfoot">Light + Dark · HTML / CSS / Tailwind kit</div>''',1,1,1000,1500,'pinb')
