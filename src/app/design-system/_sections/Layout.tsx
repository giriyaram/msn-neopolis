import { Section, SectionHeader } from "@/components/layout/Section";
import { GridOverlay } from "@/components/layout/GridOverlay";
import { Figure } from "@/components/ui/Figure";
import { Caption, Eyebrow, Lead, Subheading, Text } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { images } from "@/lib/images";
import { layoutTokens, spacing } from "@/lib/tokens";
import { cn } from "@/lib/cn";

export function LayoutSection() {
  return (
    <Section id="layout" aria-labelledby="layout-title">
      <SectionHeader
        id="layout-title"
        index="04"
        eyebrow="Spacing & layout"
        title={
          <>
            Space is the <em>first material.</em>
          </>
        }
        intro="A 12-column grid inside a 1320px frame, with fluid margins and a spacing scale built on 4px steps. Compositions are deliberately asymmetric: text and image rarely share a centre line."
      />

      {/* Grid */}
      <div className="mt-20 lg:mt-28" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Divider variant="label" label="Grid · 4 / 8 / 12 columns" className="min-w-[16rem] flex-1" />
          <GridOverlay />
        </div>
        <div className="mt-8 grid-12">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex h-40 items-end justify-center border border-accent/40 bg-accent/10 pb-3 text-caption text-muted tabular-nums lg:h-56",
                i >= 4 && "hidden md:flex",
                i >= 8 && "md:hidden lg:flex",
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <Caption className="mt-4">
          Column gap 16 → 28px. Press <kbd className="font-mono">Shift + G</kbd> anywhere to overlay the grid.
        </Caption>
      </div>

      {/* Spacing + tokens */}
      <div className="mt-24 grid-12 gap-y-16 lg:mt-32">
        <div className="col-span-full lg:col-span-6" data-reveal>
          <Divider variant="label" label="Spacing scale" />
          <ul className="mt-6 space-y-4">
            {spacing.map((s) => (
              <li key={s.token} className="grid grid-cols-[3.5rem_1fr] items-center gap-4 md:grid-cols-[3.5rem_11rem_1fr]">
                <span className="font-mono text-caption text-muted">{s.px}px</span>
                <span className="hidden text-caption text-muted md:block">{s.use}</span>
                <span className="block h-3 bg-deep" style={{ width: `min(${s.px}px, 100%)` }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full lg:col-span-5 lg:col-start-8" data-reveal>
          <Divider variant="label" label="Layout tokens" />
          <table className="mt-4 w-full text-left text-small">
            <caption className="sr-only">Layout tokens</caption>
            <thead className="sr-only">
              <tr><th>Token</th><th>Value</th><th>Use</th></tr>
            </thead>
            <tbody>
              {layoutTokens.map((t) => (
                <tr key={t.token} className="border-b border-rule align-top">
                  <td className="py-3.5 pr-4 font-mono text-caption">{t.token}</td>
                  <td className="py-3.5 pr-4 whitespace-nowrap text-muted tabular-nums">{t.value}</td>
                  <td className="hidden py-3.5 text-muted sm:table-cell">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compositions */}
      <div className="mt-24 lg:mt-32">
        <Divider variant="label" label="Composition A · Offset image and text" />
        <div className="mt-14 grid-12 gap-y-10">
          <Figure
            src={images.whiteTower.src}
            alt={images.whiteTower.alt}
            ratio="portrait"
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 75vw, 100vw"
            caption="Columns 1–5. Image leads; text is held back."
            meta="4:5"
            className="col-span-full md:col-span-6 lg:col-span-5"
          />
          <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-8 lg:pb-24" data-reveal>
            <Eyebrow rule>Architecture</Eyebrow>
            <Subheading as="h3" className="mt-6">
              A tower drawn in <em>horizontal lines.</em>
            </Subheading>
            <Text className="mt-6">
              Deep slab edges cast long shadows across the façade, so the building changes character
              through the day. Text sits in columns 8–11, aligned to the base of the image.
            </Text>
          </div>
        </div>

        <Divider variant="label" label="Composition B · Staggered pair" className="mt-24 lg:mt-32" />
        <div className="mt-14 grid-12 gap-y-10">
          <div className="col-span-full lg:col-span-4" data-reveal>
            <Lead>
              Two images of different proportion, dropped out of alignment, create the rhythm of a
              printed spread.
            </Lead>
          </div>
          <Figure
            src={images.livingTimber.src}
            alt={images.livingTimber.alt}
            ratio="landscape"
            sizes="(min-width: 1024px) 40vw, 100vw"
            caption="Columns 5–9"
            meta="3:2"
            className="col-span-full md:col-span-5 lg:col-span-5 lg:col-start-5"
          />
          <Figure
            src={images.bedroom.src}
            alt={images.bedroom.alt}
            ratio="tall"
            sizes="(min-width: 1024px) 24vw, (min-width: 768px) 36vw, 100vw"
            caption="Columns 10–12, dropped"
            meta="3:4"
            className="col-span-full md:col-span-3 lg:col-span-3 lg:col-start-10 lg:mt-40"
          />
        </div>
      </div>
    </Section>
  );
}
