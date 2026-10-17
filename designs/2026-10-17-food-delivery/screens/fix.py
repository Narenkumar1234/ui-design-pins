"""Clean Stitch HTML -> screens/*.html: local Unsplash photos, copy/price consistency, palette + nav fixes, fit 390x800."""
import re,os,sys
S='../stitch/'; I='../img/'
def imgs(s,files):
    it=iter(files)
    def nx(): f=next(it); return f if '.' in f else f+'.jpg'
    s=re.sub(r'src="https://lh3\.googleusercontent\.com/[^"]*"',lambda m:f'src="{I}{nx()}"',s)
    s=re.sub(r"url\('https://lh3\.googleusercontent\.com/[^']*'\)",lambda m:f"url('{I}{nx()}')",s)
    s=re.sub(r'url\("https://lh3\.googleusercontent\.com/[^"]*"\)',lambda m:f"url('{I}{nx()}')",s)
    s=re.sub(r'data-alt="[^"]*"','',s)
    return s
def sub(s,a,b,n=1):
    assert a in s,(a[:90]); return s.replace(a,b) if n==0 else s.replace(a,b,n)
def cut(s,a,b_marker,include_end=True):
    i=s.find(a); assert i>=0,a[:80]; j=s.find(b_marker,i); assert j>=0,b_marker[:80]
    return s[:i]+s[j+(len(b_marker) if include_end else 0):]
FIX={}
only=sys.argv[1:]
def want(k): return not only or k in only
# ---------- light-home
if want('light-home'):
    s=imgs(open(S+'light-home.html').read(),['avatar','buddha-bowl-cut.png','burger','harvest','napoli'])
    s=sub(s,'min-height: max(884px, 100dvh);','min-height:100dvh;')
    s=sub(s,'<div class="max-w-[190px] z-10">','<div class="max-w-[214px] z-10">')
    s=sub(s,'font-headline text-[34px] leading-[1.08]','font-headline text-[33px] leading-[1.06]')
    s=sub(s,'Curated chef kitchens delivered hot.','Chef-made meals from kitchens near you, delivered hot.')
    s=sub(s,'<span>15-20 min · </span>','<span>25-30 min · </span>')
    s=sub(s,'>Browse</span>','>Search</span>'); s=sub(s,'href="#browse"','href="#search"')
    # fit 390x800: tighten vertical rhythm so restaurant cards clear the tab bar
    s=sub(s,'<section class="px-5 pt-4 pb-2">','<section class="px-5 pt-1 pb-1">')
    s=sub(s,'min-h-[148px]','min-h-[140px]'); s=sub(s,'relative w-[150px] h-[150px] flex-shrink-0','relative w-[140px] h-[140px] flex-shrink-0')
    s=sub(s,'<section class="px-5 py-3">','<section class="px-5 py-2">',0)
    s=sub(s,'rounded-[20px] bg-gradient-to-r from-[#E8622C] to-[#F6A77A] p-5','rounded-[20px] bg-gradient-to-r from-[#E8622C] to-[#F6A77A] px-5 py-4')
    s=sub(s,'<section class="px-5 pt-4 pb-4">','<section class="px-5 pt-3 pb-4">'); s=sub(s,'<div class="flex items-center justify-between mb-3.5">','<div class="flex items-center justify-between mb-2.5">')
    s=sub(s,'w-full h-28 rounded-[16px]','w-full h-[92px] rounded-[16px]',0)
    s=sub(s,'px-3 py-2 pb-5 bg-white/95','px-3 pt-2 pb-3 bg-white/95')
    FIX['light-home']=s
