"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Truck, Heart, Sparkles } from "lucide-react";

import GlassNav, { NavSection } from "@/components/ui/glass-nav";
import GlassCard from "@/components/ui/glass-card";
import TransparentHeader from "@/components/layout/TransparentHeader";
import PageHeader from "@/components/layout/PageHeader";
import FullscreenMenu from "@/components/layout/FullscreenMenu";
import { SplitHero } from "@/components/home/split-hero";
import { DiscoverAtelierSection } from "@/components/home/discover-atelier";
import { CurrentEditSection } from "@/components/home/current-edit";
import InstagramStoriesFloat from "@/components/ui/instagram-stories-float";
import { LandingSplash } from "@/components/landing-splash";
import ProductModal from "@/components/shop/product-modal";
import CartDrawer, { CartLine } from "@/components/shop/cart-drawer";
import ChatDrawer from "@/components/chat/chat-drawer";
import { LanguageSelector } from "@/components/language/LanguageSelector";

import BrandStory from "@/pages/BrandStory";
import CraftOrigin from "@/pages/CraftOrigin";
import ShippingDuties from "@/pages/ShippingDuties";
import Journal from "@/pages/Journal";
import CollectionPage from "@/pages/CollectionPage";
import MenCollection from "@/pages/MenCollection";

import { CATALOG, Product, ProductSize, formatEUR } from "@/lib/catalog";
import { useTranslation, useLanguage } from "@/i18n";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

