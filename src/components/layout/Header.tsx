"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { useScrolledPast } from "@/lib/use-scrolled";
import { ButtonLink } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Wordmark";
import { enquireHref, primaryNav, type NavLink } from "./navigation";

type HeaderProps = {
  /**
   * overlay — transparent with light text over a full-bleed hero, turning
   *           solid canvas once the page scrolls.
   * solid   — canvas bar from the start (pages without a hero image).
   */
  variant?: "overlay" | "solid";
  /** Fixed to the viewport. Set false to render inline (previews). */
  fixed?: boolean;
  links?: NavLink[];
  /** Destination of the header call to action. */
  enquiry?: string;
  ctaLabel?: string;
  ctaVariant?: "primary" | "secondary";
  /** Call to action at the foot of the mobile menu. */
  menuCtaLabel?: string;
  menuNote?: string;
  className?: string;
};

export function Header({
  variant = "overlay",
  fixed = true,
  links = primaryNav,
  enquiry = enquireHref,
  ctaLabel = "Enquire",
  ctaVariant = "secondary",
  menuCtaLabel = "Arrange a private viewing",
  menuNote = "Neopolis, Kokapet, Hyderabad",
  className,
}: HeaderProps) {
  const scrolled = useScrolledPast(24, fixed);
  const solid = variant === "solid" || scrolled;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header
      data-solid={solid}
      className={cn(
        fixed ? "fixed inset-x-0 top-0 z-50" : "relative",
        solid ? "tone-canvas border-rule" : "tone-overlay border-transparent",
        "border-b transition-[background-color,color,border-color,height] duration-(--duration-base) ease-luxe",
        solid && fixed ? "h-16 lg:h-18" : "h-(--header-h)",
        className,
      )}
    >
      {fixed && (
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-canvas focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
      )}

      <div className="@container container-content flex h-full items-center justify-between gap-8">
        <Link href="/" aria-label="MSN Neopolis — home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden @6xl:block">
          <ul className="flex items-center gap-7 @7xl:gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative py-2 font-medium uppercase text-button after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-base) after:ease-luxe hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 @lg:gap-6">
          {/* Wrapper owns visibility: `hidden` on the button itself would
              lose to the button's own `inline-flex` in the cascade. */}
          <div className="hidden @lg:block">
            <ButtonLink href={enquiry} variant={ctaVariant} size="sm">
              {ctaLabel}
            </ButtonLink>
          </div>
          {links.length > 0 && <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-controls={menuId}
            className="-mr-2 inline-flex h-11 items-center gap-3 px-2 font-medium uppercase text-button @6xl:hidden"
          >
            Menu
            <MenuIcon />
          </button>}
        </div>
      </div>

      <dialog ref={dialogRef} id={menuId} aria-label="Site menu" className="nav-dialog tone-canvas">
        <div className="flex h-full flex-col">
          <div className="container-content flex h-(--header-h) shrink-0 items-center justify-between border-b border-rule">
            <Wordmark />
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-2 inline-flex h-11 items-center gap-3 px-2 font-medium uppercase text-button"
            >
              Close
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Site menu" className="container-content flex-1 overflow-y-auto py-8">
            <ol>
              {links.map((link, i) => (
                <li key={link.href} className="border-b border-rule">
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-baseline gap-6 py-5 font-serif text-subheading transition-[padding] duration-(--duration-base) ease-luxe hover:pl-2"
                  >
                    <span className="font-sans font-medium text-eyebrow text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="container-content shrink-0 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
            <ButtonLink href={enquiry} onClick={closeMenu} fullWidth arrow>
              {menuCtaLabel}
            </ButtonLink>
            <p className="mt-4 text-center text-caption text-muted">{menuNote}</p>
          </div>
        </div>
      </dialog>
    </header>
  );
}
