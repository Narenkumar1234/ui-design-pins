# Klar SaaS Landing Page · Tue Oct 13, 2026 · keyword KLAR
- Status: DRAFT for approval. Not posted. Kit not published on Gumroad yet.
- Product: Klar (sales analytics / metrics SaaS)
- Keyword: KLAR (unused previously; SHOP/FLAT, MUSIC, PULSE, PENNY, HABIT are taken)
- Reference (main): @uxjubayer "SaaS Landing Page UI Design | Sales Analytics Dashboard" https://www.instagram.com/p/DWy4q8ZoCuG/ — /workspace/refs/saas/ref-2.png
  near-white/light-grey, white cards + hairline borders, ONE indigo accent, bento features, highlighted pricing, FAQ, footer.
- Warmth (optional): @scalixastudio Collabora post — /workspace/refs/saas/ref-1.png — browser-frame dashboard + floating overlapping card (used on slide-1 cover + kit hero).
- Stitch project 5773273180715924199 (stitch/project_id.txt); design systems Klar Light/Dark; gen via stitch/gen.py, download via /workspace/stitch/download.py.
- screens/: Stitch HTML patched (© year, Growth plan moved first into phone viewport), rendered 390x800 @2x via screens/render.sh → final/screens/ (780x1600).
- Slides: src/ = template-v2 + Klar indigo/zinc overrides in style.css + browser_mock/floatcard on cover. Re-run: `cd src && python3 render.py config.json`.
- Kit: /workspace/products/saas-landing-ui-kit/ (+ zip /workspace/products/saas-landing-ui-kit.zip). Price $3. Slug saas-landing-ui-kit.
- Palette: Light #F5F5F7/#FFFFFF/#E5E7EB/#111827/#6B7280/#4F46E5 · Dark #18181B/#27272A/#3F3F46/#FAFAFA/#A1A1AA/#6366F1
- Fonts: Manrope headlines, Inter body
- Project idea for students: clone Klar as a portfolio SaaS landing — sticky nav, theme toggle, bento grid, pricing with one highlighted plan, FAQ accordion; then wire CTAs to a fake waitlist form.
