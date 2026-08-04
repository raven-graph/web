"use client";

import React, { useState } from "react";
import { PERF, ETH_PERF, type PerfData } from "@/lib/landing/performance";
import { COLOR, FONT } from "@/lib/landing/tokens";
import { PerformanceChart } from "./PerformanceChart";

interface TabDef {
  key: string;
  tabLabel: string;
  title: string;
  data: PerfData;
  accent: string;
  accentLighter: string;
  caption: string;
}

const TABS: TabDef[] = [
  {
    key: "equities",
    tabLabel: "Equities",
    title: "Live equity book vs. S&P 500",
    data: PERF,
    accent: COLOR.cobalt,
    accentLighter: COLOR.cobaltLighter,
    caption: "Feb–Aug 2026 · small own book · real track record.",
  },
  {
    key: "eth",
    tabLabel: "ETH",
    title: "Live ETH book vs. ETH",
    data: ETH_PERF,
    accent: COLOR.teal,
    accentLighter: "#8FE0C0",
    caption:
      "Jun–Aug 2026 · live on Hyperliquid · micro-size pilot with Avant Protocol.",
  },
];

export function PerformanceCard() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <div
      style={{
        margin: "34px 0 10px",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        background: "#0E0F17",
        padding: "22px 22px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#5C606F",
            }}
          >
            Fig. 3 · Cumulative return
          </div>
          <div
            style={{
              fontFamily: FONT.serif,
              fontSize: 20,
              color: "#ECEDF1",
              marginTop: 4,
            }}
          >
            {tab.title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: 3,
              gap: 2,
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {TABS.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: FONT.mono,
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: i === active ? "#F1F2F5" : "#7A7E8C",
                  background:
                    i === active ? `${t.accent}2E` : "transparent",
                  boxShadow:
                    i === active ? `inset 0 0 0 1px ${t.accent}66` : "none",
                }}
              >
                {t.tabLabel}
              </button>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
              fontSize: 11,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                color: "#C7CAD3",
              }}
            >
              <span style={{ width: 14, height: 2, background: tab.accent }} />
              RavenGraph
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                color: "#9CA0B0",
              }}
            >
              <span style={{ width: 14, height: 2, background: "#6B6F7C" }} />
              {tab.data.benchLabel}
            </span>
          </div>
        </div>
      </div>
      <PerformanceChart
        data={tab.data}
        accent={tab.accent}
        accentLighter={tab.accentLighter}
      />
      <div
        style={{
          marginTop: 10,
          fontFamily: FONT.mono,
          fontSize: 10,
          lineHeight: 1.5,
          color: "#4C4F5C",
        }}
      >
        {tab.caption}
      </div>
    </div>
  );
}
