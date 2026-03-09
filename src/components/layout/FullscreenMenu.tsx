"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage: (page: PageType) => void;
}

const menuLinkVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  },
};

export default function FullscreenMenu({
  isOpen,
  onClose,
  onNavigatePage,
}: FullscreenMenuProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  const menuItems = [
    { label: t.nav.mensCollection, page: "men" as PageType },
    { label: t.nav.womensCollection, page: "women" as PageType },
    { label: t.nav.brandStory, page: "brand" as PageType },
    { label: t.nav.craftOrigin, page: "craft" as PageType },
    { label: t.nav.journal, page: "journal" as PageType },
    { label: t.nav.shippingReturns, page: "shipping" as PageType },
  ];

  const handleNavigate = (page: PageType) => {
    onNavigatePage(page);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-[#0B1026] text-white overflow-hidden"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Animated Background Gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,172,84,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(244,229,167,0.05)_0%,transparent_50%)]"
          />

          {/* Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Glassmorphism Side Panels */}
          <motion.div
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 w-1/4 bg-white/[0.02] backdrop-blur-sm border-r border-white/5 hidden lg:block"
          />
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 right-0 w-1/4 bg-white/[0.02] backdrop-blur-sm border-l border-white/5 hidden lg:block"
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onClick={onClose}
            className="absolute top-6 md:top-8 left-6 md:left-10 z-20 flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium hover:text-[#D6AC54] transition-colors duration-300 group"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>{t.common.close}</span>
          </motion.button>

          {/* Logo Top Center */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 text-center"
          >
            <span className="text-xl uppercase tracking-[0.25em] font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D0] via-[#D4AF37] to-[#B5922F]">
              MA
            </span>
          </motion.div>

          {/* Main Navigation */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { 
                  transition: { 
                    staggerChildren: 0.08, 
                    delayChildren: 0.3 
                  } 
                },
                hidden: { 
                  transition: { 
                    staggerChildren: 0.05, 
                    staggerDirection: -1 
                  } 
                },
              }}
              className="flex flex-col items-center space-y-4 md:space-y-6"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.page}
                  variants={menuLinkVariants}
                  className="relative group"
                >
                  {/* Hover indicator line */}
                  <motion.div
                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-[#D6AC54] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  />
                  
                  <button
                    onClick={() => handleNavigate(item.page)}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight text-white/90 hover:text-[#F4E5A7] transition-all duration-500 relative"
                  >
                    <span className="relative z-10 group-hover:italic transition-all duration-300">
                      {item.label}
                    </span>
                    
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 blur-2xl bg-[#D6AC54]/0 group-hover:bg-[#D6AC54]/10 transition-all duration-500 -z-10" />
                  </button>

                  {/* Index number */}
                  <span className="absolute -right-8 top-2 text-[10px] text-white/30 font-mono tracking-wider">
                    0{index + 1}
                  </span>
                </motion.div>
              ))}
            </motion.nav>

            {/* Bottom Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-8 md:bottom-12 flex flex-col md:flex-row items-center gap-4 md:gap-12 text-[10px] tracking-[0.2em] uppercase text-white/40"
            >
              <span className="hover:text-[#D6AC54] transition-colors cursor-pointer">
                {t.footer.tagline}
              </span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />
              <span>© 2026 Maniar Atelier</span>
            </motion.div>

            {/* Decorative Gold Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6AC54]/50 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
