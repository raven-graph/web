// Geometry and data models for the landing-page SVG figures.
// Layout and propagation model follow the design reference (RavenGraph.dc.html);
// node positions, edges and scenario data are illustrative examples.

// ---------------------------------------------------------------------------
// Fig. 1: shock-propagation simulator
// ---------------------------------------------------------------------------

export interface FNode {
  x: number;
  y: number;
  t: string; // ticker label
  d: string; // descriptor
}

export const FNODES: Record<string, FNode> = {
  TNX: { x: 50, y: 190, t: "10Y", d: "rates" },
  VIX: { x: 170, y: 80, t: "VIX", d: "vol" },
  DXY: { x: 150, y: 310, t: "DXY", d: "dollar" },
  XLF: { x: 230, y: 190, t: "XLF", d: "bank equities" },
  NDX: { x: 330, y: 60, t: "NDX", d: "tech equities" },
  EMFX: { x: 330, y: 250, t: "EM FX", d: "emerging FX" },
  GOLD: { x: 300, y: 330, t: "GOLD", d: "commodities" },
  HY: { x: 410, y: 170, t: "HY", d: "credit spreads" },
  BTC: { x: 560, y: 130, t: "BTC", d: "bitcoin" },
  ETH: { x: 670, y: 80, t: "ETH", d: "ether" },
  USDT: { x: 670, y: 230, t: "USDT", d: "stablecoin flows" },
};

export interface Hop {
  s: string; // from
  t: string; // to
  w: number; // edge weight (beta)
  lag: number; // minutes
}

export interface Scenario {
  key: "rates" | "dollar" | "crypto";
  label: string;
  title: string;
  subtitle: string;
  origin: string;
  originBase: number;
  unit: string;
  shock: number;
  hops: Hop[];
  path: string[]; // headline path, origin first
}

export const SCENARIOS: Record<Scenario["key"], Scenario> = {
  rates: {
    key: "rates",
    label: "Rates · 10Y",
    title: "Fig. 1 · Rates-shock transmission",
    subtitle: "10Y yield → bank equities → credit spreads → crypto",
    origin: "TNX",
    originBase: 25,
    unit: "bps",
    shock: 2.5,
    hops: [
      { s: "TNX", t: "VIX", w: 2.4, lag: 20 },
      { s: "TNX", t: "DXY", w: 0.3, lag: 20 },
      { s: "TNX", t: "XLF", w: -0.6, lag: 30 },
      { s: "VIX", t: "NDX", w: -0.5, lag: 15 },
      { s: "DXY", t: "EMFX", w: -0.8, lag: 30 },
      { s: "XLF", t: "HY", w: -1.2, lag: 60 },
      { s: "HY", t: "BTC", w: -1.5, lag: 90 },
      { s: "BTC", t: "ETH", w: 1.3, lag: 20 },
    ],
    path: ["TNX", "XLF", "HY", "BTC"],
  },
  dollar: {
    key: "dollar",
    label: "Dollar · DXY",
    title: "Fig. 1 · Dollar-shock transmission",
    subtitle: "DXY → EM FX → credit spreads → bank equities",
    origin: "DXY",
    originBase: 1,
    unit: "%",
    shock: 1,
    hops: [
      { s: "DXY", t: "EMFX", w: -0.8, lag: 20 },
      { s: "DXY", t: "GOLD", w: -0.9, lag: 30 },
      { s: "EMFX", t: "HY", w: -1.5, lag: 60 },
      { s: "HY", t: "XLF", w: -0.8, lag: 45 },
      { s: "HY", t: "BTC", w: -1.5, lag: 90 },
      { s: "BTC", t: "ETH", w: 1.3, lag: 20 },
    ],
    path: ["DXY", "EMFX", "HY", "XLF"],
  },
  crypto: {
    key: "crypto",
    label: "Crypto · BTC sell-off",
    title: "Fig. 1 · Crypto-shock transmission",
    subtitle: "BTC → tech equities → vol",
    origin: "BTC",
    originBase: -10,
    unit: "%",
    shock: -10,
    hops: [
      { s: "BTC", t: "ETH", w: 1.3, lag: 20 },
      { s: "BTC", t: "NDX", w: 0.15, lag: 45 },
      { s: "BTC", t: "USDT", w: -0.3, lag: 60 },
      { s: "BTC", t: "HY", w: -0.1, lag: 90 },
      { s: "NDX", t: "VIX", w: -2.0, lag: 15 },
    ],
    path: ["BTC", "NDX", "VIX"],
  },
};

