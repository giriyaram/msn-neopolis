"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string; hint?: string };

type SegmentedProps = {
  legend: string;
  /** Visually hide the legend (it is still announced). */
  hideLegend?: boolean;
  options: readonly Option[];
  value: string | null;
  onChange: (value: string) => void;
  /** "bar" — joined segments; "pills" — wrapping, separated options. */
  layout?: "bar" | "pills";
  error?: string;
  className?: string;
};

/**
 * Single-choice control built on native radio inputs: arrow-key navigation,
 * form semantics and screen-reader support come from the platform.
 */
export function Segmented({
  legend,
  hideLegend,
  options,
  value,
  onChange,
  layout = "bar",
  error,
  className,
}: SegmentedProps) {
  const name = useId();
  const errorId = `${name}-error`;

  return (
    <fieldset className={className} aria-describedby={error ? errorId : undefined}>
      <legend
        className={cn(
          "mb-3 font-medium uppercase text-eyebrow text-muted",
          hideLegend && "sr-only",
        )}
      >
        {legend}
      </legend>
      <div
        className={cn(
          layout === "bar" ? "flex border border-rule" : "flex flex-wrap gap-2",
          error && layout === "bar" && "border-error",
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "relative flex min-h-12 cursor-pointer flex-col items-center justify-center px-4 py-2 text-center",
              "transition-colors duration-(--duration-base) ease-luxe",
              "has-checked:bg-strong has-checked:text-surface",
              "has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-(--focus-ring) has-checked:has-focus-visible:outline-(--surface)",
              layout === "bar"
                ? "flex-1 border-r border-rule last:border-r-0 hover:bg-strong/5"
                : cn("border hover:border-strong", error ? "border-error" : "border-rule"),
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="font-medium uppercase text-button">{option.label}</span>
            {option.hint && <span className="mt-1 text-caption normal-case opacity-75">{option.hint}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-caption text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
