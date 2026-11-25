/**
 * Placeholder architectural photography (Unsplash) for the design-system
 * preview. Replace with approved MSN Neopolis renders before launch.
 */

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

export const images = {
  towersDusk: {
    src: unsplash("1431576901776-e539bd916ba2"),
    alt: "Looking up between two glass towers, their floors glowing warm at dusk",
  },
  whiteTower: {
    src: unsplash("1479839672679-a46483c0e7c8"),
    alt: "White residential tower with deep cantilevered balconies against a pale sky",
  },
  curvedFacade: {
    src: unsplash("1518005020951-eccb494ad742"),
    alt: "Sweeping curved façade bands framing a clear sky",
  },
  angularWhite: {
    src: unsplash("1487958449943-2429e8be8625"),
    alt: "Angular white building with a faceted glass curtain wall",
  },
  livingTimber: {
    src: unsplash("1600607687939-ce8a6c25118c"),
    alt: "Open-plan living room with full-height glazing and a timber feature wall",
  },
  livingDouble: {
    src: unsplash("1618221195710-dd6b41faaea6"),
    alt: "Double-height living room with warm timber and clerestory windows",
  },
  poolVilla: {
    src: unsplash("1613490493576-7fde63acd811"),
    alt: "Reflecting pool before a white residence with timber soffits",
  },
  glassStair: {
    src: unsplash("1600573472550-8090b5e0745e"),
    alt: "Floating timber staircase beside floor-to-ceiling glass and a pool terrace",
  },
  bedroom: {
    src: unsplash("1600607687644-c7171b42498f"),
    alt: "Calm bedroom with black-framed doors opening to greenery",
  },
  twilight: {
    src: unsplash("1600585154340-be6161a56a0c"),
    alt: "Contemporary residence glowing at twilight beneath a mature tree",
  },
} as const;

export type ImageAsset = (typeof images)[keyof typeof images];
