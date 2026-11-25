import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MSN Neopolis, Kokapet — Luxury Residences",
    template: "%s · MSN Neopolis",
  },
  description:
    "MSN Neopolis, Kokapet — architecturally led luxury residences in Hyderabad.",
};

export const viewport: Viewport = {
  themeColor: "#dde1d4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
