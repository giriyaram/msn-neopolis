import { Section, SectionHeader } from "@/components/layout/Section";
import { Caption, Eyebrow, Heading, Lead, Text } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { typeScale } from "@/lib/tokens";
import { cn } from "@/lib/cn";

const families = [
  {
    name: "Cormorant Garamond",
    role: "Headlines · editorial voice",
    className: "font-serif font-light",
    weights: [
      { label: "Light 300", className: "font-light" },
      { label: "Regular 400", className: "font-normal" },
      { label: "Medium 500", className: "font-medium" },
      { label: "Light Italic", className: "font-light italic" },
    ],
  },
  {
    name: "Inter",
    role: "Body · labels · interface",
    className: "font-sans font-light",
    weights: [
      { label: "Light 300", className: "font-light" },
      { label: "Regular 400", className: "font-normal" },
      { label: "Medium 500", className: "font-medium" },
      { label: "Semibold 600", className: "font-semibold" },
    ],
  },
];

export function TypographySection() {
  return (
    <Section id="typography" aria-labelledby="typography-title">
      <SectionHeader
        id="typography-title"
        index="02"
        eyebrow="Typography"
        title={
          <>
            A classical serif, <em>a precise sans.</em>
          </>
        }
        intro="Cormorant Garamond brings the editorial voice; Inter keeps information clear. Headlines are large and light, and paragraphs never run wider than about seventy characters."
      />

      {/* Families */}
      <div className="mt-20 grid grid-cols-1 gap-(--grid-gap) md:grid-cols-2 lg:mt-28">
        {families.map((f) => (
          <article key={f.name} className="border-t border-rule pt-8" data-reveal>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium uppercase text-eyebrow">{f.name}</h3>
              <span className="text-caption text-muted">{f.role}</span>
            </div>
            <p aria-hidden className={cn("mt-6 text-[clamp(7rem,4rem+10vw,13rem)] leading-none", f.className)}>
              Aa
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-y-3 text-small">
              {f.weights.map((w) => (
                <li key={w.label} className={cn(f.name === "Inter" ? "font-sans" : "font-serif text-lead", w.className)}>
                  {w.label}
                </li>
              ))}
            </ul>
            <p className={cn("mt-6 break-all text-muted", f.name === "Inter" ? "text-small" : "font-serif text-lead")}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 — &amp; ₹ “ ” ’
            </p>
          </article>
        ))}
      </div>

      {/* Scale */}
      <div className="mt-24 lg:mt-32">
        <Divider variant="label" label="Type scale · fluid 375 → 1440px" />
        <ul>
          {typeScale.map((t) => (
            <li key={t.name} className="grid-12 gap-y-4 border-b border-rule py-10 lg:py-12" data-reveal>
              <div className="col-span-full lg:col-span-3">
                <p className="font-medium uppercase text-eyebrow">{t.name}</p>
                <dl className="mt-3 space-y-1 text-caption text-muted">
                  <div><dt className="sr-only">Utility</dt><dd className="font-mono text-fg">{t.utility}</dd></div>
                  <div><dt className="sr-only">Family</dt><dd>{t.family}</dd></div>
                  <div><dt className="sr-only">Size</dt><dd>Size {t.size} · Leading {t.leading}</dd></div>
                </dl>
              </div>
              <p className={cn("col-span-full lg:col-span-9", t.className)}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* In context */}
      <div className="mt-24 lg:mt-32">
        <Divider variant="label" label="In composition" />
        <article className="mt-14 grid-12 gap-y-10">
          <div className="col-span-full lg:col-span-7" data-reveal>
            <Eyebrow rule>The Residences</Eyebrow>
            <Heading as="h3" className="mt-6 max-w-[13ch]">
              Four homes to a floor, <em>each with three aspects.</em>
            </Heading>
          </div>
          <div className="col-span-full md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-24" data-reveal>
            <Lead>
              Corner planning gives every residence morning light, an evening view and cross-ventilation
              throughout the year.
            </Lead>
            <Text className="mt-6">
              Living spaces open onto deep, shaded terraces. Private lift lobbies, a separate service
              entrance and four-metre ceilings in the principal rooms complete a plan that feels more like
              a house than an apartment.
            </Text>
            <Caption className="mt-6">Specimen copy for typographic review.</Caption>
          </div>
        </article>
      </div>
    </Section>
  );
}
