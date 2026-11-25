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

export type LeadRecord = {
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
};

export class LeadDeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "upstream_failed",
  ) {
    super(message);
  }
}

export async function deliverLead(lead: LeadRecord): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;

  if (!url) {
    if (process.env.NODE_ENV !== "production" && process.env.LEAD_DELIVERY_MODE === "log") {
      console.info("[lead] LEAD_DELIVERY_MODE=log — lead not delivered to a CRM:\n", JSON.stringify(lead, null, 2));
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
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new LeadDeliveryError(`CRM request failed: ${(error as Error).message}`, "upstream_failed");
  }

  if (!response.ok) {
    throw new LeadDeliveryError(`CRM responded with ${response.status}.`, "upstream_failed");
  }
}
