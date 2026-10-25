"""Render Orbit kit pages for slides with Playwright. Desktop 1440x900 @2x (2880x1800), mobile 390x844 @2x (780x1688).
Fresh context per shot (clean localStorage = demo data, fixed demo clock 25 Oct 2026 10:00), animations frozen; copies to ../final/screens/.
Needs the kit served:  cd /workspace/products/job-tracker-ui-kit/code && python3 -m http.server 8795 --bind 127.0.0.1
Usage: python3 shoot.py [name ...]"""
import asyncio, sys, shutil
from playwright.async_api import async_playwright
KIT='http://127.0.0.1:8795/'
D={'dashboard':'index.html','board':'board.html','detail':'application.html?id=northwind','interviews':'interviews.html','settings':'settings.html'}
M={'mboard':'board.html','mdash':'index.html','mdetail':'application.html?id=northwind'}
SHOTS={}
for t in ('light','dark'):
  for n,u in D.items(): SHOTS[f'{t}-{n}']=(u,t,(1440,900))
  for n,u in M.items(): SHOTS[f'{t}-{n}']=(u,t,(390,844))
FREEZE='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
async def main(names):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for n in names:
      u,t,(w,h)=SHOTS[n]; url=KIT+u+('&' if '?' in u else '?')+f'theme={t}'
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2); pg=await ctx.new_page()
      await pg.goto(url); await pg.wait_for_load_state('networkidle'); await pg.add_style_tag(content=FREEZE)
      await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(900)
      await pg.screenshot(path=n+'.png'); await ctx.close(); shutil.copy(n+'.png','../final/screens/'+n+'.png'); print('shot',n)
    await b.close()
asyncio.run(main(sys.argv[1:] or list(SHOTS)))
