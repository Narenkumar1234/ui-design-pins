/* Folio UI Kit · theme.js — load right after the Tailwind CDN script (before first paint).
   Applies the saved theme ('light', 'dark' or 'system') and maps the CSS tokens to Tailwind colours.
   Add ?theme=dark or ?theme=light to any URL (handy for screenshots). */
(function applySavedTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q === 'dark' || q === 'light' || q === 'system') localStorage.setItem('folio.theme', JSON.stringify(q));
  let t = 'light';
  try { t = JSON.parse(localStorage.getItem('folio.theme')) || 'light'; } catch (e) { t = 'light'; }
  const dark = t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: { bg: v('bg'), card: v('card'), line: v('line'), soft: v('soft'), ink: v('ink'), muted: v('muted'),
                accent: v('accent'), star: v('star'), inv: v('inv'), oninv: v('oninv'), hero: v('hero'), onhero: v('onhero') },
      fontFamily: { sans: ['Urbanist', 'system-ui', 'sans-serif'] },
      borderRadius: { tile: '10px' },
    },
  },
};
