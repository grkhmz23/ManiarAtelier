"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";

interface TransparentHeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onNavigateHome?: () => void;
}

export default function TransparentHeader({
  onOpenMenu,
  onOpenCart,
  cartCount,
  onNavigateHome,
}: TransparentHeaderProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 w-full z-50 px-6 md:px-10 py-6 md:py-8 flex justify-between items-center text-white mix-blend-difference pointer-events-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Menu Button */}
      <button
        onClick={onOpenMenu}
        className="text-xs uppercase tracking-[0.2em] font-medium pointer-events-auto hover:text-[#D6AC54] transition-colors duration-300"
      >
        {t.common.menu}
      </button>

      {/* Center Logo */}
      <button
        onClick={onNavigateHome}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto group"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl uppercase tracking-[0.25em] font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D0] via-[#D4AF37] to-[#B5922F] group-hover:from-white group-hover:via-[#F4E5A7] group-hover:to-[#D6AC54] transition-all duration-500">
            MA
          </span>
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/50 mt-1">
            Atelier
          </span>
        </div>
      </button>

      {/* Cart Button */}
      <button
        onClick={onOpenCart}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium pointer-events-auto hover:text-[#D6AC54] transition-colors duration-300"
      >
        <span className="hidden sm:inline">{t.common.cart}</span>
        <div className="relative">
          <ShoppingBag size={16} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D6AC54] text-[#0B1026] text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </button>
    </motion.header>
  );
}
