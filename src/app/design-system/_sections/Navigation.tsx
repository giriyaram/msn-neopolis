import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Header } from "@/components/layout/Header";
import { primaryNav } from "@/components/layout/navigation";
import { Caption, Text, Title } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { images } from "@/lib/images";

const behaviours = [
  {
    name: "Over imagery",
    body: "Transparent, with light type, while the hero image is in view. A soft top scrim keeps it legible on any photograph.",
  },
  {
    name: "On scroll",
    body: "After 24px the bar turns solid sage stone, gains a hairline and reduces from 88px to 72px.",
  },
  {
    name: "Below 1024px",
    body: "Links move into a full-screen menu — a native modal dialog with focus trapping, Escape to close, and focus returned to the trigger.",
  },
  {
    name: "Anchors",
    body: "In-page links scroll smoothly and land below the fixed header (scroll-padding-top).",
  },
];

export function NavigationSection() {
  return (
    <Section id="navigation" aria-labelledby="navigation-title" tone="panel">
      <SectionHeader
        id="navigation-title"
        index="05"
        eyebrow="Navigation"
        title={
          <>
            Present, <em>never insistent.</em>
          </>
        }
        intro="One header in two states. It disappears into the photography at the top of a page and becomes a quiet sage bar as soon as the visitor begins to read."
      />

      <div className="mt-20 space-y-16 lg:mt-28">
        <figure data-reveal>
          <div className="relative overflow-hidden border border-rule">
            <Image src={images.twilight.src} alt="" fill sizes="(min-width: 1440px) 1320px, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-b from-deep/60 to-deep/10" />
            <Header fixed={false} variant="overlay" links={primaryNav} />
            <div className="h-40 md:h-56" />
          </div>
          <Caption as="figcaption" className="mt-4">Overlay state — over a hero image.</Caption>
        </figure>

        <figure data-reveal>
          <div className="border border-rule">
            <Header fixed={false} variant="solid" links={primaryNav} />
            <div className="h-24 bg-canvas" />
          </div>
          <Caption as="figcaption" className="mt-4">Solid state — after scrolling, or on pages without a hero.</Caption>
        </figure>

        <div className="grid-12 gap-y-12">
          <figure className="col-span-full md:col-span-4 lg:col-span-4" data-reveal>
            <div className="mx-auto max-w-[24rem] overflow-hidden border border-rule">
              <Header fixed={false} variant="solid" links={primaryNav} />
              <div className="h-40 bg-canvas" />
            </div>
            <Caption as="figcaption" className="mt-4 text-center">
              Phone width — tap <strong className="font-medium text-fg">Menu</strong> to open the live menu.
            </Caption>
          </figure>

          <div className="col-span-full md:col-span-4 md:col-start-5 lg:col-span-6 lg:col-start-7" data-reveal>
            <Divider variant="label" label="Behaviour" />
            <dl className="mt-2">
              {behaviours.map((b) => (
                <div key={b.name} className="border-b border-rule py-5">
                  <dt><Title as="span" className="text-lead">{b.name}</Title></dt>
                  <dd><Text className="mt-2 text-small">{b.body}</Text></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
