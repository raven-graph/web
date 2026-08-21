"use client";

import React from "react";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { useAmbientPhase } from "@/lib/landing/useAmbientPhase";
import { Kicker } from "./Kicker";

// Fig. 2 layout constants — one horizontal pipeline, research left of the
// walk-forward gate, execution right of it. Coordinates in a 760×220 viewBox.
const FLOW_Y = 118;
const GATE_X = 415;
const PULSE_START = 70;
const PULSE_END = 720;

function Arrow({ x, y, dir = 1 }: { x: number; y: number; dir?: 1 | -1 }) {
  return (
    <polygon
      points={`${x},${y} ${x - 7 * dir},${y - 3.5} ${x - 7 * dir},${y + 3.5}`}
      fill="rgba(255,255,255,0.4)"
    />
  );
}

/** Connector along the main flow line; lights up behind the pulse. */
function Flow({
  x1,
  x2,
  px,
  biDir,
}: {
  x1: number;
  x2: number;
  px: number;
  biDir?: boolean;
}) {
  const litTo = Math.min(px, x2);
  const accent = x2 <= GATE_X ? COLOR.cobalt : COLOR.teal;
  return (
    <g>
      <line
        x1={x1}
        y1={FLOW_Y}
        x2={x2}
        y2={FLOW_Y}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1.2}
      />
      {px > x1 && (
        <line
          x1={x1}
          y1={FLOW_Y}
          x2={litTo}
          y2={FLOW_Y}
          stroke={accent}
          strokeWidth={1.6}
          opacity={0.9}
        />
      )}
      <Arrow x={x2 - 1} y={FLOW_Y} />
      {biDir && <Arrow x={x1 + 1} y={FLOW_Y} dir={-1} />}
    </g>
  );
}

function StageBox({
  x,
  w,
  label,
  sub,
  px,
  exec,
}: {
  x: number;
  w: number;
  label: string;
  sub: string;
  px: number;
  exec?: boolean;
}) {
  const active = px >= x && px <= x + w;
  const accent = exec ? COLOR.teal : COLOR.cobaltLight;
  return (
    <g>
      <rect
        x={x}
        y={95}
        width={w}
        height={46}
        rx={9}
        fill="#11131C"
        stroke={active ? accent : "rgba(255,255,255,0.22)"}
        strokeWidth={active ? 1.6 : 1.2}
      />
      <text
        x={x + w / 2}
        y={122.5}
        textAnchor="middle"
        fill="#ECEDF1"
        fontFamily={FONT.mono}
        fontSize={12.5}
        fontWeight={600}
        letterSpacing="0.08em"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={158}
        textAnchor="middle"
        fill="#5C606F"
        fontFamily={FONT.mono}
        fontSize={8.5}
        letterSpacing="0.06em"
      >
        {sub}
      </text>
    </g>
  );
}

// Mini node cluster inside the GRAPH box.
const CLUSTER_NODES: [number, number][] = [
  [282, 106],
  [306, 98],
  [333, 108],
  [292, 126],
  [322, 128],
];
const CLUSTER_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [3, 4],
];

function GraphBox({ px }: { px: number }) {
  const active = px >= 252 && px <= 364;
  return (
    <g>
      <rect
        x={252}
        y={87}
        width={112}
        height={62}
        rx={10}
        fill="#0F1626"
        stroke={active ? COLOR.cobaltLight : "rgba(45,91,255,0.45)"}
        strokeWidth={active ? 1.9 : 1.3}
      />
      {CLUSTER_EDGES.map(([a, b], i) => (
        <line
          key={`ce${i}`}
          x1={CLUSTER_NODES[a][0]}
          y1={CLUSTER_NODES[a][1]}
          x2={CLUSTER_NODES[b][0]}
          y2={CLUSTER_NODES[b][1]}
          stroke={COLOR.cobaltLight}
          strokeWidth={1}
          opacity={0.5}
        />
      ))}
      {CLUSTER_NODES.map(([cx, cy], i) => (
        <circle
          key={`cn${i}`}
          cx={cx}
          cy={cy}
          r={3}
          fill="#13203A"
          stroke={COLOR.cobaltLight}
          strokeWidth={1.2}
        />
      ))}
      <text
        x={308}
        y={143}
        textAnchor="middle"
        fill="#ECEDF1"
        fontFamily={FONT.mono}
        fontSize={12.5}
        fontWeight={600}
        letterSpacing="0.08em"
      >
        GRAPH
      </text>
      <text
        x={308}
        y={164}
        textAnchor="middle"
        fill={COLOR.cobaltLight}
        fontFamily={FONT.mono}
        fontSize={8.5}
        letterSpacing="0.1em"
      >
        WORLD MODEL
      </text>
    </g>
  );
}

const INPUTS = ["FILINGS", "NEWS", "PRICES"];

