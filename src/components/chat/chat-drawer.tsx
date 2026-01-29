"use client";

import React, { useMemo, useState } from "react";
import Drawer from "@/components/ui/drawer";
import { Send, Sparkles } from "lucide-react";

type Msg = {
  id: string;
  from: "user" | "assistant";
  text: string;
};

export default function ChatDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: "m1",
      from: "assistant",
      text: "Welcome. Describe the piece you want, and I'll guide sizing, fabric, and styling.",
    },
  ]);

  const placeholder = useMemo(
    () => "Ask about sizing, fabric, delivery, or styling…",
    [],
  );

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { id: `u-${Date.now()}`, from: "user", text: t },
      {
        id: `a-${Date.now() + 1}`,
        from: "assistant",
        text: "Noted. If you share height, usual size, and preferred fit (slim/relaxed), I'll recommend the best size.",
      },
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
              placeholder={placeholder}
              className="w-full h-11 rounded-xl px-4 pr-12 bg-[rgba(7,8,23,0.72)] border border-[rgba(214,172,84,0.16)] border-b-2 border-b-[rgba(3,4,10,0.9)] text-[#F4E5A7] placeholder:text-[rgba(244,229,167,0.45)] outline-none focus:border-[rgba(214,172,84,0.35)] elevation-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button
              type="button"
              onClick={send}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.70)] hover:bg-[rgba(22,26,49,0.75)] flex items-center justify-center text-[#F4E5A7] elevation-btn"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
            <Sparkles size={14} className="text-[#D6AC54]" />
            Atelier
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={
              m.from === "assistant"
                ? "watch-surface p-4 elevation-sm"
                : "p-4 rounded-2xl border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(150,110,30,0.6)] bg-[rgba(214,172,84,0.10)] elevation-sm"
            }
          >
            <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
              {m.from === "assistant" ? "Concierge" : "You"}
            </div>
            <div className="mt-2 text-[rgba(244,229,167,0.80)] leading-relaxed">
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
