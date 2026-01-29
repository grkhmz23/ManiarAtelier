"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Product, ProductSize, formatEUR } from "@/lib/catalog";

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL"];

export default function ProductModal({
  open,
  product,
  onClose,
  onAdd,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, size: ProductSize) => void;
}) {
  const [size, setSize] = useState<ProductSize>("M");

  const sizes = useMemo(() => SIZES, []);

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close product modal"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-[960px] overflow-hidden rounded-[26px] border border-[rgba(214,172,84,0.18)] border-b-[3px] border-b-[rgba(3,4,10,0.95)] elevation-modal"
            style={{
              background:
                "linear-gradient(180deg, rgba(22,26,49,0.88), rgba(7,8,23,0.94))",
            }}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.10] bg-[repeating-linear-gradient(45deg,rgba(214,172,84,0.45),rgba(214,172,84,0.45)_1px,transparent_1px,transparent_12px)]" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.55)] hover:bg-[rgba(22,26,49,0.70)] text-[#F4E5A7] flex items-center justify-center z-10 elevation-btn"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative">
                <div className="aspect-[4/5] md:aspect-auto md:h-full bg-[rgba(10,14,33,0.75)] elevation-image rounded-tl-[26px] md:rounded-bl-[26px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />
              </div>

              <div className="p-6 md:p-8">
                <div className="watch-chip inline-flex">Atelier Edition</div>
                <h3 className="mt-4 font-serif text-3xl md:text-4xl text-[#F4E5A7]">
                  {product.name}
                </h3>
                <div className="mt-2 text-[rgba(244,229,167,0.70)]">
                  {formatEUR(product.priceEUR)}
                </div>

                <p className="mt-6 text-[rgba(244,229,167,0.72)] leading-relaxed">
                  Tailored lines, archival fabrics, and a silhouette cut to sit like a
                  complication on the wrist: precise, quiet, and unmistakably luxury.
                </p>

                <div className="mt-7">
                  <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                    Select size
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={
                          s === size
                            ? "px-4 h-10 rounded-full border border-[rgba(214,172,84,0.55)] border-b-2 border-b-[rgba(150,110,30,0.6)] bg-[rgba(214,172,84,0.16)] text-[#F4E5A7] font-mono text-[12px] elevation-btn"
                            : "px-4 h-10 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.62)] text-[rgba(244,229,167,0.82)] hover:bg-[rgba(22,26,49,0.70)] font-mono text-[12px] elevation-btn"
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="watch-btn watch-btn-primary h-12 px-6 text-sm elevation-btn"
                    onClick={() => onAdd(product, size)}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="watch-btn h-12 px-6 text-sm elevation-btn"
                    onClick={onClose}
                  >
                    Continue browsing
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="watch-surface p-4 elevation-sm">
                    <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                      Fabric
                    </div>
                    <div className="mt-2 font-serif text-[#F4E5A7]">
                      Atlas blend
                    </div>
                  </div>
                  <div className="watch-surface p-4 elevation-sm">
                    <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                      Finish
                    </div>
                    <div className="mt-2 font-serif text-[#F4E5A7]">
                      Hand-sewn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
