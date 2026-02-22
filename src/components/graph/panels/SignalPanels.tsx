"use client";

import { signals, getNodeById, formatReturn, SIGNAL_THESES } from "@/lib/graph/data";

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

// ─── Left Panel: Signal List ────────────────────────────────────────

interface SignalLeftPanelProps {
  selectedSignalId: string | null;
  onSignalClick: (id: string | null) => void;
}

export function SignalLeftPanel({ selectedSignalId, onSignalClick }: SignalLeftPanelProps) {
  // Sort by confidence: High > Medium > Low
  const confOrder = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...signals].sort((a, b) => confOrder[a.confidence] - confOrder[b.confidence]);

  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={sectionTitle}>ACTIVE SIGNALS</div>
      {sorted.map((sig) => {
        const isSelected = selectedSignalId === sig.id;
        const isLong = sig.direction === "LONG";

        return (
          <button
            key={sig.id}
            onClick={() => onSignalClick(isSelected ? null : sig.id)}
            style={{
              ...card,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              borderColor: isSelected ? "#334155" : "#1E293B",
              borderLeft: isSelected ? `3px solid ${isLong ? "#22C55E" : "#EF4444"}` : "3px solid #1E293B",
              borderRadius: "0 6px 6px 0",
              background: isSelected ? (isLong ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)") : "#111827",
              transition: "all 0.15s ease",
              display: "block",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = "#334155";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = isSelected ? (isLong ? "#22C55E" : "#EF4444") : "#1E293B";
            }}
          >
            {/* Top row: ticker, direction, horizon */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: 16, color: "#FFFFFF" }}>
                {sig.ticker}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 8px",
                    background: isLong ? "#166534" : "#7F1D1D",
                    color: isLong ? "#22C55E" : "#EF4444",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    borderRadius: 2,
                  }}
                >
                  {sig.direction}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#8896A7" }}>
                  {sig.horizon_days}D
                </span>
              </div>
            </div>
            {/* Bottom row: return, confidence */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 11, color: "#8896A7" }}>Exp Return </span>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: sig.expected_return_after >= 0 ? "#22C55E" : "#EF4444",
                }}>
                  {formatReturn(sig.expected_return_after)}
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: sig.confidence === "High" ? "#22C55E" : sig.confidence === "Medium" ? "#F59E0B" : "#6B7280",
              }}>
                {sig.confidence}
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#4A5568", marginTop: 6 }}>
              {new Date(sig.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Right Panel: Signal Detail ─────────────────────────────────────

interface SignalRightPanelProps {
  selectedSignalId: string | null;
}

export function SignalRightPanel({ selectedSignalId }: SignalRightPanelProps) {
  if (!selectedSignalId) {
    return (
      <div style={{ padding: 20, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 14, color: "#8896A7", marginBottom: 8 }}>
            Signal Monitor
          </div>
          <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#4A5568" }}>
            Select a signal to view full detail and graph provenance
          </div>
        </div>
      </div>
    );
  }

  const sig = signals.find((s) => s.id === selectedSignalId);
  if (!sig) return null;

  const isLong = sig.direction === "LONG";

  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#E8ECF1" }}>
        Signal Detail
      </div>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 11, color: "#4A5568", marginBottom: 16 }}>
        Active trading signals with full graph provenance — every signal traces back to a structural cause
      </div>

      {/* Primary Signal Card */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: 24, color: "#FFFFFF" }}>
            {sig.ticker}
          </span>
          <span
            style={{
              padding: "3px 10px",
              background: isLong ? "#166534" : "#7F1D1D",
              color: isLong ? "#22C55E" : "#EF4444",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {sig.direction}
          </span>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#8896A7" }}>
            {sig.horizon_days}D
          </span>
        </div>

        {/* Signal Thesis */}
        {SIGNAL_THESES[sig.id] && (
          <div style={{
            borderLeft: `3px solid ${isLong ? "#22C55E" : "#EF4444"}`,
            background: isLong ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
            borderRadius: "0 4px 4px 0",
            padding: "10px 12px",
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#E8ECF1", lineHeight: 1.5, marginBottom: 8 }}>
              {SIGNAL_THESES[sig.id].thesis}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#8896A7", marginBottom: 2 }}>
              {SIGNAL_THESES[sig.id].path}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#4A5568" }}>
              {SIGNAL_THESES[sig.id].edge}
            </div>
          </div>
        )}

        <MetricRow label="Expected Return" value={`${formatReturn(sig.expected_return_before)} → ${formatReturn(sig.expected_return_after)}`} />
        <MetricRow label="Delta" value={formatReturn(sig.delta)} valueColor={sig.delta >= 0 ? "#22C55E" : "#EF4444"} />
        <MetricRow label="Buy Probability" value={`${sig.buy_prob_before.toFixed(2)} → ${sig.buy_prob_after.toFixed(2)}`} />
        <MetricRow label="Confidence" value={sig.confidence} valueColor={sig.confidence === "High" ? "#22C55E" : sig.confidence === "Medium" ? "#F59E0B" : "#6B7280"} />
      </div>

      {/* Provenance */}
      <div style={sectionTitle}>PROVENANCE — TRANSMISSION PATH</div>
      {sig.transmission_path.map((hop) => {
        const sourceNode = getNodeById(hop.source_id);
        const targetNode = getNodeById(hop.target_id);
        const isNeg = hop.direction === "negative";
        const borderColor = isNeg ? "#EF4444" : "#3B82F6";

        return (
          <div
            key={`${hop.source_id}-${hop.target_id}`}
            style={{
              ...card,
              borderLeft: `3px solid ${borderColor}`,
              borderRadius: "0 6px 6px 0",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 500, color: "#E8ECF1", marginBottom: 4 }}>
              Hop {hop.hop_number}: {sourceNode?.ticker} → {targetNode?.ticker}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: isNeg ? "#EF4444" : "#3B82F6" }}>
              {formatReturn(hop.input_value)} × {hop.edge_weight.toFixed(2)} = {formatReturn(hop.output_value)}
            </div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#4A5568", marginTop: 2 }}>
              Lag: {hop.lag_minutes}m
            </div>
          </div>
        );
      })}

      {/* Model Decomposition */}
      <div style={card}>
        <div style={sectionTitle}>MODEL DECOMPOSITION</div>
        <MetricRow label="Graph Embedding Delta" value={sig.decomposition.graph_embedding_delta.toFixed(2)} valueColor={sig.decomposition.graph_embedding_delta >= 0 ? "#22C55E" : "#EF4444"} />
        <MetricRow label="Macro Factor" value={sig.decomposition.macro_factor.toFixed(2)} valueColor={sig.decomposition.macro_factor >= 0 ? "#22C55E" : "#EF4444"} />
        <MetricRow label="Sector Factor" value={sig.decomposition.sector_factor.toFixed(2)} valueColor={sig.decomposition.sector_factor >= 0 ? "#22C55E" : "#EF4444"} />
        <MetricRow label="Sentiment Offset" value={sig.decomposition.sentiment_offset.toFixed(2)} />
        <MetricRow label="Net Logit Shift" value={sig.decomposition.net_logit_shift.toFixed(2)} valueColor={sig.decomposition.net_logit_shift >= 0 ? "#22C55E" : "#EF4444"} />
      </div>

      {/* State Transition */}
      <div style={card}>
        <div style={sectionTitle}>STATE TRANSITION</div>
        <MetricRow label="Logit" value={`${sig.logit_before.toFixed(2)} → ${sig.logit_after.toFixed(2)}`} />
        <MetricRow label="Threshold" value={sig.threshold.toFixed(2)} />
        <MetricRow label="Signal" value={sig.state_transition} />
      </div>

      {/* Action Card */}
      <div style={card}>
        <div style={sectionTitle}>ACTION</div>
        <MetricRow label="Recommended" value={`${sig.direction} ${sig.ticker}`} />
        <MetricRow label="Horizon" value={`${sig.horizon_days}D`} />
        <MetricRow label="Confidence" value={sig.confidence} />
        <MetricRow label="Historical Sharpe" value={sig.historical_analog_sharpe.toFixed(2)} />
        <MetricRow label="Risk-Adj Expected Return" value={formatReturn(sig.risk_adjusted_expected_return)} valueColor="#22C55E" />
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
