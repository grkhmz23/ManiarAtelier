"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductSize, formatEUR } from "@/lib/catalog";

export default function ProductModal({
  open, product, onClose, onAdd,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, size: ProductSize) => void;
}) {
  const [size, setSize] = useState<ProductSize>("M");
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) { setImgIdx(0); setSize(product.sizes.includes("M") ? "M" : product.sizes[0]); setAdded(false); }
  }, [product]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const images = useMemo(() => product?.images ?? [], [product]);

  const handleAdd = () => {
    if (!product) return;
    onAdd(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center">
          <motion.button type="button" aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          <motion.div
            className="relative w-full sm:w-[min(960px,calc(100vw-24px))] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-t-[24px] sm:rounded-[28px] border border-white/10 bg-[#0B1026]/95 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button type="button" onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center z-20 transition" aria-label="Close">
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery */}
              <div className="relative">
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-black/30 rounded-tl-[24px] sm:rounded-tl-[28px] md:rounded-bl-[28px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img key={images[imgIdx]} src={images[imgIdx]} alt={`${product.name} ${imgIdx + 1}`} className="w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                  {images.length > 1 && (
                    <>
                      <button type="button" onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white/70 flex items-center justify-center z-10 hover:bg-black/60 transition" aria-label="Previous">
                        <ChevronLeft size={20} />
                      </button>
                      <button type="button" onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/15 text-white/70 flex items-center justify-center z-10 hover:bg-black/60 transition" aria-label="Next">
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, i) => (
                        <button key={i} type="button" onClick={() => setImgIdx(i)} className={`h-2 rounded-full transition-all ${i === imgIdx ? "w-6 bg-[#D6AC54]" : "w-2 bg-white/35 hover:bg-white/55"}`} aria-label={`Image ${i + 1}`} />
                      ))}
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="hidden md:flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={i} type="button" onClick={() => setImgIdx(i)} className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-white/50 opacity-100" : "border-transparent opacity-50 hover:opacity-75"}`}>
                        <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6 md:p-8">
                {product.badge && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-white/70 backdrop-blur">{product.badge}</span>
                )}
                <h3 className="mt-3 font-semibold text-2xl sm:text-3xl md:text-4xl text-white/90">{product.name}</h3>
                <div className="mt-2 text-white/55 text-lg">{formatEUR(product.priceEUR)}</div>

                <p className="mt-5 text-white/55 leading-relaxed text-sm sm:text-base">{product.description}</p>

                <div className="mt-5">
                  <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">Materials</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.materials.map((m) => (
                      <span key={m} className="px-3 py-1 rounded-full text-xs bg-white/[0.04] border border-white/10 text-white/60">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">Select size</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button key={s} type="button" onClick={() => setSize(s)} className={`px-4 h-10 rounded-full text-[12px] font-mono transition-all ${s === size ? "bg-white/12 text-white border border-white/25" : "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/[0.08]"}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={handleAdd} className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-white text-sm font-semibold text-black transition hover:-translate-y-px flex-1 sm:flex-none">
                    {added ? "✓ Added!" : "Add to cart"}
                  </button>
                  <button type="button" onClick={onClose} className="inline-flex items-center justify-center h-12 px-6 rounded-2xl border border-white/15 bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                    Continue browsing
                  </button>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">Category</div>
                    <div className="mt-2 font-semibold text-white/80 capitalize">{product.category}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">Finish</div>
                    <div className="mt-2 font-semibold text-white/80">Hand-sewn</div>
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
