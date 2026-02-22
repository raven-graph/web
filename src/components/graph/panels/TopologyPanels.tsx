"use client";

import React from "react";
import {
  clusters,
  nodes,
  edges,
  graphMeta,
  getNodeById,
  getClusterById,
  getEdgesForNode,
  formatMarketCap,
  CLUSTER_COLORS,
} from "@/lib/graph/data";

// ─── Shared Styles ──────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading), sans-serif",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8896A7",
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

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid #1E293B",
  borderRadius: 6,
  padding: 16,
  marginBottom: 12,
};

// ─── Sparkline ──────────────────────────────────────────────────────

function Sparkline({ data, color, width = 60, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ flexShrink: 0 }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </svg>
  );
}

// ─── Graph Evolution Event Log (§1 v5) ──────────────────────────────

const EVOLUTION_EVENTS = [
  { date: "Feb 18", event: "Airlines density 0.68 — cluster fully formed", context: "Airlines & Transport", color: CLUSTER_COLORS.cluster_airlines },
  { date: "Feb 11", event: "WTI → JETS edge weight ↑ 0.74", context: "was 0.43 sixty days ago (+72%)", color: null },
  { date: "Jan 28", event: "DAL joins Airlines cluster", context: "previously unclustered", color: CLUSTER_COLORS.cluster_airlines },
  { date: "Jan 15", event: "Airlines density crosses 0.50", context: "cluster formation threshold", color: CLUSTER_COLORS.cluster_airlines },
  { date: "Jan 03", event: "Energy density ↑ 0.73", context: "OPEC+ signaling tightening", color: CLUSTER_COLORS.cluster_energy },
  { date: "Dec 29", event: "WTI → XLE edge strengthens to 0.81", context: "highest weight in energy subgraph", color: CLUSTER_COLORS.cluster_energy },
  { date: "Dec 23", event: "Airlines density 0.31", context: "weak grouping first detected", color: CLUSTER_COLORS.cluster_airlines },
];

