import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, curlcall, os
if not os.path.exists('project_id.txt'):
    r=curlcall.call('create_project',{'title':'Hearth Smart Home App UI (code.in.30s)'},timeout=180)
    json.dump(r,open('create_project.json','w'),indent=1); print(json.dumps(r)[:300])
    open('project_id.txt','w').write(r['name'].split('/')[-1])
P=open('project_id.txt').read().strip()
common="""# Hearth smart home app (code.in.30s)
Smart home control mobile app. Clean modern style: soft rounded cards (20-24px radius), full-round pill search bars and chips, clean geometric sans (Outfit), big bold headings, small muted subtext. ONE vivid orange accent #F2762E used sparingly: pills, active nav icon, toggles ON, the centered + floating action button and ONE highlighted full-orange device card per screen. Floating rounded bottom nav bar with a centered orange round + FAB. Thin rounded line icons. Status chips like 'On', 'Auto', 'Away'. No gradients except a photo scrim, no neon, no emoji.
"""
dark=common+"""## Dark (hero): charcoal near-black page #1A1A1A, cards #2A2A2A, raised #333333, ink #F5F2EE off-white, muted #8C8782. Orange #F2762E accent."""
light=common+"""## Light: warm off-white page #F5F2EE, cards #FFFFFF, raised #ECE7E1, ink charcoal #1A1A1A, muted #8C8782. Same orange #F2762E accent."""
out={}
for mode,md,bg in (('DARK',dark,'#1A1A1A'),('LIGHT',light,'#F5F2EE')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Hearth {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'OUTFIT','bodyFont':'OUTFIT','roundness':'ROUND_FULL','customColor':'#F2762E',
      'overridePrimaryColor':'#F2762E','overrideSecondaryColor':'#2A2A2A' if mode=='DARK' else '#FFFFFF','overrideTertiaryColor':'#8C8782',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
