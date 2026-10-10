"""Download screenshots + HTML for Stitch screens.
Usage: python3 download.py PROJECT_ID OUTDIR [gen_log*.json ...]
Screens come from list_screens plus any screen names found in gen logs (keys used as file names)."""
import stitch,json,sys,os,urllib.request,re,glob
P,OUT=sys.argv[1],sys.argv[2]; logs=sys.argv[3:]; os.makedirs(OUT,exist_ok=True)
names={}
for lf in logs:
    for key,res in json.load(open(lf)).items():
        for m in re.findall(r'"name": "(projects/\d+/screens/[0-9a-f]+)"', json.dumps(res)):
            names.setdefault(m,key.lower())
r=stitch.call('list_screens',{'projectId':P})
for s in (r.get('screens',[]) if isinstance(r,dict) else []): names.setdefault(s['name'],None)
def get(url,path):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=120) as f: open(path,'wb').write(f.read())
meta=[]
for n,key in names.items():
    s=stitch.call('get_screen',{'name':n})
    if not isinstance(s,dict) or 'name' not in s: print('ERR',n,str(s)[:200]); continue
    title=key or re.sub(r'[^a-z0-9]+','-',(s.get('title') or n.split('/')[-1]).lower()).strip('-')
    base=os.path.join(OUT,title)
    if s.get('screenshot',{}).get('downloadUrl'):
        u=s['screenshot']['downloadUrl']
        if 'googleusercontent' in u and '=' not in u.rsplit('/',1)[-1]: u+='=s0'
        get(u,base+'.png')
    if s.get('htmlCode',{}).get('downloadUrl'): get(s['htmlCode']['downloadUrl'],base+'.html')
    meta.append({'file':title,'name':n,'title':s.get('title'),'width':s.get('width'),'height':s.get('height')})
    print(title,'|',s.get('title'),'|',n,s.get('width'),'x',s.get('height'))
json.dump(meta,open(os.path.join(OUT,'screens.json'),'w'),indent=1)
