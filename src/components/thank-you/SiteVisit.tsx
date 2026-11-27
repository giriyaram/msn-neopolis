"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { trackOnce } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { cn } from "@/lib/cn";
import {
  addDays,
  istDate,
  validateSiteVisit,
  VISIT_WINDOW_DAYS,
  visitTimes,
  type SiteVisitErrors,
  type SiteVisitInput,
} from "@/lib/follow-up";
import { countries, normalisePhone } from "@/lib/lead";
import { Segmented } from "@/components/landing/Segmented";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Typography";

export const SITE_VISIT_ID = "site-visit";

type Prefill = { name: string; country: string; phoneNational: string };
type Status = "idle" | "sending" | "error" | "success";

const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

/**
 * Site-visit request. Opens in place when any link to #site-visit is used
 * (hero, action panel, final section, sticky bar, header), so those links
 * can stay plain server-rendered anchors.
 */
export function SiteVisit({ prefill, leadId }: { prefill: Prefill; leadId: string | null }) {
  const [open, setOpen] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function reveal() {
      setOpen(true);
      requestAnimationFrame(() => {
        region.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        region.current?.querySelector<HTMLInputElement>("input[type=date]")?.focus({ preventScroll: true });
      });
    }
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.(`a[href$="#${SITE_VISIT_ID}"]`);
      if (!link) return;
      event.preventDefault();
      reveal();
    }
    document.addEventListener("click", onClick);
    if (window.location.hash === `#${SITE_VISIT_ID}`) reveal();
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div id={SITE_VISIT_ID} ref={region} className="scroll-mt-24 lg:scroll-mt-28">
      {open && <SiteVisitForm prefill={prefill} leadId={leadId} onClose={() => setOpen(false)} />}
    </div>
  );
}

