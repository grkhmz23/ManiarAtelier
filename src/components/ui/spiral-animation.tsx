"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode = "sequence" | "text" | "logo";
type Stage = "storm" | "formLogo" | "settle" | "done";

type SpiralAnimationProps = {
  mode?: Mode;
  text?: string;
  logoSrc?: string;
  className?: string;
  onStageChange?: (stage: Stage) => void;
};

type Pt = { x: number; y: number };

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
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function extractPointsFromImageData(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  step: number,
  alphaThreshold: number,
  useBrightness = false
): Pt[] {
  const pts: Pt[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (useBrightness) {
        if (a >= 30 && (r + g + b) > 100) pts.push({ x, y });
      } else {
        if (a >= alphaThreshold) pts.push({ x, y });
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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = 0.3 + Math.random() * 0.6;
  }

  setTarget(p: Pt) {
    this.tx = p.x;
    this.ty = p.y;
  }

  step(dt: number, k: number, damping: number, swirl: number, cx: number, cy: number, t: number) {
    const ax = (this.tx - this.x) * k;
    const ay = (this.ty - this.y) * k;
    const dx = this.x - cx;
    const dy = this.y - cy;
    const ang = Math.atan2(dy, dx) + 1.2 * Math.sin((t + this.seed) * 0.35);
    const s = swirl / (1 + Math.sqrt(dx * dx + dy * dy) * 0.01);
    this.vx += (ax + Math.cos(ang) * s) * dt;
    this.vy += (ay + Math.sin(ang) * s) * dt;
    this.vx *= damping;
    this.vy *= damping;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

type PhaseName = "storm" | "formLogo" | "settle" | "done";

type Phase = {
  name: PhaseName;
  duration: number;
};

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
      { name: "storm" as const, duration: 0.8 },
      { name: "formLogo" as const, duration: 0.7 },
      { name: "settle" as const, duration: 0.5 },
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

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let logoImg: HTMLImageElement | null = null;
    let particles: Particle[] = [];
    let ptsLogo: Pt[] = [];
    let phaseIndex = 0;
    let phaseT = 0;

    const gold = "rgba(214, 172, 84, 1)";
    const bg = "#0B1026";

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

      const ornSize = Math.min(w * 0.4, h * 0.5);
      const ox = (w - ornSize) / 2;
      const oy = h * 0.08;

      if (logoImg) {
        drawCenteredContain(offCtx!, logoImg, ox, oy, ornSize, ornSize);
      }

      // "MANIAR"
      const maniarY = oy + ornSize + h * 0.03;
      const maniarSize = Math.floor(Math.min(w * 0.09, 64));
      offCtx!.fillStyle = "white";
      offCtx!.textBaseline = "top";
      offCtx!.font = "600 " + maniarSize + "px ui-serif, Georgia, serif";

      const mChars = "MANIAR".split("");
      const mSpacing = maniarSize * 0.28;
      let mTotal = 0;
      for (const c of mChars) mTotal += offCtx!.measureText(c).width;
      mTotal += mSpacing * (mChars.length - 1);
      let mx = w / 2 - mTotal / 2;
      for (const c of mChars) {
        offCtx!.fillText(c, mx, maniarY);
        mx += offCtx!.measureText(c).width + mSpacing;
      }

      // "ATELIER"
      const atelierY = maniarY + maniarSize * 1.2;
      const atelierSize = Math.floor(maniarSize * 0.38);
      offCtx!.font = "300 " + atelierSize + "px ui-serif, Georgia, serif";

      const aChars = "ATELIER".split("");
      const aSpacing = atelierSize * 0.5;
      let aTotal = 0;
      for (const c of aChars) aTotal += offCtx!.measureText(c).width;
      aTotal += aSpacing * (aChars.length - 1);
      let ax = w / 2 - aTotal / 2;
      for (const c of aChars) {
        offCtx!.fillText(c, ax, atelierY);
        ax += offCtx!.measureText(c).width + aSpacing;
      }

      // Decorative lines
      const lineY = atelierY + atelierSize * 0.5;
      offCtx!.strokeStyle = "white";
      offCtx!.lineWidth = 1.5;
      offCtx!.beginPath();
      offCtx!.moveTo(w / 2 - aTotal / 2 - 12 - maniarSize, lineY);
      offCtx!.lineTo(w / 2 - aTotal / 2 - 12, lineY);
      offCtx!.moveTo(w / 2 + aTotal / 2 + 12, lineY);
      offCtx!.lineTo(w / 2 + aTotal / 2 + 12 + maniarSize, lineY);
      offCtx!.stroke();

      const imgData = offCtx!.getImageData(0, 0, w, h);
      const logoStep = w < 520 ? 2 : 1;
      ptsLogo = extractPointsFromImageData(imgData.data, w, h, logoStep, 15, true);
    }

    function assignTargets(points: Pt[], w: number, h: number) {
      if (!points.length) return;
      const maxParticles = reduce ? 4500 : w < 520 ? 7800 : 22750;
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
      for (let i = 0; i < particles.length; i++) {
        const p = points[(i * Math.floor(points.length / particles.length)) % points.length];
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
        for (let i = 0; i < n; i++) {
          storm.push({ x: Math.random() * w, y: Math.random() * h });
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

      if (!particles.length) phaseTargets(w, h);

      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = reduce ? bg : "rgba(11, 16, 38, 0.28)";
      ctx!.fillRect(0, 0, w, h);

      ctx!.save();
      const grad = ctx!.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(20,25,60,0.08)");
      grad.addColorStop(1, "rgba(5,8,20,0.7)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();

      const cx = w / 2;
      const cy = h / 2;
      const t = now / 1000;
      const isStorm = ph.name === "storm";
      const isResolve = ph.name === "formLogo" || ph.name === "settle" || ph.name === "done";

      const k = reduce ? 0.020 : isStorm ? 0.008 : isResolve ? 0.026 : 0.018;
      const damping = reduce ? 0.86 : isStorm ? 0.92 : isResolve ? 0.83 : 0.88;
      const swirl = reduce ? 0 : isStorm ? 2.5 : isResolve ? 0.12 : 0.5;

      ctx!.globalCompositeOperation = "source-over";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.step(dt, k, damping, swirl, cx, cy, t);
        const r = p.size * (isResolve ? 1.0 : 0.7);
        ctx!.beginPath();
        ctx!.fillStyle = gold;
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.fillStyle = "rgba(244, 229, 167, 0.45)";
        ctx!.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

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
      {!ready && <div className="absolute inset-0 bg-[#0B1026]" />}
    </div>
  );
}
