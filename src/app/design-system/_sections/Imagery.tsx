import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Figure, type FigureRatio } from "@/components/ui/Figure";
import { ButtonLink } from "@/components/ui/Button";
import { Caption, Eyebrow, Subheading, Text, Title } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { ArrowRight } from "@/components/ui/Icons";
import { images } from "@/lib/images";

const ratios: Array<{ ratio: FigureRatio; label: string; use: string; className: string }> = [
  { ratio: "cinema", label: "21:9", use: "Full-bleed panoramas", className: "aspect-cinema" },
  { ratio: "video", label: "16:9", use: "Wide editorial", className: "aspect-video" },
  { ratio: "landscape", label: "3:2", use: "Standard photography", className: "aspect-landscape" },
  { ratio: "portrait", label: "4:5", use: "Beside text", className: "aspect-portrait" },
  { ratio: "tall", label: "3:4", use: "Towers, façades", className: "aspect-tall" },
];

const tiles = [
  { title: "The Residences", href: "#data", image: images.livingDouble, meta: "01" },
  { title: "Architecture", href: "#layout", image: images.angularWhite, meta: "02" },
  { title: "Amenities", href: "#imagery", image: images.poolVilla, meta: "03" },
];

export function ImagerySection() {
  return (
    <Section id="imagery" aria-labelledby="imagery-title" width="full">
      <div className="container-content">
        <SectionHeader
          id="imagery-title"
          index="06"
          eyebrow="Image treatments"
          title={
            <>
              Photography <em>as architecture.</em>
            </>
          }
          intro="Images are cropped with intent, never boxed, rounded or shadowed. They settle gently into place as they enter the viewport and zoom almost imperceptibly on hover when they link somewhere."
        />

        <Divider variant="label" label="Aspect ratios" className="mt-20 lg:mt-28" />
        <ul className="mt-8 grid grid-cols-2 items-end gap-(--grid-gap) md:grid-cols-5">
          {ratios.map((r) => (
            <li key={r.ratio} data-reveal>
              <div className={`${r.className} border border-rule bg-line`} />
              <p className="mt-3 font-medium text-eyebrow uppercase">{r.label}</p>
              <p className="text-caption text-muted">{r.use}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Full-bleed */}
      <div className="mt-24 lg:mt-32">
        <div className="container-content">
          <Divider variant="label" label="Full-bleed cinematic" />
        </div>
        <Figure
          src={images.glassStair.src}
          alt={images.glassStair.alt}
          ratio="cinema"
          sizes="100vw"
          className="mt-10"
          frameClassName="max-md:aspect-portrait"
        />
        <div className="container-content">
          <Caption className="mt-4 flex justify-between">
            <span>Edge to edge, 21:9 on desktop, 4:5 on phones. Caption sits on the content grid.</span>
            <span className="hidden md:inline">Fig. 01</span>
          </Caption>
        </div>
      </div>

      <div className="container-content">
        {/* Overlay */}
        <Divider variant="label" label="Text over image" className="mt-24 lg:mt-32" />
        <Figure
          src={images.poolVilla.src}
          alt={images.poolVilla.alt}
          ratio="video"
          sizes="(min-width: 1440px) 1320px, 100vw"
          scrim
          className="mt-10"
          frameClassName="max-md:aspect-portrait"
          overlay={
            <div className="flex h-full flex-col justify-end p-6 md:p-12 lg:p-16">
              <Eyebrow rule>Amenities</Eyebrow>
              <Subheading as="h3" className="mt-5 max-w-[18ch]">
                A forty-metre pool, <em>open to the sky.</em>
              </Subheading>
              <ButtonLink href="#data" variant="text" arrow className="mt-6 self-start">
                Discover the clubhouse
              </ButtonLink>
            </div>
          }
        />
        <Caption className="mt-4">
          Use a bottom scrim (deep forest 70% → 0) only where text overlays photography.
        </Caption>

        {/* Hover tiles */}
        <Divider variant="label" label="Linked images · hover to zoom" className="mt-24 lg:mt-32" />
        <ul className="mt-10 grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 md:grid-cols-3">
          {tiles.map((tile, i) => (
            <li key={tile.title} className={i === 1 ? "md:mt-20" : undefined}>
              <Link href={tile.href} className="group block">
                <Figure
                  src={tile.image.src}
                  alt={tile.image.alt}
                  ratio="portrait"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  zoom
                />
                <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-rule pb-4">
                  <Title as="h3">
                    <span className="mr-4 font-sans text-eyebrow text-muted tabular-nums">{tile.meta}</span>
                    {tile.title}
                  </Title>
                  <ArrowRight className="shrink-0 text-muted transition-transform duration-(--duration-base) ease-luxe group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Text className="mt-10 max-w-prose text-small">
          Photography shown is placeholder imagery for design review. Replace with approved MSN
          renders and photography, graded slightly cool and low in contrast to sit on sage stone.
        </Text>
      </div>
    </Section>
  );
}
