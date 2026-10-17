import sys; sys.path.insert(0,'/workspace/stitch')
import stitch, json
P=open('project_id.txt').read().strip()
common="""# Ember food delivery app (code.in.30s)
Customer food ordering mobile app. Warm editorial minimal style: elegant SERIF display headings (Newsreader, with one italic orange accent phrase), clean geometric sans (DM Sans) for all UI text, big real overhead food photography with soft warm shadows, 20px radius cards, full-round pill chips and pill search bar, round icon category chips, soft diffuse warm-brown shadows, thin rounded line icons. NO emoji, NO illustrations, NO neon, NO purple/blue.
"""
light=common+"""## Light: warm cream background #FBF4EC, cards white #FFFFFF with soft shadow rgba(120,70,40,0.10) and 1px #F0E3D6 border, ink espresso #2B1D14, secondary text #8C7B6E. ONE accent: orange #E8622C to terracotta #C9502A gradient for primary CTA, active chip, active nav, prices highlight. Peach tint #FDE3D2 for icon circles and soft chips. Gold #F2A93B for rating stars, small green #4E9A5B only for 'Free delivery'."""
dark=common+"""## Dark: warm espresso dark (NOT pure black, NOT blue): background #1B1411, cards/surfaces #2A201B with 1px rgba(255,236,220,0.08) border, ink #F8EDE3, secondary #A8968A. Same orange #F0703A to terracotta #D4572B gradient for CTA, active chip and active nav. Icon circles #3A2A22. Gold #F2A93B stars. No glow."""
out={}
for mode,md,c,bg in (('LIGHT',light,'#E8622C','#FBF4EC'),('DARK',dark,'#F0703A','#1B1411')):
    r=stitch.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Ember {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'NEWSREADER','bodyFont':'DM_SANS','roundness':'ROUND_TWELVE','customColor':c,
      'overridePrimaryColor':c,'overrideSecondaryColor':'#C9502A','overrideTertiaryColor':'#F2A93B',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}})
    out[mode]=r; print(mode,json.dumps(r)[:300])
json.dump(out,open('design_systems.json','w'),indent=1)
