import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Filter, X, ChevronDown } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import {
  Product,
  ProductCategory,
  ProductSize,
  PriceRangeId,
  ProductGender,
  PRICE_RANGES,
  SIZE_ORDER,
  formatEUR,
  getProductsByGender,
  getCategoriesForGender,
} from "@/lib/catalog";
import { useTranslation, useLanguage } from "@/i18n";

interface CollectionPageProps {
  gender: ProductGender;
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenChat: () => void;
}

export default function CollectionPage({ gender, onBack, onOpenProduct, onOpenChat }: CollectionPageProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const GENDER_CONFIG = {
    men: {
      title: t.collectionPage.men.title,
      kicker: t.collectionPage.men.kicker,
      heroTitle: t.collectionPage.men.heroTitle,
      heroDesc: t.collectionPage.men.heroDesc,
      heroDesc2: t.collectionPage.men.heroDesc2,
      images: ["/images/model-blue-long.png", "/images/nero-oro.png", "/images/uomo-gilet.png"],
    },
    women: {
      title: t.collectionPage.women.title,
      kicker: t.collectionPage.women.kicker,
      heroTitle: t.collectionPage.women.heroTitle,
      heroDesc: t.collectionPage.women.heroDesc,
      heroDesc2: t.collectionPage.women.heroDesc2,
      images: ["/images/verde-acqua.png", "/images/gonna-bianca.png", "/images/elegant.png"],
    },
  };

  const config = GENDER_CONFIG[gender];
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedSize, setSelectedSize] = useState<ProductSize | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeId>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const products = useMemo(() => getProductsByGender(gender), [gender]);
  const categories = useMemo(() => getCategoriesForGender(gender), [gender]);

  // Get translated category labels
  const getCategoryLabel = (cat: ProductCategory | "all") => {
    if (cat === "all") return t.common.all;
    return t.productCategories[cat];
  };

  // Get translated price range labels - map price range IDs to translation keys
  const getPriceRangeLabel = (id: PriceRangeId) => {
    const keyMap: Record<PriceRangeId, keyof typeof t.priceRanges> = {
      "all": "all",
      "under-250": "under250",
      "250-350": "range250to350",
      "over-350": "over350",
    };
    return t.priceRanges[keyMap[id]];
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "all") result = result.filter((p) => p.category === selectedCategory);
    if (selectedSize !== "all") result = result.filter((p) => p.sizes.includes(selectedSize));
    if (selectedPriceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) result = result.filter((p) => p.priceEUR >= range.min && p.priceEUR <= range.max);
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.priceEUR - b.priceEUR);
    else if (sortBy === "price-desc") result.sort((a, b) => b.priceEUR - a.priceEUR);
    return result;
  }, [products, selectedCategory, selectedSize, selectedPriceRange, sortBy]);

  const activeFiltersCount = [selectedCategory !== "all", selectedSize !== "all", selectedPriceRange !== "all"].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedPriceRange("all");
    setSortBy("default");
  };

  const pillClass = (active: boolean) =>
    "px-4 py-2 rounded-full text-sm font-medium transition-all border " +
    (active
      ? "bg-[#D6AC54]/15 text-[#F4E5A7] border-[#D6AC54]/30"
      : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20 hover:text-white/70");

  const chipClass = (active: boolean) =>
    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all " +
    (active
      ? "bg-white/12 text-white"
      : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]");

  return (
    <main className="relative" dir={isRTL ? "rtl" : "ltr"}>
      <div className="pt-[76px] md:pt-[84px] px-3 sm:px-4 md:px-8 pb-12">
        <div className="mx-auto max-w-7xl flex flex-col gap-5 md:gap-6">

          <motion.button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2" initial={{ opacity: 0, x: isRTL ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <ArrowLeft size={16} /> {t.common.backToHome}
          </motion.button>

          <GlassCard kicker={t.collectionPage.categories} title={config.title}>
            <div className="grid lg:grid-cols-2 gap-5 items-stretch">
              <GlassCard as="div" variant="compact" kicker={config.kicker} title={config.heroTitle}>
                <p className="text-sm md:text-base text-white/55 leading-relaxed">{config.heroDesc}</p>
                <p className="text-sm text-white/55 leading-relaxed mt-3">{config.heroDesc2}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => document.getElementById(gender + "-products")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">
                    {t.common.shopCollection} <ArrowRight size={16} />
                  </button>
                  <button type="button" onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                    {t.common.stylingHelp}
                  </button>
                </div>
              </GlassCard>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {config.images.map((img, i) => (
                  <motion.div key={img} className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                    <img src={img} alt={config.title + " collection " + (i + 1)} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard as="div" variant="flush" className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">{t.collectionPage.categories}</div>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className={"inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition " + (activeFiltersCount > 0 ? "border-white/25 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10")}>
                <Filter size={14} /> {t.common.filters}
                {activeFiltersCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#D6AC54] text-[#070817] text-[10px] font-bold">{activeFiltersCount}</span>}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setSelectedCategory("all")} className={pillClass(selectedCategory === "all")}>{getCategoryLabel("all")}</button>
              {categories.map((cat) => (
                <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={pillClass(selectedCategory === cat)}>{getCategoryLabel(cat)}</button>
              ))}
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">{t.common.size}</div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => setSelectedSize("all")} className={chipClass(selectedSize === "all")}>{t.common.all}</button>
                          {SIZE_ORDER.map((s) => <button key={s} type="button" onClick={() => setSelectedSize(s)} className={chipClass(selectedSize === s)}>{s}</button>)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">{t.common.price}</div>
                        <div className="flex flex-wrap gap-2">
                          {PRICE_RANGES.map((r) => <button key={r.id} type="button" onClick={() => setSelectedPriceRange(r.id as PriceRangeId)} className={chipClass(selectedPriceRange === r.id)}>{getPriceRangeLabel(r.id as PriceRangeId)}</button>)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">{t.common.sortBy}</div>
                        <div className="relative">
                          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-full px-3 py-2 rounded-lg text-sm bg-white/[0.04] text-white/80 border border-white/10 appearance-none cursor-pointer focus:outline-none focus:border-white/25">
                            <option value="default">{t.common.default}</option>
                            <option value="price-asc">{t.common.priceLowToHigh}</option>
                            <option value="price-desc">{t.common.priceHighToLow}</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
                        </div>
                      </div>
                    </div>
                    {activeFiltersCount > 0 && (
                      <button type="button" onClick={clearFilters} className="mt-4 text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"><X size={14} /> {t.common.clearFilters}</button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <GlassCard id={gender + "-products"} kicker={filteredProducts.length + " " + t.common.items} title={t.common.shop}>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/50 text-lg">{t.common.noProductsMatch}</p>
                <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition">{t.common.clearFilters}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filteredProducts.map((product, i) => (
                  <motion.article key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <button type="button" onClick={() => onOpenProduct(product)} className="w-full text-left group">
                      <div className="relative rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                        <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {product.badge && (
                          <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 bg-black/40 border border-white/15 backdrop-blur text-[10px] font-semibold tracking-wider uppercase text-white/80">{product.badge}</div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/30 to-transparent mb-3" />
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <div className="font-semibold text-[15px] text-white/90">{product.name}</div>
                              <div className="text-sm text-white/55 mt-0.5">{formatEUR(product.priceEUR)}</div>
                            </div>
                            <ArrowRight size={16} className="text-white/40 shrink-0 mb-0.5 group-hover:text-white/70 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.article>
                ))}
              </div>
            )}
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/20 to-transparent" />
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-sm text-white/50">{t.common.needHelp}</p>
              <button type="button" onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">{t.common.askConcierge} <ArrowRight size={14} /></button>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
