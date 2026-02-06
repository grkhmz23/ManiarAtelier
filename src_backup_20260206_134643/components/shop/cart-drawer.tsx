"use client";

import React, { useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Drawer from "@/components/ui/drawer";
import { Product, ProductSize, formatEUR } from "@/lib/catalog";

export type CartLine = {
  key: string;
  product: Product;
  size: ProductSize;
  qty: number;
};

export default function CartDrawer({
  open,
  onClose,
  lines,
  onInc,
  onDec,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
}) {
  const { subtotal, count } = useMemo(() => {
    const subtotal = lines.reduce((acc, l) => acc + l.product.priceEUR * l.qty, 0);
    const count = lines.reduce((acc, l) => acc + l.qty, 0);
    return { subtotal, count };
  }, [lines]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Cart"
      footer={
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
              Subtotal
            </div>
            <div className="font-serif text-lg text-[#F4E5A7]">
              {formatEUR(subtotal)}
            </div>
          </div>
          <button
            type="button"
            className="watch-btn watch-btn-primary h-10 px-4 text-sm elevation-btn"
            onClick={() => onClose()}
          >
            Checkout · {count}
          </button>
        </div>
      }
    >
      {lines.length === 0 ? (
        <div className="watch-surface p-5 elevation-sm">
          <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.60)]">
            Empty
          </div>
          <p className="mt-2 text-[rgba(244,229,167,0.75)]">
            Your cart is quiet. Add a piece from the Collection.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.key} className="watch-surface p-4 flex gap-4 elevation-sm">
              <div className="h-16 w-12 rounded-xl overflow-hidden border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.85)] elevation-image">
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-[15px] text-[#F4E5A7]">
                      {l.product.name}
                    </div>
                    <div className="text-[11px] text-[rgba(244,229,167,0.60)] mt-0.5">
                      Size {l.size} · {formatEUR(l.product.priceEUR)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(l.key)}
                    className="h-9 w-9 rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] hover:bg-[rgba(22,26,49,0.60)] flex items-center justify-center text-[rgba(244,229,167,0.80)] elevation-btn"
                    aria-label="Remove line"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.62)] overflow-hidden elevation-sm">
                    <button
                      type="button"
                      onClick={() => onDec(l.key)}
                      className="h-9 w-9 flex items-center justify-center hover:bg-[rgba(22,26,49,0.60)] text-[rgba(244,229,167,0.85)]"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="px-3 text-[12px] font-mono text-[rgba(244,229,167,0.85)]">
                      {l.qty}
                    </div>
                    <button
                      type="button"
                      onClick={() => onInc(l.key)}
                      className="h-9 w-9 flex items-center justify-center hover:bg-[rgba(22,26,49,0.60)] text-[rgba(244,229,167,0.85)]"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-[12px] text-[rgba(244,229,167,0.75)]">
                    Line:{" "}
                    <span className="font-serif text-[#F4E5A7]">
                      {formatEUR(l.product.priceEUR * l.qty)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
