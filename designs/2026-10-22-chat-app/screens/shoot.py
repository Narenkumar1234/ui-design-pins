"""Render kit pages as phone screens with Playwright: 390x820 @2x (780x1640), fresh context per shot (clean localStorage), copy to ../final/screens/.
Usage: python3 shoot.py [name ...]"""
import asyncio, sys, shutil, os
from playwright.async_api import async_playwright
KIT='file:///workspace/products/chat-app-ui-kit/code/'
PAGES={'welcome':'welcome.html','chats':'index.html','chat':'chat.html?id=maya&typing=1','calls':'calls.html','profile':'profile.html','group':'chat.html?id=squad&info=1'}
SHOTS={f'{t}-{n}':(u,t) for t in ('light','dark') for n,u in PAGES.items()}
async def main(names):
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for n in names:
      u,t=SHOTS[n]; ctx=await b.new_context(viewport={'width':390,'height':820},device_scale_factor=2); pg=await ctx.new_page()
      await pg.goto(KIT+u+('&' if '?' in u else '?')+f'theme={t}&shot=1'); await pg.wait_for_timeout(1200)
      await pg.screenshot(path=n+'.png'); await ctx.close(); shutil.copy(n+'.png','../final/screens/'+n+'.png'); print('shot',n)
    await b.close()
asyncio.run(main(sys.argv[1:] or list(SHOTS)))
