"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/* Deterministic PRNG so star layout is stable across renders. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Starfield({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el: HTMLCanvasElement | null = ref.current;
    if (!el) return;
    const c: CanvasRenderingContext2D | null = el.getContext("2d");
    if (!c) return;
    const cv: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = c;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = mulberry32(20260621);

    type Star = { x: number; y: number; r: number; tw: number; ph: number; dx: number };
    let stars: Star[] = [];

    function build() {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: rand() * w,
        y: rand() * h,
        r: rand() * 1.3 + 0.25,
        tw: rand() * 0.9 + 0.1,
        ph: rand() * Math.PI * 2,
        dx: (rand() - 0.5) * 0.04,
      }));
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tw + s.ph));
        s.x += reduce ? 0 : s.dx;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r > 1 ? "150,220,255" : "255,255,255"},${a})`;
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    build();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function OrbitSystem({ reduce }: { reduce: boolean }) {
  const rings = [
    { r: 150, dur: 26, dir: 1, color: "#22d3ee", sat: 4.5 },
    { r: 240, dur: 40, dir: -1, color: "#8b5cf6", sat: 3.5 },
    { r: 330, dur: 58, dir: 1, color: "#67e8f9", sat: 3 },
    { r: 430, dur: 80, dir: -1, color: "#e8eef7", sat: 2.5 },
  ];

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="absolute left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-70"
      aria-hidden
    >
      <defs>
        <radialGradient id="veil-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#0e7490" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tilted plane */}
      <g transform="translate(500,500) scale(1,0.4) translate(-500,-500)">
        {/* central hub glow */}
        <circle cx="500" cy="500" r="120" fill="url(#veil-hub)" />
        <circle cx="500" cy="500" r="26" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" />

        {rings.map((ring, i) => (
          <g key={i}>
            <circle
              cx="500"
              cy="500"
              r={ring.r}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.07}
              strokeWidth="1"
            />
            <motion.g
              style={{ transformOrigin: "500px 500px" }}
              initial={{ rotate: i * 70 }}
              animate={reduce ? { rotate: i * 70 } : { rotate: i * 70 + ring.dir * 360 }}
              transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
            >
              {/* satellite + faint trail */}
              <circle cx={500 + ring.r} cy="500" r={ring.sat + 4} fill={ring.color} opacity="0.18" />
              <circle cx={500 + ring.r} cy="500" r={ring.sat} fill={ring.color} />
            </motion.g>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function SpaceBackground() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* nebula glows */}
      <div className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-primary/10 blur-[150px] animate-[aurora-a_22s_ease-in-out_infinite]" />
      <div className="absolute -right-48 top-1/4 h-[40rem] w-[40rem] rounded-full bg-accent/12 blur-[160px] animate-[aurora-b_28s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-16rem] left-1/3 h-[38rem] w-[38rem] rounded-full bg-[#1d4ed8]/10 blur-[170px] animate-[aurora-a_26s_ease-in-out_infinite]" />

      {/* stars */}
      <Starfield reduce={reduce} />

      {/* orbital system */}
      <OrbitSystem reduce={reduce} />

      {/* vignette + bottom fade to keep text legible */}
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_42%,transparent_30%,var(--color-bg)_92%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
