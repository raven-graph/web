"use client";

import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { useAmbientPhase } from "@/lib/landing/useAmbientPhase";
import { Kicker } from "./Kicker";

const ISO_TICKERS = ["AAPL", "XOM", "JPM"];

function IsolatedViz({ phase }: { phase: number }) {
  const isoWave = (lane: number, x: number) => {
    const f1 = [0.9, 1.4, 0.7][lane];
    const f2 = [1.7, 2.3, 1.2][lane];
    const ph = [0, 2, 4][lane];
    const tt = x * 0.05 + phase * 6.2832 + ph;
    return Math.sin(tt * f1) + 0.5 * Math.sin(tt * f2 + 1);
  };
  return (
    <svg
      viewBox="0 0 300 200"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {ISO_TICKERS.map((tk, li) => {
        const cyl = 44 + li * 56;
        const pts: string[] = [];
        for (let xx = 44; xx <= 290; xx += 6) {
          pts.push(xx + "," + (cyl + isoWave(li, xx) * 13).toFixed(1));
        }
        return (
          <g key={`il${li}`}>
            <line
              x1={44}
              y1={cyl}
              x2={290}
              y2={cyl}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
            <polyline
              points={pts.join(" ")}
              fill="none"
              stroke="#6B6F7C"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={12}
              y={cyl + 3}
              fill="#5C606F"
              fontFamily={FONT.mono}
              fontSize={9}
              fontWeight={600}
            >
              {tk}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const GN: Record<string, { x: number; y: number; o?: boolean }> = {
  A: { x: 54, y: 100, o: true },
  B: { x: 138, y: 54 },
  C: { x: 138, y: 150 },
  D: { x: 236, y: 44 },
  E: { x: 248, y: 108 },
  F: { x: 228, y: 166 },
};
const GE: [string, string][] = [
  ["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "E"], ["C", "F"],
];

function GraphViz({ phase }: { phase: number }) {
  const gp = (phase * 3) % 1;
  const dA: Record<string, number> = {};
  Object.keys(GN).forEach((k) => {
    dA[k] = Math.hypot(GN[k].x - GN.A.x, GN[k].y - GN.A.y);
  });
  const gFront = gp * (Math.max(...Object.values(dA)) + 46);
  return (
    <svg
      viewBox="0 0 300 200"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {GE.map((e, i) => {
        const s = GN[e[0]];
        const g = GN[e[1]];
        const lit = gFront >= Math.max(dA[e[0]], dA[e[1]]);
        return (
          <line
            key={`be${i}`}
            x1={s.x}
            y1={s.y}
            x2={g.x}
            y2={g.y}
            stroke={lit ? COLOR.cobalt : "rgba(255,255,255,0.13)"}
            strokeWidth={lit ? 1.8 : 1}
            opacity={lit ? 0.9 : 0.7}
          />
        );
      })}
      {Object.keys(GN).map((k, i) => {
        const n = GN[k];
        const reached = gFront >= dA[k];
        const rp = reached ? Math.min(1, (gFront - dA[k]) / 46) : 0;
        return (
          <g key={`bn${i}`}>
            {reached && rp < 1 && (
              <circle
                cx={n.x}
                cy={n.y}
                r={9 + rp * 13}
                fill="none"
                stroke={COLOR.cobaltLight}
                strokeWidth={1.3}
                opacity={(1 - rp) * 0.6}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={9}
              fill={n.o || reached ? "#13203A" : "#11131C"}
              stroke={n.o || reached ? COLOR.cobaltLight : "rgba(255,255,255,0.2)"}
              strokeWidth={n.o ? 1.9 : 1.3}
            />
          </g>
        );
      })}
    </svg>
  );
}

const cardLabel = (color: string): React.CSSProperties => ({
  fontFamily: FONT.mono,
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
});

export function BlindSpot() {
  const phase = useAmbientPhase();
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="The blind spot" />
          <div
            style={{
              maxWidth: 820,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: FONT.serif,
                fontWeight: 500,
                fontSize: "clamp(30px,4.8vw,54px)",
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "#F1F2F5",
              }}
            >
              Everyone trades the same{" "}
              <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
                isolated
              </span>{" "}
              time series.
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(17px,2vw,21px)",
                lineHeight: 1.6,
                color: "#9CA0B0",
                fontWeight: 300,
              }}
            >
              Price, volume, a handful of factors — one ticker at a time. The
              relationships{" "}
              <em style={{ fontStyle: "italic", color: "#C9CCD6" }}>between</em>{" "}
              assets — who leads, who follows, how a shock spreads — never enter
              the model. That structure is where the edge is.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
              marginTop: 44,
            }}
          >
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                background: "#0E0F17",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={cardLabel("#9CA0B0")}>Isolated time series</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: "#5C606F" }}>
                  consensus view
                </span>
              </div>
              <IsolatedViz phase={phase} />
              <p
                style={{
                  margin: "8px 2px 0",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#7B7F8E",
                }}
              >
                Each ticker modeled alone — moving on its own clock.
              </p>
            </div>
            <div
              style={{
                border: "1px solid rgba(45,91,255,0.28)",
                borderRadius: 14,
                background: "#0E0F17",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={cardLabel(COLOR.cobaltLighter)}>The graph</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: COLOR.cobaltLight }}>
                  our view
                </span>
              </div>
              <GraphViz phase={phase} />
              <p
                style={{
                  margin: "8px 2px 0",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#9CA0B0",
                }}
              >
                One move, propagating through the structure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
