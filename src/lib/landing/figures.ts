// Geometry and data models for the landing-page SVG figures.
// Layout and propagation model follow the design reference (RavenGraph.dc.html);
// node positions, edges and scenario data are illustrative examples.

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
  VIX: { x: 170, y: 120, t: "VIX", d: "vol" },
  TNX: { x: 50, y: 190, t: "10Y", d: "rates" },
  DXY: { x: 150, y: 310, t: "DXY", d: "dollar" },
  NDX: { x: 280, y: 50, t: "NASDAQ", d: "equities" },
  BTC: { x: 400, y: 50, t: "BTC", d: "bitcoin" },
  ETH: { x: 300, y: 170, t: "ETH", d: "ether" },
  BRL: { x: 270, y: 340, t: "BRL", d: "real" },
  USDT: { x: 440, y: 260, t: "USDT", d: "redemptions" },
  USDC: { x: 580, y: 240, t: "USDC", d: "redemptions" },
  UMXN: { x: 600, y: 120, t: "USDT/MXN", d: "spread" },
  UBRL: { x: 560, y: 320, t: "USDT/BRL", d: "spread" },
  FLOAT: { x: 690, y: 290, t: "FLOAT", d: "client BRL float" },
};

export interface Hop {
  s: string; // from
  t: string; // to
  w: number; // edge weight (beta)
  lag: number; // minutes
}

export interface Scenario {
  key: "eth" | "rates" | "dollar";
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
  eth: {
    key: "eth",
    label: "Crypto · ETH sell-off",
    title: "Fig. 1 · ETH sell-off transmission",
    subtitle: "ETH → stablecoins → BRL corridor",
    origin: "ETH",
    originBase: -15,
    unit: "%",
    shock: -15,
    hops: [
      { s: "ETH", t: "BTC", w: 0.6, lag: 20 },
      { s: "ETH", t: "USDT", w: -0.6, lag: 120 },
      { s: "USDT", t: "USDC", w: 0.5, lag: 30 },
      { s: "USDT", t: "UBRL", w: 0.9, lag: 60 },
      { s: "USDT", t: "UMXN", w: 0.6, lag: 75 },
      { s: "UBRL", t: "FLOAT", w: -0.25, lag: 30 },
    ],
    path: ["ETH", "USDT", "UBRL", "FLOAT"],
  },
  rates: {
    key: "rates",
    label: "Rates · 10Y",
    title: "Fig. 1 · Rates-shock transmission",
    subtitle: "10Y yield → vol → crypto collateral",
    origin: "TNX",
    originBase: 25,
    unit: "bps",
    shock: 2.5,
    hops: [
      { s: "TNX", t: "VIX", w: 2.4, lag: 20 },
      { s: "TNX", t: "DXY", w: 0.3, lag: 20 },
      { s: "VIX", t: "NDX", w: -0.5, lag: 15 },
      { s: "VIX", t: "ETH", w: -0.7, lag: 45 },
      { s: "NDX", t: "BTC", w: 1.5, lag: 40 },
      { s: "DXY", t: "BRL", w: -0.5, lag: 20 },
      { s: "BRL", t: "UBRL", w: -1.0, lag: 40 },
    ],
    path: ["TNX", "VIX", "ETH"],
  },
  dollar: {
    key: "dollar",
    label: "Dollar · DXY",
    title: "Fig. 1 · Dollar-shock transmission",
    subtitle: "DXY → BRL → USDT/BRL corridor",
    origin: "DXY",
    originBase: 1,
    unit: "%",
    shock: 1,
    hops: [
      { s: "DXY", t: "BRL", w: -0.5, lag: 20 },
      { s: "DXY", t: "UMXN", w: 0.4, lag: 45 },
      { s: "DXY", t: "ETH", w: -2.0, lag: 60 },
      { s: "BRL", t: "UBRL", w: -1.0, lag: 40 },
      { s: "ETH", t: "BTC", w: 0.6, lag: 20 },
      { s: "UBRL", t: "FLOAT", w: -0.25, lag: 30 },
    ],
    path: ["DXY", "BRL", "UBRL", "FLOAT"],
  },
};

export const SPEED = 60; // model-minutes per second

/** Lag as a compact clock label: 0, 45m, 2h, 3.5h. */
export function fmtLag(m: number): string {
  if (m <= 0) return "0";
  if (m < 60) return `${Math.round(m)}m`;
  return `${+(m / 60).toFixed(1)}h`;
}

/** Split corridor labels ("USDT/BRL") over two lines inside a node. */
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
  DXY: { x: 56, y: 62, t: "DXY" },
  TNX: { x: 44, y: 168, t: "10Y" },
  VIX: { x: 70, y: 278, t: "VIX" },
  NDX: { x: 160, y: 330, t: "NASDAQ", hub: true },
  BTC: { x: 210, y: 96, t: "BTC" },
  ETH: { x: 180, y: 200, t: "ETH", shock: true },
  BRL: { x: 300, y: 52, t: "BRL" },
  USDT: { x: 310, y: 200, t: "USDT", hub: true },
  USDC: { x: 360, y: 300, t: "USDC" },
  UBRL: { x: 420, y: 210, t: "USDT/BRL", hub: true },
  UMXN: { x: 452, y: 110, t: "USDT/MXN", hub: true },
};

export const HEDGES: [string, string][] = [
  ["DXY", "TNX"], ["TNX", "VIX"], ["DXY", "BRL"], ["DXY", "BTC"],
  ["TNX", "BTC"], ["VIX", "ETH"], ["VIX", "NDX"], ["NDX", "ETH"],
  ["BTC", "ETH"], ["ETH", "USDT"], ["BTC", "USDT"], ["USDT", "USDC"],
  ["USDT", "UBRL"], ["USDT", "UMXN"], ["BRL", "UBRL"], ["USDC", "UBRL"],
  ["UBRL", "UMXN"],
];

// Reduced Fig. 0 for phones (viewBox 0 0 280 220): the nodes behind the
// three readout edges, plus the existing links between them so none floats.
export const HNODES_MINI: Record<string, HNode> = {
  DXY: { x: 34, y: 40, t: "DXY" },
  VIX: { x: 34, y: 178, t: "VIX" },
  ETH: { x: 110, y: 126, t: "ETH", shock: true },
  BRL: { x: 140, y: 34, t: "BRL" },
  USDT: { x: 190, y: 182, t: "USDT", hub: true },
  UBRL: { x: 244, y: 98, t: "USDT/BRL", hub: true },
};

export const HEDGES_MINI: [string, string][] = [
  ["VIX", "ETH"], ["ETH", "USDT"], ["DXY", "UBRL"],
  ["DXY", "BRL"], ["BRL", "UBRL"], ["USDT", "UBRL"],
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
