import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Caption, Eyebrow, Text, Title } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { images } from "@/lib/images";
import { motionTokens } from "@/lib/tokens";
import { cn } from "@/lib/cn";

function Panel({ tone, label, className, children }: { tone: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(tone, "relative flex flex-col p-8 md:p-10 lg:p-12", className)} data-reveal>
      <Eyebrow className="relative">{label}</Eyebrow>
      <div className="relative mt-10 flex flex-1 flex-col items-start gap-8">{children}</div>
    </div>
  );
}

function ButtonSet() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <Button arrow>Arrange a viewing</Button>
        <Button variant="secondary">Download brochure</Button>
      </div>
      <ButtonLink href="#imagery" variant="text" arrow>
        Explore the residences
      </ButtonLink>
    </>
  );
}

const interactions = [
  { name: "Hover", body: "Fills settle over 450 ms; arrows advance 4 px; underlines draw from the left." },
  { name: "Focus", body: "A 2 px ring offset by 3 px, in deep forest on light surfaces and sage stone on dark." },
  { name: "Press", body: "No bounce or scale. The colour change alone confirms the action." },
  { name: "Disabled", body: "40% opacity and no pointer events. Avoid disabling — explain why instead." },
];

export function ButtonsSection() {
  return (
    <Section id="buttons" aria-labelledby="buttons-title" tone="panel">
      <SectionHeader
        id="buttons-title"
        index="03"
        eyebrow="Buttons & interaction"
        title={
          <>
            Few actions, <em>clearly stated.</em>
          </>
        }
        intro="Square corners, uppercase labels set in Inter Medium and generous padding. Buttons take their colour from the surface they sit on, so one component works everywhere."
      />

      <div className="mt-20 grid grid-cols-1 gap-(--grid-gap) lg:mt-28 lg:grid-cols-3">
        <Panel tone="tone-canvas" label="On canvas">
          <ButtonSet />
        </Panel>
        <Panel tone="tone-deep" label="On deep forest">
          <ButtonSet />
        </Panel>
        <div className="tone-overlay relative overflow-hidden" data-reveal>
          <Image src={images.curvedFacade.src} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-deep/45" />
          <Panel tone="tone-overlay" label="On photography" className="h-full">
            <ButtonSet />
          </Panel>
        </div>
      </div>

      <div className="mt-20 grid-12 gap-y-12 lg:mt-28">
        <div className="col-span-full lg:col-span-5" data-reveal>
          <Divider variant="label" label="Sizes & states" />
          <div className="mt-10 flex flex-col items-start gap-6">
            <Button size="lg" arrow>Large · 60px</Button>
            <Button size="md">Medium · 52px</Button>
            <Button size="sm" variant="secondary">Small · 44px</Button>
            <Button disabled>Disabled</Button>
          </div>
          <Caption className="mt-8">Every target is at least 44 × 44 px.</Caption>
        </div>

        <div className="col-span-full lg:col-span-6 lg:col-start-7" data-reveal>
          <Divider variant="label" label="Interaction" />
          <dl className="mt-4">
            {interactions.map((item) => (
              <div key={item.name} className="grid grid-cols-[7rem_1fr] gap-6 border-b border-rule py-5">
                <dt><Title as="span" className="text-lead">{item.name}</Title></dt>
                <dd><Text className="text-small">{item.body}</Text></dd>
              </div>
            ))}
          </dl>

          <Divider variant="label" label="Motion tokens" className="mt-16" />
          <table className="mt-4 w-full text-left text-small">
            <caption className="sr-only">Motion tokens</caption>
            <thead className="sr-only">
              <tr><th>Token</th><th>Value</th><th>Use</th></tr>
            </thead>
            <tbody>
              {motionTokens.map((m) => (
                <tr key={m.token} className="border-b border-rule">
                  <td className="py-4 pr-4 font-mono text-caption">{m.token}</td>
                  <td className="py-4 pr-4 text-muted tabular-nums">{m.value}</td>
                  <td className="hidden py-4 text-muted md:table-cell">{m.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Caption className="mt-6">
            All motion is disabled for visitors who prefer reduced motion.
          </Caption>
        </div>
      </div>
    </Section>
  );
}
