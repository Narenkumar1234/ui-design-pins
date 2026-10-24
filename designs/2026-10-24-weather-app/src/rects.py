"""Dump element centres (css px in the 390x820 screenshot) for callout targeting."""
import asyncio
from playwright.async_api import async_playwright
K='http://127.0.0.1:8783/'
Q={'home':('index.html?theme=light',['#loc','#temp','#alert','#hm','#stats','#pager','nav']),
 'forecast':('forecast.html?theme=light&h=9',['.seg','#chart','#tip','#days','#days li:nth-child(2)']),
 'cities':('cities.html?theme=light',['#q','[data-city]','#edit']),
 'details':('details.html?theme=light',['[data-tile=aqi]','[data-tile=uv]','[data-tile=wind]','[data-tile=sun]','[data-tile=hum]']),
 'settings':('settings.html?theme=light',['[data-toggle=live]','[data-toggle=sky]','.seg']),
 'dhome':('index.html?theme=dark&city=nyc',['#temp','#cond','#alert']),
 'dforecast':('forecast.html?theme=dark&city=nyc&metric=rain&h=6',['#chart','#tip','.seg']),
 'ddetails':('details.html?theme=dark&city=nyc',['[data-tile=wind]','[data-tile=sun]','[data-tile=aqi]'])}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for k,(u,sels) in Q.items():
      pg=await (await b.new_context(viewport={'width':390,'height':820})).new_page()
      await pg.goto(K+u); await pg.wait_for_timeout(900)
      for s in sels:
        r=await pg.evaluate("(s)=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}",s)
        print(f'{k:9s} {s:28s} xywh={r} c=({r[0]+r[2]//2},{r[1]+r[3]//2})' if r else f'{k} {s} MISSING')
    await b.close()
asyncio.run(main())
