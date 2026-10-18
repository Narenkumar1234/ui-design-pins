/* Lumo UI Kit · theme.js — load right after the Tailwind CDN script (before first paint).
   Applies the saved theme (or ?theme=dark|light, handy for screenshots) and maps CSS tokens to Tailwind colours. */
(function applySavedTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q === 'dark' || q === 'light') localStorage.setItem('lumo.theme', q);
  const saved = localStorage.getItem('lumo.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), raised: v('raised'), ink: v('ink'), muted: v('muted'),
        primary: v('primary'), primary2: v('primary2'), deep: v('deep'),
        peach: v('peach'), cream: v('cream'), lav: v('lav'), sky: v('sky'), mint: v('mint'),
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '24px', tile: '28px' },
      boxShadow: {
        card: '0 18px 36px -18px rgb(var(--shadow) / 0.35)',
        soft: '0 8px 20px -10px rgb(var(--shadow) / 0.30)',
        pill: '0 14px 28px -12px rgb(111 163 240 / 0.75)',
        float: '0 20px 44px -16px rgb(var(--shadow) / 0.45)',
      },
    },
  },
};
