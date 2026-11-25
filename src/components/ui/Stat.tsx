import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatItem = {
  value: string;
  unit?: string;
  label: string;
  detail?: ReactNode;
};

/** A single figure: large serif value, small unit, uppercase label. */
export function Stat({ value, unit, label, detail }: StatItem) {
  return (
    <div className="flex flex-col border-t border-rule pt-6">
      {/* dt first in the DOM for screen readers; value first visually. */}
      <dt className="order-2 mt-4 font-medium uppercase text-eyebrow text-muted">{label}</dt>
      <dd className="order-1 font-serif font-light text-heading tabular-nums text-fg">
        {value}
        {unit && <span className="ml-2 text-title italic text-muted">{unit}</span>}
      </dd>
      {detail && (
        <dd className="order-3 mt-2 max-w-[28ch] text-small text-muted">{detail}</dd>
      )}
    </div>
  );
}

/** Responsive statistics row — 2 columns on mobile, up to 4 on desktop. */
export function StatGrid({
  items,
  columns = 4,
  className,
}: {
  items: StatItem[];
  /** Columns on desktop. */
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-(--grid-gap) gap-y-12",
        columns === 2 ? "" : columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <Stat key={item.label} {...item} />
      ))}
    </dl>
  );
}
