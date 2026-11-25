import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { Divider } from "@/components/ui/Divider";
import type { NavLink } from "./navigation";
import { primaryNav } from "./navigation";

export function Footer({ links = primaryNav }: { links?: NavLink[] }) {
  return (
    <footer className="tone-deep pt-24 pb-28 lg:pb-16">
      <div className="container-content">
        <div className="grid-12 gap-y-14">
          <div className="col-span-full lg:col-span-5">
            <Wordmark size="lg" />
            <p className="mt-10 max-w-[30ch] font-serif text-title font-light text-fg">
              Luxury residences in Kokapet, Hyderabad.
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 lg:col-span-2 lg:col-start-7">
            <p className="font-medium uppercase text-eyebrow text-accent">Explore</p>
            <ul className="mt-6 space-y-3">
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
            <p className="font-medium uppercase text-eyebrow text-accent">Sales Gallery</p>
            <address className="mt-6 text-small not-italic text-muted">
              Kokapet, Hyderabad
              <br />
              Telangana, India
            </address>
            <p className="mt-4 text-small text-muted">By appointment</p>
          </div>
        </div>

        <Divider className="mt-20" />

        <div className="mt-8 flex flex-col gap-4 text-caption text-muted md:flex-row md:justify-between">
          <p>© 2026 MSN. All rights reserved.</p>
          <p className="max-w-[60ch]">
            Images are artist’s impressions for illustration only. RERA registration details to be
            confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
