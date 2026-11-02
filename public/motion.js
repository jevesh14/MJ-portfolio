// The document remains visible and usable without animation or JavaScript.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function setMotionPreference() {
  revealObserver?.disconnect();
  const elements=[...document.querySelectorAll('[data-reveal]')];
  if(motionPreference.matches||!('IntersectionObserver' in window)) {
    document.body.classList.remove('motion-ready');
    return;
  }
  document.body.classList.add('motion-ready');
  revealObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  },{threshold:.08,rootMargin:'0px 0px 30px 0px'});
  for(const element of elements)revealObserver.observe(element);
}
motionPreference.addEventListener('change',setMotionPreference);
setMotionPreference();

const readingProgress=document.querySelector('.reading-progress');
let progressScheduled=false;
function paintProgress() {
  const distance=document.documentElement.scrollHeight-window.innerHeight;
  const progress=distance>0?Math.min(1,Math.max(0,window.scrollY/distance)):0;
  if(readingProgress)readingProgress.style.transform=`scaleX(${progress})`;
  progressScheduled=false;
}
function scheduleProgress() {
  if(!progressScheduled){progressScheduled=true;requestAnimationFrame(paintProgress);}
}
window.addEventListener('scroll',scheduleProgress,{passive:true});
window.addEventListener('resize',scheduleProgress);
paintProgress();

// Only short phrases in project descriptions receive scroll-linked colour.
const projectPhrases=[...document.querySelectorAll('[data-project-color]')];
const projectImages=[...document.querySelectorAll('.project-feature-images')];
if(projectPhrases.length) {
 let colorFrame=false;
 function paintProjectColor() {
  const reduced=motionPreference.matches;
  document.body.classList.toggle('project-color-ready',!reduced);
  for(const phrase of projectPhrases) {
   const box=phrase.getBoundingClientRect();
   const progress=Math.min(1,Math.max(0,(window.innerHeight*.88-box.top)/(window.innerHeight*.4)));
   phrase.style.setProperty('--color-progress',`${Math.round(progress*100)}%`);
  }
  for(const images of projectImages) {
   const box=images.getBoundingClientRect();
   const depth=reduced?0:Math.max(-18,Math.min(18,(window.innerHeight*.5-box.top)*.035));
   images.style.setProperty('--project-depth',`${depth.toFixed(1)}px`);
  }
  colorFrame=false;
 }
 function scheduleProjectColor(){if(!colorFrame){colorFrame=true;requestAnimationFrame(paintProjectColor);}}
 window.addEventListener('scroll',scheduleProjectColor,{passive:true});
 window.addEventListener('resize',scheduleProjectColor);
 motionPreference.addEventListener('change',paintProjectColor);
 paintProjectColor();
}

// Pointer-following photo tilt is limited to precise pointers; touch remains steady.
const precisePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
for(const card of document.querySelectorAll('.project-feature-images .photo > a')) {
 let frame=null,lastPoint;
 function resetTilt() {
  if(frame!==null)cancelAnimationFrame(frame);
  frame=null;
  card.style.removeProperty('--photo-tilt-x');
  card.style.removeProperty('--photo-tilt-y');
 }
 card.addEventListener('pointermove',event=>{
  if(motionPreference.matches||!precisePointer.matches||event.pointerType==='touch')return;
  lastPoint={x:event.clientX,y:event.clientY};
  if(frame!==null)return;
  frame=requestAnimationFrame(()=>{
   const box=card.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(lastPoint.x-box.left)/Math.max(1,box.width)*2-1));
   const y=Math.max(-1,Math.min(1,(lastPoint.y-box.top)/Math.max(1,box.height)*2-1));
   card.style.setProperty('--photo-tilt-x',`${(-y*4).toFixed(2)}deg`);
   card.style.setProperty('--photo-tilt-y',`${(x*4).toFixed(2)}deg`);
   frame=null;
  });
 });
 card.addEventListener('pointerleave',resetTilt);
 card.addEventListener('pointercancel',resetTilt);
 motionPreference.addEventListener('change',resetTilt);
 precisePointer.addEventListener('change',resetTilt);
}

// Final values remain in the HTML. Animate once, only when the metric enters view.
const counters=[...document.querySelectorAll('[data-count-to]')];
const activeCounters=new Map();
const formatCounter=(element,value)=>`${element.dataset.countPrefix||''}${value.toLocaleString('en-US',{minimumFractionDigits:Number.isInteger(Number(element.dataset.countTo))?0:2,maximumFractionDigits:2})}${element.dataset.countSuffix||''}`;
function finishCounters() {
 for(const [element,frame] of activeCounters) {
  cancelAnimationFrame(frame);
  element.textContent=formatCounter(element,Number(element.dataset.countTo));
 }
 activeCounters.clear();
}
if(counters.length&&!motionPreference.matches&&'IntersectionObserver' in window) {
 const counterObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting) {
   counterObserver.unobserve(entry.target);
   const element=entry.target,target=Number(element.dataset.countTo);
   if(motionPreference.matches)return;
   let started;
   const tick=now=>{
    started??=now;
    const progress=Math.min(1,(now-started)/1400),eased=1-Math.pow(1-progress,3);
    const value=Number.isInteger(target)?Math.round(target*eased):Math.round(target*eased*100)/100;
    element.textContent=formatCounter(element,value);
    if(progress<1)activeCounters.set(element,requestAnimationFrame(tick));
    else activeCounters.delete(element);
   };
   activeCounters.set(element,requestAnimationFrame(tick));
  }
 },{threshold:.5});
 counters.forEach(element=>counterObserver.observe(element));
 motionPreference.addEventListener('change',()=>{if(motionPreference.matches){counterObserver.disconnect();finishCounters();}});
}
