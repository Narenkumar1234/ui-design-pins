/* Natter · welcome.js — 3 intro steps (dots, swipe, arrow keys), round arrow button with progress ring, remembers onboarding */
(() => {
  const { D, $, avatar, set } = Natter;
  const steps = D.intro; let i = 0;
  $('#art-avs').innerHTML = ['maya', 'arjun', 'zoe'].map((p) => `<span class="ring !p-[2px] !bg-white/70">${avatar(p, 40, { online: false })}</span>`).join('');
  $('#art-wave').innerHTML = [6, 12, 18, 10, 22, 14, 8, 16, 20, 9, 14, 6, 11].map((h) => `<i class="block w-[3px] rounded bg-current" style="height:${h}px"></i>`).join('');
  $('#dots').innerHTML = steps.map((_, k) => `<button type="button" role="tab" data-step="${k}" aria-label="Step ${k + 1}"></button>`).join('');
  function show(k) {
    i = Math.max(0, Math.min(steps.length - 1, k));
    $('#ob-title').innerHTML = steps[i].title; $('#ob-text').textContent = steps[i].text;
    document.querySelectorAll('#dots button').forEach((b, n) => b.setAttribute('aria-selected', String(n === i)));
    $('#prog').style.strokeDashoffset = String(264 - 264 * (i + 1) / steps.length);
    $('#go').setAttribute('aria-label', i === steps.length - 1 ? 'Start chatting' : 'Next');
  }
  const finish = () => { set('onboarded', true); location.href = 'index.html'; };
  $('#dots').addEventListener('click', (e) => { const b = e.target.closest('[data-step]'); if (b) show(+b.dataset.step); });
  $('#go').addEventListener('click', () => (i < steps.length - 1 ? show(i + 1) : finish()));
  ['#skip', '#login'].forEach((s) => $(s).addEventListener('click', () => set('onboarded', true)));
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  let x0 = null; const m = $('main');
  m.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  m.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
  show(0);
})();
