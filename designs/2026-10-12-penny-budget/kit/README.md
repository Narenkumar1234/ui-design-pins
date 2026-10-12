# Penny Budget UI Kit

Minimalist expense tracker mini-app in **HTML + Tailwind CSS + vanilla JS**.
Open `code/index.html`: no npm, no build step.

Made for students and beginner front-end developers who want a calm, grown-up portfolio
project that actually works: transactions, a monthly budget, insights and dark mode.

## What's inside

| Page | File | Features |
|------|------|----------|
| Overview | `code/index.html` | Monthly balance, income vs spent, budget progress, recent transactions, month switcher |
| Add expense | `code/add.html` | Expense/Income toggle, custom keypad, category chips, note, date, account |
| Insights | `code/insights.html` | Week / Month / Year totals, comparison vs last period, CSS bar chart, by-category breakdown |

All pages support **light + dark** via the Theme button in the bottom nav (saved in `localStorage`).

## Quick start

1. Unzip the kit.
2. Open `code/index.html` in Chrome, Firefox or Edge (double-click is fine).
3. Tap **+** to add an expense, tap a transaction to view or delete it, tap **Edit** to change your budget.
4. Tap **Theme** to flip light/dark.

> Tip: to load `data/seed.json` with `fetch()`, serve the folder with any static server
> (`npx serve code`, VS Code Live Server, etc.). Opening via `file://` still works,
> because the kit falls back to `data/seed.js`.

## Features that actually work

- **Light / dark toggle**: Tailwind `dark:` + CSS variables, saved as `penny.theme`
- **Transactions**: stored as JSON in `penny.tx`; add (expense or income), view and delete
- **Custom keypad**: max 2 decimals, max 7 digits, also works with your physical keyboard
- **Monthly budget**: editable in a `<dialog>`, saved as `penny.budget`; the line turns terracotta when you go over
- **Month switcher**: browse previous months on Overview
- **Insights**: Week (7 daily bars), Month (last 6 months), Year (12 months), % change vs previous period, category shares
- **₹ formatting**: `Intl.NumberFormat('en-IN')` gives Indian digit grouping (₹1,49,750)
- **Demo data**: seeded around today's date so it always looks current. Reset: run `resetDemo()` in the console, then reload.

## File structure

```
penny-budget-ui-kit/
├── README.md
├── LICENSE.txt
├── code/
│   ├── index.html        # Overview
│   ├── add.html          # Add expense / income
│   ├── insights.html     # Insights
│   ├── assets/
│   │   ├── theme.js      # Tailwind config + flash-free theme apply
│   │   ├── styles.css    # palette CSS variables + minimal utilities (hairlines, chips, bars)
│   │   ├── app.js        # shared: storage, seed, money format, icons, nav, toast
│   │   ├── home.js
│   │   ├── add.js
│   │   └── insights.js
│   └── data/
│       ├── seed.json     # demo month + 5 months of history
│       └── seed.js       # same data for file:// use
└── design/               # reference PNGs: kit screens + original Google Stitch screens (light + dark)
```

## Palette (two accents only)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `bg` | `#FAFAF7` | `#0F1012` | page background |
| `card` | `#FFFFFF` | `#17181B` | panels, dialogs |
| `line` | `#ECEAE4` | `#26282D` | 1px hairlines |
| `ink` | `#17181C` | `#EDEDEA` | text |
| `muted` | `#6E6F76` | `#8E9097` | secondary text |
| `accent` | `#1F7A5A` | `#4FC59A` | primary, income, active nav |
| `spend` | `#C2553A` | `#E07A5F` | expenses, over budget |

Fonts: **Manrope** (headings + numbers) and **Inter** (body), from Google Fonts.

## Customise

- **Colours**: edit the RGB triplets in `assets/styles.css` (`:root` and `.dark`).
- **Categories**: edit `CATS` and `ICONS` in `assets/app.js`.
- **Demo data**: edit `data/seed.json` **and** `data/seed.js`, then run `resetDemo()` and reload.
- **Currency**: change the `₹` prefix in `money()` and the locale in `inr` (`assets/app.js`).

## Ideas to extend it (great for learning)

- Recurring transactions (rent, subscriptions)
- Per-category budgets with their own progress lines
- Export to CSV with `Blob` + a download link
- Rebuild it in React or Vue with the same Tailwind classes
- Swap localStorage for IndexedDB or a tiny backend

## Credits

UI concept designed with Google Stitch, then hand-built and tested by **@code.in.30s**.
Tailwind CSS is loaded from its CDN (fine for learning; use the Tailwind CLI for production).
