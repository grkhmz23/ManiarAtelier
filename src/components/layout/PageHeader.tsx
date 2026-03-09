"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Menu } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";

interface PageHeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  cartCount: number;
}

export default function PageHeader({
  onOpenMenu,
  onOpenCart,
  onNavigateHome,
  cartCount,
}: PageHeaderProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 z-[200]">
      <div className="mx-auto w-full px-3 sm:px-4 md:px-8 pt-3">
        <motion.nav
          className="relative w-full rounded-2xl border border-white/10 bg-[#0B1026]/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Subtle top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/30 to-transparent" />

          <div className="relative px-4 md:px-6 h-[56px] md:h-[60px] flex items-center justify-between gap-4">
            {/* Left: Menu Button */}
            <button
              type="button"
              onClick={onOpenMenu}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-[#D6AC54] transition-colors"
              aria-label={t.common.menu}
            >
              <Menu size={16} />
              <span className="hidden sm:inline">{t.common.menu}</span>
            </button>

            {/* Center: Logo */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center hover:opacity-80 transition-opacity"
              aria-label={t.nav.home}
            >
              <span className="text-xl md:text-2xl uppercase tracking-[0.25em] font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D0] via-[#D4AF37] to-[#B5922F]">
                MA
              </span>
              <span className="text-[7px] tracking-[0.4em] uppercase text-white/40 -mt-1">
                Atelier
              </span>
            </button>

            {/* Right: Cart */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-[#D6AC54] transition-colors"
            >
              <span className="hidden sm:inline">{t.common.cart}</span>
              <div className="relative">
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D6AC54] text-[#0B1026] text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
