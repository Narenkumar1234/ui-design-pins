import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'DARK':"DARK mode: charcoal near-black page background #1A1A1A, cards #2A2A2A, raised controls #333333, off-white ink #F5F2EE, muted grey #8C8782 small subtext.",
'LIGHT':"LIGHT mode: warm off-white page background #F5F2EE, white #FFFFFF cards, raised controls #ECE7E1, charcoal ink #1A1A1A, muted warm grey #8C8782 small subtext."}[mode]
base=f"""Mobile smart home control app called "Hearth". {pal} ONE vivid orange accent #F2762E used for pills, toggles ON, active nav icon, the centered + FAB and one highlighted full-orange card. Soft rounded cards 20-24px radius, full-round pill search bar and chips, clean geometric sans Outfit (bold large headings, small muted subtext), thin rounded line icons, no gradients, no emoji. Content must fit a 390x844 viewport."""
nav=" Floating rounded bottom nav bar (pill shaped, slightly lighter than the page) with 4 line icons Home, Rooms, Energy, Settings and a centered raised round orange + floating action button."
screens={
'onboarding':base+""" Screen: ONBOARDING. Full-bleed warm cozy photo of a modern living room at dusk with warm lamps, a sofa and plants filling the top 65% of the screen, fading into the dark page at the bottom. Three small stepper dots (the active one an orange pill). Big white 2-line headline "Your home," / "on one tap". Muted line "Lights, climate and energy, all in one calm app.". A full-width rounded pill slider button: an orange round knob with a power icon on the left, label "Get Started" in the middle, chevrons >> on the right. No nav bar.""",
'home':base+""" Screen: HOME DASHBOARD. Top row: small round avatar with "Hi, Aarav" and a small orange "Home, Chennai" line, a round bell button on the right. Big heading "My Home". Pill search bar "Search devices". Small weather/usage line: 24 C inside, 6.2 kWh today. Row of room chips: All (orange filled), Living room, Bedroom, Kitchen. 2-column grid of device cards: "Living lights" 4 lamps with an ON toggle and the card fully filled ORANGE (white text), "Air conditioner" 22 C Auto with toggle, "Smart TV" Off, "Wi-Fi router" 8 devices. Status chips on cards like 'On' / 'Off'."""+nav+" Home active.",
'room':base+""" Screen: CLIMATE DETAIL. Top: round back button left, title "Living room" centered, round more button right. Small status chip "Cooling" in orange. A big circular thermostat dial: thick track ring with an orange arc covering 60%, a knob at the end, huge "22°" in the center with "Target" above and "Inside 24°" below; round minus and plus buttons on either side. Row of mode pills: Cool (orange active), Heat, Dry, Fan. A card "Fan speed" with 3 step dots. A card "Schedule" with "Comfort  6:00 PM - 11:00 PM" and a toggle ON. Full-width orange pill button "Apply" at the bottom. No nav bar.""",
'energy':base+""" Screen: ENERGY + SCENES. Heading "Energy". Segmented pill tabs Day, Week (active orange), Month. A big card with "142.6 kWh this week" and a small green-free muted "-12% vs last week" chip, and a 7-bar rounded bar chart Mon-Sun where Thursday's bar is orange and the others are muted grey. A list of top devices with small usage bars: Air conditioner 48 kWh, Water heater 31 kWh, Lights 14 kWh. Section "Scenes": 2-column cards "Good morning", "Movie night" (full orange, active), "Away", "Sleep" each with an icon and a small toggle."""+nav+" Energy active.",
}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    for attempt in range(6):
        t=time.time(); print('START',mode,k,attempt,flush=True)
        args={'projectId':P,'prompt':screens[k],'deviceType':'MOBILE','modelId':'GEMINI_3_FLASH'} if False else {'projectId':P,'prompt':screens[k],'deviceType':'MOBILE'}
        if ds and attempt<3: args['designSystem']=ds
        try:
            r=curlcall.call('generate_screen_from_text',args,timeout=900)
        except Exception as e:
            print("EXC",round(time.time()-t),"s",e,flush=True); time.sleep(30); continue
        log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
        print(mode,k,round(time.time()-t),'s',json.dumps(r)[:300],flush=True)
        if 'screens' in json.dumps(r): break
        time.sleep(20)
