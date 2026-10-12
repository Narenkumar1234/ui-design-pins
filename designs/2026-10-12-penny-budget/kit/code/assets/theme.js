/* Penny UI Kit · theme.js: load right after the Tailwind CDN script */
(function applySavedTheme() {
  const saved = localStorage.getItem('penny.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'), card: v('card'), line: v('line'), ink: v('ink'), muted: v('muted'),
        accent: v('accent'), 'on-accent': v('on-accent'), spend: v('spend'), soft: v('soft'),
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
