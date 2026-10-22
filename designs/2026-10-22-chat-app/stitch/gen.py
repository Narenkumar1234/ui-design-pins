import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'DARK':"DARK mode: deep violet-black page background #120E24, cards #1C1733, raised controls #262042, lavender-white ink #F1F0FF, muted #9893B8 small subtext. Violet accent #6A4FE0, light violet text #A08BFF.",
'LIGHT':"LIGHT mode: very pale lavender-white page background #F1F0FF, white #FFFFFF cards and received bubbles, raised controls #E9E6FF, deep ink #1E1B3A, muted #8A87A6 light grey previews."}[mode]
base=f"""Mobile chat / messaging app called "Natter". {pal} ONE saturated violet accent #5B3FD0 for headers, sent bubbles, primary buttons and the active nav icon. Tiny pink #FF5C8A and orange #FF9F43 accents only for reactions, unread badges and online dots. Avatars are 2-letter initials on soft gradient circles, NO photos, NO 3D characters. Fully rounded bubbles 18px with one tight 4px corner, white rounded cards 20px, pill search bar and chips, geometric sans Montserrat (bold headings, light grey previews), thin rounded line icons, airy whitespace. Content must fit a 390x844 viewport."""
nav=" Bottom nav bar with 4 line icons: Chats, Calls, Stories, Profile."
screens={
'onboarding':base+""" Screen: WELCOME. The whole screen is filled with violet #5B3FD0. Top area: a playful flat illustration made of overlapping rounded chat bubbles and gradient initial avatars (white, pink, orange shapes) floating. Big white bold 2-line headline "Talk more," / "type less." and a light white line "Voice notes, reactions and group calls for your crew.". Three small dots (active white pill). Bottom-right a big circular WHITE button with a violet arrow icon. Small "Log in" text link bottom-left. No nav bar.""",
'chats':base+""" Screen: CHAT LIST. Header: bold "Messages" heading with a round search button and a round violet + new chat button on the right. Pill search bar "Search chats". Stories row of circular gradient initial avatars with violet rings: "Your story" with +, Maya, Arjun, Zoe, Dev. Filter chips: All (violet filled), Unread 3, Groups, Calls. List of rounded white cards, each: initials avatar with small online dot, bold name, light grey preview line, time on the right and a small violet or pink unread count badge. Rows: Maya Chen "Sent a voice note" 10:24 badge 2; Design Squad (group) "Zoe: see you at 5!" 09:58 badge 5; Arjun Rao "haha that's perfect" 09:12; Priya "Photo" Yesterday; Leo Park "typing..." in violet."""+nav+" Chats active.",
'conversation':base+""" Screen: CONVERSATION with Maya Chen. Violet header bar #5B3FD0 with rounded bottom corners: back arrow, initials avatar, "Maya Chen" white bold and "online" small, round call and video buttons. Messages on the lavender page: received white bubble "Hey! Did you see the new design brief?" 10:02; sent violet bubble with white text "Yes! Working on the chat screens now" 10:03 with double-tick; received image bubble (soft gradient abstract image) with a small reaction pill "❤️ 2" in pink; sent voice note bubble in violet: play button, waveform bars, "0:42"; received bubble "Love it, ship it today?" with a small reply quote above it; typing indicator bubble with 3 dots. A slim vertical violet rounded action rail floating on the right edge with 4 white icons (camera, image, mic, location). Bottom composer: pill input "Message..." with emoji and attach icons, round violet send button. No nav bar.""",
'group':base+""" Screen: GROUP INFO / CALL. Top: back button, title "Design Squad", more button. Big rounded violet card: "Group call" with "4 people · 12:48" timer, a row of 4 overlapping initials avatars, and round buttons: mute (white), video (white), end call (pink #FF5C8A). Section "Members 6" list rows with initials avatars, name, role chip (Admin in violet). Section "Shared media" with a 3-column grid of rounded gradient tiles and a "Files 12" row. Toggle row "Mute notifications". No nav bar.""",
'profile':base+""" Screen: PROFILE + SETTINGS. Big initials avatar "AK" with violet ring and edit badge, name "Aarav Kumar", "@aarav · Available" status chip. Stats row: 128 chats, 24 groups, 2.1k media. Settings list in white rounded cards with violet line icons: Account, Privacy (Last seen, Read receipts toggle ON in violet), Notifications, Chat wallpaper, Dark mode toggle, Storage and data, Help. Red-free pink "Log out" text."""+nav+" Profile active.",
}
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
