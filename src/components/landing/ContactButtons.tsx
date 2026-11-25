"use client";

import { contact } from "@/content/project";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** WhatsApp brand green — kept for instant recognition. */
const WHATSAPP_GREEN = "bg-[#25D366] text-[#0b2e18] hover:bg-[#1fbe5b]";

type Location = "floating" | "mobile_bar" | "enquiry" | "popup" | "footer";

function onCall(location: Location) {
  track("click_call", { location });
}
function onWhatsApp(location: Location) {
  track("click_whatsapp", { location });
}

/**
 * Desktop: floating Call and WhatsApp buttons, bottom-right.
 * Phones and tablets use the buttons in the mobile CTA bar instead.
 */
export function FloatingContact() {
  return (
    <div data-no-popup className="fixed right-6 bottom-6 z-40 hidden flex-col items-end gap-3 lg:flex">
      <FloatingButton
        href={contact.whatsappHref}
        external
        label="WhatsApp us"
        className={WHATSAPP_GREEN}
        onClick={() => onWhatsApp("floating")}
      >
        <WhatsAppIcon width={24} height={24} />
      </FloatingButton>
      <FloatingButton
        href={contact.telHref}
        label={`Call ${contact.phoneDisplay}`}
        className="bg-deep text-canvas hover:bg-deep/90"
        onClick={() => onCall("floating")}
      >
        <PhoneIcon width={20} height={20} />
      </FloatingButton>
    </div>
  );
}

function FloatingButton({
  href,
  label,
  external,
  className,
  onClick,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  className: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="group/fab flex items-center gap-3"
    >
      {/* Label slides out on hover / focus. */}
      <span className="pointer-events-none translate-x-2 bg-canvas px-3 py-2 text-caption font-medium whitespace-nowrap text-ink opacity-0 shadow-[0_8px_24px_-12px_rgb(28_43_35/0.4)] transition-[opacity,translate] duration-(--duration-base) ease-luxe group-hover/fab:translate-x-0 group-hover/fab:opacity-100 group-focus-visible/fab:translate-x-0 group-focus-visible/fab:opacity-100">
        {label}
      </span>
      <span
        className={cn(
          "inline-flex size-14 items-center justify-center rounded-full shadow-[0_12px_32px_-12px_rgb(28_43_35/0.55)] transition-colors duration-(--duration-base)",
          className,
        )}
      >
        {children}
        <span className="sr-only">{label}</span>
      </span>
    </a>
  );
}

/** Compact icon buttons for the mobile CTA bar. */
export function BarContactButtons() {
  return (
    <>
      <a
        data-no-popup
        href={contact.telHref}
        onClick={() => onCall("mobile_bar")}
        aria-label={`Call ${contact.phoneDisplay}`}
        className={buttonClasses({ variant: "secondary", size: "sm", className: "px-4!" })}
      >
        <PhoneIcon />
      </a>
      <a
        data-no-popup
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener"
        onClick={() => onWhatsApp("mobile_bar")}
        aria-label="WhatsApp us"
        className={cn("inline-flex min-h-11 items-center justify-center px-4", WHATSAPP_GREEN)}
      >
        <WhatsAppIcon width={20} height={20} />
      </a>
    </>
  );
}

/** "Prefer to talk?" row — under the enquiry form and in the popup. */
export function InlineContact({ location, className }: { location: "enquiry" | "popup"; className?: string }) {
  return (
    <div data-no-popup className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", className)}>
      <span className="text-caption text-muted">Prefer to talk?</span>
      <a
        href={contact.telHref}
        onClick={() => onCall(location)}
        className="inline-flex items-center gap-2 text-small font-medium text-fg underline-offset-4 hover:underline"
      >
        <PhoneIcon width={14} height={14} />
        <span className="tabular-nums">{contact.phoneDisplay}</span>
      </a>
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener"
        onClick={() => onWhatsApp(location)}
        className="inline-flex items-center gap-2 text-small font-medium text-fg underline-offset-4 hover:underline"
      >
        <WhatsAppIcon width={15} height={15} className="text-[#1fa855]" />
        WhatsApp
      </a>
    </div>
  );
}

/** Footer lines (server-safe markup, tracked on click). */
export function FooterContact() {
  return (
    <>
      <li>
        <a href={contact.telHref} onClick={() => onCall("footer")} className="text-muted tabular-nums hover:text-fg">
          Call {contact.phoneDisplay}
        </a>
      </li>
      <li>
        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener"
          onClick={() => onWhatsApp("footer")}
          className="text-muted hover:text-fg"
        >
          WhatsApp us
        </a>
      </li>
    </>
  );
}
