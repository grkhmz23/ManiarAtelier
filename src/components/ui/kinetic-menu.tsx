import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ShoppingBag, MessageCircle, X } from "lucide-react";
import type { NavSection } from "@/components/ui/glass-nav";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

type PageType = "home" | "brand" | "craft" | "shipping" | "journal" | "men" | "women";

interface KineticMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  onNavigatePage: (page: PageType) => void;
  onOpenCart: () => void;
  onOpenChat: () => void;
  cartCount: number;
}

const MENU_LINKS: Array<{ label: string; action: "page" | "section"; target: string }> = [
  { label: "Men's Collection", action: "page", target: "men" },
  { label: "Women's Collection", action: "page", target: "women" },
  { label: "The Atelier", action: "section", target: "atelier" },
  { label: "Our Story", action: "page", target: "brand" },
  { label: "Craft & Origin", action: "page", target: "craft" },
  { label: "Journal", action: "page", target: "journal" },
  { label: "Shipping & Returns", action: "page", target: "shipping" },
];

const SECTION_PILLS: Array<{ label: string; section: NavSection }> = [
  { label: "Home", section: "hero" },
  { label: "Collection", section: "collection" },
  { label: "Atelier", section: "atelier" },
  { label: "Journal", section: "journal" },
  { label: "About", section: "about" },
];

