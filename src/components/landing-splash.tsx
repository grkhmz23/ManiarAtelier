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

      {/* Logo and Enter Button */}
      <AnimatePresence>
        {startVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-12"
          >
            {/* Maniar Logo */}
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
                className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_25px_rgba(214,172,84,0.3)]"
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
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6AC54]/0 via-[#D6AC54]/20 to-[#D6AC54]/0 blur-xl group-hover:via-[#D6AC54]/30 transition-all duration-700" />
              
              {/* Border */}
              <div className="absolute inset-0 rounded-full border border-[#D6AC54]/40 group-hover:border-[#F4E5A7]/60 transition-all duration-700" />
              
              {/* Text */}
              <span className="relative text-[#F4E5A7] text-2xl md:text-3xl tracking-[0.3em] uppercase font-light group-hover:tracking-[0.4em] transition-all duration-700 group-hover:text-[#D6AC54] drop-shadow-[0_0_10px_rgba(244,229,167,0.3)]">
                Enter
              </span>

              {/* Animated pulse */}
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
