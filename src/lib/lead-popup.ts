"use client";

import { useSyncExternalStore } from "react";

/**
 * Lead popup state, shared by the popup, the CTA click interceptor and the
 * lead form.
 *
 *  - `open`: whether the popup is showing.
 *  - `submitted`: a lead has been delivered from this browser. Once true the
 *    popup stops appearing on its own and buttons behave normally again.
 *    Persisted in localStorage so a returning lead isn't prompted again.
 */

type State = { open: boolean; submitted: boolean; trigger: "timer" | "button" | null };

const STORAGE_KEY = "msn_lead_submitted";

let state: State = { open: false, submitted: false, trigger: null };
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverState: State = { open: false, submitted: false, trigger: null };

export function useLeadPopup() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}

export function getLeadPopup() {
  return state;
}

/** Read the persisted flag. Call once after hydration. */
export function restoreLeadSubmitted() {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") emit({ ...state, submitted: true });
  } catch {
    // Storage unavailable (private mode, blocked) — treat as not submitted.
  }
}

export function openLeadPopup(trigger: "timer" | "button") {
  if (!state.open) emit({ ...state, open: true, trigger });
}

export function closeLeadPopup() {
  if (state.open) emit({ ...state, open: false });
}

export function markLeadSubmitted() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Non-fatal: the popup simply stops for this page view only.
  }
  if (!state.submitted) emit({ ...state, submitted: true });
}
