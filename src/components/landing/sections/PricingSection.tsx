import Image from "next/image";
import { media } from "@/content/media";
import {
  configurations,
  offer,
  paymentPlan,
  pricingDisclaimer,
  startingPrice,
  type ConfigurationId,
} from "@/content/project";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight, InfoIcon, LayersIcon } from "@/components/ui/Icons";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { WhatsAppEnquireButton } from "../ContactButtons";
import { EnquiryLink } from "../EnquiryLink";

const configIds = Object.keys(configurations) as ConfigurationId[];

/**
 * One starting price only. Per-size and per-tower prices, and the per-SFT
 * base rates, are shared by the MSN team in the official cost sheet.
 */
export function PricingSection() {
  return (
    <Section id="pricing" aria-labelledby="pricing-title">
      <div className="grid-12 gap-y-10">
        <div className="col-span-full lg:col-span-7" data-reveal>
          <Eyebrow index="09" rule>
            Pricing
          </Eyebrow>
          <Heading id="pricing-title" className="mt-6 max-w-[15ch]">
            Explore a Residence That <em>Suits Your Requirements.</em>
          </Heading>
        </div>
        <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9" data-reveal>
          <Lead className="text-muted">
            Choose your residence and receive the official cost sheet for it from the MSN team.
          </Lead>
        </div>
      </div>

      <div className="mt-16 grid-12 gap-y-12 border-t border-strong pt-10 lg:mt-24 lg:pt-14" data-reveal>
        <div className="col-span-full lg:col-span-6">
          <p className="font-medium uppercase text-eyebrow text-muted">Starting from</p>
          <p className="mt-4 font-serif text-[clamp(4.5rem,2rem+9vw,10rem)] leading-[0.85] font-light tabular-nums">
            {startingPrice.label}
            <span className="align-top text-[0.4em] text-accent">*</span>
          </p>
        </div>

        <div className="col-span-full self-end lg:col-span-5 lg:col-start-8">
          <dl className="border-t border-rule">
            {configIds.map((id) => {
              const c = configurations[id];
              return (
                <div key={id} className="flex items-baseline justify-between gap-6 border-b border-rule py-5">
                  <dt className="font-serif text-subheading">{c.label}</dt>
                  <dd className="text-small text-muted tabular-nums">
                    {c.sizes[0].toLocaleString("en-IN")}–{c.sizes[c.sizes.length - 1].toLocaleString("en-IN")} SFT
                  </dd>
                </div>
              );
            })}
          </dl>
          <EnquiryLink intent="pricing" fullWidth className="mt-8">
            Request the cost sheet
          </EnquiryLink>
        </div>
      </div>

      <PaymentPlan />

      <p className="mt-14 max-w-prose border-l-2 border-accent pl-5 text-caption text-muted lg:mt-20" data-reveal>
        {pricingDisclaimer}
      </p>
    </Section>
  );
}

const ordinal = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];

/**
 * 20:20:20:20:20 payment plan. Desktop: intro and actions on the left,
 * the milestone card on the right. Phones: intro → card → actions.
 */
