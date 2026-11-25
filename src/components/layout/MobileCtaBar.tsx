"use client";

import { cn } from "@/lib/cn";
import { useScrolledPast } from "@/lib/use-scrolled";
import { ButtonLink } from "@/components/ui/Button";
import { BarContactButtons } from "@/components/landing/ContactButtons";

type MobileCtaBarProps = {
  label: string;
  href: string;
  /** Show Call and WhatsApp buttons beside the main call-to-action. */
  contact?: boolean;
};

/**
 * Persistent call-to-action for phones and tablets. Slides in once the
 * visitor scrolls past the hero; hidden on desktop where the header CTA
 * is always visible.
 */
export function MobileCtaBar({ label, href, contact = false }: MobileCtaBarProps) {
  const visible = useScrolledPast(0.6);

  return (
    <div
      inert={!visible}
      className={cn(
        "tone-canvas fixed inset-x-0 bottom-0 z-40 border-t border-rule lg:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        "transition-transform duration-(--duration-slow) ease-luxe",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className={cn("container-content grid gap-3 py-3", contact ? "grid-cols-[auto_auto_1fr]" : "grid-cols-1")}>
        {contact && <BarContactButtons />}
        <ButtonLink href={href} size="sm" arrow>
          {label}
        </ButtonLink>
      </div>
    </div>
  );
}
