import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Post-enquiry session.
 *
 * After the CRM confirms delivery, /api/enquiry sets an encrypted, httpOnly
 * cookie holding the lead context the thank-you page needs. Nothing about the
 * lead travels in the URL or in client storage, and the cookie cannot be
 * read, forged or altered in the browser (AES-256-GCM, authenticated).
 *
 * The cookie only exists after a successful delivery, so /thank-you can
 * never show a confirmation for a failed submission. It expires after
 * SESSION_TTL_S; the page then sends the visitor back to the landing page.
 *
 * Configure LEAD_SESSION_SECRET (32+ random characters) in production.
 * Without it, development uses a per-process key; production skips the
 * session and the form keeps its inline confirmation instead.
 */

export const LEAD_SESSION_COOKIE = "msn_lead";
export const SESSION_TTL_S = 12 * 60 * 60;

export type LeadSession = {
  v: 1;
  leadId: string;
  name: string;
  /** E.164, e.g. +919000000000 */
  phone: string;
  phoneCountry: string;
  /** National number, for prefilling forms. */
  phoneNational: string;
  intent: string;
  configuration: string | null;
  size: number | null;
  tower: string | null;
  /** Epoch ms. */
  createdAt: number;
  expiresAt: number;
};

let devKey: Buffer | null = null;

function key(): Buffer | null {
  const secret = process.env.LEAD_SESSION_SECRET;
  if (secret && secret.length >= 32) return createHash("sha256").update(secret).digest();
  if (process.env.NODE_ENV === "production") return null;
  devKey ??= randomBytes(32);
  return devKey;
}

/** False in production when LEAD_SESSION_SECRET is missing or too short. */
export function sessionsEnabled() {
  return key() !== null;
}

export function sealSession(session: LeadSession): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function openSession(token: string | undefined, now: number): LeadSession | null {
  const k = key();
  if (!k || !token || token.length > 4000) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", k, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const session = JSON.parse(json) as LeadSession;
    if (session.v !== 1 || typeof session.leadId !== "string" || session.expiresAt <= now) return null;
    return session;
  } catch {
    // Tampered, truncated, or sealed with a different key.
    return null;
  }
}

/** The current request's post-enquiry session, or null. Request-time only. */
export async function readLeadSession(): Promise<LeadSession | null> {
  const token = (await cookies()).get(LEAD_SESSION_COOKIE)?.value;
  // Cookies alone are allowed in a runtime prefetch (partialPrefetching), but
  // the clock is not: defer to the real request before checking expiry.
  await connection();
  return openSession(token, Date.now());
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_S,
};
