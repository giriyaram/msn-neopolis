import { cookies } from "next/headers";
import { contactCopy, project } from "@/content/project";
import { cleanContext, countries, normalisePhone, validateLead, type LeadInput } from "@/lib/lead";
import { deliverLead, flatFields, LeadDeliveryError, type LeadRecord } from "@/lib/server/crm";
import { cleanTouch, clientIp, createRateLimiter, json, str } from "@/lib/server/http";
import {
  LEAD_SESSION_COOKIE,
  SESSION_TTL_S,
  sealSession,
  sessionCookieOptions,
  type LeadSession,
} from "@/lib/server/lead-session";

/*
 * POST /api/enquiry — validates, filters spam, deduplicates and delivers a
 * lead to the CRM. Responds { ok: true, leadId } only after delivery succeeds.
 *
 * On success it also sets the encrypted post-enquiry session cookie and adds
 * `next: "/thank-you"`; the form navigates there only when `next` is present
 * (if sessions are unavailable it keeps its inline confirmation instead).
 *
 * Spam & abuse controls (best effort, per server instance):
 *  - honeypot field, minimum completion time
 *  - per-IP rate limit
 *  - idempotent on submissionId (repeat submits return the same leadId)
 * For multi-instance hosting, move the rate limit and idempotency maps to a
 * shared store (e.g. Redis) and also deduplicate on submission_id in the CRM.
 */

const MAX_BODY = 16_000;
const MIN_FILL_MS = 3_000;
const IDEMPOTENCY_TTL_MS = 30 * 60_000;

const rateLimited = createRateLimiter(10 * 60_000, 6);
const completed = new Map<string, { leadId: string; session: LeadSession; at: number }>();
const inflight = new Map<string, Promise<{ leadId: string; session: LeadSession }>>();

/** Set the session cookie and build the success response. */
async function success(leadId: string, session: LeadSession, duplicate = false) {
  const sealed = sealSession(session);
  if (sealed) (await cookies()).set(LEAD_SESSION_COOKIE, sealed, sessionCookieOptions);
  return json({ ok: true, leadId, ...(duplicate ? { duplicate } : {}), ...(sealed ? { next: "/thank-you" } : {}) });
}

export async function POST(request: Request) {
  const now = Date.now();

  // Rate limit first, so junk and spam requests are throttled too.
  if (rateLimited(clientIp(request), now)) {
    return json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: "Request too large." }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot and timing traps. Bots receive a generic error.
  const elapsed = Number(body.elapsedMs);
  if (str(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json({ ok: false, error: "We couldn't submit your enquiry. Please review your details and try again." }, 400);
  }

  const submissionId = str(body.submissionId, 64);
  if (!/^[A-Za-z0-9-]{8,64}$/.test(submissionId)) {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const input: LeadInput = {
    name: str(body.name, 100).trim(),
    country: str(body.country, 4),
    phone: str(body.phone, 30),
    intent: str(body.intent, 20) || "general",
    configuration: str(body.configuration, 20),
    size: str(body.size, 20),
    tower: str(body.tower, 10),
  };

  const fieldErrors = validateLead(input);
  if (Object.keys(fieldErrors).length > 0) {
    return json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, 422);
  }

  // Idempotency: repeat submissions return the original lead.
  for (const [key, entry] of completed) {
    if (now - entry.at > IDEMPOTENCY_TTL_MS) completed.delete(key);
  }
  const done = completed.get(submissionId);
  if (done) return success(done.leadId, done.session, true);
  const pending = inflight.get(submissionId);
  if (pending) {
    try {
      const result = await pending;
      return success(result.leadId, result.session, true);
    } catch {
      return json({ ok: false, error: "We couldn't submit your enquiry. Please try again." }, 502);
    }
  }

  const dial = countries.find((c) => c.iso === input.country)!.dial;
  const context = cleanContext(input);
  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
  const leadId = crypto.randomUUID();
  const first = cleanTouch(attribution.first);
  const last = cleanTouch(attribution.last);
  const phoneNational = normalisePhone(input.phone);
  const phoneE164 = `+${dial}${phoneNational}`;

  const lead: LeadRecord = {
    event_type: "enquiry",
    ...flatFields({
      name: input.name,
      phoneE164,
      source: `${project.name} website`,
      configuration: context.configuration,
      size: context.size,
      tower: context.tower,
      first,
      last,
    }),
    lead_id: leadId,
    submission_id: submissionId,
    submitted_at: new Date(now).toISOString(),
    project: project.name,
    intent: input.intent,
    preferences: {
      configuration: context.configuration,
      size_sft: context.size,
      tower: context.tower,
    },
    contact: {
      name: input.name,
      phone_e164: phoneE164,
      phone_country: input.country,
    },
    attribution: { first, last },
    page_url: str(body.pageUrl, 1000),
    user_agent: str(request.headers.get("user-agent"), 400),
    consent_text: contactCopy.consent,
  };

  const session: LeadSession = {
    v: 1,
    leadId,
    name: input.name,
    phone: phoneE164,
    phoneCountry: input.country,
    phoneNational,
    intent: input.intent,
    configuration: context.configuration,
    size: context.size,
    tower: context.tower,
    createdAt: now,
    expiresAt: now + SESSION_TTL_S * 1000,
  };

  const delivery = deliverLead(lead).then(() => ({ leadId, session }));
  inflight.set(submissionId, delivery);

  try {
    await delivery;
    completed.set(submissionId, { leadId, session, at: now });
    return success(leadId, session);
  } catch (error) {
    const code = error instanceof LeadDeliveryError ? error.code : "upstream_failed";
    console.error(`[lead] delivery failed (${code}):`, (error as Error).message);
    return json(
      { ok: false, error: "We couldn't submit your enquiry just now. Please try again in a moment." },
      code === "not_configured" ? 503 : 502,
    );
  } finally {
    inflight.delete(submissionId);
  }
}
