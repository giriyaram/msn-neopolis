import { useSyncExternalStore } from "react";
import { defaultPaletteId, paletteVariables, palettes, type Palette } from "./palettes";

/*
 * Preview-only palette comparison. Applies an alternative palette by
 * overriding the colour tokens on <html>, so every component re-dresses
 * without code changes. Nothing persists: a reload returns to the adopted
 * palette defined in globals.css.
 */

let current = defaultPaletteId;
const listeners = new Set<() => void>();

function find(id: string) {
  return palettes.find((p) => p.id === id);
}

export function setPalette(id: string) {
  const palette = find(id);
  if (!palette || id === current) return;
  current = id;

  const root = document.documentElement;
  for (const [name, value] of Object.entries(paletteVariables(palette))) {
    if (id === defaultPaletteId) root.style.removeProperty(name);
    else root.style.setProperty(name, value);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePalette(): Palette {
  const id = useSyncExternalStore(
    subscribe,
    () => current,
    () => defaultPaletteId,
  );
  return find(id) ?? palettes[0];
}
