"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode = "sequence" | "text" | "logo";
type Stage = "storm" | "formLogo" | "settle" | "done";

type SpiralAnimationProps = {
  mode?: Mode;
  logoSrc?: string;
  className?: string;
  onStageChange?: (stage: Stage) => void;
};

type Pt = { x: number; y: number; color: string };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// --- RESTORED: 3D Metallic Gradient Logic ---
function lerpColor(color1: string, color2: string, factor: number) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgba(${r},${g},${b},1)`;
}

function getMetallicColor(y: number, height: number) {
  // Calculates gradient based on vertical position (Y)
  const progress = Math.max(0, Math.min(1, y / height));

  // Exact colors picked from your "Real Logo" reference
  const highlight = "#FFFACD"; // Lemon Chiffon (Top tips highlight)
  const midGold = "#D4AF37";   // Classic Gold (Middle body)
  const shadow = "#785C1F";    // Dark Bronze (Bottom shadows)

  if (progress < 0.3) {
    // Top 30%: Highlight -> Mid
    return lerpColor(highlight, midGold, progress / 0.3);
  } else {
    // Bottom 70%: Mid -> Shadow
    return lerpColor(midGold, shadow, (progress - 0.3) / 0.7);
  }
}

function extractPointsFromImageData(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  step: number,
  alphaThreshold: number
): Pt[] {
  const pts: Pt[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];

      if (a >= alphaThreshold) {
        // FIX: Force the metallic gradient instead of reading the flat image color
        const color = getMetallicColor(y, h);
        pts.push({ x, y, color });
      }
    }
  }
  return pts;
}

function drawCenteredContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const s = Math.min(w / iw, h / ih);
  const dw = iw * s;
  const dh = ih * s;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  tx = 0;
  ty = 0;
  seed = Math.random() * 1000;
  size = 1;
  color = "rgba(235, 196, 94, 1)"; 

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Slightly finer particles for sharper resolution
    this.size = 0.5 + Math.random() * 0.8; 
  }

  setTarget(p: Pt) {
    this.tx = p.x;
    this.ty = p.y;
    this.color = p.color; 
  }

  step(dt: number, k: number, damping: number, swirl: number, cx: number, cy: number, t: number) {
    const ax = (this.tx - this.x) * k;
    const ay = (this.ty - this.y) * k;
    const dx = this.x - cx;
    const dy = this.y - cy;

    // Wind Physics (Reduced for sharpness)
    const breezeX = Math.sin(t * 0.5 + this.seed) * 0.02;
    const breezeY = Math.cos(t * 0.4 + this.seed) * 0.02;

    const ang = Math.atan2(dy, dx) + 1.2 * Math.sin((t + this.seed) * 0.35);
    const s = swirl / (1 + Math.sqrt(dx * dx + dy * dy) * 0.01);

    this.vx += (ax + Math.cos(ang) * s + breezeX) * dt;
    this.vy += (ay + Math.sin(ang) * s + breezeY) * dt;

    this.vx *= damping;
    this.vy *= damping;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

type PhaseName = "storm" | "formLogo" | "settle" | "done";
type Phase = { name: PhaseName; duration: number };

export function SpiralAnimation({
  mode = "sequence",
  logoSrc = "/logo-transparent.png",
  className,
  onStageChange,
}: SpiralAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const stageRef = useRef<Stage>("storm");
  const callbackRef = useRef(onStageChange);
  callbackRef.current = onStageChange;
  const [ready, setReady] = useState(false);

  const phases: Phase[] = useMemo(() => {
    if (mode === "logo") return [{ name: "formLogo" as const, duration: 9999 }];
    return [
      { name: "storm" as const, duration: 1.0 }, 
      { name: "formLogo" as const, duration: 2.0 }, 
      { name: "settle" as const, duration: 1.0 },
      { name: "done" as const, duration: 9999 },
    ];
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let mounted = true;
    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let logoImg: HTMLImageElement | null = null;
    let particles: Particle[] = [];
    let ptsLogo: Pt[] = [];
    let phaseIndex = 0;
    let phaseT = 0;

    const bg = "#040615";

    function emitStage(name: PhaseName) {
      if (stageRef.current !== name) {
        stageRef.current = name;
        callbackRef.current?.(name);
      }
    }

    function buildLogoPoints(w: number, h: number) {
      off.width = w;
      off.height = h;
      offCtx!.clearRect(0, 0, w, h);

      // Safe Zone Layout
      const boxSize = Math.min(w * 0.40, h * 0.40); 
      const boxX = (w - boxSize) / 2;
      const boxY = (h * 0.34) - (boxSize / 2);
      const padding = boxSize * 0.05;
      const drawW = boxSize - (padding * 2);
      const drawH = boxSize - (padding * 2);
      const drawX = boxX + padding;
      const drawY = boxY + padding;

      if (logoImg) {
        drawCenteredContain(offCtx!, logoImg, drawX, drawY, drawW, drawH);
      }

      const imgData = offCtx!.getImageData(0, 0, w, h);

      // FIX: Force Step 1 (Every Pixel) for maximum sharpness
      // Previous was 2, which caused the "mixed/fuzzy" look
      const logoStep = 1; 
      ptsLogo = extractPointsFromImageData(imgData.data, w, h, logoStep, 10);
    }

    function assignTargets(points: Pt[], w: number, h: number) {
      if (!points.length) return;
      // High particle count for solid look
      const maxParticles = reduce ? 3000 : w < 600 ? 6000 : 15000;
      const n = Math.min(points.length, maxParticles);

      if (particles.length !== n) {
        particles = [];
        const cx = w / 2;
        const cy = h / 2;
        for (let i = 0; i < n; i++) {
          const a = i * 0.18;
          const r = 8 + (i / n) * Math.min(w, h) * 0.45;
          const px = cx + Math.cos(a) * r + (Math.random() - 0.5) * 14;
          const py = cy + Math.sin(a) * r + (Math.random() - 0.5) * 14;
          particles.push(new Particle(px, py));
        }
      }

      const shuffledPoints = [...points].sort(() => Math.random() - 0.5);
      for (let i = 0; i < particles.length; i++) {
        const p = shuffledPoints[i % shuffledPoints.length];
        particles[i].setTarget(p);
      }
    }

    function currentPhase(): Phase {
      return phases[phaseIndex % phases.length];
    }

    function advancePhase() {
      phaseIndex = Math.min(phaseIndex + 1, phases.length - 1);
      phaseT = 0;
      emitStage(currentPhase().name);
    }

    function phaseTargets(w: number, h: number) {
      const ph = currentPhase().name;
      if (ph === "storm") {
        const storm: Pt[] = [];
        const n = 4000;
        const stormColor = "rgba(212, 175, 55, 0.8)"; // Generic gold for storm
        for (let i = 0; i < n; i++) {
          storm.push({ 
            x: Math.random() * w, 
            y: Math.random() * h,
            color: stormColor 
          });
        }
        assignTargets(storm, w, h);
      }
      if (ph === "formLogo" || ph === "settle" || ph === "done") {
        assignTargets(ptsLogo, w, h);
      }
    }

    let last = performance.now();

    function tick(now: number) {
      if (!mounted) return;
      const dt = clamp((now - last) / 16.6667, 0.5, 2.0);
      last = now;

      const w = canvas!.clientWidth || window.innerWidth;
      const h = canvas!.clientHeight || window.innerHeight;

      phaseT += 0.016 * dt;

      const ph = currentPhase();
      if (ph.duration < 9000 && phaseT >= ph.duration) {
        advancePhase();
        phaseTargets(w, h);
      }

      if (!particles.length && ptsLogo.length > 0) phaseTargets(w, h);

      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = reduce ? bg : "rgba(4, 6, 21, 0.25)"; 
      ctx!.fillRect(0, 0, w, h);

      ctx!.save();
      const grad = ctx!.createRadialGradient(w * 0.5, h * 0.4, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.85);
      grad.addColorStop(0, "rgba(22, 33, 62, 0.15)"); 
      grad.addColorStop(1, "rgba(2, 2, 8, 0.85)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      const cx = w / 2;
      const cy = h / 2;
      const t = now / 1000;
      const isStorm = ph.name === "storm";
      const isForming = ph.name === "formLogo";
      const isSettled = ph.name === "settle" || ph.name === "done";

      let k = 0.018;
      let damping = 0.88;
      let swirl = 0.5;

      if (reduce) {
         k = 0.020; damping = 0.86; swirl = 0;
      } else if (isStorm) {
         k = 0.008; damping = 0.92; swirl = 2.5;
      } else if (isForming) {
         k = 0.035; damping = 0.85; swirl = 1.0;
      } else if (isSettled) {
         // FIX: Tighter hold (k=0.025) and almost zero swirl to ensure SHARPNESS
         k = 0.025; damping = 0.90; swirl = 0.02;
      }

      ctx!.globalCompositeOperation = "source-over"; 

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.step(dt, k, damping, swirl, cx, cy, t);
        const r = p.size;
        ctx!.beginPath();
        ctx!.fillStyle = p.color; 
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (logoImg) {
        buildLogoPoints(w, h);
        phaseTargets(w, h);
      }
    };

    async function init() {
      try {
        const w = canvas!.clientWidth || window.innerWidth;
        const h = canvas!.clientHeight || window.innerHeight;
        try { logoImg = await loadImage(logoSrc); } catch { logoImg = null; }
        buildLogoPoints(w, h);
        phaseIndex = 0;
        phaseT = 0;
        emitStage("storm");
        phaseTargets(w, h);
        if (!mounted) return;
        setReady(true);
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        setReady(true);
      }
    }

    init();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      mounted = false;
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mode, logoSrc, phases]);

  return (
    <div className={className ?? "relative w-full h-full"}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!ready && <div className="absolute inset-0 bg-[#040615]" />}
    </div>
  );
}