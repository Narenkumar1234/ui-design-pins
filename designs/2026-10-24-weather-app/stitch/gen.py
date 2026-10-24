import sys; sys.path.insert(0,'/workspace/stitch'); sys.path.insert(0,'.')
import json, time, os, curlcall
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'DARK':"NIGHT mode: full-bleed night sky gradient #071026 (top) -> #0F2350 -> #1D3B78 (bottom) with a few tiny stars. Frosted glass cards: white 8% fill, backdrop blur, 1px white 14% border. Ink #EAF4FF, muted #9FB5D8. Accent moon/sun gold #FFC861.",
'LIGHT':"DAY mode: full-bleed soft sky gradient #4FA3F7 (top) -> #8CCBFF -> warm peach horizon #FFD6A5 (bottom). Frosted glass cards: white 24% fill, backdrop blur, 1px white 50% border, soft shadow. Deep navy ink #0F2A4A, muted #4D6A8C."}[mode]
base=f"""Mobile weather app called "Nimbus", GLASSMORPHISM style. {pal} Cards are 28px rounded frosted glass panels floating over the gradient. Huge thin temperature numerals (Sora weight 200), bold Sora headings, small uppercase labels with letter spacing. Weather icons are soft flat 3D-ish shapes (yellow sun #FFB238, white puffy clouds, blue rain drops), no photos, no people, no maps with real imagery. ONE warm sun accent #FFB238. Content must fit a 390x844 viewport."""
nav=" Floating frosted glass pill bottom nav with 4 line icons: Home, Forecast, Cities, Settings."
screens={
'home':base+""" Screen: CURRENT WEATHER HOME. Top: location pin + "Bengaluru" bold, "Sat, 24 Oct" small, round glass menu button. Centre: a big soft sun partly behind a puffy white cloud icon, huge "27°" thin numeral, "Partly cloudy" and "H 30°  L 21°". A frosted glass card row with 3 stats: Wind 12 km/h, Humidity 64%, Rain 20%. A frosted glass card "Hourly" with a horizontal row of 5 pill columns (Now 27° sun, 13:00 28°, 14:00 29°, 15:00 28° cloud, 16:00 26° rain) the Now pill highlighted with a white fill."""+nav+" Home active.",
'forecast':base+""" Screen: FORECAST. Header "Forecast" bold with segmented glass toggle "Today | 10 days" (10 days active). A glass card with a smooth temperature line chart for the next 24 hours with small dots and temperature labels. Then a glass card list "10-day forecast": rows of day name (Today, Sun, Mon, Tue, Wed, Thu, Fri), small weather icon, rain % in blue, low temp, a rounded horizontal temperature range bar (gradient blue to sun yellow), high temp."""+nav+" Forecast active.",
'cities':base+""" Screen: CITIES / SEARCH. Header "Cities" bold with round glass + button. Frosted glass pill search bar "Search for a city". A vertical list of large frosted glass city cards, each: city name bold (Bengaluru · My location, Mumbai, Delhi, London, Tokyo), local time small, condition text, a weather icon, big thin temperature on the right, small H/L. One card is slightly brighter (selected)."""+nav+" Cities active.",
'details':base+""" Screen: WEATHER DETAILS. Header back button, "Bengaluru" and "Details". 2-column grid of square frosted glass tiles: AIR QUALITY tile with big "42" and "Good" and a colourful horizontal AQI bar (green -> yellow -> orange -> red) with a white dot marker; UV INDEX tile "6 High" with a small gradient bar; WIND tile with a circular compass dial and "12 km/h NE"; HUMIDITY tile "64%" with dew point; a wide SUNRISE / SUNSET tile with a dashed semicircle arc and a sun dot on the arc, "06:12" and "18:04"; FEELS LIKE "29°" and PRESSURE "1012 hPa" tiles. No nav bar.""",
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
