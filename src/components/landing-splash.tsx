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
        initial: { opacity: 0, y: 15, filter: "blur(5px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(5px)" },
      },
    }),
    []
  );

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#040615] z-[100]">
      {/* Animation Background */}
      <div className="absolute inset-0 z-0">
        <SpiralAnimation
          logoSrc="/logo-transparent.png"
          onStageChange={(s) => setStage(s)}
        />
      </div>

      {/* LAYOUT FIX: Changed top-[60%] to top-[48%]
        This moves the entire text block up, closer to the logo.
      */}
      <div className="absolute inset-x-0 top-[48%] z-10 flex flex-col items-center pointer-events-none">
        <AnimatePresence>
          {showWordmark && (
            <motion.div
              key="wordmark"
              {...variants.fadeUp}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center flex flex-col items-center"
            >
              {/* GOLD GRADIENT TEXT */}
              <div className="font-serif tracking-[0.2em] text-4xl sm:text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D0] via-[#D4AF37] to-[#B5922F] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                MANIAR
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-[#D4AF37]">
                <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                <div className="text-[10px] sm:text-[12px] tracking-[0.6em] font-light uppercase text-[#E6C25F]">
                  Atelier
                </div>
                <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-10" />

        <AnimatePresence>
          {showEnterUI && (
            <motion.div
              key="ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="flex flex-col items-center w-full"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                onClick={onEnter}
                className="group relative px-12 py-3 pointer-events-auto cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#D4AF37]/5 blur-xl group-hover:bg-[#D4AF37]/15 transition-all duration-700" />
                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 group-hover:border-[#F9F1D0]/80 transition-all duration-500" />
                <span className="relative text-[#F9F1D0] text-sm sm:text-base tracking-[0.3em] uppercase font-light group-hover:text-white transition-colors duration-500">
                  Enter
                </span>
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#D4AF37]/20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>

              <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.0, duration: 1 }}
                 className="mt-6 text-[#D4AF37]/40 text-[10px] tracking-[0.2em] uppercase"
              >
                Moroccan Heritage · Modern Elegance
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}