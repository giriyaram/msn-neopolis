/**
 * MSN Neopolis — official project information.
 *
 * Single source of truth for every fact shown on the landing page.
 * Only add information supplied by MSN. Never estimate or invent values.
 */

export type ConfigurationId = "3bhk" | "4bhk";
export type TowerId = "A" | "B" | "C";

export const project = {
  brand: "MSN",
  name: "MSN Neopolis",
  locality: "Neopolis, Kokapet",
  city: "Hyderabad",
  region: "Telangana",
  country: "IN",
  areaAcres: 7,
  towers: 3,
  floors: 56,
  skyPavilions: 8,
  clubhouseSft: "2,30,000",
  sizeRange: { min: 2424, max: 4545 },
  /** Set once issued — the footer renders these only when present. */
  rera: null as null | { number: string; url?: string },
} as const;

/**
 * Sales contact for Call and WhatsApp buttons. Override with
 * NEXT_PUBLIC_SALES_PHONE (E.164, e.g. +919032458800) if the number changes.
 */
const salesPhone = (process.env.NEXT_PUBLIC_SALES_PHONE || "+919032458800").replace(/[^+\d]/g, "");

export const contact = {
  /** E.164, for tel: links and structured data. */
  phone: salesPhone,
  /** Human-readable, e.g. "+91 90324 58800". */
  phoneDisplay: salesPhone.startsWith("+91") && salesPhone.length === 13
    ? `+91 ${salesPhone.slice(3, 8)} ${salesPhone.slice(8)}`
    : salesPhone,
  telHref: `tel:${salesPhone}`,
  whatsappHref: `https://wa.me/${salesPhone.replace("+", "")}?text=${encodeURIComponent(
    "Hi, I'm interested in MSN Neopolis, Kokapet. Please share the floor plans and cost sheet.",
  )}`,
} as const;

export const configurations: Record<
  ConfigurationId,
  { id: ConfigurationId; label: string; name: string; sizes: number[] }
> = {
  "3bhk": {
    id: "3bhk",
    label: "3 BHK",
    name: "Three-bedroom residences",
    sizes: [2424, 2666, 2828],
  },
  "4bhk": {
    id: "4bhk",
    label: "4 BHK",
    name: "Four-bedroom residences",
    sizes: [3111, 3150, 3175, 3200, 3600, 3888, 4141, 4300, 4401, 4500, 4545],
  },
};

/**
 * Tower groups (floor-to-floor heights). Base rates are deliberately not
 * stored in the site: per-SFT rates and per-unit prices are shared only by
 * the MSN team in the official cost sheet.
 */
export const towerGroups = [
  { id: "A", label: "Tower A", towers: ["A"] as TowerId[], floorToFloorFt: 11.4 },
  { id: "BC", label: "Towers B & C", towers: ["B", "C"] as TowerId[], floorToFloorFt: 10.5 },
] as const;

export type TowerGroup = (typeof towerGroups)[number];

export function groupForTower(tower: TowerId): TowerGroup {
  return tower === "A" ? towerGroups[0] : towerGroups[1];
}

/** The only price shown anywhere on the site. */
export const startingPrice = {
  label: "₹3.2 Cr",
  /** Value in rupees, for analytics. */
  value: 32_000_000,
  note: "Starting price. Final pricing varies by configuration, tower, floor and unit.",
} as const;

export function formatSft(sft: number) {
  return `${sft.toLocaleString("en-IN")} SFT`;
}

export const specifications = [
  { title: "Flooring", value: "Engineered marble" },
  { title: "CP fittings", value: "Delta or equivalent" },
  { title: "Sanitaryware", value: "TOTO or equivalent" },
] as const;

export const paymentPlan = {
  label: "20:20:20:20:20",
  instalments: [20, 20, 20, 20, 20],
  note: "Five instalments of 20% each, payable across the milestones in the official payment schedule.",
} as const;

export const pricingDisclaimer =
  "*Starting price. Final apartment pricing varies by configuration, tower, floor and selected unit. Applicable taxes, registration, parking and other charges are additional. Contact the MSN team for the official cost sheet.";

export const offer = {
  bookings: 200,
  summary:
    "The introductory pre-launch offer is applicable exclusively to the first 200 bookings, subject to the developer's official terms and availability.",
} as const;

/** Places shown on the location map. Travel times are intentionally absent
 *  until verified figures are supplied — see docs/LANDING_PAGE.md. */
export const locations = [
  { id: "site", name: "Neopolis, Kokapet", note: "MSN Neopolis", query: "Neopolis, Kokapet, Hyderabad" },
  { id: "fd", name: "Financial District", query: "Financial District, Nanakramguda, Hyderabad" },
  { id: "gachibowli", name: "Gachibowli", query: "Gachibowli, Hyderabad" },
  { id: "hitec", name: "HITEC City", query: "HITEC City, Hyderabad" },
  { id: "orr", name: "Outer Ring Road", query: "Kokapet ORR Interchange, Hyderabad" },
  { id: "airport", name: "Rajiv Gandhi International Airport", query: "Rajiv Gandhi International Airport, Hyderabad" },
] as const;

export const contactCopy = {
  consent:
    "By submitting this form, you agree to be contacted by the MSN team regarding your enquiry, subject to the privacy policy.",
} as const;
