/* ============================================================
   GARGI PATEL — Life Sciences Portfolio
   script.js
   ============================================================ */

/* ─── CUSTOM CURSOR ─── */
const cur     = document.getElementById('cursor');
const curRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();


/* ─── BACKGROUND CANVAS: Floating Microorganisms ─── */
(function () {
  const cv  = document.getElementById('bio-canvas');
  const ctx = cv.getContext('2d');
  let W, H, orgs = [];

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }

  class Organism {
    constructor() { this.reset(); }

    reset() {
      this.x           = Math.random() * W;
      this.y           = Math.random() * H;
      this.type        = Math.floor(Math.random() * 4);
      this.r           = 4 + Math.random() * 18;
      this.vx          = (Math.random() - 0.5) * 0.4;
      this.vy          = (Math.random() - 0.5) * 0.4;
      this.rot         = Math.random() * Math.PI * 2;
      this.rotV        = (Math.random() - 0.5) * 0.008;
      this.alpha       = 0.2 + Math.random() * 0.5;
      this.hue         = Math.random() < 0.7 ? '0,232,162' : '240,192,96';
      this.wobble      = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
      this.x      += this.vx;
      this.y      += this.vy;
      this.rot    += this.rotV;
      this.wobble += this.wobbleSpeed;
      if (this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.strokeStyle = `rgba(${this.hue},${this.alpha})`;
      ctx.lineWidth   = 0.8;
      ctx.fillStyle   = `rgba(${this.hue},${this.alpha * 0.06})`;

      if (this.type === 0) {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.r, this.r * (0.7 + 0.3 * Math.sin(this.wobble)), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.r * 0.1, 0, this.r * 0.3, 0, Math.PI * 2);
        ctx.stroke();

      } else if (this.type === 1) {
        const rw = this.r * 2.5, rh = this.r * 0.8;
        ctx.beginPath();
        ctx.roundRect(-rw / 2, -rh / 2, rw, rh, rh / 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -rh / 2);
        ctx.lineTo(0, rh / 2);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;

      } else if (this.type === 2) {
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + this.wobble;
          const px    = Math.cos(angle) * this.r * 0.6;
          const py    = Math.sin(angle) * this.r * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, this.r * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

      } else {
        ctx.beginPath();
        const pts = 8;
        for (let i = 0; i <= pts; i++) {
          const angle = (i / pts) * Math.PI * 2;
          const noise = this.r * (0.7 + 0.3 * Math.sin(i * 2.3 + this.wobble));
          const px    = Math.cos(angle) * noise;
          const py    = Math.sin(angle) * noise;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function init() {
    resize();
    orgs = Array.from({ length: 60 }, () => new Organism());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    orgs.forEach(o => { o.update(); o.draw(ctx); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();


/* ─── HERO MICROSCOPE: Live Cell Animation ─── */
(function () {
  const cv = document.getElementById('cell-canvas');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  cv.width  = 180;
  cv.height = 180;

  const cx = 90, cy = 90;
  let t = 0;

  const cells = Array.from({ length: 5 }, (_, i) => ({
    r:      12 + Math.random() * 16,
    a:      (i / 5) * Math.PI * 2,
    dist:   20 + Math.random() * 30,
    speed:  0.003 + Math.random() * 0.005,
    wobble: Math.random() * Math.PI * 2
  }));

  cells.push({ r: 22, a: 0, dist: 0, speed: 0, wobble: 0, isMain: true });

  function drawCell(x, y, r, time, isMain) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * (0.85 + 0.1 * Math.sin(time * 2)), Math.sin(time) * 0.3, 0, Math.PI * 2);
    ctx.fillStyle   = isMain ? 'rgba(0,232,162,0.08)' : 'rgba(0,232,162,0.05)';
    ctx.strokeStyle = isMain ? 'rgba(0,232,162,0.6)'  : 'rgba(0,232,162,0.35)';
    ctx.lineWidth   = 0.8;
    ctx.fill();
    ctx.stroke();

    if (isMain) {
      ctx.beginPath();
      ctx.arc(r * 0.1, -r * 0.1, r * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,232,162,0.4)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(r * 0.1, -r * 0.1, r * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,232,162,0.25)';
      ctx.fill();
    }

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, 180, 180);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
    grd.addColorStop(0, 'rgba(0,232,162,0.04)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 180, 180);

    cells.forEach(c => {
      if (c.dist === 0) return;
      c.a      += c.speed;
      c.wobble += 0.02;
      const x = cx + Math.cos(c.a) * c.dist;
      const y = cy + Math.sin(c.a) * c.dist;
      drawCell(x, y, c.r, c.wobble, false);
    });

    drawCell(cx, cy, 24, t, true);

    const scanY = (t * 30) % 180;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(180, scanY);
    ctx.strokeStyle = 'rgba(0,232,162,0.08)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    t += 0.02;
    requestAnimationFrame(loop);
  }

  loop();
})();


/* ─── SKILL CARDS: Petri Dish Animations ─── */
document.querySelectorAll('.petri-anim').forEach(cv => {
  const rgb = cv.dataset.color;
  cv.width  = 64;
  cv.height = 64;

  const ctx = cv.getContext('2d');
  let t = Math.random() * 100;

  const colonies = Array.from({ length: 4 }, () => ({
    x:     10 + Math.random() * 44,
    y:     10 + Math.random() * 44,
    r:     3  + Math.random() * 8,
    speed: 0.002 + Math.random() * 0.005
  }));

  function draw() {
    ctx.clearRect(0, 0, 64, 64);

    ctx.fillStyle = `rgba(${rgb},0.04)`;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    colonies.forEach(c => {
      const gr = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * (1 + 0.15 * Math.sin(t)));
      gr.addColorStop(0, `rgba(${rgb},0.25)`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * (1 + 0.15 * Math.sin(t + c.speed * 100)), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb},0.2)`;
    ctx.lineWidth   = 0.5;
    ctx.stroke();

    t += 0.04;
    requestAnimationFrame(draw);
  }

  draw();
});


/* ─── SCROLL REVEAL ─── */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

document.querySelectorAll('#hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 300 + i * 150);
});


/* ─── MOBILE NAV: Hamburger Menu ─── */
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const body      = document.body;

  if (!navToggle || !navLinks) {
    console.warn('Nav toggle or nav links not found.');
    return;
  }

  function openMenu() {
    navToggle.classList.add('open');
    navLinks.classList.add('open');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    body.style.overflow = '';
  }

  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
});