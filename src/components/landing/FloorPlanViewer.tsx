"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { configurations, formatSft, type ConfigurationId, type TowerId } from "@/content/project";
import { media, type FloorPlanAsset } from "@/content/media";
import { track, trackOnce } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  displayConfiguration,
  setConfiguration,
  setSize,
  setTower,
  useSelection,
} from "@/lib/selection-store";
import { buttonClasses } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";
import { Segmented } from "./Segmented";
import { EnquiryLink } from "./EnquiryLink";

const configTabs = (Object.keys(configurations) as ConfigurationId[]).map((id) => ({
  value: id,
  label: configurations[id].label,
}));

const towerTabs = (["A", "B", "C"] as TowerId[]).map((t) => ({
  value: t,
  label: `Tower ${t}`,
}));

export function FloorPlanViewer() {
  const selection = useSelection();
  const config = displayConfiguration(selection);
  const sizes = configurations[config].sizes;
  const size = typeof selection.size === "number" && sizes.includes(selection.size) ? selection.size : sizes[0];
  const tower = selection.tower === "A" || selection.tower === "B" || selection.tower === "C" ? selection.tower : null;
  const asset: FloorPlanAsset | undefined = media.floorPlans[size];

  function onConfig(value: string) {
    setConfiguration(value as ConfigurationId);
    track("select_configuration", { configuration: value, location: "floor_plans" });
  }
  function onSize(value: number) {
    setSize(value);
    track("select_configuration", { configuration: config, size_sft: value, location: "floor_plans" });
  }
  function onTower(value: string) {
    setTower(value as TowerId);
    track("select_configuration", { configuration: config, size_sft: size, tower: value, location: "floor_plans" });
  }

  // A plan counts as viewed when an official plan is displayed.
  useEffect(() => {
    if (asset?.image) {
      trackOnce(`floor_plan_${size}`, "view_floor_plan", { configuration: config, size_sft: size, method: "inline" });
    }
  }, [asset, config, size]);

  return (
    <div className="grid-12 gap-y-12">
      <div className="col-span-full space-y-10 lg:col-span-4">
        <Segmented legend="Configuration" options={configTabs} value={config} onChange={onConfig} />

        <fieldset>
          <legend className="mb-3 font-medium uppercase text-eyebrow text-muted">Apartment size (SFT)</legend>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === size}
                onClick={() => onSize(s)}
                className={cn(
                  "min-h-12 border text-small tabular-nums transition-colors duration-(--duration-base) ease-luxe",
                  s === size ? "border-strong bg-strong text-surface" : "border-rule hover:border-strong",
                )}
              >
                {s.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </fieldset>

        <Segmented legend="Tower" options={towerTabs} value={tower} onChange={onTower} />
      </div>

      <div className="col-span-full lg:col-span-8">
        {asset?.image ? (
          <PlanImage asset={asset} config={config} size={size} />
        ) : (
          <PlanRequest config={config} size={size} tower={tower} pdf={asset?.pdf} />
        )}
      </div>
    </div>
  );
}

/**
 * Gated preview: the same blurred plan stands in for every 3 & 4 BHK size
 * until the visitor requests the official plan. The blur is baked into the
 * image file, so the clear plan is never sent to the browser.
 */
