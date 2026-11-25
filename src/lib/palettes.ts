/**
 * Palette directions for MSN Neopolis.
 *
 * Every palette fills the same roles, so any of them drops into the design
 * system unchanged. Roles map onto the existing tokens:
 *
 *   canvas  → --color-canvas     (page background)
 *   surface → --color-panel      (raised panels, alternate sections)
 *   deep    → --color-deep       (dark sections, primary buttons, scrims)
 *   ink     → --color-ink        (primary text)
 *   muted   → --color-ink-muted  (secondary text — AA on canvas & surface)
 *   stone   → --color-stone      (placeholders, disabled)
 *   accent  → --color-accent     (rules, numerals, labels on deep)
 *   line / lineStrong            (hairlines, field underlines)
 *
 * Forest & Brass is the adopted palette and lives in globals.css.
 * The others are kept for comparison on the design-system page.
 */

export type Role =
  | "canvas"
  | "surface"
  | "deep"
  | "ink"
  | "muted"
  | "stone"
  | "accent"
  | "line"
  | "lineStrong";

export type Palette = {
  id: string;
  name: string;
  mood: string;
  inspiration: string;
  /** Evocative names for the hero colours. */
  names: Partial<Record<Role, string>>;
  colors: Record<Role, string>;
};

function mix(a: string, b: string, weightOfB: number) {
  const pa = Number.parseInt(a.slice(1), 16);
  const pb = Number.parseInt(b.slice(1), 16);
  const ch = (n: number, s: number) => (n >> s) & 255;
  const out = [16, 8, 0].map((s) =>
    Math.round(ch(pa, s) * (1 - weightOfB) + ch(pb, s) * weightOfB)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${out.join("")}`.toUpperCase();
}

type Def = Omit<Palette, "colors"> & {
  colors: Omit<Record<Role, string>, "line" | "lineStrong"> &
    Partial<Pick<Record<Role, string>, "line" | "lineStrong">>;
};

function define(def: Def): Palette {
  const { canvas, deep } = def.colors;
  return {
    ...def,
    colors: {
      ...def.colors,
      line: def.colors.line ?? mix(canvas, deep, 0.11),
      lineStrong: def.colors.lineStrong ?? mix(canvas, deep, 0.24),
    },
  };
}

export const palettes: Palette[] = [
  define({
    id: "forest",
    name: "Forest & Brass",
    mood: "The adopted palette. Quiet, botanical, resort-like — nature and privacy, closest to hospitality.",
    inspiration: "Rain-dark foliage, aged brass, lichen on stone",
    names: { canvas: "Sage Stone", surface: "Pale Lichen", deep: "Deep Forest", accent: "Aged Brass" },
    colors: {
      canvas: "#DDE1D4",
      surface: "#E8EBE0",
      deep: "#1C2B23",
      ink: "#1A231E",
      muted: "#525A51",
      stone: "#7A8177",
      accent: "#B08D57",
      line: "#C8CDC1",
      lineStrong: "#AFB5AA",
    },
  }),
  define({
    id: "ivory",
    name: "Ivory & Charcoal",
    mood: "The previous base. Gallery-neutral and safe, but shared by most luxury sites.",
    inspiration: "Gallery walls, black steel",
    names: { canvas: "Warm Ivory", surface: "Pure White", deep: "Deep Charcoal", accent: "Muted Champagne" },
    colors: {
      canvas: "#F7F5F0",
      surface: "#FFFFFF",
      deep: "#171918",
      ink: "#222222",
      muted: "#6B6B6B",
      stone: "#777777",
      accent: "#B59A72",
      line: "#E7E3DC",
      lineStrong: "#CFC9BF",
    },
  }),
  define({
    id: "midnight",
    name: "Midnight & Bronze",
    mood: "Urban, nocturnal, tailored. A skyline at night — confident and corporate-luxe.",
    inspiration: "Lake water after dusk, bronze fittings, mist",
    names: { canvas: "Morning Mist", surface: "Pale Haze", deep: "Midnight", accent: "Burnished Bronze" },
    colors: {
      canvas: "#DEE2E4",
      surface: "#E9ECED",
      deep: "#111A2A",
      ink: "#141B26",
      muted: "#505965",
      stone: "#77808A",
      accent: "#B08A5A",
    },
  }),
  define({
    id: "oxblood",
    name: "Oxblood & Sandstone",
    mood: "Heritage and warmth. Deccan stone and lacquer — rooted in Hyderabad, never generic.",
    inspiration: "Deccan sandstone, oxblood lacquer, ochre",
    names: { canvas: "Sandstone", surface: "Pale Sand", deep: "Oxblood", accent: "Ochre Gold" },
    colors: {
      canvas: "#E8DCCB",
      surface: "#F1E8DC",
      deep: "#451B1D",
      ink: "#2A1917",
      muted: "#665246",
      stone: "#8C786B",
      accent: "#C9A06A",
    },
  }),
  define({
    id: "olive",
    name: "Olive & Terracotta",
    mood: "Earthy, sunlit, Mediterranean. Handmade and relaxed rather than formal.",
    inspiration: "Fired clay, olive groves, lime plaster",
    names: { canvas: "Raw Clay", surface: "Lime Plaster", deep: "Dark Olive", accent: "Terracotta" },
    colors: {
      canvas: "#DCCBB9",
      surface: "#E7DACC",
      deep: "#2D3124",
      ink: "#26241D",
      muted: "#594F42",
      stone: "#7C705F",
      accent: "#D08A5F",
    },
  }),
  define({
    id: "slate",
    name: "Slate & Celadon",
    mood: "Cool, serene, spa-like. Calm and contemporary — water, glaze and shade.",
    inspiration: "Celadon glaze, wet slate, still water",
    names: { canvas: "Sea Mist", surface: "Pale Glaze", deep: "Wet Slate", accent: "Celadon" },
    colors: {
      canvas: "#D9E0DD",
      surface: "#E5EAE8",
      deep: "#22303A",
      ink: "#1B252C",
      muted: "#4C595E",
      stone: "#75817F",
      accent: "#9BBDAE",
    },
  }),
  define({
    id: "aubergine",
    name: "Aubergine & Rose Gold",
    mood: "Evening, intimate, fashion-house. The most distinctive — and the most daring.",
    inspiration: "Velvet, rose gold, mauve stone",
    names: { canvas: "Mauve Stone", surface: "Pale Blush", deep: "Aubergine", accent: "Rose Gold" },
    colors: {
      canvas: "#E6DCD8",
      surface: "#EFE7E4",
      deep: "#2B1B28",
      ink: "#261A22",
      muted: "#62525C",
      stone: "#8A7A83",
      accent: "#C9A089",
    },
  }),
];

export const defaultPaletteId = "forest";

/** CSS custom properties a palette overrides. */
export function paletteVariables(p: Palette): Record<string, string> {
  const c = p.colors;
  return {
    "--color-canvas": c.canvas,
    "--color-panel": c.surface,
    "--color-deep": c.deep,
    "--color-ink": c.ink,
    "--color-ink-muted": c.muted,
    "--color-stone": c.stone,
    "--color-accent": c.accent,
    "--color-line": c.line,
    "--color-line-strong": c.lineStrong,
    "--color-on-deep-muted": `color-mix(in srgb, ${c.canvas} 70%, transparent)`,
    "--color-line-deep": `color-mix(in srgb, ${c.canvas} 16%, transparent)`,
  };
}

/** Maps the documented token utilities to palette roles. */
export const utilityRole: Record<string, Role> = {
  canvas: "canvas",
  panel: "surface",
  deep: "deep",
  ink: "ink",
  "ink-muted": "muted",
  stone: "stone",
  accent: "accent",
  line: "line",
};