# ---------- dark-home
if want('dark-home'):
    s=imgs(open(S+'dark-home.html').read(),['avatar','buddha-bowl-cut.png','burger','harvest','napoli','burger'])
    s=sub(s,'min-height: max(884px, 100dvh);','min-height:100dvh;')
    s=sub(s,'min-h-[844px]','min-h-[100dvh]')
    s=sub(s,"Artisanal recipes prepared fresh from the city's finest kitchens.",'Chef-made meals from kitchens near you, delivered hot.')
    # restaurant cards: serif names, rating pill on the photo (like light), no price footer
    heart='''<button class="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1B1411]/60 backdrop-blur-md flex items-center justify-center text-[#F8EDE3] hover:text-[#F0703A] transition-colors">
<span class="material-symbols-outlined text-[15px]">favorite</span>
</button>'''
    pill=lambda r:f'<div class="absolute top-2 right-2 bg-[#1B1411]/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-0.5"><span class="material-symbols-outlined text-[#F2A93B] text-[13px]" style="font-variation-settings: \'FILL\' 1;">star</span><span class="text-[11px] font-bold text-[#F8EDE3]">{r}</span></div>'
    s=sub(s,heart,pill('4.8')); s=sub(s,heart,pill('4.9'))
    s=re.sub(r'<div class="flex items-center gap-0\.5 shrink-0">\s*<span class="material-symbols-outlined text-\[#F2A93B\] text-\[14px\]"[^>]*>star</span>\s*<span class="text-\[11px\] font-medium text-\[#F8EDE3\]">4\.8</span>\s*</div>','',s)
    s=sub(s,'<h4 class="font-body font-semibold text-[13px] text-[#F8EDE3] truncate">','<h4 class="font-headline font-semibold text-[15px] text-[#F8EDE3] leading-snug">',0)
    s=re.sub(r'<div class="px-1 pt-2\.5 mt-2 border-t border-\[rgba\(255,236,220,0\.05\)\][^"]*">\s*<span>[^<]*</span>\s*<span[^>]*>\$[\d.]+</span>\s*</div>','',s)
    a=s.find('<section class="pb-2">'); b=s.find('</section>',a)+10; s=s[:a]+s[b:]
    s=sub(s,'<main class="flex-1 px-5 pt-4 space-y-6">','<main class="flex-1 px-5 pt-3 space-y-4">')
    s=sub(s,'px-5 py-3.5 bg-[#1B1411] border-b','px-5 py-2.5 bg-[#1B1411] border-b')
    s=sub(s,'max-w-[170px]','max-w-[190px]')
    s=sub(s,'to-[#F6A77A] p-5 shadow-[0_10px_30px_rgba(232,98,44,0.22)] text-[#1B1411]','to-[#F6A77A] px-5 py-4 shadow-[0_10px_30px_rgba(232,98,44,0.22)] text-white')
    s=sub(s,'bg-[#1B1411]/15 text-[#1B1411] text-[11px]','bg-white/20 text-white text-[11px]')
    s=sub(s,'font-medium text-[#1B1411] mb-3">','font-medium text-white mb-3">')
    s=sub(s,'relative w-full aspect-[4/3] rounded-[16px]','relative w-full h-[92px] rounded-[16px]',0)
    s=sub(s,'px-4 py-2.5 max-w-[390px] mx-auto bg-[#1B1411]','px-4 pt-2 pb-3 max-w-[390px] mx-auto bg-[#1B1411]')
    s=sub(s,'<main class="flex-1 px-5 pt-3 space-y-4">','<main class="flex-1 px-5 pt-2 space-y-3">')
    s=sub(s,'relative w-36 h-36 rounded-full','relative w-[136px] h-[136px] rounded-full')
    s=sub(s,'<section class="relative pt-2 pb-2">','<section class="relative pt-1 pb-1">')
    s=sub(s,'<main class="flex-1 px-5 pt-2 space-y-3">','<main class="flex-1 px-5 pt-1.5 space-y-2.5">')
    s=sub(s,'<section class="relative pt-1 pb-1">','<section class="relative pt-0 pb-0">')
    s=sub(s,'px-5 py-2.5 bg-[#1B1411] border-b','px-5 py-2 bg-[#1B1411] border-b')
    s=sub(s,'h-[50px] bg-[#2A201B]','h-12 bg-[#2A201B]')
    s=sub(s,'px-5 py-4 shadow-[0_10px_30px_rgba(232,98,44,0.22)]','px-5 py-3.5 shadow-[0_10px_30px_rgba(232,98,44,0.22)]')
    s=sub(s,'<section class="space-y-3.5 pt-1">','<section class="space-y-2.5 pt-0.5">')
    s=sub(s,'relative w-full h-[92px] rounded-[16px]','relative w-full h-[86px] rounded-[16px]',0)
    s=sub(s,'px-4 pt-2 pb-3 max-w-[390px]','px-4 pt-1.5 pb-2.5 max-w-[390px]')
    FIX['dark-home']=s
