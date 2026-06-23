"use client";

import { HEDGES, HNODES } from "@/lib/landing/figures";
import { COLOR, FONT } from "@/lib/landing/tokens";
import { useAmbientPhase } from "@/lib/landing/useAmbientPhase";

// Fig. 0 — static market-graph schematic with a continuous cobalt sweep
// (shares the ambient ~11s clock). viewBox 0 0 500 372.
export function HeroSchematic() {
  const phase = useAmbientPhase();
  const front = -70 + phase * 640;
  const act = (x: number) => {
    const d = (x - front) / 85;
    return Math.exp(-d * d);
  };

  return (
    <svg
      viewBox="0 0 500 372"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {HEDGES.map((e, i) => {
        const s = HNODES[e[0]];
        const g = HNODES[e[1]];
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
      {Object.keys(HNODES).map((k, i) => {
        const n = HNODES[k];
        const a = act(n.x);
        const r = n.hub ? 15 : 12.5;
        const stroke = n.shock
          ? COLOR.cobaltLight
          : n.hub
            ? "rgba(255,255,255,0.34)"
            : "rgba(255,255,255,0.2)";
        const tcol = n.shock ? "#D7E0FF" : n.hub ? "#D7DAE2" : "#9CA0B0";
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
              y={n.y + 3}
              textAnchor="middle"
              fill={tcol}
              fontFamily={FONT.mono}
              fontSize={8.5}
              fontWeight={600}
            >
              {n.t}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
