/* ==========================================================================
   Flat Shop UI Kit · theme.js
   Load this right after the Tailwind CDN script, inside <head>.
   1. Applies the saved theme before the page paints (no white flash).
   2. Configures Tailwind: class-based dark mode + our palette tokens.
   The actual hex values live in assets/styles.css (CSS variables), so you can
   re-skin the whole kit by editing one file.
   ========================================================================== */
(function applySavedTheme() {
  const saved = localStorage.getItem('flatshop.theme');            // 'light' | 'dark' | null
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

// Helper: lets Tailwind use a CSS variable that holds "R G B" so opacity
// modifiers like bg-coral/20 still work.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

tailwind.config = {
  darkMode: 'class',                     // `dark:` variants activate when <html class="dark">
  theme: {
    extend: {
      colors: {
        bg: v('bg'),            // page background
        card: v('card'),        // cards, sheets, inputs
        chip: v('chip'),        // chips, steppers, quiet buttons
        ink: v('ink'),          // main text (and bold outlines in light mode)
        muted: v('muted'),      // secondary text
        line: v('line'),        // subtle borders (used in dark mode)
        coral: v('coral'),      // primary / CTA
        'on-coral': v('on-coral'),
        blue: v('blue'),
        green: v('green'),
        yellow: v('yellow'),
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '14px' },
    },
  },
};
