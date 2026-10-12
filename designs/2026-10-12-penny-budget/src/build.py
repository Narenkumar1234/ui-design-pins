import subprocess, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))  # design folder
os.makedirs('final',exist_ok=True)
# screens/*.png come from: cp stitch/*.html screens/ && (cd screens && python3 patch.py && ./render.sh)
T=open('src/template.html').read()
light=dict(bg='#FAFAF7',card='#FFFFFF',line='#ECEAE4',line2='#D9D6CE',ink='#17181C',muted='#6E6F76',primary='#1F7A5A',onp='#FFFFFF',frame='#17181C',frameb='#17181C')
dark=dict(bg='#0F1012',card='#17181B',line='#26282D',line2='#3A3D44',ink='#EDEDEA',muted='#8E9097',primary='#4FC59A',onp='#0F1012',frame='#000000',frameb='#3A3D44')
# status bar color = top of each Stitch screen
sb={'light':{'home':'#FAFAF7','add':'#FAFAF7','insights':'#FAFAF7'},'dark':{'home':'#0F1012','add':'#0F1012','insights':'#0F1012'}}
for mode,pal in (('light',light),('dark',dark)):
  v=';'.join(f'--{k}:{x}' for k,x in pal.items()); M=mode.capitalize()
  for size,(w,h),title in (('pin',(1000,1500),f'Penny Budget App UI<br><span class="mode">{M} mode</span>'),
                           ('ig',(1080,1350),f'Penny Budget App UI<span class="mode">{M}</span>')):
    name=('pinterest' if size=='pin' else 'instagram')+'-'+mode
    html=T.replace('%%VARS%%',v).replace('%%SIZE%%',size).replace('%%TITLE%%',title).replace('%%MODE%%',mode).replace('%%SBFG%%',pal['ink'])
    for k,c in sb[mode].items(): html=html.replace(f'%%SB_{k}%%',c)
    open(f'src/_{name}.html','w').write(html)
    out=f'final/{name}.png'
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}',
      '--virtual-time-budget=4000',f'--screenshot={out}',f'src/_{name}.html'],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
    print('wrote',out,os.path.getsize(out) if os.path.exists(out) else 'MISSING')
subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--window-size=1080,1350',
  '--virtual-time-budget=3000','--screenshot=final/instagram-cta.png','src/cta.html'],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
print('wrote final/instagram-cta.png')
