/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));


/* ===== PARTICLES ===== */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = [
  'rgba(58,125,80,0.12)',
  'rgba(58,125,80,0.08)',
  'rgba(224,112,144,0.10)',
  'rgba(224,112,144,0.07)',
];

class Dot {
  constructor() { this.init(true); }
  init(scatter = false) {
    this.x     = Math.random() * W;
    this.y     = scatter ? Math.random() * H : H + 8;
    this.r     = Math.random() * 3 + 1;
    this.vy    = -(Math.random() * 0.28 + 0.07);
    this.vx    = (Math.random() - 0.5) * 0.15;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  update() {
    this.y += this.vy;
    this.x += this.vx;
    if (this.y < -8) this.init();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const dots = Array.from({ length: 60 }, () => new Dot());
(function loop() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => { d.update(); d.draw(); });
  requestAnimationFrame(loop);
})();


/* ===== HERO PARALLAX ===== */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const y = window.scrollY;
  heroContent.style.transform = `translateY(${y * 0.22}px)`;
  heroContent.style.opacity   = Math.max(0, 1 - y / (window.innerHeight * 0.75));
}, { passive: true });


/* ===== STORY NUMBER DRIFT ===== */
const storyNums = document.querySelectorAll('.story-number');
window.addEventListener('scroll', () => {
  storyNums.forEach(num => {
    const rect     = num.closest('.story').getBoundingClientRect();
    const progress = 1 - rect.bottom / (window.innerHeight + rect.height);
    const offset   = (progress - 0.5) * 32;
    num.style.transform = `translateY(calc(-50% + ${offset}px))`;
  });
}, { passive: true });


/* ===== PEEK STRIP SLIDE-IN ===== */
const peekEls = document.querySelectorAll('.peek-slide-left, .peek-slide-right');
const peekObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('peeked'); });
  },
  { threshold: 0 }  // fires as soon as any pixel is visible — fixes iPhone clipping issue
);
peekEls.forEach(el => peekObserver.observe(el));


/* ===== FINALE SCROLL ===== */
const finaleSection = document.querySelector('.finale');
const finalePhotos  = document.querySelectorAll('.finale-float-photo');
const finaleText    = document.querySelector('.finale-text-wrap');

const photoThresholds = [0.08, 0.18, 0.28, 0.38];
const textThreshold   = 0.55;

window.addEventListener('scroll', () => {
  if (!finaleSection) return;
  const rect     = finaleSection.getBoundingClientRect();
  const total    = finaleSection.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  const progress = Math.min(Math.max(scrolled / total, 0), 1);

  finalePhotos.forEach((photo, i) => {
    if (progress >= photoThresholds[i]) photo.classList.add('fp-in');
  });

  if (progress >= textThreshold) finaleText.classList.add('fin-in');
}, { passive: true });
