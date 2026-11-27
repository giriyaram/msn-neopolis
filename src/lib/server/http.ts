import "server-only";

import { ATTRIBUTION_KEYS } from "@/lib/attribution";

/** Shared helpers for the lead API routes. */

export function json(body: unknown, status = 200, init: { headers?: HeadersInit } = {}) {
  const headers = new Headers(init.headers);
  headers.set("cache-control", "no-store");
  return Response.json(body, { status, headers });
}

export function str(value: unknown, max = 300) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/** Keep only known attribution keys, as short strings. */
export function cleanTouch(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object") return null;
  const src = value as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of [...ATTRIBUTION_KEYS, "landing_page", "referrer", "captured_at"]) {
    const v = str(src[key], 1000);
    if (v) out[key] = v;
  }
  return out;
}

export function clientIp(request: Request) {
  return (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

/** Per-instance sliding-window rate limiter. */
export function createRateLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return function limited(key: string, now: number) {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}
