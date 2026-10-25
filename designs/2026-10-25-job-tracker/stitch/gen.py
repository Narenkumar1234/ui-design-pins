import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'DARK':"DARK mode: background near-black green #0E1512, cards #16211C with 1px #24332B border, ink #EEF3EC, muted #9AA89F, lime accent #C6F35E for active states and the key stat, forest green #2E6B50 secondary.",
'LIGHT':"LIGHT mode: background off-white #F6F5F0, cards white with 1px #E6E4DC border, ink #14181A, muted #5E6660, deep forest green #1F4D3A primary (sidebar active pill, primary button), lime #C6F35E accent highlight."}[mode]
base=f"""Web app called "Orbit", a job & internship application tracker for students and new grads. Clean minimal BENTO dashboard style. {pal} Cards have 20px radius, generous whitespace, hairline borders, no heavy shadows. Headings and big numerals in Space Grotesk bold, UI text in Geist. Status colours: Wishlist slate #8A948E, Applied #5B7C99, Interview lime #C6F35E, Offer forest green #1F4D3A, Rejected coral #E07A5F. Company logos are simple coloured letter monograms in rounded squares (fictional companies: Lumen, Northwind, Pixelcraft, Quanta, Fernwood, Brightpath, Kite Labs, Arcadia). No photos, no people, no stock imagery."""
side=" Left sidebar (240px): small orbit-ring logo + 'Orbit' wordmark, nav items Dashboard, Board, Interviews, Settings with line icons, active item a pill; bottom a small card 'Weekly goal 7/10 applications' with a progress bar. Top bar: search field 'Search companies, roles…', a '+ Add application' primary button, avatar 'Aarav'."
D=" Desktop 1440 wide."
screens={
'dashboard':base+side+D+""" Screen: DASHBOARD. Greeting 'Good morning, Aarav' and 'Sun, 25 Oct'. Bento grid: 4 stat cards (Total applied 48, Interviews 9, Offers 2, Response rate 31% — the response-rate card is the lime highlighted one with a small ring chart); a wide card 'Applications per week' bar chart for 8 weeks with the current week bar lime; a card 'Pipeline' with a horizontal stacked bar and legend Wishlist 12 / Applied 24 / Interview 9 / Offer 2 / Rejected 11; a card 'Upcoming interviews' list of 3 (Northwind · Frontend Intern · Tue 27 Oct 10:30, Quanta · SDE I · Thu 29 Oct 15:00, Lumen · Product Designer · Mon 2 Nov) with date chips; a card 'Recent activity' timeline.""",
'board':base+side+D+""" Screen: BOARD (kanban). Header 'Board' with filter chips (All, Internship, Full-time, Remote) and a view toggle. Five columns side by side: Wishlist (3), Applied (5), Interview (3), Offer (1), Rejected (2), each column header has a coloured status dot and count. Company cards: monogram logo, role title bold (e.g. Frontend Intern), company name, location chip (Remote / Bengaluru), salary chip (₹45k/mo), small 'applied 3d ago' text. One card in Interview column shows a lime 'Interview Tue 10:30' tag. A dashed '+ Add' slot at the bottom of each column.""",
'detail':base+side+D+""" Screen: APPLICATION DETAIL for 'Frontend Intern at Northwind'. Header with big monogram, role title, company, status pill 'Interview' (lime), buttons 'Edit' and 'Move to Offer'. Bento layout: left wide card 'Timeline' vertical stepper (Saved 12 Oct, Applied 14 Oct, Recruiter call 20 Oct, Technical interview Tue 27 Oct upcoming); card 'Notes' with a few bullet notes and a text area; card 'Contacts' with 2 people (initials avatars, name, role, email icon); card 'Salary & details' with ₹45,000 / month, location Bengaluru · Hybrid, source LinkedIn, job link; card 'Next step' highlighted lime with countdown '2 days to interview'.""",
'mobile-board':base+""" MOBILE 390 wide. Screen: BOARD on mobile. Top: 'Orbit' wordmark, search icon, avatar. Horizontally scrollable status tabs (Wishlist 3, Applied 5, Interview 3, Offer 1, Rejected 2) with Interview active as a lime pill. Below a vertical list of company cards for Interview: monogram, role, company, location and salary chips, lime 'Tue 10:30' interview tag. Floating round forest-green '+' button bottom right. Bottom nav with 4 icons: Dashboard, Board, Interviews, Settings.""",
}
if mode=='DARK': screens={'dashboard':screens['dashboard']}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    dev='MOBILE' if k.startswith('mobile') else 'DESKTOP'
    for attempt in range(6):
        t=time.time(); print('START',mode,k,attempt,flush=True)
        args={'projectId':P,'prompt':screens[k],'deviceType':dev}
        if ds and attempt<3: args['designSystem']=ds
        try:
            r=curlcall.call('generate_screen_from_text',args,timeout=900)
        except Exception as e:
            print("EXC",round(time.time()-t),"s",e,flush=True); time.sleep(30); continue
        log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
        print(mode,k,round(time.time()-t),'s',json.dumps(r)[:200],flush=True)
        if 'screens' in json.dumps(r): break
        time.sleep(20)
