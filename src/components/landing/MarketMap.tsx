"use client";

import { useEffect, useRef, useState } from "react";
import { MAP, SIGN } from "@/lib/landing/tokens";

// The landing page's map: asset classes as lines, assets as stations, a shock
// as a journey with changes. Everything here is schematic. There are no
// weights, lags or returns because we have no measured numbers to publish.

type P = [number, number];

const W = 1440;
const H = 880;
const FAR = 4000; // lines run past the frame so they bleed on wide screens

const LINES: { id: string; name: string; color: string; pts: P[]; planned?: P[] }[] = [
  { id: "credit", name: "Credit", color: MAP.credit, pts: [[800, -FAR], [800, 490], [855, 545], [1200, 545]], planned: [[1200, 545], [FAR, 545]] },
  { id: "crypto", name: "Crypto", color: MAP.crypto, pts: [[720, 470], [1300, 470]], planned: [[1300, 470], [FAR, 470]] },
  { id: "futures", name: "Futures", color: MAP.futures, pts: [[FAR, 130], [1230, 130], [1060, 300], [890, 470]] },
  { id: "equities", name: "Equities", color: MAP.equities, pts: [[-FAR, 300], [FAR, 300]] },
  { id: "rates", name: "Rates", color: MAP.rates, pts: [[-FAR, 130], [630, 130], [800, 300]] },
];

type Station = { id: string; label: string; x: number; y: number; lx: number; ly: number; anchor?: "start" | "middle" | "end"; hub?: boolean };

const STATIONS: Station[] = [
  { id: "fed", label: "Fed funds", x: 180, y: 130, lx: 180, ly: 100 },
  { id: "2y", label: "2Y", x: 360, y: 130, lx: 360, ly: 100 },
  { id: "10y", label: "10Y yield", x: 540, y: 130, lx: 540, ly: 100 },
  { id: "small", label: "Small caps", x: 220, y: 300, lx: 220, ly: 270 },
  { id: "tech", label: "Tech", x: 480, y: 300, lx: 480, ly: 270 },
  { id: "banks", label: "Banks", x: 800, y: 300, lx: 826, ly: 282, anchor: "start", hub: true },
  { id: "energy", label: "Energy", x: 1060, y: 300, lx: 1036, ly: 282, anchor: "end", hub: true },
  { id: "sp", label: "S&P 500", x: 1270, y: 300, lx: 1270, ly: 270 },
  { id: "ig", label: "Investment grade", x: 800, y: 110, lx: 822, ly: 116, anchor: "start" },
  { id: "spreads", label: "Credit spreads", x: 800, y: 470, lx: 776, ly: 504, anchor: "end", hub: true },
  { id: "defi", label: "DeFi", x: 720, y: 470, lx: 712, ly: 444, anchor: "middle" },
  { id: "btc", label: "Bitcoin", x: 890, y: 470, lx: 912, ly: 504, anchor: "start", hub: true },
  { id: "eth", label: "Ether", x: 1110, y: 470, lx: 1110, ly: 444 },
  { id: "stable", label: "Stablecoins", x: 1300, y: 470, lx: 1300, ly: 444 },
  { id: "em", label: "EM debt", x: 1060, y: 545, lx: 1060, ly: 521 },
  { id: "oil", label: "Oil", x: 1320, y: 130, lx: 1320, ly: 100 },
  { id: "gold", label: "Gold", x: 1400, y: 130, lx: 1400, ly: 100 },
];

const S = Object.fromEntries(STATIONS.map((s) => [s.id, s]));

type Journey = {
  id: string;
  from: string;
  sentence: string;
  stops: string[];
  // one leg per pair of stops: the line ridden and the track it follows
  legs: { line: string; pts: P[] }[];
};

const JOURNEYS: Journey[] = [
  {
    id: "rates",
    from: "10Y yield",
    sentence: "A rate move hits banks, then credit, then crypto.",
    stops: ["10y", "banks", "spreads", "btc"],
    legs: [
      { line: "rates", pts: [[540, 130], [630, 130], [800, 300]] },
      { line: "credit", pts: [[800, 300], [800, 470]] },
      { line: "crypto", pts: [[800, 470], [890, 470]] },
    ],
  },
  {
    id: "oil",
    from: "Oil",
    sentence: "An oil move hits energy stocks, then the index.",
    stops: ["oil", "energy", "sp"],
    legs: [
      { line: "futures", pts: [[1320, 130], [1230, 130], [1060, 300]] },
      { line: "equities", pts: [[1060, 300], [1270, 300]] },
    ],
  },
  {
    id: "btc",
    from: "Bitcoin",
    sentence: "A crypto sell-off hits credit, then banks, then tech.",
    stops: ["btc", "spreads", "banks", "tech"],
    legs: [
      { line: "crypto", pts: [[890, 470], [800, 470]] },
      { line: "credit", pts: [[800, 470], [800, 300]] },
      { line: "equities", pts: [[800, 300], [480, 300]] },
    ],
  },
];

const lineColor = (id: string) => LINES.find((l) => l.id === id)!.color;
const lineName = (id: string) => LINES.find((l) => l.id === id)!.name;

