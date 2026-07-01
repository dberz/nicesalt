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

// Hero: salt pours in, settles into a wide mound, and ends with all the salt
// resting in the pile. The cursor pushes falling grains and carves the pile.
function initSaltPour(canvas) {
  const ctx = canvas.getContext("2d");
  const host = canvas.closest("[data-hero-field]") || canvas.parentElement;
  const INK = [22, 58, 47];
  const SAGE = [135, 149, 129];
  const TERRA = [176, 84, 50];
  const GRAVITY = 0.05;
  const hash = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const GRAIN = 2;
  const MAX_DIFF = GRAIN * 0.34; // angle of repose — small = wide, flat mound

  let w, h, dpr, cols, colW, base, pile, parts, remaining, emitX, emitDir, raf, idle;
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, t: -1e9 };
  const pointerActive = () => performance.now() - mouse.t < 220;

  const colAt = (x) => Math.max(0, Math.min(cols - 1, Math.floor(x / colW)));

  function setup() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.max(60, Math.floor(w / 5));
    colW = w / cols;
    base = h;
    pile = new Float32Array(cols);
    parts = [];
    remaining = Math.round(w * 2.2);
    emitX = w * 0.5;
    emitDir = 1;
    idle = 0;
  }

  function emit(n) {
    for (let i = 0; i < n && remaining > 0; i++) {
      remaining--;
      parts.push({
        x: emitX + (Math.random() - 0.5) * 60,
        y: -8 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 1.4 + Math.random() * 1.3,
        s: GRAIN * (0.7 + Math.random() * 0.7),
        a: 0.22 + Math.random() * 0.24,
        c: Math.random() < 0.09 ? TERRA : Math.random() < 0.3 ? SAGE : INK
      });
    }
  }

  function avalanche(passes) {
    for (let p = 0; p < passes; p++) {
      for (let c = 0; c < cols - 1; c++) {
        const d = pile[c] - pile[c + 1];
        if (d > MAX_DIFF) { const m = (d - MAX_DIFF) * 0.5; pile[c] -= m; pile[c + 1] += m; }
        else if (d < -MAX_DIFF) { const m = (-d - MAX_DIFF) * 0.5; pile[c] += m; pile[c + 1] -= m; }
      }
      for (let c = cols - 1; c > 0; c--) {
        const d = pile[c] - pile[c - 1];
        if (d > MAX_DIFF) { const m = (d - MAX_DIFF) * 0.5; pile[c] -= m; pile[c - 1] += m; }
      }
    }
  }

  // Drag through the pile: scoop salt near the cursor (more the deeper and
  // faster you go), push it into a berm ahead of the motion, and kick up spray.
  function interact() {
    if (!pointerActive()) return;
    const speed = Math.hypot(mouse.vx, mouse.vy);
    if (speed < 0.25) return;
    const cc = colAt(mouse.x);
    const rad = Math.max(4, Math.floor(52 / colW));
    let displaced = 0;
    for (let c = Math.max(0, cc - rad); c <= Math.min(cols - 1, cc + rad); c++) {
      const into = mouse.y - (base - pile[c] - 8); // how far below the surface
      if (into <= 0) continue;
      const f = 1 - Math.abs(c - cc) / rad;
      const k = f * f * (3 - 2 * f); // smoothstep falloff
      const depth = Math.min(1, into / 44);
      const amt = Math.min(pile[c], k * depth * (1.1 + speed * 0.5));
      pile[c] -= amt;
      displaced += amt;
    }
    if (displaced > 0) {
      const bias = Math.max(-1, Math.min(1, mouse.vx / 3)); // -1..1, push direction
      const leftShare = (1 - bias) / 2;
      const rightShare = (1 + bias) / 2;
      const band = 4;
      const norm = (band * (band + 1)) / 2;
      for (let i = 0; i < band; i++) {
        const wgt = (band - i) / norm;
        const li = cc - rad - 1 - i;
        const ri = cc + rad + 1 + i;
        if (li >= 0) pile[li] += displaced * leftShare * wgt;
        if (ri < cols) pile[ri] += displaced * rightShare * wgt;
      }
    }
    if (speed > 2.4 && Math.random() < 0.6) {
      parts.push({
        x: mouse.x,
        y: mouse.y - 2,
        vx: (Math.random() - 0.5) * 1.4 + mouse.vx * 0.25,
        vy: -1.2 - Math.random() * 1.8,
        s: GRAIN * (0.7 + Math.random() * 0.6),
        a: 0.28 + Math.random() * 0.2,
        c: Math.random() < 0.5 ? SAGE : INK
      });
    }
  }

  function step() {
    if (remaining > 0) {
      emitX += emitDir * 1.1;
      if (emitX > w * 0.58) emitDir = -1;
      if (emitX < w * 0.42) emitDir = 1;
      emit(8);
    }
    const active = pointerActive();
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (active) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { const d = Math.sqrt(d2) || 1, f = ((95 - d) / 95) * 1.8; if (f > 0) { p.vx += (dx / d) * f; p.vy += (dy / d) * f; } }
      }
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -0.4; }
      if (p.x > w) { p.x = w; p.vx *= -0.4; }
      const c = colAt(p.x);
      if (p.y >= base - pile[c] - p.s) { pile[c] += p.s * 0.9; parts.splice(i, 1); }
    }
    mouse.vx *= 0.82;
    mouse.vy *= 0.82;
    interact();
    avalanche(3);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    let peak = 0, peakC = 0;
    for (let c = 0; c < cols; c++) if (pile[c] > peak) { peak = pile[c]; peakC = c; }

    // body — a pale, sage-tinted fill (brand palette, not literal grey sand)
    // pulled a shade brighter than the paper background so the mound reads
    // as a distinct, deliberate shape rather than a texture blending into it.
    const bodyPath = new Path2D();
    bodyPath.moveTo(0, h);
    for (let c = 0; c < cols; c++) bodyPath.lineTo(c * colW, base - pile[c]);
    bodyPath.lineTo(w, h);
    bodyPath.closePath();

    const grad = ctx.createLinearGradient(0, base - peak - 4, 0, base);
    grad.addColorStop(0, "rgba(255,253,248,0.98)");
    grad.addColorStop(0.55, "rgba(228,229,210,0.96)");
    grad.addColorStop(1, "rgba(178,186,164,0.96)");
    ctx.fillStyle = grad;
    ctx.fill(bodyPath);

    // a crisp ink outline around the whole silhouette — same treatment as
    // the crystalline glyphs (cg-panel), so the mound reads as one flat,
    // deliberate shape instead of a naturalistic texture.
    ctx.strokeStyle = "rgba(22,58,47,0.16)";
    ctx.lineWidth = 1.3;
    ctx.stroke(bodyPath);

    // sparse flecks — a few warm accent grains instead of dense dust, kept
    // close to the brand palette (terracotta / gold) rather than plain grey
    for (let c = 0; c < cols; c += 3) {
      if (pile[c] < 3) continue;
      const h1 = hash(c * 3), h2 = hash(c * 7 + 31), h3 = hash(c + 13);
      if (h3 > 0.16) continue;
      const topY = base - pile[c];
      const depth = h2 * Math.min(12, pile[c]);
      const gx = c * colW + (h1 - 0.4) * colW * 2.2;
      const gy = topY + depth;
      const sz = 1.4 + h3 * 6;
      const op = Math.max(0.35, 1 - depth / 16);
      const col = h3 < 0.08 ? "176,84,50" : "198,169,76";
      ctx.fillStyle = `rgba(${col},${op.toFixed(2)})`;
      ctx.fillRect(gx, gy, sz, sz);
    }

    // faceted accents — small crystalline chips echoing the CrystallineGlyph
    // planes. Positioned relative to the mound's actual footprint (not the
    // full canvas width) so they land on the slope regardless of pile size.
    let minC = -1, maxC = -1;
    for (let c = 0; c < cols; c++) {
      if (pile[c] > peak * 0.12) { if (minC < 0) minC = c; maxC = c; }
    }
    if (minC >= 0 && maxC > minC) {
      const span = maxC - minC;
      const facets = [
        { at: 0.22, color: "47,120,111", size: 13 },
        { at: 0.5, color: "79,107,113", size: 17 },
        { at: 0.76, color: "176,84,50", size: 13 }
      ];
      for (const f of facets) {
        const c = Math.min(cols - 1, Math.round(minC + span * f.at));
        if (pile[c] < peak * 0.3) continue;
        const cx = c * colW, cy = base - pile[c] - f.size * 0.32;
        const s = f.size;
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 0.5);
        ctx.lineTo(cx + s * 0.5, cy);
        ctx.lineTo(cx, cy + s * 0.5);
        ctx.lineTo(cx - s * 0.5, cy);
        ctx.closePath();
        ctx.fillStyle = `rgba(${f.color},0.85)`;
        ctx.fill();
        ctx.strokeStyle = "rgba(250,248,243,0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // rim light along the crest
    ctx.beginPath();
    let started = false;
    for (let c = 0; c < cols; c++) {
      if (pile[c] < 1) { started = false; continue; }
      const x = c * colW, y = base - pile[c];
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,251,242,0.85)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // a few twinkling sparkles
    const t = performance.now() / 1000;
    for (let c = 6; c < cols; c += 19) {
      if (pile[c] < 8) continue;
      const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.6 + c));
      ctx.fillStyle = `rgba(255,251,242,${a.toFixed(2)})`;
      ctx.fillRect(c * colW, base - pile[c] + 1, 1.8, 1.8);
    }

    // falling grains
    for (const p of parts) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(0.78);
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    }
  }

  function loop() {
    step();
    draw();
    const busy = remaining > 0 || parts.length > 0 || pointerActive();
    if (busy) { idle = 0; raf = requestAnimationFrame(loop); }
    else if (idle < 60) { idle++; raf = requestAnimationFrame(loop); }
    else { raf = 0; }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const nx = e.clientX - r.left;
    const ny = e.clientY - r.top;
    if (mouse.t > 0) { mouse.vx = nx - mouse.x; mouse.vy = ny - mouse.y; }
    mouse.x = nx;
    mouse.y = ny;
    mouse.t = performance.now();
    kick();
  };
  host.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerdown", onMove, { passive: true });
  host.addEventListener("pointerleave", () => { mouse.t = -1e9; mouse.vx = 0; mouse.vy = 0; });

  setup();
  if (reducedMotion) {
    let guard = 0;
    while ((remaining > 0 || parts.length > 0) && guard < 8000) { step(); guard++; }
    avalanche(400);
    draw();
    return;
  }
  let sized = false;
  const ensure = () => { if (!sized || !w) { setup(); sized = true; } };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { ensure(); kick(); } }), { threshold: 0.02 }).observe(canvas);
  } else {
    ensure();
    kick();
  }
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { setup(); kick(); }, 200); }, { passive: true });
}

const saltCanvas = document.querySelector("[data-salt]");
if (saltCanvas) initSaltPour(saltCanvas);

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
