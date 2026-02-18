"use client";

import React from "react";
import { ArrowRight, ArrowLeft, MapPin, Users, Scissors, Layers, CheckCircle } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { useTranslation, useLanguage } from "@/i18n";

interface CraftOriginProps { 
  onBack: () => void; 
  onNavigate?: (page: string) => void; 
}

export default function CraftOrigin({ onBack, onNavigate }: CraftOriginProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();

  const ATELIERS = [
    { id: "fes", name: t.craftOrigin.ateliers.fes.name, city: t.craftOrigin.ateliers.fes.city, artisans: 12, specialty: t.craftOrigin.ateliers.fes.specialty, description: t.craftOrigin.ateliers.fes.description, image: "/images/nero-oro.png", techniques: ["Hand embroidery (tarz)", "Sfifa braided trim", "Zari metallic threadwork", "Geometric motif design"] },
    { id: "marrakech", name: t.craftOrigin.ateliers.marrakech.name, city: t.craftOrigin.ateliers.marrakech.city, artisans: 8, specialty: t.craftOrigin.ateliers.marrakech.specialty, description: t.craftOrigin.ateliers.marrakech.description, image: "/images/model-blue-long.png", techniques: ["Traditional pattern cutting", "Hand-finished seams", "Structured shoulder work", "Invisible hem stitching"] },
    { id: "atlas", name: t.craftOrigin.ateliers.atlas.name, city: t.craftOrigin.ateliers.atlas.city, artisans: 15, specialty: t.craftOrigin.ateliers.atlas.specialty, description: t.craftOrigin.ateliers.atlas.description, image: "/images/uomo-gilet.png", techniques: ["Hand wool selection", "Natural fiber processing", "Traditional loom weaving", "Quality grading"] },
  ];

  const TECHNIQUES = [
    { name: t.craftOrigin.techniques.sfifa.name, origin: t.craftOrigin.techniques.sfifa.origin, description: t.craftOrigin.techniques.sfifa.description, time: t.craftOrigin.techniques.sfifa.time },
    { name: t.craftOrigin.techniques.tarz.name, origin: t.craftOrigin.techniques.tarz.origin, description: t.craftOrigin.techniques.tarz.description, time: t.craftOrigin.techniques.tarz.time },
    { name: t.craftOrigin.techniques.zari.name, origin: t.craftOrigin.techniques.zari.origin, description: t.craftOrigin.techniques.zari.description, time: t.craftOrigin.techniques.zari.time },
    { name: t.craftOrigin.techniques.aqdal.name, origin: t.craftOrigin.techniques.aqdal.origin, description: t.craftOrigin.techniques.aqdal.description, time: t.craftOrigin.techniques.aqdal.time },
  ];

  const MATERIALS = [
    { name: t.craftOrigin.materials.atlasWool.name, source: t.craftOrigin.materials.atlasWool.source, why: t.craftOrigin.materials.atlasWool.why, used: t.craftOrigin.materials.atlasWool.used },
    { name: t.craftOrigin.materials.egyptianCotton.name, source: t.craftOrigin.materials.egyptianCotton.source, why: t.craftOrigin.materials.egyptianCotton.why, used: t.craftOrigin.materials.egyptianCotton.used },
    { name: t.craftOrigin.materials.silkBlend.name, source: t.craftOrigin.materials.silkBlend.source, why: t.craftOrigin.materials.silkBlend.why, used: t.craftOrigin.materials.silkBlend.used },
    { name: t.craftOrigin.materials.frenchLinen.name, source: t.craftOrigin.materials.frenchLinen.source, why: t.craftOrigin.materials.frenchLinen.why, used: t.craftOrigin.materials.frenchLinen.used },
    { name: t.craftOrigin.materials.viscose.name, source: t.craftOrigin.materials.viscose.source, why: t.craftOrigin.materials.viscose.why, used: t.craftOrigin.materials.viscose.used },
  ];

  return (
    <div className="min-h-screen pt-[84px] px-4 md:px-8 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2"><ArrowLeft size={16} /> {t.common.backToHome}</button>

        <GlassCard kicker={t.craftOrigin.kicker} title={t.craftOrigin.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed text-white/55">{t.craftOrigin.intro1}</p>
              <p className="mt-4 text-white/55">{t.craftOrigin.intro2}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[t.craftOrigin.traceable, t.craftOrigin.namedArtisans, t.craftOrigin.honestMaterials].map((tItem) => (
                  <div key={tItem} className="flex items-center gap-2"><CheckCircle size={16} className="text-white/40" /><span className="text-sm text-white/70">{tItem}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]">
              <img src="/images/nero-e-oro-marrakesh.png" alt="Artisan craftsmanship" className="w-full h-[320px] object-cover" />
            </div>
          </div>
        </GlassCard>

        <GlassCard kicker={t.craftOrigin.ateliers.kicker} title={t.craftOrigin.ateliers.title}>
          <p className="text-white/55 mb-6">{t.craftOrigin.ateliers.intro}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {ATELIERS.map((a) => (
              <div key={a.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/[0.03]">
                <img src={a.image} alt={a.name} className="w-full h-[200px] object-cover" />
                <div className="p-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent mb-3" />
                  <div className="font-semibold text-lg text-white/85">{a.name}</div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-white/50"><MapPin size={14} />{a.city}</div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-white/50"><Users size={14} />{a.artisans} {t.craftOrigin.ateliers.artisans}</div>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed">{a.description}</p>
                  <div className="mt-3">
                    <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-2">{t.craftOrigin.ateliers.techniques}</div>
                    <div className="flex flex-wrap gap-1">
                      {a.techniques.map((tItem) => <span key={tItem} className="text-[11px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/60">{tItem}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.craftOrigin.techniques.kicker} title={t.craftOrigin.techniques.title}>
          <p className="text-white/55 mb-6">{t.craftOrigin.techniques.intro}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECHNIQUES.map((tItem) => (
              <GlassCard key={tItem.name} as="div" variant="compact" kicker={tItem.origin} title={tItem.name}>
                <p className="text-sm leading-relaxed text-white/55">{tItem.description}</p>
                <div className="mt-3 flex items-center gap-2"><Scissors size={14} className="text-white/40" /><span className="text-xs text-white/50">{tItem.time}</span></div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.craftOrigin.materials.kicker} title={t.craftOrigin.materials.title}>
          <p className="text-white/55 mb-6">{t.craftOrigin.materials.intro}</p>
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
                    <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-1">{t.craftOrigin.materials.usedIn}</div>
                    <p className="text-sm text-white/70">{m.used}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.craftOrigin.verification.kicker} title={t.craftOrigin.verification.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-white/55 leading-relaxed">{t.craftOrigin.verification.intro}</p>
              <ul className="mt-4 space-y-2">
                {t.craftOrigin.verification.items.map((item) => (
                  <li key={item} className="flex items-start gap-3"><CheckCircle size={16} className="text-white/40 mt-0.5" /><span className="text-sm text-white/55">{item}</span></li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-white/50">{t.craftOrigin.verification.note}</p>
            </div>
            <div className="flex justify-center">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
                <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/35 mb-2">{t.craftOrigin.verification.sampleTag}</div>
                <div className="font-semibold text-lg text-white/85">{t.craftOrigin.verification.sampleName}</div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent my-3" />
                <div className="text-sm text-white/55">{t.craftOrigin.verification.sampleAtelier}</div>
                <div className="text-sm text-white/55">{t.craftOrigin.verification.sampleTechniques}</div>
                <div className="text-sm text-white/55 mt-2">{t.craftOrigin.verification.sampleComposition}</div>
                <div className="mt-3 w-16 h-16 mx-auto bg-white/[0.06] rounded-lg flex items-center justify-center"><span className="text-xs text-white/40">QR</span></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard kicker={t.craftOrigin.explore.kicker} title={t.craftOrigin.explore.title}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-white/55">{t.craftOrigin.explore.text}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate?.("shipping")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">{t.craftOrigin.explore.shipping} <ArrowRight size={16} /></button>
              <button type="button" onClick={() => onNavigate?.("journal")} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">{t.craftOrigin.explore.styleGuides}</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
