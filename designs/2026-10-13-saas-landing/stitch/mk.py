import sys; sys.path.insert(0,'/workspace/stitch')
import stitch, json
p=stitch.call('create_project',{'title':'Klar SaaS Landing Page UI (code.in.30s)'})
json.dump(p,open('create_project.json','w'),indent=1)
P=p['name'].split('/')[-1]; open('project_id.txt','w').write(P); print(P)
common="""# Klar SaaS landing page (code.in.30s)
Minimal sales-analytics SaaS marketing site. Soft radius (12px), hairline borders, generous whitespace, Inter/Manrope, thin line icons, NO photos, NO emoji, NO neon glows.
"""
light=common+"""## Light: near-white/light-grey. background #F5F5F7, cards #FFFFFF with 1px #E5E7EB hairline borders and very soft shadows, ink #111827, muted #6B7280, ONE indigo accent #4F46E5 (primary button, highlighted pricing plan, chart bars). Secondary soft violet #818CF8 sparingly. Clean medium-weight sans headlines."""
dark=common+"""## Dark: deep neutral zinc (NOT navy, NOT neon). background #18181B, cards #27272A with 1px #3F3F46 borders, ink #FAFAFA, muted #A1A1AA, ONE indigo accent #6366F1 for primary button, highlighted plan and chart bars. Soft surfaces, no glows, no gradients on backgrounds."""
out={}
for mode,md,c,bg,t in (('LIGHT',light,'#4F46E5','#F5F5F7','#818CF8'),('DARK',dark,'#6366F1','#18181B','#818CF8')):
    r=stitch.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Klar {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'MANROPE','bodyFont':'INTER','roundness':'ROUND_TWELVE','customColor':c,
      'overridePrimaryColor':c,'overrideSecondaryColor':t,'overrideTertiaryColor':t,
      'overrideNeutralColor':bg,'colorVariant':'NEUTRAL','designMd':md}}})
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
