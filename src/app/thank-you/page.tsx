import type { Metadata } from "next";
import { Suspense } from "react";
import { formatSft, project, whatsappLink } from "@/content/project";
import { configurationOptions, labelFor } from "@/lib/lead";
import { readLeadSession, type LeadSession } from "@/lib/server/lead-session";
import { Analytics } from "@/components/analytics/Analytics";
import { Header } from "@/components/layout/Header";
import type { NavLink } from "@/components/layout/navigation";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ThankYouView, type ThankYouModel } from "@/components/thank-you/ThankYouView";

export const metadata: Metadata = {
  title: { absolute: `Thank You | ${project.name}, ${project.locality}` },
  description: `Your ${project.name} enquiry has been received.`,
  robots: { index: false, follow: false },
};

const footerLinks: NavLink[] = [
  { label: "Overview", href: "/#overview" },
  { label: "Residences", href: "/#residences" },
  { label: "Floor plans", href: "/#floor-plans" },
  { label: "Specifications", href: "/#specifications" },
  { label: "Pricing", href: "/#pricing" },
];

/**
 * /thank-you — the form lands here after /api/enquiry confirms CRM delivery
 * and sets the encrypted post-enquiry session, which personalises the page.
 * It is also open without a session (direct visit, expired, tampered): the
 * page then renders a generic version with no name, preferences or reference,
 * and one-tap follow-ups fall back to WhatsApp. Refreshing re-reads the
 * session; nothing is submitted again.
 */
export default function ThankYouPage() {
  return (
    <>
      <Analytics />
      <Header
        links={[]}
        enquiry="#site-visit"
        ctaLabel="Arrange a site visit"
        ctaVariant="secondary"
      />
      <main id="main">
        <Suspense fallback={<div aria-hidden className="min-h-[92svh] bg-deep lg:min-h-svh" />}>
          <PersonalisedThankYou />
        </Suspense>
      </main>
      <LandingFooter links={footerLinks} />
    </>
  );
}

async function PersonalisedThankYou() {
  const session = await readLeadSession();
  return <ThankYouView m={session ? toModel(session) : genericModel()} />;
}

/** No session: nothing personal, and no lead ID to attach follow-ups to. */
function genericModel(): ThankYouModel {
  return {
    leadId: null,
    reference: null,
    firstName: "",
    preference: [],
    configuration: null,
    phoneDisplay: "",
    whatsappHref: whatsappLink(
      "Hello MSN Team, I am interested in MSN Neopolis. I would like to discuss the available residences, floor plans and pricing.\n\nPlease assist me with the next steps.",
    ),
    floorPlansHref: "/#floor-plans",
    prefill: { name: "", country: "IN", phoneNational: "" },
  };
}

function toModel(s: LeadSession): ThankYouModel {
  const configuration = s.configuration === "both" ? "3 & 4 BHK" : s.configuration ? labelFor(configurationOptions, s.configuration) : null;
  const size = s.size ? formatSft(s.size) : null;
  const tower = s.tower && s.tower !== "any" ? `Tower ${s.tower}` : null;

  // Only what the visitor actually chose.
  const message = [
    "Hello MSN Team, I recently enquired about MSN Neopolis. I would like to discuss the available residences, floor plans and pricing.",
    configuration && `My preferred configuration: ${configuration}`,
    size && `My preferred size: ${size}`,
    tower && `My preferred tower: ${tower}`,
    "Please assist me with the next steps.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const params = new URLSearchParams();
  if (s.configuration === "3bhk" || s.configuration === "4bhk") params.set("configuration", s.configuration);
  if (s.size) params.set("size", String(s.size));
  if (tower) params.set("tower", s.tower!.toLowerCase());
  const query = params.toString();

  const phoneDisplay =
    s.phone.startsWith("+91") && s.phone.length === 13 ? `+91 ${s.phone.slice(3, 8)} ${s.phone.slice(8)}` : s.phone;

  return {
    leadId: s.leadId,
    reference: s.leadId.slice(0, 8).toUpperCase(),
    firstName: s.name.trim().split(/\s+/)[0] ?? "",
    preference: [configuration, size, tower].filter((v): v is string => Boolean(v)),
    configuration: s.configuration,
    phoneDisplay,
    whatsappHref: whatsappLink(message),
    floorPlansHref: `/${query ? `?${query}` : ""}#floor-plans`,
    prefill: { name: s.name, country: s.phoneCountry, phoneNational: s.phoneNational },
  };
}
