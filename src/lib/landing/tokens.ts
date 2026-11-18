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
