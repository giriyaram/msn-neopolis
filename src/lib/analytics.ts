/**
 * Analytics events for GTM / GA4.
 *
 * Events are pushed to `window.dataLayer` (GTM). When only a GA4
 * measurement ID is configured, they are sent with `gtag` instead.
 *
 * Conversion rules:
 *  - generate_lead fires ONLY after the enquiry API confirms delivery,
 *    once per lead_id (deduplicated across reloads in this session).
 *  - qualified_lead, schedule_site_visit and booking happen in the CRM and
 *    are imported to Google Ads as offline conversions (keyed on GCLID /
 *    GBRAID / WBRAID captured with the lead). They are typed here so CRM
 *    tooling and any future thank-you flows use the same names.
 */

export type AnalyticsEvent =
  | "page_view"
  | "view_item"
  | "select_configuration"
  | "view_floor_plan"
  | "lead_popup_open"
  | "click_call"
  | "click_whatsapp"
  | "generate_lead"
  // Thank-you page. Secondary engagement — never new leads.
  | "thank_you_view"
  | "whatsapp_contact_click"
  | "site_visit_request"
  | "payment_details_request"
  | "consultation_request"
  | "floor_plan_view"
  | "pricing_view"
  | "specifications_view"
  | "qualified_lead"
  | "schedule_site_visit"
  | "booking";

type Params = Record<string, string | number | boolean | null | undefined | object>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;

  if (GTM_ID) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...params });
  } else if (window.gtag) {
    window.gtag("event", event, params);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[analytics] ${event}`, params);
  }
}

/** Fire an event at most once per browser session for a given key. */
export function trackOnce(key: string, event: AnalyticsEvent, params: Params = {}) {
  const storageKey = `msn_evt_${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return false;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // Storage blocked — fall back to an in-memory guard.
    if (memory.has(storageKey)) return false;
    memory.add(storageKey);
  }
  track(event, params);
  return true;
}

const memory = new Set<string>();
