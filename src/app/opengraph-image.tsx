import { ImageResponse } from "next/og";

// Typographic share image. Replace with the official render once supplied
// (media.hero is used automatically by the page's openGraph metadata).
export const alt = "MSN Neopolis, Kokapet — luxury 3 & 4 BHK residences";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#1C2B23",
          color: "#DDE1D4",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28, letterSpacing: 6 }}>
          <span>MSN</span>
          <span style={{ width: 1, height: 32, background: "#DDE1D4", opacity: 0.4 }} />
          <span style={{ fontSize: 18, letterSpacing: 8, fontFamily: "sans-serif" }}>NEOPOLIS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>An Elevated Address.</div>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontStyle: "italic", color: "#B08D57" }}>
            An Exceptional Way of Living.
          </div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 24, fontFamily: "sans-serif", opacity: 0.8 }}>
          <span>3 &amp; 4 BHK · 2,424–4,545 SFT</span>
          <span>Neopolis, Kokapet, Hyderabad</span>
        </div>
      </div>
    ),
    size,
  );
}
