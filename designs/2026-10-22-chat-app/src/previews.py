"""Gumroad previews for the Natter kit (cover 1280x720, thumbnail 600x600) using the slide style + fanned phones."""
import os,subprocess,tempfile,shutil,math,sys
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); CSS=open(os.path.join(HERE,'style.css')).read()
SC='/workspace/pins/2026-10-22-chat-app/final/screens/'; OUT='/workspace/products/chat-app-ui-kit/previews/'; os.makedirs(OUT,exist_ok=True)
def topcolor(src):
  im=Image.open(src).convert('RGB'); px=im.getpixel((im.width//2,3)); return '#%02x%02x%02x'%px, (.299*px[0]+.587*px[1]+.114*px[2])<140
def phone(n,cx,cy,w,rot,z):
  src=SC+n+'.png'; h=w*19.3/9; col,wt=topcolor(src)
  return f'''<div class="phone{' dk' if n.startswith('dark') else ''}" style="width:{w}px;left:{cx-w/2:.1f}px;top:{cy-h/2:.1f}px;z-index:{z};transform:rotate({rot}deg)"><div class="scr" style="background:{col}"><div class="sb{' wt' if wt else ''}"><span>9:41</span><span class="ic"><i></i><i></i><i></i><b></b></span></div><img src="file://{src}"><div class="notch"></div><div class="home"></div></div></div>'''
def shot(name,W,H,body,cls='lav'):
  f=os.path.join(OUT,'_'+name+'.html'); open(f,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} header,footer{{display:none}}</style></head><body class="{cls}" style="width:{W}px;height:{H}px"><div class="glow"></div><div class="blob b1"></div><div class="blob b2"></div>{body}</body></html>')
  prof=tempfile.mkdtemp(); subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--user-data-dir={prof}',f'--window-size={W},{H}','--virtual-time-budget=5000',f'--screenshot={OUT}{name}.png',f'file://{f}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); shutil.rmtree(prof,True); os.remove(f); print('wrote',name)
fan=lambda items: ''.join(phone(*a) for a in items)
shot('cover-1280x720',1280,720,f'''<h1 style="top:120px;font-size:66px;width:560px;letter-spacing:-2.4px">Natter<br><em>Chat App UI Kit</em></h1>
<p class="sub" style="top:300px;width:520px;font-size:24px">Chats, conversation, calls + profile. Light + dark in HTML, Tailwind and vanilla JS.</p>
<div class="gchip v" style="left:60px;top:440px;font-size:20px">$3 · no build step</div><div class="gchip w" style="left:270px;top:440px;font-size:20px"><i></i>Reactions · voice notes · stories</div>
<p style="position:absolute;left:62px;bottom:52px;font-size:20px;font-weight:600;color:#1E1B3A;z-index:20">code.in.30s</p>
{fan([("light-welcome",700,470,210,20,1),("light-chats",880,430,210,20,2),("light-chat",1060,390,210,20,3),("dark-chat",1240,350,210,20,4)])}''')
shot('thumbnail-600x600',600,600,f'''<h1 style="top:44px;left:40px;font-size:52px;letter-spacing:-2px">Natter <em>UI</em></h1>
<p class="sub" style="top:112px;left:42px;font-size:19px">Chat app kit · light + dark</p>
{fan([("light-chats",190,430,180,20,1),("light-chat",350,400,180,20,2),("dark-chat",510,370,180,20,3)])}''')
