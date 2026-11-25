import { Section, SectionHeader } from "@/components/layout/Section";
import { StatGrid, type StatItem } from "@/components/ui/Stat";
import { ConfigSelector, type Configuration } from "@/components/ui/ConfigSelector";
import { Caption, Eyebrow, Heading } from "@/components/ui/Typography";
import { images } from "@/lib/images";

// Specimen figures for design review — replace with approved project data.
const stats: StatItem[] = [
  { value: "7.2", unit: "acres", label: "Landscaped grounds", detail: "Over 80% of the site left open to the sky." },
  { value: "54", label: "Storeys", detail: "A slender tower, set back behind a landscaped forecourt." },
  { value: "4", label: "Residences per floor", detail: "Every home a corner home, with three aspects." },
  { value: "60k", unit: "sq.ft", label: "Clubhouse", detail: "Spa, pools, library and private dining." },
];

const configurations: Configuration[] = [
  {
    id: "3-bed",
    label: "3 Bed",
    name: "Three-bedroom residence",
    area: "3,250 – 3,600 sq.ft",
    summary:
      "A generous family plan with a separate formal living room, a sunlit kitchen and a wraparound terrace on the corner.",
    specs: [
      { label: "Bedrooms", value: "3 + study" },
      { label: "Ceiling height", value: "3.3 m" },
      { label: "Terrace", value: "Wraparound" },
      { label: "Parking", value: "3 bays" },
    ],
    image: images.livingTimber,
  },
  {
    id: "4-bed",
    label: "4 Bed",
    name: "Four-bedroom residence",
    area: "4,400 – 4,950 sq.ft",
    summary:
      "Entertaining spaces arranged along a single glazed façade, with a private lift lobby and staff quarters.",
    specs: [
      { label: "Bedrooms", value: "4 + family" },
      { label: "Ceiling height", value: "3.3 m" },
      { label: "Lift", value: "Private lobby" },
      { label: "Parking", value: "4 bays" },
    ],
    image: images.livingDouble,
  },
  {
    id: "sky-villa",
    label: "Sky Villa",
    name: "Sky villa",
    area: "8,200 sq.ft · Duplex",
    summary:
      "Two floors at the crown of the tower, with a double-height salon, a private pool terrace and an uninterrupted view west.",
    specs: [
      { label: "Bedrooms", value: "5" },
      { label: "Salon height", value: "6.6 m" },
      { label: "Pool", value: "Private terrace" },
      { label: "Parking", value: "5 bays" },
    ],
    image: images.glassStair,
  },
];

export function DataSection() {
  return (
    <div id="data">
      <Section tone="deep" aria-labelledby="stats-title">
        <SectionHeader
          id="stats-title"
          index="07"
          eyebrow="Statistics"
          title={
            <>
              Figures, <em>set like headlines.</em>
            </>
          }
          intro="Numbers in Cormorant Light with a hairline above and a tracked label below. Four to a row on desktop, two on phones."
        />
        <StatGrid items={stats} className="mt-20 lg:mt-28" />
        <Caption className="mt-12">Specimen figures for design review — not project data.</Caption>
      </Section>

      <Section aria-labelledby="config-title">
        <div className="max-w-[40rem]" data-reveal>
          <Eyebrow rule>Configuration selector</Eyebrow>
          <Heading id="config-title" className="mt-6">
            Choose a <em>residence.</em>
          </Heading>
        </div>
        <ConfigSelector
          legend="Residence type"
          options={configurations}
          enquiry="#forms"
          className="mt-16 lg:mt-20"
        />
      </Section>
    </div>
  );
}
