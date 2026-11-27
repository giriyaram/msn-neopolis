import Image from "next/image";
import { media, RENDER_LABEL, STOCK_LABEL } from "@/content/media";
import { offer, paymentPlan, project } from "@/content/project";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Eyebrow, Lead } from "@/components/ui/Typography";
import { RequestButton, StickyContactBar, ThankYouTracking, TrackedLink, WhatsAppCta } from "./actions";
import { SiteVisit } from "./SiteVisit";

export type ThankYouModel = {
  /** null when the page is visited without a post-enquiry session. */
  leadId: string | null;
  reference: string | null;
  firstName: string;
  /** e.g. ["4 BHK", "3,600 SFT", "Tower A"] — only what the visitor chose. */
  preference: string[];
  configuration: string | null;
  phoneDisplay: string;
  whatsappHref: string;
  floorPlansHref: string;
  prefill: { name: string; country: string; phoneNational: string };
};

const arrow = (
  <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
);

/** Large buttons: full width with tighter padding on phones, so labels stay on one line. */
const mobileFit = "w-full px-5! sm:w-auto sm:px-10!";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function ThankYouView({ m }: { m: ThankYouModel }) {
  return (
    <>
      {m.leadId && <ThankYouTracking leadId={m.leadId} configuration={m.configuration} />}
      <Hero m={m} />
      <NextAction m={m} />
      <ProjectValue />
      <ExploreDetails m={m} />
      <PlanAndOffer m={m} />
      <FinalInvitation m={m} />
      <StickyContactBar whatsappHref={m.whatsappHref} leadId={m.leadId} />
    </>
  );
}

/* 1 — Confirmation hero ------------------------------------------------- */

