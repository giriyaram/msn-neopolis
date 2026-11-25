import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/**
 * True once the page has scrolled past `threshold` pixels (or a fraction of
 * the viewport height when 0 < threshold < 1). Re-renders only on change.
 * Always false during server rendering.
 */
export function useScrolledPast(threshold: number, enabled = true) {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (!enabled) return false;
      const px = threshold < 1 ? window.innerHeight * threshold : threshold;
      return window.scrollY > px;
    },
    () => false,
  );
}
