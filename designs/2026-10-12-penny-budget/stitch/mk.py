import sys; sys.path.insert(0,'/workspace/stitch')
import stitch, json
p=stitch.call('create_project',{'title':'Penny Budget App UI (code.in.30s)'})
json.dump(p,open('create_project.json','w'),indent=1); print(p)
P=p['name'].split('/')[-1]; open('project_id.txt','w').write(P)
common="""# Penny (code.in.30s)
Strictly MINIMALISM: generous whitespace, calm layout, clear hierarchy, refined typography.
Subtle 1px hairline borders (no heavy outlines), NO hard/offset shadows, NO gradients, NO glows, NO blur, NO photos, NO illustrations.
Restrained palette: neutrals plus only TWO accents (green for income / primary, terracotta for expenses). Thin line icons (1.5px stroke).
Corners 12-16px on cards, pill chips. Large light-weight numerals for money. Manrope headlines, Inter body. Personal finance / expense tracker app.
"""
light=common+"""## Light palette
background #FAFAF7, cards #FFFFFF, hairline borders #ECEAE4, ink #17181C, muted text #6E6F76,
primary green #1F7A5A (primary buttons with white text, income amounts, active nav), expense terracotta #C2553A (expense amounts only)."""
dark=common+"""## Dark palette (proper dark theme, not inverted)
background #0F1012, cards #17181B, hairline borders #26282D, ink #EDEDEA, muted text #8E9097,
primary green #4FC59A (primary buttons with #0F1012 text, income, active nav), expense terracotta #E07A5F (expense amounts only)."""
out={}
for mode,md,c,bg,t in (('LIGHT',light,'#1F7A5A','#FAFAF7','#C2553A'),('DARK',dark,'#4FC59A','#0F1012','#E07A5F')):
    r=stitch.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Penny {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'MANROPE','bodyFont':'INTER','roundness':'ROUND_TWELVE','customColor':c,
      'overridePrimaryColor':c,'overrideSecondaryColor':t,'overrideTertiaryColor':t,
      'overrideNeutralColor':bg,'colorVariant':'NEUTRAL','designMd':md}}})
    out[mode]=r; print(mode,json.dumps(r)[:600])
json.dump(out,open('design_systems.json','w'),indent=1)
