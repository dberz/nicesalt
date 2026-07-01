const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const header = document.querySelector("[data-header]");
if (header) {
  const setHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });
}

// Mobile nav toggle
const navToggle = document.querySelector("[data-nav-toggle]");
const primaryNav = document.querySelector("[data-nav]");
if (navToggle && primaryNav) {
  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  };
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    primaryNav.classList.toggle("is-open", !open);
  });
  primaryNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
}

// Contact form: give clicking "Send inquiry" a visible loading state instead
// of appearing to do nothing during the round trip to formsubmit.co
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", () => {
    const submitBtn = contactForm.querySelector("button[type='submit']");
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
    }
  });
}

function initHeroSaltField(canvas) {
  const ctx = canvas.getContext("2d");
  const host = canvas.closest("[data-hero-field]") || canvas.parentElement;
  const colors = {
    ink: "22,58,47",
    sage: "135,149,129",
    teal: "83,139,132",
    blue: "79,107,113",
    paper: "250,248,243",
    line: "187,193,178",
    coral: "176,84,50",
    stone: "210,208,198"
  };

  let w = 0, h = 0, dpr = 1, raf = 0, start = performance.now();
  let cols = 0, colW = 4, base = 0, emitted = 0, maxEmit = 0;
  let pile = new Float32Array(0);
  let particles = [];
  let chips = [];
  let pointerX = 0, pointerY = 0, pointerLive = false;

  const rgba = (rgb, alpha) => `rgba(${rgb},${alpha})`;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const surfaceAt = (x) => {
    if (!pile.length) return base;
    const index = clamp(Math.round(x / colW), 0, cols - 1);
    return base - pile[index];
  };

  function setup() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = h * 0.82;
    colW = Math.max(3.5, w / 260);
    cols = Math.ceil(w / colW) + 1;
    pile = new Float32Array(cols);
    particles = [];
    chips = [];
    emitted = 0;
    maxEmit = Math.round(w * 1.5);
    pointerX = w * 0.72;
    pointerY = h * 0.52;

    const center = w * 0.73;
    const spread = w * 0.24;
    for (let i = 0; i < cols; i += 1) {
      const x = i * colW;
      const distance = Math.abs(x - center) / spread;
      if (distance < 1) pile[i] = Math.pow(1 - distance, 2.25) * h * 0.16;
    }

    for (let i = 0; i < 12; i += 1) {
      const pct = 0.54 + i * 0.035 + (i % 3) * 0.012;
      chips.push({
        x: pct,
        lift: 6 + (i % 4) * 8,
        size: 5 + (i % 5),
        tone: [colors.paper, colors.sage, colors.blue, colors.coral][i % 4],
        angle: -0.7 + i * 0.23
      });
    }
  }

  function addParticle(force = false) {
    if (!force && emitted > maxEmit && Math.random() > 0.08) return;
    emitted += 1;
    const originX = w * 0.68 + Math.sin((performance.now() - start) * 0.0014) * w * 0.035;
    particles.push({
      x: originX + (Math.random() - 0.5) * 46,
      y: h * 0.08 + Math.random() * 18,
      vx: (Math.random() - 0.48) * 0.55,
      vy: 0.65 + Math.random() * 0.9,
      size: 1.7 + Math.random() * 2.5,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 0.08,
      tone: Math.random() > 0.88 ? [colors.teal, colors.blue, colors.coral][Math.floor(Math.random() * 3)] : colors.paper
    });
  }

  function settleParticle(p) {
    const index = clamp(Math.round(p.x / colW), 2, cols - 3);
    pile[index] += p.size * (0.92 + Math.random() * 0.34);
    if (Math.random() > 0.35) pile[index - 1] += p.size * 0.28;
    if (Math.random() > 0.35) pile[index + 1] += p.size * 0.28;
  }

  function relaxPile() {
    for (let pass = 0; pass < 2; pass += 1) {
      for (let i = 1; i < cols - 1; i += 1) {
        const leftDiff = pile[i] - pile[i - 1];
        const rightDiff = pile[i] - pile[i + 1];
        if (leftDiff > 4.8) {
          const move = leftDiff * 0.18;
          pile[i] -= move;
          pile[i - 1] += move;
        }
        if (rightDiff > 4.8) {
          const move = rightDiff * 0.18;
          pile[i] -= move;
          pile[i + 1] += move;
        }
      }
    }
  }

  function drawDiamond(cx, cy, size, angle, rgb, alpha = 0.82) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = rgba(rgb, alpha);
    ctx.strokeStyle = rgba(colors.ink, 0.1);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.72, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.72, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = rgba(colors.paper, 0.58);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.72, 0);
    ctx.lineTo(size * 0.72, 0);
    ctx.stroke();
    ctx.restore();
  }

  function drawMound() {
    const startIndex = Math.floor(cols * 0.43);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startIndex * colW, base + 28);
    for (let i = startIndex; i < cols; i += 2) {
      ctx.lineTo(i * colW, base - pile[i]);
    }
    ctx.lineTo(w + 24, base + 34);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(w * 0.54, base - h * 0.2, w, base + h * 0.08);
    gradient.addColorStop(0, rgba(colors.paper, 0.92));
    gradient.addColorStop(0.45, rgba(colors.line, 0.4));
    gradient.addColorStop(1, rgba(colors.sage, 0.23));
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.clip();
    ctx.fillStyle = rgba(colors.sage, 0.11);
    ctx.beginPath();
    ctx.moveTo(w * 0.55, base + 40);
    ctx.lineTo(w * 0.74, base - h * 0.16);
    ctx.lineTo(w * 0.96, base + 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(colors.blue, 0.08);
    ctx.beginPath();
    ctx.moveTo(w * 0.68, base + 40);
    ctx.lineTo(w * 0.84, base - h * 0.1);
    ctx.lineTo(w * 1.02, base + 40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = rgba(colors.ink, 0.18);
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = startIndex; i < cols; i += 5) {
      const x = i * colW;
      const y = base - pile[i];
      if (i === startIndex) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    const t = (performance.now() - start) / 1000;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    const glow = ctx.createRadialGradient(w * 0.73, h * 0.56, 20, w * 0.73, h * 0.56, Math.max(280, w * 0.28));
    glow.addColorStop(0, rgba(colors.sage, 0.14));
    glow.addColorStop(1, rgba(colors.sage, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(w * 0.42, h * 0.08, w * 0.62, h * 0.84);
    ctx.restore();

    if (!reducedMotion) {
      const rate = emitted < maxEmit ? 6 : 2;
      for (let i = 0; i < rate; i += 1) addParticle();
    }

    particles = particles.filter((p) => {
      const wind = Math.sin(t * 0.9 + p.y * 0.02) * 0.012;
      p.vx += wind;
      p.vy += 0.038;
      if (pointerLive) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < 92) {
          const push = (92 - distance) / 92;
          p.vx += (dx / distance) * push * 0.16;
          p.vy += (dy / distance) * push * 0.08;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.spinSpeed;

      if (p.x < w * 0.42 || p.x > w + 24 || p.y > h + 30) return false;
      if (p.y + p.size >= surfaceAt(p.x)) {
        settleParticle(p);
        return false;
      }
      return true;
    });

    relaxPile();
    drawMound();

    ctx.save();
    ctx.lineWidth = 1;
    for (const chip of chips) {
      const x = chip.x * w;
      const y = surfaceAt(x) - chip.lift;
      if (y < base - 3) drawDiamond(x, y, chip.size, chip.angle + Math.sin(t * 0.55 + x) * 0.04, chip.tone, 0.58);
    }
    for (const p of particles) {
      drawDiamond(p.x, p.y, p.size, p.spin, p.tone, p.tone === colors.paper ? 0.82 : 0.7);
    }
    ctx.restore();

    if (!reducedMotion) raf = requestAnimationFrame(draw);
  }

  const onMove = (event) => {
    if (!finePointer) return;
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    pointerLive = true;
  };

  setup();
  if (reducedMotion) {
    for (let i = 0; i < 160; i += 1) addParticle(true);
    for (let i = 0; i < 120; i += 1) {
      particles.forEach((p) => {
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y + p.size >= surfaceAt(p.x)) settleParticle(p);
      });
      particles = particles.filter((p) => p.y + p.size < surfaceAt(p.x));
      relaxPile();
    }
  }
  draw();
  host.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerleave", () => { pointerLive = false; });
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    setup();
    draw();
  }, { passive: true });
}

const heroSaltCanvas = document.querySelector("[data-hero-salt]");
if (heroSaltCanvas) initHeroSaltField(heroSaltCanvas);

const nextMove = document.querySelector("[data-next-move]");
const projectType = document.querySelector("[data-project-type]");
const message = document.querySelector("[data-message]");

if (nextMove && projectType && message) {
  const choices = Array.from(nextMove.querySelectorAll(".next-choice"));
  const choose = (choice) => {
    choices.forEach((item) => item.setAttribute("aria-pressed", String(item === choice)));
    projectType.value = choice.dataset.projectType || projectType.value;
    if (!message.value.trim()) {
      message.value = choice.dataset.message || "";
    }
  };

  choices.forEach((choice, index) => {
    choice.addEventListener("click", () => choose(choice));
    if (index === 0) choose(choice);
  });
}

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
}
