"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Ruler, Heart, Sparkles, Shirt, Droplets, Calendar, ChevronDown } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { useTranslation, useLanguage } from "@/i18n";

interface JournalProps { 
  onBack: () => void; 
  onNavigate?: (page: string) => void; 
}

export default function Journal({ onBack, onNavigate }: JournalProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  const CATEGORY_ICONS: Record<string, React.ReactNode> = { 
    [t.journal.categories.craft]: <Sparkles size={16} />, 
    [t.journal.categories.fit]: <Ruler size={16} />, 
    [t.journal.categories.occasion]: <Calendar size={16} />, 
    [t.journal.categories.care]: <Droplets size={16} /> 
  };

  const JOURNAL_ARTICLES = [
    { id: "embroidery-techniques", category: t.journal.guides.embroidery.category, title: t.journal.guides.embroidery.title, subtitle: t.journal.guides.embroidery.subtitle, image: "/images/nero-oro.png", readTime: t.journal.guides.embroidery.readTime },
    { id: "measuring-guide", category: t.journal.guides.measuring.category, title: t.journal.guides.measuring.title, subtitle: t.journal.guides.measuring.subtitle, image: "/images/verde-acqua.png", readTime: t.journal.guides.measuring.readTime },
    { id: "wedding-guest-style", category: t.journal.guides.wedding.category, title: t.journal.guides.wedding.title, subtitle: t.journal.guides.wedding.subtitle, image: "/images/elegant.png", readTime: t.journal.guides.wedding.readTime },
    { id: "care-guide", category: t.journal.guides.care.category, title: t.journal.guides.care.title, subtitle: t.journal.guides.care.subtitle, image: "/images/uomo-gilet.png", readTime: t.journal.guides.care.readTime },
  ];

  const QUICK_REF = [
    { icon: <Ruler size={24} />, title: t.journal.quickRef.sizeGuide.title, desc: t.journal.quickRef.sizeGuide.desc, target: "measuring-guide" },
    { icon: <Droplets size={24} />, title: t.journal.quickRef.careInstructions.title, desc: t.journal.quickRef.careInstructions.desc, target: "care-guide" },
    { icon: <Shirt size={24} />, title: t.journal.quickRef.stylingTips.title, desc: t.journal.quickRef.stylingTips.desc, target: "wedding-guest-style" },
    { icon: <Heart size={24} />, title: t.journal.quickRef.ourCraft.title, desc: t.journal.quickRef.ourCraft.desc, target: "embroidery-techniques" },
  ];

  return (
    <div className="min-h-screen pt-[84px] px-4 md:px-8 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2"><ArrowLeft size={16} /> {t.common.backToHome}</button>

        <GlassCard kicker={t.journal.hero.kicker} title={t.journal.hero.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed text-white/55">{t.journal.hero.intro}</p>
              <p className="mt-4 text-white/55">{t.journal.hero.intro2}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[t.journal.categories.craft, t.journal.categories.fit, t.journal.categories.occasion, t.journal.categories.care].map((cat) => (
                <div key={cat} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] text-center">
                  <div className="text-white/40 flex justify-center mb-2">{CATEGORY_ICONS[cat]}</div>
                  <div className="text-sm text-white/70">{cat}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard kicker={t.journal.guides.kicker} title={t.journal.guides.title}>
          <div className="space-y-4">
            {JOURNAL_ARTICLES.map((a) => (
              <div key={a.id} className="rounded-[20px] border border-white/10 bg-white/[0.03] overflow-hidden">
                <button type="button" onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="w-full text-left">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="md:col-span-1"><img src={a.image} alt={a.title} className="w-full h-[200px] md:h-full object-cover" /></div>
                    <div className="md:col-span-2 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white/40">{CATEGORY_ICONS[a.category]}</span>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">{a.category}</span>
                        <span className="text-[10px] text-white/35">· {a.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-2xl text-white/85">{a.title}</h3>
                      <p className="mt-1 text-white/50">{a.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2 text-white/60">
                        <span className="text-sm">{expanded === a.id ? t.journal.guides.collapse : t.journal.guides.readArticle}</span>
                        <ChevronDown size={16} className={`transition-transform ${expanded === a.id ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>
                </button>
                {expanded === a.id && (
                  <div className="border-t border-white/[0.08]">
                    <div className="p-5 md:p-8 max-w-3xl">
                      <p className="text-white/55 leading-relaxed">{t.journal.hero.intro}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.journal.quickRef.kicker} title={t.journal.quickRef.title}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_REF.map((c) => (
              <GlassCard key={c.target} as="div" variant="compact" className="text-center">
                <div className="text-white/40 flex justify-center mb-3">{c.icon}</div>
                <div className="font-semibold text-lg text-white/80">{c.title}</div>
                <p className="mt-2 text-sm text-white/50">{c.desc}</p>
                <button type="button" onClick={() => setExpanded(c.target)} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition">{t.journal.quickRef.viewGuide}</button>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard kicker={t.journal.cta.kicker} title={t.journal.cta.title}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-white/55">{t.journal.cta.text}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px">{t.journal.cta.viewCollection} <ArrowRight size={16} /></button>
              <button type="button" onClick={() => onNavigate?.("craft")} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition">{t.journal.cta.craftOrigin}</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
