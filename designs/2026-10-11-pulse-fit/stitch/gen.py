import sys; import os as _os; sys.path.insert(0,_os.path.join(_os.path.dirname(_os.path.abspath(__file__)),'../../../tools/stitch'))  # repo tools/stitch
import stitch, json, time, os
P='12900977978343663287'
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={
'LIGHT':"bg #FFF8E7, cards #FFFFFF, ink #111111, muted #5A5A5A, lime #C8F542, pink #FF5C8A, blue #4D7CFE, yellow #FFE566, outlines #111111, hard offset shadow 4px 4px 0 #111",
'DARK':"bg #0E0F12, cards #1A1C24, ink #F5F5F0, muted #A0A3B0, lime #D4FF5E, pink #FF7AA2, blue #6B8FFF, yellow #FFE566, outlines #F5F5F0, hard offset shadow 4px 4px 0 #000000"
}[mode]
base=f"""Mobile fitness workout tracker app "Pulse Fit", strictly NEO-BRUTALISM ({mode.lower()} mode): thick 3-4px solid outlines on every card/button/chip, hard offset drop shadows only (4px 4px 0), NO soft shadows, NO gradients, NO glows, NO blur, NO photos. Bold chunky Space Grotesk headlines, Inter body. Punchy solid fills. Geometric icons only. ~8px corners. Palette: {pal}."""
screens={
'today':base+""" Screen: TODAY / HOME. Top: greeting "Good morning, Alex" with small muted subtitle "Let's crush it today", and a pink streak badge pill "🔥 12 day streak" with thick outline and hard shadow. Below: large neo-brutal card "Today's Workout" titled "Upper Body Power" with lime accent bar, duration "45 min", difficulty chip "Hard" in pink outline, 6 exercises preview. Then a row of 3 quick-stat cards with thick borders + hard shadows: "420 kcal" (yellow fill), "45 min" (blue fill), "1 workout" (lime fill). Bottom nav bar with thick top border: Home (active, lime), Workout, Progress, Profile — geometric icons + labels.""",
'workout':base+""" Screen: WORKOUT. Top bar: back arrow button (thick outline), title "Upper Body Power", timer icon. Rest timer card at top: big number "00:45" rest countdown, label "Rest between sets", yellow background fill, thick outline, hard shadow, Pause button. Exercise list of 4 neo-brutal cards each with thick outline + hard shadow: 1) Bench Press 4×8 (pink accent chip "sets"), 2) Overhead Press 3×10, 3) Bent Over Row 4×8, 4) Push-ups 3×15. Each row shows exercise name bold, sets×reps, a small checkbox circle, and a thin progress bar. Sticky bottom CTA full-width lime button "Start Workout" with black/dark text, thick outline, hard offset shadow.""",
'progress':base+""" Screen: PROGRESS. Title "Your Progress" bold. Weekly bar chart card: 7 geometric solid bars Mon–Sun with thick outlines (heights vary, Sunday tallest lime, Wednesday pink accent), y-axis labels, title "This week · 4 workouts". Below: 2 PR cards side by side with thick borders + hard shadows — "Bench Press PR" 80kg (lime), "5K Run PR" 24:10 (pink). Consistency calendar card: simple 7×4 grid of solid dots (filled lime = workout day, empty outlined = rest), label "Consistency · Oct". Bottom nav with Progress active in lime. No photos, only geometric shapes."""
}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    t=time.time()
    print(f'START {mode} {k}', flush=True)
    r=stitch.call('generate_screen_from_text',{'projectId':P,'prompt':screens[k],'deviceType':'MOBILE','designSystem':ds},timeout=900)
    log[f'{mode}-{k}']=r
    json.dump(log,open(LOGF,'w'),indent=1)
    print(mode,k,round(time.time()-t),'s',json.dumps(r)[:900],flush=True)
