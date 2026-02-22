"use client";

import {
  positions,
  dalPosition,
  portfolioRisk,
  getNodeById,
  getClusterById,
  formatReturn,
  formatMarketCap,
  CLUSTER_COLORS,
} from "@/lib/graph/data";

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

// ─── Left Panel: Portfolio Summary ──────────────────────────────────

interface PortfolioLeftPanelProps {
  selectedPositionTicker: string | null;
  onPositionClick: (ticker: string | null) => void;
}

export function PortfolioLeftPanel({ selectedPositionTicker, onPositionClick }: PortfolioLeftPanelProps) {
  const allPositions = [...positions, dalPosition];

  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={sectionTitle}>POSITIONS</div>

      {allPositions.map((pos) => {
        const isSelected = selectedPositionTicker === pos.ticker;
        const isLong = pos.direction === "LONG";

        return (
          <button
            key={pos.ticker}
            onClick={() => onPositionClick(isSelected ? null : pos.ticker)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: isSelected ? "#1A2236" : "transparent",
              border: "1px solid " + (isSelected ? "#334155" : "transparent"),
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.15s ease",
              marginBottom: 2,
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.background = "#1A2236";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 1,
                  background: isLong ? "#22C55E" : "#EF4444",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 500, fontSize: 12, color: "#E8ECF1" }}>
                {pos.ticker}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  color: isLong ? "#22C55E" : "#EF4444",
                }}
              >
                {pos.direction}
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#8896A7" }}>
              {(pos.weight * 100).toFixed(1)}%
            </span>
          </button>
        );
      })}

      {/* Portfolio-Level Metrics */}
      <div style={{ ...card, marginTop: 16 }}>
        <div style={sectionTitle}>PORTFOLIO METRICS</div>
        <MetricRow label="Total Positions" value={String(portfolioRisk.total_positions)} />
        <MetricRow label="Net Exposure" value={`${(portfolioRisk.net_exposure * 100).toFixed(1)}%`} />
        <MetricRow label="Gross Exposure" value={`${(portfolioRisk.gross_exposure * 100).toFixed(1)}%`} />
        <MetricRow label="Portfolio Graph-Beta" value={portfolioRisk.portfolio_beta.toFixed(2)} />
        <MetricRow label="Clusters Exposed" value={String(portfolioRisk.cluster_exposures.length)} />
      </div>
    </div>
  );
}

// ─── Right Panel: Risk Detail ───────────────────────────────────────

interface PortfolioRightPanelProps {
  selectedPositionTicker: string | null;
}

