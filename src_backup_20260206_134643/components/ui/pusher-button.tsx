"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type PusherButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: React.ReactNode;
  active?: boolean;
  size?: "xs" | "sm" | "md";
};

export default function PusherButton({
  className,
  active,
  size = "sm",
  children,
  ...props
}: PusherButtonProps) {
  const sz =
    size === "xs" ? "h-8 w-8" : size === "md" ? "h-10 w-10" : "h-9 w-9";

  return (
    <motion.button
      type="button"
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center",
        sz,
        "rounded-full",
        "backdrop-blur",
        "transition-all duration-150",
        active
          ? "border border-[rgba(214,172,84,0.55)] border-b-2 border-b-[rgba(150,110,30,0.6)] bg-[rgba(214,172,84,0.16)] text-[#F4E5A7]"
          : "border border-[rgba(214,172,84,0.18)] border-b-2 border-b-[rgba(3,4,10,0.9)] bg-[rgba(10,14,33,0.70)] text-[rgba(244,229,167,0.85)] hover:bg-[rgba(22,26,49,0.78)]",
        "elevation-btn",
        className,
      )}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
