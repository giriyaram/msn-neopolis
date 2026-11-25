import Image from "next/image";
import { media, RENDER_LABEL, STOCK_LABEL, type StockAsset } from "@/content/media";
import { project, specifications, towerGroups } from "@/content/project";
import { Section } from "@/components/layout/Section";
import { Figure, type FigureRatio } from "@/components/ui/Figure";
import { Eyebrow, Heading, Lead, Text } from "@/components/ui/Typography";
import { EnquiryLink } from "../EnquiryLink";

/* ---------------------------------------------------------------------- */
/* 06 — Architecture                                                        */
/* ---------------------------------------------------------------------- */

const figures = [
  { value: String(project.towers), label: "Towers" },
  { value: String(project.floors), label: "Floors" },
  { value: String(project.skyPavilions), label: "Sky pavilions" },
];

export function ArchitectureSection() {
  const render = media.architecture;
  return (
    <section id="architecture" aria-labelledby="architecture-title" className="tone-deep">
      {render && (
        <div data-reveal="image" className="relative aspect-portrait overflow-hidden md:aspect-cinema">
          <Image
            src={render.src}
            alt={render.alt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: render.position }}
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-deep to-transparent" />
          <p className="absolute right-(--gutter) bottom-4 text-caption text-muted">{RENDER_LABEL}</p>
        </div>
      )}
      <div className="container-content section-y">
        <div className="grid-12 gap-y-10">
          <div className="col-span-full lg:col-span-7" data-reveal>
            <Eyebrow index="04" rule>
              Architecture
            </Eyebrow>
            <Heading id="architecture-title" className="mt-6 max-w-[13ch]">
              Designed to Rise <em>Above the Ordinary.</em>
            </Heading>
          </div>
          <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9" data-reveal>
            <Lead>Three towers. Fifty-six floors. Eight sky pavilions.</Lead>
            <Text className="mt-5">
              An architectural presence that defines the development&apos;s skyline and introduces
              elevated spaces within the residential experience.
            </Text>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-3 border-t border-rule lg:mt-28">
          {figures.map((f, i) => (
            <div
              key={f.label}
              data-reveal
              className={`flex flex-col pt-8 ${i > 0 ? "border-l border-rule pl-4 sm:pl-8" : "pr-4"}`}
            >
              <dt className="order-2 mt-4 font-medium uppercase text-eyebrow text-muted">{f.label}</dt>
              <dd className="order-1 font-serif text-[clamp(4rem,2rem+10vw,11rem)] leading-none font-light tabular-nums">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 07 — Sky pavilions                                                       */
/* ---------------------------------------------------------------------- */

export function SkyPavilionsSection() {
  const renders = media.skyPavilions;
  return (
    <Section id="sky-pavilions" aria-labelledby="pavilions-title">
      <div className="grid-12 gap-y-12">
        <div className="col-span-full lg:col-span-5" data-reveal>
          <p aria-hidden className="font-serif text-[clamp(7rem,4rem+14vw,16rem)] leading-[0.8] font-light italic text-accent">
            08
          </p>
        </div>
        <div className="col-span-full self-end lg:col-span-6 lg:col-start-7" data-reveal>
          <Eyebrow index="05" rule>
            Sky pavilions
          </Eyebrow>
          <Heading id="pavilions-title" className="mt-6 max-w-[14ch]">
            Eight Sky Pavilions. <em>A Different Perspective.</em>
          </Heading>
          <Lead className="mt-8 text-muted">
            Discover eight sky pavilions integrated into the development, bringing elevated spaces
            into the residential environment.
          </Lead>
          <EnquiryLink intent="general" variant="text" className="mt-8">
            Ask about the sky pavilions
          </EnquiryLink>
        </div>
      </div>

      {renders.length > 0 && (
        <div className="mt-20 grid-12 gap-y-12 lg:mt-28">
          {renders.map((r, i) => (
            <Figure
              key={r.src}
              src={r.src}
              alt={r.alt}
              ratio={i === 0 ? "landscape" : "portrait"}
              sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 38vw, (min-width: 768px) 60vw, 100vw"}
              caption={r.caption}
              meta={RENDER_LABEL}
              zoom
              position={i === 0 ? undefined : "70% 50%"}
              className={
                i === 0
                  ? "col-span-full lg:col-span-7"
                  : "col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:mt-32"
              }
            />
          ))}
        </div>
      )}
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* 08 — Clubhouse & amenities                                               */
/* ---------------------------------------------------------------------- */

/** Editorial rhythm for the gallery: wide, small, tall, wide — repeating.
 *  The small slot suits lower-resolution renders. */
const amenityLayout: Array<{ className: string; ratio: FigureRatio; sizes: string }> = [
  {
    className: "col-span-full lg:col-span-8",
    ratio: "landscape",
    sizes: "(min-width: 1024px) 66vw, 100vw",
  },
  {
    className: "col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:self-end",
    ratio: "landscape",
    sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 60vw, 100vw",
  },
  {
    className: "col-span-full md:col-span-4 lg:col-span-5 lg:col-start-1",
    ratio: "portrait",
    sizes: "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    className: "col-span-full md:col-span-4 lg:col-span-6 lg:col-start-7 md:self-end",
    ratio: "landscape",
    sizes: "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw",
  },
];

export function AmenitiesSection() {
  const renders = media.amenities;
  return (
    <Section id="amenities" tone="panel" aria-labelledby="amenities-title">
      <div className="grid-12 gap-y-12">
        <div className="col-span-full lg:col-span-6" data-reveal>
          <Eyebrow index="06" rule>
            Clubhouse &amp; amenities
          </Eyebrow>
          <Heading id="amenities-title" className="mt-6 max-w-[12ch]">
            A World of <em>Experiences Within.</em>
          </Heading>
          <Lead className="mt-8 text-muted">
            With approximately {project.clubhouseSft} SFT dedicated to the clubhouse and amenities,
            the development introduces an extensive lifestyle offering within its residential
            environment.
          </Lead>
          <EnquiryLink intent="general" variant="secondary" className="mt-10">
            Request amenity details
          </EnquiryLink>
        </div>
        <div className="col-span-full self-end lg:col-span-5 lg:col-start-8" data-reveal>
          <p className="border-t border-rule pt-6 font-serif text-[clamp(3.5rem,1.5rem+7vw,8rem)] leading-none font-light tabular-nums">
            {project.clubhouseSft}
          </p>
          <p className="mt-4 font-medium uppercase text-eyebrow text-muted">
            SFT · clubhouse &amp; amenities (approx.)
          </p>
        </div>
      </div>

      {renders.length > 0 && (
        <ul className="mt-20 grid-12 gap-y-12 lg:mt-28">
          {renders.map((r, i) => {
            const layout = amenityLayout[i % amenityLayout.length];
            return (
              <li key={r.src} className={layout.className}>
                <Figure
                  src={r.src}
                  alt={r.alt}
                  ratio={layout.ratio}
                  sizes={layout.sizes}
                  caption={r.caption}
                  meta={RENDER_LABEL}
                  zoom
                />
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}

/* ---------------------------------------------------------------------- */
/* 09 — Specifications                                                      */
/* ---------------------------------------------------------------------- */

export function SpecificationsSection() {
  const [a, bc] = towerGroups;
  const max = Math.max(a.floorToFloorFt, bc.floorToFloorFt);
  const diffFt = Math.round((a.floorToFloorFt - bc.floorToFloorFt) * 10) / 10;
  const diffCm = Math.round(diffFt * 30.48);
  const { flooring, bath } = media.materials;

  return (
    <Section id="specifications" aria-labelledby="specs-title">
      <div className="grid-12 gap-y-16">
        <div className="col-span-full lg:col-span-6" data-reveal>
          <Eyebrow index="07" rule>
            Specifications
          </Eyebrow>
          <Heading id="specs-title" className="mt-6 max-w-[13ch]">
            Thoughtful Specifications. <em>Refined Living.</em>
          </Heading>

          <dl className="mt-14 border-t border-rule">
            {specifications.map((s) => (
              <div key={s.title} className="grid grid-cols-[9rem_1fr] items-baseline gap-6 border-b border-rule py-6 sm:grid-cols-[12rem_1fr]">
                <dt className="font-medium uppercase text-eyebrow text-muted">{s.title}</dt>
                <dd className="font-serif text-title">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="col-span-full lg:col-span-5 lg:col-start-8" data-reveal>
          <p className="font-medium uppercase text-eyebrow text-muted">Floor-to-floor height</p>
          <div className="mt-8 flex h-72 items-end gap-(--grid-gap) border-b border-strong sm:h-80" aria-hidden>
            {[a, bc].map((g) => (
              <div key={g.id} className="flex flex-1 flex-col items-stretch">
                <span className="mb-3 font-serif text-subheading tabular-nums">{g.floorToFloorFt} ft</span>
                <div
                  className={g.id === "A" ? "bg-deep" : "border border-b-0 border-strong/50 bg-strong/10"}
                  style={{ height: `${(g.floorToFloorFt / max) * 13}rem` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-(--grid-gap)" aria-hidden>
            {[a, bc].map((g) => (
              <p key={g.id} className="font-serif text-title">{g.label}</p>
            ))}
          </div>
          <figcaption className="mt-6 max-w-measure text-small text-muted">
            Tower A offers {a.floorToFloorFt} ft floor-to-floor height — {diffFt} ft (about {diffCm} cm)
            more than Towers B and C at {bc.floorToFloorFt} ft. Floor-to-floor height is measured
            from one floor slab to the next.
          </figcaption>
        </figure>
      </div>

      {(bath || flooring) && (
        <div className="mt-20 grid-12 gap-y-12 lg:mt-28">
          {bath && (
            <Figure
              src={bath.src}
              alt={bath.alt}
              ratio="portrait"
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              caption={<StockCaption asset={bath} />}
              meta={STOCK_LABEL}
              className="col-span-full md:col-span-4 lg:col-span-5"
            />
          )}
          {flooring && (
            <figure className="col-span-full md:col-span-4 md:self-end lg:col-span-6 lg:col-start-7">
              <div data-reveal="image" className="relative aspect-landscape overflow-hidden bg-line">
                <Image
                  src={flooring.src}
                  alt={flooring.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                  <p className="font-medium uppercase text-eyebrow text-ink-muted">
                    {specifications[0].title}
                  </p>
                  <p className="mt-2 font-serif text-subheading font-light text-ink italic">
                    {specifications[0].value}
                  </p>
                </div>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-6 text-caption text-muted">
                <StockCaption asset={flooring} />
                <span className="shrink-0">{STOCK_LABEL}</span>
              </figcaption>
            </figure>
          )}
        </div>
      )}
    </Section>
  );
}

function StockCaption({ asset }: { asset: StockAsset }) {
  return (
    <span>
      {asset.caption} <span className="opacity-70">· Photo: {asset.credit}</span>
    </span>
  );
}
