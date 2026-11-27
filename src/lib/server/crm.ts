import "server-only";

/**
 * CRM delivery adapter.
 *
 * Configure with environment variables (see .env.example):
 *   CRM_WEBHOOK_URL     HTTPS endpoint that accepts the lead JSON (required in production)
 *   CRM_WEBHOOK_SECRET  Sent as `Authorization: Bearer <secret>` (recommended)
 *   LEAD_DELIVERY_MODE  "log" prints leads to the server console instead of
 *                       delivering them. Development only — ignored in production.
 *
 * Delivery must succeed for the visitor to see a confirmation; failures are
 * surfaced honestly so no lead is silently lost.
 */

/**
 * Every record posted to the webhook carries `event_type`, so one endpoint
 * (e.g. a HighLevel inbound webhook) can branch on it:
 *   enquiry                   — the landing-page form (a new lead)
 *   site_visit_request        — from /thank-you, linked by lead_id
 *   payment_details_request   — from /thank-you, linked by lead_id
 *   offer_eligibility_request — from /thank-you, linked by lead_id
 * Only `enquiry` is a new lead; the others are follow-ups on an existing one.
 */
export type CrmEventType =
  | "enquiry"
  | "site_visit_request"
  | "payment_details_request"
  | "offer_eligibility_request";

export type LeadRecord = {
  event_type: "enquiry";
  lead_id: string;
  submission_id: string;
  submitted_at: string;
  project: string;
  intent: string;
  /** Optional — what the visitor had selected on the page, if anything. */
  preferences: {
    configuration: string | null;
    size_sft: number | null;
    tower: string | null;
  };
  contact: {
    name: string;
    phone_e164: string;
    phone_country: string;
  };
  attribution: unknown;
  page_url: string;
  user_agent: string;
  consent_text: string;
} & FlatLeadFields;

/**
 * Top-level copies of the key fields, so CRMs that map flat keys (e.g. a
 * HighLevel inbound webhook → Create Contact) need no nested paths.
 * Campaign fields come from the last touch, falling back to the first.
 */
export type FlatLeadFields = {
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  source: string;
  configuration: string;
  size_sft: string;
  tower: string;
  gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

export class LeadDeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "upstream_failed",
  ) {
    super(message);
  }
}

type Touch = Record<string, string> | null;

export function flatFields(v: {
  name: string;
  phoneE164: string;
  source: string;
  configuration: string | null;
  size: number | null;
  tower: string | null;
  first: Touch;
  last: Touch;
}): FlatLeadFields {
  const [firstName = "", ...rest] = v.name.trim().split(/\s+/);
  const touch = (key: string) => v.last?.[key] || v.first?.[key] || "";
  return {
    full_name: v.name.trim(),
    first_name: firstName,
    last_name: rest.join(" "),
    phone: v.phoneE164,
    source: v.source,
    configuration: v.configuration ?? "",
    size_sft: v.size != null ? String(v.size) : "",
    tower: v.tower ?? "",
    gclid: touch("gclid"),
    utm_source: touch("utm_source"),
    utm_medium: touch("utm_medium"),
    utm_campaign: touch("utm_campaign"),
    utm_term: touch("utm_term"),
    utm_content: touch("utm_content"),
  };
}

/** A follow-up request made from the thank-you page. */
export type FollowUpRecord = {
  event_type: Exclude<CrmEventType, "enquiry">;
  /** The original enquiry this follows up on; null if the session expired. */
  lead_id: string | null;
  request_id: string;
  submitted_at: string;
  project: string;
  email: string;
  site_visit: { preferred_date: string; preferred_time: string } | null;
  attribution: unknown;
  page_url: string;
  user_agent: string;
} & FlatLeadFields;

export function deliverLead(lead: LeadRecord): Promise<void> {
  return deliverToCrm(lead);
}

export function deliverFollowUp(record: FollowUpRecord): Promise<void> {
  return deliverToCrm(record);
}

async function deliverToCrm(record: LeadRecord | FollowUpRecord): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;

  if (!url) {
    if (process.env.NODE_ENV !== "production" && process.env.LEAD_DELIVERY_MODE === "log") {
      console.info(
        `[lead] LEAD_DELIVERY_MODE=log — ${record.event_type} not delivered to a CRM:\n`,
        JSON.stringify(record, null, 2),
      );
      return;
    }
    throw new LeadDeliveryError("CRM_WEBHOOK_URL is not configured.", "not_configured");
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) {
    headers.authorization = `Bearer ${process.env.CRM_WEBHOOK_SECRET}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new LeadDeliveryError(`CRM request failed: ${(error as Error).message}`, "upstream_failed");
  }

  if (!response.ok) {
    throw new LeadDeliveryError(`CRM responded with ${response.status}.`, "upstream_failed");
  }
}
