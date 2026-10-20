/* Hearth UI Kit · welcome.js — 3-step intro (dots or swipe), slide the knob to start; remembers you have onboarded */
(() => {
  const { D, $, $$, slidePill, set } = Hearth;
  Hearth.boot(null);
  // ?shot=1 (mockup screenshots): leave room for the phone frame's status bar drawn over the photo
  if (new URLSearchParams(location.search).get('shot')) document.documentElement.style.setProperty('--sat', '34px');
  const steps = D.onboarding; let i = 0, timer;
  $('#dots').innerHTML = steps.map((s, k) => `<button type="button" role="tab" aria-label="Step ${k + 1}" data-step="${k}" class="p-1 -m-1"><i></i></button>`).join('');
  function show(k) {
    i = (k + steps.length) % steps.length;
    $('#ob-title').innerHTML = steps[i].title; $('#ob-text').textContent = steps[i].text;
    $$('#dots [data-step]').forEach((b, n) => { b.querySelector('i').classList.toggle('on', n === i); b.setAttribute('aria-selected', String(n === i)); });
  }
  $$('#dots [data-step]').forEach((b) => b.addEventListener('click', () => { show(+b.dataset.step); restart(); }));
  let sx = null; const main = $('main');
  main.addEventListener('pointerdown', (e) => { if (!e.target.closest('#start')) sx = e.clientX; });
  main.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) { show(i + (dx < 0 ? 1 : -1)); restart(); } });
  const restart = () => { clearInterval(timer); if (!new URLSearchParams(location.search).get('shot')) timer = setInterval(() => show(i + 1), 4500); };
  const go = () => { set('onboarded', true); location.href = 'index.html'; };
  slidePill($('#start'), go); $('#skip').addEventListener('click', () => set('onboarded', true));
  show(0); restart();
})();
