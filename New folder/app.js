/* ==============================
   VISUAL NERDS — Main App JS
============================== */

// ── NAV SCROLL ─────────────────────────────────────────────────
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── MOBILE MENU ────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

// ── ACTIVE NAV LINK ────────────────────────────────────────────
(function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── NEURAL NETWORK CANVAS ──────────────────────────────────────
class NeuralNet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.mouse = { x: -9999, y: -9999 };
    this.raf = null;
    this.resize();
    this.init();
    window.addEventListener('resize', () => { this.resize(); this.init(); });
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    });
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.canvas.style.width = this.canvas.offsetWidth + 'px';
    this.canvas.style.height = this.canvas.offsetHeight + 'px';
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.w = this.canvas.offsetWidth;
    this.h = this.canvas.offsetHeight;
  }

  init() {
    const density = Math.min(80, Math.floor((this.w * this.h) / 18000));
    this.nodes = Array.from({ length: density }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      hue: Math.random() > 0.5 ? 263 : 191, // purple : cyan
      phase: Math.random() * Math.PI * 2,
    }));
  }

  drawFrame() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    const maxDist = 140;

    // Lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.25;
          const g = ctx.createLinearGradient(this.nodes[i].x, this.nodes[i].y, this.nodes[j].x, this.nodes[j].y);
          g.addColorStop(0, `hsla(263,75%,65%,${alpha})`);
          g.addColorStop(1, `hsla(191,95%,45%,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of this.nodes) {
      n.phase += 0.015;
      const pr = n.r + Math.sin(n.phase) * 0.4;
      const mx = this.mouse.x, my = this.mouse.y;
      const md = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2);
      if (md < 100) {
        n.vx += (n.x - mx) / md * 0.04;
        n.vy += (n.y - my) / md * 0.04;
      }
      // Dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue}, 85%, 70%, 0.8)`;
      ctx.fill();
      // Glow
      const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 5);
      glow.addColorStop(0, `hsla(${n.hue}, 85%, 70%, 0.15)`);
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(n.x, n.y, pr * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      // Move
      n.x += n.vx;
      n.y += n.vy;
      n.vx *= 0.995;
      n.vy *= 0.995;
      if (n.x < 0 || n.x > this.w) { n.vx *= -1; n.x = Math.max(0, Math.min(this.w, n.x)); }
      if (n.y < 0 || n.y > this.h) { n.vy *= -1; n.y = Math.max(0, Math.min(this.h, n.y)); }
    }

    this.raf = requestAnimationFrame(() => this.drawFrame());
  }

  start() { this.drawFrame(); }
  stop() { if (this.raf) cancelAnimationFrame(this.raf); }
}

const heroCanvas = document.querySelector('.hero-canvas');
if (heroCanvas) {
  const nn = new NeuralNet(heroCanvas);
  nn.start();
}

// ── TYPEWRITER ─────────────────────────────────────────────────
const typer = document.querySelector('.typewriter');
if (typer) {
  const words = ['AI Films', 'Visual Stories', 'Future Cinema', 'Neural Narratives', 'Digital Dreams'];
  let wi = 0, ci = 0, deleting = false;
  const speed = { type: 90, delete: 50, pause: 2000 };

  function tick() {
    const word = words[wi];
    if (!deleting) {
      typer.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, speed.pause); return; }
    } else {
      typer.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }
  tick();
}

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  (function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  })(start);
}

// ── SCROLL REVEAL + COUNTERS ───────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      // trigger counters inside
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stat-item').forEach(el => io.observe(el));

// Also observe individual counters
const counterIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterIo.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterIo.observe(el));

// ── PORTFOLIO FILTER ───────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card[data-category]');

if (filterBtns.length && portfolioCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = match ? '1' : '0.2';
        card.style.transform = match ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

// ── MAGNETIC BUTTONS ───────────────────────────────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── SMOOTH PAGE TRANSITION ─────────────────────────────────────
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.3s';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  }
});

// ── PAGE ENTER ─────────────────────────────────────────────────
document.body.style.opacity = '0';
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  });
});
