import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";

export type Tone = "canvas" | "panel" | "deep";
type Spacing = "default" | "compact" | "none";
type Width = "content" | "wide" | "prose" | "full";

const spacingClass: Record<Spacing, string> = {
  default: "section-y",
  compact: "section-y-sm",
  none: "",
};

const widthClass: Record<Width, string> = {
  content: "container-content",
  wide: "container-wide",
  prose: "container-prose",
  full: "",
};

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: Tone;
  spacing?: Spacing;
  /** Inner container width. `full` renders children edge to edge. */
  width?: Width;
  children: ReactNode;
};

/** Page section: sets the surface tone, vertical rhythm and content width. */
export function Section({
  tone = "canvas",
  spacing = "default",
  width = "content",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn(`tone-${tone}`, spacingClass[spacing], className)} {...rest}>
      {width === "full" ? children : <div className={widthClass[width]}>{children}</div>}
    </section>
  );
}

type SectionHeaderProps = {
  id?: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
};

/**
 * Asymmetric editorial header: heading across seven columns, the
 * introduction offset into the right-hand columns and aligned to its base.
 */
export function SectionHeader({ id, index, eyebrow, title, intro, className }: SectionHeaderProps) {
  return (
    <header className={cn("grid-12 gap-y-8", className)} data-reveal>
      <div className="col-span-full lg:col-span-7">
        <Eyebrow index={index} rule>
          {eyebrow}
        </Eyebrow>
        <Heading id={id} className="mt-6 max-w-[16ch]">
          {title}
        </Heading>
      </div>
      {intro && (
        <div className="col-span-full self-end md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-9">
          <Lead className="text-muted">{intro}</Lead>
        </div>
      )}
    </header>
  );
}
