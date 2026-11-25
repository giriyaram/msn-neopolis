"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { contactCopy } from "@/content/project";
import { trackOnce } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import {
  configurationOptions,
  countries,
  labelFor,
  normalisePhone,
  validateContact,
  type FieldErrors,
  type LeadInput,
} from "@/lib/lead";
import { markLeadSubmitted } from "@/lib/lead-popup";
import { useSelection } from "@/lib/selection-store";
import { Button } from "@/components/ui/Button";
import { Subheading, Text } from "@/components/ui/Typography";

type Status = "idle" | "sending" | "error" | "success";

const intentCopy: Record<string, { label: string; cta: string }> = {
  "floor-plans": { label: "Official floor plans", cta: "Request floor plans" },
  pricing: { label: "Detailed pricing", cta: "Request pricing" },
  offer: { label: "Pre-launch offer eligibility", cta: "Check eligibility" },
  general: { label: "General enquiry", cta: "Request a call back" },
};

/**
 * Two fields only: name and mobile number. Whatever the visitor already chose
 * on the page (configuration, size, tower) travels with the lead silently, so
 * the sales team gets context without asking the visitor for it again.
 */
export function LeadForm({
  variant = "section",
}: {
  /** `dialog`: single-column layout for the lead popup. */
  variant?: "section" | "dialog";
}) {
  const stacked = variant === "dialog";
  const selection = useSelection();
  const intent = intentCopy[selection.intent] ?? intentCopy.general;

  const [name, setName] = useState("");
  const [country, setCountry] = useState("IN");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [leadId, setLeadId] = useState("");

  const startedAt = useRef(0);
  const submissionId = useRef<string | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const ids = useId();
  const [consentBefore, consentAfter] = contactCopy.consent.split("privacy policy");

  useEffect(() => {
    // Time from page load, not from when this form appeared: in the popup a
    // visitor can autofill and send within the server's 3 s anti-bot window.
    startedAt.current = Math.round(performance.timeOrigin) || Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  // Page context, sent only when the visitor actually chose something.
  const context = {
    configuration: selection.configuration ?? "",
    size: typeof selection.size === "number" ? String(selection.size) : "",
    tower: selection.tower && selection.tower !== "any" ? selection.tower : "",
  };
  const contextLabel = [
    context.configuration && labelFor(configurationOptions, context.configuration),
    context.size && `${Number(context.size).toLocaleString("en-IN")} SFT`,
    context.tower && `Tower ${context.tower}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const values: LeadInput = { name, country, phone, intent: selection.intent, ...context };

  function clear(field: keyof LeadInput) {
    if (!errors[field]) return;
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return; // duplicate-submit guard

    const e = validateContact(values);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(e.name ? `${ids}-name` : `${ids}-phone`)?.focus();
      return;
    }

    submissionId.current ??= crypto.randomUUID();
    setStatus("sending");
    setServerError("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          website,
          submissionId: submissionId.current,
          elapsedMs: Date.now() - startedAt.current,
          pageUrl: window.location.href,
          attribution: getAttribution(),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok: true; leadId: string }
        | { ok: false; error: string; fieldErrors?: FieldErrors }
        | null;

      if (!response.ok || !result || !result.ok) {
        if (result && !result.ok && result.fieldErrors) setErrors(result.fieldErrors);
        setServerError(
          (result && !result.ok && result.error) ||
            "We couldn't submit your enquiry just now. Please try again in a moment.",
        );
        setStatus("error");
        return;
      }

      setLeadId(result.leadId);
      setStatus("success");
      markLeadSubmitted(); // stops the timed popup and un-gates the buttons
      // Conversion fires only after confirmed delivery, once per lead.
      trackOnce(`lead_${result.leadId}`, "generate_lead", {
        lead_id: result.leadId,
        configuration: context.configuration || null,
        size_sft: context.size ? Number(context.size) : null,
        tower: context.tower || null,
        intent: selection.intent,
      });
    } catch {
      setServerError("We couldn't reach our server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function startOver() {
    submissionId.current = null;
    startedAt.current = Date.now();
    setName("");
    setPhone("");
    setStatus("idle");
    setLeadId("");
  }

  if (status === "success") {
    const dial = countries.find((c) => c.iso === country)?.dial ?? "";
    return (
      <div role="status" className={stacked ? "" : "border-t border-rule pt-10"}>
        <Subheading as="h3" ref={successHeading} tabIndex={-1} className="outline-none">
          Thank you, {name.trim().split(/\s+/)[0]}. <em>We&apos;ll be in touch shortly.</em>
        </Subheading>
        <Text className="mt-6 max-w-measure">
          The MSN team will call you on{" "}
          <span className="whitespace-nowrap text-fg">
            +{dial} {normalisePhone(phone)}
          </span>
          {contextLabel ? ` about ${contextLabel}.` : "."}
        </Text>
        <p className="mt-6 text-caption text-muted">Reference {leadId.slice(0, 8).toUpperCase()}</p>
        <Button variant="text" className="mt-6" onClick={startOver}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={submit} noValidate className={stacked ? "" : "border-t border-strong pt-6"}>
      {!stacked && (
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-caption text-muted">
          <span className="font-medium text-fg">{intent.label}</span>
          {contextLabel && <span>{contextLabel}</span>}
        </div>
      )}

      <div className={stacked ? "grid gap-7" : "grid gap-9 md:grid-cols-2 md:gap-(--grid-gap)"}>
        <div className="field flex flex-col" data-invalid={errors.name ? true : undefined}>
          <label htmlFor={`${ids}-name`} className="font-medium uppercase text-eyebrow text-muted">
            Your name
          </label>
          <input
            id={`${ids}-name`}
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clear("name");
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${ids}-name-error` : undefined}
            className="field-control mt-1"
          />
          {errors.name && (
            <p id={`${ids}-name-error`} className="mt-2 text-caption text-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field flex flex-col" data-invalid={errors.phone ? true : undefined}>
          <label htmlFor={`${ids}-phone`} className="font-medium uppercase text-eyebrow text-muted">
            Mobile number
          </label>
          <div className="mt-1 flex gap-3">
            <label htmlFor={`${ids}-country`} className="sr-only">
              Country code
            </label>
            <select
              id={`${ids}-country`}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                clear("phone");
              }}
              autoComplete="tel-country-code"
              className="field-control w-24 shrink-0"
            >
              {countries.map((c) => (
                <option key={c.iso} value={c.iso}>
                  +{c.dial} {c.iso}
                </option>
              ))}
            </select>
            <input
              id={`${ids}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              enterKeyHint="send"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clear("phone");
              }}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${ids}-phone-error` : undefined}
              className="field-control min-w-0 flex-1"
            />
          </div>
          {errors.phone && (
            <p id={`${ids}-phone-error`} className="mt-2 text-caption text-error">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot — hidden from people and assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${ids}-website`}>Website</label>
        <input
          id={`${ids}-website`}
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && (
        <div role="alert" className="mt-9 border-l-2 border-error bg-error/5 py-3 pr-3 pl-4 text-small">
          <p className="font-medium text-error">{serverError}</p>
          <p className="mt-1 text-muted">Your details are still here — you can try again.</p>
        </div>
      )}

      <div
        className={
          stacked
            ? "mt-8 flex flex-col-reverse gap-5"
            : "mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        }
      >
        <p className="max-w-[28rem] text-caption text-muted">
          {consentBefore}
          <a href="/privacy" className="underline underline-offset-4 hover:text-fg">
            privacy policy
          </a>
          {consentAfter}
        </p>
        <Button
          type="submit"
          size="lg"
          arrow={!sending}
          disabled={sending}
          aria-busy={sending}
          fullWidth
          className={stacked ? "shrink-0" : "shrink-0 sm:w-auto"}
        >
          {sending ? "Sending…" : intent.cta}
        </Button>
      </div>
    </form>
  );
}
