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
  const duration = 900;
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

// ── EMAIL DECODE (base64 anti-scrape) ──────────────────────────
// Email is stored encoded to prevent automated harvesting.
// Decoded at runtime by the browser — no server needed.
(function() {
  var _e = atob('b2ZmaWNlQHZpc3VhbG5lcmRzLmNvbQ==');
  document.querySelectorAll('a[data-email]').forEach(function(el) {
    el.href = 'mailto:' + _e;
    if (el.getAttribute('data-email') === 'text') el.textContent = _e;
  });
})();

// ── SMOOTH PAGE TRANSITION ─────────────────────────────────────
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.12s';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 120);
    });
  }
});

// ── PAGE LOAD FADE IN ──────────────────────────────────────────
(function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

// ── SCROLL PROGRESS BAR ────────────────────────────────────────
(function() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px', 'width:0%',
    'background:linear-gradient(90deg,#FF2D88,#00C2FF)',
    'z-index:9999', 'transition:width 0.1s linear', 'pointer-events:none'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

// ── CURSOR GLOW ────────────────────────────────────────────────
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const dot = document.createElement('div');
  dot.id = 'cursor-glow';
  dot.style.cssText = [
    'position:fixed', 'pointer-events:none', 'z-index:9998',
    'width:320px', 'height:320px',
    'border-radius:50%',
    'background:radial-gradient(circle, rgba(255,45,136,0.06) 0%, transparent 70%)',
    'transform:translate(-50%,-50%)',
    'transition:opacity 0.3s',
    'opacity:0', 'top:0', 'left:0'
  ].join(';');
  document.body.appendChild(dot);

  let mx = 0, my = 0, cx = 0, cy = 0, visible = false;
  const noGlowSelectors = ['#reel', '.vn-reel__placeholder', '.vn-modal'];

  function isOverNoGlowZone(e) {
    return noGlowSelectors.some(sel => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right &&
             e.clientY >= r.top  && e.clientY <= r.bottom;
    });
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const hide = isOverNoGlowZone(e);
    dot.style.opacity = hide ? '0' : '1';
    visible = !hide;
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; visible = false;
  });

  (function loop() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
})();

// ── HERO PARALLAX ──────────────────────────────────────────────
(function() {
  const heroImg = document.querySelector('.vn-hero__img');
  if (!heroImg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();

// ── TOAST NOTIFICATION ─────────────────────────────────────────
function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = 'vn-toast vn-toast--' + (type || 'info');
  t.textContent = msg;
  t.style.cssText = [
    'position:fixed', 'bottom:32px', 'right:32px',
    'padding:14px 24px',
    'font-family:"Space Mono",monospace', 'font-size:0.78rem',
    'font-weight:700', 'letter-spacing:0.06em',
    'color:#fff', 'border-radius:4px',
    'z-index:9999', 'opacity:0',
    'transform:translateY(12px)',
    'transition:opacity 0.2s, transform 0.2s',
    'pointer-events:none',
    'background:' + (type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : '#1a1a1d'),
    'border:1px solid ' + (type === 'error' ? 'rgba(192,57,43,0.4)' : type === 'success' ? 'rgba(39,174,96,0.4)' : 'rgba(255,255,255,0.1)')
  ].join(';');
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
    setTimeout(() => t.remove(), 200);
  }, 3500);
}

