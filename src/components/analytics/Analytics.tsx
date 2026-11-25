"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { seedSelectionFromUrl } from "@/lib/selection-store";

// IDs come from the environment only; validated to keep them out of script injection.
const GTM_ID = /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID ?? "")
  ? process.env.NEXT_PUBLIC_GTM_ID
  : undefined;
const GA4_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA4_ID
  : undefined;

let initialised = false;

/**
 * Loads Google Tag Manager (preferred) or GA4, captures attribution and
 * applies search-intent preselection from the URL. Renders nothing visible.
 */
export function Analytics() {
  useEffect(() => {
    if (initialised) return;
    initialised = true;
    captureAttribution();
    seedSelectionFromUrl();
    // With GTM, page_view is pushed explicitly (see docs). With gtag-only,
    // the GA4 config command already records the page view.
    if (GTM_ID) {
      track("page_view", { page_location: window.location.href, page_title: document.title });
    }
  }, []);

  if (GTM_ID) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    );
  }

  if (GA4_ID) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
        </Script>
      </>
    );
  }

  return null;
}
