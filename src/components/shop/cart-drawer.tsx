"use client";

import React, { useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Drawer from "@/components/ui/drawer";
import { Product, ProductSize, formatEUR } from "@/lib/catalog";
import { useTranslation, useLanguage } from "@/i18n";

export type CartLine = {
  key: string;
  product: Product;
  size: ProductSize;
  qty: number;
};

export default function CartDrawer({ open, onClose, lines, onInc, onDec, onRemove }: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
}) {
  const t = useTranslation();
  const { isRTL } = useLanguage();
  
  const { subtotal, count } = useMemo(() => ({
    subtotal: lines.reduce((a, l) => a + l.product.priceEUR * l.qty, 0),
    count: lines.reduce((a, l) => a + l.qty, 0),
  }), [lines]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t.cart.title}
      dir={isRTL ? "rtl" : "ltr"}
      footer={
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">{t.common.subtotal}</div>
            <div className="font-semibold text-lg text-white/90">{formatEUR(subtotal)}</div>
          </div>
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center h-10 px-5 rounded-2xl bg-white text-sm font-semibold text-black transition hover:-translate-y-px">
            {t.cart.checkoutCount.replace("{count}", String(count))}
          </button>
        </div>
      }
    >
      {lines.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">{t.cart.emptyTitle}</div>
          <p className="mt-2 text-white/55">{t.cart.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-4">
              <div className="h-16 w-12 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <img src={l.product.image} alt={l.product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[15px] text-white/85">{l.product.name}</div>
                    {/* Sale Price in Cart */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-[#D6AC54]">{formatEUR(l.product.priceEUR)}</span>
                      <span className="text-[10px] text-white/30 line-through">{formatEUR(l.product.originalPriceEUR)}</span>
                      <span className="text-[9px] text-white/40">· {t.common.size} {l.size}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => onRemove(l.key)} className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition" aria-label={t.common.remove}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] overflow-hidden">
                    <button type="button" onClick={() => onDec(l.key)} className="h-8 w-8 flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition" aria-label={t.common.decrease}><Minus size={14} /></button>
                    <div className="px-3 text-[12px] font-mono text-white/80">{l.qty}</div>
                    <button type="button" onClick={() => onInc(l.key)} className="h-8 w-8 flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition" aria-label={t.common.increase}><Plus size={14} /></button>
                  </div>
                  <div className="text-[12px] text-white/55">{t.common.lineTotal}: <span className="font-semibold text-[#D6AC54]">{formatEUR(l.product.priceEUR * l.qty)}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