// ── FORM VALIDATION ────────────────────────────────────────────
(function() {
  const forms = document.querySelectorAll('form');
  if (!forms.length) return;

  const rules = {
    name:    { min: 2,   msg: 'Please enter your name (at least 2 characters).' },
    email:   { regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: 'Please enter a valid email address.' },
    message: { min: 10,  msg: 'Please tell us a bit more (at least 10 characters).' },
  };

  function setFieldState(input, valid, msg) {
    let err = input.parentElement.querySelector('.vn-field-error');
    input.style.borderColor = valid ? 'rgba(39,174,96,0.6)' : 'rgba(192,57,43,0.7)';
    if (!valid) {
      if (!err) {
        err = document.createElement('p');
        err.className = 'vn-field-error';
        err.style.cssText = 'margin:4px 0 0;font-size:0.72rem;color:#e74c3c;font-family:"DM Sans",sans-serif;';
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
    } else if (err) {
      err.remove();
    }
    return valid;
  }

  function validateField(input) {
    const name = input.name;
    const val  = input.value.trim();
    if (!name || !rules[name]) return true;
    const rule = rules[name];
    if (rule.regex) return setFieldState(input, rule.regex.test(val), rule.msg);
    if (rule.min)   return setFieldState(input, val.length >= rule.min, rule.msg);
    return true;
  }

  forms.forEach(form => {
    // Live validation on blur
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.style.borderColor) validateField(input);
      });
    });

    // Character counter on textareas
    form.querySelectorAll('textarea').forEach(ta => {
      const max = 1000;
      const counter = document.createElement('p');
      counter.style.cssText = 'margin:4px 0 0;font-size:0.7rem;color:rgba(255,255,255,0.3);text-align:right;font-family:"Space Mono",monospace;';
      counter.textContent = '0 / ' + max;
      ta.parentElement.appendChild(counter);
      ta.addEventListener('input', () => {
        const len = ta.value.length;
        if (len > max) ta.value = ta.value.slice(0, max);
        counter.textContent = Math.min(len, max) + ' / ' + max;
        counter.style.color = len > max * 0.9 ? 'rgba(255,45,136,0.7)' : 'rgba(255,255,255,0.3)';
      });
    });

    // Submit validation
    form.addEventListener('submit', e => {
      let allValid = true;
      form.querySelectorAll('input[name], textarea[name]').forEach(input => {
        if (!validateField(input)) allValid = false;
      });
      if (!allValid) {
        e.preventDefault();
        showToast('Please fix the errors above.', 'error');
        const firstErr = form.querySelector('[style*="rgba(192"]');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      showToast('Opening your email client…', 'success');
    });
  });
})();

// ── RUNTIME ATTRIBUTE DECODER ──────────────────────────────────
// Sensitive values (Vimeo IDs, URLs, etc.) are stored base64-encoded
// in data-*-enc attributes and decoded at runtime so they never appear
// in plain HTML source.
//
// Usage in HTML:
//   data-vimeo-enc="BASE64_ENCODED_VIMEO_ID"
//   data-src-enc="BASE64_ENCODED_URL"
//   ... any data-*-enc attribute works.
//
// To encode a value:  btoa('your_vimeo_id_here')
// To decode manually: atob('encoded_string')
//
(function() {
  document.querySelectorAll('*').forEach(el => {
    const keys = Object.keys(el.dataset);
    keys.forEach(key => {
      if (!key.endsWith('Enc')) return;
      try {
        const decoded   = atob(el.dataset[key]);
        const targetKey = key.slice(0, -3); // strip 'Enc' suffix → real attribute name
        el.dataset[targetKey] = decoded;
        el.removeAttribute('data-' + key.replace(/([A-Z])/g, c => '-' + c.toLowerCase()));
      } catch (e) {
        // silently ignore malformed encoded values
      }
    });
  });
})();

// ── INPUT SANITISER ────────────────────────────────────────────
// Strips HTML tags and trims whitespace from a string.
function sanitise(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

// ── SPAM / BOT PROTECTION ──────────────────────────────────────
// 1. Honeypot: if the hidden "website" field is filled, silently reject.
// 2. Rate limit: block repeat submissions within 30 seconds.
// 3. Sanitise all inputs before building the mailto body.
(function() {
  const RATE_LIMIT_MS = 30000;
  const RATE_KEY = 'vn_last_submit';

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      // Honeypot check
      const honey = form.querySelector('input[name="website"]');
      if (honey && honey.value.trim() !== '') {
        e.preventDefault();
        // Silently succeed to fool bots
        showToast('Opening your email client…', 'success');
        return;
      }

      // Rate limiting
      const last = parseInt(sessionStorage.getItem(RATE_KEY) || '0', 10);
      if (Date.now() - last < RATE_LIMIT_MS) {
        e.preventDefault();
        const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
        showToast('Please wait ' + wait + 's before submitting again.', 'error');
        return;
      }

      // Sanitise inputs before the mailto builds
      form.querySelectorAll('input[name], textarea[name]').forEach(input => {
        if (input.name !== 'website') {
          input.value = sanitise(input.value);
        }
      });

      sessionStorage.setItem(RATE_KEY, Date.now().toString());
    }, true); // capture phase — runs before inline submit handlers
  });
})();

// ── LAZY IMAGE LOADING ─────────────────────────────────────────
(function() {
  const imgs = document.querySelectorAll('img[src]:not([loading])');
  imgs.forEach(img => {
    if (!img.closest('.vn-hero')) img.setAttribute('loading', 'lazy');
  });
})();

// ── FOCUS TRAP IN MOBILE MENU ──────────────────────────────────
(function() {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  const focusable = () => Array.from(menu.querySelectorAll('a, button'));

  document.addEventListener('keydown', e => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') {
      document.querySelector('.hamburger')?.click();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusable();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });
})();
