"""Render Nimbus kit pages as phone screens with Playwright: 390x820 @2x (780x1640), fresh context per shot (clean localStorage),
animations frozen so drifting clouds are deterministic, copy to ../final/screens/.
Usage: python3 shoot.py [name ...]"""
import asyncio, sys, shutil
from playwright.async_api import async_playwright
KIT='http://127.0.0.1:8783/'
LIGHT={'home':'index.html','home2':'index.html#scroll','forecast':'forecast.html?h=9','cities':'cities.html','details':'details.html','settings':'settings.html','sheet':'details.html#aqi'}
DARK={'home':'index.html?city=nyc','home2':'index.html?city=nyc#scroll','forecast':'forecast.html?city=nyc&metric=rain&h=6','cities':'cities.html?city=nyc','details':'details.html?city=nyc','settings':'settings.html?city=nyc','sheet':'details.html?city=nyc#uv'}
SHOTS={**{f'light-{n}':(u,'light') for n,u in LIGHT.items()},**{f'dark-{n}':(u,'dark') for n,u in DARK.items()}}
FREEZE='*,*::before,*::after{animation-play-state:paused!important;animation-delay:-3s!important;transition:none!important;caret-color:transparent!important}'
async def main(names):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for n in names:
      u,t=SHOTS[n]; scroll=u.endswith('#scroll'); u=u.replace('#scroll','')
      base,_,h=u.partition('#')
      url=KIT+base+('&' if '?' in base else '?')+f'theme={t}'+('#'+h if h else '')
      ctx=await b.new_context(viewport={'width':390,'height':820},device_scale_factor=2); pg=await ctx.new_page()
      await pg.goto(url); await pg.add_style_tag(content=FREEZE); await pg.wait_for_timeout(1300)
      if scroll: await pg.evaluate('window.scrollTo(0, document.body.scrollHeight)'); await pg.wait_for_timeout(400)
      await pg.screenshot(path=n+'.png'); await ctx.close(); shutil.copy(n+'.png','../final/screens/'+n+'.png'); print('shot',n)
    await b.close()
asyncio.run(main(sys.argv[1:] or list(SHOTS)))
