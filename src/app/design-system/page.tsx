import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import type { NavLink } from "@/components/layout/navigation";
import { Hero } from "./_sections/Hero";
import { Overview } from "./_sections/Overview";
import { ColourSection } from "./_sections/Colour";
import { PalettesSection } from "./_sections/Palettes";
import { TypographySection } from "./_sections/Typography";
import { ButtonsSection } from "./_sections/Buttons";
import { LayoutSection } from "./_sections/Layout";
import { NavigationSection } from "./_sections/Navigation";
import { ImagerySection } from "./_sections/Imagery";
import { DataSection } from "./_sections/Data";
import { FormsSection } from "./_sections/Forms";
import { CtaSection } from "./_sections/Cta";
import { ResponsiveSection } from "./_sections/Responsive";

export const metadata: Metadata = {
  title: "Design System",
  description: "Visual identity and design system for MSN Neopolis, Kokapet.",
  robots: { index: false, follow: false },
};

const sectionNav: NavLink[] = [
  { label: "Colour", href: "#colour" },
  { label: "Typography", href: "#typography" },
  { label: "Components", href: "#buttons" },
  { label: "Layout", href: "#layout" },
  { label: "Imagery", href: "#imagery" },
];

export default function DesignSystemPage() {
  return (
    <>
      <Header links={sectionNav} enquiry="#forms" />
      <main id="main">
        <Hero />
        <Overview />
        <ColourSection />
        <PalettesSection />
        <TypographySection />
        <ButtonsSection />
        <LayoutSection />
        <NavigationSection />
        <ImagerySection />
        <DataSection />
        <FormsSection />
        <CtaSection />
        <ResponsiveSection />
      </main>
      <Footer links={sectionNav} />
      <MobileCtaBar label="Enquire" href="#forms" />
    </>
  );
}
