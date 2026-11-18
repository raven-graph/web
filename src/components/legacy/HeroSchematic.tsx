"use client";

import {
  HEDGES,
  HEDGES_MINI,
  HNODES,
  HNODES_MINI,
  HNode,
  labelLines,
} from "@/lib/landing/figures";
import { COLOR, FONT } from "@/lib/landing/tokens";
import { useAmbientPhase } from "@/lib/landing/useAmbientPhase";

// Fig. 0: static market-graph schematic with a continuous cobalt sweep
// (shares the ambient ~11s clock). The full graph (viewBox 500×372) shows
// from 640px up, scaled to the card; below that a reduced graph (280×220).
// The swap is CSS-only (.rg-fig0-full / .rg-fig0-mini in globals.css).
export function HeroSchematic() {
  const phase = useAmbientPhase();
  return (
    <>
      <div className="rg-fig0-full">
        <Schematic
          nodes={HNODES}
          edges={HEDGES}
          w={500}
          h={372}
          phase={phase}
        />
      </div>
      <div className="rg-fig0-mini">
        <Schematic
          nodes={HNODES_MINI}
          edges={HEDGES_MINI}
          w={280}
          h={220}
          phase={phase}
        />
      </div>
    </>
  );
}

function Schematic({
  nodes,
  edges,
  w,
  h,
  phase,
}: {
  nodes: Record<string, HNode>;
  edges: [string, string][];
  w: number;
  h: number;
  phase: number;
}) {
  const front = -70 + phase * (w + 140);
  const act = (x: number) => {
    const d = (x - front) / 85;
    return Math.exp(-d * d);
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {edges.map((e, i) => {
        const s = nodes[e[0]];
        const g = nodes[e[1]];
        const a = (act(s.x) + act(g.x)) / 2;
        return (
          <line
            key={`he${i}`}
            x1={s.x}
            y1={s.y}
            x2={g.x}
            y2={g.y}
            stroke={COLOR.cobalt}
            strokeWidth={(1 + a * 0.7).toFixed(3)}
            opacity={(0.22 + a * 0.5).toFixed(3)}
          />
        );
      })}
      {Object.keys(nodes).map((k, i) => {
        const n = nodes[k];
        const a = act(n.x);
        const r = n.hub ? 15 : 12.5;
        const stroke = n.shock
          ? COLOR.cobaltLight
          : n.hub
            ? "rgba(255,255,255,0.34)"
            : "rgba(255,255,255,0.2)";
        const tcol = n.shock ? "#D7E0FF" : n.hub ? "#D7DAE2" : "#9CA0B0";
        const lines = labelLines(n.t);
        return (
          <g key={`hn${i}`}>
            {a > 0.05 && (
              <circle
                cx={n.x}
                cy={n.y}
                r={r + 4}
                fill="none"
                stroke={COLOR.cobaltLight}
                strokeWidth={1.2}
                opacity={(a * 0.55).toFixed(3)}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill="#11131C"
              stroke={stroke}
              strokeWidth={n.shock ? 1.8 : 1.2}
            />
            <text
              x={n.x}
              y={lines.length > 1 ? n.y - 1 : n.y + 3}
              textAnchor="middle"
              fill={tcol}
              fontFamily={FONT.mono}
              fontSize={lines.length > 1 || n.t.length > 5 ? 7.2 : 8.5}
              fontWeight={600}
            >
              {lines.map((ln, li) => (
                <tspan key={li} x={n.x} dy={li ? 8 : 0}>
                  {ln}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
