import { cn } from "@/lib/cn";

const sizes = {
  md: { mark: "text-[1.75rem]", rule: "h-6", sub: "text-[0.625rem]" },
  lg: { mark: "text-[2.75rem]", rule: "h-9", sub: "text-[0.75rem]" },
} as const;

/**
 * Typeset placeholder wordmark. Swap for the official MSN logo (SVG)
 * once supplied — keep the same height so the header rhythm holds.
 */
export function Wordmark({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <span className={cn("font-serif font-medium tracking-[0.14em]", s.mark)}>MSN</span>
      <span aria-hidden className={cn("w-px bg-current opacity-30", s.rule)} />
      <span className={cn("font-medium uppercase tracking-[0.32em]", s.sub)}>Neopolis</span>
    </span>
  );
}
