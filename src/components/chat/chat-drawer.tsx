"use client";

import React, { useState } from "react";
import Drawer from "@/components/ui/drawer";
import { Send, Sparkles } from "lucide-react";

type Msg = { id: string; from: "user" | "assistant"; text: string };

export default function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", from: "assistant", text: "Welcome. Describe the piece you want, and I'll guide sizing, fabric, and styling." },
  ]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { id: `u-${Date.now()}`, from: "user", text: t },
      { id: `a-${Date.now() + 1}`, from: "assistant", text: "Noted. If you share height, usual size, and preferred fit (slim/relaxed), I'll recommend the best size." },
    ]);
    setText("");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Concierge"
      footer={
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about sizing, fabric, delivery, or styling…"
              className="w-full h-11 rounded-xl px-4 pr-12 bg-white/[0.04] border border-white/10 text-white/90 placeholder:text-white/30 outline-none focus:border-white/25 transition"
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            />
            <button type="button" onClick={send} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition" aria-label="Send">
              <Send size={14} />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-mono text-white/35">
            <Sparkles size={12} className="text-white/40" /> Atelier
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className={m.from === "assistant"
            ? "rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            : "rounded-2xl border border-white/15 bg-white/[0.06] p-4"
          }>
            <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/70">
              {m.from === "assistant" ? "Concierge" : "You"}
            </div>
            <div className="mt-2 text-white/70 leading-relaxed">{m.text}</div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
