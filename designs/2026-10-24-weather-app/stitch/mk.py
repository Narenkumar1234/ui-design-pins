import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, curlcall, os
if not os.path.exists('project_id.txt'):
    r=curlcall.call('create_project',{'title':'Nimbus Weather App UI (code.in.30s)'},timeout=180)
    json.dump(r,open('create_project.json','w'),indent=1); print(json.dumps(r)[:300])
    open('project_id.txt','w').write(r['name'].split('/')[-1])
P=open('project_id.txt').read().strip()
common="""# Nimbus weather app (code.in.30s)
Glassmorphism weather mobile app. A soft full-bleed gradient sky background, with frosted translucent glass cards on top (white at 18-26% opacity, backdrop blur 24px, 1px white border at 50% opacity, 28px radius, soft shadow). Huge thin temperature numerals (Sora, weight 200), bold Sora headings, small caps labels. Flat soft weather icons (sun, clouds, rain drops) drawn as simple shapes. ONE warm sun accent #FFB238 for highlights (sun icon, UV, active tab dot, primary button). AQI scale uses green #3DD68C, yellow #FFD54A, orange #FF8A3D. No photos, no people, no neon.
"""
light=common+"""## Light (day, hero): sky gradient from #4FA3F7 (top) through #8CCBFF to warm horizon #FFD6A5 (bottom). Glass cards white 24% with white border. Ink deep navy #0F2A4A, muted #4D6A8C."""
dark=common+"""## Dark (night): night sky gradient from #071026 (top) through #0F2350 to #1D3B78 (bottom), tiny stars. Glass cards white 8% with white 14% border. Ink #EAF4FF, muted #9FB5D8, accent moon/sun #FFC861."""
out={}
for mode,md,bg in (('LIGHT',light,'#8CCBFF'),('DARK',dark,'#0F2350')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Nimbus {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'SORA','bodyFont':'SORA','roundness':'ROUND_FULL','customColor':'#4FA3F7',
      'overridePrimaryColor':'#4FA3F7','overrideSecondaryColor':'#FFFFFF' if mode=='LIGHT' else '#1D3B78','overrideTertiaryColor':'#FFB238',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
