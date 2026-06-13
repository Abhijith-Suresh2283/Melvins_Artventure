import { useEffect, useRef, useState } from 'react';

export default function LaunchOverlay_v1({ title = "Your Studio Name", subtitle = "Art Classes" }) {
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

  /* ---------- ink diffusion effect: professional transitional moment ---------- */
  const fireInkDiffusion = (onDone) => {
    const canvas = celebCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const W = rect.width > 0 ? rect.width : window.innerWidth;
    const H = rect.height > 0 ? rect.height : window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // We render into an offscreen canvas so we can composite with blur
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const octx = off.getContext('2d');

    // Ink drop: diffuses outward from an origin point like wet ink on paper
    class InkDrop {
      constructor(x, y, delay) {
        this.x = x;
        this.y = y;
        this.delay = delay;
        this.radius = 0;
        this.maxRadius = Math.hypot(W, H) * (0.52 + Math.random() * 0.12);
        this.alpha = 0;
        this.born = false;
        this.done = false;
        // Feathered ink color — very dark with slight warm/cool variance
        const tone = Math.floor(8 + Math.random() * 10);
        this.color = `rgb(${tone},${tone},${Math.floor(tone * 1.1)})`;
        // Organic blob control points, slightly different each drop
        this.offsets = Array.from({ length: 8 }, () => (Math.random() - 0.5) * 0.18);
      }

      update(elapsed) {
        if (elapsed < this.delay) return;
        if (!this.born) this.born = true;
        const t = Math.min(1, (elapsed - this.delay) / 1800);
        const eased = 1 - Math.pow(1 - t, 2.2);
        this.radius = eased * this.maxRadius;
        // Alpha: blooms in then holds
        this.alpha = t < 0.15 ? t / 0.15 : 1.0;
        if (t >= 1) this.done = true;
      }

      draw() {
        if (!this.born) return;
        octx.save();
        octx.globalAlpha = this.alpha * 0.92;
        octx.fillStyle = this.color;
        // Draw an organically shaped ink blob using bezier curves through offset points
        const n = 8;
        octx.beginPath();
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2;
          const nextAngle = ((i + 1) / n) * Math.PI * 2;
          const r1 = this.radius * (1 + this.offsets[i]);
          const r2 = this.radius * (1 + this.offsets[(i + 1) % n]);
          const x1 = this.x + Math.cos(angle) * r1;
          const y1 = this.y + Math.sin(angle) * r1;
          const x2 = this.x + Math.cos(nextAngle) * r2;
          const y2 = this.y + Math.sin(nextAngle) * r2;
          const cpR = this.radius * (1.08 + this.offsets[i] * 0.5);
          const cpAngle = (angle + nextAngle) / 2;
          const cpX = this.x + Math.cos(cpAngle) * cpR;
          const cpY = this.y + Math.sin(cpAngle) * cpR;
          if (i === 0) octx.moveTo(x1, y1);
          octx.quadraticCurveTo(cpX, cpY, x2, y2);
        }
        octx.closePath();
        octx.fill();
        octx.restore();
      }
    }

    // Ink tendrils: long thin brushstroke-like arms that shoot out during diffusion
    class InkTendril {
      constructor(originX, originY, angle, delay) {
        this.ox = originX;
        this.oy = originY;
        this.angle = angle;
        this.delay = delay;
        this.length = 0;
        this.maxLength = W * (0.3 + Math.random() * 0.4);
        this.width = 1.5 + Math.random() * 3.5;
        this.alpha = 0;
        this.born = false;
        this.done = false;
        this.curve = (Math.random() - 0.5) * 0.4;
        const tone = Math.floor(6 + Math.random() * 14);
        this.color = `rgb(${tone},${tone},${tone})`;
        this.points = [{ x: originX, y: originY }];
      }

      update(elapsed) {
        if (elapsed < this.delay) return;
        if (!this.born) this.born = true;
        const t = Math.min(1, (elapsed - this.delay) / 1200);
        const eased = 1 - Math.pow(1 - t, 3);
        this.length = eased * this.maxLength;
        this.alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - ((t - 0.7) / 0.3) : 1;
        if (t >= 1) this.done = true;

        // Rebuild points along a slight curve
        const steps = 20;
        this.points = [];
        for (let i = 0; i <= steps; i++) {
          const s = (i / steps) * this.length;
          const bendAngle = this.angle + this.curve * (i / steps) * Math.PI * 0.5;
          this.points.push({
            x: this.ox + Math.cos(bendAngle) * s,
            y: this.oy + Math.sin(bendAngle) * s,
          });
        }
      }

      draw() {
        if (!this.born || this.points.length < 2) return;
        octx.save();
        octx.globalAlpha = this.alpha * 0.75;
        octx.strokeStyle = this.color;
        octx.lineCap = 'round';
        octx.lineJoin = 'round';
        for (let i = 1; i < this.points.length; i++) {
          const progress = i / this.points.length;
          octx.lineWidth = this.width * (1 - progress * 0.7);
          octx.beginPath();
          octx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
          octx.lineTo(this.points[i].x, this.points[i].y);
          octx.stroke();
        }
        octx.restore();
      }
    }

    // Phase 2: a subtle gold/sepia shimmer line that sweeps across — like light catching paper
    class ShimmerLine {
      constructor(delay) {
        this.delay = delay;
        this.x = -W * 0.1;
        this.alpha = 0;
        this.born = false;
        this.done = false;
      }

      update(elapsed) {
        if (elapsed < this.delay) return;
        if (!this.born) this.born = true;
        const t = Math.min(1, (elapsed - this.delay) / 900);
        this.x = -W * 0.1 + t * W * 1.2;
        this.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - ((t - 0.75) / 0.25) : 0.22;
        if (t >= 1) this.done = true;
      }

      draw() {
        if (!this.born) return;
        octx.save();
        const grad = octx.createLinearGradient(this.x - 80, 0, this.x + 80, 0);
        grad.addColorStop(0, 'rgba(220,200,160,0)');
        grad.addColorStop(0.4, `rgba(230,210,170,${this.alpha})`);
        grad.addColorStop(0.5, `rgba(245,225,185,${this.alpha * 1.3})`);
        grad.addColorStop(0.6, `rgba(230,210,170,${this.alpha})`);
        grad.addColorStop(1, 'rgba(220,200,160,0)');
        octx.fillStyle = grad;
        octx.fillRect(this.x - 80, 0, 160, H);
        octx.restore();
      }
    }

    // Spawn objects
    const cx = W * 0.5, cy = H * 0.5;
    const particles = [];

    // One large central ink diffusion
    particles.push(new InkDrop(cx, cy, 0));
    // Two accent drops slightly off-center, staggered
    particles.push(new InkDrop(cx * 0.3, cy * 0.4, 200));
    particles.push(new InkDrop(cx * 1.7, cy * 1.5, 320));

    // Tendrils radiating from center — like ink finding paper grain
    const tendrilCount = 9;
    for (let i = 0; i < tendrilCount; i++) {
      const angle = (i / tendrilCount) * Math.PI * 2 + Math.random() * 0.3;
      particles.push(new InkTendril(cx, cy, angle, 80 + i * 55));
    }

    // Shimmer sweep — arrives as ink settles
    const shimmer = new ShimmerLine(1100);

    let start = null;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    const safetyTimer = setTimeout(finish, 5000);

    const loop = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;

      octx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.update(elapsed);
        p.draw();
      });
      shimmer.update(elapsed);
      shimmer.draw();

      // Composite offscreen → main canvas with a very slight blur for ink diffusion softness
      ctx.clearRect(0, 0, W, H);
      ctx.filter = 'blur(2px)';
      ctx.drawImage(off, 0, 0);
      ctx.filter = 'none';

      const allDone = particles.every(p => p.done) && shimmer.done;

      if (!allDone) {
        celebRafRef.current = requestAnimationFrame(loop);
      } else {
        clearTimeout(safetyTimer);
        // Brief hold so the fully-inked frame is seen before the brush wipe
        setTimeout(finish, 180);
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

    ctx.fillStyle = '#0C0C0C';
    ctx.fillRect(0, 0, W, H);
    setRevealing(true);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';

    const BANDS = 5;
    const bandH = H / BANDS;
    const sweeps = Array.from({ length: BANDS }, (_, i) => ({
      y: bandH * (i + 0.5),
      dir: i % 2 === 0 ? 1 : -1,
      start: i * 140,
      duration: 620,
      lastX: null,
    }));

    const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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
        const margin = bandH;
        const x = s.dir === 1
          ? -margin + p * (W + margin * 2)
          : W + margin - p * (W + margin * 2);

        const from = s.lastX === null ? x : s.lastX;
        const steps = Math.max(1, Math.ceil(Math.abs(x - from) / (bandH * 0.25)));
        for (let i = 1; i <= steps; i++) {
          const sx = from + (x - from) * (i / steps);
          const wave = Math.sin(sx * 0.01 + s.y) * bandH * 0.12;
          stamp(sx, s.y + wave, bandH * 0.62);
        }
        s.lastX = x;
      });

      if (!done) {
        celebRafRef.current = requestAnimationFrame(frame);
      } else {
        setCanvasFading(true);
        setTimeout(() => setDismissed(true), 450);
      }
    };
    celebRafRef.current = requestAnimationFrame(frame);
  };

  const dismiss = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    fireInkDiffusion(() => playBrushReveal());
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

      {/* Ink diffusion / brush-reveal canvas (topmost) */}
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