import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" />;
}