export function KineticMenu({
  open,
  onClose,
  onNavigate,
  onNavigatePage,
  onOpenCart,
  onOpenChat,
  cartCount,
}: KineticMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRegisteredEase = useRef(false);

  /* ── Register custom ease once ── */
  useEffect(() => {
    if (hasRegisteredEase.current) return;
    try {
      CustomEase.create("km-ease", "0.65, 0.01, 0.05, 0.99");
      hasRegisteredEase.current = true;
    } catch {
      /* CustomEase may fail in some envs — GSAP defaults are fine */
    }
  }, []);

  /* ── Shape hover animation on menu links ── */
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".km-link[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".km-shapes");

      menuItems.forEach((item) => {
        const idx = item.getAttribute("data-shape");
        const shape = shapesContainer?.querySelector(`.km-shape-${idx}`);
        if (!shape) return;

        const els = shape.querySelectorAll(".km-shape-el");

        const onEnter = () => {
          shapesContainer
            ?.querySelectorAll(".km-shape")
            .forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            els,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            },
          );
        };

        const onLeave = () => {
          gsap.to(els, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as any)._kmClean = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current
        ?.querySelectorAll(".km-link[data-shape]")
        .forEach((el: any) => el._kmClean?.());
    };
  }, []);

  /* ── Open / close timeline ── */
  useEffect(() => {
    if (!containerRef.current) return;

    const ease = hasRegisteredEase.current ? "km-ease" : "power2.out";

    const ctx = gsap.context(() => {
      const wrapper = containerRef.current!.querySelector(".km-wrapper");
      const panel = containerRef.current!.querySelector(".km-panel");
      const overlay = containerRef.current!.querySelector(".km-overlay");
      const bgLayers = containerRef.current!.querySelectorAll(".km-bg-layer");
      const links = containerRef.current!.querySelectorAll(".km-link");
      const fades = containerRef.current!.querySelectorAll("[data-km-fade]");

      const tl = gsap.timeline({ defaults: { ease, duration: 0.7 } });

      if (open) {
        tl.set(wrapper, { display: "block", pointerEvents: "auto" })
          .set(panel, { xPercent: 0 })
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
          .fromTo(
            bgLayers,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<",
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35",
          );

        if (fades.length) {
          tl.fromTo(
            fades,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" },
            "<+=0.2",
          );
        }
      } else {
        tl.to(overlay, { autoAlpha: 0, duration: 0.3 })
          .to(panel, { xPercent: 120, duration: 0.4 }, "<")
          .set(wrapper, { display: "none", pointerEvents: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [open]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* ── Link click dispatcher ── */
  const handleLink = (link: (typeof MENU_LINKS)[number]) => {
    if (link.action === "page") onNavigatePage(link.target as PageType);
    else onNavigate(link.target as NavSection);
    onClose();
  };

  return (
    <div ref={containerRef} className="km-container">
      <div
        className="km-wrapper"
        style={{ display: "none", pointerEvents: "none" }}
      >
        {/* Overlay */}
        <div className="km-overlay" onClick={onClose} />

        {/* Slide-in panel */}
        <nav className="km-panel">
          {/* Background layers (3 staggered panels) */}
          <div className="km-bg">
            <div className="km-bg-layer km-bg-first" />
            <div className="km-bg-layer km-bg-second" />
            <div className="km-bg-layer" />

            {/* Gold-tinted SVG shapes that animate on link hover */}
            <div className="km-shapes">
              {/* Shape 1: Floating gold circles */}
              <svg className="km-shape km-shape-1" viewBox="0 0 400 400" fill="none">
                <circle className="km-shape-el" cx="80" cy="120" r="40" fill="rgba(214,172,84,0.12)" />
                <circle className="km-shape-el" cx="300" cy="80" r="60" fill="rgba(244,229,167,0.08)" />
                <circle className="km-shape-el" cx="200" cy="300" r="80" fill="rgba(214,172,84,0.06)" />
                <circle className="km-shape-el" cx="350" cy="280" r="30" fill="rgba(244,229,167,0.1)" />
              </svg>

              {/* Shape 2: Wave pattern */}
              <svg className="km-shape km-shape-2" viewBox="0 0 400 400" fill="none">
                <path className="km-shape-el" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(214,172,84,0.15)" strokeWidth="60" fill="none" />
                <path className="km-shape-el" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(244,229,167,0.1)" strokeWidth="40" fill="none" />
              </svg>

              {/* Shape 3: Grid dots */}
              <svg className="km-shape km-shape-3" viewBox="0 0 400 400" fill="none">
                <circle className="km-shape-el" cx="50" cy="50" r="8" fill="rgba(214,172,84,0.25)" />
                <circle className="km-shape-el" cx="150" cy="50" r="8" fill="rgba(244,229,167,0.2)" />
                <circle className="km-shape-el" cx="250" cy="50" r="8" fill="rgba(214,172,84,0.2)" />
                <circle className="km-shape-el" cx="350" cy="50" r="8" fill="rgba(244,229,167,0.25)" />
                <circle className="km-shape-el" cx="100" cy="150" r="12" fill="rgba(214,172,84,0.15)" />
                <circle className="km-shape-el" cx="200" cy="150" r="12" fill="rgba(244,229,167,0.15)" />
                <circle className="km-shape-el" cx="300" cy="150" r="12" fill="rgba(214,172,84,0.15)" />
                <circle className="km-shape-el" cx="50" cy="250" r="10" fill="rgba(244,229,167,0.2)" />
                <circle className="km-shape-el" cx="150" cy="250" r="10" fill="rgba(214,172,84,0.2)" />
                <circle className="km-shape-el" cx="250" cy="250" r="10" fill="rgba(244,229,167,0.15)" />
                <circle className="km-shape-el" cx="350" cy="250" r="10" fill="rgba(214,172,84,0.2)" />
              </svg>

              {/* Shape 4: Organic blobs */}
              <svg className="km-shape km-shape-4" viewBox="0 0 400 400" fill="none">
                <path className="km-shape-el" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(214,172,84,0.1)" />
                <path className="km-shape-el" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(244,229,167,0.07)" />
              </svg>

              {/* Shape 5: Diagonal lines */}
              <svg className="km-shape km-shape-5" viewBox="0 0 400 400" fill="none">
                <line className="km-shape-el" x1="0" y1="100" x2="300" y2="400" stroke="rgba(214,172,84,0.12)" strokeWidth="30" />
                <line className="km-shape-el" x1="100" y1="0" x2="400" y2="300" stroke="rgba(244,229,167,0.08)" strokeWidth="25" />
                <line className="km-shape-el" x1="200" y1="0" x2="400" y2="200" stroke="rgba(214,172,84,0.06)" strokeWidth="20" />
              </svg>

              {/* Shape 6: Concentric arcs */}
              <svg className="km-shape km-shape-6" viewBox="0 0 400 400" fill="none">
                <path className="km-shape-el" d="M200 400 A200 200 0 0 1 0 200" stroke="rgba(214,172,84,0.12)" strokeWidth="40" fill="none" />
                <path className="km-shape-el" d="M200 350 A150 150 0 0 1 50 200" stroke="rgba(244,229,167,0.08)" strokeWidth="30" fill="none" />
                <path className="km-shape-el" d="M200 300 A100 100 0 0 1 100 200" stroke="rgba(214,172,84,0.06)" strokeWidth="20" fill="none" />
              </svg>

              {/* Shape 7: Diamond grid */}
              <svg className="km-shape km-shape-7" viewBox="0 0 400 400" fill="none">
                <rect className="km-shape-el" x="170" y="50" width="60" height="60" rx="8" transform="rotate(45 200 80)" fill="rgba(214,172,84,0.12)" />
                <rect className="km-shape-el" x="70" y="170" width="80" height="80" rx="10" transform="rotate(45 110 210)" fill="rgba(244,229,167,0.08)" />
                <rect className="km-shape-el" x="270" y="220" width="50" height="50" rx="6" transform="rotate(45 295 245)" fill="rgba(214,172,84,0.1)" />
                <rect className="km-shape-el" x="150" y="280" width="70" height="70" rx="8" transform="rotate(45 185 315)" fill="rgba(244,229,167,0.06)" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="km-content">
            {/* Header row */}
            <div className="km-header">
              <div className="km-brand-tag">Maniar Atelier</div>
              <button
                className="km-close"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main navigation links */}
            <ul className="km-links">
              {MENU_LINKS.map((link, i) => (
                <li key={link.label} className="km-link-item">
                  <button
                    className="km-link"
                    data-shape={String((i % 7) + 1)}
                    onClick={() => handleLink(link)}
                  >
                    <span className="km-link-text">{link.label}</span>
                    <div className="km-link-hover-bg" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Section shortcut pills */}
            <div className="km-section-pills" data-km-fade>
              <div className="km-pills-label">Sections</div>
              <div className="km-pills-row">
                {SECTION_PILLS.map((pill) => (
                  <button
                    key={pill.section}
                    className="km-pill"
                    onClick={() => {
                      onNavigate(pill.section);
                      onClose();
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom action buttons */}
            <div className="km-actions" data-km-fade>
              <button
                className="km-action-btn"
                onClick={() => {
                  onOpenChat();
                  onClose();
                }}
              >
                <MessageCircle size={16} />
                <span>Concierge</span>
              </button>
              <button
                className="km-action-btn"
                onClick={() => {
                  onOpenCart();
                  onClose();
                }}
              >
                <ShoppingBag size={16} />
                <span>Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
              </button>
            </div>

            {/* Footer tagline */}
            <div className="km-footer" data-km-fade>
              <p>Moroccan heritage, modern elegance</p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}