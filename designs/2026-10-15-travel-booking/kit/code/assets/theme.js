/* Roam UI Kit · theme.js — load right after the Tailwind CDN script (before first paint) */
(function applySavedTheme() {
  const saved = localStorage.getItem('roam.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), wash: v('wash'), card: v('card'), line: v('line'), ink: v('ink'), muted: v('muted'),
        soft: v('soft'), accent: v('accent'), accent2: v('accent2'), coral: v('coral'), gold: v('gold'),
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '20px', hero: '28px' },
      boxShadow: {
        card: '0 12px 30px -12px rgb(16 28 44 / 0.18)',
        soft: '0 6px 18px -8px rgb(16 28 44 / 0.12)',
        glow: '0 10px 24px -8px rgb(59 140 245 / 0.55)',
      },
    },
  },
};