# ---------- light-detail
if want('light-detail'):
    s=imgs(open(S+'light-detail.html').read(),['tofu-bowl-cut.png'])
    s=sub(s,'<body class="bg-[#F3ECE4] min-h-screen text-[#2B1D14] font-body flex justify-center items-center sm:py-8','<body class="bg-[#FBF4EC] min-h-screen text-[#2B1D14] font-body flex justify-center')
    s=sub(s,'sm:min-h-[890px] sm:max-h-[920px] sm:rounded-[44px] relative overflow-hidden shadow-[0_25px_70px_rgba(43,29,20,0.18)] border border-[#EADBCC]','relative overflow-hidden')
    s=re.sub(r'<!-- Center subtle brand indicator -->\s*<div class="pointer-events-auto bg-white/80[^>]*>\s*<span[^>]*>Ember Nourish</span>\s*</div>','<span></span>',s)
    s=re.sub(r'<!-- Editorial Micro Caption -->\s*<span class="font-headline italic[^>]*>\s*Nourishing • Hand-crafted daily\s*</span>','',s)
    s=sub(s,'<section class="relative pt-10 pb-8 flex','<section class="relative pt-11 pb-5 flex')
    s=sub(s,'relative z-10 w-64 h-64 sm:w-72 sm:h-72 my-4','relative z-10 w-[200px] h-[200px] my-1')
    s=sub(s,'Crispy sesame tofu, edamame, soft egg, sweet corn, cucumber and red cabbage with miso-ginger dressing. Served over warm brown heirloom rice.','Crispy sesame tofu, edamame, soft egg, sweet corn, cucumber, red cabbage and cherry tomatoes with miso-ginger dressing.')
    s=sub(s,'text-[#8C7B6E] mb-4">','text-[#8C7B6E] mb-3">')
    s=sub(s,'<div class="flex items-center gap-2 mb-6">','<div class="flex items-center gap-2 mb-1">')
    s=sub(s,'<div class="h-px bg-[#F0E3D6] w-full my-6"></div>','<div class="h-px bg-[#F0E3D6] w-full my-4"></div>')
    s=sub(s,'<section class="space-y-3.5">','<section class="space-y-2.5">')
    s=sub(s,'flex items-center justify-between p-3.5 rounded-2xl','flex items-center justify-between p-2.5 pr-3.5 rounded-2xl',0)
    # extras: photos instead of icons (matches dark + kit)
    for ic,ph in (('nutrition','avocado'),('eco','edamame'),('set_meal','salmon')):
        s=re.sub(r'<div class="w-10 h-10 rounded-full bg-\[#[0-9A-F]+\] flex items-center justify-center text-\[#[0-9A-F]+\] shrink-0">\s*<span class="material-symbols-outlined text-\[20px\]" data-icon="'+ic+r'">'+ic+r'</span>\s*</div>',
                 f'<img src="{I}{ph}.jpg" alt="" class="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-[#F0E3D6]">',s)
    a=s.find('<!-- SPECIAL INSTRUCTIONS FIELD -->'); b=s.find('</section>',a)+10; s=s[:a]+s[b:]
    s=sub(s,'<footer class="fixed bottom-0 max-w-[420px] w-full','<footer class="fixed bottom-0 left-0 right-0 max-w-[420px] w-full')
    FIX['light-detail']=s
