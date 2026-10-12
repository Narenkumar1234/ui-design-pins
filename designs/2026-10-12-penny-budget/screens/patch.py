"""Fixes on top of raw Stitch HTML (see ../notes.md): data-true chart bars, nav labels, palette."""
import re
real=[96,86,100,85,90,79]  # May..Oct spend as % of max (26.8k,24.1k,27.9k,23.65k,25.16k,22.14k)
def bars(s, cls_re, px):
    i=iter(real)
    return re.sub(r'(<div class="'+cls_re+r'[^"]*"[^>]*style=")height: \d+%;', lambda m: m.group(1)+f'height: {round(next(i)*px/100)}px;' if px else m.group(1)+f'height: {next(i)}%;', s, count=6)
# light insights: % heights collapsed (no fixed parent height) -> px; Stitch heights didn't match data
s=open('light-insights.html').read()
s=bars(s, r'w-4 sm:w-5 bg-\[#(?:E2E0D8|1F7A5A)\]', 104)
s=s.replace('bg-[#E2E0D8]','bg-[#ECEAE4]').replace("barInactive: '#E2E0D8'","barInactive: '#ECEAE4'")  # off-palette grey -> hairline neutral
s=s.replace('Average: ₹24,850/mo','Average: ₹24,958/mo')
s=s.replace('<div class="bg-[#17181C] h-full rounded-full"','<div class="bg-[#1F7A5A] h-full rounded-full"')  # category bars green like dark
s=s.replace('>Activity</span>','>Insights</span>').replace('>Overview</span>','>Home</span>')
open('light-insights.html','w').write(s)
s=open('dark-insights.html').read(); s=bars(s, r'w-2\.5 bg-\[#(?:26282D|4FC59A)\]', 0); open('dark-insights.html','w').write(s)
s=open('light-home.html').read(); s=s.replace('>Overview</span>','>Home</span>').replace('>Activity</span>','>Insights</span>'); open('light-home.html','w').write(s)
s=open('light-add.html').read()
s=s.replace('bg-[#C2553A] text-white transition-all duration-150" id="type-expense"','bg-[#17181C] text-white transition-all duration-150" id="type-expense"')  # selected segment neutral ink, terracotta reserved for amounts
s=s.replace('#1A684D','#1F7A5A')
open('light-add.html','w').write(s)
s=open('dark-add.html').read(); s=s.replace('#45b28b','#4FC59A'); open('dark-add.html','w').write(s)
s=open('dark-home.html').read(); s=s.replace('#1c1e22','#17181B'); open('dark-home.html','w').write(s)
print('patched')
for f in ('light-home.html','dark-home.html'):  # post date is Oct 12 -> 19 days left in October (matches the kit)
    s=open(f).read().replace('20 days to go','19 days to go'); open(f,'w').write(s)
print('days fixed')
for f in ('light-add.html','dark-add.html'):  # Stitch's 884px min-height pushed Save below the fold of a 390x800 frame
    s=open(f).read().replace('min-height: max(884px, 100dvh)','min-height: 100dvh'); open(f,'w').write(s)
print('add min-height fixed')
s=open('light-add.html').read()  # keypad too tall for one viewport: tighten key rhythm so the Save CTA stays visible
s=s.replace('grid grid-cols-3 gap-y-2.5 gap-x-6','grid grid-cols-3 gap-y-0 gap-x-6').replace('class="num-key py-2.5','class="num-key py-2').replace('id="key-backspace"','id="key-backspace"').replace('class="py-2.5 flex items-center justify-center text-[#17181C]','class="py-2 flex items-center justify-center text-[#17181C]')
open('light-add.html','w').write(s); print('light keypad tightened')
