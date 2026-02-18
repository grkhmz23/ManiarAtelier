"use client";

import React, { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type AtelierHeroProps = {
  onShopNow: () => void;
  onOpenMen: () => void;
  onOpenWomen: () => void;
};

export function AtelierHero({ onShopNow, onOpenMen, onOpenWomen }: AtelierHeroProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const images = useMemo(
    () => [
      { src: "/images/model-blue-long.png", alt: "Maniar Atelier look 01" },
      { src: "/images/nero-oro.png", alt: "Maniar Atelier look 02" },
      { src: "/images/red-head.png", alt: "Maniar Atelier look 03" },
    ],
    []
  );

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `35%`);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#0B1026] shadow-[0_40px_140px_rgba(0,0,0,0.65)] mx-4 sm:mx-0"
      style={{ "--mx": "50%", "--my": "35%" } as React.CSSProperties}
      aria-label="Maniar Atelier hero"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_25%_20%,rgba(244,229,167,0.14),transparent_55%),radial-gradient(850px_circle_at_80%_30%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_circle_at_55%_90%,rgba(244,229,167,0.10),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx) var(--my), rgba(255,255,255,0.12), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(1400px_circle_at_50%_0%,rgba(0,0,0,0.0),rgba(0,0,0,0.65))]" />
      </div>

      <div className="relative z-10 grid gap-8 p-6 sm:p-7 md:grid-cols-12 md:gap-10 md:p-12">
        {/* Left: copy */}
        <div className="md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D6AC54]/15 bg-[#D6AC54]/5 px-3 py-1 text-[10px] sm:text-[12px] text-white/80 backdrop-blur">
              {t.hero.kicker}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mt-5 text-balance text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-6xl"
          >
            {t.hero.title}
            <span className="block text-white/80">{t.hero.subtitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 max-w-xl text-pretty text-sm sm:text-base leading-relaxed text-white/70 md:text-lg"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-7 flex flex-wrap gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={onShopNow}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_20px_60px_rgba(255,255,255,0.15)] transition hover:translate-y-[-1px] flex-1 sm:flex-none"
            >
              {t.hero.shopNewIn}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={onOpenWomen}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 flex-1 sm:flex-none"
            >
              {t.hero.women}
            </button>

            <button
              type="button"
              onClick={onOpenMen}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 flex-1 sm:flex-none"
            >
              {t.hero.men}
            </button>
          </motion.div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/75 backdrop-blur flex items-center gap-3 sm:block">
              <div className="flex items-center gap-2 font-semibold text-white/90">
                <span className="text-[#D6AC54]">✦</span> {t.hero.fastShipping}
              </div>
              <div className="text-xs text-white/60 sm:mt-1">{t.hero.trackedDelivery}</div>
            </div>
          </div>
        </div>

        {/* Right: lookbook stack */}
        <div className="md:col-span-5 min-h-[350px]">
          <div className="relative h-[350px] w-full md:h-[520px]">
            {images.map((img, i) => {
              const base =
                i === 0
                  ? "translate-x-0 translate-y-4 sm:translate-y-6 rotate-[-2deg]"
                  : i === 1
                  ? "translate-x-4 sm:translate-x-8 translate-y-0 rotate-[2deg]"
                  : "translate-x-2 translate-y-10 sm:translate-y-14 rotate-[6deg]";
              return (
                <motion.div
                  key={img.src}
                  className={cn(
                    "absolute inset-0 mx-auto w-[90%] sm:w-[86%] overflow-hidden rounded-[28px] border border-[#D6AC54]/15 bg-[#D6AC54]/5 shadow-[0_30px_110px_rgba(0,0,0,0.6)] backdrop-blur",
                    base
                  )}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.12 + i * 0.08 }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
