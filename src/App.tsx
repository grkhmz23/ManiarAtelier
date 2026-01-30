import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, MapPin, Sparkles, X, BookOpen, Truck, Heart } from "lucide-react";

import ReactorKnob from "@/components/ui/control-knob";
import IndustrialSwitch from "@/components/ui/toggle-switch";
import InstagramStoriesFloat from "@/components/ui/instagram-stories-float";
import AnimatedCardStack from "@/components/ui/animate-card-stack";
import WatchDock, { DockSection } from "@/components/watch/watch-dock";
import WatchPanel from "@/components/watch/watch-panel";

import ProductModal from "@/components/shop/product-modal";
import CartDrawer, { CartLine } from "@/components/shop/cart-drawer";
import ChatDrawer from "@/components/chat/chat-drawer";

// Pages
import BrandStory from "@/pages/BrandStory";
import CraftOrigin from "@/pages/CraftOrigin";
import ShippingDuties from "@/pages/ShippingDuties";
import Journal from "@/pages/Journal";
import MenPage from "@/pages/MenPage";
import WomenPage from "@/pages/WomenPage";

import { CATALOG, Product, ProductSize, formatEUR } from "@/lib/catalog";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

const BRAND = {
  bg: "#070817",
  ink: "#F4E5A7",
  gold: "#D6AC54",
} as const;

const BASE_SHADER = {
  gridSpacing: 0.9,
  animationSpeed: 0.65,
  rotationSpeed: 0.016,
  paletteA: [0.07, 0.08, 0.16] as [number, number, number],
  paletteB: [0.10, 0.10, 0.20] as [number, number, number],
  paletteC: [0.55, 0.45, 0.22] as [number, number, number],
  paletteD: [0.08, 0.07, 0.16] as [number, number, number],
} as const;

const MENU_ITEMS: Array<{ id: DockSection; label: string }> = [
  { id: "hero", label: "Dial" },
  { id: "collection", label: "Collection" },
  { id: "atelier", label: "Atelier" },
  { id: "journal", label: "Journal" },
  { id: "about", label: "About" },
];

