"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  label: string;
};

function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const Photo = ({
  src,
  alt,
  direction,
  width,
  height,
  title,
  label,
}: {
  src: string;
  alt: string;
  direction: Direction;
  width: number;
  height: number;
  title?: string;
  label?: string;
}) => {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    setRotation(getRandomInRange(1, 4) * (direction === "left" ? -1 : 1));
  }, [direction]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.15, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className="relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(200); y.set(200); }}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
            {label && (
              <span className="text-[9px] tracking-[0.2em] uppercase font-mono text-[#D6AC54]/80">
                {label}
              </span>
            )}
            <p className="text-white/90 text-sm font-medium leading-tight mt-0.5">
              {title}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export function PhotoGallery({
  items,
  animationDelay = 0.3,
}: {
  items: GalleryItem[];
  animationDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const t2 = setTimeout(() => setIsLoaded(true), (animationDelay + 0.35) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, animationDelay]);

  const cardW = 200;
  const gap = 30;
  const positions = items.map((_, i) => {
    const total = items.length;
    const centerIdx = (total - 1) / 2;
    const offsetX = (i - centerIdx) * (cardW + gap);
    const offsetY = 12 * Math.sin(i * 0.9 + 0.5);
    return {
      x: `${offsetX}px`,
      y: `${offsetY}px`,
      zIndex: total - Math.abs(i - Math.floor(centerIdx)),
      direction: (i % 2 === 0 ? "left" : "right") as Direction,
    };
  });

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 0.85, opacity: 0 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 65,
        damping: 13,
        mass: 1,
        delay: custom.order * 0.12,
      },
    }),
  };

  return (
    <div ref={ref} className="relative py-6">
      <div className="absolute inset-0 top-[120px] -z-10 h-[280px] w-full bg-transparent bg-[linear-gradient(to_right,rgba(214,172,84,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,172,84,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative h-[300px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative" style={{ width: cardW, height: cardW }}>
              {[...items].reverse().map((item, ri) => {
                const i = items.length - 1 - ri;
                const pos = positions[i];
                return (
                  <motion.div
                    key={item.id}
                    className="absolute left-0 top-0"
                    style={{ zIndex: pos.zIndex }}
                    variants={photoVariants}
                    custom={{ x: pos.x, y: pos.y, order: i }}
                  >
                    <Photo
                      width={cardW}
                      height={cardW}
                      src={item.src}
                      alt={item.title}
                      title={item.title}
                      label={item.label}
                      direction={pos.direction}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex w-full justify-center mt-4">
        <button className="group relative px-8 py-3 overflow-hidden rounded-full border border-[#D6AC54]/30 hover:border-[#F4E5A7]/50 transition-all duration-500">
          <span className="relative text-[#F4E5A7] text-sm tracking-[0.15em] uppercase font-light group-hover:tracking-[0.25em] transition-all duration-500">
            View All Stories
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#D6AC54]/0 via-[#D6AC54]/10 to-[#D6AC54]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
    </div>
  );
}