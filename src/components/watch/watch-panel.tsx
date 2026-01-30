import React from "react";

type AsTag = "section" | "div" | "article";

type Variant = "default" | "compact" | "flush";

export interface WatchPanelProps {
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
  default: "p-5 md:p-7",
  compact: "p-4 md:p-5",
  flush: "p-0",
};

const headerByVariant: Record<Variant, string> = {
  default: "px-0 pt-0",
  compact: "px-0 pt-0",
  flush: "px-5 md:px-7 pt-5 md:pt-7",
};

const bodyByVariant: Record<Variant, string> = {
  default: "mt-4",
  compact: "mt-3",
  flush: "mt-0",
};

const WatchPanel = React.forwardRef<HTMLElement, WatchPanelProps>(
  (
    {
      id,
      as = "section",
      className,
      variant = "default",
      kicker,
      title,
      rightSlot,
      children,
    },
    ref
  ) => {
    const Comp = as;

    const hasHeader = Boolean(kicker || title || rightSlot);

    return (
      <Comp
        id={id}
        ref={ref as any}
        className={cn(
          variant === "compact" && "dock-panel-inner",
          "dock-panel",
          "elevation-base",
          "relative overflow-hidden",
          "rounded-[22px] md:rounded-[26px]",
          padByVariant[variant],
          className
        )}
      >
        {/* Shield Shader Effect */}

        {/* Inner glass + engraving */}
        <div className="pointer-events-none absolute inset-0 dock-panel-glass" />
        <div className="pointer-events-none absolute inset-0 dock-panel-engrave" />

        {hasHeader && (
          <div className={cn(
          variant === "compact" && "dock-panel-inner","relative z-10", headerByVariant[variant])}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {kicker ? (
                  <div className="dock-kicker">{kicker}</div>
                ) : null}
                {title ? (
                  <div className="dock-title">{title}</div>
                ) : null}
              </div>

              {rightSlot ? (
                <div className="shrink-0">{rightSlot}</div>
              ) : null}
            </div>

            <div className="dock-divider mt-4" />
          </div>
        )}

        <div className={cn(
          variant === "compact" && "dock-panel-inner","relative z-10", bodyByVariant[variant])}>
          {children}
        </div>
      </Comp>
    );
  }
);

WatchPanel.displayName = "WatchPanel";

export default WatchPanel;