# ---------- dark-detail
if want('dark-detail'):
    s=imgs(open(S+'dark-detail.html').read(),['tofu-bowl-cut.png','avocado','edamame','salmon'])
    s=re.sub(r'<!-- Brand Center Title[^>]*-->\s*<div class="font-headline text-lg[^>]*>\s*Ember\s*</div>','<span></span>',s)
    s=sub(s,'<div class="relative w-full pt-16 pb-8 flex','<div class="relative w-full pt-11 pb-6 flex')
    s=sub(s,'relative w-64 h-64 sm:w-72 sm:h-72 mt-2','relative w-[200px] h-[200px] mt-1')
    s=sub(s,'with house-made miso-ginger vinaigrette.','and cherry tomatoes with miso-ginger dressing.')
    s=sub(s,"Warm seasoned whole-grain brown rice base with lightly toasted black sesame.","Dressing comes on the side so every bite stays crisp.")
    s=sub(s,"font-['Public_Sans']","")
    s=sub(s,'<div class="w-10 h-1 bg-[rgba(255,236,220,0.15)] rounded-full mx-auto mb-5"></div>','<div class="w-10 h-1 bg-[rgba(255,236,220,0.15)] rounded-full mx-auto mb-4"></div>')
    s=sub(s,'px-5 pt-6 pb-12 flex-1','px-5 pt-3 pb-12 flex-1')
    s=sub(s,'text-[#A8968A] mb-5 font-normal">','text-[#A8968A] mb-3 font-normal">')
    a=s.find('<!-- Chef Note / Culinary Highlight -->'); b=s.find('<!-- Add Extras Section Heading -->',a); s=s[:a]+s[b:]
    a=s.find('<!-- Special Instructions Input Field -->'); b=s.find('</main>',a); s=s[:a]+s[b:]
    FIX['dark-detail']=s
# ---------- dark-cart
if want('dark-cart'):
    s=imgs(open(S+'dark-cart.html').read(),['tofu-bowl-cut.png','margherita','matcha'])
    s=sub(s,'Salmon Poke Bowl','Sesame Tofu Bowl',0)
    s=sub(s,'From <span class="text-[#F8EDE3]">Ember Kitchen</span>','From <span class="text-[#F8EDE3]">2 kitchens</span>')
    s=sub(s,'30% off your artisanal lunch order','30% off your first order'); s=sub(s,'>Medium, thin crust<','>Napoli Wood Fire<')
    s=sub(s,'<main class="flex-1 px-4 pt-20 pb-36 space-y-4">','<main class="flex-1 px-4 pt-[76px] pb-36 space-y-3">')
    s=sub(s,'rounded-[20px] p-3.5 border border-[rgba(255,236,220,0.08)] flex items-center gap-3.5','rounded-[20px] p-2.5 border border-[rgba(255,236,220,0.08)] flex items-center gap-3',0)
    s=sub(s,'w-20 h-20 rounded-2xl overflow-hidden shrink-0','w-[68px] h-[68px] rounded-2xl overflow-hidden shrink-0',0)
    s=sub(s,'<div class="flex items-center justify-between mt-2.5">','<div class="flex items-center justify-between mt-1.5">',0)
    s=sub(s,'<section aria-label="Cart Items" class="space-y-3">','<section aria-label="Cart Items" class="space-y-2.5">')
    s=sub(s,'<div class="flex items-center justify-between px-1 pt-2">','<div class="flex items-center justify-between px-1 pt-1">')
    s=sub(s,'<div class="flex items-start justify-between gap-3 mb-3.5">','<div class="flex items-start justify-between gap-3 mb-3">')
    s=sub(s,'p-4 border border-[rgba(255,236,220,0.08)] shadow-[0_8px_24px_rgba(10,5,2,0.35)] relative overflow-hidden','px-4 py-3.5 border border-[rgba(255,236,220,0.08)] shadow-[0_8px_24px_rgba(10,5,2,0.35)] relative overflow-hidden')
    # drop the delivery-instructions row; bill summary before payment so the total is in view
    a=s.find('<!-- Delivery Instructions Pill Row -->'); b=s.find('<!-- Payment Method Row -->',a); s=s[:a]+s[b:]
    a=s.find('<!-- Payment Method Row -->'); b=s.find('<!-- Bill / Order Summary Card -->',a); pay=s[a:b]; s=s[:a]+s[b:]
    a=s.find('</section>',s.find('<!-- Bill / Order Summary Card -->'))+10; s=s[:a]+pay+s[a:]
    s=sub(s,'<section class="bg-[#2A201B] rounded-[20px] p-4 border border-[rgba(255,236,220,0.08)] space-y-3">','<section class="bg-[#2A201B] rounded-[20px] px-4 py-3.5 border border-[rgba(255,236,220,0.08)] space-y-2.5">')
    s=re.sub(r'<p class="text-\[10px\] text-center text-\[#A8968A\] mt-2\.5 tracking-tight">\s*By placing this order[^<]*</p>','',s)
    s=sub(s,'to-transparent pt-6 pb-6 px-4 z-40','to-transparent pt-5 pb-5 px-4 z-40')
    FIX['dark-cart']=s
