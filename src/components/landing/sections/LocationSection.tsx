import Image from "next/image";
import { media, STOCK_LABEL } from "@/content/media";
import { locations } from "@/content/project";
import { Figure } from "@/components/ui/Figure";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { EnquiryLink } from "../EnquiryLink";

const origin = locations[0].query;

function directionsUrl(destination: string) {
  const params = new URLSearchParams({ api: "1", origin, destination });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/*
 * Schematic positions derived from approximate coordinates (north up).
 * Relative placement only — not to scale, and no distances are implied.
 */
const points: Record<string, { x: number; y: number; anchor?: "start" | "end"; dy?: number }> = {
  site: { x: 92, y: 158 },
  fd: { x: 112, y: 124, anchor: "start" },
  gachibowli: { x: 122, y: 88, anchor: "start" },
  hitec: { x: 162, y: 62, anchor: "start" },
  airport: { x: 214, y: 318, anchor: "end", dy: 22 },
};

const locationLead = (
  <>
    Located in Neopolis, Kokapet, the development occupies a location within
    Hyderabad&apos;s western growth corridor.
  </>
);

function LocationHeading({ className }: { className?: string }) {
  return (
    <>
      <Eyebrow index="08" rule>
        Location
      </Eyebrow>
      <Heading id="location-title" className={className}>
        An Address in Hyderabad&apos;s <em>Evolving Luxury Corridor.</em>
      </Heading>
    </>
  );
}

export function LocationSection() {
  const { band, district } = media.location;

  return (
    <section id="location" aria-labelledby="location-title" className="tone-panel">
      {band && (
        <div className="tone-overlay relative isolate flex min-h-[88svh] overflow-hidden bg-deep md:min-h-[80svh]">
          {/* Phones: the photo sits in the lower part so the text reads on dark sky. */}
          <div data-reveal="image" className="absolute inset-x-0 top-[32%] bottom-0 -z-10 overflow-hidden md:top-0">
            <Image
              src={band.src}
              alt={band.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: band.position }}
            />
            <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-deep to-transparent" />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-deep/70 via-transparent to-deep/50" />
          <div className="container-content section-y-sm grid-12 w-full content-start gap-y-8" data-reveal>
            <div className="col-span-full lg:col-span-7">
              <LocationHeading className="mt-6 max-w-[14ch] lg:max-w-[19ch]" />
            </div>
            <div className="col-span-full self-end md:col-span-6 lg:col-span-4 lg:col-start-9">
              <Lead className="text-muted">{locationLead}</Lead>
            </div>
          </div>
          <p className="absolute right-(--gutter) bottom-4 left-(--gutter) text-right text-caption text-muted">
            {band.caption} · Photo: {band.credit}
          </p>
        </div>
      )}

      <div className="container-content section-y">
        <div className="grid-12 gap-y-14">
          <div className="col-span-full lg:col-span-6" data-reveal>
            {!band && (
              <>
                <LocationHeading className="mt-6 max-w-[14ch]" />
                <Lead className="mt-8 text-muted">{locationLead}</Lead>
              </>
            )}

            <ul className={band ? "border-t border-rule" : "mt-12 border-t border-rule"}>
              {locations.map((place, i) => (
                <li key={place.id} className="flex items-center justify-between gap-6 border-b border-rule py-4">
                  <span className="flex items-baseline gap-4">
                    <span className="w-5 text-caption text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={i === 0 ? "font-serif text-title" : "text-body"}>{place.name}</span>
                  </span>
                  {i === 0 ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`}
                      target="_blank"
                      rel="noopener"
                      className="shrink-0 text-caption text-muted underline-offset-4 hover:text-fg hover:underline"
                    >
                      Open map<span className="sr-only"> of {place.name} (opens Google Maps)</span>
                    </a>
                  ) : (
                    <a
                      href={directionsUrl(place.query)}
                      target="_blank"
                      rel="noopener"
                      className="shrink-0 text-caption text-muted underline-offset-4 hover:text-fg hover:underline"
                    >
                      Live journey time
                      <span className="sr-only"> from Neopolis to {place.name} (opens Google Maps)</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption text-muted">
              Journey times vary with traffic — the links open live directions from Neopolis, Kokapet.
            </p>
          </div>

          <figure className="col-span-full lg:col-span-5 lg:col-start-8" data-reveal>
            <div className="border border-rule bg-canvas p-4 sm:p-6">
              <svg viewBox="0 0 320 360" role="img" aria-labelledby="map-title map-desc" className="h-auto w-full">
                <title id="map-title">Schematic location map</title>
                <desc id="map-desc">
                  Neopolis, Kokapet lies on the western side of Hyderabad near the Outer Ring Road,
                  south-west of the Financial District, Gachibowli and HITEC City. The Outer Ring
                  Road continues south to Rajiv Gandhi International Airport.
                </desc>
                {/* Compass */}
                <g className="text-muted" fill="currentColor" fontSize="9" fontFamily="var(--font-sans)">
                  <path d="M28 22 l4 10 h-8 z" />
                  <text x="28" y="46" textAnchor="middle" letterSpacing="1">N</text>
                </g>
                {/* Outer Ring Road — schematic arc */}
                <circle cx="232" cy="176" r="146" fill="none" stroke="var(--color-line-strong)" strokeWidth="6" />
                <circle cx="232" cy="176" r="146" fill="none" stroke="var(--color-canvas)" strokeWidth="1.5" strokeDasharray="6 6" />
                <text x="22" y="236" fontSize="9" fill="var(--color-ink-muted)" fontFamily="var(--font-sans)" letterSpacing="1.5" transform="rotate(-62 22 236)">
                  OUTER RING ROAD
                </text>

                {/* Places */}
                {(["fd", "gachibowli", "hitec", "airport"] as const).map((id) => {
                  const p = points[id];
                  const place = locations.find((l) => l.id === id)!;
                  return (
                    <g key={id} fontFamily="var(--font-sans)">
                      <circle cx={p.x} cy={p.y} r="4" fill="var(--color-ink)" />
                      <text
                        x={p.x + (p.anchor === "end" ? -10 : 10)}
                        y={p.y + (p.dy ?? 4)}
                        textAnchor={p.anchor ?? "start"}
                        fontSize="11"
                        fill="var(--color-ink)"
                      >
                        {place.name.replace("Rajiv Gandhi International Airport", "RGI Airport")}
                      </text>
                    </g>
                  );
                })}

                {/* Site */}
                <g fontFamily="var(--font-sans)">
                  <circle cx={points.site.x} cy={points.site.y} r="14" fill="var(--color-accent)" opacity="0.25" />
                  <circle cx={points.site.x} cy={points.site.y} r="6" fill="var(--color-deep)" />
                  <text x={points.site.x + 12} y={points.site.y + 26} fontSize="12" fontWeight="500" fill="var(--color-ink)">
                    MSN Neopolis
                  </text>
                  <text x={points.site.x + 12} y={points.site.y + 40} fontSize="10" fill="var(--color-ink-muted)">
                    Neopolis, Kokapet
                  </text>
                </g>
              </svg>
            </div>
            <figcaption className="mt-3 text-caption text-muted">
              Schematic — relative positions only, not to scale.
            </figcaption>
          </figure>
        </div>

        {district && (
          <div className="mt-20 grid-12 gap-y-10 lg:mt-28">
            <Figure
              src={district.src}
              alt={district.alt}
              ratio="portrait"
              position="50% 40%"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              caption={
                <>
                  {district.caption} <span className="opacity-70">· Photo: {district.credit}</span>
                </>
              }
              meta={STOCK_LABEL}
              className="col-span-full md:col-span-4 lg:col-span-4"
            />
            <div className="col-span-full self-center md:col-span-4 md:col-start-5 lg:col-span-5 lg:col-start-7" data-reveal>
              <p className="font-medium uppercase text-eyebrow text-muted">The western corridor</p>
              <p className="mt-6 font-serif text-subheading font-light">
                Close to the business districts of <em>HITEC City, Gachibowli</em> and the{" "}
                <em>Financial District</em> — and connected by the Outer Ring Road.
              </p>
              <EnquiryLink intent="general" variant="secondary" className="mt-10">
                Arrange a site visit
              </EnquiryLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
