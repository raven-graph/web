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
            walk-forward validated models, running in production for a year.
          </Row>
          <Row label="Design partners" color={COLOR.teal}>
            Piloting with a LatAm stablecoin payments API on{" "}
            <span style={strong}>USDT/BRL treasury</span>, and with{" "}
            <span style={strong}>Avant Protocol</span>, a DeFi design partner.
          </Row>
          <Row label="The graph layer" color={COLOR.amber} last>
            Still in build. The core bet, and the hard part. Today&rsquo;s
            forecasts come from the baseline models.
          </Row>
        </div>
      </div>
    </section>
  );
}
