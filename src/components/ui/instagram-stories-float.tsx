"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Instagram } from "lucide-react";
import { SocialStories, type Story } from "@/components/ui/social-stories";

const STORAGE_KEY_X = "maniar:ig_float_x";
const STORAGE_KEY_Y = "maniar:ig_float_y";

function safeNumber(v: unknown) {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

export default function InstagramStoriesFloat() {
  const boundsRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const igUrl =
    (import.meta as any)?.env?.VITE_INSTAGRAM_URL || "https://instagram.com";

  const stories = useMemo<Story[]>(
    () => [
      { id: "1", platform: "instagram", mediaUrl: "/images/elegant.png", linkUrl: igUrl, caption: "Maniar Atelier", duration: 5 },
      { id: "2", platform: "instagram", mediaUrl: "/images/gemini.png", linkUrl: igUrl, caption: "New silhouettes", duration: 5 },
      { id: "3", platform: "instagram", mediaUrl: "/images/nero-e-oro-marrakesh.png", linkUrl: igUrl, caption: "Gold hour", duration: 5 },
      { id: "4", platform: "instagram", mediaUrl: "/images/model-blue-long.png", linkUrl: igUrl, caption: "Atlas line", duration: 5 },
      { id: "5", platform: "instagram", mediaUrl: "/images/uomo-gilet.png", linkUrl: igUrl, caption: "Tailored waistcoat", duration: 5 },
    ],
    [igUrl],
  );

  const profile = useMemo(
    () => ({
      name: "Maniar",
      avatarUrl: "/logoManiar.jpeg",
    }),
    [],
  );

  const resetPosition = () => {
    x.set(0);
    y.set(0);
    localStorage.removeItem(STORAGE_KEY_X);
    localStorage.removeItem(STORAGE_KEY_Y);
  };

  useEffect(() => {
    const sx = safeNumber(localStorage.getItem(STORAGE_KEY_X));
    const sy = safeNumber(localStorage.getItem(STORAGE_KEY_Y));

    const maxX = Math.max(120, Math.floor(window.innerWidth * 0.6));
    const maxY = Math.max(160, Math.floor(window.innerHeight * 0.6));

    const nextX = sx ?? 0;
    const nextY = sy ?? 0;

    if (Math.abs(nextX) > maxX || Math.abs(nextY) > maxY) {
      resetPosition();
      return;
    }
    x.set(nextX);
    y.set(nextY);
  }, [x, y]);

  const onDragEnd = () => {
    localStorage.setItem(STORAGE_KEY_X, String(x.get()));
    localStorage.setItem(STORAGE_KEY_Y, String(y.get()));
  };

  return (
    <>
      {/* Full-screen bounds (invisible) */}
      <div ref={boundsRef} className="fixed inset-0 z-[220] pointer-events-none" />

      {/* Draggable, pinned-right launcher */}
      <motion.div
        className="fixed right-5 top-[calc(50%+44px)] -translate-y-1/2 z-[230] pointer-events-auto select-none cursor-move"
        drag
        dragConstraints={boundsRef}
        dragElastic={0.08}
        dragMomentum={false}
        style={{ x, y }}
        onDragEnd={onDragEnd}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetPosition();
        }}
        aria-label="Instagram gallery stories"
      >
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-2 border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.72)] text-[#F4E5A7] backdrop-blur elevation-sm">
            <Instagram className="w-4 h-4 text-[#D6AC54]" />
            <span className="text-xs tracking-widest uppercase text-[rgba(244,229,167,0.78)]">
              Gallery
            </span>
          </div>

          <div className="relative elevation-base rounded-full">
            <SocialStories stories={stories} profile={profile} />
            <div className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full border border-[rgba(214,172,84,0.30)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(7,8,23,0.92)] shadow-lg flex items-center justify-center elevation-sm">
              <Instagram className="w-4 h-4 text-[#D6AC54]" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
