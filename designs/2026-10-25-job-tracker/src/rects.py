"""Dump element rects (css px) of the kit pages at the shoot.py viewports, used to anchor slide callouts.
Usage: /workspace/.venv-pw/bin/python rects.py"""
import asyncio, json
from playwright.async_api import async_playwright
KIT='http://127.0.0.1:8795/'
Q={('board.html','light',1440,900):['.kcard[data-id=northwind]','.kcard[data-id=northwind] .tag-lime','#filters','#sort','#export','[data-col=interview] .col-h','.kcard[data-id=fernwood]','#search','#sidebar [data-nav=interviews] .badge','#goal-card'],
   ('index.html','dark',1440,900):['[data-stat=rate]','#chart','#chart .wk:last-of-type rect','#upcoming li:first-child','#nextup','#range','#pipe','[data-stat=total]'],
   ('index.html','light',1440,900):['[data-stat=rate]','#chart','#upcoming','#nextup'],
   ('application.html?id=northwind','light',1440,900):['#timeline','#nextstep','#advance','#d-salary','#ics'],
   ('board.html','light',390,844):['#tabs','#tabs [aria-pressed=true]','.kcard[data-id=northwind]','#fab','#mnav'],
   ('index.html','dark',390,844):['[data-stat=rate]','#mnav','#stats'],
   ('board.html','dark',390,844):['#tabs [aria-pressed=true]','.kcard[data-id=northwind] .tag-lime','#fab']}
async def main():
  out={}
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for (u,t,w,h),sels in Q.items():
      c=await b.new_context(viewport={'width':w,'height':h}); pg=await c.new_page()
      await pg.goto(KIT+u+('&' if '?' in u else '?')+'theme='+t); await pg.wait_for_load_state('networkidle'); await pg.wait_for_timeout(500)
      k=f'{u}|{t}|{w}'; out[k]={}
      for s in sels:
        r=await pg.evaluate("s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}", s)
        out[k][s]=r
      await c.close()
    await b.close()
  json.dump(out,open('rects.json','w'),indent=1); print(json.dumps(out,indent=0))
asyncio.run(main())
