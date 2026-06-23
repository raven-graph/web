"use client";

import React, { useState } from "react";
import { PERF } from "@/lib/landing/performance";
import { COLOR, FONT } from "@/lib/landing/tokens";

// Fig. 2 — cumulative-return chart (RavenGraph vs S&P 500), real data.
// viewBox 0 0 760 300.
const PX0 = 46;
const PY0 = 14;
const PW = 696;
const PHH = 256;
const Y_MIN = -3;
const Y_MAX = 46;
const GRID = [0, 10, 20, 30, 40];

export function PerformanceChart() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const { N, rg, ndx, dates, ticks } = PERF;

  const mx = (i: number) => PX0 + (i / (N - 1)) * PW;
  const my = (v: number) => PY0 + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PHH;
  const sgn = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(1) + "%";

  const rgPts = rg.map((v, i) => mx(i).toFixed(1) + "," + my(v).toFixed(1)).join(" ");
  const ndPts = ndx.map((v, i) => mx(i).toFixed(1) + "," + my(v).toFixed(1)).join(" ");
  const areaD =
    "M" +
    PX0 +
    "," +
    my(0).toFixed(1) +
    " " +
    rg.map((v, i) => "L" + mx(i).toFixed(1) + "," + my(v).toFixed(1)).join(" ") +
    " L" +
    mx(N - 1).toFixed(1) +
    "," +
    my(0).toFixed(1) +
    " Z";

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * 760;
    let i = Math.round(((vx - PX0) / PW) * (N - 1));
    i = Math.max(0, Math.min(N - 1, i));
    if (i !== hoverIdx) setHoverIdx(i);
  };
  const onLeave = () => {
    if (hoverIdx != null) setHoverIdx(null);
  };

  let tooltip: React.ReactNode = null;
  let hoverMarks: React.ReactNode = null;
  if (hoverIdx != null) {
    const hi = hoverIdx;
    const hx = mx(hi);
    const ttw = 168;
    const ttx = Math.max(PX0, Math.min(PX0 + PW - ttw, hx + 12));
    const tty = 18;
    hoverMarks = (
      <>
        <line
          x1={hx}
          y1={PY0}
          x2={hx}
          y2={PY0 + PHH}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1}
        />
        <circle
          cx={hx}
          cy={my(ndx[hi])}
          r={3.5}
          fill="#0E0F17"
          stroke="#9CA0B0"
          strokeWidth={1.5}
        />
        <circle
          cx={hx}
          cy={my(rg[hi])}
          r={4}
          fill="#0E0F17"
          stroke={COLOR.cobalt}
          strokeWidth={2}
        />
      </>
    );
    tooltip = (
      <g>
        <rect
          x={ttx}
          y={tty}
          width={ttw}
          height={64}
          rx={7}
          fill="#14161F"
          stroke="rgba(255,255,255,0.14)"
        />
        <text
          x={ttx + 13}
          y={tty + 20}
          fill="#9CA0B0"
          fontFamily={FONT.mono}
          fontSize={10.5}
        >
          {dates[hi]}, 2026
        </text>
        <text
          x={ttx + 13}
          y={tty + 39}
          fill={COLOR.cobaltLighter}
          fontFamily={FONT.mono}
          fontSize={11}
          fontWeight={600}
        >
          RavenGraph  {sgn(rg[hi])}
        </text>
        <text
          x={ttx + 13}
          y={tty + 54}
          fill="#9CA0B0"
          fontFamily={FONT.mono}
          fontSize={11}
          fontWeight={600}
        >
          S&P 500  {sgn(ndx[hi])}
        </text>
      </g>
    );
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} style={{ touchAction: "none", cursor: "crosshair" }}>
      <svg
        viewBox="0 0 760 300"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {GRID.map((gv, i) => (
          <g key={`gr${i}`}>
            <line
              x1={PX0}
              y1={my(gv)}
              x2={PX0 + PW}
              y2={my(gv)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={PX0 - 8}
              y={my(gv) + 3}
              textAnchor="end"
              fill="#5C606F"
              fontFamily={FONT.mono}
              fontSize={10}
            >
              {(gv > 0 ? "+" : "") + gv + "%"}
            </text>
          </g>
        ))}
        {ticks.map((tk, i) => (
          <text
            key={`mo${i}`}
            x={mx(tk[0])}
            y={294}
            textAnchor="start"
            fill="#5C606F"
            fontFamily={FONT.mono}
            fontSize={10}
          >
            {tk[1]}
          </text>
        ))}
        <path d={areaD} fill={COLOR.cobalt} opacity={0.08} />
        <polyline
          points={ndPts}
          fill="none"
          stroke="#6B6F7C"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={rgPts}
          fill="none"
          stroke={COLOR.cobalt}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={mx(N - 1)} cy={my(ndx[N - 1])} r={3.5} fill="#9CA0B0" />
        <circle cx={mx(N - 1)} cy={my(rg[N - 1])} r={3.5} fill={COLOR.cobalt} />
        <text
          x={mx(N - 1) - 8}
          y={my(rg[N - 1]) - 9}
          textAnchor="end"
          fill={COLOR.cobaltLighter}
          fontFamily={FONT.mono}
          fontSize={11}
          fontWeight={600}
        >
          +{rg[N - 1].toFixed(1)}%
        </text>
        <text
          x={mx(N - 1) - 8}
          y={my(ndx[N - 1]) + 15}
          textAnchor="end"
          fill="#9CA0B0"
          fontFamily={FONT.mono}
          fontSize={11}
          fontWeight={600}
        >
          +{ndx[N - 1].toFixed(1)}%
        </text>
        {hoverMarks}
        {tooltip}
      </svg>
    </div>
  );
}
