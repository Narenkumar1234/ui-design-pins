# Penny Budget — Daily Design Pin · 2026-10-12

## Concept
Minimalist personal finance / expense tracker app for @code.in.30s UI Design Pins.
Fresh theme (previous: music player, e-commerce, fitness). Style: minimalism (not flat blocks, not neo-brutalism).

## Keyword
**PENNY** — Comment PENNY to get the HTML/CSS (CTA slide). Kit is paid ($3 intro), CTA does not say "free".

## Screens (× light + dark)
1. **Overview / Home** — monthly balance ₹42,860, income ₹65,000 vs spent ₹22,140, budget line (₹22,140 of ₹30,000, 19 days to go), recent transactions
2. **Add expense** — Expense/Income segment, big ₹320 amount, category chips, note/date/account rows, keypad, Save CTA
3. **Insights** — Week/Month/Year, "₹22,140 spent in October · 12% less than September", 6-month slim bars, by-category list with thin bars

## Palette (two accents only)
### Light
- bg `#FAFAF7`, cards `#FFFFFF`, hairlines `#ECEAE4`, ink `#17181C`, muted `#6E6F76`
- green `#1F7A5A` (primary, income), terracotta `#C2553A` (expenses)
### Dark
- bg `#0F1012`, cards `#17181B`, hairlines `#26282D`, ink `#EDEDEA`, muted `#8E9097`
- green `#4FC59A` (primary, dark text on it), terracotta `#E07A5F`

## Fonts
Manrope (headlines, numerals) + Inter (body)

## Style rules
Whitespace first, 1px hairlines, no shadows/gradients/heavy outlines, thin line icons, pill chips, 12–16px card radius.

## Fixes applied to Stitch output (screens/patch.py)
- Light Insights bar chart rendered empty (% heights with no parent height) → fixed px heights; both themes' bars now match real data (May–Oct spend)
- Off-palette greys/greens (#E2E0D8, #1A684D, #45b28b, #1c1e22) → palette tokens
- Light category bars were ink → green (matches dark)
- Light Add: selected "Expense" segment was terracotta-filled → ink (terracotta reserved for expense amounts)
- Light nav said Overview/Activity → Home/Insights (matches dark + kit)
- Average ₹24,850 → ₹24,958 (true 6-month mean); "20 days to go" → 19 (Oct 12)
- Add screens: removed 884px min-height + tightened light keypad so Save CTA is in frame

## Stack (kit)
HTML + Tailwind CDN + vanilla JS · localStorage transactions/budget/theme · Intl.NumberFormat en-IN · CSS bar chart · <dialog>

## Pricing (Gumroad suggestion)
Intro $3 / ₹149 → regular $6 / ₹299 (same as Flat Shop / Pulse Fit)

## Stitch
Project: `projects/2990222630464253513` ("Penny Budget App UI (code.in.30s)")
Design systems: see `stitch/design_systems.json`
