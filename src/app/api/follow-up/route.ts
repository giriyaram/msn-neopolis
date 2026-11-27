import { project } from "@/content/project";
import { countries, normalisePhone } from "@/lib/lead";
import { followUpTypes, istDate, validateSiteVisit, visitTimes, type FollowUpType } from "@/lib/follow-up";
import { deliverFollowUp, flatFields, LeadDeliveryError, type FollowUpRecord } from "@/lib/server/crm";
import { cleanTouch, clientIp, createRateLimiter, json, str } from "@/lib/server/http";
import { readLeadSession } from "@/lib/server/lead-session";

/*
 * POST /api/follow-up — requests made from /thank-you, delivered to the same
 * CRM webhook as enquiries, linked by lead_id:
 *
 *  site_visit         Form: preferred date + time, name, mobile, optional email.
 *                     Works even if the session has expired (lead_id is null).
 *  payment_details    One tap. Requires the post-enquiry session; contact
 *  offer_eligibility  details come from the session, never from the client.
 *
 * Responds { ok: true } only after the CRM accepts the record. Idempotent:
 * site visits on requestId, one-tap requests once per lead and type.
 */

const MAX_BODY = 8_000;
const MIN_FILL_MS = 2_000;
const IDEMPOTENCY_TTL_MS = 12 * 60 * 60_000;

const rateLimited = createRateLimiter(10 * 60_000, 8);
const completed = new Map<string, number>();
const inflight = new Map<string, Promise<void>>();

const eventType: Record<FollowUpType, FollowUpRecord["event_type"]> = {
  site_visit: "site_visit_request",
  payment_details: "payment_details_request",
  offer_eligibility: "offer_eligibility_request",
};

const genericError = "We couldn't send your request just now. Please try again in a moment.";

export async function POST(request: Request) {
  const now = Date.now();
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

  const type = str(body.type, 30) as FollowUpType;
  const requestId = str(body.requestId, 64);
  if (!followUpTypes.includes(type) || !/^[A-Za-z0-9-]{8,64}$/.test(requestId)) {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const session = await readLeadSession();
  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
  const first = cleanTouch(attribution.first);
  const last = cleanTouch(attribution.last);

  let name: string;
  let phoneE164: string;
  let email = "";
  let siteVisit: FollowUpRecord["site_visit"] = null;
  let idempotencyKey: string;

  if (type === "site_visit") {
    const elapsed = Number(body.elapsedMs);
    if (str(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
      return json({ ok: false, error: "We couldn't send your request. Please review your details and try again." }, 400);
    }
    const input = {
      date: str(body.date, 10),
      time: str(body.time, 20),
      name: str(body.name, 100).trim(),
      country: str(body.country, 4),
      phone: str(body.phone, 30),
      email: str(body.email, 254).trim(),
    };
    const fieldErrors = validateSiteVisit(input, istDate(now), 1);
    if (Object.keys(fieldErrors).length > 0) {
      return json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, 422);
    }
    const dial = countries.find((c) => c.iso === input.country)!.dial;
    name = input.name;
    phoneE164 = `+${dial}${normalisePhone(input.phone)}`;
    email = input.email;
    siteVisit = {
      preferred_date: input.date,
      preferred_time: visitTimes.find((t) => t.value === input.time)!.label,
    };
    idempotencyKey = `visit:${requestId}`;
  } else {
    if (!session) {
      return json({ ok: false, error: "session_expired" }, 401);
    }
    name = session.name;
    phoneE164 = session.phone;
    idempotencyKey = `${type}:${session.leadId}`;
  }

  for (const [key, at] of completed) {
    if (now - at > IDEMPOTENCY_TTL_MS) completed.delete(key);
  }
  if (completed.has(idempotencyKey)) return json({ ok: true, duplicate: true });
  const pending = inflight.get(idempotencyKey);
  if (pending) {
    try {
      await pending;
      return json({ ok: true, duplicate: true });
    } catch {
      return json({ ok: false, error: genericError }, 502);
    }
  }

  const record: FollowUpRecord = {
    event_type: eventType[type],
    ...flatFields({
      name,
      phoneE164,
      source: `${project.name} website — thank-you page`,
      configuration: session?.configuration ?? null,
      size: session?.size ?? null,
      tower: session?.tower ?? null,
      first,
      last,
    }),
    lead_id: session?.leadId ?? null,
    request_id: requestId,
    submitted_at: new Date(now).toISOString(),
    project: project.name,
    email,
    site_visit: siteVisit,
    attribution: { first, last },
    page_url: str(body.pageUrl, 1000),
    user_agent: str(request.headers.get("user-agent"), 400),
  };

  const delivery = deliverFollowUp(record);
  inflight.set(idempotencyKey, delivery);
  try {
    await delivery;
    completed.set(idempotencyKey, now);
    return json({ ok: true });
  } catch (error) {
    const code = error instanceof LeadDeliveryError ? error.code : "upstream_failed";
    console.error(`[follow-up] ${type} delivery failed (${code}):`, (error as Error).message);
    return json({ ok: false, error: genericError }, code === "not_configured" ? 503 : 502);
  } finally {
    inflight.delete(idempotencyKey);
  }
}
