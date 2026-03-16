"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu, ShoppingBag } from "lucide-react";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useTranslation, useLanguage } from "@/i18n";

interface SimpleHeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  cartCount: number;
}

export default function SimpleHeader({
  onOpenMenu,
  onOpenCart,
  onNavigateHome,
  cartCount,
}: SimpleHeaderProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <>
    {/* Sale Banner */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[201] bg-[#D6AC54] text-[#0B1026] pointer-events-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-center py-2 px-4">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
          {t.hero.saleBanner}
        </span>
      </div>
    </motion.div>

    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed top-8 left-0 right-0 z-[200] pointer-events-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start justify-between p-6 md:p-8">
        {/* Left: Menu Button */}
        <button
          onClick={onOpenMenu}
          className="pointer-events-auto flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white mix-blend-difference hover:opacity-70 transition-opacity"
        >
          <Menu size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">{t.common.menu}</span>
        </button>

        {/* Center: Logo (absolute centered) */}
        <button
          onClick={onNavigateHome}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 group"
        >
          <img 
            src="/logo-transparent.png" 
            alt="Maniar Atelier" 
            className="h-10 md:h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </button>

        {/* Right: Language + Cart */}
        <div className="pointer-events-auto flex items-center gap-4">
          <LanguageSelector variant="minimal" />
          
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white mix-blend-difference hover:opacity-70 transition-opacity"
          >
            <span className="hidden sm:inline">{t.common.cart}</span>
            <div className="relative">
              <ShoppingBag size={16} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#D6AC54] text-[#0B1026] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </motion.header>
    </>
  );
}
