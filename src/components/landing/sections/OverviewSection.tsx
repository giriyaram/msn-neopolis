import { media, RENDER_LABEL } from "@/content/media";
import { project } from "@/content/project";
import { Section } from "@/components/layout/Section";
import { Figure } from "@/components/ui/Figure";
import { StatGrid } from "@/components/ui/Stat";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";

const stats = [
  { value: String(project.areaAcres), unit: "acres", label: "Development area" },
  { value: String(project.towers), label: "Residential towers" },
  { value: String(project.floors), label: "Floors per tower" },
  { value: String(project.skyPavilions), label: "Sky pavilions" },
  { value: project.clubhouseSft, unit: "SFT", label: "Clubhouse & amenities" },
  {
    value: `${project.sizeRange.min.toLocaleString("en-IN")}–${project.sizeRange.max.toLocaleString("en-IN")}`,
    unit: "SFT",
    label: "3 & 4 BHK residences",
  },
];

export function OverviewSection() {
  const image = media.overview;

  return (
    <Section id="overview" aria-labelledby="overview-title">
      <div className="grid-12 gap-y-10">
        <div className="col-span-full lg:col-span-7" data-reveal>
          <Eyebrow index="01" rule>
            Overview
          </Eyebrow>
          <Heading id="overview-title" className="mt-6 max-w-[15ch]">
            Seven Acres. Three Towers. <em>A New Perspective on Luxury.</em>
          </Heading>
        </div>
        <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9" data-reveal>
          <Lead className="text-muted">
            A landmark residential development in Neopolis, Kokapet, bringing together expansive
            residences, contemporary architecture and an extensive lifestyle offering.
          </Lead>
        </div>
      </div>

      {image ? (
        <div className="mt-20 grid-12 gap-y-16 lg:mt-28">
          <Figure
            src={image.src}
            alt={image.alt}
            ratio="portrait"
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={image.caption}
            meta={RENDER_LABEL}
            className="col-span-full md:col-span-6 lg:col-span-6"
            frameClassName="lg:aspect-[5/6]"
          />
          <div className="col-span-full self-end md:col-span-8 lg:col-span-5 lg:col-start-8" data-reveal>
            {/* Narrower column beside the image: step the figures down a size. */}
            <StatGrid
              items={stats}
              columns={2}
              className="md:grid-cols-3 lg:grid-cols-2 lg:gap-y-10 lg:[&_dd]:text-subheading"
            />
          </div>
        </div>
      ) : (
        <div data-reveal>
          <StatGrid items={stats} columns={3} className="mt-20 lg:mt-28" />
        </div>
      )}
    </Section>
  );
}
