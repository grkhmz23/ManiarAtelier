"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";
import { CATALOG, Product, ProductGender, formatEUR, getProductsByGender, getCategoriesForGender, CATEGORY_LABELS, ProductCategory } from "@/lib/catalog";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface MenCollectionProps {
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenChat: () => void;
  onNavigatePage: (page: PageType) => void;
}

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  },
};

// Product Image Component
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="relative w-full h-full bg-[#0B1026] overflow-hidden group">
      {!imgError ? (
        <motion.img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B1026] overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,_#1a1f38,_transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="w-[calc(100%-2rem)] h-[calc(100%-2rem)] border border-white/10 flex flex-col items-center justify-center relative">
            <span className="text-white/30 font-mono text-[10px] tracking-[0.4em] uppercase rotate-90 sm:rotate-0 transition-all duration-700 group-hover:tracking-[0.6em] group-hover:text-white/50">
              Maniar / Homme
            </span>
            <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-white/20 -translate-x-1/2 -translate-y-full" />
            <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-white/20 -translate-x-1/2 translate-y-full" />
            <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-white/20 -translate-x-full -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-4 h-[1px] bg-white/20 translate-x-full -translate-y-1/2" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/20 pointer-events-none" />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const t = useTranslation();

  return (
    <motion.button
      onClick={onClick}
      variants={fadeUpItem}
      className="group block relative cursor-pointer text-left w-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0B1026]">
        <ProductImage src={product.image} alt={product.name} />
        
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 overflow-hidden">
            <motion.span 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block bg-[#D6AC54] text-[#0B1026] text-[10px] font-bold tracking-widest uppercase px-3 py-1"
            >
              {product.badge}
            </motion.span>
          </div>
        )}

        {/* Hover frame */}
        <div className="absolute inset-4 border border-white/0 scale-95 transition-all duration-700 ease-out group-hover:border-white/20 group-hover:scale-100 pointer-events-none z-20" />
      </div>

      <div className="mt-5 flex flex-col space-y-2 relative">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-sm font-medium text-white/90 tracking-wide uppercase">
            {product.name}
          </h3>
          <span className="text-sm text-[#D6AC54] font-mono tracking-tight shrink-0">{formatEUR(product.priceEUR)}</span>
        </div>
        
        <div className="flex justify-between items-center overflow-hidden">
          <p className="text-xs text-white/40 tracking-widest uppercase transition-transform duration-500 group-hover:-translate-y-6">
            {CATEGORY_LABELS[product.category]}
          </p>
          
          <div className="absolute bottom-0 left-0 translate-y-6 transition-transform duration-500 group-hover:translate-y-0">
            <span className="text-xs text-white/70 flex items-center gap-2 uppercase tracking-widest border-b border-white/30 pb-[2px]">
              {t.common.readMore} <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// Hero Section
const MenPageHero = ({ onBack, t }: { onBack: () => void; t: any }) => {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full h-[65vh] min-h-[500px] bg-[#0B1026] flex items-end justify-start pb-20 px-6 md:px-12 border-b border-white/10 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1026]/10 to-[#0B1026] pointer-events-none z-0" />
      
      {/* Animated line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute ${isRTL ? 'right-6 md:right-12' : 'left-6 md:left-12'} top-0 w-[1px] bg-gradient-to-b from-transparent via-[#D6AC54]/50 to-transparent opacity-50 z-0`}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className={`absolute top-32 ${isRTL ? 'right-6 md:right-12' : 'left-6 md:left-12'} z-20 flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-[#D6AC54] transition-colors`}
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">{t.common.backToHome}</span>
      </button>

      <div className="relative z-10 max-w-3xl">
        <div className="overflow-hidden mb-6">
          <motion.span 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block text-[#D6AC54]/70 text-xs tracking-[0.4em] uppercase border-l border-[#D6AC54]/30 pl-4"
          >
            Maniar Atelier / Homme
          </motion.span>
        </div>
        
        <div className="overflow-hidden mb-6">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-light text-white tracking-tighter uppercase leading-[0.9]"
          >
            Structure<br/>
            <span className="text-white/40">& Form</span>
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/50 text-sm md:text-base tracking-wide max-w-md leading-relaxed"
        >
          {t.collectionPage.men.heroDesc}
        </motion.p>
      </div>
    </section>
  );
};

// Filter Panel
const FilterPanel = ({
  isOpen,
  selectedSize,
  setSelectedSize,
  maxPrice,
  setMaxPrice,
  t,
}: {
  isOpen: boolean;
  selectedSize: string | null;
  setSelectedSize: (s: string | null) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  t: any;
}) => {
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-b border-white/10 bg-[#0B1026]/50"
        >
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Size Filter */}
            <div>
              <span className="block text-xs text-white/50 uppercase tracking-widest mb-4 font-mono">{t.common.size}</span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSize(null)}
                  className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-300 ${
                    selectedSize === null 
                      ? "border-[#D6AC54] bg-[#D6AC54] text-[#0B1026] font-bold" 
                      : "border-white/20 text-white/60 hover:border-white/40"
                  }`}
                >
                  {t.common.all}
                </button>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 text-xs tracking-widest font-mono border transition-all duration-300 ${
                      selectedSize === size 
                        ? "border-[#D6AC54] bg-[#D6AC54] text-[#0B1026] font-bold" 
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="block text-xs text-white/50 uppercase tracking-widest font-mono">{t.common.price}</span>
                <span className="text-sm text-[#D6AC54] font-mono">{formatEUR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={150}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-[2px] bg-white/10 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#D6AC54] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono mt-3">
                <span>{formatEUR(150)}</span>
                <span>{formatEUR(500)}+</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MenCollection({ onBack, onOpenProduct, onOpenChat, onNavigatePage }: MenCollectionProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const products = useMemo(() => getProductsByGender("men"), []);
  const categories = useMemo(() => getCategoriesForGender("men"), []);
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = activeCategory === "all" || product.category === activeCategory;
      const matchSize = selectedSize ? product.sizes.includes(selectedSize as any) : true;
      const matchPrice = product.priceEUR <= maxPrice;
      return matchCategory && matchSize && matchPrice;
    });
  }, [products, activeCategory, selectedSize, maxPrice]);

  const featuredProducts = filteredProducts.slice(0, 3);
  const remainingProducts = filteredProducts.slice(3);

  const handleCategoryChange = (cat: ProductCategory | "all") => {
    setActiveCategory(cat);
    if (cat !== "all") {
      window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1026] selection:bg-[#D6AC54]/30 selection:text-white pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <MenPageHero onBack={onBack} t={t} />

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 w-full bg-[#0B1026]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Categories */}
          <div className="flex items-center space-x-6 md:space-x-8 overflow-x-auto py-5 no-scrollbar flex-1">
            <button
              onClick={() => handleCategoryChange("all")}
              className="relative flex-shrink-0 text-xs md:text-sm tracking-widest uppercase py-1 outline-none transition-colors"
            >
              <span className={`relative z-10 ${activeCategory === "all" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                {t.common.all}
              </span>
              {activeCategory === "all" && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute left-0 right-0 -bottom-[21px] h-[2px] bg-[#D6AC54]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className="relative flex-shrink-0 text-xs md:text-sm tracking-widest uppercase py-1 outline-none transition-colors"
              >
                <span className={`relative z-10 ${activeCategory === category ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                  {CATEGORY_LABELS[category]}
                </span>
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute left-0 right-0 -bottom-[21px] h-[2px] bg-[#D6AC54]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`ml-6 flex items-center gap-2 text-xs tracking-widest uppercase transition-colors ${isFilterOpen ? "text-[#D6AC54]" : "text-white/50 hover:text-white"}`}
          >
            <span className="hidden sm:inline">{t.common.filters}</span>
            {isFilterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
          </button>
        </div>
      </div>

      <FilterPanel 
        isOpen={isFilterOpen} 
        selectedSize={selectedSize} 
        setSelectedSize={setSelectedSize}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        t={t}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${selectedSize}-${maxPrice}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* No Results */}
          {filteredProducts.length === 0 ? (
            <div className="py-40 text-center flex flex-col items-center justify-center">
              <span className="text-white/40 text-sm tracking-[0.2em] uppercase mb-4">{t.common.noProductsMatch}</span>
              <button 
                onClick={() => { setSelectedSize(null); setMaxPrice(500); setActiveCategory("all"); }} 
                className="text-xs text-white border-b border-[#D6AC54] pb-1 uppercase tracking-widest hover:text-[#D6AC54] transition-colors"
              >
                {t.common.clearFilters}
              </button>
            </div>
          ) : (
            <>
              {/* Showroom View (All) */}
              {activeCategory === "all" && !selectedSize && maxPrice === 500 ? (
                <>
                  {/* Featured Section */}
                  <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
                    <motion.div 
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
                    >
                      {/* Featured (First item) */}
                      {featuredProducts[0] && (
                        <motion.div variants={fadeUpItem} className="md:col-span-7 lg:col-span-8">
                          <button 
                            onClick={() => onOpenProduct(featuredProducts[0])}
                            className="group block relative w-full h-[60vh] md:h-[80vh] bg-[#0B1026] overflow-hidden text-left"
                          >
                            <ProductImage src={featuredProducts[0].image} alt={featuredProducts[0].name} />
                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#0B1026]/90 to-transparent flex flex-col items-start">
                              <span className="text-[#D6AC54] text-[10px] tracking-[0.3em] uppercase mb-4 font-bold bg-[#0B1026] px-3 py-1 border border-[#D6AC54]/30">
                                {t.hero.atelier}
                              </span>
                              <h2 className="text-3xl md:text-5xl text-white font-light tracking-tight uppercase mb-2">
                                {featuredProducts[0].name}
                              </h2>
                              <span className="text-[#D6AC54] font-mono">{formatEUR(featuredProducts[0].priceEUR)}</span>
                            </div>
                          </button>
                        </motion.div>
                      )}

                      {/* Supporting items */}
                      <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 md:gap-10">
                        {featuredProducts.slice(1).map((prod) => (
                          <div key={prod.id} className="flex-1">
                            <ProductCard product={prod} onClick={() => onOpenProduct(prod)} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </section>

                  {/* Editorial Break */}
                  <section className="w-full py-40 bg-black border-y border-white/10 my-12 relative overflow-hidden flex items-center justify-center group">
                    <motion.div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1f38 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 text-center px-6 max-w-3xl"
                    >
                      <span className="block text-[#D6AC54]/70 text-xs tracking-[0.4em] uppercase mb-8">{t.collectionPage.men.kicker}</span>
                      <h2 className="text-4xl md:text-6xl font-light text-white tracking-tighter uppercase mb-8 leading-[1.1]">
                        {t.collectionPage.men.heroTitle}
                      </h2>
                      <button 
                        onClick={() => onNavigatePage("brand")}
                        className="inline-flex items-center gap-3 text-xs text-white uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white hover:text-[#0B1026] transition-all duration-500"
                      >
                        {t.common.readStory}
                      </button>
                    </motion.div>
                  </section>
                  
                  {/* Rest of collection */}
                  <section className="px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
                    <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="text-white text-lg uppercase tracking-widest font-light">{t.collection.title}</h3>
                      <span className="text-white/40 text-xs tracking-widest uppercase">{remainingProducts.length} {t.common.items}</span>
                    </div>
                    <motion.div 
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16"
                    >
                      {remainingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => onOpenProduct(product)} />
                      ))}
                    </motion.div>
                  </section>
                </>
              ) : (
                /* Filtered / Category View */
                <section className="px-6 md:px-12 py-16 max-w-[1600px] mx-auto min-h-[50vh]">
                  <div className="mb-16 border-b border-white/10 pb-6 flex items-end justify-between">
                    <div>
                      <span className="text-white/50 text-xs tracking-widest uppercase block mb-2">
                        {selectedSize || maxPrice < 500 ? t.common.filters : t.common.category}
                      </span>
                      <h2 className="text-3xl text-white uppercase tracking-widest font-light">
                        {activeCategory === "all" ? t.nav.mensCollection : CATEGORY_LABELS[activeCategory]}
                      </h2>
                    </div>
                    <span className="text-white/40 text-xs tracking-widest uppercase">{filteredProducts.length} {t.common.items}</span>
                  </div>
                  
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16"
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
      <div className="w-full border-t border-white/10 bg-[#0B1026] py-12">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-[10px] text-white/40 tracking-[0.3em] uppercase text-center font-bold">
          <span>{t.hero.fastShipping}</span>
          <span className="hidden md:inline w-1 h-1 bg-[#D6AC54]/50 rounded-full" />
          <span>{t.hero.trackedDelivery}</span>
          <span className="hidden md:inline w-1 h-1 bg-[#D6AC54]/50 rounded-full" />
          <span>{t.hero.tagline}</span>
        </div>
      </div>
    </main>
  );
}
