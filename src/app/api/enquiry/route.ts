import { contactCopy, project } from "@/content/project";
import { ATTRIBUTION_KEYS } from "@/lib/attribution";
import { cleanContext, countries, normalisePhone, validateLead, type LeadInput } from "@/lib/lead";
import { deliverLead, LeadDeliveryError, type LeadRecord } from "@/lib/server/crm";

/*
 * POST /api/enquiry — validates, filters spam, deduplicates and delivers a
 * lead to the CRM. Responds { ok: true, leadId } only after delivery succeeds.
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
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 6;
const IDEMPOTENCY_TTL_MS = 30 * 60_000;

const rate = new Map<string, number[]>();
const completed = new Map<string, { leadId: string; at: number }>();
const inflight = new Map<string, Promise<string>>();

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

function str(value: unknown, max = 300) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function cleanTouch(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const src = value as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of [...ATTRIBUTION_KEYS, "landing_page", "referrer", "captured_at"]) {
    const v = str(src[key], 1000);
    if (v) out[key] = v;
  }
  return out;
}

function rateLimited(ip: string, now: number) {
  const hits = (rate.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rate.set(ip, hits);
  if (rate.size > 5000) rate.clear();
  return hits.length > RATE_MAX;
}

export async function POST(request: Request) {
  const now = Date.now();

  // Rate limit first, so junk and spam requests are throttled too.
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip, now)) {
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
  if (done) return json({ ok: true, leadId: done.leadId, duplicate: true });
  const pending = inflight.get(submissionId);
  if (pending) {
    try {
      return json({ ok: true, leadId: await pending, duplicate: true });
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
  const phoneE164 = `+${dial}${normalisePhone(input.phone)}`;
  const [firstName, ...rest] = input.name.split(/\s+/);
  const touch = (key: string) => last?.[key] || first?.[key] || "";

  const lead: LeadRecord = {
    full_name: input.name,
    first_name: firstName ?? "",
    last_name: rest.join(" "),
    phone: phoneE164,
    source: `${project.name} website`,
    configuration: context.configuration ?? "",
    size_sft: context.size != null ? String(context.size) : "",
    tower: context.tower ?? "",
    gclid: touch("gclid"),
    utm_source: touch("utm_source"),
    utm_medium: touch("utm_medium"),
    utm_campaign: touch("utm_campaign"),
    utm_term: touch("utm_term"),
    utm_content: touch("utm_content"),
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

  const delivery = deliverLead(lead).then(() => leadId);
  inflight.set(submissionId, delivery);

  try {
    await delivery;
    completed.set(submissionId, { leadId, at: now });
    return json({ ok: true, leadId });
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
