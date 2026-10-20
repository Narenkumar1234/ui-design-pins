"""Scrolled 'Scenes' phone screens (headless --screenshot can't capture scrolled pages): Playwright, 390x820 @2x -> ../final/screens/"""
import asyncio, shutil
from playwright.async_api import async_playwright
K='file:///workspace/products/smart-home-ui-kit/code/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for th in ('dark','light'):
      ctx=await b.new_context(viewport={'width':390,'height':820},device_scale_factor=2); pg=await ctx.new_page()
      await pg.goto(K+f'energy.html?theme={th}&scene=movie&at=scenes&shot=1'); await pg.wait_for_timeout(1500)
      await pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)"); await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'{th}-scenes.png'); shutil.copy(f'{th}-scenes.png',f'../final/screens/{th}-scenes.png'); print(th,'scenes ok')
      await ctx.close()
    await b.close()
asyncio.run(main())