function Hero({ m }: { m: ThankYouModel }) {
  const hero = media.hero;
  return (
    <section
      aria-labelledby="thanks-title"
      className="tone-overlay relative isolate flex min-h-[92svh] items-end overflow-hidden bg-deep pt-(--header-h) lg:min-h-svh"
    >
      {hero && (
        <>
          <div className="absolute inset-0 -z-10 animate-drift">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              preload
              loading="eager"
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "62% 35%" }}
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-deep/75 via-deep/30 to-deep" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-deep/80 via-deep/30 to-transparent" />
          <p className="absolute top-[calc(var(--header-h)+1rem)] right-(--gutter) text-caption text-muted">
            {RENDER_LABEL}
          </p>
        </>
      )}

      <div className="container-content w-full pt-16 pb-10 lg:pb-16">
        <Eyebrow rule className="animate-rise" style={delay(80)}>
          MSN <span aria-hidden className="mx-2 opacity-50">|</span> Neopolis, Kokapet
        </Eyebrow>
        <h1
          id="thanks-title"
          className="mt-8 max-w-[13ch] animate-rise font-serif text-hero font-light text-fg [&_em]:italic"
          style={delay(180)}
        >
          Your Next Address Is <em>Worth Exploring.</em>
        </h1>
        <div className="mt-8 max-w-[38rem] animate-rise space-y-4" style={delay(320)}>
          <Lead className="text-canvas/90">
            Thank you{m.firstName ? `, ${m.firstName},` : ""} for your interest in {project.name}.
          </Lead>
          <p className="text-body text-canvas/75">
            Your enquiry has been received. Our team will help you explore the available residences,
            configurations, floor plans and pricing.
          </p>
          <p className="font-serif text-title font-light italic text-canvas/90">
            A more considered way to discover your next home begins here.
          </p>
        </div>

        <dl
          className="mt-12 grid animate-rise gap-x-(--grid-gap) gap-y-6 border-t border-rule pt-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[auto_1fr_auto] lg:gap-x-16"
          style={delay(460)}
        >
          <div>
            <dt className="sr-only">Status</dt>
            <dd className="flex items-center gap-3 font-medium uppercase text-eyebrow text-accent">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s] [animation-iteration-count:3]" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              Enquiry successfully received
            </dd>
          </div>
          {m.preference.length > 0 && (
            <div className="flex flex-col gap-1 sm:col-span-2 sm:row-start-2 lg:col-span-1 lg:row-start-auto">
              <dt className="font-medium uppercase text-eyebrow text-muted">Your selected preference</dt>
              <dd className="font-serif text-title font-light tabular-nums">
                {m.preference.map((p, i) => (
                  <span key={p}>
                    {i > 0 && <span aria-hidden className="mx-3 text-accent">|</span>}
                    {p}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {m.reference && (
            <div className="flex flex-col gap-1 sm:items-end">
              <dt className="font-medium uppercase text-eyebrow text-muted">Reference</dt>
              <dd className="text-small tabular-nums tracking-[0.12em] text-canvas/85">{m.reference}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

/* 2 — Next action -------------------------------------------------------- */

function NextAction({ m }: { m: ThankYouModel }) {
  return (
    <section aria-labelledby="next-title" className="tone-canvas section-y">
      <div className="container-content">
        <div className="grid-12 gap-y-8" data-reveal>
          <div className="col-span-full lg:col-span-7">
            <Eyebrow rule>Your next step</Eyebrow>
            <h2 id="next-title" className="mt-6 max-w-[14ch] font-serif text-heading font-light [&_em]:italic">
              Let&apos;s Take a <em>Closer Look.</em>
            </h2>
          </div>
          <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9">
            <Lead className="text-fg">A residence of this scale deserves more than a brochure.</Lead>
            <p className="mt-4 text-body text-muted">
              Connect with the MSN team to understand the available apartment configurations,
              tower-wise inventory, indicative pricing and floor plans.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-(--grid-gap) lg:mt-20 lg:grid-cols-2">
          {/* Primary */}
          <article className="tone-deep relative flex flex-col overflow-hidden p-6 sm:p-10 lg:p-14" data-reveal>
            <span className="font-medium text-eyebrow tracking-[0.22em] uppercase text-accent tabular-nums">01 — Recommended</span>
            <h3 className="mt-8 font-serif text-subheading font-light [&_em]:italic">
              Speak with the <em>MSN Team</em>
            </h3>
            <p className="mt-5 max-w-[30rem] text-body text-muted">
              Have a conversation about your preferred residence and get your questions answered.
            </p>
            <div className="mt-auto pt-10">
              <WhatsAppCta href={m.whatsappHref} location="primary_action" leadId={m.leadId} className={mobileFit}>
                Connect with our team
              </WhatsAppCta>
              <p className="mt-4 text-caption text-muted">
                Opens WhatsApp{m.preference.length > 0 ? " with your preferences included" : ""}.
              </p>
            </div>
          </article>

          {/* Secondary */}
          <article className="tone-panel flex flex-col border border-rule p-6 sm:p-10 lg:p-14" data-reveal>
            <span className="font-medium text-eyebrow tracking-[0.22em] text-muted tabular-nums">02</span>
            <h3 className="mt-8 font-serif text-subheading font-light [&_em]:italic">
              Arrange a Private <em>Site Visit</em>
            </h3>
            <p className="mt-5 max-w-[30rem] text-body text-muted">
              Experience the location and discover the development in greater detail.
            </p>
            <div className="mt-auto pt-10">
              <a href="#site-visit" className={buttonClasses({ variant: "secondary", size: "lg", className: mobileFit })}>
                <span>Request a site visit</span>
                {arrow}
              </a>
              <p className="mt-4 text-caption text-muted">Choose a preferred date — the team confirms availability.</p>
            </div>
          </article>
        </div>

        <SiteVisit prefill={m.prefill} leadId={m.leadId} />
      </div>
    </section>
  );
}

/* 3 — Project value ------------------------------------------------------ */

const stats = [
  { value: String(project.areaAcres), unit: "", label: "Acres" },
  { value: String(project.towers), unit: "", label: "Residential towers" },
  { value: String(project.floors), unit: "", label: "Floors" },
  { value: project.clubhouseSft, unit: "SFT", label: "Clubhouse & amenities" },
];

function ProjectValue() {
  const pavilion = media.skyPavilions[1] ?? media.skyPavilions[0];
  return (
    <section aria-labelledby="value-title" className="tone-deep section-y">
      <div className="container-content">
        <div className="grid-12 gap-y-8" data-reveal>
          <div className="col-span-full lg:col-span-7">
            <Eyebrow rule>The development</Eyebrow>
            <h2 id="value-title" className="mt-6 max-w-[14ch] font-serif text-heading font-light [&_em]:italic">
              A Development <em>Worth Discovering.</em>
            </h2>
          </div>
          <Lead className="col-span-full self-end text-muted md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9">
            Explore expansive 3 and 4 BHK residences ranging from{" "}
            {project.sizeRange.min.toLocaleString("en-IN")} to {project.sizeRange.max.toLocaleString("en-IN")} SFT,
            complemented by {project.skyPavilions === 8 ? "eight" : project.skyPavilions} sky pavilions and a
            distinctive residential environment.
          </Lead>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-rule lg:mt-20 lg:grid-cols-4" data-reveal>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex flex-col py-7 lg:py-10",
                i % 2 === 1 ? "border-l border-rule pl-5 sm:pl-8" : "pr-5",
                i >= 2 ? "border-t border-rule lg:border-t-0" : "",
                i >= 1 ? "lg:border-l lg:pl-10" : "",
              ].join(" ")}
            >
              <dt className="order-2 mt-3 font-medium uppercase text-eyebrow text-muted">{s.label}</dt>
              <dd className="order-1 font-serif text-[clamp(2.75rem,1.6rem+4.2vw,5.5rem)] leading-none font-light tabular-nums">
                {s.value}
                {s.unit && (
                  <span className="mt-1 block text-title italic text-accent sm:mt-0 sm:ml-2 sm:inline">{s.unit}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {pavilion && (
          <figure className="mt-14 lg:mt-20">
            <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden bg-line-deep sm:aspect-video lg:aspect-cinema">
              <Image
                src={pavilion.src}
                alt={pavilion.alt}
                fill
                sizes="(min-width: 1440px) 1320px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex justify-between gap-6 text-caption text-muted">
              <span>{pavilion.caption}</span>
              <span>{RENDER_LABEL}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

/* 4 — Explore the details ------------------------------------------------ */

function ExploreDetails({ m }: { m: ThankYouModel }) {
  const items = [
    {
      title: "Explore Floor Plans",
      text: "Review the available 3 BHK and 4 BHK configurations.",
      cta: "View floor plans",
      href: m.floorPlansHref,
      event: "floor_plan_view" as const,
      image: media.floorPlanPreview,
      meta: "Plan preview",
    },
    {
      title: "Understand the Pricing",
      text: "Review the starting price and the 20:20:20:20:20 payment structure, then request the official tower-wise cost sheet.",
      cta: "Explore pricing",
      href: "/#pricing",
      event: "pricing_view" as const,
      image: media.interiors[0] ?? null,
      meta: RENDER_LABEL,
    },
    {
      title: "Discover the Specifications",
      text: "Understand the flooring, fittings, sanitaryware and tower-specific floor heights.",
      cta: "View specifications",
      href: "/#specifications",
      event: "specifications_view" as const,
      image: media.materials.flooring,
      meta: STOCK_LABEL,
    },
  ];

  return (
    <section aria-labelledby="details-title" className="tone-canvas section-y">
      <div className="container-content">
        <div data-reveal>
          <Eyebrow rule>Before you decide</Eyebrow>
          <h2 id="details-title" className="mt-6 max-w-[16ch] font-serif text-heading font-light [&_em]:italic">
            Before You Decide, <em>Explore the Details.</em>
          </h2>
        </div>

        <ol className="mt-14 grid gap-y-14 border-t border-strong md:grid-cols-3 md:gap-x-(--grid-gap) lg:mt-20">
          {items.map((item, i) => (
            <li key={item.title} className="pt-6 md:pt-8" data-reveal>
              <TrackedLink
                href={item.href}
                event={item.event}
                params={{ configuration: m.configuration }}
                className="group flex h-full flex-col"
              >
                <span className="font-medium text-eyebrow tracking-[0.22em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.image && (
                  <span className="relative mt-6 block aspect-[3/2] overflow-hidden bg-line">
                    <Image
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover transition-transform duration-(--duration-image) ease-luxe group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-3 left-3 bg-deep/70 px-2 py-1 text-caption text-canvas">{item.meta}</span>
                  </span>
                )}
                <h3 className="mt-7 font-serif text-title font-medium">{item.title}</h3>
                <span className="mt-3 max-w-[34ch] text-small text-muted">{item.text}</span>
                <span className="mt-auto inline-flex items-center gap-4 self-start pt-7 font-medium uppercase text-button text-strong">
                  <span className="border-b border-strong/30 pb-1.5 transition-colors duration-(--duration-base) group-hover:border-strong">
                    {item.cta}
                  </span>
                  <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover:translate-x-1" />
                </span>
              </TrackedLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 5 & 6 — Payment plan reminder and pre-launch offer -------------------- */

function PlanAndOffer({ m }: { m: ThankYouModel }) {
  const ratio = paymentPlan.label.split(":");
  return (
    <div className="tone-panel section-y">
      <div className="container-content grid gap-y-20 lg:grid-cols-2 lg:gap-x-0">
        <section aria-labelledby="plan-title" className="lg:border-r lg:border-rule lg:pr-16" data-reveal>
          <Eyebrow rule>Payment plan</Eyebrow>
          <h2 id="plan-title" className="mt-6 max-w-[15ch] font-serif text-subheading font-light [&_em]:italic">
            A Structured Approach to <em>Your Purchase.</em>
          </h2>
          <p
            className="mt-10 font-serif text-[clamp(2.4rem,1.3rem+4.4vw,4.25rem)] leading-none font-light whitespace-nowrap tabular-nums text-strong"
            aria-label={`${paymentPlan.label} payment plan`}
          >
            {ratio.map((n, i) => (
              <span key={i} aria-hidden>
                {i > 0 && <span className="mx-[0.14em] text-accent">:</span>}
                {n}
              </span>
            ))}
          </p>
          <div aria-hidden className="mt-6 flex max-w-[24rem] gap-1.5">
            {paymentPlan.stages.map((s, i) => (
              <span key={i} className="h-1.5 bg-deep" style={{ flexGrow: s.percent, opacity: 0.3 + i * 0.175 }} />
            ))}
          </div>
          <p className="mt-8 max-w-[32rem] text-body text-muted">
            The supplied payment structure is divided into five instalments of 20% each across the stated
            payment milestones. Request the official payment schedule and a detailed unit-wise cost sheet
            from the MSN team.
          </p>
          <div className="mt-10">
            <RequestButton
              type="payment_details"
              event="payment_details_request"
              leadId={m.leadId}
              phoneDisplay={m.phoneDisplay}
              whatsappHref={m.whatsappHref}
              label="Request payment details"
              doneMessage="share the official payment schedule and cost sheet with you"
            />
          </div>
        </section>

        <section
          aria-labelledby="offer-title"
          className="border-t border-rule pt-20 lg:border-t-0 lg:pt-0 lg:pl-16"
          data-reveal
        >
          <Eyebrow rule>Pre-launch</Eyebrow>
          <h2 id="offer-title" className="mt-6 max-w-[16ch] font-serif text-subheading font-light [&_em]:italic">
            Explore the Introductory <em>Booking Opportunity.</em>
          </h2>
          <div className="mt-10 flex items-end gap-5">
            <p className="font-serif text-[clamp(3.5rem,2rem+5vw,5.5rem)] leading-[0.85] font-light tabular-nums text-accent">
              {offer.bookings}
            </p>
            <p className="pb-1 font-medium uppercase text-eyebrow text-muted">
              First
              <br />
              bookings
            </p>
          </div>
          <p className="mt-8 max-w-[32rem] text-body text-muted">
            The introductory pre-launch offer is applicable exclusively to the first {offer.bookings} bookings,
            subject to official terms and remaining eligibility. Connect with the MSN team to understand the
            applicable offer and current availability.
          </p>
          <div className="mt-10">
            <RequestButton
              type="offer_eligibility"
              event="consultation_request"
              leadId={m.leadId}
              phoneDisplay={m.phoneDisplay}
              whatsappHref={m.whatsappHref}
              label="Check offer eligibility"
              doneMessage="call you about the offer and your eligibility"
              variant="secondary"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* 7 — Final invitation --------------------------------------------------- */

function FinalInvitation({ m }: { m: ThankYouModel }) {
  const image = media.architecture ?? media.hero;
  return (
    <section
      aria-labelledby="final-title"
      className="tone-overlay relative isolate overflow-hidden bg-deep py-(--section-y)"
    >
      {image && (
        <>
          <div data-reveal="image" aria-hidden className="absolute inset-0 -z-10">
            <Image src={image.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 15%" }} />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-deep/60" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-deep via-deep/30 to-deep/50" />
        </>
      )}
      <div className="container-content flex min-h-[60svh] flex-col items-start justify-end lg:min-h-[70svh] lg:items-center lg:text-center" data-reveal>
        <Eyebrow rule>{project.name}</Eyebrow>
        <h2 id="final-title" className="mt-6 max-w-[14ch] font-serif text-heading font-light [&_em]:italic">
          Your Next Chapter <em>Could Begin Here.</em>
        </h2>
        <p className="mt-8 max-w-[36rem] text-lead font-light text-canvas/85">
          Take the next step towards discovering your preferred residence at {project.name}.
        </p>
        <p className="mt-4 max-w-[36rem] text-body text-canvas/70">
          Our team can assist you with floor plans, apartment configurations, pricing and a personalised
          project consultation.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <WhatsAppCta href={m.whatsappHref} location="final_section" leadId={m.leadId} className={mobileFit}>
            Speak with the MSN team
          </WhatsAppCta>
          <a href="#site-visit" className={buttonClasses({ variant: "secondary", size: "lg", className: mobileFit })}>
            Arrange a site visit
          </a>
        </div>
      </div>
    </section>
  );
}
