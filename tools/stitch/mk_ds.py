import stitch,json
P='2046068761287247478'
common="""# Flat Shop (code.in.30s)
Strictly FLAT UI: solid color fills only. NO gradients, NO drop shadows, NO glows, NO blur, NO photos.
Product images are simple geometric shapes (circle, rotated square, triangle, tote-bag silhouette) on solid colored tiles.
Cards use a 2px solid border instead of shadows. Corners 12px. Bold geometric typography (Poppins-like headlines, Inter body).
Accent tile colors: coral, blue, green, yellow used as solid tile backgrounds.
"""
light=common+"""## Light palette
background #F5F1E8, cards/screens #FFFFFF, borders #E4DED2, text #1C1B22, muted text #6B6A75,
primary coral #D9432C (buttons, prices, active nav), blue #2F5BEA, green #1E9E6A, yellow #FFC83D.
Primary buttons coral with white text; secondary/checkout button #1C1B22 with white text."""
dark=common+"""## Dark palette (proper dark theme, not inverted)
background #14151B, screens #1C1E26, surface/inputs #2A2D38, borders #30333F, text #F3F2EE, muted text #9C9EAD,
primary coral #FF6A4D (buttons, prices, active nav) with dark text #14151B on it, blue #5B7FFF, green #2EBF84, yellow #FFD15C.
Checkout button #F3F2EE with dark text."""
out={}
for mode,md,c,bg in (('LIGHT',light,'#D9432C','#F5F1E8'),('DARK',dark,'#FF6A4D','#14151B')):
    r=stitch.call('create_design_system',{'projectId':P,'designSystem':{'displayName':f'Flat Shop {mode.title()}','theme':{
      'colorMode':mode,'headlineFont':'PLUS_JAKARTA_SANS','bodyFont':'INTER','roundness':'ROUND_TWELVE','customColor':c,
      'overridePrimaryColor':c,'overrideSecondaryColor':'#5B7FFF' if mode=='DARK' else '#2F5BEA','overrideTertiaryColor':'#FFD15C' if mode=='DARK' else '#FFC83D',
      'overrideNeutralColor':bg,'colorVariant':'FIDELITY','designMd':md}}})
    out[mode]=r; print(mode,json.dumps(r)[:1500])
json.dump(out,open('design_systems.json','w'),indent=1)
