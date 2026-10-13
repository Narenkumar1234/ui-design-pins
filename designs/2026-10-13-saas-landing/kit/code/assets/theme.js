/* Klar theme: light <-> dark via class on <html>, persisted. */
(function () {
  const KEY = 'klar-theme';
  const root = document.documentElement;
  function apply(t) {
    root.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem(KEY, t); } catch (_) {}
  }
  const saved = (() => { try { return localStorage.getItem(KEY); } catch (_) { return null; } })();
  apply(saved === 'dark' || saved === 'light' ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  window.toggleTheme = function () {
    apply(root.classList.contains('dark') ? 'light' : 'dark');
  };
})();