function GraphEvolutionLog() {
  return (
    <div style={card}>
      <div style={sectionTitle}>GRAPH EVOLUTION (90D)</div>
      <div style={{ position: "relative", paddingLeft: 12 }}>
        {/* Vertical timeline line */}
        <div style={{
          position: "absolute",
          left: 3,
          top: 4,
          bottom: 4,
          width: 1,
          background: "#1E293B",
        }} />
        {EVOLUTION_EVENTS.map((evt, i) => (
          <div key={i} style={{ marginBottom: i < EVOLUTION_EVENTS.length - 1 ? 14 : 0, position: "relative" }}>
            {/* Timeline dot */}
            <div style={{
              position: "absolute",
              left: -12,
              top: 3,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: evt.color || "#4A5568",
            }} />
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: "#8896A7",
                whiteSpace: "nowrap",
                minWidth: 42,
                flexShrink: 0,
              }}>
                {evt.date}
              </span>
              <div>
                <div style={{
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 12,
                  color: "#E8ECF1",
                  lineHeight: 1.3,
                }}>
                  {evt.event}
                </div>
                <div style={{
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 11,
                  color: "#4A5568",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  {evt.color && (
                    <span style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: 1,
                      background: evt.color,
                      flexShrink: 0,
                    }} />
                  )}
                  {evt.context}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Left Panel: Cluster List ───────────────────────────────────────

interface TopologyLeftPanelProps {
  selectedClusterId: string | null;
  onClusterClick: (id: string | null) => void;
}

export function TopologyLeftPanel({ selectedClusterId, onClusterClick }: TopologyLeftPanelProps) {
  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={sectionTitle}>CLUSTERS</div>
      {clusters.map((cluster) => {
        const isSelected = selectedClusterId === cluster.id;
        return (
          <button
            key={cluster.id}
            onClick={() => onClusterClick(isSelected ? null : cluster.id)}
            style={{
              ...card,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              borderColor: isSelected ? cluster.color : "#1E293B",
              background: isSelected ? "#1A2236" : "#111827",
              transition: "all 0.15s ease",
              display: "block",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = "#334155";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.borderColor = "#1E293B";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: cluster.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 13, color: "#E8ECF1" }}>
                {cluster.name}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={metricRow}>
                  <span style={{ ...metricLabel, fontSize: 11 }}>Nodes</span>
                  <span style={{ ...metricValue, fontSize: 11, marginLeft: 8 }}>{cluster.node_ids.length}</span>
                </div>
                <div style={metricRow}>
                  <span style={{ ...metricLabel, fontSize: 11 }}>Density</span>
                  <span style={{ ...metricValue, fontSize: 11, marginLeft: 8 }}>{cluster.density.toFixed(2)}</span>
                </div>
                <div style={metricRow}>
                  <span style={{ ...metricLabel, fontSize: 11 }}>Mkt Cap</span>
                  <span style={{ ...metricValue, fontSize: 11, marginLeft: 8 }}>{formatMarketCap(cluster.aggregate_market_cap)}</span>
                </div>
              </div>
              <Sparkline data={cluster.density_history} color={cluster.color} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Right Panel: Context Panel ─────────────────────────────────────

interface TopologyRightPanelProps {
  selectedNodeId: string | null;
  selectedClusterId: string | null;
}

export function TopologyRightPanel({ selectedNodeId, selectedClusterId }: TopologyRightPanelProps) {
  // Node selected
  if (selectedNodeId) {
    const node = getNodeById(selectedNodeId);
    if (!node) return null;
    const nodeEdges = getEdgesForNode(selectedNodeId)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    return (
      <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 16, color: "#E8ECF1" }}>
          Node Detail
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: 20, color: "#FFFFFF" }}>
              {node.ticker}
            </span>
            <span style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#8896A7" }}>
              {node.name}
            </span>
          </div>

          <MetricRow label="Market Cap" value={formatMarketCap(node.market_cap)} />
          <MetricRow label="Cluster" value={node.cluster_id ? getClusterById(node.cluster_id)?.name || "—" : "Macro"} />
          <MetricRow label="Centrality" value={node.centrality.toFixed(3)} />
          <MetricRow label="Sector Beta" value={node.sector_beta.toFixed(2)} />
        </div>

        <div style={card}>
          <div style={sectionTitle}>MACRO BETAS</div>
          <MetricRow label="Rates" value={node.macro_betas.rates.toFixed(2)} valueColor={node.macro_betas.rates >= 0 ? "#22C55E" : "#EF4444"} />
          <MetricRow label="Oil" value={node.macro_betas.oil.toFixed(2)} valueColor={node.macro_betas.oil >= 0 ? "#22C55E" : "#EF4444"} />
          <MetricRow label="VIX" value={node.macro_betas.vix.toFixed(2)} valueColor={node.macro_betas.vix >= 0 ? "#22C55E" : "#EF4444"} />
          <MetricRow label="DXY" value={node.macro_betas.dxy.toFixed(2)} valueColor={node.macro_betas.dxy >= 0 ? "#22C55E" : "#EF4444"} />
        </div>

        <div style={card}>
          <div style={sectionTitle}>STRONGEST EDGES</div>
          {nodeEdges.map((edge) => {
            const neighbor = edge.source === selectedNodeId ? edge.target : edge.source;
            const neighborNode = getNodeById(neighbor);
            return (
              <div key={edge.id} style={{ ...metricRow, padding: "6px 0" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "#E8ECF1" }}>
                    {neighborNode?.ticker || neighbor}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#4A5568", marginLeft: 6 }}>
                    {edge.direction === "positive" ? "+" : "−"} lag {edge.lag_minutes}m
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 500, color: "#E8ECF1" }}>
                  {edge.weight.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Cluster selected
  if (selectedClusterId) {
    const cluster = getClusterById(selectedClusterId);
    if (!cluster) return null;
    const clusterNodes = cluster.node_ids.map(getNodeById).filter(Boolean);

    return (
      <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 16, color: "#E8ECF1" }}>
          Cluster Detail
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: cluster.color }} />
            <span style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, color: "#FFFFFF" }}>
              {cluster.name}
            </span>
          </div>

          <MetricRow label="Density Score" value={cluster.density.toFixed(2)} />
          <MetricRow label="Avg Internal Tx Weight" value={cluster.avg_internal_weight.toFixed(2)} />
          <MetricRow label="Capital Concentration" value={`${(cluster.capital_concentration * 100).toFixed(1)}%`} />
          <MetricRow label="Avg Internal Lag" value={`${cluster.avg_internal_lag.toFixed(1)}m`} />
          <MetricRow label="Node Count" value={String(cluster.node_ids.length)} />
          <MetricRow label="Aggregate Mkt Cap" value={formatMarketCap(cluster.aggregate_market_cap)} />
        </div>

        <div style={card}>
          <div style={sectionTitle}>CONSTITUENTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "6px 12px", fontSize: 12 }}>
            <span style={{ ...metricLabel, fontSize: 11 }}>TICKER</span>
            <span style={{ ...metricLabel, fontSize: 11 }}>MKT CAP</span>
            <span style={{ ...metricLabel, fontSize: 11, textAlign: "right" }}>CENTRALITY</span>
            {clusterNodes.map((n) => n && (
              <React.Fragment key={n.id}>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 500, color: "#E8ECF1" }}>
                  {n.ticker}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", color: "#8896A7" }}>
                  {formatMarketCap(n.market_cap)}
                </span>
                <span style={{ fontFamily: "var(--font-mono), monospace", color: "#E8ECF1", textAlign: "right" }}>
                  {n.centrality.toFixed(3)}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: graph-level summary + Graph Evolution log
  return (
    <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#E8ECF1" }}>
        System Topology
      </div>
      <div style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 11, color: "#4A5568", marginBottom: 16 }}>
        Live market structure learned by temporal graph neural network — 55 assets, 7 detected clusters
      </div>

      <div style={card}>
        <div style={sectionTitle}>GRAPH METRICS</div>
        <MetricRow label="Total Nodes" value={String(graphMeta.total_nodes)} />
        <MetricRow label="Total Edges" value={String(graphMeta.total_edges)} />
        <MetricRow label="Active Clusters" value={String(graphMeta.active_clusters)} />
        <MetricRow label="Modularity" value={graphMeta.modularity.toFixed(2)} />
        <MetricRow label="Avg Path Length" value={graphMeta.avg_path_length.toFixed(1)} />
      </div>

      <div style={card}>
        <div style={sectionTitle}>REGIME</div>
        <div style={{
          fontFamily: "var(--font-mono), monospace",
          fontWeight: 500,
          fontSize: 14,
          color: "#F59E0B",
          marginBottom: 8,
        }}>
          {graphMeta.regime}
        </div>
        <MetricRow
          label="Last Updated"
          value={new Date(graphMeta.last_updated).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        />
      </div>

      <div style={card}>
        <div style={sectionTitle}>CLUSTER OVERVIEW</div>
        <div style={{ ...metricRow, padding: "4px 0", marginBottom: 4 }}>
          <span style={{ ...metricLabel, fontSize: 10 }}>NAME</span>
          <span style={{ ...metricLabel, fontSize: 10, textAlign: "right" }}>DENSITY</span>
        </div>
        {clusters.map((cluster) => (
          <div key={cluster.id} style={{ ...metricRow, padding: "6px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: cluster.color }} />
              <span style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: 12, color: "#E8ECF1" }}>
                {cluster.name}
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#8896A7" }}>
              {cluster.density.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* §1 v5: Graph Evolution Event Log */}
      <GraphEvolutionLog />
    </div>
  );
}

// ─── Reusable Metric Row ────────────────────────────────────────────

function MetricRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={metricRow}>
      <span style={metricLabel}>{label}</span>
      <span style={{ ...metricValue, color: valueColor || "#E8ECF1" }}>{value}</span>
    </div>
  );
}
