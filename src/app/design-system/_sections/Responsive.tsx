import { Section, SectionHeader } from "@/components/layout/Section";
import { Caption, Text, Title } from "@/components/ui/Typography";
import { breakpoints } from "@/lib/tokens";
import { cn } from "@/lib/cn";

const rules = [
  "Asymmetric desktop compositions collapse to a single column, image first.",
  "Type scales fluidly between 375px and 1440px — no breakpoint jumps.",
  "Full-bleed 21:9 images switch to 4:5 on phones to keep their presence.",
  "Navigation becomes a full-screen menu below 1024px; a Call / Enquire bar replaces the header CTA.",
  "Touch targets are never smaller than 44 × 44px.",
];

export function ResponsiveSection() {
  return (
    <Section id="responsive" aria-labelledby="responsive-title" tone="panel">
      <SectionHeader
        id="responsive-title"
        index="10"
        eyebrow="Responsive behaviour"
        title={
          <>
            The same calm, <em>at every width.</em>
          </>
        }
        intro="Three layouts on one grid. Resize this window to watch the page recompose — the indicator below shows the active layout."
      />

      <ul className="mt-20 grid grid-cols-1 gap-(--grid-gap) md:grid-cols-3 lg:mt-28">
        {breakpoints.map((bp, i) => (
          <li
            key={bp.name}
            data-reveal
            className={cn(
              "border-t pt-6 transition-colors duration-(--duration-base)",
              // Highlight the layout currently in effect.
              i === 0 && "border-deep md:border-rule",
              i === 1 && "border-rule md:border-deep lg:border-rule",
              i === 2 && "border-rule lg:border-deep",
            )}
          >
            <div className="flex items-baseline justify-between">
              <Title>{bp.name}</Title>
              <span
                className={cn(
                  "font-medium uppercase text-eyebrow text-fg",
                  i === 0 && "md:hidden",
                  i === 1 && "hidden md:inline lg:hidden",
                  i === 2 && "hidden lg:inline",
                )}
              >
                Viewing now
              </span>
            </div>
            <p className="mt-2 font-mono text-caption text-muted">{bp.range}</p>
            <div className="mt-6 flex h-16 gap-1" aria-hidden>
              {Array.from({ length: bp.columns }, (_, c) => (
                <span key={c} className="flex-1 bg-accent/20" />
              ))}
            </div>
            <Text className="mt-4 text-small">
              {bp.columns} columns. {bp.note}.
            </Text>
          </li>
        ))}
      </ul>

      <ol className="mt-20 max-w-prose border-t border-rule">
        {rules.map((rule, i) => (
          <li key={i} className="flex gap-5 border-b border-rule py-4 text-small" data-reveal>
            <span className="text-muted tabular-nums">0{i + 1}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>
      <Caption className="mt-6">Tested at 375, 768, 1024, 1440 and 1920px.</Caption>
    </Section>
  );
}
