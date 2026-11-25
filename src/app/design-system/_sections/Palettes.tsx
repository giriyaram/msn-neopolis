import { Section, SectionHeader } from "@/components/layout/Section";
import { Caption } from "@/components/ui/Typography";
import { palettes, type Palette, type Role } from "@/lib/palettes";
import { contrastRatio } from "@/lib/contrast";
import { ApplyPaletteButton } from "../_components/PaletteControls";

const chips: Array<{ role: Role; label: string }> = [
  { role: "canvas", label: "Canvas" },
  { role: "surface", label: "Surface" },
  { role: "deep", label: "Deep" },
  { role: "ink", label: "Ink" },
  { role: "muted", label: "Muted" },
  { role: "accent", label: "Accent" },
];

/** A miniature page in the palette's own colours — rendered independently of the active one. */
function Specimen({ p }: { p: Palette }) {
  const c = p.colors;
  return (
    <div className="border p-6 md:p-7" style={{ background: c.canvas, borderColor: c.line }}>
      <p className="flex items-center gap-3 font-medium uppercase text-eyebrow" style={{ color: c.muted }}>
        <span className="h-px w-8" style={{ background: c.accent }} />
        {p.inspiration}
      </p>
      <h3 className="mt-5 font-serif text-subheading font-light" style={{ color: c.ink }}>
        {p.name.split(" & ")[0]} <em>&amp; {p.name.split(" & ")[1]}</em>
      </h3>
      <p className="mt-3 text-small" style={{ color: c.muted }}>
        {p.mood}
      </p>

      <div className="mt-7 p-5" style={{ background: c.deep }}>
        <p className="font-medium uppercase text-eyebrow" style={{ color: c.accent }}>
          By appointment
        </p>
        <p className="mt-2 font-serif text-title font-light" style={{ color: c.canvas }}>
          See the light <em>for yourself.</em>
        </p>
        <span
          aria-hidden
          className="mt-5 inline-flex h-10 items-center px-5 font-medium uppercase text-button"
          style={{ background: c.canvas, color: c.deep }}
        >
          Arrange a viewing
        </span>
      </div>

      <div className="mt-4 p-5" style={{ background: c.surface }}>
        <p className="text-caption" style={{ color: c.muted }}>
          Three-bedroom residence
        </p>
        <p className="mt-1 font-serif text-lead" style={{ color: c.ink }}>
          3,250 – 3,600 <em style={{ color: c.muted }}>sq.ft</em>
        </p>
      </div>
    </div>
  );
}

function PaletteCard({ p }: { p: Palette }) {
  const c = p.colors;
  const checks = [
    { label: "Text on canvas", ratio: contrastRatio(c.ink, c.canvas) },
    { label: "Muted on canvas", ratio: contrastRatio(c.muted, c.canvas) },
    { label: "Text on deep", ratio: contrastRatio(c.canvas, c.deep) },
    { label: "Accent on deep", ratio: contrastRatio(c.accent, c.deep) },
  ];

  return (
    <li className="flex flex-col" data-reveal>
      <Specimen p={p} />

      <ul className="mt-4 grid grid-cols-6 gap-1.5" aria-label={`${p.name} colours`}>
        {chips.map(({ role, label }) => (
          <li key={role}>
            <span className="block aspect-square border border-rule" style={{ background: c[role] }} />
            <span className="mt-1.5 block truncate text-[0.6875rem] leading-tight text-muted">
              {p.names[role] ?? label}
            </span>
            <span className="block font-mono text-[0.6875rem] leading-tight text-fg">{c[role]}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-rule pt-3 text-caption">
        {checks.map((check) => (
          <div key={check.label} className="flex justify-between gap-2">
            <dt className="text-muted">{check.label}</dt>
            <dd className="tabular-nums">{check.ratio.toFixed(1)}:1</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <ApplyPaletteButton id={p.id} name={p.name.split(" & ")[0]} />
      </div>
    </li>
  );
}

export function PalettesSection() {
  return (
    <Section id="palettes" aria-labelledby="palettes-title">
      <SectionHeader
        id="palettes-title"
        index="01b"
        eyebrow="Colour · Palettes considered"
        title={
          <>
            Seven directions, <em>one chosen.</em>
          </>
        }
        intro="Forest & Brass is adopted. The alternatives remain for reference — each fills the same roles, so previewing one re-dresses this entire page until you reset or reload."
      />

      <ul className="mt-20 grid grid-cols-1 gap-x-(--grid-gap) gap-y-20 md:grid-cols-2 lg:mt-28 lg:grid-cols-3">
        {palettes.map((p) => (
          <PaletteCard key={p.id} p={p} />
        ))}
      </ul>

      <Caption className="mt-14 max-w-prose">
        Every text pairing meets WCAG AA (4.5:1). Accents are reserved for rules, numerals and labels on
        the deep colour.
      </Caption>
    </Section>
  );
}
