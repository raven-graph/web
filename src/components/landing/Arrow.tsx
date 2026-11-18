/** Wayfinding arrow, drawn to sit on the text baseline. */
export function Arrow({ size = 18, back = false }: { size?: number; back?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      style={{ flex: "none", transform: back ? "scaleX(-1)" : undefined }}
    >
      <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="square" />
    </svg>
  );
}