export default function App() {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showLanding, setShowLanding] = useState(true);
  const [section, setSection] = useState<NavSection>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGlassNav, setShowGlassNav] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  const cartCount = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.qty, 0),
    [cartLines]
  );

  const PAGE_MENU_ITEMS = useMemo(() => [
    { id: "brand" as const, label: t.nav.brandStory, icon: <Heart size={16} /> },
    { id: "craft" as const, label: t.nav.craftOrigin, icon: <Sparkles size={16} /> },
    { id: "shipping" as const, label: t.nav.shippingReturns, icon: <Truck size={16} /> },
    { id: "journal" as const, label: t.nav.styleGuides, icon: <BookOpen size={16} /> },
  ], [t]);

  // Handle scroll to show GlassNav after hero
  useEffect(() => {
    if (currentPage !== "home" || showLanding) {
      setShowGlassNav(currentPage !== "home");
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setShowGlassNav(window.scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, showLanding]);

  useEffect(() => {
    if (currentPage !== "home") return;

    const targets: Array<[NavSection, HTMLElement | null]> = [
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

  const scrollToSection = (s: NavSection) => {
    if (currentPage !== "home") {
      setCurrentPage("home");
      setTimeout(() => {
        const el = refs[s].current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, top - 80), behavior: "smooth" });
      }, 100);
    } else {
      const el = refs[s].current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - 80), behavior: "smooth" });
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

  const incLine = (key: string) =>
    setCartLines((lines) => lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));

  const decLine = (key: string) =>
    setCartLines((lines) =>
      lines.map((l) => (l.key === key ? { ...l, qty: Math.max(1, l.qty - 1) } : l)).filter((l) => l.qty > 0)
    );

  const removeLine = (key: string) =>
    setCartLines((lines) => lines.filter((l) => l.key !== key));

  const renderPage = () => {
    switch (currentPage) {
      case "brand":
        return <BrandStory onBack={() => navigateToPage("home")} onNavigate={(p) => navigateToPage(p as PageType)} />;
      case "craft":
        return <CraftOrigin onBack={() => navigateToPage("home")} onNavigate={(p) => navigateToPage(p as PageType)} />;
      case "shipping":
        return <ShippingDuties onBack={() => navigateToPage("home")} onNavigate={(p) => navigateToPage(p as PageType)} />;
      case "journal":
        return <Journal onBack={() => navigateToPage("home")} onNavigate={(p) => navigateToPage(p as PageType)} />;
      case "men":
        return <MenCollection onBack={() => navigateToPage("home")} onOpenProduct={openProduct} onOpenChat={() => setChatOpen(true)} onNavigatePage={navigateToPage} />;
      case "women":
        return <CollectionPage gender="women" onBack={() => navigateToPage("home")} onOpenProduct={openProduct} onOpenChat={() => setChatOpen(true)} />;
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <main className="relative w-full overflow-x-hidden bg-[#0B1026]" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Split Hero (Full Screen) ── */}
      <div ref={(n) => { refs.hero.current = n; }}>
        <SplitHero
          onShopNow={() => scrollToSection("collection")}
          onOpenMen={() => navigateToPage("men")}
          onOpenWomen={() => navigateToPage("women")}
        />
      </div>

      {/* Content Sections with padding */}
      <div className="px-3 sm:px-4 md:px-8 pt-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 md:gap-8">

          {/* ── Discover Atelier Section (Expanding Accordion) ── */}
          <DiscoverAtelierSection onNavigatePage={navigateToPage} />

          {/* ── Current Edit (Horizontal Scroll) ── */}
          <CurrentEditSection onNavigatePage={navigateToPage} onOpenProduct={openProduct} />

          {/* ── The Collection ── */}
          <GlassCard
            id="collection"
            ref={(n) => { refs.collection.current = n; }}
            kicker={t.collection.kicker}
            title={t.collection.title}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {CATALOG.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => openProduct(product)}
                  className="text-left w-full group"
                >
                  <div className="relative rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {product.badge && (
                      <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 bg-black/40 border border-white/15 backdrop-blur text-[10px] font-semibold tracking-wider uppercase text-white/80">
                        {product.badge}
                      </div>
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
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-white/50">{t.collection.sizingHelp}</p>
              <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                {t.common.sizeRecommendation} <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── Atelier ── */}
          <GlassCard
            id="atelier"
            ref={(n) => { refs.atelier.current = n; }}
            kicker={t.atelierSection.kicker}
            title={t.atelierSection.title}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { k: t.atelierSection.material, t: t.atelierSection.selection, d: t.atelierSection.selectionDesc },
                { k: t.atelierSection.assembly, t: t.atelierSection.hands, d: t.atelierSection.handsDesc },
                { k: t.atelierSection.finish, t: t.atelierSection.detail, d: t.atelierSection.detailDesc },
              ].map((c) => (
                <GlassCard key={c.t} as="div" variant="compact" kicker={c.k} title={c.t}>
                  <p className="text-sm text-white/55 leading-relaxed">{c.d}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {CATALOG.slice(0, 3).map((p) => (
                <div key={p.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <img src={p.image} alt={p.name} className="w-full h-[260px] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
                    <div className="font-semibold text-white/85">{p.name}</div>
                    <div className="text-sm text-white/50 mt-1">{t.collection.atelierDetail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-white/50">{t.atelierSection.fullStory}</p>
              <button type="button" onClick={() => navigateToPage("craft")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                {t.atelierSection.craftOrigin} <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── Journal ── */}
          <GlassCard
            id="journal"
            ref={(n) => { refs.journal.current = n; }}
            kicker={t.journalSection.kicker}
            title={t.journalSection.title}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard as="div" variant="compact" kicker={t.journalSection.statement} title={t.journalSection.heritage}>
                <Sparkles className="text-white/50" size={20} />
                <p className="mt-4 font-semibold text-2xl leading-tight text-white/85">
                  {t.journalSection.quote}
                </p>
                <p className="mt-3 text-sm text-white/55 leading-relaxed">
                  {t.journalSection.quoteDesc}
                </p>
                <button type="button" onClick={() => navigateToPage("brand")} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                  {t.common.readStory} <ArrowRight size={14} />
                </button>
              </GlassCard>

              <GlassCard as="div" variant="compact" kicker={t.journalSection.image} title={t.journalSection.craftFrame}>
                <div className="rounded-[16px] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <img src={CATALOG[1]?.image} alt={t.journalSection.craftFrame} className="w-full h-[320px] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
                    <p className="text-sm text-white/55">{t.journalSection.craftFrameDesc}</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-white/50">{t.journalSection.explore}</p>
              <button type="button" onClick={() => navigateToPage("journal")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                {t.journalSection.viewAllGuides} <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── About ── */}
          <GlassCard
            id="about"
            ref={(n) => { refs.about.current = n; }}
            kicker={t.about.kicker}
            title={t.about.title}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { k: t.about.design, t: t.about.discipline, d: t.about.disciplineDesc },
                { k: t.about.material, t: t.about.longevity, d: t.about.longevityDesc },
                { k: t.about.service, t: t.about.concierge, d: t.about.conciergeDesc },
              ].map((c) => (
                <GlassCard key={c.t} as="div" variant="compact" kicker={c.k} title={c.t}>
                  <p className="text-sm text-white/55 leading-relaxed">{c.d}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/20 to-transparent" />

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PAGE_MENU_ITEMS.map((item) => (
                <button key={item.id} type="button" onClick={() => navigateToPage(item.id)} className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    {item.icon}
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono">{t.about.page}</span>
                  </div>
                  <div className="font-semibold text-white/85">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/20 to-transparent" />

            <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-sm text-white/50">{t.about.footer}</p>
              <div className="flex items-center gap-3">
                <LanguageSelector variant="compact" />
                <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                  {t.common.contact} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-12 mx-3 sm:mx-4 md:mx-8 mb-8 rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 sm:p-8 md:p-12" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-xl text-white/90 mb-3">{t.footer.brand}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">{t.nav.mensCollection}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><button type="button" onClick={() => navigateToPage("men")} className="hover:text-white transition-colors">{t.nav.mensCollection}</button></li>
                <li><button type="button" onClick={() => navigateToPage("women")} className="hover:text-white transition-colors">{t.nav.womensCollection}</button></li>
                <li><button type="button" onClick={() => navigateToPage("brand")} className="hover:text-white transition-colors">{t.nav.ourStory}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">{t.nav.support}</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><button type="button" onClick={() => navigateToPage("shipping")} className="hover:text-white transition-colors">{t.nav.shippingReturns}</button></li>
                <li><button type="button" onClick={() => setChatOpen(true)} className="hover:text-white transition-colors">{t.nav.brandStory}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">{t.nav.connect}</h4>
              <div className="flex gap-4 text-sm text-white/50">
                <a href="https://www.instagram.com/maniaratelier/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t.nav.instagram}</a>
              </div>
              <div className="mt-4">
                <LanguageSelector variant="default" />
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between gap-4 text-xs text-white/35">
            <p>© 2026 MANIAR. {t.nav.allRightsReserved}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">{t.nav.privacyPolicy}</a>
              <a href="#" className="hover:text-white/60 transition-colors">{t.nav.termsOfService}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );

  return (
    <>
      <div className="relative z-[200]">
        {showLanding && <LandingSplash onEnter={() => setShowLanding(false)} />}
      </div>

      <div className="min-h-screen bg-[#0B1026] text-white overflow-x-hidden selection:bg-[#D6AC54]/30 selection:text-white" dir={isRTL ? "rtl" : "ltr"}>
        {!showLanding && (
          <>
            {/* Transparent Header for Hero (only on home) */}
            {currentPage === "home" && !showGlassNav && (
              <TransparentHeader
                onOpenMenu={() => setIsMenuOpen(true)}
                onOpenCart={() => setCartOpen(true)}
                cartCount={cartCount}
                onNavigateHome={() => navigateToPage("home")}
              />
            )}

            {/* GlassNav (appears after scroll on home page) */}
            {currentPage === "home" && showGlassNav && (
              <GlassNav
                section={section}
                onNavigate={scrollToSection}
                cartCount={cartCount}
                onOpenCart={() => setCartOpen(true)}
                onOpenChat={() => setChatOpen(true)}
                onOpenMenu={() => setIsMenuOpen(true)}
              />
            )}

            {/* PageHeader (for inner pages) */}
            {currentPage !== "home" && (
              <PageHeader
                onOpenCart={() => setCartOpen(true)}
                onNavigateHome={() => navigateToPage("home")}
                cartCount={cartCount}
              />
            )}

            {/* Fullscreen Menu */}
            <FullscreenMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onNavigatePage={navigateToPage}
            />
          </>
        )}

        <InstagramStoriesFloat />

        {renderPage()}
      </div>

      <ProductModal
        open={productOpen}
        product={selectedProduct}
        onClose={() => { setProductOpen(false); setSelectedProduct(null); }}
        onAdd={(product, size) => { addToCart(product, size); setProductOpen(false); }}
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
    </>
  );
}
