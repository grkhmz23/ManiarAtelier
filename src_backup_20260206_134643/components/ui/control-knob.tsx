"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

export default function ReactorKnob({
  label = "Cinema",
  size = "lg",
  initial = 55,
  onChange,
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
  initial?: number; // 0..100
  onChange?: (v01: number) => void; // 0..1
}) {
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  const initial01 = clamp01(initial / 100);

  const angle: MotionValue<number> = useMotionValue(initial01 * 280 - 140); // -140..140
  const spring = useSpring(angle, { stiffness: 520, damping: 36, mass: 1.1 });

  const [val, setVal] = useState(initial01);

  const knobRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  const trackSize =
    size === "sm" ? 66 : size === "md" ? 80 : 104;
  const knobSize =
    size === "sm" ? 44 : size === "md" ? 54 : 72;

  const value01 = useTransform(spring, [-140, 140], [0, 1]);

  useMotionValueEvent(value01, "change", (v) => {
    const c = clamp01(v);
    setVal(c);
    onChange?.(c);
  });

  const setByPointer = useCallback((clientX: number, clientY: number) => {
    const el = knobRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    // angle in degrees, 0 is to the right
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;

    // map to -180..180 and clamp to our sweep
    deg = Math.max(-140, Math.min(140, deg));
    angle.set(deg);
  }, [angle]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      setByPointer(e.clientX, e.clientY);
    };
    const onUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setByPointer]);

  const goldGlow = useTransform(value01, [0, 1], [0.12, 0.38]);
  const tickOpacity = useTransform(value01, [0, 1], [0.45, 1]);

  return (
    <div className="flex flex-col items-center select-none">
      <div
        ref={knobRef}
        className="relative"
        style={{ width: trackSize, height: trackSize }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(244,229,167,0.14), rgba(10,14,33,0.92) 55%, rgba(7,8,23,0.98))",
            border: "1px solid rgba(214,172,84,0.22)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(244,229,167,0.10)",
          }}
        />

        {/* Ticks */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            opacity: tickOpacity,
            maskImage:
              "radial-gradient(circle at 50% 50%, transparent 44%, black 46%, black 55%, transparent 57%)",
            background:
              "conic-gradient(from 220deg, rgba(214,172,84,0.0), rgba(214,172,84,0.28), rgba(214,172,84,0.0))",
          }}
        />

        {/* Inner knob */}
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: knobSize,
            height: knobSize,
            x: "-50%",
            y: "-50%",
            rotate: spring,
            boxShadow: `0 22px 55px rgba(0,0,0,0.55), 0 0 22px rgba(214,172,84,${goldGlow.get()})`,
          }}
          onPointerDown={(e) => {
            isDragging.current = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            setByPointer(e.clientX, e.clientY);
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(22,26,49,0.92), rgba(10,14,33,0.96))",
              border: "1px solid rgba(214,172,84,0.22)",
            }}
          />
          {/* Pointer line */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 h-3 w-[2px] rounded-full bg-[rgba(244,229,167,0.75)] shadow-[0_0_10px_rgba(214,172,84,0.35)]" />
        </motion.div>
      </div>

      <div className="mt-3 flex flex-col items-center">
        <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-[rgba(244,229,167,0.70)]">
          {label}
        </div>
        <div className="mt-1 font-serif text-[12px] text-[#F4E5A7]">
          {Math.round(val * 100)}%
        </div>
      </div>
    </div>
  );
}
