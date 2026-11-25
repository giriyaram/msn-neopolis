"use client";

import { cn } from "@/lib/cn";
import { contrastRatio, wcagRating } from "@/lib/contrast";
import { utilityRole } from "@/lib/palettes";
import { usePalette } from "@/lib/palette-store";
import { Text, Title } from "@/components/ui/Typography";

type SwatchProps = {
  name: string;
  utility: string;
  role: string;
  tall?: boolean;
};

function ContrastChip({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const ratio = contrastRatio(fg, bg);
  const rating = wcagRating(ratio);
  return (
    <span className="flex items-center justify-between gap-3 text-caption">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">
        {ratio.toFixed(1)}:1{" "}
        <span className={cn("ml-1", rating === "Decorative" ? "text-muted" : "text-fg")}>{rating}</span>
      </span>
    </span>
  );
}

/** Colour swatch that follows the active preview palette. */
export function Swatch({ name, utility, role, tall = false }: SwatchProps) {
  const palette = usePalette();
  const key = utilityRole[utility];
  const hex = palette.colors[key];
  const displayName = palette.names[key] ?? name;

  return (
    <li data-reveal className="flex flex-col">
      <div
        className={cn("border border-rule", tall ? "aspect-tall" : "aspect-landscape")}
        style={{ backgroundColor: hex }}
      />
      <Title className="mt-5">{displayName}</Title>
      <p className="mt-1 font-mono text-caption text-muted">
        {hex} · <span className="text-fg">{utility}</span>
      </p>
      <Text className="mt-3 text-small">{role}</Text>
      <div className="mt-4 space-y-1.5 border-t border-rule pt-3">
        <ContrastChip fg={hex} bg={palette.colors.canvas} label="On canvas" />
        <ContrastChip fg={hex} bg={palette.colors.deep} label="On deep" />
      </div>
    </li>
  );
}
