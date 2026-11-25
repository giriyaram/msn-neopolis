import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { buttonClasses } from "@/components/ui/Button";
import { Heading, Text } from "@/components/ui/Typography";

/**
 * Holding page for legal documents until MSN supplies the approved text.
 * Legal copy must come from MSN — do not draft it here.
 */
export function LegalPage({ title }: { title: string }) {
  return (
    <>
      <Header variant="solid" links={[]} enquiry="/#enquire" ctaLabel="Enquire" />
      <main id="main" className="container-prose section-y min-h-[70svh] pt-40">
        <Heading as="h1">{title}</Heading>
        <Text className="mt-8">
          MSN&apos;s {title.toLowerCase()} for this website will be published here. For questions about
          how your enquiry details are used, please contact the MSN team through the enquiry form.
        </Text>
        <Link href="/" className={buttonClasses({ variant: "secondary", className: "mt-10" })}>
          Back to MSN Neopolis
        </Link>
      </main>
    </>
  );
}
