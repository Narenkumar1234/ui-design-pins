import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode].get('name')
pal={'DARK':"DARK mode: background #141414, cards #1E1E1E with 1px #2A2A2A border, ink #F5F4F0, muted grey #8A8A8A, ONE accent orange #E8742A.",
'LIGHT':"LIGHT mode: background off-white #F5F4F0, cards white #FFFFFF with 1px #E7E5DF border, ink near-black #141414, muted grey #8A8A8A, ONE accent orange #E8742A."}[mode]
base=f"""Mobile app called "Folio", a minimal book reading tracker for students. Monochrome UI with ONE bold orange accent. {pal} Tiny yellow #F5C518 star only for ratings. Geometric sans font, heavy 800 titles, small regular body text. Fully rounded pill buttons and chips, book covers and tiles 10px radius, hairline borders, no heavy shadows, no gradients. Book covers are flat graphic typographic covers (huge bold title type, simple geometric shapes, solid colours from black, off-white, orange, grey) with invented titles: 'Quiet Orbit' by Mira Sol, 'Salt & Signal' by Dev Rao, 'The Long Noon' by Ana Kade, 'Paper Tigers' by Leo Marsh, 'Small Gods of Code' by Ira Bose. No real book covers, no photos. Bottom nav with 4 line icons: Home, Search, Shelf, Profile; active item orange. Mobile 390 wide."""
screens={
'home':base+""" Screen: HOME. Header 'Good evening, Riya' with small avatar initials 'R' and a bell icon. Reading streak card: '12-day streak' with an orange flame and a row of 7 day dots (Mon-Sun), 5 filled orange. 'Currently reading' section: big card with the 'Quiet Orbit' cover on the left, title, author, 'Page 184 of 312', orange progress bar 59%, a black pill button 'Continue'. Below a 'Daily goal 22 / 30 min' small ring. 'Up next' horizontal row of 3 small graphic covers with titles.""",
'detail':base+""" Screen: BOOK DETAIL for 'Salt & Signal' by Dev Rao. Back arrow and bookmark icon on top. Large centred graphic typographic cover (orange and black). Title in heavy 800, author in grey. Stats row: rating 4.6 with a small yellow star, 286 pages, 'Sci-fi' genre, 7h read time. An outlined pill 'Add to shelf' with plus icon next to a share icon. 'About the book' paragraph in small grey text. 'Readers also liked' row of 3 small covers. Full-width black pill button at the bottom 'Continue reading · p. 92'.""",
'profile':base+""" Screen: PROFILE / STATS. Centred avatar circle with initials 'RK', name 'Riya Kapoor', '@riya.reads', small pills 'Following 128' 'Followers 96'. Stats tiles 2x2 grid (10px radius): 'Books read 24', 'Pages 6,480', 'Hours 112', 'Longest streak 31 days' (this tile orange). 'My shelf' row of 4 small graphic covers with a 'See all' link. 'Favourite genres' fully rounded chips: Sci-fi (active black), Fantasy, Self-help, Poetry, History, Design. 'This year' small bar chart of books per month with the current month bar orange.""",
'reader':base+""" Screen: READER VIEW. Minimal top bar with back arrow, 'Chapter 7 · The Long Noon' and an 'Aa' font button. Large comfortable reading text paragraphs (serif-free, 17px, 1.6 line height) with one highlighted sentence in pale orange. Bottom: thin orange progress bar, 'p. 143 / 260 · 18 min left in chapter', and pill controls for font size A- A+ and a theme toggle.""",
}
if mode=='DARK': screens={k:screens[k] for k in ('home','detail')}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    for attempt in range(6):
        t=time.time(); print('START',mode,k,attempt,flush=True)
        args={'projectId':P,'prompt':screens[k],'deviceType':'MOBILE'}
        if ds and attempt<3: args['designSystem']=ds
        try:
            r=curlcall.call('generate_screen_from_text',args,timeout=900)
        except Exception as e:
            print("EXC",round(time.time()-t),"s",e,flush=True); time.sleep(30); continue
        log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
        print(mode,k,round(time.time()-t),'s',json.dumps(r)[:200],flush=True)
        if 'screens' in json.dumps(r): break
        time.sleep(20)
