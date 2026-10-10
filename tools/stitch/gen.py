import stitch,json,sys,time
P='2046068761287247478'
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'LIGHT':"background #F5F1E8, cards #FFFFFF, text #1C1B22, primary coral #D9432C (white text on it), blue #2F5BEA, green #1E9E6A, yellow #FFC83D; checkout button #1C1B22 with white text",
     'DARK':"background #14151B, screens #1C1E26, surface/inputs #2A2D38, text #F3F2EE, primary coral #FF6A4D (dark #14151B text on it), blue #5B7FFF, green #2EBF84, yellow #FFD15C; checkout button #F3F2EE with dark text"}[mode]
base=f"""Mobile e-commerce shopping app, strictly FLAT design ({mode.lower()} mode): solid color fills only, no gradients, no shadows, no glows, no photos. Product images are simple geometric shapes (tote-bag silhouette, circle, triangle, rotated square) on solid colored square tiles. Cards use 2px solid borders. 12px corners. Bold geometric headlines. Palette: {pal}."""
screens={
'home':base+""" Screen: HOME. Header "Hi, Maya" small and "Find your style" bold, cart icon with badge "3". Search bar "Search products". Category chips: All (selected, filled dark), Bags, Shoes, Tech. 2-column product grid: Canvas Tote $34 (yellow tile, dark tote bag shape), Orb Speaker $59 (blue tile, white circle), Peak Lamp $42 (green tile, white triangle), Cube Clock $27 (coral tile, white rotated square), small heart dot on each tile. Bottom nav with 4 icons, Home active in coral.""",
'detail':base+""" Screen: PRODUCT DETAIL for "Canvas Tote". Top bar: back arrow button, title "Details", heart button. Large yellow square image tile with a big dark tote-bag silhouette and carousel dots. Name "Canvas Tote", price "$34" in coral, rating "★ 4.8 · 214 reviews". Size picker chips S, M (selected, filled dark), L, XL. Color picker: 4 solid circles yellow (selected with ring), blue, green, coral. Bottom row: quantity stepper "− 1 +" and a wide coral "Add to cart" button.""",
'cart':base+""" Screen: CART. Title "My Cart", "3 items". Three bordered cart rows each with a small colored tile thumbnail, name and coral price and a qty stepper "− 1 +": Canvas Tote $34 (yellow), Orb Speaker $59 (blue), Cube Clock $27 (coral). Dashed-border promo code field with "Apply". Summary: Subtotal $120, Shipping Free, Total $120 (bold). Full-width "Checkout →" button.""",
}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'; log=json.load(open(LOGF)) if __import__('os').path.exists(LOGF) else {}
for k in which:
    t=time.time()
    r=stitch.call('generate_screen_from_text',{'projectId':P,'prompt':screens[k],'deviceType':'MOBILE','designSystem':ds},timeout=900)
    log[f'{mode}-{k}']=r
    json.dump(log,open(LOGF,'w'),indent=1)
    print(mode,k,round(time.time()-t),'s',json.dumps(r)[:800],flush=True)
