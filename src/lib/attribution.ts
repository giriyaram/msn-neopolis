/**
 * Click and campaign attribution.
 *
 * Captures Google Ads click IDs and UTM parameters on arrival and keeps
 * them in localStorage so they survive navigation and return visits.
 *   first — first qualifying visit (kept for 90 days, the GCLID lifetime)
 *   last  — most recent visit that carried campaign data
 * Both are sent with every enquiry for offline conversion imports.
 */

export const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type Key = (typeof ATTRIBUTION_KEYS)[number];

export type Touch = Partial<Record<Key, string>> & {
  landing_page: string;
  referrer: string;
  captured_at: string;
};

export type Attribution = { first: Touch | null; last: Touch | null };

const STORAGE_KEY = "msn_attribution";
const FIRST_TOUCH_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function read(): Attribution {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // Unavailable or corrupt — start fresh.
  }
  return { first: null, last: null };
}

function clean(value: string | null) {
  // Bound length and strip control characters; values go to the CRM only.
  return value ? value.replace(/[\u0000-\u001f]/g, "").slice(0, 300) : undefined;
}

/** Call once on page load. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const params: Partial<Record<Key, string>> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = clean(url.searchParams.get(key));
    if (value) params[key] = value;
  }

  const referrer = document.referrer;
  const externalReferrer = referrer && !referrer.startsWith(window.location.origin);
  const hasCampaignData = Object.keys(params).length > 0;

  const touch: Touch = {
    ...params,
    landing_page: url.href.slice(0, 1000),
    referrer: externalReferrer ? referrer.slice(0, 500) : "",
    captured_at: new Date().toISOString(),
  };

  const stored = read();
  const firstExpired =
    !stored.first || Date.now() - Date.parse(stored.first.captured_at) > FIRST_TOUCH_TTL_MS;

  const next: Attribution = {
    first: firstExpired ? touch : stored.first,
    last: hasCampaignData || externalReferrer || !stored.last ? touch : stored.last,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    memoryAttribution = next;
  }
}

let memoryAttribution: Attribution | null = null;

export function getAttribution(): Attribution {
  const stored = read();
  return stored.first || stored.last ? stored : (memoryAttribution ?? stored);
}
