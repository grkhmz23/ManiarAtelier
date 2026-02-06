"use client";

import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LandingSplashProps = {
  onEnter: () => void;
};

export function LandingSplash({ onEnter }: LandingSplashProps) {
  const [startVisible, setStartVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#070817] z-[100]">
      {/* Spiral Animation */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* Logo + Enter + Subtitle — single centered column */}
      <AnimatePresence>
        {startVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 blur-2xl bg-[#D6AC54]/20 rounded-full" />
              <img
                src="/logo-transparent.png"
                alt="Maniar"
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain drop-shadow-[0_0_25px_rgba(214,172,84,0.3)]"
              />
            </motion.div>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              onClick={onEnter}
              className="group relative px-12 py-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6AC54]/0 via-[#D6AC54]/20 to-[#D6AC54]/0 blur-xl group-hover:via-[#D6AC54]/30 transition-all duration-700" />
              <div className="absolute inset-0 rounded-full border border-[#D6AC54]/40 group-hover:border-[#F4E5A7]/60 transition-all duration-700" />
              <span className="relative text-[#F4E5A7] text-xl sm:text-2xl md:text-3xl tracking-[0.2em] sm:tracking-[0.3em] uppercase font-light group-hover:tracking-[0.4em] transition-all duration-700 group-hover:text-[#D6AC54] drop-shadow-[0_0_10px_rgba(244,229,167,0.3)]">
                Enter
              </span>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#D6AC54]/60"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.button>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="text-[#F4E5A7]/60 text-sm md:text-base tracking-[0.2em] uppercase font-light"
            >
              Moroccan Heritage • Modern Elegance
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
