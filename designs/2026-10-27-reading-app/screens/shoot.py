"""Render Folio kit pages as phone screens with Playwright: 390x844 @2x (780x1688), fresh context per shot (clean localStorage),
animations frozen, copy to ../final/screens/. Logs console errors. Usage: python shoot.py [name ...]"""
import asyncio, sys, shutil
from playwright.async_api import async_playwright
KIT='http://127.0.0.1:8811/'
PAGES={'home':'index.html','detail':'book.html?id=salt-signal','profile':'profile.html','reader':'reader.html?id=long-noon','shelf':'shelf.html',
       'home2':'index.html#scroll','profile2':'profile.html#scroll','detail2':'book.html?id=salt-signal#scroll'}
SHOTS={**{f'light-{n}':(u,'light') for n,u in PAGES.items()},**{f'dark-{n}':(u,'dark') for n,u in PAGES.items()}}
FREEZE='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
async def main(names):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for n in names:
      u,t=SHOTS[n]; scroll=u.endswith('#scroll'); u=u.replace('#scroll','')
      url=KIT+u+('&' if '?' in u else '?')+f'theme={t}'
      ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2); pg=await ctx.new_page()
      errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append(str(e)))
      await pg.goto(url); await pg.wait_for_load_state('networkidle'); await pg.add_style_tag(content=FREEZE); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(700)
      if scroll: await pg.evaluate('window.scrollTo(0, document.body.scrollHeight)'); await pg.wait_for_timeout(300)
      await pg.screenshot(path=n+'.png'); await ctx.close(); shutil.copy(n+'.png','../final/screens/'+n+'.png'); print('shot',n,'ERRORS:' if errs else '',errs)
    await b.close()
asyncio.run(main(sys.argv[1:] or list(SHOTS)))
