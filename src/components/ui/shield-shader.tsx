import { cn } from "@/lib/utils";

export const ShieldShader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden opacity-30", className)}>
      <div className="hex-shader-container" />
    </div>
  );
};
