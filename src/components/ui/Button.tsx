import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./Icons";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "sm" | "md" | "lg";

type StyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/*
 * Buttons read their colours from the surrounding tone (`--strong`,
 * `--surface`), so the same variant works on canvas, panel, deep and
 * photography without extra props.
 */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-strong text-surface hover:bg-strong/85",
  secondary:
    "border border-strong/70 text-strong hover:border-strong hover:bg-strong hover:text-surface",
  text: "text-strong px-0! min-h-0! py-2 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-current before:opacity-25 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-slow) after:ease-luxe hover:after:scale-x-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-5 py-2.5 gap-3",
  md: "min-h-13 px-8 py-3 gap-4",
  lg: "min-h-15 px-10 py-4 gap-5",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: StyleOptions = {}) {
  return cn(
    // Labels stay on one line where they fit and wrap (rather than overflow) on narrow screens.
    "group/button relative inline-flex max-w-full shrink-0 items-center justify-center text-center",
    "font-sans font-medium uppercase text-button leading-[1.35]",
    "transition-[background-color,border-color,color,opacity] duration-(--duration-base) ease-luxe",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
    sizes[size],
    variants[variant],
    fullWidth && "w-full",
    className,
  );
}

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
      )}
    </>
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  StyleOptions & {
    /** Trailing arrow that nudges forward on hover. */
    arrow?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> &
  StyleOptions & {
    arrow?: boolean;
  };

export function ButtonLink({
  variant,
  size,
  fullWidth,
  arrow,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}
