/* Hearth UI Kit · theme.js — load right after the Tailwind CDN script (before first paint).
   Applies the saved theme (or ?theme=dark|light, handy for screenshots) and maps CSS tokens to Tailwind colours.
   Dark (charcoal) is the default look; light is warm off-white. */
(function applySavedTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q === 'dark' || q === 'light') localStorage.setItem('hearth.theme', q);
  const saved = localStorage.getItem('hearth.theme');
  if (saved !== 'light') document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), raised: v('raised'), line: v('line'), ink: v('ink'), muted: v('muted'),
        primary: v('primary'), deep: v('deep'), onp: v('onp'), ok: v('ok'),
      },
      fontFamily: { sans: ['Outfit', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '22px', tile: '24px' },
      boxShadow: {
        card: '0 16px 34px -20px rgb(var(--shadow) / 0.45)',
        soft: '0 8px 20px -12px rgb(var(--shadow) / 0.40)',
        glow: '0 16px 30px -12px rgb(242 118 46 / 0.65)',
        float: '0 22px 44px -16px rgb(var(--shadow) / 0.6)',
      },
    },
  },
};
