const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const saveData = Boolean(connection && connection.saveData);
const lowCoreDevice =
  typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
const lowMemoryDevice =
  typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
const liteHero = reducedMotion || reducedData || saveData || lowCoreDevice || lowMemoryDevice;

if (liteHero) {
  document.documentElement.classList.add("is-lite-hero");
}

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
  const animateHero = !liteHero;
  const colors = {
    ink: "22,58,47",
    pale: "225,226,218",
    teal: "98,151,140",
    blue: "93,124,136",
    paper: "250,248,243",
    coral: "192,118,76",
    stone: "157,165,153"
  };

  let w = 0, h = 0, dpr = 1, raf = 0, start = performance.now();
  let cols = 0, colW = 4, base = 0, emitted = 0, maxEmit = 0;
  let pile = new Float32Array(0);
  let particles = [];
  let dust = [];
  let chips = [];
  let pointerX = 0, pointerY = 0, pointerLive = false;

  const rgba = (rgb, alpha) => `rgba(${rgb},${alpha})`;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Gaussian-ish random, cheap: average of three uniforms
  const gauss = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;

  // The dune field spans the whole hero; fade only the last few percent so
  // nothing presents a hard cut against the canvas boundary.
  const edgeFade = (x) =>
    smoothstep(0, w * 0.04, x) * (1 - smoothstep(w * 0.96, w, x));

  const heightAt = (i) => pile[i] * edgeFade(i * colW);
  const surfaceAt = (x) => {
    if (!pile.length) return base;
    const index = clamp(Math.round(x / colW), 0, cols - 1);
    return base - heightAt(index);
  };
  const slopeAt = (x) => {
    const index = clamp(Math.round(x / colW), 1, cols - 2);
    return (heightAt(index + 1) - heightAt(index - 1)) / (2 * colW);
  };

  function setup() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Baseline sits at 82% height, but never above the bottom of the hero
    // CTAs — the pile's ground line must not run through the buttons.
    base = h * 0.82;
    const actions = host.querySelector(".hero-actions");
    if (actions) {
      const actionsBottom =
        actions.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
      base = Math.min(h - 24, Math.max(base, actionsBottom + 56));
    }
    colW = Math.max(3.5, w / 260);
    cols = Math.ceil(w / colW) + 1;
    pile = new Float32Array(cols);
    particles = [];
    dust = [];
    chips = [];
    emitted = 0;
    maxEmit = Math.round(w * 1.5);
    pointerX = w * 0.72;
    pointerY = h * 0.52;

    // Rolling dunes across the full hero width — the pour keeps the main
    // dune alive; the others read as settled ground.
    const dunes = [
      { c: 0.7, s: 0.22, k: 0.17, e: 2.4 }, // the pour peak
      { c: 0.4, s: 0.26, k: 0.05, e: 2 },
      { c: 0.14, s: 0.2, k: 0.035, e: 2 },
      { c: 0.96, s: 0.18, k: 0.05, e: 2 }
    ];
    for (let i = 0; i < cols; i += 1) {
      const x = i * colW;
      let height = 0;
      for (const dune of dunes) {
        const distance = Math.abs(x - w * dune.c) / (w * dune.s);
        if (distance < 1) height += Math.pow(1 - distance, dune.e) * h * dune.k;
      }
      pile[i] = height;
    }

    const chipSpots = [0.14, 0.3, 0.44, 0.58, 0.68, 0.78, 0.88];
    for (let i = 0; i < chipSpots.length; i += 1) {
      chips.push({
        x: chipSpots[i],
        lift: 2 + (i % 4) * 4,
        size: 4 + (i % 4),
        angle: -0.7 + i * 0.23
      });
    }
  }

  function addParticle(force = false) {
    if (!force && emitted > maxEmit && Math.random() > 0.08) return;
    emitted += 1;
    // The pour stays concentrated around one spot (small slow drift plus a
    // faster sway) so a peak builds where the salt lands, while overflow
    // rolls out into the wider field.
    const elapsed = performance.now() - start;
    const originX =
      w * (0.7 + Math.sin(elapsed * 0.00016) * 0.05) +
      Math.sin(elapsed * 0.0014) * w * 0.02;
    // A pour is a tight column with the occasional stray grain, not a cloud.
    const stray = Math.random() < 0.07;
    const offset = stray ? (Math.random() - 0.5) * 90 : gauss() * 16;
    particles.push({
      x: originX + offset,
      y: h * 0.08 + Math.random() * 14,
      vx: stray ? (Math.random() - 0.5) * 0.9 : gauss() * 0.3,
      vy: 0.65 + Math.random() * 0.9,
      size: 1.7 + Math.random() * 2.5,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 0.08,
      bounced: false,
      tone: Math.random() > 0.86 ? [colors.pale, colors.teal, colors.blue, colors.stone][Math.floor(Math.random() * 4)] : colors.paper
    });
  }

  function addDust(x, y, energy) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i += 1) {
      dust.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y - Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.9 * energy,
        vy: -(0.2 + Math.random() * 0.5) * energy,
        size: 0.6 + Math.random() * 0.9,
        life: 1
      });
    }
  }

  function settleParticle(p) {
    // Grains landing on a full column roll downhill until they find room —
    // the dune field has a height ceiling, so it can never pyramid.
    const capH = h * 0.3;
    let index = clamp(Math.round(p.x / colW), 2, cols - 3);
    let guard = 0;
    while (pile[index] > capH && guard < 30) {
      index = clamp(index + (pile[index - 1] <= pile[index + 1] ? -1 : 1), 2, cols - 3);
      guard += 1;
    }
    pile[index] += p.size * (0.92 + Math.random() * 0.34);
    if (Math.random() > 0.35) pile[index - 1] += p.size * 0.28;
    if (Math.random() > 0.35) pile[index + 1] += p.size * 0.28;
  }

  function relaxPile() {
    // Gentler angle of repose: dunes spread wide instead of spiking.
    for (let pass = 0; pass < 3; pass += 1) {
      for (let i = 1; i < cols - 1; i += 1) {
        const leftDiff = pile[i] - pile[i - 1];
        const rightDiff = pile[i] - pile[i + 1];
        if (leftDiff > 3.3) {
          const move = leftDiff * 0.2;
          pile[i] -= move;
          pile[i - 1] += move;
        }
        if (rightDiff > 3.3) {
          const move = rightDiff * 0.2;
          pile[i] -= move;
          pile[i + 1] += move;
        }
      }
    }
    // Slow compaction: continuous pour reaches equilibrium instead of
    // growing forever.
    for (let i = 0; i < cols; i += 1) pile[i] *= 0.99985;
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

  // The brand crystal: same rhombus, four flat facets (pale/teal/blue/stone)
  // with paper seams — matches SaltMark.astro and the site icon set.
  function drawCrystal(cx, cy, size, angle, alpha = 0.55) {
    const sw = size * 0.72;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    const facets = [
      [[0, -size], [-sw, 0], "225,226,218"],
      [[0, -size], [sw, 0], "98,151,140"],
      [[0, size], [sw, 0], "93,124,136"],
      [[0, size], [-sw, 0], "157,165,153"]
    ];
    for (const [tip, side, tone] of facets) {
      ctx.fillStyle = rgba(tone, 1);
      ctx.beginPath();
      ctx.moveTo(tip[0], tip[1]);
      ctx.lineTo(side[0], side[1]);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = rgba(colors.paper, 0.7);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-sw, 0);
    ctx.lineTo(sw, 0);
    ctx.stroke();
    ctx.strokeStyle = rgba(colors.ink, 0.16);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(sw, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-sw, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // Build a lightly smoothed list of visible surface points (skips flat ground).
  function surfacePoints() {
    const pts = [];
    for (let i = 0; i < cols; i += 2) {
      const prev = heightAt(Math.max(0, i - 2));
      const next = heightAt(Math.min(cols - 1, i + 2));
      const height = (prev + heightAt(i) * 2 + next) / 4;
      pts.push({ x: i * colW, y: base - height, height });
    }
    return pts;
  }

  function tracePath(pts, from, to) {
    ctx.moveTo(pts[from].x, pts[from].y);
    for (let i = from + 1; i < to; i += 1) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    ctx.lineTo(pts[to].x, pts[to].y);
  }

  function drawMound() {
    const pts = surfacePoints();
    let first = -1;
    let last = -1;
    for (let i = 0; i < pts.length; i += 1) {
      if (pts[i].height > 0.5) {
        if (first === -1) first = i;
        last = i;
      }
    }
    if (first === -1 || last - first < 2) return;
    first = Math.max(0, first - 1);
    last = Math.min(pts.length - 1, last + 1);

    ctx.save();
    ctx.beginPath();
    tracePath(pts, first, last);
    ctx.lineTo(pts[last].x, base + 4);
    ctx.lineTo(pts[first].x, base + 4);
    ctx.closePath();

    ctx.fillStyle = rgba(colors.pale, 0.58);
    ctx.fill();

    ctx.clip();
    ctx.fillStyle = rgba(colors.teal, 0.12);
    ctx.beginPath();
    ctx.moveTo(w * 0.55, base + 4);
    ctx.lineTo(w * 0.74, base - h * 0.16);
    ctx.lineTo(w * 0.96, base + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(colors.blue, 0.1);
    ctx.beginPath();
    ctx.moveTo(w * 0.68, base + 4);
    ctx.lineTo(w * 0.84, base - h * 0.1);
    ctx.lineTo(w * 1.02, base + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(colors.stone, 0.12);
    ctx.beginPath();
    ctx.moveTo(w * 0.48, base + 4);
    ctx.lineTo(w * 0.68, base - h * 0.12);
    ctx.lineTo(w * 0.78, base + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(colors.stone, 0.1);
    ctx.beginPath();
    ctx.moveTo(w * 0.02, base + 4);
    ctx.lineTo(w * 0.16, base - h * 0.05);
    ctx.lineTo(w * 0.34, base + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgba(colors.teal, 0.07);
    ctx.beginPath();
    ctx.moveTo(w * 0.28, base + 4);
    ctx.lineTo(w * 0.42, base - h * 0.06);
    ctx.lineTo(w * 0.56, base + 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Crest line — only along the visible mound, softly faded at the ends.
    ctx.save();
    ctx.strokeStyle = rgba(colors.ink, 0.16);
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";
    let strokeFirst = first;
    let strokeLast = last;
    while (strokeFirst < last && pts[strokeFirst].height < 3) strokeFirst += 1;
    while (strokeLast > first && pts[strokeLast].height < 3) strokeLast -= 1;
    if (strokeLast - strokeFirst > 2) {
      ctx.beginPath();
      tracePath(pts, strokeFirst, strokeLast);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    const t = (performance.now() - start) / 1000;
    ctx.clearRect(0, 0, w, h);

    if (animateHero) {
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

      if (p.x < -24 || p.x > w + 24 || p.y > h + 30) return false;
      if (p.y + p.size >= surfaceAt(p.x)) {
        // Larger grains sometimes bounce once and roll downslope before settling.
        if (!p.bounced && p.size > 2.4 && Math.random() < 0.45 && p.vy > 1.4) {
          p.bounced = true;
          p.y = surfaceAt(p.x) - p.size;
          p.vy = -p.vy * (0.22 + Math.random() * 0.12);
          p.vx = p.vx * 0.4 + slopeAt(p.x) * -1.4 + (Math.random() - 0.5) * 0.3;
          p.spinSpeed *= 1.6;
          if (Math.random() < 0.5) addDust(p.x, p.y + p.size, 0.7);
          return true;
        }
        settleParticle(p);
        if (Math.random() < 0.16) addDust(p.x, surfaceAt(p.x), Math.min(1.2, p.vy * 0.35));
        return false;
      }
      return true;
    });

    dust = dust.filter((d) => {
      d.life -= 0.03;
      if (d.life <= 0) return false;
      d.vy += 0.008;
      d.x += d.vx;
      d.y += d.vy;
      return true;
    });

    relaxPile();
    drawMound();

    ctx.save();
    for (const d of dust) {
      drawDiamond(d.x, d.y, d.size, 0.78, colors.stone, 0.42 * d.life);
    }
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 1;
    for (const chip of chips) {
      const x = chip.x * w;
      const surface = surfaceAt(x);
      if (base - surface > 8) {
        drawCrystal(x, surface - chip.lift, chip.size, chip.angle + Math.sin(t * 0.55 + x) * 0.04, 0.55);
      }
    }
    for (const p of particles) {
      drawDiamond(p.x, p.y, p.size, p.spin, p.tone, p.tone === colors.paper ? 0.82 : 0.7);
    }
    ctx.restore();

    if (animateHero) raf = requestAnimationFrame(draw);
  }

  const onMove = (event) => {
    if (!finePointer) return;
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    pointerLive = true;
  };

  function settleStaticField() {
    const grains = reducedMotion ? 160 : 90;
    const frames = reducedMotion ? 120 : 72;
    for (let i = 0; i < grains; i += 1) addParticle(true);
    for (let i = 0; i < frames; i += 1) {
      particles.forEach((p) => {
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y + p.size >= surfaceAt(p.x)) settleParticle(p);
      });
      particles = particles.filter((p) => p.y + p.size < surfaceAt(p.x));
      relaxPile();
    }
    dust = [];
  }

  setup();
  if (liteHero) settleStaticField();
  draw();
  if (animateHero) {
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", () => { pointerLive = false; });
  }
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    setup();
    if (liteHero) settleStaticField();
    draw();
  }, { passive: true });
}

const heroSaltCanvas = document.querySelector("[data-hero-salt]");
if (heroSaltCanvas) initHeroSaltField(heroSaltCanvas);

const nextMove = document.querySelector("[data-next-move]");
const inquiryForm = document.querySelector("[data-inquiry-form]");
const projectType = inquiryForm ? inquiryForm.querySelector("select[name='project_type']") : null;
const message = inquiryForm ? inquiryForm.querySelector("textarea[name='message']") : null;

if (nextMove && projectType && message) {
  const choices = Array.from(nextMove.querySelectorAll(".next-choice"));
  const followup = document.querySelector("[data-next-followup] span");

  const choose = (choice, announce) => {
    choices.forEach((item) => item.setAttribute("aria-pressed", String(item === choice)));

    const suggestedProjectType = choice.dataset.projectType || "";
    const suggestedMessage = choice.dataset.message || "";
    const previousSuggestedMessage = message.dataset.suggestedMessage || "";
    const messageWasUntouched =
      !message.value.trim() || message.value === previousSuggestedMessage;

    if (suggestedProjectType) {
      projectType.value = suggestedProjectType;
    }

    if (messageWasUntouched && suggestedMessage) {
      message.value = suggestedMessage;
      message.dataset.suggestedMessage = suggestedMessage;
    }

    if (followup && announce) {
      const title = choice.querySelector("strong");
      followup.textContent = `“${title ? title.textContent : ""}” it is.`;
    }
  };

  choices.forEach((choice, index) => {
    choice.addEventListener("click", () => choose(choice, true));
    if (index === 0) choose(choice, false);
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
