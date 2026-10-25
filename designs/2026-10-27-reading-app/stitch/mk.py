import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, curlcall, os
if not os.path.exists('project_id.txt'):
    r=curlcall.call('create_project',{'title':'Folio Reading Tracker UI (code.in.30s)'},timeout=180)
    json.dump(r,open('create_project.json','w'),indent=1); print(json.dumps(r)[:300])
    open('project_id.txt','w').write(r['name'].split('/')[-1])
P=open('project_id.txt').read().strip()
common="""# Folio reading tracker (code.in.30s)
Minimal monochrome book reading tracker mobile app for students. Near-black ink #141414, off-white #F5F4F0, grey #8A8A8A secondary text, ONE bold accent orange #E8742A (progress bars, streak flame, active nav, primary button). Tiny yellow #F5C518 stars only for ratings. Geometric sans: heavy 800 titles, small regular body. Fully rounded pill buttons and chips, 10px radius book covers and tiles, hairline borders, NO heavy shadows, no gradients. Book covers are flat graphic/typographic designs (big type, simple shapes) with invented titles. No photos of people except simple initials avatars.
"""
light=common+"""## Light: background off-white #F5F4F0, cards white #FFFFFF with #E7E5DF border, ink #141414, muted #8A8A8A, accent #E8742A."""
dark=common+"""## Dark: background #141414, cards #1E1E1E with #2A2A2A border, ink #F5F4F0, muted #8A8A8A, accent #E8742A."""
out={}
for mode,md,bg in (('LIGHT',light,'#F5F4F0'),('DARK',dark,'#141414')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Folio {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'LEXEND','bodyFont':'LEXEND','roundness':'ROUND_TWELVE','customColor':'#E8742A',
      'overridePrimaryColor':'#E8742A','overrideSecondaryColor':'#141414','overrideTertiaryColor':'#F5C518',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
