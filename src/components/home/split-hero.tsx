"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation, useLanguage } from "@/i18n";

// ============================================================================
// COMPONENT: SplitPanel
// A highly reusable sub-component for the left/right visual zones.
// ============================================================================
interface SplitPanelProps {
  id: "women" | "men";
  hoveredSide: "women" | "men" | null;
  setHoveredSide: (side: "women" | "men" | null) => void;
  bgImage: string;
  onClick: () => void;
}

const SplitPanel: React.FC<SplitPanelProps> = ({
  id,
  hoveredSide,
  setHoveredSide,
  bgImage,
  onClick,
}) => {
  const isHovered = hoveredSide === id;
  const isOtherHovered = hoveredSide !== null && hoveredSide !== id;

  return (
    <div
      className="relative flex-1 h-full w-full overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHoveredSide(id)}
      onMouseLeave={() => setHoveredSide(null)}
      onClick={onClick}
    >
      {/* Image Background with Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
        initial={{ scale: 1.05 }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          filter: isOtherHovered
            ? "brightness(0.5) contrast(1.1) grayscale(0.6)"
            : "brightness(0.75) contrast(1.05) grayscale(0)",
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Gradient Overlay for depth */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          id === "women" 
            ? "bg-gradient-to-r from-[#0B1026]/60 via-transparent to-transparent" 
            : "bg-gradient-to-l from-[#0B1026]/60 via-transparent to-transparent"
        }`} 
      />

      {/* Gold accent line on hover */}
      <motion.div
        className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D6AC54] to-transparent ${
          id === "women" ? "right-0" : "left-0"
        }`}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scaleY: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Panel Label */}
      <motion.div
        className={`absolute bottom-12 ${id === "women" ? "left-8" : "right-8"} z-20`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0.6,
          y: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D6AC54] block mb-2">
          {id === "women" ? "The Feminine Edit" : "The Gentleman's Edit"}
        </span>
        <span className="text-2xl md:text-3xl font-serif text-white/90 capitalize">
          {id}
        </span>
      </motion.div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,16,38,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

// ============================================================================
// COMPONENT: SplitHero
// The main production-ready hero section for Maniar Atelier.
// ============================================================================
interface SplitHeroProps {
  onOpenWomen: () => void;
  onOpenMen: () => void;
  onShopNow: () => void;
}

export function SplitHero({ onOpenWomen, onOpenMen, onShopNow }: SplitHeroProps) {
  const [hoveredSide, setHoveredSide] = useState<"women" | "men" | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const t = useTranslation();
  const { isRTL } = useLanguage();

  // Mouse spotlight effect
  useEffect(() => {
    if (reduceMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, [reduceMotion]);

  // Motion Variants for elegant, staggered typography entrances
  const fadeUpContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-[#0B1026] text-white overflow-hidden flex flex-col md:flex-row"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mouse-following Spotlight Effect */}
      {!reduceMotion && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-40"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(214,172,84,0.08), transparent 40%)`,
          }}
        />
      )}

      {/* Panel Left: Women */}
      <SplitPanel
        id="women"
        hoveredSide={hoveredSide}
        setHoveredSide={setHoveredSide}
        bgImage="/images/verde-acqua.png"
        onClick={onOpenWomen}
      />

      {/* Center Divider Line (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent z-10 pointer-events-none">
        {/* Gold accent on divider */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D6AC54]"
          animate={{
            scale: hoveredSide ? [1, 1.5, 1] : 1,
            opacity: hoveredSide ? [0.5, 1, 0.5] : 0.5,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Panel Right: Men */}
      <SplitPanel
        id="men"
        hoveredSide={hoveredSide}
        setHoveredSide={setHoveredSide}
        bgImage="/images/uomo-gilet.png"
        onClick={onOpenMen}
      />

      {/* Absolute Grain Texture - CSS Only */}
      <div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vertical Edge Label (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] tracking-[0.3em] text-white/40 uppercase z-20 mix-blend-difference pointer-events-none"
      >
        SS26 / {t.hero.kicker}
      </motion.div>

      {/* Center Content Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-6">
        {/* Radial gradient behind text for readability */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,16,38,0.85)_0%,rgba(11,16,38,0.4)_50%,transparent_80%)]" />

        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          animate="visible"
          className="relative z-30 flex flex-col items-center text-center max-w-2xl mt-16 md:mt-0"
        >
          {/* Brand Kicker */}
          <motion.div
            variants={fadeUpItem}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D6AC54]/30 bg-[#D6AC54]/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6AC54] animate-pulse" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#F4E5A7]">
                {t.hero.atelier}
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
              {t.hero.title}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUpItem}
            className="max-w-md mx-auto text-sm md:text-base text-white/60 font-light leading-relaxed mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            variants={fadeUpItem}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto pointer-events-auto"
          >
            {/* Shop Women Button */}
            <button
              onClick={onOpenWomen}
              className="group relative px-10 py-4 bg-transparent border border-white/30 text-white overflow-hidden flex-1 sm:flex-none hover:border-[#D6AC54]/50 transition-colors duration-500"
            >
              <span className="relative z-10 text-xs tracking-[0.2em] uppercase font-medium group-hover:text-[#0B1026] transition-colors duration-500">
                {t.hero.women}
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            </button>

            {/* Shop Men Button */}
            <button
              onClick={onOpenMen}
              className="group relative px-10 py-4 bg-[#D6AC54] text-[#0B1026] overflow-hidden flex-1 sm:flex-none border border-[#D6AC54]"
            >
              <span className="relative z-10 text-xs tracking-[0.2em] uppercase font-medium group-hover:text-white transition-colors duration-500">
                {t.hero.men}
              </span>
              <div className="absolute inset-0 bg-[#0B1026] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            </button>
          </motion.div>

          {/* Secondary Link */}
          <motion.div variants={fadeUpItem} className="mt-8 pointer-events-auto">
            <button
              onClick={onShopNow}
              className="text-xs tracking-[0.2em] uppercase text-white/60 border-b border-white/20 pb-1 hover:text-[#F4E5A7] hover:border-[#D6AC54] transition-all duration-300"
            >
              {t.hero.shopNewIn}
            </button>
          </motion.div>

          {/* Trust Line */}
          <motion.div
            variants={fadeUpItem}
            className="mt-16 md:mt-20 flex items-center gap-4 text-[9px] md:text-[10px] tracking-[0.2em] text-white/30 uppercase"
          >
            <span>{t.hero.fastShipping}</span>
            <span className="w-1 h-1 rounded-full bg-[#D6AC54]/50" />
            <span>{t.hero.trackedDelivery}</span>
            <span className="w-1 h-1 rounded-full bg-[#D6AC54]/50" />
            <span className="text-[#D6AC54]/70">{t.hero.tagline}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1026] to-transparent pointer-events-none z-10" />
    </section>
  );
}
