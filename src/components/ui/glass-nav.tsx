"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag, Menu } from "lucide-react";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useTranslation, useLanguage } from "@/i18n";

export type NavSection = "hero" | "collection" | "atelier" | "journal" | "about";

export type GlassNavProps = {
  section: NavSection;
  onNavigate: (to: NavSection) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenMenu: () => void;
};

function cn(...v: Array<string | false | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function GlassNav({
  section,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenMenu,
}: GlassNavProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  const NAV: { id: NavSection; label: string }[] = [
    { id: "hero", label: t.nav.home },
    { id: "collection", label: t.nav.collection },
    { id: "atelier", label: t.nav.atelier },
    { id: "journal", label: t.nav.journal },
    { id: "about", label: t.nav.about },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[200]">
      <div className="mx-auto w-full px-3 sm:px-4 md:px-8 pt-3">
        <motion.nav
          className={cn(
            "relative w-full rounded-2xl",
            "border border-white/10",
            "bg-[#0B1026]/70 backdrop-blur-2xl",
            "shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
          )}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Subtle top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/30 to-transparent" />

          <div className="relative px-4 md:px-6 h-[56px] md:h-[60px] flex items-center justify-between gap-4">
            {/* Left: Logo */}
            <button
              type="button"
              onClick={() => onNavigate("hero")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label={t.nav.home}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <img src="/logoManiar.jpeg" alt="Maniar" className="h-full w-full object-cover" />
              </div>
              <span className="hidden sm:block font-semibold text-[15px] text-white/90 tracking-[-0.01em]">
                Maniar
              </span>
            </button>

            {/* Center: Nav pills */}
            <div className="hidden lg:flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
              {NAV.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onNavigate(it.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                    section === it.id
                      ? "bg-[#D6AC54]/15 text-[#F4E5A7] shadow-sm"
                      : "text-white/50 hover:text-white/75 hover:bg-white/[0.04]",
                  )}
                >
                  {it.label}
                </button>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSelector variant="compact" />
              
              <button
                type="button"
                onClick={onOpenChat}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label={t.common.concierge}
              >
                <MessageCircle size={15} />
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className={cn(
                  "h-8 rounded-full border border-white/10 bg-white/5 flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-all",
                  cartCount > 0 ? "px-3" : "w-8 justify-center",
                )}
              >
                <ShoppingBag size={15} />
                {cartCount > 0 && (
                  <span className="text-[11px] font-semibold text-white/90">{cartCount}</span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenMenu}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label={t.common.menu}
              >
                <Menu size={15} />
              </button>
            </div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