/** Polyline to an SVG path with rounded bends. */
function track(pts: P[], r = 34): string {
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

const NARROW = { x: 400, w: 1040 }; // phone and tablet crop of the map

const SPEED = 300; // map units per second
const DWELL = 650; // ms at each change
const HOLD = 2800; // ms at the destination before the journey restarts

const len = (pts: P[]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

function pointAt(pts: P[], dist: number): P {
  let left = dist;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (left <= seg) {
      const f = seg ? left / seg : 0;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
    }
    left -= seg;
  }
  return pts[pts.length - 1];
}

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export function MarketMap() {
  const [jid, setJid] = useState(JOURNEYS[0].id);
  const [reached, setReached] = useState(1);
  const train = useRef<SVGGElement>(null);
  const trainSm = useRef<SVGGElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const journey = JOURNEYS.find((j) => j.id === jid)!;

  useEffect(() => {
    const j = JOURNEYS.find((x) => x.id === jid)!;
    const place = ([x, y]: P) => {
      for (const el of [train.current, trainSm.current]) el?.setAttribute("transform", `translate(${x} ${y})`);
    };
    // Where the map pans (phones), bring the journey into view.
    const el = scroller.current;
    if (el && el.scrollWidth > el.clientWidth) {
      const xs = j.stops.map((id) => S[id].x);
      const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
      const left = ((mid - NARROW.x) / NARROW.w) * el.scrollWidth - el.clientWidth / 2;
      el.scrollTo({ left: Math.max(0, left), behavior: "instant" });
    }
    const end = j.legs[j.legs.length - 1].pts;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(end[end.length - 1]);
      setReached(j.stops.length);
      return;
    }
    const legMs = j.legs.map((l) => (len(l.pts) / SPEED) * 1000);
    const total = legMs.reduce((a, b) => a + b + DWELL, 0) - DWELL + HOLD;
    let raf = 0;
    let start = 0;
    let shown = -1;
    const frame = (now: number) => {
      if (!start) start = now;
      let t = (now - start) % total;
      let count = 1;
      let pos: P = j.legs[0].pts[0];
      for (let i = 0; i < j.legs.length; i++) {
        if (t < legMs[i]) {
          pos = pointAt(j.legs[i].pts, easeInOut(t / legMs[i]) * len(j.legs[i].pts));
          break;
        }
        t -= legMs[i];
        count = i + 2;
        pos = j.legs[i].pts[j.legs[i].pts.length - 1];
        if (t < DWELL) break;
        t -= DWELL;
      }
      place(pos);
      if (count !== shown) {
        shown = count;
        setReached(count);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [jid]);

  const onRoute = new Set(journey.stops);

  const svg = (viewBox: string, ref: React.RefObject<SVGGElement | null>, className: string) => (
    <svg viewBox={viewBox} className={className} role="img" aria-label={`Schematic map of markets as transit lines. Highlighted journey: ${journey.stops.map((s) => S[s].label).join(", then ")}.`}>
      {LINES.map((l) => (
        <g key={l.id}>
          {l.planned && (
            <path d={track(l.planned)} fill="none" stroke={l.color} strokeWidth={14} strokeDasharray="6 16" />
          )}
          <path d={track(l.pts)} fill="none" stroke={l.color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {/* the journey, marked down the middle of the track it rides */}
      {journey.legs.map((l, i) => (
        <path key={`${jid}-${i}`} d={track(l.pts)} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      ))}
      {STATIONS.map((s) => {
        const on = onRoute.has(s.id);
        return (
          <g key={s.id}>
            {s.hub ? (
              <circle cx={s.x} cy={s.y} r={14} fill="#fff" stroke={MAP.ink} strokeWidth={5} />
            ) : (
              <circle cx={s.x} cy={s.y} r={on ? 7.5 : 5} fill="#fff" stroke={on ? MAP.ink : "none"} strokeWidth={3.5} />
            )}
            <text
              x={s.lx}
              y={s.ly}
              textAnchor={s.anchor ?? "middle"}
              fill={MAP.ink}
              fontFamily={SIGN}
              fontSize={19}
              fontWeight={on ? 800 : 500}
              stroke={MAP.paper}
              strokeWidth={5}
              paintOrder="stroke"
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <g ref={ref} transform={`translate(${journey.legs[0].pts[0][0]} ${journey.legs[0].pts[0][1]})`}>
        <circle r={12} fill={MAP.ink} stroke="#fff" strokeWidth={4} />
        <circle r={3.5} fill="#fff" />
      </g>
    </svg>
  );

  return (
    <>
      <div className="rg-map-frame" ref={scroller}>
        {svg(`0 0 ${W} ${H}`, train, "rg-map rg-map-wide")}
        {svg(`${NARROW.x} 50 ${NARROW.w} 590`, trainSm, "rg-map rg-map-narrow")}
      </div>

      <div className="rg-journey">
        <div className="rg-journey-head">
          <span id="rg-journey-label">Follow a shock from</span>
          <div role="group" aria-labelledby="rg-journey-label" className="rg-journey-picks">
            {JOURNEYS.map((j) => (
              <button key={j.id} type="button" aria-pressed={j.id === jid} onClick={() => { setReached(1); setJid(j.id); }}>
                {j.from}
              </button>
            ))}
          </div>
        </div>
        <ol className="rg-strip">
          {journey.stops.map((id, i) => {
            const arrived = journey.legs[i - 1];
            const next = journey.legs[i];
            return (
              <li key={id} data-reached={i < reached}>
                {next && (
                  <span className="rg-strip-leg" style={{ background: lineColor(next.line) }} />
                )}
                <span className="rg-strip-dot" />
                <span className="rg-strip-name">{S[id].label}</span>
                <span className="rg-strip-note">
                  {arrived ? `${lineName(arrived.line)} line` : "Start"}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="rg-journey-sentence">{journey.sentence}</p>
      </div>
    </>
  );
}
