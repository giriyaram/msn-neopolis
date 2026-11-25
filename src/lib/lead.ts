import { configurations, type ConfigurationId } from "@/content/project";

/**
 * Enquiry schema — shared by the form (client-side validation) and the
 * API route (authoritative server-side validation).
 */

export const configurationOptions = [
  { value: "3bhk", label: "3 BHK" },
  { value: "4bhk", label: "4 BHK" },
  { value: "both", label: "Open to both" },
] as const;

export const towerOptions = [
  { value: "A", label: "Tower A" },
  { value: "B", label: "Tower B" },
  { value: "C", label: "Tower C" },
  { value: "any", label: "Open to all" },
] as const;

export const intentOptions = ["floor-plans", "pricing", "offer", "general"] as const;
export type Intent = (typeof intentOptions)[number];

/** Dial codes for India and the largest NRI markets. */
export const countries = [
  { iso: "IN", name: "India", dial: "91" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "US", name: "United States", dial: "1" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "SG", name: "Singapore", dial: "65" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "KW", name: "Kuwait", dial: "965" },
  { iso: "OM", name: "Oman", dial: "968" },
  { iso: "BH", name: "Bahrain", dial: "973" },
  { iso: "NZ", name: "New Zealand", dial: "64" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "IE", name: "Ireland", dial: "353" },
  { iso: "NL", name: "Netherlands", dial: "31" },
  { iso: "HK", name: "Hong Kong", dial: "852" },
  { iso: "MY", name: "Malaysia", dial: "60" },
  { iso: "JP", name: "Japan", dial: "81" },
  { iso: "ZA", name: "South Africa", dial: "27" },
] as const;

/**
 * The visitor types only `name` and `phone` (with a country code). The
 * residence context is optional: it is taken silently from what they already
 * chose elsewhere on the page, and is empty when they chose nothing.
 */
export type LeadInput = {
  name: string;
  country: string;
  phone: string;
  intent: string;
  configuration: string;
  size: string;
  tower: string;
};

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

const has = <T extends { value: string }>(list: readonly T[], v: string) =>
  list.some((o) => o.value === v);

export function sizesFor(configuration: string): number[] {
  if (configuration === "3bhk" || configuration === "4bhk") {
    return configurations[configuration as ConfigurationId].sizes;
  }
  return [...configurations["3bhk"].sizes, ...configurations["4bhk"].sizes];
}

export function normalisePhone(raw: string) {
  return raw.replace(/[\s()-]/g, "").replace(/^0+/, "");
}

export function validatePhone(country: string, raw: string): string | null {
  const c = countries.find((x) => x.iso === country);
  if (!c) return "Please choose a country code.";
  const digits = normalisePhone(raw);
  if (!digits) return "Enter your mobile number.";
  if (!/^\d+$/.test(digits)) return "Use digits only.";
  if (c.iso === "IN") {
    return /^[6-9]\d{9}$/.test(digits) ? null : "Enter a 10-digit Indian mobile number.";
  }
  if (digits.length < 6 || digits.length + c.dial.length > 15) {
    return "Enter a valid mobile number.";
  }
  return null;
}

/** The two fields the visitor fills in. */
export function validateContact(v: Pick<LeadInput, "name" | "country" | "phone">): FieldErrors {
  const e: FieldErrors = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > 80 || !/^[\p{L}\p{M}'. -]+$/u.test(name)) {
    e.name = "Please enter your name.";
  }
  const phoneError = validatePhone(v.country, v.phone);
  if (phoneError) e.phone = phoneError;
  return e;
}

/** Server-side check of what the visitor typed, plus the request intent. */
export function validateLead(v: LeadInput): FieldErrors {
  const e = validateContact(v);
  if (!(intentOptions as readonly string[]).includes(v.intent)) e.intent = "Invalid request.";
  return e;
}

/**
 * The optional page context, with anything unrecognised dropped. The visitor
 * never sees these values, so a bad one must not cost us the lead.
 */
export function cleanContext(v: Pick<LeadInput, "configuration" | "size" | "tower">) {
  const configuration = has(configurationOptions, v.configuration) ? v.configuration : null;
  const sizeNumber = Number(v.size);
  const size =
    v.size && v.size !== "undecided" && sizesFor(configuration ?? "").includes(sizeNumber) ? sizeNumber : null;
  const tower = has(towerOptions, v.tower) ? v.tower : null;
  return { configuration, size, tower };
}

export function labelFor(
  list: readonly { value: string; label: string }[],
  value: string,
) {
  return list.find((o) => o.value === value)?.label ?? value;
}
