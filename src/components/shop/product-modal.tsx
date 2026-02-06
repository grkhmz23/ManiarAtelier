"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductSize, formatEUR } from "@/lib/catalog";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSize(product.sizes.includes("M") ? "M" : product.sizes[0]);
      setAddedFeedback(false);
    }
  }, [product]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const images = useMemo(
    () => (product ? product.images : []),
    [product]
  );

  const nextImage = () => {
    setCurrentImageIndex((i) => (i + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  };

  const handleAdd = () => {
    if (!product) return;
    onAdd(product, size);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close product modal"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full sm:w-[min(960px,calc(100vw-24px))] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-t-[22px] sm:rounded-[26px] border border-[rgba(214,172,84,0.18)] border-b-[3px] border-b-[rgba(3,4,10,0.95)] elevation-modal"
            style={{
              background:
                "linear-gradient(180deg, rgba(22,26,49,0.88), rgba(7,8,23,0.94))",
            }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Engrave pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.10] bg-[repeating-linear-gradient(45deg,rgba(214,172,84,0.45),rgba(214,172,84,0.45)_1px,transparent_1px,transparent_12px)]" />

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.75)] hover:bg-[rgba(22,26,49,0.70)] text-[#F4E5A7] flex items-center justify-center z-20 elevation-btn"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Gallery */}
              <div className="relative">
                {/* Main Image */}
                <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-[rgba(10,14,33,0.75)] rounded-tl-[22px] sm:rounded-tl-[26px] md:rounded-bl-[26px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={images[currentImageIndex]}
                      src={images[currentImageIndex]}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

                  {/* Arrow nav (visible on mobile too) */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border border-[rgba(214,172,84,0.2)] text-[#F4E5A7] flex items-center justify-center z-10 active:scale-95 transition-transform"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border border-[rgba(214,172,84,0.2)] text-[#F4E5A7] flex items-center justify-center z-10 active:scale-95 transition-transform"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Dot indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentImageIndex(i)}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            i === currentImageIndex
                              ? "w-6 bg-[#D6AC54]"
                              : "w-2 bg-[rgba(244,229,167,0.4)] hover:bg-[rgba(244,229,167,0.6)]"
                          }`}
                          aria-label={`View image ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip (desktop only) */}
                {images.length > 1 && (
                  <div className="hidden md:flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentImageIndex(i)}
                        className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          i === currentImageIndex
                            ? "border-[#D6AC54] opacity-100"
                            : "border-transparent opacity-60 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-5 sm:p-6 md:p-8">
                {product.badge && (
                  <div className="watch-chip inline-flex">{product.badge}</div>
                )}
                <h3 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl text-[#F4E5A7]">
                  {product.name}
                </h3>
                <div className="mt-2 text-[rgba(244,229,167,0.70)] text-lg">
                  {formatEUR(product.priceEUR)}
                </div>

                <p className="mt-4 sm:mt-6 text-[rgba(244,229,167,0.72)] leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>

                {/* Materials */}
                <div className="mt-4 sm:mt-6">
                  <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                    Materials
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.materials.map((mat) => (
                      <span
                        key={mat}
                        className="px-3 py-1 rounded-full text-xs bg-[rgba(214,172,84,0.08)] border border-[rgba(214,172,84,0.15)] text-[rgba(244,229,167,0.75)]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Size selector */}
                <div className="mt-5 sm:mt-7">
                  <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                    Select size
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
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

                {/* Actions */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="watch-btn watch-btn-primary h-12 px-6 text-sm elevation-btn flex-1 sm:flex-none"
                    onClick={handleAdd}
                  >
                    {addedFeedback ? "✓ Added!" : "Add to cart"}
                  </button>
                  <button
                    type="button"
                    className="watch-btn h-12 px-6 text-sm elevation-btn"
                    onClick={onClose}
                  >
                    Continue browsing
                  </button>
                </div>

                {/* Detail chips */}
                <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3">
                  <div className="watch-surface p-3 sm:p-4 elevation-sm">
                    <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                      Category
                    </div>
                    <div className="mt-2 font-serif text-[#F4E5A7] capitalize">
                      {product.category}
                    </div>
                  </div>
                  <div className="watch-surface p-3 sm:p-4 elevation-sm">
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
