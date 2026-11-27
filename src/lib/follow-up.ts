import { validateContact } from "./lead";

/**
 * Follow-up requests from the thank-you page — shared by the forms (client
 * validation) and /api/follow-up (authoritative validation).
 */

export const followUpTypes = ["site_visit", "payment_details", "offer_eligibility"] as const;
export type FollowUpType = (typeof followUpTypes)[number];

/**
 * Preferred part of the day. These are preferences, not booked slots: the
 * MSN team confirms an actual time. Do not add specific times here unless
 * MSN supplies its visiting hours.
 */
export const visitTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

/** How far ahead a visit can be requested. */
export const VISIT_WINDOW_DAYS = 90;

export type SiteVisitInput = {
  date: string;
  time: string;
  name: string;
  country: string;
  phone: string;
  email: string;
};

export type SiteVisitErrors = Partial<Record<keyof SiteVisitInput, string>>;

/** YYYY-MM-DD for a date in India Standard Time. */
export function istDate(at: number) {
  return new Date(at + 5.5 * 3600_000).toISOString().slice(0, 10);
}

export function addDays(isoDay: string, days: number) {
  const d = new Date(`${isoDay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * `today` is the earliest allowed date (YYYY-MM-DD, IST). The server allows
 * one extra day either side for visitors in other time zones.
 */
export function validateSiteVisit(v: SiteVisitInput, today: string, slackDays = 0): SiteVisitErrors {
  const e: SiteVisitErrors = validateContact(v);
  const min = addDays(today, -slackDays);
  const max = addDays(today, VISIT_WINDOW_DAYS + slackDays);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date) || Number.isNaN(Date.parse(v.date))) {
    e.date = "Choose a preferred date.";
  } else if (v.date < min || v.date > max) {
    e.date = `Choose a date within the next ${VISIT_WINDOW_DAYS} days.`;
  }
  if (!visitTimes.some((t) => t.value === v.time)) e.time = "Choose a preferred time.";
  const email = v.email.trim();
  if (email && (email.length > 254 || !EMAIL.test(email))) e.email = "Enter a valid email address, or leave it blank.";
  return e;
}
