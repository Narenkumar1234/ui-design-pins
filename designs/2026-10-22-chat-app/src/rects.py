"""Dump element centres/rects (css px in the 390x820 screenshot) for callout targeting."""
import asyncio
from playwright.async_api import async_playwright
K='/workspace/products/chat-app-ui-kit/code/'
Q={'chats':('index.html',['.search','#story-row','#story-row [data-story="0"]','#filters','[data-filter=unread]','[data-chat=maya]','[data-chat=maya] .badge','[data-chat=leo]','[data-chat=squad] .badge','nav','nav [aria-current]','#new-chat']),
 'chat':('chat.html?id=maya&typing=1',['.chat-head','#h-call','.msg[data-mid=m2] .bubble','.msg[data-mid=m3] .react','.msg[data-mid=m3] img','[data-play=m4]','[data-wave=m4]','.msg[data-mid=m5] .quote','#typing .bubble','#rail','[data-rail=mic]','#composer','#send']),
 'calls':('calls.html',['#live','#join','.seg','#log li:nth-child(3)','#log li:nth-child(3) b','#log [data-back]']),
 'profile':('profile.html',['#me-av','#status','#n-chats','[data-set=receipts]','.set-row']),
 'group':('chat.html?id=squad&info=1',['#i-body .welcome','#i-body ul','#i-body ul li:nth-child(2) span.h-6','#media-n','#i-mute']),
 'welcome':('welcome.html',['#go','#dots','#ob-title','#art','#art-wave'])}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await (await b.new_context(viewport={'width':390,'height':820})).new_page()
    for k,(u,sels) in Q.items():
      await pg.goto('file://'+K+u+('&' if '?' in u else '?')+'theme=light&shot=1'); await pg.evaluate("localStorage.clear();localStorage.setItem('natter.theme','light')")
      await pg.goto('file://'+K+u+('&' if '?' in u else '?')+'theme=light&shot=1'); await pg.wait_for_timeout(900)
      for s in sels:
        r=await pg.evaluate(f"(()=>{{const e=document.querySelector('{s}');if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}})()")
        print(f'{k:8s} {s:38s} xywh={r} c=({r[0]+r[2]//2},{r[1]+r[3]//2})' if r else f'{k} {s} MISSING')
    await b.close()
asyncio.run(main())
