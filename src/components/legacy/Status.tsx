import React from "react";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { Kicker } from "./Kicker";

const rowLabel = (color: string): React.CSSProperties => ({
  fontFamily: FONT.mono,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
  paddingTop: 6,
});
const rowBody: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(18px,2.2vw,24px)",
  lineHeight: 1.5,
  color: "#D7DAE2",
  fontWeight: 300,
};
const strong: React.CSSProperties = { color: "#F1F2F5", fontWeight: 500 };

function Row({
  label,
  color,
  last,
  children,
}: {
  label: string;
  color: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rg-status-row"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px,190px) 1fr",
        gap: 24,
        padding: "30px 0",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: last ? "1px solid rgba(255,255,255,0.08)" : undefined,
      }}
    >
      <div style={rowLabel(color)}>{label}</div>
      <p style={rowBody}>{children}</p>
    </div>
  );
}

export function Status() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="Status" />
          <h2
            style={{
              margin: "0 0 18px",
              maxWidth: 820,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.8vw,54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            Early, live, and{" "}
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>honest</span>{" "}
            about it.
          </h2>

          <div style={{ height: 26 }} />

          <Row label="Engine" color={COLOR.cobalt}>
            Data pipelines, <span style={strong}>80+ features</span> and
            walk-forward validated models. In production for a year.
          </Row>
          {/* OPTIONAL, confirm with Gabriel before shipping. If enabled, the
              number must keep "paper trading" and "small book" in the same
              line: "Equities book up 46% since February, 34 points ahead of
              the S&P 500 (paper trading, small book)." */}
          <Row label="Trading" color={COLOR.teal}>
            Live since <span style={strong}>February 2026</span>.
          </Row>
          <Row label="Partners" color={COLOR.cobaltLight}>
            <span style={strong}>Avant Protocol</span> (DeFi) and a LatAm
            stablecoin payments company.
          </Row>
          {/* TODO: add "First graph model: <date>." once the date is set. */}
          <Row label="Graph layer" color={COLOR.amber} last>
            In build. Current models are baselines.
          </Row>
        </div>
      </div>
    </section>
  );
}
