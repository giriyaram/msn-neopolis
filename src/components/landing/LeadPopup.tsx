"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { media } from "@/content/media";
import { offer, startingPrice } from "@/content/project";
import { track } from "@/lib/analytics";
import {
  closeLeadPopup,
  getLeadPopup,
  openLeadPopup,
  restoreLeadSubmitted,
  useLeadPopup,
} from "@/lib/lead-popup";
import type { Intent } from "@/lib/lead";
import { setIntent, useSelection } from "@/lib/selection-store";
import { CloseIcon } from "@/components/ui/Icons";
import { InlineContact } from "./ContactButtons";
import { LeadForm } from "./LeadForm";

/** First appearance after page load. */
const FIRST_DELAY_MS = 5_000;
/** Re-appearance after each time the visitor closes it. */
const REPEAT_DELAY_MS = 30_000;
/** When the visitor is busy (typing, another dialog open, tab hidden). */
const RETRY_DELAY_MS = 3_000;

/** Every styled call-to-action: anything rendered with `buttonClasses`. */
const CTA_SELECTOR = 'a[class~="group/button"], button[class~="group/button"]';

const headings: Record<Intent, { eyebrow: string; title: string; em: string }> = {
  "floor-plans": { eyebrow: "Official floor plans", title: "Get the official", em: "floor plans." },
  pricing: { eyebrow: "Detailed pricing", title: "Get the official", em: "cost sheet." },
  offer: { eyebrow: "Pre-launch offer", title: "Check your", em: "offer eligibility." },
  general: { eyebrow: "MSN Neopolis", title: "Speak to the", em: "MSN team." },
};
const timerHeading = { eyebrow: "MSN Neopolis · Kokapet", title: "Floor plans, pricing &", em: "the pre-launch offer." };

function intentForHref(href: string): Intent | null {
  if (href.endsWith("#pricing")) return "pricing";
  if (href.endsWith("#offer")) return "offer";
  if (href.endsWith("#floor-plans")) return "floor-plans";
  return null; // EnquiryLink sets its own intent in its onClick.
}

/** Don't interrupt someone typing, using another dialog, or on another tab. */
function visitorIsBusy() {
  if (document.hidden) return true;
  if (document.querySelector("dialog[open]")) return true;
  const active = document.activeElement;
  return !!active && active.matches("input, textarea, select, [contenteditable='true']");
}

/**
 * Lead capture popup.
 *  - Opens 5 s after load, then again 30 s after each time it is closed.
 *  - Every call-to-action button opens it instead of scrolling.
 *  - Stops on both counts once a lead is delivered (from here or the page form).
 */
export function LeadPopup() {
  const { open, submitted, trigger } = useLeadPopup();
  const selection = useSelection();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasOpened = useRef(false);
  const titleId = useId();

  useEffect(() => {
    restoreLeadSubmitted();
  }, []);

  // Timed appearances.
  useEffect(() => {
    if (open || submitted) return;
    let timer = setTimeout(
      function attempt() {
        const now = getLeadPopup();
        if (now.open || now.submitted) return;
        if (visitorIsBusy()) {
          timer = setTimeout(attempt, RETRY_DELAY_MS);
          return;
        }
        openLeadPopup("timer");
      },
      hasOpened.current ? REPEAT_DELAY_MS : FIRST_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [open, submitted]);

  // Every CTA button opens the popup until a lead has been submitted.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (getLeadPopup().submitted) return;

      const el = (event.target as Element | null)?.closest?.(CTA_SELECTOR);
      if (!el || el.closest("[data-lead-popup], [data-no-popup]")) return;
      if (el instanceof HTMLButtonElement && el.closest("form")) return; // form controls, submit
      const href = el.getAttribute("href") ?? "";
      if (/^(tel|mailto):/i.test(href)) return;

      event.preventDefault();
      const intent = intentForHref(href);
      if (intent) setIntent(intent);
      openLeadPopup("button");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Keep the native dialog in sync with the store.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      hasOpened.current = true;
      dialog.showModal();
      track("lead_popup_open", { trigger: trigger ?? "button" });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, trigger]);

  const copy = trigger === "timer" ? timerHeading : headings[selection.intent];
  const image = media.hero;

  return (
    <dialog
      ref={dialogRef}
      data-lead-popup
      aria-labelledby={titleId}
      className="lead-dialog tone-canvas"
      onClose={closeLeadPopup}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) closeLeadPopup();
      }}
    >
      <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        {image && (
          <div className="tone-overlay relative h-36 overflow-hidden bg-deep md:h-auto md:min-h-[34rem]">
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(min-width: 768px) 28rem, 100vw"
              className="object-cover"
              style={{ objectPosition: "45% 30%" }}
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-deep/90 via-deep/30 to-deep/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <p className="font-medium uppercase text-eyebrow text-muted">Starting from</p>
              <p className="mt-1 font-serif text-subheading font-light tabular-nums md:text-heading">
                {startingPrice.label}
                <span className="text-accent">*</span>
              </p>
              <p className="mt-2 hidden max-w-[22rem] text-small text-muted md:block">
                Pre-launch offer for the first {offer.bookings} bookings. 3 &amp; 4 BHK residences in
                Neopolis, Kokapet.
              </p>
            </div>
          </div>
        )}

        <div className="relative p-6 pt-8 sm:p-10">
          <button
            type="button"
            onClick={closeLeadPopup}
            aria-label="Close"
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center text-muted transition-colors hover:text-fg"
          >
            <CloseIcon />
          </button>

          <p className="flex items-center gap-4 pr-10 font-medium uppercase text-eyebrow text-muted">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {copy.eyebrow}
          </p>
          <h2 id={titleId} className="mt-4 font-serif text-subheading font-light">
            {copy.title} <em>{copy.em}</em>
          </h2>
          <p className="mt-3 text-small text-muted">
            Leave your name and number. The MSN team will call you back.
          </p>

          <div className="mt-8">{open && <LeadForm variant="dialog" />}</div>
          <InlineContact location="popup" className="mt-6 border-t border-rule pt-5" />
        </div>
      </div>
    </dialog>
  );
}
