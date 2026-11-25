import { useSyncExternalStore } from "react";
import { configurations, type ConfigurationId, type TowerId } from "@/content/project";
import type { Intent } from "./lead";

/**
 * Shared residence selection — keeps the residence tabs, floor-plan viewer,
 * enquiry form and mobile CTA in step. Seeded from the URL
 * (?configuration=3bhk|4bhk, ?size=2666, ?tower=a) so Google Ads traffic
 * lands on the configuration it searched for.
 */

export type Selection = {
  configuration: ConfigurationId | "both" | null;
  size: number | "undecided" | null;
  tower: TowerId | "any" | null;
  /** Why the visitor is enquiring — set by the CTA that brought them to the form. */
  intent: Intent;
};

let state: Selection = { configuration: null, size: null, tower: null, intent: "floor-plans" };
const listeners = new Set<() => void>();

function emit(next: Selection) {
  state = next;
  listeners.forEach((l) => l());
}

export function getSelection() {
  return state;
}

export function setConfiguration(configuration: Selection["configuration"]) {
  const sizes =
    configuration === "3bhk" || configuration === "4bhk" ? configurations[configuration].sizes : [];
  const keepSize = typeof state.size === "number" && sizes.includes(state.size);
  emit({ ...state, configuration, size: keepSize ? state.size : null });
}

export function setSize(size: Selection["size"]) {
  if (typeof size === "number") {
    const config = (Object.keys(configurations) as ConfigurationId[]).find((c) =>
      configurations[c].sizes.includes(size),
    );
    emit({ ...state, size, configuration: config ?? state.configuration });
  } else {
    emit({ ...state, size });
  }
}

export function setTower(tower: Selection["tower"]) {
  emit({ ...state, tower });
}

export function setIntent(intent: Intent) {
  if (intent !== state.intent) emit({ ...state, intent });
}

/** Read search intent from the URL. Call once after hydration. */
export function seedSelectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("configuration") ?? params.get("config") ?? params.get("bhk") ?? "")
    .toLowerCase()
    .replace(/[^0-9a-z]/g, "");
  const configuration: ConfigurationId | null =
    raw === "3bhk" || raw === "3" ? "3bhk" : raw === "4bhk" || raw === "4" ? "4bhk" : null;

  const sizeParam = Number(params.get("size"));
  const towerParam = (params.get("tower") ?? "").toUpperCase();
  const tower = towerParam === "A" || towerParam === "B" || towerParam === "C" ? towerParam : null;

  if (!configuration && !sizeParam && !tower) return;
  let next: Selection = { ...state, configuration: configuration ?? state.configuration, tower: tower ?? state.tower };
  const cfg = next.configuration;
  if (sizeParam && (cfg === "3bhk" || cfg === "4bhk") && configurations[cfg].sizes.includes(sizeParam)) {
    next = { ...next, size: sizeParam };
  }
  emit(next);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot: Selection = { configuration: null, size: null, tower: null, intent: "floor-plans" };

export function useSelection(): Selection {
  return useSyncExternalStore(subscribe, getSelection, () => serverSnapshot);
}

/** The configuration to display where a single one must be shown. */
export function displayConfiguration(sel: Selection): ConfigurationId {
  return sel.configuration === "4bhk" ? "4bhk" : "3bhk";
}
