/* Ember UI Kit · theme.js — load right after the Tailwind CDN script (before first paint) */
(function applySavedTheme() {
  const saved = localStorage.getItem('ember.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), card: v('card'), line: v('line'), ink: v('ink'), muted: v('muted'), soft: v('soft'),
        accent: v('accent'), accent2: v('accent2'), peach: v('peach'), gold: v('gold'), leaf: v('leaf'),
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      borderRadius: { card: '20px', sheet: '28px' },
      boxShadow: {
        card: '0 14px 30px -14px rgb(120 70 40 / 0.22)',
        soft: '0 6px 18px -8px rgb(120 70 40 / 0.16)',
        glow: '0 12px 26px -10px rgb(232 98 44 / 0.6)',
        bowl: '0 30px 40px -18px rgb(90 45 20 / 0.45)',
      },
    },
  },
};
