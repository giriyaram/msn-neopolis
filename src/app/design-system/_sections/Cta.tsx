import { Section, SectionHeader } from "@/components/layout/Section";
import { Figure } from "@/components/ui/Figure";
import { ButtonLink } from "@/components/ui/Button";
import { Caption, Eyebrow, Heading, Lead, Subheading, Text } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { images } from "@/lib/images";

export function CtaSection() {
  return (
    <>
      <Section id="cta" aria-labelledby="cta-title">
        <SectionHeader
          id="cta-title"
          index="09"
          eyebrow="Dividers & calls to action"
          title={
            <>
              Pauses, <em>and invitations.</em>
            </>
          }
          intro="Hairlines separate without boxing content in. Calls to action are few, specific and placed where a decision is natural — never on every screen."
        />

        <div className="mt-20 grid-12 gap-y-14 lg:mt-28">
          <div className="col-span-full space-y-14 lg:col-span-6" data-reveal>
            <div>
              <Caption>Hairline — separates rows and groups</Caption>
              <Divider className="mt-4" />
            </div>
            <div>
              <Caption>Labelled — introduces a group</Caption>
              <Divider variant="label" label="Specifications" className="mt-4" />
            </div>
            <div>
              <Caption>Accent — opens a composition</Caption>
              <Divider variant="accent" className="mt-4" />
            </div>
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-8" data-reveal>
            <Caption>Inline call to action</Caption>
            <div className="mt-4 flex flex-col gap-8 border-y border-rule py-10 md:flex-row md:items-end md:justify-between">
              <Subheading as="p" className="max-w-[14ch]">
                Visit the <em>sales gallery.</em>
              </Subheading>
              <ButtonLink href="#forms" variant="secondary" arrow>
                Book a visit
              </ButtonLink>
            </div>
            <Text className="mt-6 text-small">
              On phones and tablets a quiet bar with <strong className="font-medium text-fg">Call</strong> and{" "}
              <strong className="font-medium text-fg">Enquire</strong> slides up once the visitor passes the hero.
            </Text>
          </div>
        </div>
      </Section>

      {/* Full CTA band */}
      <section aria-labelledby="cta-band-title" className="tone-deep">
        <div className="grid lg:grid-cols-2">
          <Figure
            src={images.livingDouble.src}
            alt={images.livingDouble.alt}
            ratio="landscape"
            sizes="(min-width: 1024px) 50vw, 100vw"
            frameClassName="h-full lg:aspect-auto lg:min-h-[36rem]"
          />
          <div className="flex flex-col justify-center px-(--gutter) py-(--section-y-sm) lg:px-[max(var(--gutter),6vw)]" data-reveal>
            <Eyebrow rule className="text-accent!">
              By appointment
            </Eyebrow>
            <Heading id="cta-band-title" className="mt-6 max-w-[12ch]">
              See the light <em>for yourself.</em>
            </Heading>
            <Lead className="mt-8 max-w-measure text-muted">
              Private tours of the sales gallery and show residence, seven days a week.
            </Lead>
            <div className="mt-12 flex flex-wrap gap-4">
              <ButtonLink href="#forms" arrow>
                Arrange a viewing
              </ButtonLink>
              <ButtonLink href="#forms" variant="secondary">
                Download brochure
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
