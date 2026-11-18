import { COLOR, FONT } from "@/lib/landing/tokens";

/** Eyebrow: cobalt rule + mono uppercase label. */
export function Kicker({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 22,
      }}
    >
      <span style={{ width: 22, height: 1, background: COLOR.cobalt }} />
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLOR.cobaltLight,
        }}
      >
        {label}
      </span>
    </div>
  );
}
