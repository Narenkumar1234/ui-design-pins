"""Clean Stitch HTML -> screens/*.html: local Unsplash photos, palette/text fixes, nav fixes."""
import re,os
S='../stitch/'; I='../img/'
def imgs(s,files):
    it=iter(files)
    s=re.sub(r'src="https://lh3\.googleusercontent\.com/[^"]*"',lambda m:f'src="{I}{next(it)}.jpg"',s)
    s=re.sub(r"url\('https://lh3\.googleusercontent\.com/[^']*'\)",lambda m:f"url('{I}{next(it)}.jpg')",s)
    s=re.sub(r'url\("https://lh3\.googleusercontent\.com/[^"]*"\)',lambda m:f"url('{I}{next(it)}.jpg')",s)
    s=re.sub(r'data-alt="[^"]*"','',s)
    return s
def sub(s,a,b,n=1):
    assert a in s,(a[:80]); return s.replace(a,b) if n==0 else s.replace(a,b,n)
FIX={}
# ---------- light-home
s=imgs(open(S+'light-home.html').read(),['avatar','kyoto','santorini','halong','lauter'])
s=sub(s,'Lake Bled, Slovenia','Ha Long Bay, Vietnam',0); s=sub(s,'Lake Bled Slovenia','Ha Long Bay Vietnam')
s=sub(s,'Dolomites, Italy','Lauterbrunnen, Swiss',0); s=sub(s,'alt="Dolomites Italy"','alt="Lauterbrunnen"')
s=sub(s,'min-height: max(884px, 100dvh);','min-height:100dvh;')
s=sub(s,'shadow-2xl shadow-slate-200/50 overflow-x-hidden','overflow-x-hidden')
s=sub(s,'<section class="mt-4 mb-4">','<section class="mt-1 mb-3">')
s=sub(s,'gap-2.5 mt-5 overflow-x-auto no-scrollbar py-1','gap-2.5 mt-4 overflow-x-auto no-scrollbar py-1 -mx-5 px-5')
s=sub(s,'<div class="mt-6">','<div class="mt-5">')
s=sub(s,'w-[205px] h-[285px]','w-[176px] h-[222px]',0)
s=sub(s,'<section class="mt-6">','<section class="mt-4">')
s=sub(s,'<nav class="fixed bottom-6','<nav class="fixed bottom-4')
s=sub(s,'backdrop-blur-lg bg-white/45 border border-white/60','backdrop-blur-xl bg-white/75 border border-white/70',0)
a=s.find('<!-- List Row Card 2'); b=s.find('</section>',a); s=s[:a]+s[b:]
FIX['light-home']=s
# ---------- dark-home
s=imgs(open(S+'dark-home.html').read(),['avatar','kyoto','santorini','halong'])
s=sub(s,'Lake Bled, Slovenia','Ha Long Bay, Vietnam',0); s=sub(s,'Alpine scenic boat tour','Bay cruise &amp; kayaking')
s=sub(s,'$540','$580'); s=sub(s,'>$280<','>$340<')
nav=open(S+'dark-explore.html').read(); nav=nav[nav.find('<nav'):nav.find('</nav>')+6]
nav=nav.replace('text-white bg-gradient-to-r from-[#3B8CF5] to-[#5AA7FF] rounded-full px-4 py-1.5 shadow-sm','@@ACT@@')
nav=nav.replace('text-[#8A9BB0] hover:text-white px-3 py-1.5 transition-colors','@@INA@@')
# swap: home active, explore inactive
parts=nav.split('<a ')
parts[1]=parts[1].replace('@@INA@@','@@ACT@@').replace('(Inactive)','(Active)'); parts[2]=parts[2].replace('@@ACT@@','@@INA@@')
nav='<a '.join(parts).replace('@@ACT@@','text-white bg-gradient-to-r from-[#3B8CF5] to-[#5AA7FF] rounded-full px-4 py-1.5 shadow-sm').replace('@@INA@@','text-[#8A9BB0] hover:text-white px-3 py-1.5 transition-colors')
a=s.find('<nav'); b=s.find('</nav>')+6; s=s[:a]+nav+s[b:]
s=sub(s,'w-[210px] h-[290px]','w-[176px] h-[222px]',0)
s=sub(s,'<main class="px-5 space-y-6">','<main class="px-5 space-y-4">')
s=sub(s,'relative w-20 h-20 rounded-xl','relative w-16 h-16 rounded-xl')
s=sub(s,'px-5 pt-6 pb-3 z-40','px-5 pt-4 pb-3 z-40'); s=sub(s,'<section class="pt-2">','<section>')
s=sub(s,'max-w-sm mx-auto mb-6 rounded-full','max-w-sm mx-auto mb-4 rounded-full')
FIX['dark-home']=s
# ---------- light-explore
s=imgs(open(S+'light-explore.html').read(),['maldives','zermatt','cinque'])
s=sub(s,'Positano, Amalfi','Cinque Terre, Italy',0)
s=sub(s,'<body class="bg-slate-100','<body class="bg-white')
s=sub(s,'h-[330px] rounded-[24px]','h-[250px] rounded-[24px]')
s=sub(s,'pb-28 flex flex-col gap-5','pb-28 flex flex-col gap-4')
s=sub(s,'relative w-full h-32 overflow-hidden','relative w-full h-24 overflow-hidden',0)
s=sub(s,'<nav class="fixed bottom-6','<nav class="fixed bottom-4')
FIX['light-explore']=s
# ---------- dark-explore
s=imgs(open(S+'dark-explore.html').read(),['maldives','zermatt','cinque'])
a=s.find('<!-- Status Bar Area Placeholder -->'); b=s.find('</header>',a)+9; s=s[:a]+s[b:]
s=sub(s,'>Swiss Alps<','>Zermatt<'); s=sub(s,'>Amalfi Coast<','>Cinque Terre<')
s=sub(s,'relative z-10 px-6 pt-4 pb-3','relative z-10 px-6 pt-3 pb-3')
s=sub(s,'h-[340px] rounded-3xl','h-[255px] rounded-3xl')
s=sub(s,'px-6 space-y-6 pb-28 pt-1','px-6 space-y-5 pb-28 pt-1')
s=sub(s,'<article class="h-48 rounded-2xl','<article class="h-40 rounded-2xl',0)
s=sub(s,'max-w-sm mx-auto mb-6 rounded-full','max-w-sm mx-auto mb-4 rounded-full')
FIX['dark-explore']=s
# ---------- light-detail
s=imgs(open(S+'light-detail.html').read(),['dolomites','braies','lauter','alps'])
s=sub(s,'<body class="bg-slate-100 flex justify-center items-center min-h-screen','<body class="bg-white flex justify-center min-h-screen')
s=sub(s,'h-[844px] bg-white','h-[100dvh] bg-white')
s=sub(s,'bg-emerald-50 text-emerald-700','bg-[#E6F2FD] text-[#3B8CF5]')
s=sub(s,'Lake Brienz','Lago di Braies',0); s=sub(s,'Interlaken, Switzerland','Dolomites, Italy',0)
s=re.sub(r'Nestled amidst the towering Bernese Oberland peaks,.*?trails\.','A turquoise alpine lake under the Seekofel peak. Rent a wooden rowboat at sunrise, walk the 4 km shore trail and stay in a lakeside lodge with views of the Dolomites.',s,flags=re.S)
s=sub(s,'Infinity Pool','Lake Boats'); s=sub(s,'>pool<','>rowing<')
s=sub(s,'h-[375px] rounded-b-[28px]','h-[318px] rounded-b-[28px]')
FIX['light-detail']=s
# ---------- dark-detail
s=imgs(open(S+'dark-detail.html').read(),['dolomites','braies','lauter','alps'])
s=sub(s,'Top Pick 2025','Top Pick 2026')
s=sub(s,'Lake Brienz','Lago di Braies',0); s=sub(s,'Interlaken, Bernese Oberland, Switzerland','Dolomites, South Tyrol, Italy',0)
s=re.sub(r'Nestled among the dramatic Bernese Oberland peaks,.*?adventures\.','A turquoise alpine lake under the Seekofel peak. Rent a wooden rowboat at sunrise, walk the 4 km shore trail and stay in a lakeside lodge with views of the Dolomites. Perfect for slow travel and easy mountain hikes.',s,flags=re.S)
s=sub(s,'Steamer Cruise','Rowboat Hire'); s=sub(s,'Giessbach &amp; Iseltwald','Sunrise on the lake')
s=sub(s,'>Pool<','>Boats<'); s=sub(s,'>pool<','>rowing<')
s=sub(s,'h-[410px] rounded-b-[28px]','h-[318px] rounded-b-[28px]')
s=sub(s,'pt-6 pb-6 flex-1 flex flex-col gap-6','pt-5 pb-6 flex-1 flex flex-col gap-5')
a=s.find('<!-- Weather / Season Tag -->'); b=s.find('</div>',s.find('21°C Mild'))+6; s=s[:a]+s[b:]
FIX['dark-detail']=s
for k,v in FIX.items():
    assert 'googleusercontent' not in v, k
    open(k+'.html','w').write(v); print('wrote',k)
