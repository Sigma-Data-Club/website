"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./three/glsl";

const ACCENT = "#36b9ba";
const MIST = "rgba(255,255,255,0.55)";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  accent: boolean;
  phase: number;
};

function seed(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function spawn(count: number, w: number, h: number, seedBase: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const s = seedBase + i * 1.73;
    return {
      x: seed(s) * w,
      y: seed(s + 1) * h,
      vx: (seed(s + 2) - 0.5) * 0.35,
      vy: -(0.15 + seed(s + 3) * 0.45),
      r: 0.6 + seed(s + 4) * 1.8,
      accent: seed(s + 5) > 0.62,
      phase: seed(s + 6) * Math.PI * 2,
    };
  });
}

export function CardHoverParticles({
  active,
  seed: seedIndex = 0,
}: {
  active: boolean;
  seed?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(72, Math.max(28, Math.floor((width * height) / 2200)));
      particlesRef.current = spawn(count, width, height, seedIndex * 17.3);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => ro.disconnect();
  }, [seedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(rafRef.current);

    if (!active || reducedRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16;
      last = now;
      const { width, height } = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.x += Math.sin(now * 0.0012 + p.phase) * 0.12 * dt;
        p.y += Math.cos(now * 0.001 + p.phase) * 0.08 * dt;

        if (p.y < -4) {
          p.y = height + 4;
          p.x = seed(p.x + now) * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const pulse = 0.35 + Math.sin(now * 0.0025 + p.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accent ? ACCENT : MIST;
        ctx.globalAlpha = pulse;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
