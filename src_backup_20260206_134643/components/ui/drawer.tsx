"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
  footer?: React.ReactNode;
};

export default function Drawer({
  open,
  title,
  onClose,
  children,
  widthClassName = "w-full sm:w-[420px]",
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120]">
          <motion.button
            type="button"
            aria-label="Close drawer backdrop"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "absolute right-0 top-0 h-full",
              widthClassName,
              "bg-[rgba(7,8,23,0.92)]",
              "border-l border-[rgba(214,172,84,0.16)]",
              "elevation-modal",
            )}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="px-5 pt-5 pb-4 border-b border-[rgba(214,172,84,0.14)] flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-[rgba(244,229,167,0.60)] font-mono">
                  Maniar Atelier
                </div>
                <h2 className="font-serif text-xl tracking-tight text-[#F4E5A7]">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] hover:bg-[rgba(22,26,49,0.65)] flex items-center justify-center text-[rgba(244,229,167,0.85)] elevation-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5 overflow-y-auto h-[calc(100%-136px)]">
              {children}
            </div>

            {footer && (
              <div className="px-5 py-4 border-t border-[rgba(214,172,84,0.14)] bg-[rgba(10,14,33,0.70)]">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
