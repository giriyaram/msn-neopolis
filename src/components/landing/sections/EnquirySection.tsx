import { faqs } from "@/content/faq";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { InlineContact } from "../ContactButtons";
import { LeadForm } from "../LeadForm";

const receive = [
  "Official floor plans for your preferred residence",
  "Tower-wise availability and the official cost sheet",
  "A site visit arranged at your convenience",
];

export function EnquirySection() {
  return (
    <Section id="enquire" tone="panel" aria-labelledby="enquire-title">
      <div className="grid-12 gap-y-14">
        <div className="col-span-full lg:col-span-4" data-reveal>
          <Eyebrow index="11" rule>
            Enquire
          </Eyebrow>
          <Heading id="enquire-title" className="mt-6 max-w-[12ch]">
            Find Your <em>Preferred Residence.</em>
          </Heading>
          <Lead className="mt-8 text-muted">
            Leave your name and number. The MSN team will call you with everything you need.
          </Lead>
          <ul className="mt-10 border-t border-rule">
            {receive.map((item, i) => (
              <li key={item} className="flex gap-5 border-b border-rule py-4 text-small">
                <span className="text-muted tabular-nums">0{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full lg:col-span-7 lg:col-start-6">
          <LeadForm />
          <InlineContact location="enquiry" className="mt-10 border-t border-rule pt-6" />
        </div>
      </div>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" aria-labelledby="faq-title">
      <div className="grid-12 gap-y-12">
        <div className="col-span-full lg:col-span-4" data-reveal>
          <Eyebrow index="12" rule>
            Questions
          </Eyebrow>
          <Heading id="faq-title" className="mt-6">
            Frequently <em>asked.</em>
          </Heading>
        </div>
        <div className="col-span-full lg:col-span-7 lg:col-start-6">
          <div className="border-t border-rule">
            {faqs.map((f) => (
              <details key={f.question} className="group border-b border-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif text-title">{f.question}</h3>
                  <span
                    aria-hidden
                    className="relative size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition-transform after:duration-(--duration-base) after:ease-luxe group-open:after:scale-y-0"
                  />
                </summary>
                <p className="max-w-prose pb-7 text-body text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
