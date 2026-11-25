import { Section, SectionHeader } from "@/components/layout/Section";
import { Caption, Eyebrow } from "@/components/ui/Typography";
import { colors } from "@/lib/tokens";
import { Swatch } from "../_components/Swatch";

const surfaces = colors.filter((c) => ["canvas", "panel", "deep"].includes(c.utility));
const supporting = colors.filter((c) => !["canvas", "panel", "deep"].includes(c.utility));

const proportion = [
  { name: "Canvas", share: 62, className: "bg-canvas" },
  { name: "Surface", share: 18, className: "bg-panel" },
  { name: "Deep", share: 16, className: "bg-deep" },
  { name: "Accent", share: 4, className: "bg-accent" },
];

const rules = [
  "Sage stone is the canvas. Lift content onto pale lichen panels — never pure white.",
  "Deep forest sections punctuate the page — at most one in every three sections.",
  "Aged brass is an accent: hairline rules, numerals, labels on deep forest. Never text on light surfaces, never a fill.",
  "No gradients except the photographic scrim that keeps overlaid text legible.",
  "Secondary text uses lichen grey (ink-muted) for AA contrast; weathered stone is reserved for placeholders and disabled states.",
];

export function ColourSection() {
  return (
    <Section id="colour" aria-labelledby="colour-title" tone="panel">
      <SectionHeader
        id="colour-title"
        index="01"
        eyebrow="Colour"
        title={
          <>
            Forest, stone <em>and brass.</em>
          </>
        }
        intro="A palette taken from rain-dark foliage, lichen on stone and aged brass. Quiet greens do the work; brass is used the way it is in a well-made interior — sparingly."
      />

      <ul className="mt-20 grid grid-cols-1 gap-x-(--grid-gap) gap-y-14 md:grid-cols-3 lg:mt-28">
        {surfaces.map((c) => (
          <Swatch key={c.token} name={c.name} utility={c.utility} role={c.role} tall />
        ))}
      </ul>

      <ul className="mt-20 grid grid-cols-2 gap-x-(--grid-gap) gap-y-14 lg:grid-cols-5">
        {supporting.map((c) => (
          <Swatch key={c.token} name={c.name} utility={c.utility} role={c.role} />
        ))}
      </ul>

      <div className="mt-24 grid-12 gap-y-14 lg:mt-32">
        <div className="col-span-full lg:col-span-6" data-reveal>
          <Eyebrow>Proportion</Eyebrow>
          <div className="mt-6 flex h-24 border border-rule" role="img" aria-label="Colour proportion: canvas 62%, surface 18%, deep 16%, accent 4%">
            {proportion.map((p) => (
              <div key={p.name} className={p.className} style={{ width: `${p.share}%` }} />
            ))}
          </div>
          <div className="mt-3 flex text-caption text-muted">
            {proportion.map((p) => (
              <span key={p.name} style={{ width: `${p.share}%` }} className="truncate pr-2">
                {p.share > 10 ? `${p.name} ${p.share}%` : `${p.share}%`}
              </span>
            ))}
          </div>
          <Caption className="mt-6">
            Approximate share of a typical page. Photography sits outside this budget.
          </Caption>
        </div>

        <div className="col-span-full md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8" data-reveal>
          <Eyebrow>Usage rules</Eyebrow>
          <ol className="mt-6 border-t border-rule">
            {rules.map((rule, i) => (
              <li key={i} className="flex gap-5 border-b border-rule py-4 text-small">
                <span className="text-muted tabular-nums">0{i + 1}</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
