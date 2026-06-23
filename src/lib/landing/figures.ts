// Geometry and data models for the landing-page SVG figures.
// Ported verbatim from the design reference (RavenGraph.dc.html logic class) —
// the source of truth for exact node positions, edges, and the propagation model.

// ---------------------------------------------------------------------------
// Fig. 1 — shock-propagation simulator
// ---------------------------------------------------------------------------

export interface FNode {
  x: number;
  y: number;
  t: string; // ticker label
  d: string; // descriptor
}

export const FNODES: Record<string, FNode> = {
  VIX: { x: 58, y: 70, t: "VIX", d: "vol" },
  TNX: { x: 58, y: 196, t: "10Y", d: "rates" },
  WTI: { x: 92, y: 330, t: "WTI", d: "crude" },
  SPY: { x: 372, y: 56, t: "SPY", d: "index" },
  JETS: { x: 232, y: 150, t: "JETS", d: "airlines" },
  XLE: { x: 250, y: 300, t: "XLE", d: "energy" },
  XOM: { x: 388, y: 338, t: "XOM", d: "exxon" },
  DAL: { x: 392, y: 120, t: "DAL", d: "delta" },
  UAL: { x: 392, y: 186, t: "UAL", d: "united" },
  AAL: { x: 300, y: 226, t: "AAL", d: "american" },
  XLF: { x: 520, y: 300, t: "XLF", d: "financials" },
  JPM: { x: 660, y: 322, t: "JPM", d: "jpmorgan" },
  XLK: { x: 548, y: 92, t: "XLK", d: "tech" },
  NVDA: { x: 672, y: 150, t: "NVDA", d: "nvidia" },
  SMH: { x: 628, y: 226, t: "SMH", d: "semis" },
};

export interface Hop {
  s: string; // from
  t: string; // to
  w: number; // edge weight (beta)
  lag: number; // minutes
}

export interface Scenario {
  key: "oil" | "rates" | "vol";
  label: string;
  title: string;
  subtitle: string;
  origin: string;
  originBase: number;
  unit: string;
  shock: number;
  hops: Hop[];
  path: string[]; // 3-node headline path
}

export const SCENARIOS: Record<Scenario["key"], Scenario> = {
  oil: {
    key: "oil",
    label: "Oil · WTI",
    title: "Fig. 1 · Oil-shock transmission",
    subtitle: "WTI crude → sector network",
    origin: "WTI",
    originBase: 8,
    unit: "%",
    shock: 8,
    hops: [
      { s: "WTI", t: "XLE", w: 0.62, lag: 8 },
      { s: "XLE", t: "XOM", w: 0.78, lag: 12 },
      { s: "WTI", t: "JETS", w: -0.48, lag: 15 },
      { s: "JETS", t: "DAL", w: 0.71, lag: 11 },
      { s: "JETS", t: "UAL", w: 0.66, lag: 13 },
      { s: "JETS", t: "AAL", w: 0.69, lag: 14 },
    ],
    path: ["WTI", "JETS", "DAL"],
  },
  rates: {
    key: "rates",
    label: "Rates · 10Y",
    title: "Fig. 1 · Rates-shock transmission",
    subtitle: "10Y yield → equity clusters",
    origin: "TNX",
    originBase: 50,
    unit: "bps",
    shock: 3.0,
    hops: [
      { s: "TNX", t: "XLF", w: 0.45, lag: 10 },
      { s: "XLF", t: "JPM", w: 0.82, lag: 6 },
      { s: "TNX", t: "XLK", w: -0.55, lag: 12 },
      { s: "XLK", t: "NVDA", w: 0.88, lag: 5 },
      { s: "XLK", t: "SMH", w: 0.8, lag: 6 },
      { s: "TNX", t: "SPY", w: -0.18, lag: 14 },
    ],
    path: ["TNX", "XLK", "NVDA"],
  },
  vol: {
    key: "vol",
    label: "Vol · VIX",
    title: "Fig. 1 · Vol-spike transmission",
    subtitle: "VIX → broad market",
    origin: "VIX",
    originBase: 12,
    unit: "pts",
    shock: 5.0,
    hops: [
      { s: "VIX", t: "SPY", w: -0.42, lag: 6 },
      { s: "SPY", t: "XLK", w: 0.95, lag: 8 },
      { s: "SPY", t: "XLF", w: 0.88, lag: 8 },
      { s: "SPY", t: "JETS", w: 0.8, lag: 10 },
      { s: "SPY", t: "XLE", w: 0.75, lag: 10 },
      { s: "XLK", t: "NVDA", w: 0.9, lag: 5 },
    ],
    path: ["VIX", "SPY", "XLK"],
  },
};