export function PortfolioRightPanel({ selectedPositionTicker }: PortfolioRightPanelProps) {
  // Position selected
  if (selectedPositionTicker) {
    const allPositions = [...positions, dalPosition];
    const pos = allPositions.find((p) => p.ticker === selectedPositionTicker);
    if (!pos) return null;

    const node = getNodeById(pos.ticker);
    const cluster = pos.cluster_id ? getClusterById(pos.cluster_id) : null;
    const isLong = pos.direction === "LONG";

    return (
      <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 16, color: "#E8ECF1" }}>
          Position Detail
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: 20, color: "#FFFFFF" }}>
              {pos.ticker}
            </span>
            <span
              style={{
                padding: "2px 8px",
                background: isLong ? "#166534" : "#7F1D1D",
                color: isLong ? "#22C55E" : "#EF4444",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              {pos.direction}
            </span>
          </div>
          <MetricRow label="Weight" value={`${(pos.weight * 100).toFixed(1)}%`} />
          <MetricRow label="Cluster" value={cluster?.name || "—"} />
          <MetricRow label="Centrality" value={node?.centrality.toFixed(3) || "—"} />
          <MetricRow label="Graph-Beta Contribution" value={pos.graph_beta_contribution.toFixed(2)} valueColor={pos.graph_beta_contribution >= 0 ? "#22C55E" : "#EF4444"} />
        </div>

        {pos.neighbor_positions.length > 0 && (
          <div style={card}>
            <div style={sectionTitle}>NEIGHBOR EXPOSURE</div>
            {pos.neighbor_positions.map((np) => (
              <div key={np.ticker} style={metricRow}>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#E8ECF1" }}>
                  {np.ticker}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#8896A7" }}>
                  w={np.edge_weight.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={card}>
          <div style={sectionTitle}>REALLOCATION IMPACT</div>
          <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#8896A7", marginBottom: 8 }}>
            If position were closed:
          </div>
          <MetricRow label="Portfolio Beta" value={`${portfolioRisk.portfolio_beta.toFixed(2)} → ${(portfolioRisk.portfolio_beta - pos.graph_beta_contribution).toFixed(2)}`} />
          <MetricRow label="Cluster Exp" value={`${(pos.weight * 100).toFixed(1)}% → 0%`} />
          <MetricRow label="Expected Vol" value={`${(portfolioRisk.expected_vol * 100).toFixed(1)}% → ${((portfolioRisk.expected_vol - Math.abs(pos.weight) * 0.02) * 100).toFixed(1)}%`} />
        </div>
      </div>
    );
  }

  // Default: Risk overview
  const maxExposure = Math.max(...portfolioRisk.cluster_exposures.map((ce) => ce.aggregate_weight), 0.01);

  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#E8ECF1" }}>
        Portfolio & Risk
      </div>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 11, color: "#4A5568", marginBottom: 16 }}>
        Network-aware position management — exposure and risk measured through graph structure, not just correlation
      </div>

      {/* Cluster Exposure */}
      <div style={card}>
        <div style={sectionTitle}>CLUSTER EXPOSURE</div>
        {portfolioRisk.cluster_exposures.map((ce) => {
          const barPct = Math.min(100, (ce.aggregate_weight / maxExposure) * 100);
          const clusterColor = CLUSTER_COLORS[ce.cluster_id] || "#3B82F6";
          return (
            <div key={ce.cluster_id} style={{ padding: "6px 0", position: "relative" }}>
              {/* Background proportional bar */}
              <div style={{
                position: "absolute", top: 4, left: 0, bottom: 4,
                width: `${barPct}%`, background: clusterColor, opacity: 0.06,
                borderRadius: 3,
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, position: "relative" }}>
                <span style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#E8ECF1" }}>
                  {ce.cluster_name}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#E8ECF1" }}>
                  {(ce.aggregate_weight * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#4A5568" }}>
                  {ce.position_count} pos • dens {ce.cluster_density.toFixed(2)}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  color: ce.spillover_risk > 0.5 ? "#F59E0B" : "#4A5568",
                }}>
                  spill {ce.spillover_risk.toFixed(2)}
                </span>
              </div>
              {/* Exposure bar */}
              <div style={{ height: 3, background: "#1A2236", borderRadius: 1.5, marginTop: 4 }}>
                <div style={{ height: 3, background: clusterColor, borderRadius: 1.5, width: `${barPct}%`, opacity: 0.5 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Metrics */}
      <div style={card}>
        <div style={sectionTitle}>RISK METRICS</div>
        <MetricRow label="Portfolio Beta (Graph-Adj)" value={portfolioRisk.portfolio_beta.toFixed(2)} />
        <MetricRow label="Expected Portfolio Vol" value={`${(portfolioRisk.expected_vol * 100).toFixed(1)}%`} />
        <MetricRow label="Max Risk Budget Used" value={`${(portfolioRisk.max_risk_budget_used * 100).toFixed(0)}%`} />
        <MetricRow
          label="Cluster Risk Status"
          value={portfolioRisk.cluster_risk_status}
          valueColor={
            portfolioRisk.cluster_risk_status === "Within Limits" ? "#22C55E" :
              portfolioRisk.cluster_risk_status === "Warning" ? "#F59E0B" : "#EF4444"
          }
        />
      </div>

      {/* Stress Scenarios */}
      <div style={card}>
        <div style={sectionTitle}>STRESS SCENARIOS</div>
        {portfolioRisk.stress_scenarios.map((ss, i) => (
          <div key={i} style={{ padding: "8px 0", borderBottom: i < portfolioRisk.stress_scenarios.length - 1 ? "1px solid #1E293B" : "none" }}>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#E8ECF1", marginBottom: 4 }}>
              {ss.description}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#EF4444", fontWeight: 500 }}>
                {formatReturn(ss.expected_portfolio_impact)}
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#8896A7" }}>
                worst: {ss.most_affected_ticker}
              </span>
            </div>
          </div>
        ))}
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
