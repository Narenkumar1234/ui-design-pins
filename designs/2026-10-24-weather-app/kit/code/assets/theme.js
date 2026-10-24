/* Nimbus UI Kit · theme.js — load right after the Tailwind CDN script (before first paint).
   Applies the saved theme ('light' day sky, 'dark' night sky, or 'auto' = follow the OS) and maps CSS tokens to Tailwind colours.
   Add ?theme=dark or ?theme=light to any URL (handy for screenshots). */
(function applySavedTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q === 'dark' || q === 'light' || q === 'auto') localStorage.setItem('nimbus.theme', JSON.stringify(q));
  let t = 'light';
  try { t = JSON.parse(localStorage.getItem('nimbus.theme')) || 'light'; } catch (e) { t = 'light'; }
  const dark = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
})();

const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: { ink: v('ink'), muted: v('muted'), sun: v('sun'), sky: v('accent'), rain: v('rain'), ok: v('ok'), warn: v('warn'), bad: v('bad') },
      fontFamily: { sans: ['Sora', 'system-ui', 'sans-serif'] },
      borderRadius: { glass: '28px' },
    },
  },
};
