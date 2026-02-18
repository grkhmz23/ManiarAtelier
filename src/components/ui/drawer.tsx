"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
  footer?: React.ReactNode;
  dir?: "ltr" | "rtl";
};

function cn(...v: Array<string | false | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function Drawer({ open, title, onClose, children, widthClassName = "w-full sm:w-[420px]", footer, dir = "ltr" }: DrawerProps) {
  const isRTL = dir === "rtl";
  
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120]" dir={dir}>
          <motion.button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "absolute top-0 h-full flex flex-col",
              isRTL ? "left-0" : "right-0",
              widthClassName,
              "bg-[#0B1026]/95 backdrop-blur-2xl",
              isRTL ? "border-r border-white/10" : "border-l border-white/10",
              "shadow-[0_0_80px_rgba(0,0,0,0.6)]",
            )}
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="px-5 pt-5 pb-4 border-b border-white/[0.08] flex items-start justify-between gap-3 shrink-0">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-mono">Maniar Atelier</div>
                <h2 className="mt-1 font-semibold text-xl text-white/90">{title}</h2>
              </div>
              <button type="button" onClick={onClose} className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-5 overflow-y-auto flex-1 min-h-0">{children}</div>
            {footer && (
              <div className="px-5 py-4 border-t border-white/[0.08] bg-white/[0.02] shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
