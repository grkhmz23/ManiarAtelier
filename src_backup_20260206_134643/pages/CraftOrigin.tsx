"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, MapPin, Users, Scissors, Layers, CheckCircle } from "lucide-react";
import WatchPanel from "@/components/watch/watch-panel";

const ATELIERS = [
  {
    id: "fes-atelier",
    name: "Fes Embroidery Atelier",
    city: "Fes, Morocco",
    region: "Fes-Meknes",
    artisans: 12,
    specialty: "Tarz embroidery, Sfifa braiding",
    description: "A family-run atelier in the Fes medina, specializing in traditional Fassi embroidery for three generations. Each artisan trains for 5+ years before working on Maniar pieces.",
    image: "/images/nero-oro.png",
    techniques: ["Hand embroidery (tarz)", "Sfifa braided trim", "Zari metallic threadwork", "Geometric motif design"]
  },
  {
    id: "marrakech-tailoring",
    name: "Marrakech Tailoring House",
    city: "Marrakech, Morocco",
    region: "Marrakech-Safi",
    artisans: 8,
    specialty: "Structural tailoring, Djellaba construction",
    description: "Modern tailoring workshop combining traditional Moroccan pattern-cutting with contemporary finishing. Focus on clean lines and precise drape.",
    image: "/images/model-blue-long.png",
    techniques: ["Traditional pattern cutting", "Hand-finished seams", "Structured shoulder work", "Invisible hem stitching"]
  },
  {
    id: "atlas-weaving",
    name: "Atlas Wool Collective",
    city: "Azrou, Morocco",
    region: "Middle Atlas",
    artisans: 15,
    specialty: "Wool sourcing, Traditional weaving",
    description: "Women's cooperative in the Atlas Mountains sourcing and processing local wool. Each piece is hand-selected for density and softness.",
    image: "/images/uomo-gilet.png",
    techniques: ["Hand wool selection", "Natural fiber processing", "Traditional loom weaving", "Quality grading"]
  }
];

const TECHNIQUES = [
  {
    name: "Sfifa",
    origin: "Fes tradition",
    description: "Hand-braided decorative trim made from silk or cotton threads. A single meter can take 4-6 hours to complete. Used on necklines, cuffs, and seams.",
    time: "4-6 hours per meter"
  },
  {
    name: "Tarz",
    origin: "Pan-Moroccan",
    description: "Traditional hand embroidery using counted-thread technique. Geometric patterns passed down through generations, each region with distinct motifs.",
    time: "8-40 hours per piece"
  },
  {
    name: "Zari",
    origin: "Andalusian influence",
    description: "Metallic threadwork using gold or silver-wrapped threads. Creates subtle shimmer without overwhelming the garment. Reserved for celebration pieces.",
    time: "12-30 hours per piece"
  },
  {
    name: "Aqdal",
    origin: "Berber tradition",
    description: "Hand-knotted button closures made from silk cord. More durable and elegant than machine buttons. Each knot is a small work of art.",
    time: "15-30 minutes per button"
  }
];

const MATERIALS = [
  {
    name: "Atlas Wool",
    source: "Middle Atlas Mountains",
    why: "Dense, naturally water-resistant, exceptional warmth-to-weight ratio. Sourced from local shepherds who practice traditional husbandry.",
    used: "Coats, heavy djellabas, winter caftans"
  },
  {
    name: "Egyptian Cotton",
    source: "Nile Delta region",
    why: "Extra-long staple fibers for softness and durability. Breathable for warmer climates, takes dye beautifully, ages gracefully.",
    used: "Summer caftans, light djellabahs, linings"
  },
  {
    name: "Silk Blend",
    source: "Fes looms (silk from Asia)",
    why: "Traditional Moroccan silk-cotton blend for drape and subtle sheen. More practical than pure silk, more elegant than cotton alone.",
    used: "Evening wear, celebration pieces, embroidery base"
  },
  {
    name: "French Linen",
    source: "Normandy, France",
    why: "Superior European linen for structure and cooling. We source outside Morocco when quality demands it. Honesty over nationalism.",
    used: "Summer blazers, structured pieces, coastal wear"
  },
  {
    name: "Viscose",
    source: "European mills",
    why: "For flow and affordability without sacrificing drape. Used strategically in linings and blends. Not hidden—honestly disclosed.",
    used: "Linings, blend components, fluid pieces"
  }
];

