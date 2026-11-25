/** Canonical site origin. Set NEXT_PUBLIC_SITE_URL in every deployed environment. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