function PlanRequest({
  config,
  size,
  tower,
  pdf,
}: {
  config: ConfigurationId;
  size: number;
  tower: TowerId | null;
  pdf?: string;
}) {
  const label = configurations[config].label;
  const preview = media.floorPlanPreview;

  return (
    <figure>
      <div className="relative overflow-hidden border border-rule bg-[#f3f1ec]">
        {preview && (
          <div aria-hidden className="relative aspect-[4/3]">
            <Image
              src={preview.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="scale-105 object-contain"
            />
            <div className="absolute inset-0 bg-linear-to-t from-panel/70 via-panel/10 to-transparent" />
            <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-deep px-3 py-2 font-medium uppercase text-button text-canvas">
              <LockIcon />
              Locked
            </span>
          </div>
        )}

        <div
          className={cn(
            "tone-canvas relative p-6 sm:p-8",
            preview &&
              "border-t border-rule sm:absolute sm:inset-x-8 sm:bottom-8 sm:border sm:shadow-[0_24px_60px_-30px_rgb(28_43_35/0.45)] lg:inset-x-auto lg:right-8 lg:left-8 xl:left-auto xl:w-[30rem]",
          )}
        >
          <p className="flex items-center gap-4 font-medium uppercase text-eyebrow text-muted">
            <span aria-hidden className="h-px w-10 bg-accent" />
            Official floor plan
          </p>
          <h3 className="mt-4 font-serif font-light text-subheading">
            {label} · {formatSft(size)}
            {tower && <em className="text-muted"> · Tower {tower}</em>}
          </h3>
          <p className="mt-3 text-small text-muted">
            Share your name and number to receive the detailed plan, with tower-wise availability.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <EnquiryLink intent="floor-plans" configuration={config} size={size}>
              Unlock this floor plan
            </EnquiryLink>
            {pdf ? (
              <a
                href={pdf}
                target="_blank"
                rel="noopener"
                onClick={() => track("view_floor_plan", { configuration: config, size_sft: size, method: "pdf" })}
                className={buttonClasses({ variant: "text" })}
              >
                View official PDF
              </a>
            ) : (
              <EnquiryLink intent="floor-plans" configuration={config} size="undecided" variant="text" arrow={false}>
                All {label} plans
              </EnquiryLink>
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-caption text-muted">
        Preview blurred and indicative. The official plan for your chosen size is shared by the MSN team.
      </figcaption>
    </figure>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="7" width="10" height="7" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function PlanImage({ asset, config, size }: { asset: FloorPlanAsset; config: ConfigurationId; size: number }) {
  const image = asset.image!;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);

  function open() {
    setZoom(1);
    dialogRef.current?.showModal();
    track("view_floor_plan", { configuration: config, size_sft: size, method: "zoom" });
  }

  return (
    <figure>
      <button
        type="button"
        onClick={open}
        className="group relative block aspect-[4/3] w-full overflow-hidden border border-rule bg-panel"
        aria-label={`Enlarge floor plan: ${image.alt}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain p-4 transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.02]"
        />
        <span className="absolute right-4 bottom-4 bg-deep px-3 py-2 font-medium uppercase text-button text-canvas">
          Enlarge
        </span>
      </button>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4 text-caption text-muted">
        <span>{image.alt}</span>
        <span className="flex gap-6">
          {asset.pdf && (
            <a
              href={asset.pdf}
              target="_blank"
              rel="noopener"
              onClick={() => track("view_floor_plan", { configuration: config, size_sft: size, method: "pdf" })}
              className={buttonClasses({ variant: "text" })}
            >
              Download PDF
            </a>
          )}
          <EnquiryLink intent="floor-plans" configuration={config} size={size} variant="text" arrow={false}>
            Request details
          </EnquiryLink>
        </span>
      </figcaption>

      <dialog ref={dialogRef} aria-label="Floor plan viewer" className="nav-dialog tone-deep">
        <div className="flex h-full flex-col">
          <div className="container-content flex h-16 shrink-0 items-center justify-between gap-4 border-b border-rule">
            <p className="truncate text-small">{image.alt}</p>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="size-11 border border-rule">−</button>
              <span className="w-14 text-center text-caption tabular-nums" aria-live="polite">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="size-11 border border-rule">+</button>
              <button type="button" onClick={() => dialogRef.current?.close()} className="ml-2 inline-flex h-11 items-center gap-2 px-2 font-medium uppercase text-button">
                Close <CloseIcon />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-panel">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={`${Math.round(zoom * 100)}vw`}
              style={{ width: `${zoom * 100}%`, height: "auto", maxWidth: "none" }}
              className="mx-auto"
            />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
