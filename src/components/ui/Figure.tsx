import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FigureRatio = "cinema" | "video" | "landscape" | "square" | "portrait" | "tall";

const ratios: Record<FigureRatio, string> = {
  cinema: "aspect-cinema", // 21:9 — full-bleed architectural panoramas
  video: "aspect-video", // 16:9 — wide editorial
  landscape: "aspect-landscape", // 3:2 — standard photography
  square: "aspect-square", // 1:1 — detail crops
  portrait: "aspect-portrait", // 4:5 — façades, interiors beside text
  tall: "aspect-tall", // 3:4 — tall towers
};

type FigureProps = {
  src: string;
  alt: string;
  ratio?: FigureRatio;
  /** Responsive `sizes` hint — always set this to the rendered width. */
  sizes: string;
  caption?: ReactNode;
  /** Right-aligned caption meta, e.g. "Fig. 02" or "Artist’s impression". */
  meta?: ReactNode;
  /** Slow zoom on hover. Use on images that link somewhere. */
  zoom?: boolean;
  /** Scroll-linked settle (scale 1.08 → 1) as the image enters view. */
  reveal?: boolean;
  /** Load immediately — only for the first image in the viewport. */
  preload?: boolean;
  /** Bottom gradient so overlaid text stays legible. */
  scrim?: boolean;
  /** Content positioned over the image (requires `scrim` for legibility). */
  overlay?: ReactNode;
  /** CSS object-position — the focal point kept in frame when cropped. */
  position?: string;
  className?: string;
  frameClassName?: string;
};

export function Figure({
  src,
  alt,
  ratio = "landscape",
  sizes,
  caption,
  meta,
  zoom = false,
  reveal = true,
  preload = false,
  scrim = false,
  overlay,
  position,
  className,
  frameClassName,
}: FigureProps) {
  return (
    <figure className={cn("group/figure", className)}>
      <div
        data-reveal={reveal ? "image" : undefined}
        className={cn("relative overflow-hidden bg-line", ratios[ratio], frameClassName)}
      >
        <div
          className={cn(
            "absolute inset-0",
            zoom &&
              // Zooms when the figure — or a wrapping `group` link — is hovered.
              "transition-transform duration-(--duration-image) ease-luxe group-hover:scale-[1.035] group-hover/figure:scale-[1.035]",
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        </div>
        {scrim && (
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-deep/70 via-deep/10 to-transparent"
          />
        )}
        {overlay && <div className="tone-overlay absolute inset-0">{overlay}</div>}
      </div>
      {(caption || meta) && (
        <figcaption className="mt-4 flex items-baseline justify-between gap-6 text-caption text-muted">
          <span>{caption}</span>
          {meta && <span className="shrink-0 tabular-nums">{meta}</span>}
        </figcaption>
      )}
    </figure>
  );
}
