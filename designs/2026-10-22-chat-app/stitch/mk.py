import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, curlcall, os
if not os.path.exists('project_id.txt'):
    r=curlcall.call('create_project',{'title':'Natter Chat App UI (code.in.30s)'},timeout=180)
    json.dump(r,open('create_project.json','w'),indent=1); print(json.dumps(r)[:300])
    open('project_id.txt','w').write(r['name'].split('/')[-1])
P=open('project_id.txt').read().strip()
common="""# Natter chat app (code.in.30s)
Friendly messaging mobile app. Airy, clean style with lots of whitespace: white rounded cards (20px radius), fully rounded chat bubbles (18px) with one tight 4px corner, full-round pill search bar and chips, geometric sans (Poppins-like, Montserrat) (bold headings, light grey message previews). ONE saturated violet accent #5B3FD0 used for headers, the active nav icon, sent message bubbles, primary buttons and a vertical violet icon action rail. Small pink #FF5C8A and orange #FF9F43 accents only for reactions, unread badges and online dots. Avatars are initials on soft gradient circles (no photos). Thin rounded line icons. No neon, no emoji except small reaction emoji.
"""
light=common+"""## Light (hero): very pale lavender-white page #F1F0FF, cards #FFFFFF, raised #E9E6FF, ink #1E1B3A, muted #8A87A6. Violet #5B3FD0 accent."""
dark=common+"""## Dark: deep violet-black page #120E24, cards #1C1733, raised #262042, ink #F1F0FF, muted #9893B8. Violet #6A4FE0 accent, lighter violet text #A08BFF."""
out={}
for mode,md,bg in (('LIGHT',light,'#F1F0FF'),('DARK',dark,'#120E24')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Natter {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'MONTSERRAT','bodyFont':'MONTSERRAT','roundness':'ROUND_FULL','customColor':'#5B3FD0',
      'overridePrimaryColor':'#5B3FD0','overrideSecondaryColor':'#1C1733' if mode=='DARK' else '#FFFFFF','overrideTertiaryColor':'#FF5C8A',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
