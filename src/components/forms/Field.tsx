import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Force the error state (e.g. server-side validation). */
  invalid?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/*
 * Errors appear only after the visitor has interacted with a field
 * (CSS :user-invalid), or immediately when `invalid` is set. Native
 * constraint validation still runs on submit for assistive technology.
 */
function FieldShell({ id, label, hint, error, invalid, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn("field flex flex-col", className)} data-invalid={invalid || undefined}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-4 font-medium uppercase text-eyebrow text-muted"
      >
        {label}
        {optional && (
          <span className="text-caption tracking-normal normal-case">Optional</span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="field-hint mt-2 text-caption text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error mt-2 text-caption">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, invalid?: boolean) {
  const ids = [hint && `${id}-hint`, invalid && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type Shared = {
  label: string;
  name: string;
  id?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
  optional?: boolean;
  className?: string;
};

export function TextField({
  label,
  name,
  id = `field-${name}`,
  hint,
  error = "Please complete this field.",
  invalid,
  optional,
  className,
  type = "text",
  ...input
}: Shared & Omit<ComponentPropsWithoutRef<"input">, "name" | "id" | "className">) {
  return (
    <FieldShell {...{ id, label, hint, error, invalid, optional, className }}>
      <input
        id={id}
        name={name}
        type={type}
        required={!optional}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className="field-control mt-1"
        {...input}
      />
    </FieldShell>
  );
}

export function TextareaField({
  label,
  name,
  id = `field-${name}`,
  hint,
  error = "Please complete this field.",
  invalid,
  optional,
  className,
  rows = 4,
  ...textarea
}: Shared & Omit<ComponentPropsWithoutRef<"textarea">, "name" | "id" | "className">) {
  return (
    <FieldShell {...{ id, label, hint, error, invalid, optional, className }}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={!optional}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className="field-control mt-1"
        {...textarea}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  id = `field-${name}`,
  hint,
  error = "Please choose an option.",
  invalid,
  optional,
  className,
  options,
  placeholder = "Select",
  ...select
}: Shared &
  Omit<ComponentPropsWithoutRef<"select">, "name" | "id" | "className"> & {
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
  }) {
  return (
    <FieldShell {...{ id, label, hint, error, invalid, optional, className }}>
      <select
        id={id}
        name={name}
        required={!optional}
        defaultValue=""
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className="field-control mt-1"
        {...select}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Checkbox({
  name,
  id = `field-${name}`,
  className,
  children,
  ...input
}: { name: string; id?: string; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<"input">,
  "name" | "id" | "className" | "type" | "children"
>) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input id={id} name={name} type="checkbox" className="check-control" {...input} />
      <label htmlFor={id} className="cursor-pointer text-small text-muted">
        {children}
      </label>
    </div>
  );
}
