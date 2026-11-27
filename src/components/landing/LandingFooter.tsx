import Link from "next/link";
import { project, pricingDisclaimer } from "@/content/project";
import type { NavLink } from "@/components/layout/navigation";
import { FooterContact } from "./ContactButtons";
import { Divider } from "@/components/ui/Divider";
import { Wordmark } from "@/components/ui/Wordmark";

export function LandingFooter({ links }: { links: NavLink[] }) {
  return (
    <footer className="tone-deep pt-24 pb-32 lg:pb-16">
      <div className="container-content">
        <div className="grid-12 gap-y-14">
          <div className="col-span-full lg:col-span-5">
            <Wordmark size="lg" />
            <p className="mt-8 font-medium uppercase text-eyebrow text-accent">
              Luxury Residences <span className="mx-2 text-muted">|</span> Neopolis, Kokapet, Hyderabad
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 lg:col-span-2 lg:col-start-7">
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-small text-muted transition-colors duration-(--duration-base) hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3 lg:col-start-10">
            <ul className="space-y-3 text-small">
              <FooterContact />
              <li>
                <Link href="/#enquire" className="text-muted hover:text-fg">Enquire</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-fg">Privacy policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-fg">Terms &amp; conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="mt-20" />

        <div className="mt-8 grid gap-6 text-caption text-muted md:grid-cols-2">
          <div className="space-y-2">
            <p>© MSN. All rights reserved.</p>
            {project.rera && (
              <p>
                RERA registration:{" "}
                {project.rera.url ? (
                  <a href={project.rera.url} className="underline underline-offset-4" target="_blank" rel="noopener">
                    {project.rera.number}
                  </a>
                ) : (
                  project.rera.number
                )}
              </p>
            )}
          </div>
          <p className="max-w-[60ch] md:justify-self-end">
            Prices, sizes and specifications shown are indicative. {pricingDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
