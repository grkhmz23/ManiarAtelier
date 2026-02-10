"use client";

import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LandingSplashProps = {
  onEnter: () => void;
};

export function LandingSplash({ onEnter }: LandingSplashProps) {
  const [stage, setStage] = useState<"storm" | "formLogo" | "settle" | "done">("storm");

  const showWordmark = stage === "settle" || stage === "done";
  const showEnterUI = stage === "done";

  const variants = useMemo(
    () => ({
      fadeUp: {
        initial: { opacity: 0, y: 10, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(8px)" },
      },
    }),
    []
  );

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0B1026] z-[100]">
      <div className="absolute inset-0">
        <SpiralAnimation
          logoSrc="/logo-transparent.png"
          onStageChange={(s) => setStage(s)}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh]">
        <AnimatePresence>
          {showWordmark && (
            <motion.div
              key="wordmark"
              {...variants.fadeUp}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-center"
            >
              <div className="text-[#F4E5A7] font-serif tracking-[0.18em] text-3xl sm:text-4xl md:text-5xl drop-shadow-[0_0_18px_rgba(244,229,167,0.18)]">
                MANIAR
              </div>

              <div className="mt-2 flex items-center justify-center gap-4 text-[#F4E5A7]/70">
                <span className="h-px w-12 bg-[#D6AC54]/35" />
                <div className="text-[11px] sm:text-[12px] tracking-[0.55em] font-light">
                  ATELIER
                </div>
                <span className="h-px w-12 bg-[#D6AC54]/35" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showEnterUI && (
          <motion.div
            key="ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-[3vh]"
          >
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={onEnter}
              className="group relative px-14 py-4 pointer-events-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6AC54]/0 via-[#D6AC54]/18 to-[#D6AC54]/0 blur-xl group-hover:via-[#D6AC54]/28 transition-all duration-700" />
              <div className="absolute inset-0 rounded-full border border-[#D6AC54]/35 group-hover:border-[#F4E5A7]/55 transition-all duration-700" />
              <span className="relative text-[#F4E5A7] text-lg sm:text-xl md:text-2xl tracking-[0.25em] uppercase font-light group-hover:tracking-[0.4em] transition-all duration-700 drop-shadow-[0_0_10px_rgba(244,229,167,0.25)]">
                Enter
              </span>
              <motion.div
                className="absolute inset-0 rounded-full border border-[#D6AC54]/40"
                animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.button>

            <div className="h-5" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 1.2 }}
              className="text-[#F4E5A7]/45 text-xs tracking-[0.2em] uppercase font-light"
            >
              Moroccan Heritage · Modern Elegance
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
