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
import { Eyebrow, Heading, Lead, Text } from "@/components/ui/Typography";
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

      <div className="mt-20 grid-12 gap-y-14 lg:mt-28">
        {/* Payment plan */}
        <div className="col-span-full lg:col-span-7" data-reveal>
          <p className="font-medium uppercase text-eyebrow text-muted">Payment plan</p>
          <p className="mt-3 font-serif text-subheading tabular-nums">{paymentPlan.label}</p>
          <ol className="mt-8 grid grid-cols-5 gap-1.5" aria-label="Five instalments of 20% each">
            {paymentPlan.instalments.map((pct, i) => (
              <li key={i} className="flex flex-col">
                <span className="h-2 bg-deep" style={{ opacity: 0.35 + i * 0.16 }} aria-hidden />
                <span className="mt-3 font-serif text-title tabular-nums">{pct}%</span>
                <span className="text-caption text-muted">Instalment {i + 1}</span>
              </li>
            ))}
          </ol>
          <Text className="mt-6 max-w-prose text-small">{paymentPlan.note}</Text>
        </div>

        <div className="col-span-full lg:col-span-4 lg:col-start-9" data-reveal>
          <p className="border-l-2 border-accent pl-5 text-small text-muted">{pricingDisclaimer}</p>
        </div>
      </div>
    </Section>
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