export const SPEED = 60; // model-minutes per second

/** Lag as a compact clock label: 0, 45m, 2h, 3.5h. */
export function fmtLag(m: number): string {
  if (m <= 0) return "0";
  if (m < 60) return `${Math.round(m)}m`;
  return `${+(m / 60).toFixed(1)}h`;
}

/** Split slash labels ("A/B") over two lines inside a node. */
export function labelLines(t: string): string[] {
  const i = t.indexOf("/");
  return i < 0 ? [t] : [t.slice(0, i), t.slice(i)];
}

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
// Fig. 0: hero market-graph schematic
// ---------------------------------------------------------------------------

export interface HNode {
  x: number;
  y: number;
  t: string;
  hub?: boolean;
  shock?: boolean;
}

export const HNODES: Record<string, HNode> = {
  // macro, rates
  VIX: { x: 52, y: 70, t: "VIX" },
  TNX: { x: 44, y: 180, t: "10Y", shock: true },
  DXY: { x: 72, y: 290, t: "DXY" },
  // futures, commodities, FX
  ES: { x: 140, y: 110, t: "ES" },
  GOLD: { x: 150, y: 236, t: "GOLD" },
  EMFX: { x: 160, y: 336, t: "EM FX", hub: true },
  WTI: { x: 270, y: 340, t: "WTI" },
  // equities, sectors, credit
  XLF: { x: 250, y: 170, t: "XLF" },
  SPX: { x: 265, y: 262, t: "SPX", hub: true },
  HYG: { x: 345, y: 140, t: "HYG" },
  XLK: { x: 360, y: 222, t: "XLK" },
  XLE: { x: 360, y: 320, t: "XLE" },
  // crypto, stablecoins
  ETH: { x: 255, y: 40, t: "ETH" },
  BTC: { x: 440, y: 160, t: "BTC", hub: true },
  USDT: { x: 455, y: 270, t: "USDT" },
};

export const HEDGES: [string, string][] = [
  ["VIX", "TNX"], ["TNX", "DXY"], ["VIX", "ES"], ["TNX", "ES"],
  ["TNX", "XLF"], ["TNX", "GOLD"], ["DXY", "GOLD"], ["DXY", "EMFX"],
  ["VIX", "ETH"], ["ES", "SPX"], ["XLF", "SPX"], ["XLF", "HYG"],
  ["HYG", "BTC"], ["ETH", "BTC"], ["SPX", "XLK"], ["XLK", "BTC"],
  ["SPX", "XLE"], ["WTI", "XLE"], ["EMFX", "WTI"], ["BTC", "USDT"],
];

// Reduced Fig. 0 for phones (viewBox 0 0 280 220): the nodes behind the
// three readout edges, plus the existing links between them so none floats.
export const HNODES_MINI: Record<string, HNode> = {
  VIX: { x: 34, y: 40, t: "VIX" },
  TNX: { x: 34, y: 110, t: "10Y", shock: true },
  DXY: { x: 34, y: 180, t: "DXY" },
  ETH: { x: 140, y: 34, t: "ETH" },
  XLF: { x: 130, y: 112, t: "XLF" },
  EMFX: { x: 130, y: 186, t: "EM FX", hub: true },
  HYG: { x: 220, y: 150, t: "HYG" },
  BTC: { x: 236, y: 70, t: "BTC", hub: true },
};

export const HEDGES_MINI: [string, string][] = [
  ["VIX", "ETH"], ["TNX", "XLF"], ["DXY", "EMFX"], ["VIX", "TNX"],
  ["TNX", "DXY"], ["ETH", "BTC"], ["XLF", "HYG"], ["HYG", "BTC"],
];

// ---------------------------------------------------------------------------
// Hero animated background: jittered lattice
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
