"""Dump element centres/rects (css px in the 390x820 screenshot) for callout targeting."""
import asyncio, json, subprocess, time
from playwright.async_api import async_playwright
K='/workspace/products/smart-home-ui-kit/code/'
Q={'home':('index.html',['.search','#rooms [data-room=all]','#rooms [data-room=living]','[data-id=living-lights]','[data-id=living-ac] .switch','[data-id=living-ac]','#on-count','#fab','[data-id=router]','nav a[aria-current]','h1']),
 'lights':('room.html?id=living&tab=lights',['#bri','#temps','#temps [data-k="2700"]','#glow','#lamps','#lamps [data-lamp="1"]','#power .knob','.seg','#light-sched','#bri-val']),
 'climate':('room.html?id=living&tab=climate',['#dial','#knob','#temp','#modes [data-mode=cool]','#fan','#ac-sched','#power .knob','#power','#minus','#plus','#ac-status','#rooms']),
 'energy':('energy.html',['.seg','#bars [data-i="3"] i','#tip','#delta','#top','#top > div','#total','#fab','#export']),
 'scenes':('energy.html?scene=movie&at=scenes',['[data-scene=movie]','[data-scene=morning]','#scene-grid','#top']),
 'welcome':('welcome.html',['#start','#start .knob','#dots','#ob-title','#ambient','#skip'])}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await (await b.new_context(viewport={'width':390,'height':820})).new_page(); out={}
    for k,(u,sels) in Q.items():
      for th in ('dark',):
        await pg.goto('file://'+K+u+('&' if '?' in u else '?')+'theme='+th+'&shot=1'); await pg.evaluate("localStorage.clear();localStorage.setItem('hearth.theme','dark')")
        await pg.goto('file://'+K+u+('&' if '?' in u else '?')+'theme='+th+'&shot=1'); await pg.wait_for_timeout(600)
        for s in sels:
          r=await pg.evaluate(f"(()=>{{const e=document.querySelector('{s}');if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}})()")
          if r: print(f'{k:8s} {s:34s} xywh={r} c=({r[0]+r[2]//2},{r[1]+r[3]//2})')
          else: print(k,s,'MISSING')
    await b.close()
asyncio.run(main())
