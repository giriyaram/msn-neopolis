import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Lead, Text, Title } from "@/components/ui/Typography";
import { ArrowRight } from "@/components/ui/Icons";

const principles = [
  {
    name: "Restraint",
    body: "Say less, with more conviction. Every element must earn its place on the page.",
  },
  {
    name: "Proportion",
    body: "Generous margins, an asymmetric grid and measured line lengths give the work its calm.",
  },
  {
    name: "Light",
    body: "Sage stone over white, deep forest over black. Photography carries the colour; the interface recedes.",
  },
  {
    name: "Material",
    body: "A classical serif against a precise sans — stone against glass, craft against engineering.",
  },
];

export const contents = [
  { index: "01", label: "Colour", href: "#colour" },
  { index: "01b", label: "Palettes considered", href: "#palettes" },
  { index: "02", label: "Typography", href: "#typography" },
  { index: "03", label: "Buttons & interaction", href: "#buttons" },
  { index: "04", label: "Spacing & layout", href: "#layout" },
  { index: "05", label: "Navigation", href: "#navigation" },
  { index: "06", label: "Image treatments", href: "#imagery" },
  { index: "07", label: "Statistics & configurations", href: "#data" },
  { index: "08", label: "Form elements", href: "#forms" },
  { index: "09", label: "Dividers & calls to action", href: "#cta" },
  { index: "10", label: "Responsive behaviour", href: "#responsive" },
];

export function Overview() {
  return (
    <Section id="overview" aria-labelledby="overview-title">
      <div className="grid-12 gap-y-12">
        <div className="col-span-full lg:col-span-6" data-reveal>
          <Eyebrow rule>Overview</Eyebrow>
          <Heading id="overview-title" className="mt-6 max-w-[14ch]">
            A residence, <em>not a project.</em>
          </Heading>
        </div>
        <div className="col-span-full md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8" data-reveal>
          <Lead>
            MSN Neopolis should read like an established international residential brand —
            closer to a hotel of quiet reputation than to a property listing.
          </Lead>
          <Text className="mt-6">
            This page defines the foundations every future section is built from. Each value on it
            is a token in <code className="font-mono text-small">globals.css</code> and a reusable
            component in <code className="font-mono text-small">src/components</code>.
          </Text>
        </div>
      </div>

      <ul className="mt-24 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2 lg:mt-32 lg:grid-cols-4">
        {principles.map((p, i) => (
          <li key={p.name} className="border-t border-rule pt-6" data-reveal>
            <span className="font-medium text-eyebrow text-muted tabular-nums">0{i + 1}</span>
            <Title className="mt-4">{p.name}</Title>
            <Text className="mt-3 text-small">{p.body}</Text>
          </li>
        ))}
      </ul>

      <nav aria-label="Design system contents" className="mt-24 lg:mt-32" data-reveal>
        <Eyebrow>Contents</Eyebrow>
        <ol className="mt-6 grid border-t border-rule md:grid-cols-2 md:gap-x-(--grid-gap)">
          {contents.map((item) => (
            <li key={item.href} className="border-b border-rule">
              <Link
                href={item.href}
                className="group flex items-center gap-6 py-5 transition-[padding] duration-(--duration-base) ease-luxe hover:pl-2"
              >
                <span className="w-8 font-medium text-eyebrow text-muted tabular-nums">{item.index}</span>
                <span className="flex-1 font-serif text-title">{item.label}</span>
                <ArrowRight className="text-muted opacity-0 transition-[opacity,transform] duration-(--duration-base) ease-luxe group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </Section>
  );
}
