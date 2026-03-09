"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation, useLanguage } from "@/i18n";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  page: PageType;
  image: string;
}

interface DiscoverAtelierSectionProps {
  onNavigatePage: (page: PageType) => void;
}

const NOISE_TEXTURE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

export const DiscoverAtelierSection: React.FC<DiscoverAtelierSectionProps> = ({
  onNavigatePage,
}) => {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const collectionsData: CollectionItem[] = [
    { 
      id: "women", 
      title: t.nav.womensCollection,
      subtitle: t.categories.womensEleganceDesc, 
      cta: t.common.viewCollection, 
      page: "women",
      image: "/images/black-dress.png" 
    },
    { 
      id: "men", 
      title: t.nav.mensCollection,
      subtitle: t.categories.mensCoutureDesc, 
      cta: t.common.viewCollection, 
      page: "men",
      image: "/images/uomo-gilet.png" 
    },
    { 
      id: "newin", 
      title: t.nav.collection,
      subtitle: t.hero.description, 
      cta: t.common.shopNow, 
      page: "women",
      image: "/images/elegant.png" 
    },
    { 
      id: "essentials", 
      title: t.nav.atelier,
      subtitle: t.about.disciplineDesc, 
      cta: t.common.readStory, 
      page: "brand",
      image: "/images/nero-oro.png" 
    },
  ];

  return (
    <section 
      className="relative w-full bg-[#0B1026] text-white pt-24 pb-0 md:pt-32 overflow-hidden border-t border-white/5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Side Label */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="hidden lg:block absolute right-8 top-[15%] rotate-90 origin-right text-[10px] tracking-[0.3em] text-[#D6AC54]/50 uppercase z-20 pointer-events-none"
      >
        Vol. 01 — Collections
      </motion.div>

      <div className="px-6 mx-auto w-full max-w-[1600px]">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 relative z-10"
        >
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#D6AC54]/70 mb-6 block"
            >
              {t.hero.atelier}
            </motion.span>
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tight leading-[1.1]">
              Discover the <br />
              <span className="font-light italic text-white/80">Atelier</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm md:text-base text-white/60 font-light leading-relaxed md:pb-4">
            {t.hero.description}
          </p>
        </motion.div>
      </div>

      {/* Expanding Accordion Grid */}
      <div 
        className="w-full h-[120vh] md:h-[75vh] flex flex-col md:flex-row bg-white/5 gap-[1px] border-y border-white/10 relative z-10"
        onMouseLeave={() => setHoveredId(null)}
      >
        {collectionsData.map((item, index) => {
          const isActive = hoveredId === item.id;
          const isAnyActive = hoveredId !== null;
          const flexValue = isActive ? "3" : isAnyActive ? "0.75" : "1";

          const handleClick = () => {
            if (isActive) {
              onNavigatePage(item.page);
            } else {
              setHoveredId(item.id);
            }
          };

          return (
            <div
              key={item.id}
              className="relative flex-1 overflow-hidden cursor-pointer group transition-[flex] duration-1000 ease-[0.16,1,0.3,1] bg-[#0B1026] min-h-[140px] md:min-h-0 md:min-w-[80px]"
              style={{ flex: flexValue }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={handleClick}
            >
              {/* Background Image */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
                animate={{ 
                  scale: isActive ? 1.05 : 1, 
                  opacity: isActive ? 1 : 0.7 
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1026]/80 to-[#0B1026]/40" />
              
              {/* Noise Texture */}
              <div 
                className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none" 
                style={{ backgroundImage: NOISE_TEXTURE }} 
              />

              {/* Ghost Text Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <motion.span
                  animate={{ 
                    opacity: isActive ? 0.06 : 0, 
                    scale: isActive ? 1 : 0.8, 
                    x: isActive ? 0 : -20 
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-[5rem] md:text-[8rem] lg:text-[10rem] font-serif uppercase tracking-tighter whitespace-nowrap text-white"
                >
                  {item.title}
                </motion.span>
              </div>

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026]/90 via-[#0B1026]/30 to-transparent pointer-events-none" />

              {/* Gold accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6AC54] to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: isActive ? 1 : 0, 
                  opacity: isActive ? 1 : 0 
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
                {/* Index */}
                <div className="text-[10px] tracking-[0.3em] font-mono text-white/40">
                  0{index + 1}
                </div>

                {/* Card Data */}
                <div className="flex flex-col items-start pointer-events-auto">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white whitespace-nowrap mb-2 transition-colors duration-500 group-hover:text-[#F4E5A7]">
                    {item.title}
                  </h3>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? 12 : 0
                    }}
                    className="overflow-hidden"
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-sm text-white/70 font-light max-w-[240px] mb-6 whitespace-normal leading-relaxed">
                      {item.subtitle}
                    </p>
                    <button className="group/btn flex items-center gap-2 text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/90 hover:text-[#D6AC54] transition-colors duration-300">
                      <span className="border-b border-white/30 pb-1 group-hover/btn:border-[#D6AC54] transition-colors">
                        {item.cta}
                      </span>
                      <motion.span
                        animate={{ x: isActive ? 4 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        →
                      </motion.span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6AC54]/30 to-transparent" />
    </section>
  );
};