interface CraftOriginProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function CraftOrigin({ onBack, onNavigate }: CraftOriginProps) {
  const [selectedAtelier, setSelectedAtelier] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-[112px] px-4 md:px-8 pb-20">
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={onBack}
          className="dock-btn elevation-btn w-fit"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Hero Section */}
        <WatchPanel kicker="Trust & Transparency" title="Craft & Origin">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed dock-muted">
                You deserve to know exactly where your clothes come from, who makes them, and how. This isn't marketing—it's accountability.
              </p>
              <p className="mt-4 dock-muted">
                Every Maniar piece can be traced to specific artisans, techniques, and materials. No vague "handcrafted" claims. Real names, real places, real craft.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#D6AC54]" />
                  <span className="text-sm">Traceable origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#D6AC54]" />
                  <span className="text-sm">Named artisans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#D6AC54]" />
                  <span className="text-sm">Honest materials</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] elevation-card">
              <img
                src="/images/nero-e-oro-marrakesh.png"
                alt="Artisan craftsmanship"
                className="w-full h-[320px] object-cover opacity-[0.92]"
              />
            </div>
          </div>
        </WatchPanel>

        {/* Ateliers Section */}
        <WatchPanel kicker="Where It's Made" title="Our Ateliers">
          <p className="dock-muted mb-6">
            We work with three primary ateliers across Morocco. Each specializes in specific techniques, and each piece is tagged with its origin.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {ATELIERS.map((atelier) => (
              <WatchPanel key={atelier.id} as="div" variant="compact" className="p-0">
                <div className="rounded-[22px] overflow-hidden border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] elevation-card">
                  <img
                    src={atelier.image}
                    alt={atelier.name}
                    className="w-full h-[200px] object-cover opacity-[0.92]"
                  />
                  <div className="p-4">
                    <div className="dock-divider mb-3" />
                    <div className="font-serif text-lg">{atelier.name}</div>
                    <div className="flex items-center gap-2 mt-2 text-sm dock-muted">
                      <MapPin size={14} />
                      {atelier.city}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm dock-muted">
                      <Users size={14} />
                      {atelier.artisans} artisans
                    </div>
                    <p className="mt-3 text-sm dock-muted leading-relaxed">
                      {atelier.description}
                    </p>
                    <div className="mt-3">
                      <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                        Techniques
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {atelier.techniques.map((tech) => (
                          <span key={tech} className="text-[11px] px-2 py-1 rounded-full bg-[rgba(214,172,84,0.12)] border border-[rgba(214,172,84,0.20)]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </WatchPanel>
            ))}
          </div>
        </WatchPanel>

        {/* Techniques Section */}
        <WatchPanel kicker="How It's Made" title="Techniques">
          <p className="dock-muted mb-6">
            These aren't buzzwords. Each technique has specific meaning, time investment, and visual result.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECHNIQUES.map((tech) => (
              <WatchPanel key={tech.name} as="div" variant="compact" kicker={tech.origin} title={tech.name}>
                <p className="dock-muted text-sm leading-relaxed">{tech.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Scissors size={14} className="text-[#D6AC54]" />
                  <span className="text-xs dock-muted">{tech.time}</span>
                </div>
              </WatchPanel>
            ))}
          </div>
        </WatchPanel>

        {/* Materials Section */}
        <WatchPanel kicker="What It's Made Of" title="Materials">
          <p className="dock-muted mb-6">
            We choose materials for hand-feel and longevity—not for marketing stories. If we source outside Morocco, we say so.
          </p>
          <div className="space-y-4">
            {MATERIALS.map((material) => (
              <WatchPanel key={material.name} as="div" variant="compact">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Layers size={18} className="text-[#D6AC54]" />
                      <div className="font-serif text-xl">{material.name}</div>
                    </div>
                    <div className="mt-1 text-sm dock-muted flex items-center gap-2">
                      <MapPin size={12} />
                      {material.source}
                    </div>
                    <p className="mt-3 dock-muted text-sm leading-relaxed">{material.why}</p>
                  </div>
                  <div className="md:w-48 shrink-0">
                    <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                      Used in
                    </div>
                    <p className="text-sm text-[#F4E5A7]">{material.used}</p>
                  </div>
                </div>
              </WatchPanel>
            ))}
          </div>
        </WatchPanel>

        {/* Verification Section */}
        <WatchPanel kicker="Verification" title="How to Verify">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="dock-muted leading-relaxed">
                Every Maniar piece includes an origin tag with:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#D6AC54] mt-0.5" />
                  <span className="text-sm dock-muted">Atelier name and location</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#D6AC54] mt-0.5" />
                  <span className="text-sm dock-muted">Primary technique used</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#D6AC54] mt-0.5" />
                  <span className="text-sm dock-muted">Material composition (honest percentages)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#D6AC54] mt-0.5" />
                  <span className="text-sm dock-muted">QR code linking to this page</span>
                </li>
              </ul>
              <p className="mt-4 text-sm dock-muted">
                Questions about a specific piece? Contact our concierge with your order number.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="p-6 rounded-2xl border border-[rgba(214,172,84,0.20)] bg-[rgba(7,8,23,0.55)] elevation-sm text-center">
                <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                  Sample Origin Tag
                </div>
                <div className="font-serif text-lg">Atlas Long Coat</div>
                <div className="dock-divider my-3" />
                <div className="text-sm dock-muted">Fes Embroidery Atelier</div>
                <div className="text-sm dock-muted">Tarz embroidery • Sfifa trim</div>
                <div className="text-sm dock-muted mt-2">70% Atlas Wool, 30% Viscose</div>
                <div className="mt-3 w-16 h-16 mx-auto bg-[rgba(244,229,167,0.1)] rounded-lg flex items-center justify-center">
                  <span className="text-xs dock-muted">QR</span>
                </div>
              </div>
            </div>
          </div>
        </WatchPanel>

        {/* CTA Section */}
        <WatchPanel kicker="Explore More" title="Continue Learning">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="dock-muted">
              Understand our shipping and returns, or read our style guides.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.('shipping')}
                className="dock-btn dock-btn-primary elevation-btn"
              >
                Shipping & Returns <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('journal')}
                className="dock-btn elevation-btn"
              >
                Style Guides
              </button>
            </div>
          </div>
        </WatchPanel>
      </div>
    </div>
  );
}
