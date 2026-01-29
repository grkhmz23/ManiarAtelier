"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Moon,
  ShoppingBag,
  Sparkles,
  Menu,
} from "lucide-react";
import PusherButton from "@/components/ui/pusher-button";
import { cn } from "@/lib/utils";

export type DockSection =
  | "hero"
  | "collection"
  | "atelier"
  | "journal"
  | "about";

export type WatchDockProps = {
  section: DockSection;
  onNavigate: (to: DockSection) => void;

  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenMenu: () => void;

  nightMode: boolean;
  setNightMode: (v: boolean) => void;

  cinematic: boolean;
  setCinematic: (v: boolean) => void;
};

type DockItem = {
  id: DockSection;
  label: string;
};

const NAV: DockItem[] = [
  { id: "hero", label: "Dial" },
  { id: "collection", label: "Collection" },
  { id: "atelier", label: "Atelier" },
  { id: "journal", label: "Journal" },
  { id: "about", label: "About" },
];

export default function WatchDock({
  section,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenMenu,
  nightMode,
  setNightMode,
  cinematic,
  setCinematic,
}: WatchDockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { date, time } = useMemo(() => {
    const date = now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
    });
    const time = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { date, time };
  }, [now]);

  const Pill = ({ id, label }: DockItem) => (
    <button
      type="button"
      onClick={() => onNavigate(id)}
      className={cn(
        "px-3 h-9 rounded-full text-[11px] tracking-[0.22em] uppercase font-mono",
        "border transition-all duration-200",
        "elevation-btn",
        section === id
          ? "border-[rgba(214,172,84,0.60)] bg-[rgba(214,172,84,0.14)] text-[#F4E5A7]"
          : "border-[rgba(214,172,84,0.18)] hover:bg-[rgba(22,26,49,0.55)] text-[rgba(244,229,167,0.75)]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[200]">
      <div className={cn("mx-auto w-full px-4 md:px-10 h-[84px] flex items-center")}>
        <motion.div
          className={cn(
            "relative w-full rounded-[30px] overflow-hidden",
            "border border-[rgba(214,172,84,0.18)]",
            "border-b-[3px] border-b-[rgba(3,4,10,0.95)]",
            "elevation-header",
            "backdrop-blur-xl",
          )}
          style={{
            background:
              "linear-gradient(180deg, rgba(22,26,49,0.78), rgba(7,8,23,0.82))",
          }}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(244,229,167,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(214,172,84,0.10),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] bg-[repeating-linear-gradient(45deg,rgba(214,172,84,0.45),rgba(214,172,84,0.45)_1px,transparent_1px,transparent_12px)]" />

          <div className="relative px-4 md:px-6 h-[84px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[260px]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] shadow-sm bg-[rgba(10,14,33,0.82)] elevation-sm">
                  <img src="/logoManiar.jpeg" alt="Maniar" className="h-full w-full object-cover" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-serif text-lg leading-tight text-[#F4E5A7]">Maniar</div>
                  <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                    {date} · {time}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <PusherButton
                  size="sm"
                  active={cinematic}
                  onClick={() => setCinematic(!cinematic)}
                  aria-label="Toggle cinema dial"
                  title="Cinema"
                >
                  <Sparkles size={16} />
                </PusherButton>

                <PusherButton
                  size="sm"
                  active={nightMode}
                  onClick={() => setNightMode(!nightMode)}
                  aria-label="Toggle night density"
                  title="Night"
                >
                  <Moon size={16} />
                </PusherButton>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {NAV.map((it) => (
                <Pill key={it.id} {...it} />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 min-w-[220px]">
              <PusherButton
                size="md"
                onClick={onOpenChat}
                aria-label="Open concierge chat"
                title="Concierge"
              >
                <MessageCircle size={18} />
              </PusherButton>

              <button
                type="button"
                onClick={onOpenCart}
                className={cn(
                  "relative h-9 md:h-10 px-4 rounded-full",
                  "border border-[rgba(214,172,84,0.18)]",
                  "border-b-2 border-b-[rgba(3,4,10,0.9)]",
                  "bg-[rgba(10,14,33,0.70)] backdrop-blur",
                  "hover:bg-[rgba(22,26,49,0.78)]",
                  "flex items-center gap-2",
                  "text-[rgba(244,229,167,0.86)]",
                  "elevation-btn",
                )}
              >
                <ShoppingBag size={18} />
                <span className="hidden md:inline text-[11px] tracking-[0.22em] uppercase font-mono">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-mono bg-[rgba(214,172,84,0.20)] border border-[rgba(214,172,84,0.55)] text-[#F4E5A7]">
                    {cartCount}
                  </span>
                )}
              </button>

              <PusherButton size="md" onClick={onOpenMenu} aria-label="Open menu" title="Menu">
                <Menu size={18} />
              </PusherButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
