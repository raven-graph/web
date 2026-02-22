"use client";

import { useRef, useEffect } from "react";
import type { PropagationResult } from "@/lib/graph/types";
import { nodes, getNodeById, formatReturn } from "@/lib/graph/data";

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading), sans-serif",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8896A7",
  marginBottom: 12,
};

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid #1E293B",
  borderRadius: 6,
  padding: 16,
  marginBottom: 12,
};

const metricRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 0",
};

const metricLabel: React.CSSProperties = {
  fontFamily: "var(--font-heading), sans-serif",
  fontWeight: 400,
  fontSize: 12,
  color: "#8896A7",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const metricValue: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontWeight: 500,
  fontSize: 12,
  color: "#E8ECF1",
};

// ─── Shock Types (for display lookup) ────────────────────────────────

const SHOCK_TYPES = [
  { value: "oil_shock", label: "Oil Shock" },
  { value: "rates_surprise", label: "Rates Surprise" },
  { value: "earnings_miss", label: "Earnings Miss" },
  { value: "china_pmi", label: "China PMI" },
  { value: "sector_rotation", label: "Sector Rotation" },
  { value: "vol_spike", label: "Volatility Spike" },
  { value: "geopolitical", label: "Geopolitical" },
  { value: "custom", label: "Custom" },
];

// ─── Scenario Presets ─────────────────────────────────────────────────

const PRESETS = [
  { id: "oil", name: "Oil Supply Disruption", subtitle: "WTI +8% · OPEC+ supply cut", color: "#F59E0B" },
  { id: "rates", name: "Rates Surprise +25bps", subtitle: "FFR +25bps · Fed hawkish", color: "#3B82F6" },
  { id: "china", name: "China PMI Collapse", subtitle: "CNPMI −3pts · manufacturing contraction", color: "#EF4444" },
  { id: "tech", name: "Tech Earnings Miss", subtitle: "NVDA −12% · guidance cut", color: "#8B5CF6" },
];

// ─── Left Panel: Scenario Analysis ──────────────────────────────────

interface PropagationLeftPanelProps {
  shockType: string;
  shockSource: string;
  shockMagnitude: string;
  onShockTypeChange: (v: string) => void;
  onShockSourceChange: (v: string) => void;
  onShockMagnitudeChange: (v: string) => void;
  onRun: () => void;
  propagationState: "idle" | "running" | "complete";
  selectedScenarioId: string;
  onPresetClick: (id: string) => void;
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "#1E2A3A",
  border: "1px solid #1E293B",
  borderRadius: 4,
  color: "#E8ECF1",
  fontFamily: "var(--font-mono), monospace",
  fontSize: 12,
  outline: "none",
};

const inputStyle: React.CSSProperties = {
  ...selectStyle,
};

