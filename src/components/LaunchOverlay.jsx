import { useEffect, useRef, useState } from 'react';

export default function LaunchOverlay({ title = "Your Studio Name", subtitle = "Art Classes" }) {
  const canvasRef = useRef(null);
  const celebCanvasRef = useRef(null);
  const celebRafRef = useRef(null);
  const [textVisible, setTextVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [canvasFading, setCanvasFading] = useState(false);
  const firedRef = useRef(false);

  /* ---------- intro brushstroke animation (ink on black) ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width > 0 ? rect.width : window.innerWidth;
      canvas.height = rect.height > 0 ? rect.height : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // grayscale "ink wash" strokes on a black canvas
    const strokes = [
      { x: 0.0,  y: 0.18, w: 0.55, h: 0.22, color: '#E8E8E8', angle: -2,   delay: 0   },
      { x: 0.4,  y: 0.05, w: 0.65, h: 0.18, color: '#BDBDBD', angle: 1.5,  delay: 120 },
      { x: 0.0,  y: 0.72, w: 0.50, h: 0.20, color: '#F5F5F5', angle: -1,   delay: 80  },
      { x: 0.45, y: 0.80, w: 0.60, h: 0.16, color: '#8A8A8A', angle: 2,    delay: 200 },
      { x: 0.15, y: 0.42, w: 0.20, h: 0.14, color: '#D6D6D6', angle: -3,   delay: 300 },
      { x: 0.72, y: 0.38, w: 0.30, h: 0.12, color: '#A8A8A8', angle: 1,    delay: 350 },
    ];

    const progress = strokes.map(() => 0);
    let startTime = null;
    let textDone = false;
    let rafId;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const drawStroke = (s, p) => {
      const W = canvas.width, H = canvas.height;
      ctx.save();
      ctx.translate(s.x * W, s.y * H);
      ctx.rotate(s.angle * Math.PI / 180);
      const maxW = s.w * W, h = s.h * H;
      const grad = ctx.createLinearGradient(0, 0, maxW * p, 0);
      grad.addColorStop(0, s.color + '66');
      grad.addColorStop(0.6, s.color + '3a');
      grad.addColorStop(1, s.color + '12');
      ctx.beginPath();
      const wobble = h * 0.15;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        maxW * p * 0.3, -h * 0.2 + wobble * Math.sin(p * 4),
        maxW * p * 0.6, -h * 0.1,
        maxW * p, h * 0.05
      );
      ctx.bezierCurveTo(
        maxW * p * 0.8, h * 0.9,
        maxW * p * 0.3, h,
        0, h * 0.7
      );
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.restore();
    };

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      strokes.forEach((s, i) => {
        const t = Math.max(0, (elapsed - s.delay) / 800);
        progress[i] = Math.min(1, easeOut(t));
        if (progress[i] > 0) drawStroke(s, progress[i]);
      });

      const allDone = progress.every(p => p >= 1);
      if (allDone && !textDone) {
        textDone = true;
        setTextVisible(true);
        setTimeout(() => setBtnVisible(true), 700);
      }
      if (!allDone) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ---------- popper-style paint celebration (colorful) ---------- */
  const firePaintCelebration = (onDone) => {
    const canvas = celebCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Measure robustly — fall back to the viewport if layout reports 0.
    const rect = canvas.getBoundingClientRect();
    const W = rect.width > 0 ? rect.width : window.innerWidth;
    const H = rect.height > 0 ? rect.height : window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // vivid palette tuned to pop against the black background
    const COLORS = [
      '#FF6B35', '#FFD23F', '#3BCEAC', '#4EA8FF', '#FF5D8F',
      '#B07CFF', '#7CFF6B', '#FF9F1C', '#00E5FF', '#F9F871',
    ];
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    /* Paint drop: flies, falls, splats on the floor */
    class Drop {
      constructor(x, y, baseAngle, spread, power) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = power * (0.45 + Math.random() * 0.75);
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.42 + Math.random() * 0.2;
        this.color = pick();
        this.radius = 4 + Math.random() * 14;
        this.alpha = 1;
        this.splat = false;
        this.splatY = 0;
        this.splatBlobs = null;
        this.trail = [];
        this.wobble = (Math.random() - 0.5) * 0.25;
        this.alive = true;
      }

      update() {
        if (this.splat) {
          this.alpha -= 0.02;
          if (this.alpha <= 0) this.alive = false;
          return;
        }
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 6) this.trail.shift();
        this.vx += this.wobble;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y + this.radius > H - 10) {
          this.y = H - 10 - this.radius;
          this.splat = true;
          this.splatY = this.y;
          this.splatBlobs = Array.from({ length: 5 }, () => ({
            dx: (Math.random() - 0.5) * this.radius * 3.5,
            dy: (Math.random() - 0.5) * this.radius * 1.2,
            r: 2 + Math.random() * 5,
            rot: Math.random() * Math.PI,
          }));
        }
        if (this.x < -100 || this.x > W + 100) this.alive = false;
      }

      draw() {
        if (this.splat) {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.ellipse(this.x, this.splatY + this.radius * 0.3,
            this.radius * 1.8, this.radius * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          this.splatBlobs.forEach(b => {
            ctx.beginPath();
            ctx.ellipse(this.x + b.dx, this.splatY + b.dy, b.r, b.r * 0.6, b.rot, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
          return;
        }
        ctx.save();
        this.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, this.radius * (i / this.trail.length) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.alpha * 0.85;
          ctx.fill();
        });
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    /* Brushstroke confetti ribbon: flutters and spins as it falls */
    class Ribbon {
      constructor(x, y, baseAngle, spread, power) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = power * (0.5 + Math.random() * 0.8);
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.12 + Math.random() * 0.08;
        this.drag = 0.985;
        this.color = pick();
        this.len = 14 + Math.random() * 22;
        this.thick = 3 + Math.random() * 5;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.3;
        this.flutterPhase = Math.random() * Math.PI * 2;
        this.flutterSpeed = 0.12 + Math.random() * 0.1;
        this.alpha = 1;
        this.alive = true;
      }

      update() {
        this.flutterPhase += this.flutterSpeed;
        this.vx *= this.drag;
        this.vy = this.vy * this.drag + this.gravity;
        this.x += this.vx + Math.sin(this.flutterPhase) * 1.6;
        this.y += this.vy;
        this.rot += this.rotSpeed;
        if (this.y > H * 0.78) this.alpha -= 0.03;
        if (this.alpha <= 0 || this.y > H + 40) this.alive = false;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        const squeeze = 0.35 + 0.65 * Math.abs(Math.cos(this.flutterPhase));
        ctx.globalAlpha = this.alpha * 0.92;
        ctx.fillStyle = this.color;
        const L = this.len, T = this.thick * squeeze;
        ctx.beginPath();
        ctx.moveTo(-L / 2, 0);
        ctx.quadraticCurveTo(0, -T, L / 2, -T * 0.3);
        ctx.quadraticCurveTo(L * 0.2, T, -L / 2, T * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    let particles = [];
    let pendingSpawns = 0;   // counts scheduled-but-not-yet-spawned particles

    const burst = (x, y, baseAngle, spread, power, nDrops, nRibbons, startDelay) => {
      for (let i = 0; i < nDrops; i++) {
        pendingSpawns++;
        setTimeout(() => {
          particles.push(new Drop(x, y, baseAngle, spread, power));
          pendingSpawns--;
        }, startDelay + i * 14);
      }
      for (let i = 0; i < nRibbons; i++) {
        pendingSpawns++;
        setTimeout(() => {
          particles.push(new Ribbon(x, y, baseAngle, spread * 1.3, power * 0.9));
          pendingSpawns--;
        }, startDelay + i * 10);
      }
    };

    // Party poppers: bottom corners firing up & inward, then a center burst
    const UP = -Math.PI / 2;
    burst(W * 0.02, H * 0.95, UP + 0.55, 0.9, 22, 22, 26, 0);     // bottom-left popper
    burst(W * 0.98, H * 0.95, UP - 0.55, 0.9, 22, 22, 26, 120);   // bottom-right popper
    burst(W * 0.5,  H * 0.45, UP, Math.PI * 2, 14, 18, 14, 320);  // center paint pop

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    // safety net: never let the overlay hang
    const safetyTimer = setTimeout(finish, 6000);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      particles = particles.filter(p => p.alive);

      if (particles.length > 0 || pendingSpawns > 0) {
        celebRafRef.current = requestAnimationFrame(loop);
      } else {
        clearTimeout(safetyTimer);
        finish();
      }
    };
    celebRafRef.current = requestAnimationFrame(loop);
  };

  /* ---------- paintbrush wipe: erases the dark cover to reveal the site ---------- */
  const playBrushReveal = () => {
    const canvas = celebCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const W = rect.width > 0 ? rect.width : window.innerWidth;
    const H = rect.height > 0 ? rect.height : window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Paint the canvas solid dark first, so the screen stays black
    // while the DOM background and text underneath are switched off.
    ctx.fillStyle = '#0C0C0C';
    ctx.fillRect(0, 0, W, H);
    setRevealing(true);   // makes container bg transparent + hides text/canvas below

    // From here, "drawing" with destination-out ERASES the dark paint,
    // exposing the live website underneath — like a brush clearing a canvas.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000'; // only alpha matters in destination-out

    const BANDS = 5;                       // number of horizontal brush sweeps
    const bandH = H / BANDS;
    const sweeps = Array.from({ length: BANDS }, (_, i) => ({
      y: bandH * (i + 0.5),
      dir: i % 2 === 0 ? 1 : -1,           // alternate left→right / right→left
      start: i * 140,                      // stagger like real brush passes
      duration: 620,
      lastX: null,
    }));

    const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    // ragged bristle stamp — many offset circles give a rough painted edge
    const stamp = (x, y, r) => {
      for (let i = 0; i < 10; i++) {
        const ox = (Math.random() - 0.5) * r * 0.8;
        const oy = (Math.random() - 0.5) * r * 1.7;
        const rr = r * (0.35 + Math.random() * 0.55);
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let start = null;
    const frame = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      let done = true;

      sweeps.forEach(s => {
        const t = Math.min(1, Math.max(0, (elapsed - s.start) / s.duration));
        if (t < 1) done = false;
        const p = easeInOut(t);
        const margin = bandH;              // start/finish off-screen
        const x = s.dir === 1
          ? -margin + p * (W + margin * 2)
          : W + margin - p * (W + margin * 2);

        // stamp continuously between last frame's position and this one
        const from = s.lastX === null ? x : s.lastX;
        const steps = Math.max(1, Math.ceil(Math.abs(x - from) / (bandH * 0.25)));
        for (let i = 1; i <= steps; i++) {
          const sx = from + (x - from) * (i / steps);
          const wave = Math.sin(sx * 0.01 + s.y) * bandH * 0.12;  // slight hand wobble
          stamp(sx, s.y + wave, bandH * 0.62);
        }
        s.lastX = x;
      });

      if (!done) {
        celebRafRef.current = requestAnimationFrame(frame);
      } else {
        // soft-fade any leftover dark specks, then remove the overlay
        setCanvasFading(true);
        setTimeout(() => setDismissed(true), 450);
      }
    };
    celebRafRef.current = requestAnimationFrame(frame);
  };

  const dismiss = () => {
    if (firedRef.current) return;   // guard against double-clicks
    firedRef.current = true;
    firePaintCelebration(() => playBrushReveal());
  };

  useEffect(() => {
    return () => {
      if (celebRafRef.current) cancelAnimationFrame(celebRafRef.current);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: revealing ? 'transparent' : '#0C0C0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: revealing ? 'none' : 'auto',
      }}
    >
      {/* Brushstroke background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: revealing ? 0 : 1,
        }}
      />

      {/* Paint celebration / brush-reveal canvas (topmost) */}
      <canvas
        ref={celebCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: canvasFading ? 0 : 1,
          transition: 'opacity 0.45s ease',
        }}
      />

      {/* Text & button */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          opacity: revealing ? 0 : 1,
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontWeight: 400,
            color: '#F5F5F5',
            letterSpacing: '0.04em',
            margin: 0,
            textShadow: '0 0 30px rgba(0,0,0,0.8)',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
            color: '#9E9E9E',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: '0.6rem 0 0',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          {subtitle}
        </p>

        <button
          onClick={dismiss}
          style={{
            display: 'block',
            margin: '2.5rem auto 0',
            padding: '0.7rem 2.2rem',
            fontFamily: 'Georgia, serif',
            fontSize: '1rem',
            letterSpacing: '0.12em',
            color: '#F5F5F5',
            background: 'transparent',
            border: '1.5px solid #5A5A5A',
            borderRadius: '2px',
            cursor: 'pointer',
            opacity: btnVisible ? 1 : 0,
            transition: 'opacity 0.6s ease, background 0.25s, color 0.25s, border-color 0.25s',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#F5F5F5';
            e.target.style.color = '#0C0C0C';
            e.target.style.borderColor = '#F5F5F5';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#F5F5F5';
            e.target.style.borderColor = '#5A5A5A';
          }}
        >
          Enter the Studio →
        </button>
      </div>
    </div>
  );
}