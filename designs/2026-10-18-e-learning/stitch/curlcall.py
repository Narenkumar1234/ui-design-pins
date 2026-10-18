"""Stitch call via curl (urllib keeps getting RemoteDisconnected on long generate calls). Key read from env, passed on stdin."""
import os,json,subprocess,itertools
_id=itertools.count(1)
def call(name,args,timeout=900):
    body=json.dumps({"jsonrpc":"2.0","id":next(_id),"method":"tools/call","params":{"name":name,"arguments":args}})
    cfg=f'header = "X-Goog-Api-Key: {os.environ["STITCH_API_KEY"]}"\n'
    p=subprocess.run(['curl','-sS','-m',str(timeout),'-K','-','-X','POST','https://stitch.googleapis.com/mcp','-H','Content-Type: application/json',
        '-H','Accept: application/json, text/event-stream','--data-binary',body],input=cfg,capture_output=True,text=True)
    raw=p.stdout
    if p.returncode: raise RuntimeError(f'curl {p.returncode} {p.stderr[:200]}')
    if not raw.lstrip().startswith('{'):
        msgs=[json.loads(l[5:]) for l in raw.splitlines() if l.startswith('data:') and l[5:].strip()]; res=msgs[-1]
    else: res=json.loads(raw)
    r=res.get('result',res)
    if isinstance(r,dict) and r.get('structuredContent') is not None: return r['structuredContent']
    if isinstance(r,dict) and 'content' in r:
        out=[]
        for c in r['content']:
            t=c.get('text')
            try: out.append(json.loads(t))
            except Exception: out.append(t)
        return out[0] if len(out)==1 else out
    return res
