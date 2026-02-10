import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Truck, Heart, Sparkles } from "lucide-react";

import GlassNav, { NavSection } from "@/components/ui/glass-nav";
import GlassCard from "@/components/ui/glass-card";
import { AtelierHero } from "@/components/home/atelier-hero";
import InstagramStoriesFloat from "@/components/ui/instagram-stories-float";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { KineticMenu } from "@/components/ui/kinetic-menu";
import "@/components/ui/kinetic-menu.css";
import { LandingSplash } from "@/components/landing-splash";
import ProductModal from "@/components/shop/product-modal";
import CartDrawer, { CartLine } from "@/components/shop/cart-drawer";
import ChatDrawer from "@/components/chat/chat-drawer";

import BrandStory from "@/pages/BrandStory";
import CraftOrigin from "@/pages/CraftOrigin";
import ShippingDuties from "@/pages/ShippingDuties";
import Journal from "@/pages/Journal";
import CollectionPage from "@/pages/CollectionPage";

import { CATALOG, Product, ProductSize, formatEUR } from "@/lib/catalog";

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

const PAGE_MENU_ITEMS: Array<{ id: PageType; label: string; icon: React.ReactNode }> = [
  { id: "brand", label: "Brand Story", icon: <Heart size={16} /> },
  { id: "craft", label: "Craft & Origin", icon: <Sparkles size={16} /> },
  { id: "shipping", label: "Shipping & Returns", icon: <Truck size={16} /> },
  { id: "journal", label: "Style Guides", icon: <BookOpen size={16} /> },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [showLanding, setShowLanding] = useState(true);
  const [section, setSection] = useState<NavSection>("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        return <CollectionPage gender="men" onBack={() => navigateToPage("home")} onOpenProduct={openProduct} onOpenChat={() => setChatOpen(true)} />;
      case "women":
        return <CollectionPage gender="women" onBack={() => navigateToPage("home")} onOpenProduct={openProduct} onOpenChat={() => setChatOpen(true)} />;
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <main className="relative">
      <div className="pt-[76px] md:pt-[84px] px-3 sm:px-4 md:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-5 md:gap-6">

          {/* ── Hero ── */}
          <div id="hero" ref={(n) => { refs.hero.current = n; }}>
            <AtelierHero
              onShopNow={() => scrollToSection("collection")}
              onOpenMen={() => navigateToPage("men")}
              onOpenWomen={() => navigateToPage("women")}
            />
          </div>

          {/* ── Category Showcase ── */}
          <GlassCard kicker="Materials & Heritage" title="Our Categories">
            <PhotoGallery
              items={[
                { id: "heritage", src: "/images/category/category1.jpg", label: "Est. 2024", title: "Heritage Textiles" },
                { id: "materials", src: "/images/category/category2.jpg", label: "Premium", title: "Atlas Materials" },
                { id: "mens", src: "/images/category/category3.jpg", label: "Collection", title: "Men's Couture" },
                { id: "womens", src: "/images/category/category4.jpg", label: "Collection", title: "Women's Elegance" },
                { id: "craft", src: "/images/category/category5.png", label: "Handmade", title: "Craftsmanship" },
                { id: "story", src: "/images/category/category6.jpg", label: "Heritage", title: "Our Story" },
              ]}
            />
          </GlassCard>

          {/* ── Collection ── */}
          <GlassCard
            id="collection"
            ref={(n) => { refs.collection.current = n; }}
            kicker="New Season"
            title="The Collection"
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

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-white/50">Need sizing help? Try the concierge.</p>
              <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                Size recommendation <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── Atelier ── */}
          <GlassCard
            id="atelier"
            ref={(n) => { refs.atelier.current = n; }}
            kicker="Behind the scenes"
            title="The Atelier"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { k: "Material", t: "Selection", d: "Wool and textiles are selected for consistency, density, and longevity — not just appearance." },
                { k: "Assembly", t: "Hands", d: "Each piece passes through multiple artisan steps with a strict finish standard." },
                { k: "Finish", t: "Detail", d: "Edge work, stitching, and fit are treated like polishing and regulation." },
              ].map((c) => (
                <GlassCard key={c.t} as="div" variant="compact" kicker={c.k} title={c.t}>
                  <p className="text-sm text-white/55 leading-relaxed">{c.d}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-5 grid md:grid-cols-3 gap-4">
              {CATALOG.slice(0, 3).map((p) => (
                <div key={p.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <img src={p.image} alt={p.name} className="w-full h-[260px] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
                    <div className="font-semibold text-white/85">{p.name}</div>
                    <div className="text-sm text-white/50 mt-1">Atelier detail view</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-white/50">Want the full story behind our craft?</p>
              <button type="button" onClick={() => navigateToPage("craft")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                Craft & Origin <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── Journal ── */}
          <GlassCard
            id="journal"
            ref={(n) => { refs.journal.current = n; }}
            kicker="Editorial"
            title="Journal"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <GlassCard as="div" variant="compact" kicker="Statement" title="Heritage">
                <Sparkles className="text-white/50" size={20} />
                <p className="mt-4 font-semibold text-2xl leading-tight text-white/85">
                  "We don't sell clothes. We sell heritage."
                </p>
                <p className="mt-3 text-sm text-white/55 leading-relaxed">
                  Each thread should feel inevitable. Not trendy. Not disposable.
                </p>
                <button type="button" onClick={() => navigateToPage("brand")} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                  Read our story <ArrowRight size={14} />
                </button>
              </GlassCard>

              <GlassCard as="div" variant="compact" kicker="Image" title="Craft Frame">
                <div className="rounded-[16px] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <img src={CATALOG[1]?.image} alt="Journal visual" className="w-full h-[320px] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
                    <p className="text-sm text-white/55">Notes from the atelier: materials, finishing, and fit.</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-white/50">Explore our style guides and care instructions.</p>
              <button type="button" onClick={() => navigateToPage("journal")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                View All Guides <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* ── About ── */}
          <GlassCard
            id="about"
            ref={(n) => { refs.about.current = n; }}
            kicker="Brand"
            title="About Maniar"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { k: "Design", t: "Discipline", d: "Shapes, seams, and silhouettes are treated like engineered geometry." },
                { k: "Material", t: "Longevity", d: "We prioritize fabrics that age well, not fabrics that photograph well once." },
                { k: "Service", t: "Concierge", d: "Sizing, styling, and care. A human-first approach." },
              ].map((c) => (
                <GlassCard key={c.t} as="div" variant="compact" kicker={c.k} title={c.t}>
                  <p className="text-sm text-white/55 leading-relaxed">{c.d}</p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/20 to-transparent" />

            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PAGE_MENU_ITEMS.map((item) => (
                <button key={item.id} type="button" onClick={() => navigateToPage(item.id)} className="text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    {item.icon}
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono">Page</span>
                  </div>
                  <div className="font-semibold text-white/85">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/20 to-transparent" />

            <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-sm text-white/50">Maniar Atelier • Moroccan heritage, modern elegance</p>
              <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition">
                Contact <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

        </div>
      </div>
    </main>
  );

  return (
    <>
      {showLanding && <LandingSplash onEnter={() => setShowLanding(false)} />}

      <div className="min-h-screen bg-[#0B1026] text-white">
        {!showLanding && <GlassNav
          section={section}
          onNavigate={scrollToSection}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenChat={() => setChatOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
        />}

        <InstagramStoriesFloat />

        {/* ── Kinetic Menu (GSAP slide-in) ── */}
        <KineticMenu
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={scrollToSection}
          onNavigatePage={navigateToPage}
          onOpenCart={() => setCartOpen(true)}
          onOpenChat={() => setChatOpen(true)}
          cartCount={cartCount}
        />

        {renderPage()}

        {/* ── Footer ── */}
        <footer className="mt-12 mx-3 sm:mx-4 md:mx-8 mb-8 rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 sm:p-8 md:p-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-xl text-white/90 mb-3">Maniar</h3>
                <p className="text-sm text-white/50 leading-relaxed">Moroccan heritage, modern elegance. Handcrafted garments from the Atlas mountains.</p>
              </div>
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">Shop</h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li><button type="button" onClick={() => navigateToPage("men")} className="hover:text-white transition-colors">Men's Collection</button></li>
                  <li><button type="button" onClick={() => navigateToPage("women")} className="hover:text-white transition-colors">Women's Collection</button></li>
                  <li><button type="button" onClick={() => navigateToPage("brand")} className="hover:text-white transition-colors">Our Story</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-white/50">
                  <li><button type="button" onClick={() => navigateToPage("shipping")} className="hover:text-white transition-colors">Shipping & Duties</button></li>
                  <li><button type="button" onClick={() => setChatOpen(true)} className="hover:text-white transition-colors">Contact Concierge</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70 mb-3">Connect</h4>
                <div className="flex gap-4 text-sm text-white/50">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between gap-4 text-xs text-white/35">
              <p>© 2026 MANIAR. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
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