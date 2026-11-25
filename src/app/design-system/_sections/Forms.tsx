import { Section } from "@/components/layout/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Checkbox, SelectField, TextField } from "@/components/forms/Field";
import { Caption, Eyebrow, Heading, Lead, Text } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";

const contact = [
  { label: "Sales gallery", value: "Kokapet, Hyderabad" },
  { label: "Hours", value: "Daily, 10:00 – 19:00, by appointment" },
  { label: "Telephone", value: "+91 00000 00000" },
];

export function FormsSection() {
  return (
    <Section id="forms" aria-labelledby="forms-title" tone="panel">
      <span id="enquire" className="sr-only" />
      <div className="grid-12 gap-y-16">
        <div className="col-span-full lg:col-span-4" data-reveal>
          <Eyebrow index="08" rule>
            Form elements
          </Eyebrow>
          <Heading id="forms-title" className="mt-6">
            Arrange a <em>private viewing.</em>
          </Heading>
          <Lead className="mt-8 text-muted">
            Open, underlined fields with labels always visible. Errors appear only once a field has
            been used, in a muted brick that still passes AA.
          </Lead>
          <dl className="mt-12 border-t border-rule">
            {contact.map((c) => (
              <div key={c.label} className="border-b border-rule py-4">
                <dt className="text-caption text-muted">{c.label}</dt>
                <dd className="mt-1 text-small">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="col-span-full lg:col-span-7 lg:col-start-6" data-reveal>
          <EnquiryForm />
        </div>
      </div>

      <Divider variant="label" label="Field states" className="mt-24 lg:mt-32" />
      <div className="mt-10 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2 lg:grid-cols-5">
        <TextField label="Default" name="demo-default" placeholder="Placeholder" required={false} />
        <TextField label="Focused" name="demo-focus" defaultValue="Aarav Mehta" data-demo="focus" required={false} />
        <TextField
          label="With hint"
          name="demo-hint"
          defaultValue="aarav@example.com"
          hint="We reply within one working day."
          required={false}
        />
        <TextField
          label="Error"
          name="demo-error"
          defaultValue="98480"
          invalid
          error="Please enter a valid phone number."
          required={false}
        />
        <SelectField
          label="Disabled"
          name="demo-disabled"
          options={[{ value: "a", label: "Sky villa" }]}
          disabled
          required={false}
        />
      </div>
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:gap-12">
        <Checkbox name="demo-check-on" defaultChecked>
          Checked
        </Checkbox>
        <Checkbox name="demo-check-off">Unchecked</Checkbox>
      </div>
      <Text className="mt-10 max-w-prose text-small">
        Inputs are 16px so iOS never zooms on focus. Every field has a visible label, the correct{" "}
        <code className="font-mono">autocomplete</code> and <code className="font-mono">inputmode</code>, and a
        minimum height of 48px.
      </Text>
      <Caption className="mt-4">
        The enquiry form is a front-end specimen; connect it to the CRM through a Server Action.
      </Caption>
    </Section>
  );
}
