"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];

function rgb01ToCss(rgb: RGB, a = 1) {
  const [r, g, b] = rgb.map((v) => Math.max(0, Math.min(1, v)));
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255,
  )}, ${a})`;
}

export default function PatternShader({
  gridSpacing,
  animationSpeed,
  rotationSpeed,
  paletteA,
  paletteB,
  paletteC,
  paletteD,
  className,
  ariaLabel = "Background pattern",
}: {
  gridSpacing: number;
  animationSpeed: number;
  rotationSpeed: number;
  paletteA: RGB;
  paletteB: RGB;
  paletteC: RGB;
  paletteD: RGB;
  className?: string;
  ariaLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const colors = useMemo(
    () => ({
      a: paletteA,
      b: paletteB,
      c: paletteC,
      d: paletteD,
    }),
    [paletteA, paletteB, paletteC, paletteD],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    resize();

    const noise = (x: number, y: number, t: number) => {
      // deterministic “hash” noise, fast enough for low-density usage
      const s = Math.sin(x * 12.9898 + y * 78.233 + t * 0.025) * 43758.5453;
      return s - Math.floor(s);
    };

    const draw = (t: number) => {
      const time = t * 0.001 * animationSpeed;
      const { width, height } = canvas.getBoundingClientRect();

      // Base
      ctx.clearRect(0, 0, width, height);

      // Soft gradients
      const g1 = ctx.createRadialGradient(
        width * 0.3,
        height * 0.25,
        0,
        width * 0.3,
        height * 0.25,
        Math.max(width, height) * 0.8,
      );
      g1.addColorStop(0, rgb01ToCss(colors.c, 0.14));
      g1.addColorStop(1, rgb01ToCss(colors.d, 0.0));
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.85,
        0,
        width * 0.75,
        height * 0.85,
        Math.max(width, height) * 0.9,
      );
      g2.addColorStop(0, rgb01ToCss(colors.b, 0.12));
      g2.addColorStop(1, rgb01ToCss(colors.d, 0.0));
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Rotating lattice
      const angle = time * rotationSpeed * 120;
      const spacing = Math.max(18, Math.min(56, gridSpacing * 64));
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.globalAlpha = 0.26;
      ctx.strokeStyle = rgb01ToCss(colors.a, 0.35);
      ctx.lineWidth = 1;

      const max = Math.max(width, height) * 1.2;
      for (let x = -max; x <= max; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, -max);
        ctx.lineTo(x, max);
        ctx.stroke();
      }
      for (let y = -max; y <= max; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(-max, y);
        ctx.lineTo(max, y);
        ctx.stroke();
      }

      // Accent diagonals
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = rgb01ToCss(colors.c, 0.55);
      for (let d = -max; d <= max; d += spacing * 1.7) {
        ctx.beginPath();
        ctx.moveTo(-max, d);
        ctx.lineTo(max, d + spacing * 0.8);
        ctx.stroke();
      }

      ctx.restore();

      // Grain
      const grainStep = 6;
      const imgData = ctx.getImageData(0, 0, Math.floor(width), Math.floor(height));
      const data = imgData.data;
      for (let y = 0; y < height; y += grainStep) {
        for (let x = 0; x < width; x += grainStep) {
          const n = noise(x, y, t);
          const v = (n - 0.5) * 22; // subtle
          const idx = (Math.floor(y) * Math.floor(width) + Math.floor(x)) * 4;
          data[idx] = Math.max(0, Math.min(255, data[idx] + v));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + v));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + v));
        }
      }
      ctx.putImageData(imgData, 0, 0);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [gridSpacing, animationSpeed, rotationSpeed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full h-full", className)}
      aria-label={ariaLabel}
      role="img"
    />
  );
}
