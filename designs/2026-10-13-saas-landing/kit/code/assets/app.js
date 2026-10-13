/* Klar landing: mobile nav + FAQ is native <details>. */
(function () {
  const btn = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      panel.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }));
  }
})();
