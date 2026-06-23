"use client";

import { useMemo } from "react";
import { buildLattice } from "@/lib/landing/figures";
import { COLOR } from "@/lib/landing/tokens";
import { useAmbientPhase } from "@/lib/landing/useAmbientPhase";

// Full-bleed cobalt lattice with a signal front sweeping left→right on the
// shared ambient clock. Masked by the hero so it only shows around the edges.
export function NetworkBackground() {
  const phase = useAmbientPhase();
  const net = useMemo(() => buildLattice(), []);

  const front = -200 + phase * (net.W + 400);
  const act = (x: number) => {
    const d = (x - front) / 185;
    return Math.exp(-d * d);
  };

  return (
    <svg
      viewBox={`0 0 ${net.W} ${net.H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {net.edges.map((e, i) => {
        const s = net.nodes[e[0]];
        const g = net.nodes[e[1]];
        const a = (act(s.x) + act(g.x)) / 2;
        return (
          <line
            key={`e${i}`}
            x1={s.x}
            y1={s.y}
            x2={g.x}
            y2={g.y}
            stroke={COLOR.cobalt}
            strokeWidth={1}
            opacity={(0.04 + a * 0.32).toFixed(3)}
          />
        );
      })}
      {net.nodes.map((n) => {
        const a = act(n.x);
        return (
          <circle
            key={`n${n.id}`}
            cx={n.x}
            cy={n.y}
            r={(1.5 + a * 1.8).toFixed(3)}
            fill={COLOR.cobalt}
            opacity={(0.08 + a * 0.38).toFixed(3)}
          />
        );
      })}
    </svg>
  );
}
