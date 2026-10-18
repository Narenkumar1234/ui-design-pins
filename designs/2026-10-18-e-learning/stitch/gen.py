import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name'] if mode!='ART' else None
pal={'LIGHT':"LIGHT mode: page background very light blue #F4F8FF with a faint pale sky gradient, white #FFFFFF surfaces, ink dark navy #1F2A44, muted grey-blue #8A94A8 small subtext. Primary periwinkle blue gradient #8FB8F5 to #6FA3F0 for pill buttons, active tab and progress bars. Pastel tiles: peach #FBD9D6, butter cream #FFE9C2, lavender #E4DBF2, sky #D6E6FF.",
'DARK':"DARK mode in deep calm navy (NOT pure black, NOT purple): background #121A2B, surfaces #1C2740, raised #24314F, ink #EEF3FF, muted #8E9BB8. Same periwinkle #7FAEF3 pill buttons, active tab and progress bars. Tiles are deep muted versions of the pastels (#3A2B35 peach, #3A3428 cream, #2E2A45 lavender, #22365A sky). The 3D clay illustrations stay bright pastel.",
'ART':"Plain white #FFFFFF page, no app chrome."}[mode]
base=f"""Mobile e-learning / online course app for students called "Lumo". Soft pastel claymorphism. {pal} Headings in a rounded chunky geometric sans (bold, about 3x the size of body text); body Nunito Sans; small low-contrast subtext. Glossy puffy 3D CLAY illustrations of cute school objects with tiny smiling faces (a lightbulb mascot, a book, a pencil, a laptop, a trophy, a chemistry flask, a globe) used as heroes and on cards, rendered on plain backgrounds. 24px radius cards, full-round pill buttons, soft diffuse shadows, NO hard borders, thin rounded outline icons. NO emoji, no photos of people except one small round avatar. Content must fit a 390x844 viewport, airy spacing."""
nav=" Floating rounded bottom tab bar (white pill, soft shadow) with 4 outline icons: Home, Explore, My courses, Profile."
screens={
'home':base+""" Screen: HOME. Top row: small round avatar left with muted "Good morning" and bold "Aarav", right a round bell icon button. A big hero: a huge glossy 3D clay lightbulb mascot with a cute smiling face holding an open book, floating centered on a soft sky blue blob, with a soft shadow below. Big rounded headline in 2 lines: "Learn something" / "new today". Muted line "12 min a day keeps your streak alive". A full-width periwinkle pill button "Continue: UI Design Basics" with a play icon. Then a small card row "Your progress": Lesson 4 of 12 with a thin progress bar 35%. Section "Today's picks" with a "See all" link, then a horizontal row of 3 small pastel square tiles (peach, butter cream, lavender), each with a small 3D clay object (laptop, pencil, flask) and a label below: "Coding", "Design", "Science"."""+nav+" Home active.",
'explore':base+""" Screen: EXPLORE CATEGORIES. Top row: round back button on the left, round search button on the right. Big rounded question headline in 2 lines "What do you want" / "to learn today?". A horizontal row of small pill filters: All (active, periwinkle filled), Popular, New, Free. Then a 2-column STAGGERED masonry grid (right column starts lower) of pastel cards with 24px radius, each with a big glossy 3D clay object with a cute face at the top and the name + muted course count at the bottom: "Coding" 24 courses (peach card, 3D laptop), "Design" 18 courses (butter cream card, 3D pencil), "Science" 15 courses (lavender card, 3D chemistry flask), "Languages" 20 courses (sky blue card, 3D globe), "Maths" 12 courses (butter cream, 3D calculator), "Exams" 9 courses (peach, 3D trophy)."""+nav+" Explore active.",
'course':base+""" Screen: COURSE DETAIL / LESSON PLAYER. Top: round back button left, title "Lesson 5" centered, round bookmark button right. A large rounded video player card (lavender pastel background) showing a glossy 3D clay laptop with a cute face, a white round play button in the middle and a thin progress scrubber at the bottom with 04:12 / 11:30. Below: small pill tag "JavaScript", course title "JavaScript for Beginners", muted row with a small avatar "Riya Sharma", star 4.9 and "12 lessons". Tabs: Lessons (active), Notes, Quiz. A list of lesson rows on white rounded cards, each with a round number or check icon, title and duration: "1 Hello, JavaScript" 08:20 (done, check), "2 Variables and types" 10:05 (done), "3 Functions" 12:40 (done), "4 Arrays and loops" 09:55 (done), "5 Objects" 11:30 (playing, highlighted in pale periwinkle). Fixed bottom: full-width periwinkle pill button "Next lesson" with an arrow. This screen has no tab bar.""",
'art':base.replace('Content must fit a 390x844 viewport, airy spacing.','')+""" Screen: ILLUSTRATION SHEET for the app's sticker set. Just a 2-column grid of 8 equal square tiles on white, each tile a plain very light blue #EEF4FF square with ONE large centered glossy puffy 3D clay object with a tiny cute smiling face, soft pastel colours (periwinkle, peach, butter yellow, lavender), studio lighting, soft contact shadow, absolutely no text or letters inside the images: 1 a yellow lightbulb mascot holding a tiny open book, 2 a stack of two books, 3 a pencil, 4 a laptop, 5 a gold trophy, 6 a chemistry flask with bubbles, 7 a globe, 8 a graduation cap. Small caption under each tile: Lightbulb, Books, Pencil, Laptop, Trophy, Flask, Globe, Grad cap.""",
}
if mode=='ART': screens={'art':screens['art']}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    for attempt in range(8):
        t=time.time(); print('START',mode,k,attempt,flush=True)
        args={'projectId':P,'prompt':screens[k],'deviceType':'MOBILE'}
        if ds and attempt<3: args['designSystem']=ds
        try:
            r=curlcall.call('generate_screen_from_text',args,timeout=900)
        except Exception as e:
            print("EXC",round(time.time()-t),"s",e,flush=True); time.sleep(30); continue
        log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
        print(mode,k,round(time.time()-t),'s',json.dumps(r)[:300],flush=True)
        if 'screens' in json.dumps(r): break
        time.sleep(20)
