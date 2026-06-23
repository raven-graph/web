import React from "react";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { Kicker } from "./Kicker";

const cardLabel: React.CSSProperties = {
  fontFamily: FONT.mono,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  marginBottom: 18,
};
const cardTitle: React.CSSProperties = {
  margin: "0 0 12px",
  fontFamily: FONT.serif,
  fontWeight: 500,
  fontSize: 26,
  letterSpacing: "-0.01em",
  color: "#F1F2F5",
};
const cardBody: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: 1.6,
  color: "#9CA0B0",
  fontWeight: 300,
};
const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  background: "#14161F",
  padding: 30,
};

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
          <h2
            style={{
              margin: "0 0 46px",
              maxWidth: 880,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.8vw,54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            Agents research.{" "}
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
              Validated models trade.
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            }}
          >
            <div style={card}>
              <div style={{ ...cardLabel, color: COLOR.cobaltLight }}>
                Research
              </div>
              <h3 style={cardTitle}>Agents do the research.</h3>
              <p style={cardBody}>
                They generate hypotheses, extract features from filings and news,
                and query the graph directly. Two people ship like twenty — the
                system scales without a floor of analysts.
              </p>
            </div>
            <div style={card}>
              <div style={{ ...cardLabel, color: COLOR.teal }}>Execution</div>
              <h3 style={cardTitle}>Validated models make the trades.</h3>
              <p style={cardBody}>
                Features flow into neural models and graph embeddings to produce a
                signal — walk-forward validated before a dollar moves. No agent
                ever touches an order.
              </p>
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
            An LLM is a great feature extractor and a terrible portfolio manager.
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
              We never confuse the two.
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
