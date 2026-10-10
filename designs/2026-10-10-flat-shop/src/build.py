import subprocess,time
T=open('src/template.html').read()
light=dict(bg='#F5F1E8',ink='#1C1B22',muted='#5E5D68',primary='#D9432C',onp='#FFFFFF',blue='#2F5BEA',green='#1E9E6A',yellow='#FFC83D',onb='#FFFFFF',
 card='#FFFFFF',cardb='#1C1B22',frame='#1C1B22',frameb='#1C1B22',tagbg='#FFC83D',tagfg='#1C1B22',tagbd='#1C1B22',icb='2px solid #1C1B22')
dark=dict(bg='#14151B',ink='#F3F2EE',muted='#9C9EAD',primary='#FF6A4D',onp='#14151B',blue='#5B7FFF',green='#2EBF84',yellow='#FFD15C',onb='#14151B',
 card='#1C1E26',cardb='#30333F',frame='#08090C',frameb='#30333F',tagbg='#F3F2EE',tagfg='#14151B',tagbd='#F3F2EE',icb='none')
sb={'light':('#FDF9F0','#F5F1E8','#F5F1E8'),'dark':('#121319','#1A1B21','#121319')}
for mode,pal in (('light',light),('dark',dark)):
  v=';'.join(f'--{k}:{x}' for k,x in pal.items()); M=mode.capitalize()
  for size,(w,h),title in (('pin',(1000,1500),f'Flat Shop App UI<br><span class="mode">— {M} Mode</span>'),('ig',(1080,1350),f'Flat Shop App UI <span class="mode">— {M}</span>')):
    name=('pinterest' if size=='pin' else 'instagram')+'-'+mode
    open(f'src/_{name}.html','w').write(T.replace('%%VARS%%',v).replace('%%SIZE%%',size).replace('%%TITLE%%',title).replace('%%MODE%%',mode).replace('%%SBFG%%',pal['ink']).replace('%%SB_home%%',sb[mode][0]).replace('%%SB_detail%%',sb[mode][1]).replace('%%SB_cart%%',sb[mode][2]))
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',f'--window-size={w},{h}','--virtual-time-budget=3000',f'--screenshot={name}.png',f'src/_{name}.html'],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
    subprocess.run(['cp',f'{name}.png',f'/tmp/fin-{name}-{time.time_ns()}.png'])