export function PropagationLeftPanel({
  shockType,
  shockSource,
  shockMagnitude,
  onShockTypeChange,
  onShockSourceChange,
  onShockMagnitudeChange,
  onRun,
  propagationState,
  selectedScenarioId,
  onPresetClick,
}: PropagationLeftPanelProps) {
  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={sectionTitle}>SCENARIO ANALYSIS</div>
      <div style={{
        fontFamily: "var(--font-heading), sans-serif",
        fontSize: 11,
        color: "#4A5568",
        marginTop: -8,
        marginBottom: 14,
      }}>
        Predicted transmission paths from learned graph structure
      </div>

      <div style={card}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ ...metricLabel, display: "block", marginBottom: 6 }}>Shock Type</label>
          <select
            value={shockType}
            onChange={(e) => onShockTypeChange(e.target.value)}
            style={selectStyle}
          >
            {SHOCK_TYPES.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ ...metricLabel, display: "block", marginBottom: 6 }}>Source Node</label>
          <select
            value={shockSource}
            onChange={(e) => onShockSourceChange(e.target.value)}
            style={selectStyle}
          >
            {nodes.filter((n) => n.type === "macro" || n.type === "etf" || n.type === "stock").map((n) => (
              <option key={n.id} value={n.id}>{n.ticker} — {n.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ ...metricLabel, display: "block", marginBottom: 6 }}>Magnitude</label>
          <input
            type="text"
            value={shockMagnitude}
            onChange={(e) => onShockMagnitudeChange(e.target.value)}
            style={inputStyle}
            placeholder="+8% crude"
          />
        </div>

        <button
          onClick={onRun}
          disabled={propagationState === "running"}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: propagationState === "running" ? "#1A2236" : "#3B82F6",
            border: "1px solid " + (propagationState === "running" ? "#334155" : "#3B82F6"),
            borderRadius: 4,
            color: propagationState === "running" ? "#8896A7" : "#FFFFFF",
            fontFamily: "var(--font-heading), sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.03em",
            cursor: propagationState === "running" ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {propagationState === "running" ? "Running..." : propagationState === "complete" ? "Replay Scenario" : "Run Scenario"}
        </button>
      </div>

      <div style={card}>
        <div style={sectionTitle}>SCENARIO PRESETS</div>
        {PRESETS.map((preset) => {
          const isActive = selectedScenarioId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onPresetClick(preset.id)}
              style={{
                padding: "8px 12px",
                borderLeft: `3px solid ${isActive ? preset.color : "#4A5568"}`,
                background: isActive ? "#1A2236" : "transparent",
                borderRadius: "0 4px 4px 0",
                marginBottom: 8,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12,
                fontWeight: 500,
                color: isActive ? "#E8ECF1" : "#8896A7",
              }}>
                {isActive ? "●" : "○"} {preset.name}
              </div>
              <div style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: isActive ? "#8896A7" : "#4A5568",
                marginTop: 2,
                paddingLeft: 14,
              }}>
                {preset.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Right Panel: Scenario Results ──────────────────────────────────

interface PropagationRightPanelProps {
  propagationState: "idle" | "running" | "complete";
  propagationResult: PropagationResult | null;
  activeHopIndex: number;
}

export function PropagationRightPanel({ propagationState, propagationResult, activeHopIndex }: PropagationRightPanelProps) {
  const hopRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeHopIndex < 0) return;
    const el = hopRefs.current.get(activeHopIndex);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeHopIndex]);

  if (propagationState === "idle" || !propagationResult) {
    return (
      <div style={{ padding: 20, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 14, color: "#8896A7", marginBottom: 8 }}>
            Scenario Results
          </div>
          <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#4A5568" }}>
            Select a scenario preset and run to see predicted transmission paths
          </div>
        </div>
      </div>
    );
  }

  const shock = propagationResult.shock;
  const primaryHops = propagationResult.hops.slice(0, 6);

  return (
    <div ref={scrollContainerRef} style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#E8ECF1" }}>
        Scenario Results
      </div>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 11, color: "#4A5568", marginBottom: 16 }}>
        Model-predicted shock transmission through learned graph structure
      </div>

      {/* Scenario Input */}
      <div style={card}>
        <div style={sectionTitle}>SCENARIO INPUT</div>
        <MetricRow label="Type" value={SHOCK_TYPES.find((s) => s.value === shock.type)?.label || shock.type} />
        <MetricRow label="Source" value={getNodeById(shock.source_node_id)?.ticker || shock.source_node_id} />
        <MetricRow label="Magnitude" value={shock.magnitude} />
        <MetricRow label="Z-Score" value={shock.z_score.toFixed(1)} valueColor="#F59E0B" />
        <MetricRow label="Historical Pctl" value={`${shock.historical_percentile}th`} />
        <MetricRow label="Regime" value={shock.regime_context} />
      </div>

      {/* Predicted Transmission */}
      <div style={sectionTitle}>PREDICTED TRANSMISSION</div>
      {primaryHops.map((hop, idx) => {
        const sourceNode = getNodeById(hop.source_id);
        const targetNode = getNodeById(hop.target_id);
        const isNeg = hop.direction === "negative";
        const borderColor = isNeg ? "#EF4444" : "#3B82F6";
        const isActive = idx === activeHopIndex;

        return (
          <div
            key={`${hop.source_id}-${hop.target_id}-${hop.hop_number}`}
            ref={(el) => { if (el) hopRefs.current.set(idx, el); }}
            style={{
              ...card,
              borderLeft: `3px solid ${isActive ? borderColor : hexToRgba(borderColor, 0.5)}`,
              borderRadius: "0 6px 6px 0",
              background: isActive ? "#1A2236" : "#111827",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 500, color: "#E8ECF1", marginBottom: 6 }}>
              Hop {hop.hop_number}: {sourceNode?.ticker} → {targetNode?.ticker}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: isNeg ? "#EF4444" : "#3B82F6" }}>
              {formatReturn(hop.input_value)} × {hop.edge_weight.toFixed(2)} = {formatReturn(hop.output_value)}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#4A5568", marginTop: 4 }}>
              Lag: {hop.lag_minutes}m • Cumulative: {hop.cumulative_lag}m
            </div>
          </div>
        );
      })}

      {/* Impact Summary */}
      <div style={card}>
        <div style={sectionTitle}>IMPACT SUMMARY</div>
        <MetricRow label="Nodes Impacted" value={String(propagationResult.total_nodes_impacted)} />
        <MetricRow label="Avg Depth" value={`${propagationResult.avg_depth.toFixed(1)} hops`} />
        <MetricRow label="Max Prop Time" value={`${propagationResult.max_propagation_time}m`} />
      </div>

      <div style={card}>
        <div style={sectionTitle}>MOST IMPACTED</div>
        {propagationResult.most_impacted.map((imp) => {
          const node = getNodeById(imp.node_id);
          const isNeg = imp.expected_return_shift < 0;
          return (
            <div key={imp.node_id} style={{ ...metricRow, padding: "6px 0" }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#E8ECF1" }}>
                {node?.ticker || imp.node_id}
              </span>
              <div>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 500, color: isNeg ? "#EF4444" : "#22C55E" }}>
                  {formatReturn(imp.expected_return_shift)}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#4A5568", marginLeft: 8 }}>
                  {imp.lag_from_source}m
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={metricRow}>
      <span style={metricLabel}>{label}</span>
      <span style={{ ...metricValue, color: valueColor || "#E8ECF1" }}>{value}</span>
    </div>
  );
}

function hexToRgba(hex: string, a: number): string {
  return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;
}
