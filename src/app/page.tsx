import type { Metadata } from "next";
import { faqs } from "@/content/faq";
import { media } from "@/content/media";
import { contact, project } from "@/content/project";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@/components/analytics/Analytics";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import type { NavLink } from "@/components/layout/navigation";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LeadPopup } from "@/components/landing/LeadPopup";
import { FloatingContact } from "@/components/landing/ContactButtons";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { OverviewSection } from "@/components/landing/sections/OverviewSection";
import { FloorPlansSection, ResidencesSection } from "@/components/landing/sections/ResidencesSection";
import {
  AmenitiesSection,
  ArchitectureSection,
  SkyPavilionsSection,
  SpecificationsSection,
} from "@/components/landing/sections/ArchitectureSection";
import { LocationSection } from "@/components/landing/sections/LocationSection";
import { OfferSection, PricingSection } from "@/components/landing/sections/PricingSection";
import { EnquirySection, FaqSection } from "@/components/landing/sections/EnquirySection";

const title = "MSN Neopolis, Kokapet | Luxury 3 & 4 BHK Apartments in Hyderabad";
const description =
  "Luxury 3 & 4 BHK residences of 2,424–4,545 SFT at MSN Neopolis, Neopolis, Kokapet — 3 towers, 56 floors, 7 acres. Starting from ₹3.2 Cr. Explore floor plans and the pre-launch offer.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: project.name,
    title,
    description,
    locale: "en_IN",
    ...(media.hero ? { images: [{ url: media.hero.src, width: media.hero.width, height: media.hero.height, alt: media.hero.alt }] } : {}),
  },
  twitter: { card: "summary_large_image", title, description },
};

const nav: NavLink[] = [
  { label: "Overview", href: "#overview" },
  { label: "Residences", href: "#residences" },
  { label: "Architecture", href: "#architecture" },
  { label: "Amenities", href: "#amenities" },
  { label: "Location", href: "#location" },
  { label: "Pricing", href: "#pricing" },
];

function StructuredData() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ApartmentComplex",
      name: project.name,
      url: siteUrl,
      telephone: contact.phone,
      description,
      address: {
        "@type": "PostalAddress",
        addressLocality: `${project.locality}, ${project.city}`,
        addressRegion: project.region,
        addressCountry: project.country,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      // JSON-LD from static project data; "<" escaped to keep it inert.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <Analytics />
      <Header
        links={nav}
        enquiry="#floor-plans"
        ctaLabel="Explore floor plans"
        ctaVariant="primary"
        menuCtaLabel="Explore floor plans"
      />
      <main id="main">
        <HeroSection />
        <OverviewSection />
        <ResidencesSection />
        <FloorPlansSection />
        <ArchitectureSection />
        <SkyPavilionsSection />
        <AmenitiesSection />
        <SpecificationsSection />
        <LocationSection />
        <PricingSection />
        <OfferSection />
        <EnquirySection />
        <FaqSection />
      </main>
      <LandingFooter links={nav} />
      <MobileCtaBar label="Explore floor plans" href="#floor-plans" contact />
      <FloatingContact />
      <LeadPopup />
    </>
  );
}
