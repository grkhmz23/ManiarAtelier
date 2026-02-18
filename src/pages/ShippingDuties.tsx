"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Truck, Globe, RefreshCw, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import { useTranslation, useLanguage } from "@/i18n";

interface ShippingDutiesProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function ShippingDuties({ onBack, onNavigate }: ShippingDutiesProps) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const SHIPPING_REGIONS = [
    { id: "eu", region: t.shipping.byRegion.eu },
    { id: "uk", region: t.shipping.byRegion.uk },
    { id: "us", region: t.shipping.byRegion.us },
    { id: "canada", region: t.shipping.byRegion.canada },
    { id: "mena", region: t.shipping.byRegion.mena },
    { id: "row", region: t.shipping.byRegion.row },
  ];

  const RETURNS_POLICY = {
    window: t.shipping.returns.window,
    condition: t.shipping.returns.condition,
    process: t.shipping.returns.process,
    exceptions: t.shipping.returns.finalSale,
  };

  return (
    <div className="min-h-screen pt-[112px] px-4 md:px-8 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition w-fit"
        >
          <ArrowLeft size={16} /> {t.common.backToHome}
        </button>

        {/* Hero Section */}
        <GlassCard kicker={t.shipping.kicker} title={t.shipping.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed text-white/55">
                {t.shipping.intro}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">{t.shipping.freeShipping}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">{t.shipping.worldwide}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">{t.shipping.ddp}</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">{t.shipping.easyExchanges}</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="text-center">
                <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-2">
                  {t.shipping.ddpTitle}
                </div>
                <div className="font-serif text-xl mt-2">{t.shipping.ddpSubtitle}</div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent my-4" />
                <p className="text-white/55 text-sm">
                  {t.shipping.ddpDesc}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-white/50">
                  <CheckCircle size={16} />
                  <span className="text-sm">{t.shipping.ddpRegions}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Shipping by Region */}
        <GlassCard kicker={t.shipping.byRegion.kicker} title={t.shipping.byRegion.title}>
          <p className="text-white/55 mb-6">
            {t.shipping.byRegion.intro}
          </p>
          <div className="space-y-3">
            {SHIPPING_REGIONS.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedRegion(expandedRegion === r.id ? null : r.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[rgba(214,172,84,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Globe size={20} className="text-[#D6AC54]" />
                    <div>
                      <div className="font-serif text-lg">{r.region.name}</div>
                      <div className="text-sm text-white/55">{r.region.time} · {r.region.cost.split('•')[0].trim()}</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className={`text-white/55 transition-transform ${expandedRegion === r.id ? 'rotate-90' : ''}`}
                  />
                </button>
                
                {expandedRegion === r.id && (
                  <div className="px-4 pb-4 border-t border-[rgba(214,172,84,0.10)]">
                    <div className="pt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.countries}</div>
                        <p className="text-sm text-white/55">{r.region.countries}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.deliveryTime}</div>
                        <p className="text-sm text-white/90">{r.region.time}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.shippingCost}</div>
                        <p className="text-sm text-white/90">{r.region.cost}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.dutiesTaxes}</div>
                        <p className="text-sm text-white/90">{r.region.duties}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.carrier}</div>
                        <p className="text-sm text-white/55">{r.region.carrier}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-1">{t.shipping.byRegion.tracking}</div>
                        <p className="text-sm text-white/55">{r.region.tracking}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Duties Explanation */}
        <GlassCard kicker={t.shipping.understanding.kicker} title={t.shipping.understanding.title}>
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard as="div" variant="compact" kicker={t.shipping.understanding.ddp.kicker} title={t.shipping.understanding.ddp.title}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-[#D6AC54]" />
                <span className="text-sm text-white/90">{t.shipping.understanding.ddp.regions}</span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">
                {t.shipping.understanding.ddp.desc}
              </p>
            </GlassCard>
            
            <GlassCard as="div" variant="compact" kicker={t.shipping.understanding.dap.kicker} title={t.shipping.understanding.dap.title}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-white/55" />
                <span className="text-sm text-white/90">{t.shipping.understanding.dap.regions}</span>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">
                {t.shipping.understanding.dap.desc}
              </p>
            </GlassCard>
          </div>
        </GlassCard>

        {/* Returns Policy */}
        <GlassCard kicker={t.shipping.returns.kicker} title={t.shipping.returns.title}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-[#D6AC54]" />
                <span className="font-serif text-xl">{RETURNS_POLICY.window}</span>
              </div>
              <p className="text-white/55 text-sm mb-4">
                <strong>Condition:</strong> {RETURNS_POLICY.condition}
              </p>
              
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-2">
                {t.shipping.returns.returnProcess}
              </div>
              <ol className="space-y-2">
                {RETURNS_POLICY.process.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-white/55">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-2">
                {t.shipping.returns.returnShipping}
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#D6AC54]" />
                  <span className="text-sm text-white/55">{t.shipping.returns.euUkUs}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#D6AC54]" />
                  <span className="text-sm text-white/55">{t.shipping.returns.canada}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-white/45" />
                  <span className="text-sm text-white/55">{t.shipping.returns.other}</span>
                </div>
              </div>
              
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#D6AC54]/70 mb-2">
                {t.shipping.returns.exceptions}
              </div>
              <ul className="space-y-1">
                {RETURNS_POLICY.exceptions.map((exc, idx) => (
                  <li key={idx} className="text-sm text-white/55">• {exc}</li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Exchanges */}
        <GlassCard kicker={t.shipping.exchanges.kicker} title={t.shipping.exchanges.title}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw size={20} className="text-[#D6AC54]" />
                <span className="font-serif text-xl">{t.shipping.exchanges.freeExchanges}</span>
              </div>
              <p className="text-white/55 leading-relaxed">
                {t.shipping.exchanges.process}
              </p>
              <p className="mt-4 text-sm text-white/55 italic">
                {t.shipping.exchanges.note}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="text-center">
                <RefreshCw size={32} className="text-white/50 mx-auto mb-3" />
                <div className="font-serif text-lg">{t.shipping.exchanges.shipFirst}</div>
                <p className="mt-2 text-sm text-white/55">
                  {t.shipping.exchanges.shipFirstDesc}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Summary Card for Product Pages */}
        <GlassCard kicker={t.shipping.summary.kicker} title={t.shipping.summary.title}>
          <p className="text-white/55 mb-4">
            {t.shipping.summary.intro}
          </p>
          <div className="max-w-md p-4 rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#D6AC54]" />
                <span className="text-white/55">{t.shipping.summary.freeShipping}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#D6AC54]" />
                <span className="text-white/55">{t.shipping.summary.dutiesIncluded}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="text-[#D6AC54]" />
                <span className="text-white/55">{t.shipping.summary.returns}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* CTA Section */}
        <GlassCard kicker={t.shipping.help.kicker} title={t.shipping.help.title}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-white/55">
              {t.shipping.help.text}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-px"
              >
                {t.shipping.help.shopCollection} <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('journal')}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition"
              >
                {t.shipping.help.readStyleGuides}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
