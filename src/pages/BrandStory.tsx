"use client";

import React from "react";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

const STORY_SECTIONS = [
 { id: "eastern-roots", kicker: "Philosophy", title: "What Eastern Style Means", image: "/images/elegant.png", content: "Eastern style isn't just aesthetic—it's architecture for the body. Flowing lines that respect movement. Structured shoulders that command presence without constriction. Every piece designed to make the wearer feel both rooted and elevated.", caption: "Silhouettes that honor tradition while embracing modern movement" },
 { id: "morocco-craft", kicker: "Origin", title: "Morocco's Contribution", image: "/images/nero-oro.png", content: "Morocco sits at the crossroads of Africa, Arabia, and the Mediterranean. This geography shaped centuries of textile mastery: Fes embroidery, Atlas wool weaving, Marrakech leather tanning, Saharan indigo dyeing. We don't replicate these traditions—we channel them into contemporary forms.", caption: "Crossroads of three continents, distilled into fabric" },
 { id: "tailoring", kicker: "Technique", title: "Tailoring Traditions", image: "/images/model-blue-long.png", content: "Moroccan tailoring evolved from the djellabahs of scholars and the caftans of royalty. The precision isn't industrial—it's generational. Seams are placed for drape, not just fit. Panels are cut to layer naturally. This is garment architecture passed down through hands.", caption: "Generations of knowledge in every seam placement" },
 { id: "embroidery", kicker: "Detail", title: "Embroidery & Sfifa", image: "/images/nero-e-oro-marrakesh.png", content: "Sfifa is the art of handmade braided trim—hours of work for inches of detail. Combined with tarz (embroidery) and zari (metallic threadwork), these aren't decorations. They're signatures. Each region has distinct patterns, and we source from masters who've spent decades perfecting single techniques.", caption: "Hours of handwork for inches of distinction" },
 { id: "fabric", kicker: "Material", title: "Fabric Sourcing", image: "/images/verde-acqua.png", content: "We source wool from the Middle Atlas, cotton from the Gharb plains, and silk blends from traditional looms in Fes. Each fabric is chosen not for trend but for hand-feel and longevity. The goal: pieces that age into heirlooms, not landfill.", caption: "Materials chosen for decades, not seasons" },
 { id: "dyeing", kicker: "Color", title: "Natural Dyeing Heritage", image: "/images/uomo-gilet.png", content: "Moroccan dyers have worked with saffron, indigo, pomegranate, and henna for centuries. While we use modern processes for consistency, our color palette draws from these natural origins—deep ochres, soft sage, midnight blues. Colors that don't shout but resonate.", caption: "Palette drawn from earth, not screen" },
];

const WHY_NOW = [
 { title: "Modern Cuts", description: "Traditional silhouettes refined for contemporary proportions and city life." },
 { title: "Diaspora Connection", description: "For those who carry heritage but live globally—clothes that belong everywhere." },
 { title: "Celebration Wear", description: "Weddings, Eid, gatherings. Pieces that mark moments without costume drama." },
 { title: "Daily Elevation", description: "Not just special occasions. Elevated basics for people who refuse ordinary." },
 { title: "Modest Fashion", description: "Coverage without compromise. Elegance that respects without restricting." },
 { title: "Conscious Luxury", description: "Quality over quantity. Fewer pieces, more meaning, less waste." },
];

interface BrandStoryProps { onBack: () => void; onNavigate?: (page: string) => void; }

export default function BrandStory({ onBack, onNavigate }: BrandStoryProps) {
 return (
 <div className="min-h-screen pt-[84px] px-4 md:px-8 pb-20">
 <div className="mx-auto max-w-6xl flex flex-col gap-5">
 <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2">
 <ArrowLeft size={16} /> Back to Home
 </button>

 <GlassCard kicker="Brand Story" title="The Soul of Maniar">
 <div className="grid md:grid-cols-2 gap-6 items-center">
 <div>
 <p className="text-lg leading-relaxed text-white/55">Maniar isn't about selling clothes. It's about offering a way of dressing that most of the world has forgotten—or never knew existed.</p>
 <p className="mt-4 text-lg leading-relaxed text-white/55">Eastern tailoring. Moroccan craft. Modern discipline. Every piece is designed to make you feel like you're wearing something that <em>matters</em>.</p>
 <div className="mt-6 flex items-center gap-3">
 <MapPin size={18} className="text-[#D6AC54]" />
 <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">Rooted in Morocco · Made for the World</span>
 </div>
 </div>
 <div className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]">
 <img src="/images/elegant.png" alt="Maniar brand essence" className="w-full h-[360px] object-cover" />
 </div>
 </div>
 </GlassCard>

 {STORY_SECTIONS.map((s, idx) => (
 <GlassCard key={s.id} kicker={s.kicker} title={s.title}>
 <div className={`grid md:grid-cols-2 gap-6 items-center`}>
 <div className={idx % 2 === 1 ? "md:order-2" : ""}>
 <p className="text-base leading-relaxed text-white/55">{s.content}</p>
 </div>
 <div className={`rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03] ${idx % 2 === 1 ? "md:order-1" : ""}`}>
 <img src={s.image} alt={s.title} className="w-full h-[300px] object-cover" />
 <div className="p-4">
 <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
 <p className="text-sm italic text-white/45">{s.caption}</p>
 </div>
 </div>
 </div>
 </GlassCard>
 ))}

 <GlassCard kicker="Relevance" title="Why Now">
 <p className="text-base leading-relaxed text-white/55 mb-6">This isn't nostalgia. It's recognition that the best way forward sometimes means looking at what worked for centuries—and refining it for today.</p>
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {WHY_NOW.map((item) => (
 <GlassCard key={item.title} as="div" variant="compact" title={item.title}>
 <p className="text-sm leading-relaxed text-white/55">{item.description}</p>
 </GlassCard>
 ))}
 </div>
 </GlassCard>

 <GlassCard kicker="Next Step" title="Experience the Craft">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <p className="text-white/55">Ready to see how tradition meets modern tailoring?</p>
 <div className="flex flex-wrap gap-3">
 <button type="button" onClick={() => onNavigate?.("craft")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">Explore Craft & Origin <ArrowRight size={16} /></button>
 <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">View Collection</button>
 </div>
 </div>
 </GlassCard>
 </div>
 </div>
 );
}
