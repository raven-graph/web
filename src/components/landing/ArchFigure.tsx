import { MAP, SIGN } from "@/lib/landing/tokens";

// Architecture figures, drawn in the map's vocabulary. Schematic only.

type P = [number, number];
const FAR = 4000;
const HUB: P = [380, 150];

const IN: { name: string; color: string; y: number }[] = [
  { name: "Rates", color: MAP.rates, y: 30 },
  { name: "Equities", color: MAP.equities, y: 90 },
  { name: "Credit", color: MAP.credit, y: 150 },
  { name: "Crypto", color: MAP.crypto, y: 210 },
  { name: "Futures", color: MAP.futures, y: 270 },
];

function track(pts: P[], r = 30): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const a = Math.hypot(x - px, y - py);
    const b = Math.hypot(nx - x, ny - y);
    const ra = Math.min(r, a / 2);
    const rb = Math.min(r, b / 2);
    d += ` L${x - ((x - px) / a) * ra} ${y - ((y - py) / a) * ra}`;
    d += ` Q${x} ${y} ${x + ((nx - x) / b) * rb} ${y + ((ny - y) / b) * rb}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]} ${last[1]}`;
}

function Label({ x, y, name, lines }: { x: number; y: number; name: string; lines: string[] }) {
  return (
    <text x={x} y={y} fontFamily={SIGN} fill={MAP.ink}>
      <tspan fontSize={21} fontWeight={800}>{name}</tspan>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 25 : 22} fontSize={16} fill={MAP.inkSoft}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

/** Five lines run into one model and leave as one track that forks. */
export function MergeFigure() {
  return (
    <svg
      viewBox="0 0 1240 360"
      className="rg-merge"
      role="img"
      aria-label="The market graph's five lines (rates, equities, credit, crypto, futures) run into the THGAT. One track leaves it for Embeddings, then forks to a world model for agents and to market-aware language models."
    >
      {IN.map((l) => {
        const dy = Math.abs(l.y - HUB[1]);
        const pts: P[] = dy === 0 ? [[-FAR, l.y], HUB] : [[-FAR, l.y], [HUB[0] - dy, l.y], HUB];
        return (
          <g key={l.name}>
            <path d={track(pts)} fill="none" stroke={l.color} strokeWidth={14} strokeLinejoin="round" />
            <text
              x={0}
              y={l.y - 14}
              fontFamily={SIGN}
              fontSize={16}
              fontWeight={700}
              fill={MAP.ink}
              stroke={MAP.paper}
              strokeWidth={5}
              paintOrder="stroke"
            >
              {l.name}
            </text>
          </g>
        );
      })}
      <path d={track([HUB, [780, 150], [850, 80], [890, 80]])} fill="none" stroke={MAP.ink} strokeWidth={14} strokeLinejoin="round" />
      <path d={track([[780, 150], [850, 220], [890, 220]])} fill="none" stroke={MAP.ink} strokeWidth={14} strokeLinejoin="round" />
      <circle cx={HUB[0]} cy={HUB[1]} r={25} fill="#fff" stroke={MAP.ink} strokeWidth={8} />
      <circle cx={600} cy={150} r={13} fill="#fff" stroke={MAP.ink} strokeWidth={5} />
      <circle cx={890} cy={80} r={14} fill={MAP.ink} />
      <circle cx={890} cy={220} r={14} fill={MAP.ink} />

      <Label x={0} y={326} name="Market graph" lines={["Assets and the links between them, across equities, futures and crypto."]} />
      <Label x={414} y={200} name="THGAT" lines={["Learns the structure and", "how it changes over time."]} />
      <Label x={588} y={34} name="Embeddings" lines={["The learned representation.", "The foundation every", "downstream model and", "strategy builds on."]} />
      <Label x={916} y={87} name="A world model for agents" lines={["Research agents that can reason about", "how a shock will travel before it does."]} />
      <Label x={916} y={227} name="Market-aware language models" lines={["Embeddings fed to a language model as", "structured context, so it knows how", "markets connect."]} />
    </svg>
  );
}

const dot = (x: number, y: number, r = 7) => (
  <circle cx={x} cy={y} r={r} fill="#fff" stroke={MAP.ink} strokeWidth={4} />
);

/** One small drawing per term in the model's name. */
export function TermGlyph({ term }: { term: string }) {
  if (term === "Temporal") {
    // the same link at three moments: strong, faint, reversed
    const arrow = (x: number, flip: boolean, w: number) => (
      <g key={x} transform={flip ? `translate(${2 * x + 44} 0) scale(-1 1)` : undefined}>
        <line x1={x} y1={32} x2={x + 30} y2={32} stroke={MAP.rates} strokeWidth={w} />
        <path d={`M${x + 28} ${32 - 4 - w} L${x + 44} 32 L${x + 28} ${32 + 4 + w} z`} fill={MAP.rates} />
      </g>
    );
    return (
      <svg viewBox="0 0 220 64" className="rg-glyph" aria-hidden="true">
        {arrow(8, false, 10)}
        {arrow(88, false, 3)}
        {arrow(168, true, 7)}
      </svg>
    );
  }
  if (term === "Heterogeneous") {
    // different kinds of station, different kinds of link
    return (
      <svg viewBox="0 0 220 64" className="rg-glyph" aria-hidden="true">
        <line x1={20} y1={32} x2={110} y2={32} stroke={MAP.equities} strokeWidth={9} />
        <line x1={110} y1={32} x2={200} y2={32} stroke={MAP.crypto} strokeWidth={9} strokeDasharray="5 9" />
        {dot(20, 32, 11)}
        <rect x={99} y={21} width={22} height={22} fill="#fff" stroke={MAP.ink} strokeWidth={4} />
        <rect x={189} y={21} width={22} height={22} fill="#fff" stroke={MAP.ink} strokeWidth={4} transform="rotate(45 200 32)" />
      </svg>
    );
  }
  // graph attention: one asset, neighbours weighted differently
  const spokes: [number, number, number][] = [
    [196, 10, 11],
    [204, 40, 5],
    [150, 58, 2.5],
    [60, 54, 1.5],
    [40, 14, 7],
  ];
  return (
    <svg viewBox="0 0 220 64" className="rg-glyph" aria-hidden="true">
      {spokes.map(([x, y, w], i) => (
        <line key={i} x1={118} y1={32} x2={x} y2={y} stroke={MAP.futures} strokeWidth={w} />
      ))}
      {spokes.map(([x, y], i) => (
        <g key={i}>{dot(x, y, 5)}</g>
      ))}
      {dot(118, 32, 11)}
    </svg>
  );
}