function PaymentPlan() {
  const total = paymentPlan.stages.reduce((sum, s) => sum + s.percent, 0);
  const ratio = paymentPlan.label.split(":");

  return (
    <div
      id="payment-plan"
      aria-labelledby="payment-plan-title"
      role="region"
      className="mt-24 grid-12 gap-y-10 lg:mt-36 lg:gap-y-12"
    >
      {/* Intro */}
      <div className="col-span-full lg:col-span-5" data-reveal>
        <Eyebrow rule>Payment plan</Eyebrow>
        <h3
          id="payment-plan-title"
          className="mt-6 max-w-[14ch] font-serif text-subheading font-light text-fg [&_em]:italic"
        >
          A Flexible &amp; Transparent <em>Payment Journey.</em>
        </h3>
        <p
          className="mt-8 font-serif text-[clamp(2.5rem,1.4rem+4.5vw,4.5rem)] leading-none font-light whitespace-nowrap tabular-nums text-strong lg:mt-10 lg:text-[clamp(2.75rem,0.5rem+3.6vw,4.5rem)]"
          aria-label={`${paymentPlan.label} payment plan`}
        >
          {ratio.map((n, i) => (
            <span key={i} aria-hidden>
              {i > 0 && <span className="mx-[0.14em] text-accent">:</span>}
              {n}
            </span>
          ))}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium uppercase text-eyebrow text-muted">
          <span>{paymentPlan.stages.length} stage plan</span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          <span>{total}% payment</span>
        </p>
        {/* Five equal segments — the plan at a glance */}
        <div aria-hidden className="mt-8 flex max-w-[26rem] gap-1.5">
          {paymentPlan.stages.map((s, i) => (
            <span key={i} className="h-1.5 bg-deep" style={{ flexGrow: s.percent, opacity: 0.3 + i * 0.175 }} />
          ))}
        </div>
        <Lead className="mt-8 hidden max-w-[30rem] text-muted lg:block">{paymentPlan.intro}</Lead>
      </div>

      {/* Milestones card */}
      <div
        className="tone-panel col-span-full border border-rule p-4 shadow-[0_40px_90px_-50px_rgb(28_43_35/0.45)] sm:p-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:p-10"
        data-reveal
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-serif text-title font-medium">Payment milestones</p>
          <p className="shrink-0 bg-deep/8 px-4 py-2 text-small font-medium tabular-nums text-strong">
            Total: {total}%
          </p>
        </div>

        <ol className="mt-7 grid gap-2.5 lg:mt-9">
          {paymentPlan.stages.map((stage, i) => {
            const first = i === 0;
            const last = i === paymentPlan.stages.length - 1;
            return (
              <li key={i} className="flex gap-3 sm:gap-5">
                {/* Step marker. Each row draws its half of the connector above
                    and below the marker, so the line stays continuous even
                    when rows wrap to different heights. */}
                <div className="relative grid w-9 shrink-0 place-items-center sm:w-11">
                  {!first && (
                    <span aria-hidden className="absolute -top-[0.3125rem] bottom-1/2 left-1/2 w-px -translate-x-1/2 bg-deep/35" />
                  )}
                  {!last && (
                    <span aria-hidden className="absolute top-1/2 -bottom-[0.3125rem] left-1/2 w-px -translate-x-1/2 bg-deep/35" />
                  )}
                  <span className="relative grid size-9 place-items-center rounded-full bg-deep text-caption font-medium tabular-nums text-canvas sm:size-11 sm:text-small">
                    {ordinal[i] ?? i + 1}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 items-stretch justify-between gap-3 bg-canvas/55">
                  <div className="min-w-0 py-3 pl-3.5 sm:pl-5 lg:py-4">
                    <p className="font-medium leading-snug text-fg sm:text-[1.0625rem]">{stage.title}</p>
                    <p className="mt-0.5 text-caption text-muted sm:text-small">{stage.when}</p>
                  </div>
                  <p className="grid w-[4.25rem] shrink-0 place-items-center bg-deep/[0.06] font-serif text-[1.75rem] leading-none font-light tabular-nums text-strong sm:w-28 sm:text-[2.5rem]">
                    <span>
                      {stage.percent}
                      <span className="text-[0.7em]">%</span>
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center gap-4 bg-deep/[0.07] px-5 py-4 sm:gap-5 sm:px-6 lg:mt-8">
          <LayersIcon className="shrink-0 text-strong" />
          <span aria-hidden className="h-8 w-px shrink-0 bg-deep/20" />
          <p className="text-small text-fg">{paymentPlan.note}</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-center sm:gap-6 lg:mt-8 lg:pt-6">
          <p className="flex shrink-0 items-center gap-2 text-small font-medium text-fg">
            Pricing &amp; charges
            <InfoIcon className="text-muted" />
          </p>
          <span aria-hidden className="hidden h-10 w-px shrink-0 bg-rule sm:block" />
          <p className="text-caption text-muted">{paymentPlan.charges}</p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="col-span-full grid max-w-[30rem] gap-3 sm:max-w-none sm:grid-cols-2 lg:col-span-4 lg:row-start-2 lg:grid-cols-1 lg:self-end"
        data-reveal
      >
        <WhatsAppEnquireButton />
        <a href="#floor-plans" className={buttonClasses({ variant: "primary" })}>
          <span>Explore floor plans</span>
          <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export function OfferSection() {
  return (
    <section id="offer" aria-labelledby="offer-title" className="tone-deep relative isolate overflow-hidden section-y">
      {media.hero && (
        <>
          <div data-reveal="image" aria-hidden className="absolute inset-0 -z-10 opacity-45">
            <Image
              src={media.hero.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 0%" }}
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-deep via-deep/85 to-deep/40" />
        </>
      )}
      <div className="container-content grid-12 gap-y-12">
        <div className="col-span-full lg:col-span-4" data-reveal>
          <p className="font-serif text-[clamp(5rem,3rem+8vw,10rem)] leading-[0.85] font-light tabular-nums text-accent">
            {offer.bookings}
          </p>
          <p className="mt-4 font-medium uppercase text-eyebrow text-muted">First bookings</p>
        </div>
        <div className="col-span-full lg:col-span-7 lg:col-start-6" data-reveal>
          <Eyebrow index="10" rule>
            Pre-launch offer
          </Eyebrow>
          <Heading id="offer-title" className="mt-6 max-w-[16ch]">
            An Opportunity to Explore the <em>Early Booking Advantage.</em>
          </Heading>
          <Lead className="mt-8 max-w-[36rem] text-muted">{offer.summary}</Lead>
          <EnquiryLink intent="offer" className="mt-10">
            Check offer eligibility
          </EnquiryLink>
        </div>
      </div>
    </section>
  );
}