# ---------- light-cart (generated without the design-system param after repeated Stitch disconnects; palette verified below)
if want('light-cart'):
    s=imgs(open(S+'light-cart.html').read(),['tofu-bowl-cut.png','margherita','matcha'])
    s=sub(s,'From <span class="font-medium text-[#2B1D14]">Ember Hearth Kitchen</span>','From <span class="font-medium text-[#2B1D14]">2 kitchens</span>')
    s=sub(s,'Special launch discount saved','30% off your first order')
    s=sub(s,'<div class="px-4 flex flex-col gap-4">','<div class="px-4 flex flex-col gap-3">')
    s=sub(s,'px-5 py-4 max-w-md mx-auto sticky top-0','px-5 py-3 max-w-md mx-auto sticky top-0')
    s=sub(s,'rounded-[20px] p-3.5 border border-[#F0E3D6] shadow-[0_4px_20px_rgba(120,70,40,0.06)] flex items-center gap-3.5','rounded-[20px] p-2.5 border border-[#F0E3D6] shadow-[0_4px_20px_rgba(120,70,40,0.06)] flex items-center gap-3',0)
    s=sub(s,'w-[72px] h-[72px] rounded-2xl','w-[68px] h-[68px] rounded-2xl',0)
    s=sub(s,'rounded-[20px] p-4 border border-[#F0E3D6] shadow-[0_4px_20px_rgba(120,70,40,0.06)] flex flex-col gap-3">','rounded-[20px] px-4 py-3.5 border border-[#F0E3D6] shadow-[0_4px_20px_rgba(120,70,40,0.06)] flex flex-col gap-3">')
    a=s.find('<!-- Drop-off Note Row -->'); b=s.find('<!-- Bill Summary Card -->',a); s=s[:a]+s[b:]
    a=s.find('<!-- Payment Method Row -->'); b=s.find('<!-- Bill Summary Card -->',a); pay=s[a:b]; s=s[:a]+s[b:]
    a=s.find('</section>',s.find('<!-- Bill Summary Card -->'))+10; s=s[:a]+pay+s[a:]
    s=re.sub(r'<!-- Legal Microcopy -->\s*<p class="text-\[10px\][^>]*>\s*By placing this order.*?</p>','',s,flags=re.S)
    s=sub(s,'<div class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t','<div class="fixed bottom-0 left-0 right-0 z-50 px-4 pt-4 pb-5 bg-gradient-to-t')
    FIX['light-cart']=s
for k,v in FIX.items():
    assert 'googleusercontent' not in v, k
    open(k+'.html','w').write(v); print('wrote',k)
