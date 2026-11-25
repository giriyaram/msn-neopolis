/**
 * TypeScript mirror of the design tokens, used to document the system.
 * Source of truth for styling is `src/app/globals.css` — keep both in sync.
 */

export const colors = [
  {
    name: "Sage Stone",
    token: "--color-canvas",
    utility: "canvas",
    hex: "#DDE1D4",
    role: "Page background. Reads as stone and foliage rather than paper.",
  },
  {
    name: "Pale Lichen",
    token: "--color-panel",
    utility: "panel",
    hex: "#E8EBE0",
    role: "Raised panels and alternate sections — lifts content without white.",
  },
  {
    name: "Deep Forest",
    token: "--color-deep",
    utility: "deep",
    hex: "#1C2B23",
    role: "Dark sections, primary buttons, photographic scrims, the footer.",
  },
  {
    name: "Moss Ink",
    token: "--color-ink",
    utility: "ink",
    hex: "#1A231E",
    role: "Headlines and body copy on light surfaces.",
  },
  {
    name: "Lichen Grey",
    token: "--color-ink-muted",
    utility: "ink-muted",
    hex: "#525A51",
    role: "Secondary text — captions, hints, meta. AA on canvas and panel.",
  },
  {
    name: "Weathered Stone",
    token: "--color-stone",
    utility: "stone",
    hex: "#7A8177",
    role: "Placeholders and disabled states only — not for reading text.",
  },
  {
    name: "Aged Brass",
    token: "--color-accent",
    utility: "accent",
    hex: "#B08D57",
    role: "Accent only — hairline rules, numerals, labels on deep forest.",
  },
  {
    name: "Moss Line",
    token: "--color-line",
    utility: "line",
    hex: "#C8CDC1",
    role: "Dividers, hairlines, image placeholders.",
  },
] as const;

export const typeScale = [
  {
    name: "Display",
    utility: "text-display",
    family: "Cormorant Garamond · Light 300",
    size: "52 → 136px",
    leading: "0.96",
    sample: "Architecture, quietly.",
    className: "font-serif font-light text-display",
  },
  {
    name: "Heading",
    utility: "text-heading",
    family: "Cormorant Garamond · Light 300",
    size: "40 → 80px",
    leading: "1.04",
    sample: "Residences shaped by light",
    className: "font-serif font-light text-heading",
  },
  {
    name: "Subheading",
    utility: "text-subheading",
    family: "Cormorant Garamond · Regular 400",
    size: "28 → 44px",
    leading: "1.14",
    sample: "A private address above the city",
    className: "font-serif text-subheading",
  },
  {
    name: "Title",
    utility: "text-title",
    family: "Cormorant Garamond · Medium 500",
    size: "22 → 28px",
    leading: "1.25",
    sample: "The Sky Residences",
    className: "font-serif font-medium text-title",
  },
  {
    name: "Lead",
    utility: "text-lead",
    family: "Inter · Light 300",
    size: "18 → 22px",
    leading: "1.6",
    sample:
      "Every residence is planned around a single idea: that the view, the light and the silence are the true luxuries.",
    className: "font-light text-lead max-w-prose",
  },
  {
    name: "Body",
    utility: "text-body",
    family: "Inter · Regular 400",
    size: "16 → 17px",
    leading: "1.75",
    sample:
      "Floor-to-ceiling glazing frames the western skyline, while deep balconies temper the afternoon sun. Interiors are deliberately restrained, allowing natural stone, oak and linen to carry the space.",
    className: "text-body max-w-prose",
  },
  {
    name: "Eyebrow",
    utility: "text-eyebrow",
    family: "Inter · Medium 500 · Uppercase",
    size: "12px · +0.22em",
    leading: "1.4",
    sample: "Kokapet, Hyderabad",
    className: "font-medium uppercase text-eyebrow",
  },
  {
    name: "Caption",
    utility: "text-caption",
    family: "Inter · Regular 400",
    size: "13px",
    leading: "1.5",
    sample: "Fig. 03 — West façade at golden hour. Artist’s impression.",
    className: "text-caption text-muted",
  },
  {
    name: "Button",
    utility: "text-button",
    family: "Inter · Medium 500 · Uppercase",
    size: "13px · +0.16em",
    leading: "1",
    sample: "Arrange a private viewing",
    className: "font-medium uppercase text-button",
  },
] as const;

export const spacing = [
  { token: "1", px: 4, use: "Icon gaps" },
  { token: "2", px: 8, use: "Tight label gaps" },
  { token: "4", px: 16, use: "Eyebrow → heading" },
  { token: "6", px: 24, use: "Heading → paragraph" },
  { token: "8", px: 32, use: "Paragraph → action" },
  { token: "12", px: 48, use: "Component groups" },
  { token: "16", px: 64, use: "Block separation" },
  { token: "24", px: 96, use: "Section · mobile" },
  { token: "44", px: 176, use: "Section · desktop" },
] as const;

export const layoutTokens = [
  { token: "--container-content", value: "1320px", use: "Standard content width" },
  { token: "--container-wide", value: "1600px", use: "Wide editorial compositions" },
  { token: "--container-prose", value: "640px", use: "Long-form reading" },
  { token: "--container-measure", value: "544px", use: "Short copy set beside imagery" },
  { token: "--gutter", value: "20 → 48px", use: "Page margin, fluid" },
  { token: "--grid-gap", value: "16 → 28px", use: "Column gap, fluid" },
  { token: "--section-y", value: "96 → 176px", use: "Vertical section padding" },
  { token: "--section-y-sm", value: "64 → 112px", use: "Compact section padding" },
] as const;

export const breakpoints = [
  { name: "Mobile", range: "< 768px", columns: 4, note: "Single-column stacks, 20px margins" },
  { name: "Tablet", range: "768 – 1023px", columns: 8, note: "Paired compositions, 32px margins" },
  { name: "Desktop", range: "≥ 1024px", columns: 12, note: "Asymmetric editorial grid, 48px margins" },
] as const;

export const motionTokens = [
  { token: "--ease-luxe", value: "cubic-bezier(.22, 1, .36, 1)", use: "All reveals and hovers" },
  { token: "--duration-fast", value: "200ms", use: "Colour changes, checkboxes" },
  { token: "--duration-base", value: "450ms", use: "Buttons, header, links" },
  { token: "--duration-slow", value: "900ms", use: "Panels, image cross-fades" },
  { token: "--duration-image", value: "1400ms", use: "Image hover zoom" },
] as const;
