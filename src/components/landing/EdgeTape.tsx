import React from "react";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";

interface Edge {
  from: string;
  to: string;
  beta: number;
  lag: number;
}

const EDGES: Edge[] = [
  { from: "WTI", to: "XLE", beta: 0.62, lag: 8 },
  { from: "WTI", to: "JETS", beta: -0.48, lag: 15 },
  { from: "10Y", to: "XLK", beta: -0.55, lag: 12 },
  { from: "VIX", to: "SPY", beta: -0.42, lag: 6 },
  { from: "XLK", to: "NVDA", beta: 0.88, lag: 5 },
  { from: "10Y", to: "XLF", beta: 0.45, lag: 10 },
];

function Track() {
  return (
    <span style={{ paddingRight: 0 }}>
      {EDGES.map((e, i) => {
        const pos = e.beta >= 0;
        return (
          <React.Fragment key={i}>
            {e.from}
            {"→"}
            {e.to}
            {"  "}
            <span style={{ color: pos ? COLOR.teal : COLOR.rose }}>
              {"β"}
              {pos ? "+" : "−"}
              {Math.abs(e.beta).toFixed(2)}
            </span>
            {" · "}
            {e.lag}m{"    "}
          </React.Fragment>
        );
      })}
    </span>
  );
}

export function EdgeTape() {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#0A0B0F",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          ...CONTAINER,
          height: 38,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            flex: "none",
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: "0.18em",
            color: COLOR.cobaltLight,
            border: "1px solid rgba(45,91,255,0.3)",
            borderRadius: 5,
            padding: "3px 8px",
          }}
        >
          EDGES
        </span>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            WebkitMaskImage:
              "linear-gradient(90deg,transparent,#000 4%,#000 92%,transparent)",
            maskImage:
              "linear-gradient(90deg,transparent,#000 4%,#000 92%,transparent)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              animation: "rgtape 38s linear infinite",
              fontFamily: FONT.mono,
              fontSize: 11.5,
              color: "#6B6F7C",
            }}
          >
            <Track />
            <Track />
          </div>
        </div>
      </div>
    </div>
  );
}
