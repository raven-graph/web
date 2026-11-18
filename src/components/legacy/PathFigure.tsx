import { COLOR, FONT } from "@/lib/landing/tokens";

type Pt = { x: number; y: number; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end" };

// The example from the opening paragraph, drawn as a path through a small
// graph. Positions are hand-placed. There are no weights or lags here on
// purpose: we have no measured numbers to show yet.
const PATH: Pt[] = [
  { x: 90, y: 160, label: "10Y yield", lx: 78, ly: 165, anchor: "end" },
  { x: 220, y: 100, label: "Bank equities", lx: 220, ly: 84 },
  { x: 385, y: 175, label: "Credit spreads", lx: 385, ly: 201 },
  { x: 535, y: 105, label: "Crypto", lx: 535, ly: 89 },
];

const OTHER: Record<string, Pt> = {
  vol: { x: 110, y: 45, label: "Volatility", lx: 110, ly: 29 },
  tech: { x: 350, y: 45, label: "Tech equities", lx: 350, ly: 29 },
  fut: { x: 170, y: 255, label: "Index futures", lx: 170, ly: 281 },
  energy: { x: 340, y: 250, label: "Energy equities", lx: 340, ly: 276 },
  stable: { x: 520, y: 240, label: "Stablecoins", lx: 520, ly: 266 },
};

const P = { rates: PATH[0], banks: PATH[1], credit: PATH[2], crypto: PATH[3] };
const FAINT: [Pt, Pt][] = [
  [OTHER.vol, P.rates],
  [OTHER.vol, OTHER.tech],
  [OTHER.tech, P.crypto],
  [OTHER.tech, P.credit],
  [P.rates, OTHER.fut],
  [OTHER.fut, P.banks],
  [OTHER.fut, OTHER.energy],
  [OTHER.energy, OTHER.stable],
  [P.crypto, OTHER.stable],
];

// Stop a path segment short of the target node so the arrowhead sits clear.
function shorten(a: Pt, b: Pt, by: number) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: b.x - ((b.x - a.x) / d) * by, y: b.y - ((b.y - a.y) / d) * by };
}

export function PathFigure() {
  return (
    <svg
      viewBox="0 0 600 300"
      role="img"
      aria-label="A graph of market nodes. A highlighted path runs from the 10-year yield to bank equities, then credit spreads, then crypto."
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker id="rg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={COLOR.cobaltLight} />
        </marker>
      </defs>
      {FAINT.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.13)" strokeWidth={1} />
      ))}
      {PATH.slice(0, -1).map((a, i) => {
        const e = shorten(a, PATH[i + 1], 9);
        return (
          <line key={i} x1={a.x} y1={a.y} x2={e.x} y2={e.y} stroke={COLOR.cobaltLight} strokeWidth={1.6} markerEnd="url(#rg-arrow)" />
        );
      })}
      {Object.values(OTHER).map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={4.5} fill="#0B0C11" stroke="#5C606F" strokeWidth={1.2} />
          <text x={n.lx} y={n.ly} textAnchor={n.anchor ?? "middle"} fill="#7B7F8E" fontFamily={FONT.sans} fontSize={15}>
            {n.label}
          </text>
        </g>
      ))}
      {PATH.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={5} fill={COLOR.cobaltLight} />
          <text x={n.lx} y={n.ly} textAnchor={n.anchor ?? "middle"} fill="#ECEDF1" fontFamily={FONT.sans} fontSize={15} fontWeight={500}>
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
