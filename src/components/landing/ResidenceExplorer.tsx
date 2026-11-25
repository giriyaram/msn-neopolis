"use client";

import { useEffect, useRef } from "react";
import { configurations, towerGroups, type ConfigurationId } from "@/content/project";
import { track, trackOnce } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { displayConfiguration, setConfiguration, setSize, useSelection } from "@/lib/selection-store";
import { ButtonLink } from "@/components/ui/Button";
import { Segmented } from "./Segmented";
import { EnquiryLink } from "./EnquiryLink";

const tabs = (Object.keys(configurations) as ConfigurationId[]).map((id) => ({
  value: id,
  label: configurations[id].label,
}));

export function ResidenceExplorer() {
  const selection = useSelection();
  const config = displayConfiguration(selection);
  const data = configurations[config];
  const sizes = data.sizes;
  const selectedSize = typeof selection.size === "number" && sizes.includes(selection.size) ? selection.size : null;
  const panelRef = useRef<HTMLDivElement>(null);

  // view_item: once per configuration, when its panel is actually on screen.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // No price in the event: per-unit pricing is shared only in the cost sheet.
        trackOnce(`view_item_${config}`, "view_item", {
          items: [{ item_id: config, item_name: `MSN Neopolis ${data.label}`, item_category: "Residence" }],
        });
      },
      // Fires when the panel crosses the middle of the viewport — works for
      // panels taller than the screen on phones.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [config, data.label]);

  function chooseConfiguration(value: string) {
    setConfiguration(value as ConfigurationId);
    track("select_configuration", { configuration: value, location: "residences" });
  }

  function chooseSize(size: number) {
    setSize(size);
    track("select_configuration", { configuration: config, size_sft: size, location: "residences" });
  }

  return (
    <div ref={panelRef} className="grid-12 gap-y-12">
      <div className="col-span-full lg:col-span-4">
        <Segmented legend="Configuration" options={tabs} value={config} onChange={chooseConfiguration} />

        <p className="mt-10 font-medium uppercase text-eyebrow text-muted">Apartment sizes</p>
        <p className="mt-3 font-serif font-light text-heading tabular-nums">
          {sizes[0].toLocaleString("en-IN")}
          <span className="text-muted">–</span>
          {sizes[sizes.length - 1].toLocaleString("en-IN")}
          <span className="ml-2 font-serif text-title italic text-muted">SFT</span>
        </p>
        <p className="mt-2 text-small text-muted">
          {sizes.length} sizes · {data.name.toLowerCase()}
        </p>
      </div>

      <div className="col-span-full lg:col-span-7 lg:col-start-6" aria-live="polite">
        {/* Sizes */}
        <fieldset>
          <legend className="font-medium uppercase text-eyebrow text-muted">
            Select your preferred size
          </legend>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={selectedSize === size}
                onClick={() => chooseSize(size)}
                className={cn(
                  "min-h-12 border px-3 text-small tabular-nums transition-colors duration-(--duration-base) ease-luxe",
                  selectedSize === size
                    ? "border-strong bg-strong text-surface"
                    : "border-rule hover:border-strong",
                )}
              >
                {size.toLocaleString("en-IN")}
                <span className="sr-only"> SFT</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Towers — heights only; pricing is shared in the official cost sheet. */}
        <dl className="mt-10 border-t border-rule">
          {towerGroups.map((group) => (
            <div key={group.id} className="flex items-baseline justify-between gap-6 border-b border-rule py-5">
              <dt className="font-serif text-title">{group.label}</dt>
              <dd className="text-right">
                <span className="font-serif text-subheading tabular-nums">{group.floorToFloorFt} ft</span>
                <span className="block text-caption text-muted">Floor-to-floor height</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-caption text-muted">
          Tower-wise availability of each size and the official cost sheet are shared by the MSN team.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="#floor-plans" arrow>
            View floor plans
          </ButtonLink>
          <EnquiryLink intent="floor-plans" configuration={config} variant="secondary" arrow={false}>
            Request {data.label} floor plans
          </EnquiryLink>
        </div>
      </div>
    </div>
  );
}