function StackFigure() {
  const phase = useAmbientPhase();
  const px = PULSE_START + ((phase * 2) % 1) * (PULSE_END - PULSE_START);
  const pulseColor = px < GATE_X ? COLOR.cobaltLight : COLOR.teal;
  return (
    <svg
      viewBox="0 0 760 220"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* Zone labels */}
      <text
        x={232}
        y={32}
        textAnchor="middle"
        fill={COLOR.cobaltLighter}
        fontFamily={FONT.mono}
        fontSize={9.5}
        letterSpacing="0.18em"
        opacity={0.9}
      >
        RESEARCH
      </text>
      <text
        x={595}
        y={32}
        textAnchor="middle"
        fill={COLOR.teal}
        fontFamily={FONT.mono}
        fontSize={9.5}
        letterSpacing="0.18em"
        opacity={0.9}
      >
        EXECUTION
      </text>

      {/* Walk-forward gate */}
      <line
        x1={GATE_X}
        y1={44}
        x2={GATE_X}
        y2={192}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1}
        strokeDasharray="3 6"
      />
      <text
        x={GATE_X}
        y={208}
        textAnchor="middle"
        fill="#5C606F"
        fontFamily={FONT.mono}
        fontSize={8.5}
        letterSpacing="0.12em"
      >
        WALK-FORWARD GATE
      </text>

      {/* Inputs feeding the agents */}
      {INPUTS.map((label, i) => {
        const y = 100 + i * 18;
        return (
          <g key={label}>
            <text
              x={70}
              y={y + 3}
              textAnchor="end"
              fill="#5C606F"
              fontFamily={FONT.mono}
              fontSize={9}
              letterSpacing="0.08em"
            >
              {label}
            </text>
            <line
              x1={76}
              y1={y}
              x2={92}
              y2={y}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1}
            />
            <Arrow x={97} y={y} />
          </g>
        );
      })}

      {/* Pipeline */}
      <Flow x1={196} x2={248} px={px} biDir />
      <Flow x1={364} x2={466} px={px} />
      <Flow x1={562} x2={624} px={px} />

      <StageBox x={100} w={92} label="AGENTS" sub="hypotheses · features" px={px} />
      <GraphBox px={px} />
      <StageBox
        x={470}
        w={92}
        label="MODELS"
        sub="walk-forward validated"
        px={px}
        exec
      />
      <StageBox x={628} w={92} label="ORDERS" sub="live book" px={px} exec />

      {/* Pulse riding the flow line */}
      <circle cx={px} cy={FLOW_Y} r={7} fill={pulseColor} opacity={0.3} />
      <circle cx={px} cy={FLOW_Y} r={3.5} fill={pulseColor} />
    </svg>
  );
}

export function AiNative() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="AI-native" />
          <div
            style={{
              maxWidth: 880,
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
              One graph.{" "}
              <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
                Agents research over it. Models trade on it.
              </span>
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: 820,
                fontSize: "clamp(17px,2vw,21px)",
                lineHeight: 1.6,
                color: "#9CA0B0",
                fontWeight: 300,
              }}
            >
              Today&rsquo;s AI trades by reasoning over price series and
              headlines. It can read that oil spiked — then it infers the
              consequences from scratch, every time. The graph makes propagation
              explicit: who leads, who follows, at what lag.{" "}
              <span style={{ color: "#ECEDF1", fontWeight: 500 }}>
                It is the world model the whole system reasons over
              </span>
              , not something re-derived from text on every call.
            </p>
          </div>

          {/* Fig. 2 — the stack, research to execution */}
          <div
            style={{
              marginTop: 44,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              background: "#0E0F17",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9CA0B0",
                }}
              >
                Fig. 2 · Research to execution
              </span>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#5C606F",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: COLOR.cobaltLight,
                  }}
                />
                SCHEMATIC
              </span>
            </div>
            <div style={{ padding: "18px 20px 8px", background: "#0A0B11" }}>
              <StackFigure />
            </div>
            <div
              style={{
                padding: "11px 16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                fontFamily: FONT.mono,
                fontSize: 10,
                lineHeight: 1.5,
                color: "#4C4F5C",
              }}
            >
              Agents generate hypotheses and extract features over the graph.
              Orders come only from walk-forward-validated models — no agent
              ever touches one.
            </div>
          </div>

          <blockquote
            style={{
              margin: "54px 0 0",
              maxWidth: 940,
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(26px,4vw,44px)",
              lineHeight: 1.22,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            <span style={{ color: COLOR.cobalt, fontStyle: "normal" }}>
              &ldquo;
            </span>
            Research that scales like software.
            <span style={{ color: COLOR.cobalt, fontStyle: "normal" }}>
              &rdquo;
            </span>
            <span
              style={{
                display: "block",
                marginTop: 16,
                fontStyle: "normal",
                fontSize: 16,
                color: "#7B7F8E",
                fontFamily: FONT.sans,
                fontWeight: 400,
              }}
            >
              Agents run the research and every strategy reads the same graph —
              capacity grows without growing the team.
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
