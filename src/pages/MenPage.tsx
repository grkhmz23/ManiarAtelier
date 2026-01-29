import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Filter, X, ChevronDown } from "lucide-react";
import WatchPanel from "@/components/watch/watch-panel";
import {
  CATALOG,
  Product,
  ProductCategory,
  ProductSize,
  PriceRangeId,
  CATEGORY_LABELS,
  PRICE_RANGES,
  SIZE_ORDER,
  formatEUR,
  getProductsByGender,
  getCategoriesForGender,
} from "@/lib/catalog";

interface MenPageProps {
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenChat: () => void;
}

const HERO_IMAGES = [
  "/images/model-blue-long.png",
  "/images/nero-oro.png",
  "/images/uomo-gilet.png",
];

export default function MenPage({ onBack, onOpenProduct, onOpenChat }: MenPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedSize, setSelectedSize] = useState<ProductSize | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeId>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const menProducts = useMemo(() => getProductsByGender("men"), []);
  const menCategories = useMemo(() => getCategoriesForGender("men"), []);

  const filteredProducts = useMemo(() => {
    let products = [...menProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by size
    if (selectedSize !== "all") {
      products = products.filter((p) => p.sizes.includes(selectedSize));
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        products = products.filter((p) => p.priceEUR >= range.min && p.priceEUR <= range.max);
      }
    }

    // Sort
    if (sortBy === "price-asc") {
      products.sort((a, b) => a.priceEUR - b.priceEUR);
    } else if (sortBy === "price-desc") {
      products.sort((a, b) => b.priceEUR - a.priceEUR);
    }

    return products;
  }, [menProducts, selectedCategory, selectedSize, selectedPriceRange, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedSize !== "all") count++;
    if (selectedPriceRange !== "all") count++;
    return count;
  }, [selectedCategory, selectedSize, selectedPriceRange]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedPriceRange("all");
    setSortBy("default");
  };

  return (
    <main className="watch-stage">
      <div className="pt-[112px] px-4 md:px-8 pb-12">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 md:gap-5">

          {/* Back Navigation */}
          <motion.button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm dock-muted hover:text-[#F4E5A7] transition-colors self-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.button>

          {/* Hero Section */}
          <WatchPanel kicker="Collection" title="Men">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-5 items-stretch">

              {/* Hero Text */}
              <WatchPanel as="div" variant="compact" kicker="The Gentleman's Edit" title="Refined Presence">
                <p className="dock-muted text-sm md:text-base leading-relaxed">
                  Structured silhouettes meet Moroccan heritage. Each piece is built for presence—
                  not trends. Coats that command rooms, gilets that layer with intention.
                </p>
                <p className="dock-muted text-sm leading-relaxed mt-3">
                  From Atlas wool to hand-finished seams, every detail is a considered choice.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("men-products");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="dock-btn dock-btn-primary elevation-btn"
                  >
                    Shop Collection <ArrowRight size={16} />
                  </button>
                  <button type="button" onClick={onOpenChat} className="dock-btn elevation-btn">
                    Styling Help
                  </button>
                </div>
              </WatchPanel>

              {/* Hero Images Grid */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {HERO_IMAGES.map((img, i) => (
                  <motion.div
                    key={img}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-[4px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(7,8,23,0.55)] elevation-card elevation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <img
                      src={img}
                      alt={`Men's collection ${i + 1}`}
                      className="w-full h-full object-cover opacity-[0.92]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(214,172,84,0.1)] to-transparent" />
                  </motion.div>
                ))}
              </div>
            </div>
          </WatchPanel>

          {/* Categories Bar */}
          <WatchPanel as="div" variant="flush" className="p-0">
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="dock-kicker">Categories</div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`dock-btn text-sm elevation-btn ${activeFiltersCount > 0 ? "dock-btn-primary" : ""}`}
                >
                  <Filter size={14} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#D6AC54] text-[#070817] text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7] border border-[rgba(214,172,84,0.4)]"
                      : "bg-[rgba(214,172,84,0.08)] text-[rgba(244,229,167,0.6)] border border-[rgba(214,172,84,0.16)] hover:border-[rgba(214,172,84,0.3)]"
                  }`}
                >
                  All
                </button>
                {menCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7] border border-[rgba(214,172,84,0.4)]"
                        : "bg-[rgba(214,172,84,0.08)] text-[rgba(244,229,167,0.6)] border border-[rgba(214,172,84,0.16)] hover:border-[rgba(214,172,84,0.3)]"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-[rgba(214,172,84,0.12)]">
                      <div className="grid sm:grid-cols-3 gap-4">

                        {/* Size Filter */}
                        <div>
                          <div className="text-xs dock-muted mb-2 uppercase tracking-wider">Size</div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSize("all")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                selectedSize === "all"
                                  ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7]"
                                  : "bg-[rgba(214,172,84,0.08)] text-[rgba(244,229,167,0.6)] hover:bg-[rgba(214,172,84,0.1)]"
                              }`}
                            >
                              All
                            </button>
                            {SIZE_ORDER.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  selectedSize === size
                                    ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7]"
                                    : "bg-[rgba(214,172,84,0.08)] text-[rgba(244,229,167,0.6)] hover:bg-[rgba(214,172,84,0.1)]"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                          <div className="text-xs dock-muted mb-2 uppercase tracking-wider">Price</div>
                          <div className="flex flex-wrap gap-2">
                            {PRICE_RANGES.map((range) => (
                              <button
                                key={range.id}
                                type="button"
                                onClick={() => setSelectedPriceRange(range.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  selectedPriceRange === range.id
                                    ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7]"
                                    : "bg-[rgba(214,172,84,0.08)] text-[rgba(244,229,167,0.6)] hover:bg-[rgba(214,172,84,0.1)]"
                                }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sort */}
                        <div>
                          <div className="text-xs dock-muted mb-2 uppercase tracking-wider">Sort By</div>
                          <div className="relative">
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                              className="w-full px-3 py-2 rounded-lg text-sm bg-[rgba(7,8,23,0.65)] text-[#F4E5A7] border border-[rgba(214,172,84,0.16)] appearance-none cursor-pointer focus:outline-none focus:border-[rgba(214,172,84,0.4)]"
                            >
                              <option value="default">Default</option>
                              <option value="price-asc">Price: Low to High</option>
                              <option value="price-desc">Price: High to Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none dock-muted" />
                          </div>
                        </div>
                      </div>

                      {/* Clear Filters */}
                      {activeFiltersCount > 0 && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-4 text-sm text-[#D6AC54] hover:text-[#F4E5A7] transition-colors flex items-center gap-1"
                        >
                          <X size={14} />
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </WatchPanel>

          {/* Products Grid */}
          <WatchPanel id="men-products" kicker={`${filteredProducts.length} Items`} title="Shop">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="dock-muted text-lg">No products match your filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="dock-btn mt-4 elevation-btn"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <WatchPanel as="article" variant="flush" className="p-0">
                      <button type="button" onClick={() => onOpenProduct(product)} className="w-full text-left">
                        <div className="relative rounded-[22px] overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-[4px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(7,8,23,0.55)] elevation-card elevation-card">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full aspect-[3/4] object-cover opacity-[0.95] transition-transform duration-700 hover:scale-[1.02]"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_18%,rgba(244,229,167,0.10),transparent_45%)]" />

                          {product.badge && (
                            <div className="absolute top-4 left-4 rounded-full px-3 py-1 bg-[rgba(10,14,33,0.85)] border border-[rgba(214,172,84,0.22)] text-[10px] font-mono tracking-[0.22em] uppercase elevation-card">
                              {product.badge}
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="dock-divider mb-3" />
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="font-serif text-lg leading-tight">{product.name}</div>
                                <div className="dock-muted text-sm mt-1">{formatEUR(product.priceEUR)}</div>
                              </div>
                              <ArrowRight size={18} className="dock-muted shrink-0 mt-1" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </WatchPanel>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-5 dock-divider" />
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="dock-muted text-sm">Need help finding the right fit?</div>
              <button type="button" onClick={onOpenChat} className="dock-btn elevation-btn">
                Ask Concierge <ArrowRight size={16} />
              </button>
            </div>
          </WatchPanel>
        </div>
      </div>
    </main>
  );
}