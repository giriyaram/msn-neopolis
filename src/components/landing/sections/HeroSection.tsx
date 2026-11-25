import Image from "next/image";
import Link from "next/link";
import { media, RENDER_LABEL } from "@/content/media";
import { project, startingPrice } from "@/content/project";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Eyebrow, Lead } from "@/components/ui/Typography";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

const stats = [
  { value: String(project.areaAcres), label: "Acres" },
  { value: String(project.towers), label: "Towers" },
  { value: String(project.floors), label: "Floors" },
  {
    value: `${project.sizeRange.min.toLocaleString("en-IN")}–${project.sizeRange.max.toLocaleString("en-IN")}`,
    label: "SFT residences",
  },
  { value: `${startingPrice.label}*`, label: "Starting price" },
];

export function HeroSection() {
  const hero = media.hero;

  return (
    <section
      aria-labelledby="hero-title"
      className="tone-overlay relative isolate flex min-h-svh items-end overflow-hidden bg-deep pt-(--header-h)"
    >
      {hero ? (
        <>
          <div className="absolute inset-0 -z-10 animate-drift">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              preload
              loading="eager"
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: hero.position ?? "50% 40%" }}
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-deep/70 via-deep/10 to-deep/95" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-deep/60 via-transparent to-transparent" />
          <p className="absolute top-[calc(var(--header-h)+1rem)] right-(--gutter) text-caption text-muted">
            {RENDER_LABEL}
          </p>
        </>
      ) : (
        // No official render yet: a quiet elevation-grid motif, purely decorative.
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-y-0 right-[-10%] w-[70%] opacity-[0.22] [mask-image:linear-gradient(to_left,black,transparent),linear-gradient(to_bottom,transparent,black_30%)] [mask-composite:intersect] md:right-0 md:w-[48%]">
            <div className="flex h-full justify-end gap-[6%] pr-[8%]">
              {[0.5, 0.78, 0.64].map((h, i) => (
                <div
                  key={i}
                  className="w-[18%] self-end border-x border-accent/60"
                  style={{
                    height: `${h * 100}%`,
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--color-accent) 0 1px, transparent 1px 14px)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-deep via-deep/40 to-transparent" />
        </div>
      )}

      <div className="container-content w-full pt-16 pb-12 lg:pb-16">
        <Eyebrow rule className="animate-rise" style={delay(100)}>
          MSN <span aria-hidden className="mx-2 opacity-50">|</span> Neopolis, Kokapet
        </Eyebrow>
        <h1
          id="hero-title"
          className="mt-8 font-serif text-hero font-light text-fg [&_em]:italic"
        >
          <span className="md:block">An Elevated Address.</span> <em className="md:block">An Exceptional Way of Living.</em>
        </h1>
        <Lead className="mt-8 max-w-[40rem] animate-rise text-canvas/85" style={delay(360)}>
          Discover expansive 3 &amp; 4 BHK luxury residences in an iconic 56-storey residential
          development, set across 7 acres in Neopolis, Kokapet.
        </Lead>

        <div className="mt-10 flex animate-rise flex-col gap-3 sm:flex-row sm:gap-4" style={delay(480)}>
          <Link href="#floor-plans" className={buttonClasses({ size: "lg" })}>
            <span>Explore floor plans</span>
            <ArrowRight className="transition-transform duration-(--duration-base) ease-luxe group-hover/button:translate-x-1" />
          </Link>
          <Link href="#pricing" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            View pricing
          </Link>
        </div>

        <dl
          className="mt-14 grid animate-rise grid-cols-2 gap-x-(--grid-gap) gap-y-6 border-t border-rule pt-6 md:grid-cols-3 lg:mt-20 lg:grid-cols-5"
          style={delay(620)}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 font-medium uppercase text-eyebrow text-muted">{s.label}</dt>
              <dd className="order-1 font-serif text-title font-light tabular-nums md:text-subheading">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
