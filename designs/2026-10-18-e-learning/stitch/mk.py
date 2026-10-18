import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import stitch, json, curlcall
P=open('project_id.txt').read().strip()


common="""# Lumo e-learning app (code.in.30s)
Online course / e-learning mobile app for students. Soft pastel CLAYMORPHISM style: big glossy puffy 3D clay illustrations (cute objects with tiny smiling faces: lightbulb, book, pencil, laptop, trophy, flask) as heroes and on cards. Rounded chunky geometric headings (Fredoka, bold, large ~3x the body), Nunito body text, small low-contrast grey subtext. 24px radius cards, full-round pill buttons, soft diffuse blue-tinted shadows, NO hard borders, thin rounded outline icons. Airy, friendly, calm. NO emoji, NO photos of people except a small avatar, NO neon, NO harsh black.
"""
light=common+"""## Light: page background very light blue #F4F8FF, surfaces white #FFFFFF, primary periwinkle blue #6FA3F0 (gradient #8FB8F5 to #6FA3F0) for pill buttons, active tab and progress bars. Pastel card tiles: peach #FBD9D6, butter cream #FFE9C2, lavender #E4DBF2, sky #D6E6FF. Ink dark navy #1F2A44, muted grey-blue #8A94A8."""
dark=common+"""## Dark: deep calm navy (NOT pure black, NOT purple): background #121A2B, surfaces #1C2740, raised #24314F, ink #EEF3FF, muted #8E9BB8. Same periwinkle #7FAEF3 for pill buttons, active tab and progress bars. Card tiles are muted pastels on navy: peach #3A2B35 tint with #FBD9D6 accents, cream #3A3428, lavender #2E2A45, sky #22365A. The 3D clay illustrations stay bright pastel. No glow."""
out={}
for mode,md,c,bg in (('LIGHT',light,'#6FA3F0','#F4F8FF'),('DARK',dark,'#7FAEF3','#121A2B')):
    r=curlcall.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Lumo {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'QUICKSAND','bodyFont':'NUNITO_SANS','roundness':'ROUND_FULL','customColor':c,
      'overridePrimaryColor':c,'overrideSecondaryColor':'#FBD9D6','overrideTertiaryColor':'#FFE9C2',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}},timeout=180)
    out[mode]=r; print(mode,json.dumps(r)[:400])
json.dump(out,open('design_systems.json','w'),indent=1)
