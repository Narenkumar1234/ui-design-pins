# Fallback: same LIGHT cart prompt, without the designSystem param (Stitch kept dropping the connection on this one)
import sys, json, time, os, curlcall
sys.argv=['gen.py','LIGHT']
src=open('gen.py').read().split("which=sys.argv[2:]")[0]
exec(src)
log=json.load(open('gen_log_light.json'))
for attempt in range(10):
    t=time.time(); print('START nods cart',attempt,flush=True)
    try: r=curlcall.call('generate_screen_from_text',{'projectId':P,'prompt':screens['cart'],'deviceType':'MOBILE'},timeout=900)
    except Exception as e: print('EXC',round(time.time()-t),e,flush=True); time.sleep(20); continue
    log['LIGHT-cart']=r; json.dump(log,open('gen_log_light.json','w'),indent=1); print('OK',round(time.time()-t),json.dumps(r)[:200],flush=True)
    if 'screens' in json.dumps(r): break
