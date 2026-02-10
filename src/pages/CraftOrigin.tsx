"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, MapPin, Users, Scissors, Layers, CheckCircle, AlertCircle } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

const ATELIERS = [
 { id: "fes", name: "Fes Embroidery Atelier", city: "Fes, Morocco", artisans: 12, specialty: "Tarz embroidery, Sfifa braiding", description: "A family-run atelier in the Fes medina, specializing in traditional Fassi embroidery for three generations. Each artisan trains for 5+ years before working on Maniar pieces.", image: "/images/nero-oro.png", techniques: ["Hand embroidery (tarz)", "Sfifa braided trim", "Zari metallic threadwork", "Geometric motif design"] },
 { id: "marrakech", name: "Marrakech Tailoring House", city: "Marrakech, Morocco", artisans: 8, specialty: "Structural tailoring, Djellaba construction", description: "Modern tailoring workshop combining traditional Moroccan pattern-cutting with contemporary finishing. Focus on clean lines and precise drape.", image: "/images/model-blue-long.png", techniques: ["Traditional pattern cutting", "Hand-finished seams", "Structured shoulder work", "Invisible hem stitching"] },
 { id: "atlas", name: "Atlas Wool Collective", city: "Azrou, Morocco", artisans: 15, specialty: "Wool sourcing, Traditional weaving", description: "Women's cooperative in the Atlas Mountains sourcing and processing local wool. Each piece is hand-selected for density and softness.", image: "/images/uomo-gilet.png", techniques: ["Hand wool selection", "Natural fiber processing", "Traditional loom weaving", "Quality grading"] },
];

const TECHNIQUES = [
 { name: "Sfifa", origin: "Fes tradition", description: "Hand-braided decorative trim made from silk or cotton threads. A single meter can take 4-6 hours to complete. Used on necklines, cuffs, and seams.", time: "4-6 hours per meter" },
 { name: "Tarz", origin: "Pan-Moroccan", description: "Traditional hand embroidery using counted-thread technique. Geometric patterns passed down through generations, each region with distinct motifs.", time: "8-40 hours per piece" },
 { name: "Zari", origin: "Andalusian influence", description: "Metallic threadwork using gold or silver-wrapped threads. Creates subtle shimmer without overwhelming the garment. Reserved for celebration pieces.", time: "12-30 hours per piece" },
 { name: "Aqdal", origin: "Berber tradition", description: "Hand-knotted button closures made from silk cord. More durable and elegant than machine buttons. Each knot is a small work of art.", time: "15-30 minutes per button" },
];

const MATERIALS = [
 { name: "Atlas Wool", source: "Middle Atlas Mountains", why: "Dense, naturally water-resistant, exceptional warmth-to-weight ratio. Sourced from local shepherds who practice traditional husbandry.", used: "Coats, heavy djellabas, winter caftans" },
 { name: "Egyptian Cotton", source: "Nile Delta region", why: "Extra-long staple fibers for softness and durability. Breathable for warmer climates, takes dye beautifully, ages gracefully.", used: "Summer caftans, light djellabahs, linings" },
 { name: "Silk Blend", source: "Fes looms (silk from Asia)", why: "Traditional Moroccan silk-cotton blend for drape and subtle sheen. More practical than pure silk, more elegant than cotton alone.", used: "Evening wear, celebration pieces, embroidery base" },
 { name: "French Linen", source: "Normandy, France", why: "Superior European linen for structure and cooling. We source outside Morocco when quality demands it. Honesty over nationalism.", used: "Summer blazers, structured pieces, coastal wear" },
 { name: "Viscose", source: "European mills", why: "For flow and affordability without sacrificing drape. Used strategically in linings and blends. Not hidden—honestly disclosed.", used: "Linings, blend components, fluid pieces" },
];

interface CraftOriginProps { onBack: () => void; onNavigate?: (page: string) => void; }

