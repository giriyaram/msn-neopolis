"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { Caption, Subheading, Text } from "./Typography";

export type Configuration = {
  id: string;
  /** Short selector label, e.g. "3 Bed". */
  label: string;
  name: string;
  area: string;
  summary: string;
  specs: Array<{ label: string; value: string }>;
  image: { src: string; alt: string };
};

type ConfigSelectorProps = {
  legend: string;
  options: Configuration[];
  enquiry: string;
  className?: string;
};

/**
 * Residence configuration picker. Native radio inputs give keyboard
 * (arrow-key) and screen-reader support; the detail panel cross-fades.
 */
export function ConfigSelector({ legend, options, enquiry, className }: ConfigSelectorProps) {
  const [selectedId, setSelectedId] = useState(options[0]?.id);
  const selected = options.find((o) => o.id === selectedId) ?? options[0];
  const group = useId();

  return (
    <div className={cn("grid-12 gap-y-12", className)}>
      <div className="col-span-full lg:col-span-5">
        <fieldset>
          <legend className="font-medium uppercase text-eyebrow text-muted">{legend}</legend>
          <div className="mt-6 flex border border-rule">
            {options.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "relative flex h-13 flex-1 cursor-pointer items-center justify-center border-r border-rule last:border-r-0",
                  "font-medium uppercase text-button transition-colors duration-(--duration-base) ease-luxe",
                  "has-checked:bg-strong has-checked:text-surface",
                  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus-ring)",
                  "hover:bg-strong/5",
                )}
              >
                <input
                  type="radio"
                  name={group}
                  value={option.id}
                  checked={option.id === selected.id}
                  onChange={() => setSelectedId(option.id)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div aria-live="polite" className="mt-12">
          <Subheading as="h3" key={selected.id} className="animate-rise">
            {selected.name}
          </Subheading>
          <p className="mt-3 font-serif text-title italic text-muted">{selected.area}</p>
          <Text className="mt-6 max-w-measure">{selected.summary}</Text>

          <dl className="mt-10 grid grid-cols-2 border-t border-rule">
            {selected.specs.map((spec) => (
              <div key={spec.label} className="border-b border-rule py-4 odd:pr-4 even:border-l even:pl-4">
                <dt className="text-caption text-muted">{spec.label}</dt>
                <dd className="mt-1 text-small text-fg">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <ButtonLink href={enquiry} variant="text" arrow className="mt-10">
            Request floor plans
          </ButtonLink>
        </div>
      </div>

      <div className="col-span-full lg:col-span-6 lg:col-start-7">
        <div className="relative aspect-portrait overflow-hidden bg-line">
          {options.map((option) => (
            <Image
              key={option.id}
              src={option.image.src}
              alt={option.id === selected.id ? option.image.alt : ""}
              aria-hidden={option.id !== selected.id}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={cn(
                "object-cover transition-opacity duration-(--duration-slow) ease-soft",
                option.id === selected.id ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
        <Caption className="mt-4">Interior shown is indicative. Specimen data for design review.</Caption>
      </div>
    </div>
  );
}
