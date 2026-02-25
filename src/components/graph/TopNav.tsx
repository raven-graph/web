"use client";

import type { ViewType } from "@/lib/graph/types";
import { graphMeta } from "@/lib/graph/data";
import Image from "next/image";

const TABS: { id: ViewType; label: string }[] = [
  { id: "topology", label: "Topology" },
  { id: "propagation", label: "Propagation" },
  { id: "signals", label: "Signals" },
  { id: "portfolio", label: "Portfolio" },
];

interface TopNavProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function TopNav({ view, onViewChange }: TopNavProps) {
  return (
    <nav
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#0B0C15",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <a
        href="https://ravengraph.com"
        style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
      >
        <div style={{ position: "relative", width: 24, height: 24 }}>
          <Image
            src="/icon-white-transparent.svg"
            alt="RavenGraph"
            fill
            style={{
              objectFit: "contain",
              filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
        >
          RavenGraph
        </span>
      </a>

      {/* View Tabs */}
      <div style={{ display: "flex", gap: 0, position: "relative" }}>
        {TABS.map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #B066FF" : "2px solid transparent",
                color: isActive ? "#E8ECF1" : "#8896A7",
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.03em",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#E8ECF1";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#8896A7";
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Regime Badge + Timestamp */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            padding: "4px 12px",
            background: "#1A2236",
            border: "1px solid #F59E0B33",
            borderRadius: 4,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            fontWeight: 500,
            color: "#F59E0B",
            letterSpacing: "0.02em",
          }}
        >
          {graphMeta.regime}
        </div>
        <span
          suppressHydrationWarning
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            color: "#4A5568",
          }}
        >
          {new Date(graphMeta.last_updated).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </nav>
  );
}