export default function CraftOrigin({ onBack, onNavigate }: CraftOriginProps) {
 return (
 <div className="min-h-screen pt-[84px] px-4 md:px-8 pb-20">
 <div className="mx-auto max-w-6xl flex flex-col gap-5">
 <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2"><ArrowLeft size={16} /> Back to Home</button>

 <GlassCard kicker="Trust & Transparency" title="Craft & Origin">
 <div className="grid md:grid-cols-2 gap-6 items-center">
 <div>
 <p className="text-lg leading-relaxed text-white/55">You deserve to know exactly where your clothes come from, who makes them, and how. This isn't marketing—it's accountability.</p>
 <p className="mt-4 text-white/55">Every Maniar piece can be traced to specific artisans, techniques, and materials. No vague "handcrafted" claims. Real names, real places, real craft.</p>
 <div className="mt-6 flex flex-wrap gap-4">
 {["Traceable origin", "Named artisans", "Honest materials"].map((t) => (
 <div key={t} className="flex items-center gap-2"><CheckCircle size={16} className="text-white/40" /><span className="text-sm text-white/70">{t}</span></div>
 ))}
 </div>
 </div>
 <div className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]">
 <img src="/images/nero-e-oro-marrakesh.png" alt="Artisan craftsmanship" className="w-full h-[320px] object-cover" />
 </div>
 </div>
 </GlassCard>

 <GlassCard kicker="Where It's Made" title="Our Ateliers">
 <p className="text-white/55 mb-6">We work with three primary ateliers across Morocco. Each specializes in specific techniques, and each piece is tagged with its origin.</p>
 <div className="grid md:grid-cols-3 gap-4">
 {ATELIERS.map((a) => (
 <div key={a.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]">
 <img src={a.image} alt={a.name} className="w-full h-[200px] object-cover" />
 <div className="p-4">
 <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
 <div className="font-semibold text-lg text-white/85">{a.name}</div>
 <div className="flex items-center gap-2 mt-2 text-sm text-white/50"><MapPin size={14} />{a.city}</div>
 <div className="flex items-center gap-2 mt-1 text-sm text-white/50"><Users size={14} />{a.artisans} artisans</div>
 <p className="mt-3 text-sm text-white/50 leading-relaxed">{a.description}</p>
 <div className="mt-3">
 <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-2">Techniques</div>
 <div className="flex flex-wrap gap-1">
 {a.techniques.map((t) => <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/60">{t}</span>)}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </GlassCard>

 <GlassCard kicker="How It's Made" title="Techniques">
 <p className="text-white/55 mb-6">These aren't buzzwords. Each technique has specific meaning, time investment, and visual result.</p>
 <div className="grid sm:grid-cols-2 gap-4">
 {TECHNIQUES.map((t) => (
 <GlassCard key={t.name} as="div" variant="compact" kicker={t.origin} title={t.name}>
 <p className="text-sm leading-relaxed text-white/55">{t.description}</p>
 <div className="mt-3 flex items-center gap-2"><Scissors size={14} className="text-white/40" /><span className="text-xs text-white/50">{t.time}</span></div>
 </GlassCard>
 ))}
 </div>
 </GlassCard>

 <GlassCard kicker="What It's Made Of" title="Materials">
 <p className="text-white/55 mb-6">We choose materials for hand-feel and longevity—not for marketing stories. If we source outside Morocco, we say so.</p>
 <div className="space-y-4">
 {MATERIALS.map((m) => (
 <GlassCard key={m.name} as="div" variant="compact">
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-3"><Layers size={18} className="text-white/40" /><div className="font-semibold text-xl text-white/85">{m.name}</div></div>
 <div className="mt-1 text-sm text-white/50 flex items-center gap-2"><MapPin size={12} />{m.source}</div>
 <p className="mt-3 text-sm leading-relaxed text-white/55">{m.why}</p>
 </div>
 <div className="md:w-48 shrink-0">
 <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-1">Used in</div>
 <p className="text-sm text-white/70">{m.used}</p>
 </div>
 </div>
 </GlassCard>
 ))}
 </div>
 </GlassCard>

 <GlassCard kicker="Verification" title="How to Verify">
 <div className="grid md:grid-cols-2 gap-6 items-center">
 <div>
 <p className="text-white/55 leading-relaxed">Every Maniar piece includes an origin tag with:</p>
 <ul className="mt-4 space-y-2">
 {["Atelier name and location", "Primary technique used", "Material composition (honest percentages)", "QR code linking to this page"].map((t) => (
 <li key={t} className="flex items-start gap-3"><CheckCircle size={16} className="text-white/40 mt-0.5" /><span className="text-sm text-white/55">{t}</span></li>
 ))}
 </ul>
 <p className="mt-4 text-sm text-white/50">Questions about a specific piece? Contact our concierge with your order number.</p>
 </div>
 <div className="flex justify-center">
 <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
 <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-2">Sample Origin Tag</div>
 <div className="font-semibold text-lg text-white/85">Atlas Long Coat</div>
 <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent my-3" />
 <div className="text-sm text-white/55">Fes Embroidery Atelier</div>
 <div className="text-sm text-white/55">Tarz embroidery · Sfifa trim</div>
 <div className="text-sm text-white/55 mt-2">70% Atlas Wool, 30% Viscose</div>
 <div className="mt-3 w-16 h-16 mx-auto bg-white/[0.06] rounded-lg flex items-center justify-center"><span className="text-xs text-white/40">QR</span></div>
 </div>
 </div>
 </div>
 </GlassCard>

 <GlassCard kicker="Explore More" title="Continue Learning">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <p className="text-white/55">Understand our shipping and returns, or read our style guides.</p>
 <div className="flex flex-wrap gap-3">
 <button type="button" onClick={() => onNavigate?.("shipping")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">Shipping & Returns <ArrowRight size={16} /></button>
 <button type="button" onClick={() => onNavigate?.("journal")} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">Style Guides</button>
 </div>
 </div>
 </GlassCard>
 </div>
 </div>
 );
}
