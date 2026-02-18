"use client";

import React from "react";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { useTranslation, useLanguage } from "@/i18n";

interface BrandStoryProps { 
  onBack: () => void; 
  onNavigate?: (page: string) => void; 
}

export default function BrandStory({ onBack, onNavigate }: BrandStoryProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const STORY_SECTIONS = [
    { id: "eastern-roots", kicker: t.brandStory.sections.philosophy.kicker, title: t.brandStory.sections.philosophy.title, image: "/images/elegant.png", content: t.brandStory.sections.philosophy.content, caption: t.brandStory.sections.philosophy.caption },
    { id: "morocco-craft", kicker: t.brandStory.sections.origin.kicker, title: t.brandStory.sections.origin.title, image: "/images/nero-oro.png", content: t.brandStory.sections.origin.content, caption: t.brandStory.sections.origin.caption },
    { id: "tailoring", kicker: t.brandStory.sections.tailoring.kicker, title: t.brandStory.sections.tailoring.title, image: "/images/model-blue-long.png", content: t.brandStory.sections.tailoring.content, caption: t.brandStory.sections.tailoring.caption },
    { id: "embroidery", kicker: t.brandStory.sections.embroidery.kicker, title: t.brandStory.sections.embroidery.title, image: "/images/nero-e-oro-marrakesh.png", content: t.brandStory.sections.embroidery.content, caption: t.brandStory.sections.embroidery.caption },
    { id: "fabric", kicker: t.brandStory.sections.fabric.kicker, title: t.brandStory.sections.fabric.title, image: "/images/verde-acqua.png", content: t.brandStory.sections.fabric.content, caption: t.brandStory.sections.fabric.caption },
    { id: "dyeing", kicker: t.brandStory.sections.dyeing.kicker, title: t.brandStory.sections.dyeing.title, image: "/images/uomo-gilet.png", content: t.brandStory.sections.dyeing.content, caption: t.brandStory.sections.dyeing.caption },
  ];

  const WHY_NOW = [
    { title: t.brandStory.relevance.modernCuts.title, description: t.brandStory.relevance.modernCuts.desc },
    { title: t.brandStory.relevance.diaspora.title, description: t.brandStory.relevance.diaspora.desc },
    { title: t.brandStory.relevance.celebration.title, description: t.brandStory.relevance.celebration.desc },
    { title: t.brandStory.relevance.daily.title, description: t.brandStory.relevance.daily.desc },
    { title: t.brandStory.relevance.modest.title, description: t.brandStory.relevance.modest.desc },
    { title: t.brandStory.relevance.conscious.title, description: t.brandStory.relevance.conscious.desc },
  ];

  return (
    <div className="min-h-screen pt-[84px] px-4 md:px-8 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2">
          <ArrowLeft size={16} /> {t.common.backToHome}
        </button>

        <GlassCard kicker={t.brandStory.kicker} title={t.brandStory.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed text-white/55">{t.brandStory.intro1}</p>
              <p className="mt-4 text-lg leading-relaxed text-white/55">{t.brandStory.intro2}</p>
              <div className="mt-6 flex items-center gap-3">
                <MapPin size={18} className="text-[#D6AC54]" />
                <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">{t.brandStory.rooted}</span>
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

        <GlassCard kicker={t.brandStory.relevance.kicker} title={t.brandStory.relevance.title}>
          <p className="text-base leading-relaxed text-white/55 mb-6">{t.brandStory.relevance.intro}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_NOW.map((item) => (
              <GlassCard key={item.title} as="div" variant="compact" title={item.title}>
                <p className="text-sm leading-relaxed text-white/55">{item.description}</p>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.brandStory.nextStep.kicker} title={t.brandStory.nextStep.title}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-white/55">{t.brandStory.nextStep.text}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate?.("craft")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">{t.brandStory.nextStep.exploreCraft} <ArrowRight size={16} /></button>
              <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">{t.brandStory.nextStep.viewCollection}</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
