const home = document.querySelector('.home');
const startButton = document.querySelector('.start-button');
const art = document.querySelector('.scene__art');
const halo = document.querySelector('.scene__halo');
let leaving = false;
let departure;

if (window.gsap) {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    art.style.animation = 'none';
    const breathe = gsap.to(art, { scale: 1.022, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    const xTo = gsap.quickTo(art, 'x', { duration: .5, ease: 'power3.out' });
    const yTo = gsap.quickTo(art, 'y', { duration: .5, ease: 'power3.out' });
    const turnTo = gsap.quickTo(art, 'rotation', { duration: .6, ease: 'power3.out' });
    const shadowTo = gsap.quickTo(halo, 'x', { duration: .7 });
    const neutral = () => { if (!leaving) { xTo(0); yTo(0); turnTo(0); shadowTo(0); } };
    const follow = event => {
      if (leaving || event.pointerType === 'touch') return;
      if (startButton.contains(event.target)) { curious(); return; }
      const box = art.getBoundingClientRect();
      const x = gsap.utils.clamp(-1, 1, (event.clientX - box.left - box.width / 2) / (box.width / 2));
      const y = gsap.utils.clamp(-1, 1, (event.clientY - box.top - box.height / 2) / (box.height / 2));
      xTo(x * 16); yTo(y * 9); turnTo(x * 3); shadowTo(-x * 10);
    };
    const curious = () => { if (!leaving) { yTo(8); turnTo(3.6); shadowTo(-8); } };
    const tap = event => { if (event.pointerType === 'touch') curious(); };
    const visibility = () => { if (document.hidden) breathe.pause(); else breathe.resume(); };
    home.addEventListener('pointermove', follow);
    home.addEventListener('pointerleave', neutral);
    art.addEventListener('pointerdown', tap);
    art.addEventListener('pointerup', neutral);
    art.addEventListener('pointercancel', neutral);
    startButton.addEventListener('pointerenter', curious);
    startButton.addEventListener('focus', curious);
    startButton.addEventListener('blur', neutral);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      home.removeEventListener('pointermove', follow);
      home.removeEventListener('pointerleave', neutral);
      art.removeEventListener('pointerdown', tap);
      art.removeEventListener('pointerup', neutral);
      art.removeEventListener('pointercancel', neutral);
      startButton.removeEventListener('pointerenter', curious);
      startButton.removeEventListener('focus', curious);
      startButton.removeEventListener('blur', neutral);
      document.removeEventListener('visibilitychange', visibility);
      art.style.animation = '';
    };
  });
}

startButton.addEventListener('click', () => {
  if (leaving) return;
  leaving = true;
  startButton.disabled = true;
  const go = () => { window.location.href = './maze.html'; };
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) { go(); return; }
  departure = gsap.timeline({ onComplete: go })
    .to(art, { x: 14, rotation: 2, duration: .22 })
    .to('.hero', { opacity: 0, y: -8, duration: .36, ease: 'power2.in' });
});

window.addEventListener('pageshow', () => {
  home.classList.remove('is-leaving');
  departure?.kill();
  leaving = false;
  if (window.gsap) gsap.set('.hero', { clearProps: 'opacity,transform' });
  startButton.disabled = false;
});
