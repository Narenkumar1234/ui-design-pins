import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, curlcall, os
if not os.path.exists('project_id.txt'):
    r=curlcall.call('create_project',{'title':'Orbit Job Tracker UI (code.in.30s)'},timeout=180)
    json.dump(r,open('create_project.json','w'),indent=1); print(json.dumps(r)[:300])
    open('project_id.txt','w').write(r['name'].split('/')[-1])
P=open('project_id.txt').read().strip()
common="""# Orbit job-application tracker (code.in.30s)
Clean minimal BENTO dashboard web app for students and new grads tracking internship / job applications. Rounded 20px cards on a calm background, generous whitespace, thin 1px hairline borders, no heavy shadows. Space Grotesk bold headings and big numerals, Geist for UI text. Deep forest green #1F4D3A primary, ONE lime accent #C6F35E for highlights (active nav pill, key stat, chart bar of current week, primary CTA text on green). Status colours: Wishlist slate, Applied blue-grey, Interview lime, Offer forest green, Rejected muted coral #E07A5F. Company logos are simple coloured letter monograms. No photos, no people, no neon, no gradients-heavy glassmorphism.
"""
light=common+"""## Light: background off-white #F6F5F0, cards white #FFFFFF with #E6E4DC border, ink #14181A, muted #5E6660."""
dark=common+"""## Dark: background near-black green #0E1512, cards #16211C with #24332B border, ink #EEF3EC, muted #9AA89F, accent lime #C6F35E."""
out={}
for mode,md,bg in (('LIGHT',light,'#F6F5F0'),('DARK',dark,'#0E1512')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Orbit {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'SPACE_GROTESK','bodyFont':'GEIST','roundness':'ROUND_TWELVE' ,'customColor':'#1F4D3A',
      'overridePrimaryColor':'#1F4D3A','overrideSecondaryColor':'#C6F35E','overrideTertiaryColor':'#E07A5F',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
