import Image from "next/image";
import { images } from "@/lib/images";
import { Display, Eyebrow, Lead } from "@/components/ui/Typography";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="tone-overlay relative flex min-h-[40rem] h-svh items-end overflow-hidden bg-deep"
    >
      <Image
        src={images.towersDusk.src}
        alt={images.towersDusk.alt}
        fill
        preload
        sizes="100vw"
        className="animate-fade object-cover saturate-[.7] brightness-90"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-deep/55 via-deep/15 to-deep/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-deep/50 via-transparent to-deep/40"
      />
      {/* Portrait crops expose more sky behind the type — deepen on phones. */}
      <div aria-hidden className="absolute inset-0 bg-deep/25 md:hidden" />

      <div className="container-content relative pb-16 lg:pb-24">
        <div className="grid-12 gap-y-10">
          <div className="col-span-full lg:col-span-9">
            <Eyebrow rule className="animate-rise" style={delay(150)}>
              Design System · Version 1.0
            </Eyebrow>
            <Display id="hero-title" className="mt-8 animate-rise" style={delay(300)}>
              The architecture <em>of calm.</em>
            </Display>
          </div>
          <div className="col-span-full self-end md:col-span-5 lg:col-span-3">
            <Lead className="animate-rise text-canvas/85" style={delay(500)}>
              The visual language of MSN Neopolis, Kokapet — colour, type, composition and motion
              for a residence of international standing.
            </Lead>
          </div>
        </div>

        <div
          className="mt-16 flex items-center justify-between border-t border-rule pt-6 text-caption text-muted animate-rise"
          style={delay(700)}
        >
          <span>Kokapet, Hyderabad</span>
          <a href="#overview" className="inline-flex items-center gap-3 transition-colors hover:text-fg">
            Scroll to begin
            <span aria-hidden className="block h-6 w-px bg-current" />
          </a>
        </div>
      </div>
    </section>
  );
}
