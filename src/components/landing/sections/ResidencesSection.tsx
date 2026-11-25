import { media, RENDER_LABEL } from "@/content/media";
import { Section } from "@/components/layout/Section";
import { Figure } from "@/components/ui/Figure";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { ResidenceExplorer } from "../ResidenceExplorer";
import { FloorPlanViewer } from "../FloorPlanViewer";

export function ResidencesSection() {
  const [living, bedroom] = media.interiors;
  return (
    <Section id="residences" tone="panel" aria-labelledby="residences-title">
      <div className="grid-12 gap-y-10">
        <div className="col-span-full lg:col-span-7" data-reveal>
          <Eyebrow index="02" rule>
            Residences
          </Eyebrow>
          <Heading id="residences-title" className="mt-6 max-w-[14ch]">
            Space That Reflects <em>Your Way of Living.</em>
          </Heading>
        </div>
        <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9" data-reveal>
          <Lead className="text-muted">
            Discover generously proportioned 3 and 4 BHK residences, with apartment sizes ranging
            from 2,424 to 4,545 SFT.
          </Lead>
        </div>
      </div>
      {living && (
        <div className="mt-16 grid-12 gap-y-10 lg:mt-24">
          <Figure
            src={living.src}
            alt={living.alt}
            ratio="landscape"
            sizes="(min-width: 1024px) 60vw, 100vw"
            caption={living.caption}
            meta={RENDER_LABEL}
            className="col-span-full lg:col-span-7"
          />
          {bedroom && (
            <Figure
              src={bedroom.src}
              alt={bedroom.alt}
              ratio="portrait"
              position="40% 50%"
              sizes="(min-width: 1024px) 35vw, (min-width: 768px) 60vw, 100vw"
              caption={bedroom.caption}
              meta={RENDER_LABEL}
              className="col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9 lg:mt-40"
            />
          )}
        </div>
      )}

      <div className="mt-20 lg:mt-32">
        <ResidenceExplorer />
      </div>
    </Section>
  );
}

export function FloorPlansSection() {
  return (
    <Section id="floor-plans" aria-labelledby="floor-plans-title">
      <div className="grid-12 gap-y-10">
        <div className="col-span-full lg:col-span-7" data-reveal>
          <Eyebrow index="03" rule>
            Floor plans
          </Eyebrow>
          <Heading id="floor-plans-title" className="mt-6 max-w-[14ch]">
            Find the Space That <em>Fits Your Vision.</em>
          </Heading>
        </div>
        <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9" data-reveal>
          <Lead className="text-muted">
            Choose a configuration, size and tower to request the official plan — shared with
            tower-wise availability and the cost sheet.
          </Lead>
        </div>
      </div>
      <div className="mt-16 lg:mt-24">
        <FloorPlanViewer />
      </div>
    </Section>
  );
}
