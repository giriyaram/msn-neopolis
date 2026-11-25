import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Polymorphic<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentProps<T>, "as" | "className" | "children">;

function make<D extends ElementType>(defaultTag: D, classes: string, displayName: string) {
  function Text<T extends ElementType = D>({ as, className, ...rest }: Polymorphic<T>) {
    const Tag: ElementType = as ?? defaultTag;
    return <Tag className={cn(classes, className)} {...rest} />;
  }
  Text.displayName = displayName;
  return Text;
}

/** Hero headlines. Use once per page. `<em>` renders in Cormorant italic. */
export const Display = make(
  "h1",
  "font-serif font-light text-display text-fg [&_em]:italic",
  "Display",
);

/** Section headings. */
export const Heading = make(
  "h2",
  "font-serif font-light text-heading text-fg [&_em]:italic",
  "Heading",
);

/** Subheadings within a section. */
export const Subheading = make(
  "h3",
  "font-serif text-subheading text-fg [&_em]:italic",
  "Subheading",
);

/** Small serif titles — list items, residences, captions with weight. */
export const Title = make("h3", "font-serif font-medium text-title text-fg", "Title");

/** Introductory paragraph beneath a heading. */
export const Lead = make("p", "font-light text-lead text-fg", "Lead");

/** Running body copy in the secondary tone. */
export const Text = make("p", "text-body text-muted", "Text");

/** Image captions and meta information. */
export const Caption = make("p", "text-caption text-muted", "Caption");

type EyebrowProps<T extends ElementType> = Polymorphic<T> & {
  /** Short accent (brass) rule before the label. */
  rule?: boolean;
  /** Section number, e.g. "01". */
  index?: string;
};

/** Uppercase overline that introduces a heading. */
export function Eyebrow<T extends ElementType = "p">({
  as,
  className,
  rule = false,
  index,
  children,
  ...rest
}: EyebrowProps<T>) {
  const Tag: ElementType = as ?? "p";
  return (
    <Tag
      className={cn(
        "flex items-center gap-4 font-medium uppercase text-eyebrow text-muted",
        className,
      )}
      {...rest}
    >
      {index && <span className="tabular-nums text-fg">{index}</span>}
      {rule && <span aria-hidden className="h-px w-10 shrink-0 bg-accent" />}
      <span>{children}</span>
    </Tag>
  );
}
