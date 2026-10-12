import sys; sys.path.insert(0,'/workspace/stitch')
import stitch, json, time, os
P=open('project_id.txt').read().strip()
mode=sys.argv[1]
ds=json.load(open('design_systems.json'))[mode]['name']
pal={
'LIGHT':"background #FAFAF7, cards #FFFFFF, hairline borders #ECEAE4, ink #17181C, muted #6E6F76, primary green #1F7A5A (white text on it), expense terracotta #C2553A",
'DARK':"background #0F1012, cards #17181B, hairline borders #26282D, ink #EDEDEA, muted #8E9097, primary green #4FC59A (dark #0F1012 text on it), expense terracotta #E07A5F"
}[mode]
base=f"""Mobile personal finance expense tracker app "Penny", strictly MINIMALIST design ({mode.lower()} mode): lots of whitespace, calm grid, refined Manrope headlines and Inter body, large light-weight numerals for money, subtle 1px hairline borders only, NO heavy outlines, NO hard or offset shadows, NO gradients, NO glows, NO photos, NO illustrations, NO emoji. Thin 1.5px line icons. Only two accent colors: green for primary/income and terracotta for expenses; everything else neutral. Currency is Indian rupee ₹. Palette: {pal}."""
screens={
'home':base+""" Screen: OVERVIEW / HOME. Small header: "Penny" wordmark left, month selector "October ▾" and a small circular avatar "A" right. Big balance section with label "Total balance" and a large thin numeral "₹42,860". Below it two quiet columns separated by a hairline: "Income ₹65,000" (green) and "Spent ₹22,140" (terracotta). A monthly budget card with 1px border: "Monthly budget" , "₹22,140 of ₹30,000", a thin 4px progress line 74% filled green, small muted text "₹7,860 left · 20 days to go". Section "Recent" with "See all" link, list of 5 transactions separated by hairlines, each with a small outlined circle icon, name + muted category, amount right aligned: Blue Tokai Coffee · Food −₹320, Metro card recharge · Transport −₹500, Freelance payment · Income +₹12,000 (green), Amazon · Shopping −₹1,299, Electricity bill · Bills −₹1,840. Minimal bottom nav with 4 line icons and labels: Home (active, green), Insights, a round green "+" add button in the middle, Budgets, Settings.""",
'add':base+""" Screen: ADD EXPENSE. Top bar: close X icon left, title "Add expense" centered, nothing heavy. Segmented control with 1px border: "Expense" (selected) | "Income". Huge centered amount "₹ 320" in thin large numerals with a blinking caret, muted "INR" below. Category label and a wrapping row of pill chips with 1px borders: Food (selected, green outline and light green tint), Transport, Shopping, Bills, Health, Fun. Hairline-separated form rows: "Note — Coffee with Riya", "Date — Today, 12 Oct", "Account — UPI · HDFC". A minimal numeric keypad 3x4 grid of plain digits 1-9, ".", 0, backspace with no borders, generous spacing. Full-width green "Save expense" button at the bottom with 12px corners.""",
'insights':base+""" Screen: INSIGHTS. Title "Insights" and a small segmented control "Week | Month (selected) | Year". Large numeral "₹22,140" labelled "Spent in October", with a small muted note "12% less than September" in green. A minimal bar chart card with 1px border: 6 slim rounded bars for May to Oct, only October bar filled green, others light neutral grey, tiny muted month labels, no gridlines except one hairline baseline. Section "By category" list rows separated by hairlines, each with category name, a thin 3px horizontal bar showing share, percent and amount: Food 34% ₹7,530, Bills 22% ₹4,870, Shopping 18% ₹3,985, Transport 14% ₹3,100, Fun 12% ₹2,655. Bottom nav with Insights active in green."""
}
which=sys.argv[2:] or list(screens)
LOGF=f'gen_log_{mode.lower()}.json'
log=json.load(open(LOGF)) if os.path.exists(LOGF) else {}
for k in which:
    t=time.time(); print(f'START {mode} {k}', flush=True)
    r=stitch.call('generate_screen_from_text',{'projectId':P,'prompt':screens[k],'deviceType':'MOBILE','designSystem':ds},timeout=900)
    log[f'{mode}-{k}']=r; json.dump(log,open(LOGF,'w'),indent=1)
    print(mode,k,round(time.time()-t),'s',json.dumps(r)[:400],flush=True)
