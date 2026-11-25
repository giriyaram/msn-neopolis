"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Development aid: overlays the 4 / 8 / 12-column grid on the whole page.
 * Toggle with the button or Shift + G.
 */
export function GridOverlay({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.shiftKey && e.key.toLowerCase() === "g") setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className={buttonClasses({ variant: "secondary", size: "sm", className })}
      >
        {visible ? "Hide grid overlay" : "Show grid overlay"}
      </button>
      {visible && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
          <div className="container-content grid-12 h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-full border-x border-accent/40 bg-accent/10",
                  i >= 4 && "hidden md:block",
                  i >= 8 && "md:hidden lg:block",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