export const SPEED = 14; // model-minutes per second

export interface Model {
  val: Record<string, number>;
  lag: Record<string, number>;
}

export function buildModel(sc: Scenario, mult: number): Model {
  const val: Record<string, number> = {};
  const lag: Record<string, number> = {};
  val[sc.origin] = sc.shock * mult;
  lag[sc.origin] = 0;
  for (const e of sc.hops) {
    val[e.t] = (val[e.s] ?? 0) * e.w;
    lag[e.t] = (lag[e.s] ?? 0) + e.lag;
  }
  return { val, lag };
}

export function maxLag(sc: Scenario): number {
  const { lag } = buildModel(sc, 1);
  return Math.max(...Object.values(lag));
}

// ---------------------------------------------------------------------------
// Fig. 0 — hero market-graph schematic
// ---------------------------------------------------------------------------

export interface HNode {
  x: number;
  y: number;
  t: string;
  hub?: boolean;
  shock?: boolean;
}

export const HNODES: Record<string, HNode> = {
  SPY: { x: 250, y: 46, t: "SPY", hub: true },
  DXY: { x: 60, y: 92, t: "DXY" },
  TNX: { x: 46, y: 178, t: "10Y" },
  VIX: { x: 74, y: 262, t: "VIX" },
  WTI: { x: 118, y: 330, t: "WTI", shock: true },
  NG: { x: 192, y: 320, t: "NG" },
  XLE: { x: 210, y: 250, t: "XLE" },
  XOM: { x: 276, y: 322, t: "XOM" },
  JETS: { x: 236, y: 150, t: "JETS" },
  DAL: { x: 312, y: 92, t: "DAL" },
  UAL: { x: 344, y: 150, t: "UAL" },
  AAL: { x: 318, y: 214, t: "AAL" },
  XLF: { x: 300, y: 280, t: "XLF" },
  JPM: { x: 382, y: 300, t: "JPM" },
  XLK: { x: 398, y: 96, t: "XLK" },
  NVDA: { x: 452, y: 150, t: "NVDA" },
  SMH: { x: 438, y: 226, t: "SMH" },
};

export const HEDGES: [string, string][] = [
  ["DXY", "TNX"], ["TNX", "VIX"], ["VIX", "SPY"], ["SPY", "DXY"],
  ["WTI", "XLE"], ["XLE", "XOM"], ["WTI", "NG"], ["NG", "XLE"],
  ["WTI", "JETS"], ["JETS", "DAL"], ["JETS", "UAL"], ["JETS", "AAL"],
  ["TNX", "XLF"], ["XLF", "JPM"], ["JPM", "SPY"],
  ["SPY", "XLK"], ["XLK", "NVDA"], ["XLK", "SMH"], ["NVDA", "SMH"],
  ["SPY", "XLE"], ["SPY", "JETS"], ["DXY", "WTI"],
];

// ---------------------------------------------------------------------------
// Hero animated background — jittered lattice
// ---------------------------------------------------------------------------

export interface Lattice {
  nodes: { id: number; x: number; y: number }[];
  edges: [number, number][];
  W: number;
  H: number;
}

export function buildLattice(): Lattice {
  const W = 1200;
  const H = 760;
  const cols = 11;
  const rows = 8;
  const seed = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const nodes: Lattice["nodes"] = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseX = ((c + 0.5) / cols) * W;
      const baseY = ((r + 0.5) / rows) * H;
      const ox = (seed(id) - 0.5) * 70;
      const oy = (seed(id + 99) - 0.5) * 60;
      // Round coordinates so SSR (Node V8) and hydration (browser V8) emit
      // identical attribute strings despite cross-engine Math.sin precision.
      nodes.push({ id, x: Math.round(baseX + ox), y: Math.round(baseY + oy) });
      id++;
    }
  }
  const ix = (c: number, r: number) => r * cols + c;
  const edges: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1) edges.push([ix(c, r), ix(c + 1, r)]);
      if (r < rows - 1) edges.push([ix(c, r), ix(c, r + 1)]);
      if (c < cols - 1 && r < rows - 1 && (c + r) % 3 === 0)
        edges.push([ix(c, r), ix(c + 1, r + 1)]);
    }
  }
  return { nodes, edges, W, H };
}

// Shared helpers
export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
export const ease = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(1 - p, 2);
