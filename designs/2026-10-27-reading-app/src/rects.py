"""Dump element rects (css px in the 390x844 shot) used to aim slide callouts. Usage: /workspace/.venv-pw/bin/python rects.py > rects.json"""
import json
from playwright.sync_api import sync_playwright
KIT='http://127.0.0.1:8811/'
Q={'home':('index.html',['#streak','#flame','#week','#current .track','#current a.pill','#ring','#log-btn','.nav']),
   'detail':('book.html?id=salt-signal',['#cover','#facts','#facts > div:first-child','#shelf-btn','#prog .track','#cta','#mine']),
   'profile':('profile.html',['#tiles','#tiles > div:nth-child(4)','#tiles > div:first-child','.chip','#shelf','#yg']),
   'reader':('reader.html?id=long-noon',['mark','#aa','#bar','#next','#pos']),
   'shelf':('shelf.html',['#tabs','#genres','#grid > a:first-child','#q'])}
out={}
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  for k,(u,sels) in Q.items():
    ctx=b.new_context(viewport={'width':390,'height':844}); pg=ctx.new_page(); pg.goto(KIT+u+('&' if '?' in u else '?')+'theme=light'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(500)
    out[k]={s:[round(v) for v in pg.evaluate("s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x,r.y,r.width,r.height]}",s)] for s in sels}
    ctx.close()
  b.close()
print(json.dumps(out,indent=1))
