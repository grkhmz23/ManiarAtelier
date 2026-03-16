"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation, useLanguage } from "@/i18n";
import { CATALOG, Product, formatEUR } from "@/lib/catalog";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface CurrentEditSectionProps {
  onNavigatePage: (page: PageType) => void;
  onOpenProduct: (product: Product) => void;
}

// Noise texture for film grain effect
const SVGNoise = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-overlay z-10">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

// Custom cursor component
const CustomCursor = ({ isHovering }: { isHovering: boolean }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden mix-blend-difference hidden md:flex"
      animate={{
        x: mousePosition.x - (isHovering ? 40 : 8),
        y: mousePosition.y - (isHovering ? 40 : 8),
        width: isHovering ? 80 : 16,
        height: isHovering ? 80 : 16,
        backgroundColor: isHovering ? 'rgba(214,172,84,1)' : 'rgba(214,172,84,0)',
        border: isHovering ? '1px solid transparent' : '1px solid rgba(214,172,84,0.5)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      style={{ borderRadius: '50%' }}
    >
      <motion.span
        className="text-[10px] font-bold tracking-widest text-[#0B1026] uppercase"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        View
      </motion.span>
    </motion.div>
  );
};

export const CurrentEditSection: React.FC<CurrentEditSectionProps> = ({
  onNavigatePage,
  onOpenProduct,
}) => {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Get all products from catalog
  const allProducts = CATALOG;
  const totalProducts = allProducts.length;
  
  const products = allProducts.map((product, index) => ({
    id: String(index + 1).padStart(2, '0'),
    product,
    alignment: ['start', 'end', 'center', 'start', 'end'][index % 5] as 'start' | 'center' | 'end',
  }));

  // Setup vertical to horizontal scroll mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 20, 
    restDelta: 0.001 
  });

  // Transform vertical progress into horizontal translation
  // Calculate scroll distance based on number of products
  const scrollPercentage = Math.min(85, totalProducts * 12); // ~12% per product, max 85%
  const x = useTransform(smoothProgress, [0, 1], ["0%", isRTL ? `${scrollPercentage}%` : `-${scrollPercentage}%`]);
  
  // Background typography parallax
  const bgX = useTransform(smoothProgress, [0, 1], ["0%", isRTL ? "-20%" : "20%"]);

  // Calculate which item is currently in center
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const itemIndex = Math.floor(latest * products.length);
    setActiveItem(Math.min(Math.max(itemIndex + 1, 1), products.length));
  });

  // Calculate section height based on number of products (more products = more scroll)
  const sectionHeight = Math.max(300, totalProducts * 80); // ~80vh per product, minimum 300vh
  
  return (
    <section 
      ref={containerRef} 
      className="relative bg-[#E8E4DC] text-[#0B1026] cursor-none"
      style={{ height: `${sectionHeight}vh` }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CustomCursor isHovering={hoveredProduct !== null} />
      <SVGNoise />

      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Massive Parallax Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden z-0">
          <motion.h2 
            style={{ x: bgX }}
            className="text-[25vw] md:text-[30vw] font-serif tracking-tighter whitespace-nowrap leading-none text-[#0B1026]"
          >
            {t.hero.atelier}
          </motion.h2>
        </div>

        {/* Fixed Header */}
        <header className="relative z-20 flex justify-between items-start w-full px-6 py-8 md:px-12 md:py-12 pointer-events-none">
          <div className="overflow-hidden">
            <motion.h3 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-2xl md:text-3xl text-[#0B1026]"
            >
              Maniar Atelier
            </motion.h3>
          </div>
          <div className="text-right overflow-hidden pointer-events-auto">
            <motion.button 
              onClick={() => onNavigatePage("women")}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="group flex items-center gap-2 text-xs uppercase tracking-widest border-b border-[#0B1026]/20 pb-1 hover:border-[#D6AC54] text-[#0B1026] transition-colors"
            >
              {t.common.shopCollection} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </div>
        </header>

        {/* The Horizontal Runway */}
        <div className="absolute inset-0 flex items-center z-10">
          <motion.div 
            style={{ x }} 
            className="flex gap-12 md:gap-24 px-[10vw] md:px-[35vw] h-[60vh] items-center"
          >
            {products.map(({ id, product, alignment }) => (
              <motion.article
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => onOpenProduct(product)}
                className={`relative group flex-shrink-0 w-[70vw] md:w-[25vw] h-full flex flex-col justify-${alignment} cursor-pointer`}
              >
                {/* Image Frame */}
                <div className={`relative overflow-hidden w-full transition-all duration-700 ease-[0.16,1,0.3,1] rounded-lg ${
                  hoveredProduct === product.id ? 'h-[95%] scale-[0.98]' : 'h-[85%] scale-100'
                }`}>
                  {/* Product Image */}
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out scale-105 group-hover:scale-100"
                  />
                  
                  {/* Dark Vignette */}
                  <div className="absolute inset-0 bg-[#0B1026]/10 group-hover:bg-transparent transition-colors duration-700" />
                  <SVGNoise />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#D6AC54] text-[#0B1026] text-[10px] uppercase tracking-widest font-bold rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product Meta */}
                <div className="absolute bottom-0 left-0 w-full pt-6 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#0B1026]/50 mb-2">
                      {product.gender === 'women' ? t.nav.womensCollection : t.nav.mensCollection}
                    </span>
                    <h4 className="font-serif text-xl text-[#0B1026]">{product.name}</h4>
                  </div>
                  <span className="text-sm font-medium text-[#D6AC54]">{formatEUR(product.priceEUR)}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Fixed Footer */}
        <footer className="relative z-20 flex justify-between items-end w-full px-6 py-8 md:px-12 md:py-12 pointer-events-none">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#0B1026]/50">{t.common.new} / {t.hero.atelier}</span>
            {/* Dynamic Counter */}
            <div className="font-serif text-5xl md:text-7xl overflow-hidden h-[1.1em] flex items-start text-[#0B1026]">
              <motion.div
                animate={{ y: `-${(activeItem - 1) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                {products.map((p) => (
                  <span key={p.id} className="h-full flex items-center leading-none">{p.id}</span>
                ))}
              </motion.div>
              <span className="text-[#D6AC54]/30">/{String(totalProducts).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-widest text-[#0B1026]/50 flex items-center gap-4">
            <span className="hidden md:inline-block w-12 h-[1px] bg-[#D6AC54]/50" />
            {t.common.scroll}
          </div>
        </footer>
      </div>
    </section>
  );
};
