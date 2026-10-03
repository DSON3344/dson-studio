// Visual-only motion layer: pointer spotlight on cards, hero mark parallax,
// and the pinned horizontal process track. Nothing here touches content,
// i18n, the theme or the contact form; all of that stays in script.js.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktop = window.matchMedia('(min-width: 901px)');

  // Pointer spotlight: cards read --mx / --my for a soft radial highlight
  if (finePointer.matches) {
    document.querySelectorAll('.tier-card, .process-step, .case-card, .faq-item').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // Hero mark drifts a little against the pointer
  const hero = document.querySelector('.hero');
  const mark = document.querySelector('.hero-mark');
  if (hero && mark && finePointer.matches) {
    hero.addEventListener('pointermove', (e) => {
      if (reduceMotion.matches) return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mark.style.setProperty('--px', `${(x * -18).toFixed(1)}px`);
      mark.style.setProperty('--py', `${(y * -14).toFixed(1)}px`);
    });
    hero.addEventListener('pointerleave', () => {
      mark.style.setProperty('--px', '0px');
      mark.style.setProperty('--py', '0px');
    });
  }

  // Pinned process: vertical scroll drives the track sideways on desktop
  const pin = document.querySelector('.process-pin');
  const track = pin ? pin.querySelector('.process') : null;
  const bar = pin ? pin.querySelector('.process-progress span') : null;
  if (!pin || !track) return;

  let distance = 0;
  let ticking = false;

  function layout() {
    const enabled = desktop.matches && !reduceMotion.matches;
    pin.classList.toggle('is-pinned', enabled);
    if (!enabled) {
      pin.style.height = '';
      track.style.transform = '';
      if (bar) bar.style.transform = '';
      return;
    }
    distance = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    pin.style.height = `${window.innerHeight + distance}px`;
    update();
  }

  function update() {
    ticking = false;
    if (!pin.classList.contains('is-pinned')) return;
    const r = pin.getBoundingClientRect();
    const span = pin.offsetHeight - window.innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    track.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${p})`;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', layout);
  desktop.addEventListener('change', layout);
  reduceMotion.addEventListener('change', layout);
  // Switching language changes card widths, so re-measure afterwards
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) langSwitch.addEventListener('click', () => requestAnimationFrame(layout));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
})();
