import sys,json,time; sys.path.insert(0,'.')
import curlcall
exec(open('mk.py').read().split('out={}')[0].split("if not os.path.exists")[0])
P=open('project_id.txt').read().strip()
src=open('mk.py').read(); light=None
ns={}; exec(src.split('out={}')[0].replace("if not os.path.exists('project_id.txt'):","if False:"),ns)
for i in range(5):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':'Folio Light','theme':{
      'colorMode':'LIGHT','headlineFont':'LEXEND','bodyFont':'LEXEND','roundness':'ROUND_TWELVE','customColor':'#E8742A',
      'overridePrimaryColor':'#E8742A','overrideSecondaryColor':'#141414','overrideTertiaryColor':'#F5C518',
      'overrideNeutralColor':'#F5F4F0','colorVariant':'FIDELITY','designMd':ns['light']}}},timeout=180)
    print(json.dumps(r)[:200])
    if isinstance(r,dict): break
    time.sleep(20)
d=json.load(open('design_systems.json')); d['LIGHT']=r; json.dump(d,open('design_systems.json','w'),indent=1)
