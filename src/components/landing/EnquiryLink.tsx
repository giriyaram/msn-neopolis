"use client";

import type { ReactNode } from "react";
import type { ConfigurationId } from "@/content/project";
import type { Intent } from "@/lib/lead";
import { setConfiguration, setIntent, setSize } from "@/lib/selection-store";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";

type EnquiryLinkProps = {
  intent: Intent;
  configuration?: ConfigurationId | "both";
  size?: number | "undecided";
  variant?: ButtonVariant;
  size_?: ButtonSize;
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Link to the enquiry form that records why the visitor is enquiring and,
 * optionally, the residence they were looking at. A plain anchor, so it
 * still scrolls to the form without JavaScript.
 */
export function EnquiryLink({
  intent,
  configuration,
  size,
  variant = "primary",
  size_ = "md",
  arrow = true,
  fullWidth,
  className,
  children,
}: EnquiryLinkProps) {
  return (
    <a
      href="#enquire"
      onClick={() => {
        setIntent(intent);
        if (configuration) setConfiguration(configuration);
        if (size !== undefined) setSize(size);
      }}
      className={buttonClasses({ variant, size: size_, fullWidth, className })}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
      )}
    </a>
  );
}
