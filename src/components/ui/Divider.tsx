import { cn } from "@/lib/cn";

type DividerProps = {
  /**
   * hairline — full-width 1px rule in the surface's border colour.
   * label    — hairline interrupted by a small uppercase label.
   * accent   — short accent (brass) rule; marks the start of a composition.
   */
  variant?: "hairline" | "label" | "accent";
  label?: string;
  className?: string;
};

export function Divider({ variant = "hairline", label, className }: DividerProps) {
  if (variant === "accent") {
    return <hr className={cn("h-px w-12 border-0 bg-accent", className)} />;
  }

  if (variant === "label" && label) {
    return (
      <div role="separator" className={cn("flex items-center gap-6", className)}>
        <span className="font-medium uppercase text-eyebrow text-muted">{label}</span>
        <span aria-hidden className="h-px flex-1 bg-rule" />
      </div>
    );
  }

  return <hr className={cn("h-px w-full border-0 bg-rule", className)} />;
}
