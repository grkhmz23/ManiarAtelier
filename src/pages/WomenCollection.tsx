"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";
import { CATALOG, Product, ProductGender, formatEUR, getProductsByGender, getCategoriesForGender, CATEGORY_LABELS, ProductCategory } from "@/lib/catalog";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface WomenCollectionProps {
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenChat: () => void;
  onNavigatePage: (page: PageType) => void;
}

// Animation variants - graceful & fluid
const fluidStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

const gracefulFadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

// Product Image Component
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="relative w-full h-full bg-[#EBE8E3] overflow-hidden group">
      {!imgError ? (
        <motion.img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#F2EFEA]">
          <div 
            className="absolute inset-0 opacity-60 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_right,_#FAECE6,_transparent_60%),_radial-gradient(ellipse_at_bottom_left,_#EAE4DD,_transparent_60%)] animate-pulse" 
            style={{ animationDuration: '6s', animationTimingFunction: 'ease-in-out' }} 
          />
          <div className="w-[calc(100%-3rem)] h-[calc(100%-3rem)] border border-[#0B1026]/10 flex flex-col items-center justify-center relative transition-transform duration-1000 group-hover:scale-[0.98]">
            <span className="text-[#0B1026]/30 font-serif italic text-sm tracking-[0.2em] transition-all duration-1000 group-hover:text-[#0B1026]/50">
              Maniar / Femme
            </span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-white/0 transition-colors duration-1000 ease-out group-hover:bg-white/10 pointer-events-none" />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      variants={gracefulFadeUp}
      className="group block relative cursor-pointer text-left w-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFEA]">
        <ProductImage src={product.image} alt={product.name} />
        
        {/* Sale Badge */}
        <div className="absolute top-5 left-5 z-10 overflow-hidden">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="block bg-[#D6AC54] text-[#0B1026] text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5"
          >
            {product.badge}
          </motion.span>
        </div>
      </div>

      <div className="mt-6 flex flex-col space-y-2 relative px-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-[13px] text-[#0B1026] tracking-[0.15em] uppercase font-light">
            {product.name}
          </h3>
          {/* Sale Price */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[13px] font-bold text-[#B5922F] tracking-wider">{formatEUR(product.priceEUR)}</span>
            <span className="text-[10px] text-[#0B1026]/40 line-through">{formatEUR(product.originalPriceEUR)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center overflow-hidden h-6">
          <p className="text-[11px] text-[#0B1026]/40 tracking-[0.2em] uppercase transition-all duration-700 ease-[0.25,0.1,0.25,1] group-hover:-translate-y-8 group-hover:opacity-0">
            {CATEGORY_LABELS[product.category]}
          </p>
          
          <div className="absolute bottom-0 left-1 translate-y-8 opacity-0 transition-all duration-700 ease-[0.25,0.1,0.25,1] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[11px] text-[#0B1026] flex items-center gap-3 uppercase tracking-[0.2em] border-b border-[#0B1026]/20 pb-1">
              View Piece <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// Hero Section
const WomenPageHero = ({ onBack, t }: { onBack: () => void; t: any }) => {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full h-[70vh] min-h-[550px] bg-[#FDFBF7] flex items-center justify-center px-6 md:px-12 border-b border-[#0B1026]/10 overflow-hidden">
      {/* Luminous background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-[#FDFBF7] to-stone-100 pointer-events-none z-0" />
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute top-0 right-0 w-3/4 h-full bg-[radial-gradient(circle_at_top_right,_#FAECE6_0%,_transparent_50%)] blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_left,_#EAE4DD_0%,_transparent_60%)] blur-3xl"
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className={`absolute top-32 ${isRTL ? 'right-6 md:right-12' : 'left-6 md:left-12'} z-20 flex items-center gap-2 text-xs uppercase tracking-widest text-[#0B1026]/60 hover:text-[#D6AC54] transition-colors`}
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">{t.common.backToHome}</span>
      </button>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center pt-20">
        <div className="overflow-hidden mb-8">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="block text-[#D6AC54]/70 text-xs tracking-[0.5em] uppercase"
          >
            Maniar Atelier / Femme
          </motion.span>
        </div>
        
        <div className="overflow-hidden mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-[#0B1026] tracking-[-0.02em] uppercase leading-tight"
          >
            Soft Power
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="text-[#0B1026]/50 text-sm md:text-base tracking-[0.05em] max-w-lg leading-relaxed font-light"
        >
          {t.collectionPage.women.heroDesc}
        </motion.p>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WomenCollection({ onBack, onOpenProduct, onOpenChat, onNavigatePage }: WomenCollectionProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const products = useMemo(() => getProductsByGender("women"), []);
  const categories = useMemo(() => getCategoriesForGender("women"), []);
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");

  // Filter products
  const filteredProducts = useMemo(() => {
    return activeCategory === "all" 
      ? products 
      : products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const featuredProducts = filteredProducts.slice(0, 3);
  const remainingProducts = filteredProducts.slice(3);

  const handleCategoryChange = (cat: ProductCategory | "all") => {
    setActiveCategory(cat);
    if (cat !== "all") {
      window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] selection:bg-[#D6AC54]/30 selection:text-[#0B1026] pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <WomenPageHero onBack={onBack} t={t} />

      {/* Graceful Sticky Rail */}
      <div className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-2xl border-b border-[#0B1026]/10 transition-all duration-500">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-center space-x-8 md:space-x-16 overflow-x-auto py-6 no-scrollbar">
            <button
              onClick={() => handleCategoryChange("all")}
              className="relative flex-shrink-0 text-[11px] md:text-xs tracking-[0.25em] uppercase outline-none transition-colors duration-500 py-2"
            >
              <span className={`relative z-10 transition-colors duration-500 ${activeCategory === "all" ? "text-[#0B1026]" : "text-[#0B1026]/40 hover:text-[#0B1026]/60"}`}>
                {t.common.all}
              </span>
              {activeCategory === "all" && (
                <motion.div
                  layoutId="womenActiveCategory"
                  className="absolute left-1/2 right-0 -bottom-1 h-[1px] bg-[#D6AC54] w-1/2 -translate-x-1/2"
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              )}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className="relative flex-shrink-0 text-[11px] md:text-xs tracking-[0.25em] uppercase outline-none transition-colors duration-500 py-2"
              >
                <span className={`relative z-10 transition-colors duration-500 ${activeCategory === category ? "text-[#0B1026]" : "text-[#0B1026]/40 hover:text-[#0B1026]/60"}`}>
                  {CATEGORY_LABELS[category]}
                </span>
                {activeCategory === category && (
                  <motion.div
                    layoutId="womenActiveCategory"
                    className="absolute left-1/2 right-0 -bottom-1 h-[1px] bg-[#D6AC54] w-1/2 -translate-x-1/2"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full"
        >
          {filteredProducts.length === 0 ? (
            <div className="py-40 text-center flex flex-col items-center justify-center">
              <span className="text-[#0B1026]/50 text-sm tracking-[0.2em] uppercase font-light">{t.common.noProductsMatch}</span>
            </div>
          ) : (
            <>
              {/* SHOWROOM VIEW (All) */}
              {activeCategory === "all" ? (
                <>
                  <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
                    <motion.div 
                      variants={fluidStagger}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
                    >
                      {/* Featured */}
                      {featuredProducts[0] && (
                        <motion.div variants={gracefulFadeUp} className="md:col-span-7 lg:col-span-7 relative">
                          <button 
                            onClick={() => onOpenProduct(featuredProducts[0])}
                            className="group block relative w-full h-[65vh] md:h-[85vh] overflow-hidden text-left"
                          >
                            <ProductImage src={featuredProducts[0].image} alt={featuredProducts[0].name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col items-start translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.25,0.1,0.25,1]">
                              <span className="text-white/80 font-serif italic text-sm tracking-widest mb-3">{t.hero.atelier}</span>
                              <h2 className="text-3xl md:text-4xl text-white font-light tracking-[0.1em] uppercase">
                                {featuredProducts[0].name}
                              </h2>
                            </div>
                          </button>
                        </motion.div>
                      )}

                      {/* Supporting items */}
                      <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-12 md:gap-20 md:mt-32">
                        {featuredProducts.slice(1).map((prod) => (
                          <div key={prod.id} className="w-full max-w-sm mx-auto md:mr-auto md:ml-0">
                            <ProductCard product={prod} onClick={() => onOpenProduct(prod)} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </section>

                  {/* Luminous Editorial Break */}
                  <section className="w-full py-48 bg-[#F5F2EC] my-16 relative overflow-hidden flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 opacity-40 mix-blend-multiply" 
                      style={{ 
                        backgroundImage: 'radial-gradient(circle at center, #D6AC54 1px, transparent 1px)', 
                        backgroundSize: '40px 40px',
                        opacity: 0.05
                      }}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className="relative z-10 text-center px-6 max-w-2xl"
                    >
                      <span className="block text-[#D6AC54]/70 font-serif italic text-sm tracking-[0.2em] mb-8">
                        {t.collectionPage.women.kicker}
                      </span>
                      <h2 className="text-3xl md:text-5xl font-light text-[#0B1026] tracking-[0.05em] uppercase mb-10 leading-[1.3]">
                        {t.collectionPage.women.heroTitle}
                      </h2>
                      <button 
                        onClick={() => onNavigatePage("brand")}
                        className="inline-flex items-center gap-4 text-xs text-[#0B1026] uppercase tracking-[0.2em] border-b border-[#0B1026]/20 pb-2 hover:border-[#D6AC54] transition-colors duration-500"
                      >
                        {t.common.readStory}
                      </button>
                    </motion.div>
                  </section>
                  
                  {/* Rest of collection */}
                  <section className="px-6 md:px-12 py-16 max-w-[1600px] mx-auto">
                    <div className="mb-16 flex items-center justify-between border-b border-[#0B1026]/10 pb-6">
                      <h3 className="text-[#0B1026] text-sm uppercase tracking-[0.25em] font-light">{t.collection.title}</h3>
                      <span className="text-[#0B1026]/40 text-[11px] tracking-[0.2em] uppercase">{remainingProducts.length} {t.common.items}</span>
                    </div>
                    <motion.div 
                      variants={fluidStagger}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
                    >
                      {remainingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => onOpenProduct(product)} />
                      ))}
                    </motion.div>
                  </section>
                </>
              ) : (
                /* FILTERED / CATEGORY VIEW */
                <section className="px-6 md:px-12 py-20 max-w-[1600px] mx-auto min-h-[50vh]">
                  <div className="mb-20 border-b border-[#0B1026]/10 pb-8 flex items-end justify-between">
                    <div>
                      <span className="text-[#0B1026]/40 font-serif italic text-sm tracking-[0.1em] block mb-3">
                        {t.common.category}
                      </span>
                      <h2 className="text-4xl text-[#0B1026] uppercase tracking-[0.1em] font-light">
                        {CATEGORY_LABELS[activeCategory]}
                      </h2>
                    </div>
                    <span className="text-[#0B1026]/40 text-[11px] tracking-[0.2em] uppercase">{filteredProducts.length} {t.common.items}</span>
                  </div>
                  
                  <motion.div 
                    variants={fluidStagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onClick={() => onOpenProduct(product)} />
                    ))}
                  </motion.div>
                </section>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Bar */}
      <div className="w-full pt-20 pb-12">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-[10px] text-[#0B1026]/40 tracking-[0.3em] uppercase text-center font-light">
          <span className="hover:text-[#D6AC54] transition-colors duration-500 cursor-default">{t.hero.fastShipping}</span>
          <span className="hidden md:inline font-serif italic text-[#D6AC54]/30 transform scale-150">/</span>
          <span className="hover:text-[#D6AC54] transition-colors duration-500 cursor-default">{t.hero.trackedDelivery}</span>
          <span className="hidden md:inline font-serif italic text-[#D6AC54]/30 transform scale-150">/</span>
          <span className="hover:text-[#D6AC54] transition-colors duration-500 cursor-default">{t.hero.tagline}</span>
        </div>
      </div>
    </main>
  );
}
