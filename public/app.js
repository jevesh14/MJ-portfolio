document.body.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 1151px)').addEventListener('change', closeMenu);

// Original full-size photographs remain available by mouse and keyboard.
const viewer = document.querySelector('.lightbox');
let previousFocus;
if (viewer && typeof viewer.showModal === 'function') {
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    previousFocus = link;
    viewer.querySelector('img').src = link.href;
    viewer.querySelector('img').alt = link.dataset.caption;
    viewer.querySelector('p').textContent = link.dataset.caption;
    viewer.showModal();
  }));
  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => previousFocus?.focus());
}

// Retain inline films; reduced-motion users start playback themselves.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video[autoplay]')];
videos.forEach(video => { video.muted = true; });
function updatePlayback(video, visible) {
  if (visible && !reducedMotion.matches) video.play()?.catch(() => {});
  else video.pause();
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => updatePlayback(target, isIntersecting));
  }, { threshold: .15 });
  videos.forEach(video => observer.observe(video));
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) videos.forEach(video => video.pause());
});
if (reducedMotion.matches) videos.forEach(video => { video.autoplay = false; video.pause(); });

const pressFilters = [...document.querySelectorAll('[data-press-filter]')];
const pressItems = [...document.querySelectorAll('[data-press-project]')];
pressFilters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.pressFilter;
  pressFilters.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
  let shown = 0;
  pressItems.forEach(item => {
    item.hidden = selected !== 'All' && item.dataset.pressProject !== selected;
    if (!item.hidden) shown++;
  });
  const count = document.querySelector('[data-press-total]');
  if (count) count.textContent = `${shown} ${shown === 1 ? 'clipping' : 'clippings'}`;
}));

// Keep recognition browsable; the four leading honours appear immediately.
function sizeRecognitionStrip() {
  document.querySelectorAll('.recognition-ticker').forEach(ticker => {
    const track = ticker.querySelector('.recognition-track');
    const group = track?.querySelector('.marquee-group');
    if (!track || !group) return;
    const width = group.getBoundingClientRect().width;
    track.style.setProperty('--ticker-width', `${width}px`);
    track.style.setProperty('--ticker-duration', `${Math.max(120, width / 42)}s`);
    track.dataset.ready = 'true';
  });
}
document.querySelectorAll('[data-marquee-pause]').forEach(button => button.addEventListener('click', () => {
  const paused = button.closest('.recognition-ticker').classList.toggle('is-paused');
  button.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} scrolling recognition`);
  button.textContent = paused ? 'Play' : 'Pause';
}));
sizeRecognitionStrip();
window.addEventListener('resize', sizeRecognitionStrip);
if (document.fonts?.ready) document.fonts.ready.then(sizeRecognitionStrip);
