// Design tokens for the RavenGraph landing page.
// Mirrors the design handoff: dark "instrument/terminal" aesthetic, cobalt accent.

export const FONT = {
  serif: "var(--font-spectral), 'Spectral', serif",
  sans: "var(--font-plex-sans), 'IBM Plex Sans', sans-serif",
  mono: "var(--font-plex-mono), 'IBM Plex Mono', monospace",
} as const;

export const COLOR = {
  // data / signal colors
  teal: "#3FB98C", // positive
  rose: "#E2606E", // negative
  amber: "#D8A23B", // shock origin
  // accent
  cobalt: "#2D5BFF",
  cobaltHover: "#1E47E0",
  cobaltLight: "#5C82FF",
  cobaltLighter: "#9DB4FF",
} as const;

export const MAILTO = "mailto:gabriel@ravengraph.com";

export const CONTAINER: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "0 32px",
};

// Transit-map world for the landing page (see PRODUCT.md and the surface brief).
export const MAP = {
  paper: "#F4F5F0",
  ink: "#131A3A",
  inkSoft: "#4A5070",
  onInk: "#FFFFFF",
  onInkSoft: "#C3C8DE",
  rates: "#E0352B",
  equities: "#2450F0",
  credit: "#F5B301",
  crypto: "#0B9E6B",
  futures: "#9333C8",
} as const;

export const SIGN = "var(--font-overpass), 'Overpass', 'Helvetica Neue', Arial, sans-serif";
