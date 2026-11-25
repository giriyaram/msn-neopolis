"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Subheading, Text } from "@/components/ui/Typography";
import { Checkbox, SelectField, TextareaField, TextField } from "./Field";

export const residenceOptions = [
  { value: "3-bed", label: "Three-bedroom residence" },
  { value: "4-bed", label: "Four-bedroom residence" },
  { value: "sky-villa", label: "Sky villa" },
];

type EnquiryFormProps = {
  className?: string;
  /** Replace with a Server Action or API call when the CRM is connected. */
  onSubmit?: (data: FormData) => Promise<void> | void;
};

export function EnquiryForm({ className, onSubmit }: EnquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const confirmation = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "sent") confirmation.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    await onSubmit?.(new FormData(event.currentTarget));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div role="status" className={cn("border-t border-rule pt-10", className)}>
        <Subheading as="h3" ref={confirmation} tabIndex={-1} className="outline-none">
          Thank you. <em>We will be in touch shortly.</em>
        </Subheading>
        <Text className="mt-6 max-w-measure">
          A member of our private client team will contact you within one working day to arrange
          your visit to the sales gallery.
        </Text>
        <Button variant="text" className="mt-8" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-x-(--grid-gap) gap-y-10 md:grid-cols-2", className)}>
      <TextField label="Full name" name="name" autoComplete="name" placeholder="Your name" />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="+91"
        pattern="[+0-9 \(\)\-]{8,}"
        error="Please enter a valid phone number."
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        error="Please enter a valid email address."
      />
      <SelectField
        label="Residence of interest"
        name="residence"
        options={residenceOptions}
        placeholder="Choose a residence"
      />
      <TextareaField
        label="Message"
        name="message"
        optional
        rows={3}
        placeholder="Preferred visit dates, questions…"
        className="md:col-span-2"
      />
      <Checkbox name="consent" required className="md:col-span-2">
        I agree to be contacted by MSN about this enquiry. My details will not be shared with third
        parties.
      </Checkbox>
      <div className="flex flex-col gap-6 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <Button type="submit" size="lg" arrow disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request a private viewing"}
        </Button>
        <p className="text-caption text-muted">All fields are required unless marked optional.</p>
      </div>
    </form>
  );
}
