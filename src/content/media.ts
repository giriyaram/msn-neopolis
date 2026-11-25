/**
 * Media registry.
 *
 * Every visual on the landing page reads from here. A `null` slot or empty
 * list renders a deliberate typographic treatment instead of an image.
 *
 * Two kinds of imagery, never mixed up:
 *  - Project renders (`public/media/*.webp`) — supplied for MSN Neopolis and
 *    always labelled "Artist's impression".
 *  - Context photography (`public/media/stock/*`, Unsplash License) — real
 *    places in Hyderabad and representative materials. Always labelled
 *    "Representative imagery" with a credit, and never used to depict the
 *    project itself.
 *
 * Width and height must be the file's intrinsic pixel size (prevents layout
 * shift). See docs/LANDING_PAGE.md for the full list of slots.
 */

export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position for cropped frames, e.g. "50% 20%". */
  position?: string;
};

export type CaptionedAsset = MediaAsset & { caption: string };

/** Third-party photograph: shown with a credit, never as the project. */
export type StockAsset = CaptionedAsset & { credit: string };

export type FloorPlanAsset = {
  /** Plan image (PNG/WebP/JPG). */
  image?: MediaAsset;
  /** Official PDF, if supplied. */
  pdf?: string;
};

export const RENDER_LABEL = "Artist’s impression";
export const STOCK_LABEL = "Representative imagery";

const aerial: MediaAsset = {
  src: "/media/neopolis-aerial-dusk.webp",
  width: 3277,
  height: 1834,
  alt: "Aerial view at dusk of the three MSN Neopolis towers, linked at the top by sky bridges and crowned with pavilions, above a green landscape",
};

export const media: {
  /** Official tower elevation render — hero and Open Graph. */
  hero: MediaAsset | null;
  /** Optional portrait crop of the hero for phones. */
  heroMobile: MediaAsset | null;
  /** Cinematic frame opening the architecture section. */
  architecture: MediaAsset | null;
  /** Individual tower renders — enables the Tower A/B/C selector. */
  towers: { A: MediaAsset | null; B: MediaAsset | null; C: MediaAsset | null };
  /** Landscape render beside the overview figures. */
  overview: CaptionedAsset | null;
  /** Interior renders shown with the residences. */
  interiors: CaptionedAsset[];
  skyPavilions: CaptionedAsset[];
  amenities: CaptionedAsset[];
  /** Hyderabad context photography for the location section. */
  location: { band: StockAsset | null; district: StockAsset | null };
  /** Representative material photography for the specifications. */
  materials: { flooring: StockAsset | null; bath: StockAsset | null };
  /**
   * Blurred teaser shown for every 3 & 4 BHK size until the visitor requests
   * the plan. The blur is baked into the file; the clear original is kept
   * outside /public (assets/floor-plans/) so it is never served.
   */
  floorPlanPreview: MediaAsset | null;
  /** Clear official plans, keyed by apartment size in SFT. Shown un-gated. */
  floorPlans: Partial<Record<number, FloorPlanAsset>>;
  /** Official brochure PDF. */
  brochure: string | null;
} = {
  hero: aerial,
  heroMobile: null,
  architecture: { ...aerial, position: "50% 18%" },
  towers: { A: null, B: null, C: null },

  overview: {
    src: "/media/courtyard.webp",
    width: 1200,
    height: 840,
    alt: "Landscaped courtyard with shade trees, lounge seating and a reflecting pool between residential buildings",
    caption: "Landscaped courtyard",
  },

  interiors: [
    {
      src: "/media/living-room.webp",
      width: 1200,
      height: 840,
      alt: "Living room with a curved sofa, timber-fluted walls, marble floor and a sculptural ring chandelier",
      caption: "Living room",
    },
    {
      src: "/media/bedroom.webp",
      width: 1200,
      height: 840,
      alt: "Bedroom with a low upholstered bed, timber-panelled wall and a glass-fronted walk-in wardrobe",
      caption: "Bedroom",
    },
  ],

  skyPavilions: [
    {
      src: "/media/sky-pavilions-west.webp",
      width: 1400,
      height: 900,
      alt: "A cantilevered pavilion crowning a tower, joined to its neighbour by a lattice sky bridge",
      caption: "Pavilion and sky bridge",
    },
    {
      src: "/media/sky-pavilions-east.webp",
      width: 1400,
      height: 900,
      alt: "Rooftop pavilions and a sky bridge with a lit pool deck between two towers at dusk",
      caption: "Sky bridge deck at dusk",
    },
  ],

  amenities: [
    {
      src: "/media/pool-deck.webp",
      width: 1200,
      height: 840,
      alt: "Pool deck with timber decking, sun loungers and shade trees beside a glass-fronted building",
      caption: "Pool deck",
    },
    {
      src: "/media/clubhouse-lounge.webp",
      width: 600,
      height: 400,
      alt: "Clubhouse lounge and bar opening onto a pool terrace with a fire feature at dusk",
      caption: "Clubhouse lounge",
    },
    {
      src: "/media/cafe-terrace.webp",
      width: 1200,
      height: 840,
      alt: "Outdoor terrace with woven lounge chairs and flowering planters at sunset",
      caption: "Terrace seating",
    },
    {
      src: "/media/garden-terrace.webp",
      width: 1200,
      height: 840,
      alt: "Garden terrace with lawns, umbrellas and seating outside a glazed pavilion",
      caption: "Garden terrace",
    },
  ],

  location: {
    band: {
      src: "/media/stock/hyderabad-durgam-cheruvu-night.webp",
      width: 2400,
      height: 1800,
      alt: "Lit office buildings reflected in Durgam Cheruvu lake, Hyderabad, at night",
      position: "50% 28%",
      caption: "Durgam Cheruvu, Hyderabad",
      credit: "Rishabh Modi / Unsplash",
    },
    district: {
      src: "/media/stock/hitec-city-knowledge-park.webp",
      width: 1600,
      height: 2132,
      alt: "Glass office towers at Knowledge Park, HITEC City, lit at night",
      caption: "HITEC City, Hyderabad",
      credit: "Himanshu Bag / Unsplash",
    },
  },

  materials: {
    flooring: {
      src: "/media/stock/marble-texture.webp",
      width: 1600,
      height: 2400,
      alt: "Close-up of pale veined marble",
      caption: "Marble",
      credit: "Augustine Wong / Unsplash",
    },
    bath: {
      src: "/media/stock/bathroom-stone-timber.webp",
      width: 1400,
      height: 1866,
      alt: "Bathroom with a stone vessel basin, black fittings, timber panelling and a tall arched mirror",
      caption: "Bath fittings",
      credit: "Ela De Pure / Unsplash",
    },
  },

  floorPlanPreview: {
    src: "/media/floor-plan-preview.webp",
    width: 1200,
    height: 900,
    alt: "Blurred preview of a residence floor plan",
  },
  floorPlans: {},
  brochure: null,
};
