"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { track, trackOnce, type AnalyticsEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { cn } from "@/lib/cn";
import type { FollowUpType } from "@/lib/follow-up";
import { useScrolledPast } from "@/lib/use-scrolled";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * thank_you_view — once per lead per browser session, so refreshes don't
 * inflate it. This is NOT a lead conversion: generate_lead already fired on
 * the form after the CRM confirmed delivery.
 */
export function ThankYouTracking({ leadId, configuration }: { leadId: string; configuration: string | null }) {
  useEffect(() => {
    trackOnce(`thank_you_${leadId}`, "thank_you_view", { lead_id: leadId, configuration });
  }, [leadId, configuration]);
  return null;
}

/** WhatsApp link that records whatsapp_contact_click (a secondary conversion). */
export function WhatsAppCta({
  href,
  location,
  leadId,
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
  children,
}: {
  href: string;
  location: string;
  leadId: string | null;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_contact_click", { location, lead_id: leadId })}
      className={buttonClasses({ variant, size, fullWidth, className })}
    >
      <WhatsAppIcon width={18} height={18} />
      <span>{children}</span>
    </a>
  );
}

/** Plain link that records an engagement event before navigating. */
export function TrackedLink({
  href,
  event,
  params,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  params?: Record<string, string | null>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} onClick={() => track(event, { ...params, link_location: "thank_you" })} className={className}>
      {children}
    </a>
  );
}

type RequestStatus = "idle" | "sending" | "done" | "expired" | "error";

/**
 * One-tap follow-up (payment details, offer eligibility). The server takes
 * the visitor's contact details from the encrypted session, so nothing is
 * re-entered. Idempotent per lead on the server; disabled once sent here.
 * Without a session there is nothing to attach the request to, so the
 * button opens WhatsApp instead.
 */
export function RequestButton({
  type,
  event,
  leadId,
  phoneDisplay,
  whatsappHref,
  label,
  doneMessage,
  variant = "primary",
}: {
  type: Exclude<FollowUpType, "site_visit">;
  event: Extract<AnalyticsEvent, "payment_details_request" | "consultation_request">;
  leadId: string | null;
  phoneDisplay: string;
  whatsappHref: string;
  label: string;
  /** Completes "The MSN team will …". */
  doneMessage: string;
  variant?: ButtonVariant;
}) {
  const [status, setStatus] = useState<RequestStatus>("idle");
  const requestId = useRef<string | null>(null);

  async function send() {
    if (status === "sending" || status === "done") return;
    requestId.current ??= crypto.randomUUID();
    setStatus("sending");
    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          requestId: requestId.current,
          pageUrl: window.location.href,
          attribution: getAttribution(),
        }),
      });
      if (response.status === 401) {
        setStatus("expired");
        return;
      }
      const result = (await response.json().catch(() => null)) as { ok: boolean } | null;
      if (!response.ok || !result?.ok) {
        setStatus("error");
        return;
      }
      setStatus("done");
      trackOnce(`${type}_${leadId}`, event, { lead_id: leadId, request_type: type });
    } catch {
      setStatus("error");
    }
  }

  if (!leadId) {
    return (
      <WhatsAppCta href={whatsappHref} location={type} leadId={null} variant={variant} className="w-full px-5! sm:w-auto sm:px-10!">
        {label}
      </WhatsAppCta>
    );
  }

  if (status === "done") {
    return (
      <p role="status" className="max-w-[30rem] border-l-2 border-accent pl-5 text-small text-fg">
        <span className="block font-medium uppercase text-eyebrow text-accent">Request received</span>
        <span className="mt-2 block text-muted">
          The MSN team will {doneMessage} on <span className="whitespace-nowrap text-fg">{phoneDisplay}</span>.
        </span>
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className={buttonClasses({ variant, size: "lg", className: "w-full px-5! sm:w-auto sm:px-10!" })}
      >
        <span>{status === "sending" ? "Sending…" : label}</span>
        {status !== "sending" && (
          <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
        )}
      </button>
      {(status === "error" || status === "expired") && (
        <p role="alert" className="mt-4 max-w-[30rem] text-small text-muted">
          {status === "expired"
            ? "Your session has ended, so we couldn't attach this to your enquiry. "
            : "We couldn't send your request just now. "}
          <a href={whatsappHref} target="_blank" rel="noopener" className="text-fg underline underline-offset-4">
            Message the MSN team on WhatsApp
          </a>{" "}
          instead.
        </p>
      )}
    </div>
  );
}

/**
 * Phones and tablets: WhatsApp and site-visit actions stay within thumb
 * reach once the visitor scrolls past the hero.
 */
export function StickyContactBar({ whatsappHref, leadId }: { whatsappHref: string; leadId: string | null }) {
  const visible = useScrolledPast(0.5);
  return (
    <div
      inert={!visible}
      className={cn(
        "tone-canvas fixed inset-x-0 bottom-0 z-40 border-t border-rule lg:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        "transition-transform duration-(--duration-slow) ease-luxe",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-content grid grid-cols-2 gap-3 py-3">
        <WhatsAppCta href={whatsappHref} location="sticky_bar" leadId={leadId} size="sm" className="px-3!">
          WhatsApp
        </WhatsAppCta>
        <a href="#site-visit" className={buttonClasses({ variant: "secondary", size: "sm", className: "px-3!" })}>
          Site visit
        </a>
      </div>
    </div>
  );
}
