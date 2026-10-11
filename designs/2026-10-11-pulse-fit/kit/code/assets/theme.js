/* Pulse Fit UI Kit · theme.js — load right after Tailwind CDN */
(function applySavedTheme() {
  const saved = localStorage.getItem('pulsefit.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        card: v('card'),
        ink: v('ink'),
        muted: v('muted'),
        lime: v('lime'),
        'on-lime': v('on-lime'),
        pink: v('pink'),
        blue: v('blue'),
        yellow: v('yellow'),
        outline: v('outline'),
        shadow: v('shadow'),
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { brut: '8px' },
      boxShadow: {
        brut: '4px 4px 0 rgb(var(--shadow))',
        'brut-sm': '3px 3px 0 rgb(var(--shadow))',
      },
    },
  },
};
