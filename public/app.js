document.body.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded','false'); menu.classList.remove('is-open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(open));
  menu.classList.toggle('is-open',open);
});
menu.addEventListener('click',event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown',event => {
  if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus?.();}
});
const navigationWidth=window.matchMedia('(min-width: 981px)');
navigationWidth.addEventListener('change',closeMenu);
document.querySelectorAll('[data-marquee-pause]').forEach(marqueeButton=>marqueeButton.addEventListener('click',()=>{
  const section=marqueeButton.closest('.marquee-section');
  const paused=section.classList.toggle('is-paused');
  const subject=section.dataset.marqueeSubject||(section.classList.contains('press-marquee')?'media features':'interests');
  marqueeButton.setAttribute('aria-label',`${paused?'Play':'Pause'} scrolling ${subject}`);
  marqueeButton.innerHTML=paused?'Play <span aria-hidden="true">▷</span>':'Pause <span aria-hidden="true">Ⅱ</span>';
}));
const mediaSearch=document.querySelector('[data-media-search]');
if(mediaSearch) {
  const items=[...document.querySelectorAll('[data-media-item]')];
  const categories=[...document.querySelectorAll('[data-media-category]')];
  mediaSearch.addEventListener('input',()=>{
    const query=mediaSearch.value.trim().toLowerCase();let count=0;
    items.forEach(item=>{item.hidden=!item.dataset.search.includes(query);if(!item.hidden)count++;});
    categories.forEach(category=>{category.hidden=![...category.querySelectorAll('[data-media-item]')].some(item=>!item.hidden);});
    document.querySelector('[data-media-count]').textContent=`${count} of ${items.length} references`;
    document.querySelector('[data-media-empty]').hidden=count!==0;
  });
}
const viewer=document.querySelector('.lightbox');
let previousFocus;
if(viewer&&typeof viewer.showModal==='function') {
  document.querySelectorAll('[data-lightbox]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();previousFocus=link;
    viewer.querySelector('img').src=link.href;
    viewer.querySelector('img').alt=link.dataset.caption;
    viewer.querySelector('p').textContent=link.dataset.caption;
    viewer.showModal();
  }));
  viewer.querySelector('.lightbox-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('click',event=>{if(event.target===viewer){const box=viewer.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)viewer.close();}});
  viewer.addEventListener('close',()=>previousFocus?.focus());
}

// Each project exposes one evidence panel at a time; a second click closes it.
const projectButtons=[...document.querySelectorAll('[data-project-panel]')];
function openProjectPanel(button,open=true) {
 const project=button.closest('.project-feature');
 for(const control of project.querySelectorAll('[data-project-panel]')) {
  const active=open&&control===button;
  control.setAttribute('aria-expanded',String(active));
  document.getElementById(control.dataset.projectPanel).hidden=!active;
 }
}
for(const button of projectButtons) {
 document.getElementById(button.dataset.projectPanel).hidden=true;
 button.addEventListener('click',()=>openProjectPanel(button,button.getAttribute('aria-expanded')!=='true'));
}
function revealProjectAnchor() {
 const id=decodeURIComponent(location.hash.slice(1));
 const target=id?document.getElementById(id):null;
 const panel=target?.closest('.project-evidence-panel');
 if(panel) {
  const button=projectButtons.find(b=>b.dataset.projectPanel===panel.id);
  if(button)openProjectPanel(button);
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
 }
}
if(projectButtons.length){window.addEventListener('hashchange',revealProjectAnchor);revealProjectAnchor();}

// Muted inline playback is permitted by browser autoplay policies.
const projectVideos = [...document.querySelectorAll('video[autoplay]')];
projectVideos.forEach(video => { video.muted = true; });
if ('IntersectionObserver' in window) {
  const playbackObserver = new IntersectionObserver(entries => {
    entries.forEach(({target: video, isIntersecting}) => {
      if (isIntersecting) {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, {threshold: 0.15});
  projectVideos.forEach(video => playbackObserver.observe(video));
}

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

// Show ISEF immediately and bring it to the centre within 2.5 seconds.
function positionRecognitionTicker() {
  document.querySelectorAll('.recognition-ticker').forEach(ticker => {
    const viewport = ticker.querySelector('.marquee-window');
    const track = ticker.querySelector('.recognition-track');
    const group = track?.querySelector('.marquee-group');
    const leadAward = group?.querySelector('[data-recognition-id="isef"]');
    if (!viewport || !track || !group || !leadAward) return;
    const start = viewport.clientWidth / 2 + 76 * 2.5 - leadAward.offsetLeft - leadAward.offsetWidth / 2;
    track.style.setProperty('--ticker-start', `${start}px`);
    track.style.setProperty('--ticker-width', `${group.getBoundingClientRect().width}px`);
    track.style.setProperty('--ticker-duration', `${Math.max(45, group.getBoundingClientRect().width / 76)}s`);
    track.dataset.ready = 'true';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) viewport.scrollLeft = leadAward.offsetLeft;
  });
}
positionRecognitionTicker();
window.addEventListener('resize', positionRecognitionTicker);
if (document.fonts?.ready) document.fonts.ready.then(positionRecognitionTicker);
