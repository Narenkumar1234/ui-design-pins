import sys; sys.path.insert(0,'/workspace/stitch')
import stitch, json, time, os
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={'LIGHT':"clean light mode: background #F5F5F7, white cards with 1px #E5E7EB hairline borders and soft shadows, ink #111827, muted #6B7280, ONE indigo accent #4F46E5 (primary CTA, highlighted pricing plan, chart bars). Soft 12px radius. Generous whitespace. No glows, no gradients except subtle.",
'DARK':"dark mode in deep zinc/neutral (NOT navy, NOT neon): background #18181B, cards #27272A with 1px #3F3F46 borders, ink #FAFAFA, muted #A1A1AA, ONE indigo accent #6366F1 for CTA/highlighted plan/charts. Soft surfaces only, no neon glow, no radial glows."}[mode]
base=f"""Mobile SaaS LANDING PAGE for product "Klar" (sales analytics / metrics dashboard SaaS). {pal} Manrope headlines, Inter body, rounded 12px cards, thin line icons, NO photos, NO emoji, NO illustrations of people. Content must fit a 390x800 viewport, compact but airy spacing. This is a marketing landing page viewed on mobile, NOT an app dashboard with bottom nav."""
screens={
'hero':base+""" Screen: HERO + LOGO STRIP of the Klar landing page. Top sticky nav: logo "Klar" left with small indigo K mark, hamburger menu right. Hero: small muted pill badge "New · Sales analytics", bold headline "Master your metrics. Maximize revenue." (2 lines), short muted subcopy "Klar turns messy sales data into clear dashboards your whole team can trust.", ONE solid indigo primary button "Start free trial" and a ghost/outline secondary "See demo". Below: a compact cluster of 2-3 small floating dashboard cards (MRR $48.2k, +12.4% sparkline, mini bar chart) with soft shadows overlapping slightly. Then a thin logo strip "Trusted by teams at" with 4 grayscale placeholder logos (Acme, Nova, Orbit, Pulse). No bottom nav.""",
'features':base+""" Screen: FEATURES BENTO section. Section eyebrow "Product", headline "Keep everything in one place", short muted sub. Bento grid of feature cards with hairline borders: (1) "Live pipelines" with a small indigo bar chart, (2) "Team insights" with 3 avatar dots and "12 members", (3) wide card "Revenue at a glance" with a violet line chart and "+18% MoM", (4) "Alerts that matter" with a toggle row. Soft radius, generous gaps, indigo only on charts and one icon tile. No bottom nav.""",
'pricing':base+""" Screen: PRICING + FAQ start. Section headline "Simple pricing", muted "Start free. Upgrade when you grow.". Three stacked pricing cards: Free $0 (ghost button), Pro $29/mo (outline), and highlighted Growth $79/mo with solid indigo background, white text, "Most popular" pill, white CTA "Get Growth". Features as short check rows. Below: FAQ accordion header "Frequently asked" with 2 collapsed rows (plus icons) and 1 expanded answer about the free trial. Compact footer strip with Klar logo and "Privacy · Terms". No bottom nav.""",
}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    t=time.time(); print('START',mode,k,flush=True)
    r=stitch.call('generate_screen_from_text',{'projectId':P,'prompt':screens[k],'deviceType':'MOBILE','designSystem':ds},timeout=900)
    log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
    print(mode,k,round(time.time()-t),'s',json.dumps(r)[:300],flush=True)
