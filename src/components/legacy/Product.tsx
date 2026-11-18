import React from "react";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { Kicker } from "./Kicker";

interface Endpoint {
  name: string;
  desc: string;
  method: "GET" | "POST";
  path: string;
  params: [string, string][];
  returns: string;
  inBuild?: boolean;
}

const ENDPOINTS: Endpoint[] = [
  {
    name: "Forecast",
    desc: "Expected move and confidence for a corridor.",
    method: "GET",
    path: "/forecast",
    params: [
      ["pair", "USDT/BRL"],
      ["horizon", "4h"],
    ],
    returns: "move, confidence",
  },
  {
    name: "Regime",
    desc: "Current risk regime and probability of a shift in 24h.",
    method: "GET",
    path: "/regime",
    params: [
      ["scope", "USDT/BRL"],
      ["horizon", "24h"],
    ],
    returns: "regime, p_shift",
  },
  {
    name: "Stress",
    desc: "If ETH drops 20%, what happens to your exposures, and why.",
    method: "POST",
    path: "/stress",
    params: [["shock", "ETH −20%"]],
    returns: "impact, paths",
    inBuild: true,
  },
];

function EndpointCard({ e }: { e: Endpoint }) {
  return (
    <div
      style={{
        border: e.inBuild
          ? "1px dashed rgba(255,255,255,0.18)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        background: "#0E0F17",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: e.inBuild ? "#9CA0B0" : COLOR.cobaltLighter,
          }}
        >
          {e.name}
        </span>
        {e.inBuild && (
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 9.5,
              letterSpacing: "0.14em",
              color: COLOR.amber,
              border: "1px solid rgba(216,162,59,0.35)",
              borderRadius: 5,
              padding: "3px 7px",
              whiteSpace: "nowrap",
            }}
          >
            IN BUILD
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 16,
          lineHeight: 1.5,
          color: "#D7DAE2",
          fontWeight: 300,
          flex: 1,
        }}
      >
        {e.desc}
      </p>
      <div
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "#0A0B11",
          padding: "13px 15px",
          fontFamily: FONT.mono,
          fontSize: 12.5,
          lineHeight: 1.75,
          color: "#9CA0B0",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <div>
          <span style={{ color: COLOR.cobaltLight, fontWeight: 600 }}>
            {e.method}
          </span>{" "}
          <span style={{ color: "#ECEDF1" }}>{e.path}</span>
        </div>
        {e.params.map(([k, v]) => (
          <div key={k}>
            <span style={{ color: "#5C606F" }}>{k}:</span>{" "}
            <span style={{ color: "#C7CAD3" }}>{v}</span>
          </div>
        ))}
        <div>
          <span style={{ color: e.inBuild ? "#5C606F" : COLOR.teal }}>→</span>{" "}
          <span style={{ color: "#C7CAD3" }}>{e.returns}</span>
        </div>
      </div>
    </div>
  );
}

export function Product() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="Product" />
          <h2
            style={{
              margin: 0,
              maxWidth: 880,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.8vw,54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            One API,{" "}
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
              three answers.
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
              marginTop: 44,
            }}
          >
            {ENDPOINTS.map((e) => (
              <EndpointCard key={e.name} e={e} />
            ))}
          </div>

          <p
            style={{
              margin: "30px 0 0",
              maxWidth: 760,
              fontSize: "clamp(16px,1.8vw,19px)",
              lineHeight: 1.6,
              color: "#9CA0B0",
              fontWeight: 300,
            }}
          >
            Delivered by API and Slack alerts, with a backtest on your own
            conversion history showing what you would have saved.
          </p>
        </div>
      </div>
    </section>
  );
}