const PAGE_MENU_ITEMS: Array<{ id: PageType; label: string; icon: React.ReactNode }> = [
  { id: "brand", label: "Brand Story", icon: <Heart size={16} /> },
  { id: "craft", label: "Craft & Origin", icon: <Sparkles size={16} /> },
  { id: "shipping", label: "Shipping & Returns", icon: <Truck size={16} /> },
  { id: "journal", label: "Style Guides", icon: <BookOpen size={16} /> },
];

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function cssNumber(n: number) {
  return String(n);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [section, setSection] = useState<DockSection>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [nightMode, setNightMode] = useState(false);
  const [cinematic, setCinematic] = useState(true);

  const [atelierRevealed, setAtelierRevealed] = useState(false);
  const [craft, setCraft] = useState(0.37);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOpen, setProductOpen] = useState(false);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);

  const refs = {
    hero: useRef<HTMLElement | null>(null),
    collection: useRef<HTMLElement | null>(null),
    atelier: useRef<HTMLElement | null>(null),
    journal: useRef<HTMLElement | null>(null),
    about: useRef<HTMLElement | null>(null),
  };

  const { scrollYProgress } = useScroll();

  const cartCount = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.qty, 0),
    [cartLines]
  );

  const shader = useMemo(() => {
    const c = clamp01(craft);
    const anim = cinematic ? 0.48 + c * 1.1 : 0.34 + c * 0.55;
    const rot = cinematic ? 0.010 + c * 0.028 : 0.006 + c * 0.012;
    const grid = 0.95 - c * 0.40;

    return {
      gridSpacing: grid,
      animationSpeed: anim,
      rotationSpeed: rot,
      paletteA: BASE_SHADER.paletteA,
      paletteB: BASE_SHADER.paletteB,
      paletteC: BASE_SHADER.paletteC,
      paletteD: BASE_SHADER.paletteD,
    };
  }, [craft, cinematic]);

  const cinemaBlend = useMemo(() => {
    const v = clamp01(1 - craft);
    return cinematic ? clamp01(v * 1.0) : clamp01(v * 0.45);
  }, [craft, cinematic]);

  const exposure = useMemo(() => {
    const base = nightMode ? 0.92 : 1.0;
    return clamp01(base - cinemaBlend * 0.10);
  }, [cinemaBlend, nightMode]);

  useEffect(() => {
    if (currentPage !== "home") return;
    
    const targets: Array<[DockSection, HTMLElement | null]> = [
      ["hero", refs.hero.current],
      ["collection", refs.collection.current],
      ["atelier", refs.atelier.current],
      ["journal", refs.journal.current],
      ["about", refs.about.current],
    ];

    const els = targets.map((t) => t[1]).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0];
        if (!top?.target) return;
        const found = targets.find(([, el]) => el === top.target);
        if (found) setSection(found[0]);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage]);

  const scrollToSection = (s: DockSection) => {
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => {
        const el = refs[s].current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const offset = 112;
        window.scrollTo({ top: Math.max(0, top - offset), behavior: "smooth" });
      }, 100);
    } else {
      const el = refs[s].current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const offset = 112;
      window.scrollTo({ top: Math.max(0, top - offset), behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setProductOpen(true);
  };

  const addToCart = (product: Product, size: ProductSize, qty: number = 1) => {
    const key = product.id + ":" + size;
    setCartLines((lines) => {
      const idx = lines.findIndex((l) => l.key === key);
      if (idx >= 0) {
        const copy = [...lines];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...lines, { key, product, size, qty }];
    });
  };

  const incLine = (key: string) => {
    setCartLines((lines) =>
      lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
    );
  };

  const decLine = (key: string) => {
    setCartLines((lines) =>
      lines
        .map((l) => (l.key === key ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeLine = (key: string) => {
    setCartLines((lines) => lines.filter((l) => l.key !== key));
  };

  const renderPage = () => {
    switch (currentPage) {
      case "brand":
        return <BrandStory onBack={() => navigateToPage("home")} onNavigate={(page) => navigateToPage(page as PageType)} />;
      case "craft":
        return <CraftOrigin onBack={() => navigateToPage("home")} onNavigate={(page) => navigateToPage(page as PageType)} />;
      case "shipping":
        return <ShippingDuties onBack={() => navigateToPage("home")} onNavigate={(page) => navigateToPage(page as PageType)} />;
      case "journal":
        return <Journal onBack={() => navigateToPage("home")} onNavigate={(page) => navigateToPage(page as PageType)} />;
      case "men":
        return (
          <MenPage
            onBack={() => navigateToPage("home")}
            onOpenProduct={openProduct}
            onOpenChat={() => setChatOpen(true)}
          />
        );
      case "women":
        return (
          <WomenPage
            onBack={() => navigateToPage("home")}
            onOpenProduct={openProduct}
            onOpenChat={() => setChatOpen(true)}
          />
        );
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <main className="watch-stage">
      <div className="pt-[112px] px-4 md:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 md:gap-5">
          <div>
            <WatchPanel
              id="hero"
              ref={(n) => {
                refs.hero.current = n;
              }}
              kicker="Morocco • Est. 2026"
              title="Maniar"
              rightSlot={
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigateToPage("men")}
                    className={"px-6 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 border border-[rgba(214,172,84,0.25)] border-t-2 border-t-[rgba(244,229,167,0.12)] border-b-[4px] border-b-[rgba(0,0,0,0.9)] elevation-btn " + (currentPage === "men" ? "bg-[rgba(20,25,50,0.95)] text-[#F4E5A7] border-t-[rgba(244,229,167,0.15)]" : "bg-[rgba(20,25,50,0.9)] text-[rgba(244,229,167,0.7)] hover:bg-[rgba(30,35,60,0.95)] border-t-[rgba(244,229,167,0.1)]")}
                  >
                    Men
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToPage("women")}
                    className={"px-6 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 border border-[rgba(214,172,84,0.25)] border-t-2 border-t-[rgba(244,229,167,0.12)] border-b-[4px] border-b-[rgba(0,0,0,0.9)] elevation-btn " + (currentPage === "women" ? "bg-[rgba(20,25,50,0.95)] text-[#F4E5A7] border-t-[rgba(244,229,167,0.15)]" : "bg-[rgba(20,25,50,0.9)] text-[rgba(244,229,167,0.7)] hover:bg-[rgba(30,35,60,0.95)] border-t-[rgba(244,229,167,0.1)]")}
                  >
                    Women
                  </button>
                  <div className="w-px h-6 bg-[rgba(214,172,84,0.2)]" />
                  <ReactorKnob
                    label="Dial"
                    size="md"
                    initial={Math.round(craft * 100)}
                    onChange={setCraft}
                  />
                </div>
              }
            >
              <div className="grid lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
                <WatchPanel as="div" variant="compact" kicker="Status" title="Instrument Mode">
                  <div className="flex items-center gap-2 text-xs dock-muted">
                    <MapPin size={14} />
                    Dial-driven exposure and contrast. Dark luxury always.
                  </div>

                  <p className="mt-4 text-sm md:text-base dock-muted leading-relaxed">
                    Old-timer luxury, modern discipline. The dial changes the ambience like a mechanical complication.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("collection")}
                      className="dock-btn dock-btn-primary elevation-btn"
                    >
                      Enter Collection <ArrowRight size={16} />
                    </button>

                    <button type="button" onClick={() => setChatOpen(true)} className="dock-btn elevation-btn">
                      Ask Concierge
                    </button>
                  </div>
                </WatchPanel>

                <WatchPanel as="div" variant="compact" kicker="Preview" title="Signature Frame">
                  <div className="relative rounded-2xl overflow-hidden border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] elevation-card elevation-card">
                    <img
                      src={CATALOG[0]?.image}
                      alt="Signature preview"
                      className="w-full h-[320px] md:h-[360px] object-cover opacity-[0.92]"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm">
                          <div className="font-serif text-lg">Crafted like a mechanism</div>
                          <div className="dock-muted text-xs mt-1">Materials, balance, and durability.</div>
                        </div>
                        <ArrowDown size={18} className="dock-muted" />
                      </div>
                    </div>
                  </div>
                </WatchPanel>
              </div>
            </WatchPanel>
          </div>

          <WatchPanel
            id="collection"
            ref={(n) => {
              refs.collection.current = n;
            }}
            kicker="New Season"
            title="The Collection"
          >
            <div className="mb-8">
              <AnimatedCardStack />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {CATALOG.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="text-left w-full"
                >
                  <div className="relative rounded-[22px] overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-[4px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(7,8,23,0.55)] elevation-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover opacity-[0.95] transition-transform duration-700 hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_18%,rgba(244,229,167,0.10),transparent_45%)]" />

                    {product.badge ? (
                      <div className="absolute top-4 left-4 rounded-full px-3 py-1 bg-[rgba(10,14,33,0.85)] border border-[rgba(214,172,84,0.22)] border-b-[2px] border-b-[rgba(3,4,10,0.9)] elevation-sm text-[10px] font-mono tracking-[0.22em] uppercase elevation-card">
                        {product.badge}
                      </div>
                    ) : null}

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
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="dock-muted text-sm">Want sizing help? Use concierge.</div>
              <button type="button" onClick={() => setChatOpen(true)} className="dock-btn elevation-btn">
                Size recommendation <ArrowRight size={16} />
              </button>
            </div>
          </WatchPanel>

          <WatchPanel
            id="atelier"
            ref={(n) => {
              refs.atelier.current = n;
            }}
            kicker="Behind the dial"
            title="The Atelier"
            rightSlot={
              <div className="flex flex-col items-end gap-2">
                <div className="dock-kicker">Reveal</div>
                <IndustrialSwitch
                  initialValue={atelierRevealed}
                  onToggle={setAtelierRevealed}
                  labelOff="HIDDEN"
                  labelOn="REVEALED"
                  size="sm"
                />
              </div>
            }
          >
            <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
              <WatchPanel as="div" variant="compact" kicker="Material" title="Selection">
                <p className="dock-muted text-sm leading-relaxed">
                  Wool and textiles are selected as if they were movement parts: consistency, density, longevity.
                </p>
              </WatchPanel>

              <WatchPanel as="div" variant="compact" kicker="Assembly" title="Hands">
                <p className="dock-muted text-sm leading-relaxed">
                  Each piece passes through multiple artisan steps with a strict finish standard.
                </p>
              </WatchPanel>

              <WatchPanel as="div" variant="compact" kicker="Finish" title="Detail">
                <p className="dock-muted text-sm leading-relaxed">
                  Edge work, stitching, and fit are treated like polishing and regulation.
                </p>
              </WatchPanel>
            </div>

            <AnimatePresence>
              {atelierRevealed ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden mt-4 md:mt-5"
                >
                  <div className="grid md:grid-cols-3 gap-4 md:gap-5">
                    {CATALOG.slice(0, 3).map((p) => (
                      <WatchPanel key={p.id} as="div" variant="flush" className="p-0">
                        <div className="rounded-[22px] overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-[4px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(7,8,23,0.55)] elevation-card elevation-card">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-[260px] object-cover opacity-[0.92]"
                            loading="lazy"
                          />
                          <div className="p-4">
                            <div className="dock-divider mb-3" />
                            <div className="font-serif text-lg">{p.name}</div>
                            <div className="dock-muted text-sm mt-1">Atelier detail view</div>
                          </div>
                        </div>
                      </WatchPanel>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-5 dock-divider" />
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="dock-muted text-sm">Want the full story behind our craft?</div>
              <button type="button" onClick={() => navigateToPage("craft")} className="dock-btn elevation-btn">
                Craft & Origin <ArrowRight size={16} />
              </button>
            </div>
          </WatchPanel>

          <WatchPanel
            id="journal"
            ref={(n) => {
              refs.journal.current = n;
            }}
            kicker="Editorial"
            title="Journal"
          >
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              <WatchPanel as="div" variant="compact" kicker="Statement" title="Heritage">
                <Sparkles className="text-[rgba(228,201,124,0.92)]" size={22} />
                <p className="mt-4 font-serif text-2xl leading-tight">
                  "We don't sell clothes. We sell heritage."
                </p>
                <p className="mt-4 dock-muted text-sm leading-relaxed">
                  Each thread should feel inevitable. Not trendy. Not disposable.
                </p>
                <button type="button" onClick={() => navigateToPage("brand")} className="dock-btn mt-5 elevation-btn">
                  Read our story <ArrowRight size={16} />
                </button>
              </WatchPanel>

              <WatchPanel as="div" variant="compact" kicker="Image" title="Craft Frame">
                <div className="rounded-2xl overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-[4px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(7,8,23,0.55)] elevation-card elevation-card">
                  <img
                    src={CATALOG[1]?.image}
                    alt="Journal visual"
                    className="w-full h-[320px] object-cover opacity-[0.94]"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="dock-divider mb-3" />
                    <div className="dock-muted text-sm">
                      Notes from the atelier: materials, finishing, and fit.
                    </div>
                  </div>
                </div>
              </WatchPanel>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="dock-muted text-sm">Explore our style guides and care instructions.</div>
              <button type="button" onClick={() => navigateToPage("journal")} className="dock-btn elevation-btn">
                View All Guides <ArrowRight size={16} />
              </button>
            </div>
          </WatchPanel>

          <WatchPanel
            id="about"
            ref={(n) => {
              refs.about.current = n;
            }}
            kicker="Brand"
            title="About Maniar"
          >
            <div className="grid md:grid-cols-3 gap-4 md:gap-5">
              <WatchPanel as="div" variant="compact" kicker="Design" title="Discipline">
                <p className="dock-muted text-sm leading-relaxed">
                  Shapes, seams, and silhouettes are treated like engineered geometry.
                </p>
              </WatchPanel>
              <WatchPanel as="div" variant="compact" kicker="Material" title="Longevity">
                <p className="dock-muted text-sm leading-relaxed">
                  We prioritize fabrics that age well, not fabrics that photograph well once.
                </p>
              </WatchPanel>
              <WatchPanel as="div" variant="compact" kicker="Service" title="Concierge">
                <p className="dock-muted text-sm leading-relaxed">
                  Sizing, styling, and care. A human-first approach.
                </p>
              </WatchPanel>
            </div>

            <div className="mt-5 dock-divider" />

            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PAGE_MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateToPage(item.id)}
                  className="text-left p-4 rounded-xl border border-[rgba(214,172,84,0.16)] border-b-[3px] border-b-[rgba(3,4,10,0.9)] bg-[rgba(214,172,84,0.08)] elevation-sm hover:bg-[rgba(7,8,23,0.62)] transition-all elevation-sm"
                >
                  <div className="flex items-center gap-2 text-[#D6AC54] mb-2">
                    {item.icon}
                    <span className="text-[10px] tracking-[0.22em] uppercase font-mono">Page</span>
                  </div>
                  <div className="font-serif text-lg">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 dock-divider" />

            <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="dock-muted text-sm">Maniar Atelier • Dark luxury dial interface</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setChatOpen(true)} className="dock-btn elevation-btn">
                  Contact <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </WatchPanel>
        </div>
      </div>
    </main>
  );

  const genderBtnClass = (active: boolean) =>
    "relative px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium tracking-wide transition-all duration-200 " +
    (active
      ? "bg-[rgba(214,172,84,0.2)] text-[#F4E5A7] shadow-[inset_0_1px_0_rgba(214,172,84,0.3)]"
      : "text-[rgba(244,229,167,0.6)] hover:text-[#F4E5A7] hover:bg-[rgba(214,172,84,0.08)]");

  return (
    <div
      className="min-h-screen maniar-watch"
      style={
        {
          backgroundColor: BRAND.bg,
          color: BRAND.ink,
          "--maniar-craft": cssNumber(clamp01(craft)),
          "--maniar-cinema": cssNumber(cinemaBlend),
          "--maniar-night": cssNumber(nightMode ? 1 : 0),
          "--maniar-exposure": cssNumber(exposure),
        } as React.CSSProperties
      }>

      {/* Watch Glass Overlay */}

      <WatchDock
        section={section}
        onNavigate={scrollToSection}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenChat={() => setChatOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        nightMode={nightMode}
        setNightMode={setNightMode}
        cinematic={cinematic}
        setCinematic={setCinematic}
      />


      <InstagramStoriesFloat />


      {/* Menu Modal */}
      <motion.div
        className="fixed inset-0 z-[75] flex items-center justify-center"
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        initial={false}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: isMenuOpen ? 1 : 0 }}
          onClick={() => setIsMenuOpen(false)}
        />

        <motion.div
          className="relative w-[min(920px,calc(100vw-24px))] max-h-[90vh] overflow-y-auto rounded-[28px] border border-[rgba(214,172,84,0.18)] border-b-[3px] border-b-[rgba(3,4,10,0.95)] bg-[rgba(10,14,33,0.92)] elevation-modal"
          initial={false}
          animate={{ y: isMenuOpen ? 0 : 12, scale: isMenuOpen ? 1 : 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,rgba(214,172,84,0.10),rgba(214,172,84,0.10)_1px,transparent_1px,transparent_12px)]" />

          <div className="relative p-6 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="dock-kicker">Maniar Navigation</div>
                <div className="dock-title mt-2">Choose a module</div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="h-11 w-11 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] hover:bg-white/5 flex items-center justify-center elevation-btn"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Shop Navigation */}
            <div className="mt-8">
              <div className="dock-kicker mb-3">Shop</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigateToPage("men")}
                  className="text-left rounded-2xl border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(214,172,84,0.08)] hover:bg-[rgba(7,8,23,0.62)] transition-all p-4 elevation-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-xl">Men's Collection</div>
                    <ArrowRight size={16} className="text-[rgba(228,201,124,0.92)]" />
                  </div>
                  <p className="dock-muted text-sm mt-2">Coats, djellabas, gilets & more</p>
                </button>
                <button
                  type="button"
                  onClick={() => navigateToPage("women")}
                  className="text-left rounded-2xl border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(214,172,84,0.08)] hover:bg-[rgba(7,8,23,0.62)] transition-all p-4 elevation-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-xl">Women's Collection</div>
                    <ArrowRight size={16} className="text-[rgba(228,201,124,0.92)]" />
                  </div>
                  <p className="dock-muted text-sm mt-2">Kaftans, skirts, sets & more</p>
                </button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="mt-8">
              <div className="dock-kicker mb-3">Sections</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="text-left rounded-2xl border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(214,172,84,0.08)] hover:bg-[rgba(7,8,23,0.62)] transition-all p-4 elevation-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-xl">{item.label}</div>
                      <ArrowRight size={16} className="text-[rgba(228,201,124,0.92)]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Navigation */}
            <div className="mt-8">
              <div className="dock-kicker mb-3">Pages</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAGE_MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateToPage(item.id)}
                    className="text-left rounded-2xl border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(214,172,84,0.08)] hover:bg-[rgba(7,8,23,0.62)] transition-all p-4 elevation-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#D6AC54]">{item.icon}</span>
                        <div className="font-serif text-xl">{item.label}</div>
                      </div>
                      <ArrowRight size={16} className="text-[rgba(228,201,124,0.92)]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm dock-muted">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setChatOpen(true);
                }}
                className="dock-btn elevation-btn"
              >
                Open Concierge Chat
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setCartOpen(true);
                }}
                className="dock-btn elevation-btn"
              >
                View Cart ({cartCount})
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {renderPage()}

      {/* Footer */}
      <footer className="mt-16 mx-4 md:mx-8 mb-8 rounded-[22px] md:rounded-[26px] p-8 md:p-12 dock-panel elevation-base border border-[rgba(214,172,84,0.16)] border-b-[6px] border-b-[rgba(0,0,0,0.95)] border-t-2 border-t-[rgba(244,229,167,0.25)] bg-[linear-gradient(180deg,rgba(214,172,84,0.35),rgba(214,172,84,0.25))]">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-4">Maniar</h3>
              <p className="text-sm text-[rgba(244,229,167,0.6)] leading-relaxed">Moroccan heritage, modern elegance. Handcrafted garments from the Atlas mountains.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-[rgba(244,229,167,0.6)]">
                <li><button type="button" onClick={() => navigateToPage("men")} className="hover:text-[#F4E5A7]">Men</button></li>
                <li><button type="button" onClick={() => navigateToPage("women")} className="hover:text-[#F4E5A7]">Women</button></li>
                <li><button type="button" onClick={() => scrollToSection("collection")} className="hover:text-[#F4E5A7]">Collection</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-wide uppercase mb-4">About</h4>
              <ul className="space-y-2 text-sm text-[rgba(244,229,167,0.6)]">
                <li><button type="button" onClick={() => navigateToPage("brand")} className="hover:text-[#F4E5A7]">Brand Story</button></li>
                <li><button type="button" onClick={() => navigateToPage("craft")} className="hover:text-[#F4E5A7]">Craft \& Origin</button></li>
                <li><button type="button" onClick={() => navigateToPage("journal")} className="hover:text-[#F4E5A7]">Journal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-[rgba(244,229,167,0.6)]">
                <li><button type="button" onClick={() => setChatOpen(true)} className="hover:text-[#F4E5A7]">Concierge</button></li>
                <li><button type="button" onClick={() => navigateToPage("shipping")} className="hover:text-[#F4E5A7]">Shipping \& Returns</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[rgba(214,172,84,0.1)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[rgba(244,229,167,0.4)]">© 2026 Maniar Atelier. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-[rgba(244,229,167,0.4)]">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </footer>


      <ProductModal
        open={productOpen}
        product={selectedProduct}
        onClose={() => setProductOpen(false)}
        onAdd={(product: Product, size: ProductSize) => {
          addToCart(product, size, 1);
          setProductOpen(false);
          setCartOpen(true);
        }}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={cartLines}
        onInc={incLine}
        onDec={decLine}
        onRemove={removeLine}
      />

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}