function SiteVisitForm({ prefill, leadId, onClose }: { prefill: Prefill; leadId: string | null; onClose: () => void }) {
  const ids = useId();
  // Mounted only after a click, so the visitor's clock sets the date range.
  const [today] = useState(() => istDate(Date.now()));
  const [openedAt] = useState(() => Date.now());
  const requestId = useRef<string | null>(null);
  const done = useRef<HTMLHeadingElement>(null);

  const [values, setValues] = useState<SiteVisitInput>({
    date: "",
    time: "",
    name: prefill.name,
    country: prefill.country || "IN",
    phone: prefill.phoneNational,
    email: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<SiteVisitErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (status === "success") done.current?.focus();
  }, [status]);

  function set<K extends keyof SiteVisitInput>(key: K, value: SiteVisitInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const e = validateSiteVisit(values, today);
    setErrors(e);
    const firstInvalid = (["date", "time", "name", "phone", "email"] as const).find((k) => e[k]);
    if (firstInvalid) {
      document.getElementById(`${ids}-${firstInvalid}`)?.focus();
      return;
    }

    requestId.current ??= crypto.randomUUID();
    setStatus("sending");
    setServerError("");
    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "site_visit",
          requestId: requestId.current,
          ...values,
          website,
          elapsedMs: Date.now() - openedAt,
          pageUrl: window.location.href,
          attribution: getAttribution(),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error: string; fieldErrors?: SiteVisitErrors }
        | null;
      if (!response.ok || !result || !result.ok) {
        if (result && !result.ok && result.fieldErrors) setErrors(result.fieldErrors);
        setServerError((result && !result.ok && result.error) || "We couldn't send your request. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      trackOnce(`site_visit_${requestId.current}`, "site_visit_request", {
        lead_id: leadId,
        preferred_time: values.time,
      });
    } catch {
      setServerError("We couldn't reach our server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const dial = countries.find((c) => c.iso === values.country)?.dial ?? "";
  const timeLabel = visitTimes.find((t) => t.value === values.time)?.label.toLowerCase();

  return (
    <section
      aria-labelledby={`${ids}-title`}
      // Phones: edge to edge, so the three time options fit on one line.
      className="tone-panel -mx-(--gutter) mt-(--grid-gap) animate-rise border-y border-rule px-(--gutter) py-8 sm:mx-0 sm:border sm:p-8 lg:p-12"
    >
      {status === "success" ? (
        <div role="status" className="max-w-[40rem]">
          <Eyebrow rule>Visit request received</Eyebrow>
          <h3 id={`${ids}-title`} ref={done} tabIndex={-1} className="mt-6 font-serif text-subheading font-light outline-none [&_em]:italic">
            Thank you. <em>We&apos;ll confirm your visit shortly.</em>
          </h3>
          <p className="mt-6 text-body text-muted">
            The MSN team will call you on{" "}
            <span className="whitespace-nowrap text-fg">
              +{dial} {normalisePhone(values.phone)}
            </span>{" "}
            to confirm a time for {formatDay(values.date)}
            {timeLabel ? `, in the ${timeLabel}` : ""}, subject to availability.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="flex items-start justify-between gap-6">
            <div>
              <Eyebrow rule>Private site visit</Eyebrow>
              <h3 id={`${ids}-title`} className="mt-5 font-serif text-subheading font-light [&_em]:italic">
                Request a <em>site visit.</em>
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mt-1 -mr-2 inline-flex h-11 shrink-0 items-center gap-3 px-2 font-medium uppercase text-button text-muted hover:text-fg"
            >
              <span className="hidden sm:inline">Close</span>
              <CloseIcon />
              <span className="sr-only sm:hidden">Close site visit form</span>
            </button>
          </div>
          <p className="mt-4 max-w-[40rem] text-small text-muted">
            Choose a preferred day and time. This is a request, not a confirmed booking — the MSN
            team will call you to confirm an available time.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-9 md:grid-cols-2 md:gap-x-(--grid-gap)">
            <div className="field flex flex-col" data-invalid={errors.date ? true : undefined}>
              <label htmlFor={`${ids}-date`} className="font-medium uppercase text-eyebrow text-muted">
                Preferred date
              </label>
              <input
                id={`${ids}-date`}
                type="date"
                min={today}
                max={addDays(today, VISIT_WINDOW_DAYS)}
                value={values.date}
                onChange={(e) => set("date", e.target.value)}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={errors.date ? `${ids}-date-error` : undefined}
                className="field-control mt-1"
              />
              {errors.date && (
                <p id={`${ids}-date-error`} className="mt-2 text-caption text-error">
                  {errors.date}
                </p>
              )}
            </div>

            <div
              id={`${ids}-time`}
              tabIndex={-1}
              className="min-w-0 outline-none max-sm:[&_label]:px-1.5 max-sm:[&_label_span]:tracking-[0.1em]"
            >
              <Segmented
                legend="Preferred time"
                options={visitTimes}
                value={values.time || null}
                onChange={(v) => set("time", v)}
                error={errors.time}
              />
            </div>

            <div className="field flex flex-col" data-invalid={errors.name ? true : undefined}>
              <label htmlFor={`${ids}-name`} className="font-medium uppercase text-eyebrow text-muted">
                Full name
              </label>
              <input
                id={`${ids}-name`}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
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
                  value={values.country}
                  onChange={(e) => set("country", e.target.value)}
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
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
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

            <div className="field flex flex-col md:col-span-2" data-invalid={errors.email ? true : undefined}>
              <label
                htmlFor={`${ids}-email`}
                className="flex items-baseline justify-between gap-4 font-medium uppercase text-eyebrow text-muted"
              >
                Email
                <span className="text-caption tracking-normal normal-case">Optional</span>
              </label>
              <input
                id={`${ids}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${ids}-email-error` : undefined}
                className="field-control mt-1"
              />
              {errors.email && (
                <p id={`${ids}-email-error`} className="mt-2 text-caption text-error">
                  {errors.email}
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

          <div className={cn("mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between")}>
            <p className="max-w-[26rem] text-caption text-muted">
              The MSN team will contact you to confirm availability. Visits are subject to confirmation.
            </p>
            <Button
              type="submit"
              size="lg"
              arrow={status !== "sending"}
              disabled={status === "sending"}
              aria-busy={status === "sending"}
              fullWidth
              className="shrink-0 sm:w-auto"
            >
              {status === "sending" ? "Sending…" : "Send visit request"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
