import React from "react";

type AsTag = "section" | "div" | "article";
type Variant = "default" | "compact" | "flush";

export interface GlassCardProps {
  id?: string;
  className?: string;
  as?: AsTag;
  variant?: Variant;
  kicker?: string;
  title?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

function cn(...v: Array<string | undefined | false>) {
  return v.filter(Boolean).join(" ");
}

const padByVariant: Record<Variant, string> = {
  default: "p-6 md:p-8",
  compact: "p-4 md:p-5",
  flush: "p-0",
};

const GlassCard = React.forwardRef<HTMLElement, GlassCardProps>(
  ({ id, as = "section", className, variant = "default", kicker, title, rightSlot, children }, ref) => {
    const Comp = as;
    const hasHeader = Boolean(kicker || title || rightSlot);

    return (
      <Comp
        id={id}
        ref={ref as any}
        className={cn(
          "relative overflow-hidden",
          "rounded-[24px] md:rounded-[32px]",
          "border border-white/10",
          "bg-white/[0.03] backdrop-blur-md",
          "shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
          "transition-transform duration-300",
          padByVariant[variant],
          className
        )}
      >
        {/* Subtle inner glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_30%_20%,rgba(255,255,255,0.04),transparent_50%)]" />

        {hasHeader && (
          <div className="relative z-10 mb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {kicker && (
                  <div className="text-[11px] tracking-[0.2em] uppercase font-mono text-white/50">
                    {kicker}
                  </div>
                )}
                {title && (
                  <h2 className="mt-1 font-semibold text-2xl md:text-3xl tracking-[-0.02em] text-white/90">
                    {title}
                  </h2>
                )}
              </div>
              {rightSlot && <div className="shrink-0">{rightSlot}</div>}
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#D6AC54]/25 to-transparent" />
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </Comp>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
