"use client";

import { defaultPaletteId } from "@/lib/palettes";
import { setPalette, usePalette } from "@/lib/palette-store";
import { buttonClasses } from "@/components/ui/Button";

/** Previews a palette across the page; the adopted palette offers a reset. */
export function ApplyPaletteButton({ id, name }: { id: string; name: string }) {
  const active = usePalette();
  const isActive = active.id === id;
  const isAdopted = id === defaultPaletteId;

  let label = `Preview ${name}`;
  if (isActive) label = isAdopted ? "Adopted · in use" : "Previewing — reset to Forest";

  return (
    <button
      type="button"
      aria-pressed={isActive}
      disabled={isActive && isAdopted}
      onClick={() => setPalette(isActive ? defaultPaletteId : id)}
      className={buttonClasses({
        variant: isActive ? "primary" : "secondary",
        size: "sm",
        fullWidth: true,
        className: "disabled:opacity-100",
      })}
    >
      {label}
    </button>
  );
}
