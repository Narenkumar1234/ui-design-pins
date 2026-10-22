/* Natter UI Kit · theme.js — load right after the Tailwind CDN script (before first paint).
   Applies the saved theme (or ?theme=dark|light, handy for screenshots) and maps CSS tokens to Tailwind colours.
   Light (pale lavender) is the default look; dark is deep violet-black. */
(function applySavedTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q === 'dark' || q === 'light') localStorage.setItem('natter.theme', q);
  if (localStorage.getItem('natter.theme') === 'dark') document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), raised: v('raised'), line: v('line'), ink: v('ink'), muted: v('muted'),
        primary: v('primary'), deep: v('deep'), onp: v('onp'), pink: v('pink'), amber: v('amber'), ok: v('ok'),
      },
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '20px', bubble: '18px' },
      boxShadow: {
        card: '0 14px 30px -20px rgb(var(--shadow) / 0.45)',
        soft: '0 8px 20px -14px rgb(var(--shadow) / 0.45)',
        glow: '0 16px 30px -12px rgb(91 63 208 / 0.6)',
      },
    },
  },
};
