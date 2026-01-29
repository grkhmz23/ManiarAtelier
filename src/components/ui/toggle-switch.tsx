"use client";

import React, { useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface IndustrialSwitchProps {
  initialValue?: boolean;
  onToggle?: (val: boolean) => void;
  labelOff?: string;
  labelOn?: string;
  size?: "xs" | "sm" | "md";
}

export default function IndustrialSwitch({
  initialValue = false,
  onToggle,
  labelOff = "HIDDEN",
  labelOn = "REVEALED",
  size = "sm",
}: IndustrialSwitchProps) {
  const [isOn, setIsOn] = useState(initialValue);

  const MAX_TRAVEL = size === "xs" ? 36 : size === "sm" ? 46 : 72;
  const y = useMotionValue(initialValue ? MAX_TRAVEL : 0);

  const springY = useSpring(y, { stiffness: 520, damping: 34, mass: 1.2 });

  // Brand colors: gold LED
  const ledColor = useTransform(springY, [0, MAX_TRAVEL], ["rgba(214,172,84,0.25)", "#D6AC54"]);
  const ledGlow = useTransform(springY, [0, MAX_TRAVEL], [
    "0px 0px 0px rgba(0,0,0,0)",
    "0px 0px 18px rgba(214,172,84,0.55)",
  ]);

  const handleBg = useTransform(springY, [0, MAX_TRAVEL], [
    "linear-gradient(180deg, rgba(22,26,49,0.95) 0%, rgba(10,14,33,0.95) 100%)",
    "linear-gradient(180deg, rgba(214,172,84,0.20) 0%, rgba(10,14,33,0.96) 100%)",
  ]);

  const textOpacityOff = useTransform(springY, [0, MAX_TRAVEL * 0.4], [1, 0]);
  const textOpacityOn = useTransform(springY, [MAX_TRAVEL * 0.4, MAX_TRAVEL], [0, 1]);
  const handleScale = useTransform(springY, [MAX_TRAVEL - 10, MAX_TRAVEL], [1, 0.985]);

  const handleDragEnd = () => {
    const currentY = y.get();
    const next = currentY > MAX_TRAVEL / 2;
    setIsOn(next);
    y.set(next ? MAX_TRAVEL : 0);
    onToggle?.(next);
  };

  const toggleClick = () => {
    const next = !isOn;
    setIsOn(next);
    y.set(next ? MAX_TRAVEL : 0);
    onToggle?.(next);
  };

  const sizeClasses = {
    xs: { housing: "w-16 h-28", handle: "w-12 h-14", led: "w-10 h-1.5", rail: "w-3" },
    sm: { housing: "w-20 h-36", handle: "w-16 h-20", led: "w-12 h-1.5", rail: "w-4" },
    md: { housing: "w-28 h-56", handle: "w-24 h-32", led: "w-16 h-2", rail: "w-6" },
  }[size];

  return (
    <div className="relative">
      <div
        className={[
          "relative rounded-2xl flex justify-center p-2",
          sizeClasses.housing,
        ].join(" ")}
        style={{
          background: "rgba(10,14,33,0.72)",
          border: "1px solid rgba(214,172,84,0.16)",
          boxShadow:
            "0 20px 55px rgba(0,0,0,0.55), inset 0 1px 0 rgba(244,229,167,0.10)",
        }}
      >
        {/* subtle pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-[0.06] pointer-events-none">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(214,172,84,0.35),rgba(214,172,84,0.35)_1px,transparent_1px,transparent_10px)]" />
        </div>

        {/* Rail Slot */}
        <div
          className={[
            "absolute rounded-full",
            size === "xs" ? "top-3 bottom-3" : size === "sm" ? "top-4 bottom-4" : "top-6 bottom-6",
            sizeClasses.rail,
          ].join(" ")}
          style={{
            background: "rgba(0,0,0,0.28)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.45)",
          }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[rgba(214,172,84,0.16)]" />
        </div>

        {/* Status LED */}
        <motion.div
          style={{ backgroundColor: ledColor, boxShadow: ledGlow }}
          className={[
            "absolute -top-2 rounded-full z-20 border",
            sizeClasses.led,
          ].join(" ")}
        />

        {/* Draggable Handle */}
        <motion.div
          className={`relative z-10 ${sizeClasses.handle} cursor-grab active:cursor-grabbing touch-none`}
          style={{ y: springY, scale: handleScale }}
          drag="y"
          dragConstraints={{ top: 0, bottom: MAX_TRAVEL }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onClick={toggleClick}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            style={{ background: handleBg }}
            className="w-full h-full rounded-xl border flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div
              className={[
                "absolute flex flex-col gap-1 opacity-25",
                size === "xs" ? "top-2 w-8" : size === "sm" ? "top-2 w-10" : "top-3 w-16",
              ].join(" ")}
            >
              <div className="h-px w-full bg-[rgba(244,229,167,0.8)] rounded-full" />
              <div className="h-px w-full bg-[rgba(244,229,167,0.8)] rounded-full" />
            </div>

            <motion.div
              className={[
                "relative w-full h-6 flex items-center justify-center font-serif",
                size === "xs" ? "mt-1" : size === "sm" ? "mt-2" : "mt-4",
              ].join(" ")}
            >
              <motion.span
                style={{ opacity: textOpacityOff }}
                className={[
                  "absolute font-medium tracking-[0.18em]",
                  size === "xs" ? "text-[7px]" : size === "sm" ? "text-[8px]" : "text-[10px]",
                ].join(" ")}
              >
                {labelOff}
              </motion.span>
              <motion.span
                style={{ opacity: textOpacityOn }}
                className={[
                  "absolute font-medium tracking-[0.18em] text-[#E4C97C] drop-shadow-[0_0_10px_rgba(214,172,84,0.55)]",
                  size === "xs" ? "text-[7px]" : size === "sm" ? "text-[8px]" : "text-[10px]",
                ].join(" ")}
              >
                {labelOn}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className={`absolute ${size === "xs" ? "top-4" : size === "sm" ? "top-5" : "top-8"} right-0.5 text-[7px] text-[rgba(244,229,167,0.35)] font-mono rotate-90 origin-left tracking-widest`}>
          OFF
        </div>
        <div className={`absolute ${size === "xs" ? "bottom-4" : size === "sm" ? "bottom-5" : "bottom-8"} right-0.5 text-[7px] text-[rgba(244,229,167,0.35)] font-mono rotate-90 origin-left tracking-widest`}>
          ON
        </div>
      </div>
    </div>
  );
}
