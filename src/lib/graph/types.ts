// RavenGraph — Type Definitions (matches data-contracts.md)

export type NodeType = "stock" | "etf" | "macro" | "sector_proxy";

export interface GraphNode {
  id: string;
  ticker: string;
  name: string;
  type: NodeType;
  cluster_id: string | null;
  market_cap: number | null;
  centrality: number;
  sector_beta: number;
  macro_betas: {
    rates: number;
    oil: number;
    vix: number;
    dxy: number;
  };
  sentiment_score: number;
  current_return_1d: number;
  expected_return_5d: number;
  buy_probability: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  lag_minutes: number;
  direction: "positive" | "negative";
  confidence: number;
  active: boolean;
}

export interface Cluster {
  id: string;
  name: string;
  node_ids: string[];
  density: number;
  avg_internal_weight: number;
  capital_concentration: number;
  avg_internal_lag: number;
  aggregate_market_cap: number;
  density_history: number[];
  color: string;
}

export interface Shock {
  id: string;
  type: "rates_surprise" | "earnings_miss" | "sector_rotation" | "vol_spike" | "oil_shock" | "china_pmi" | "geopolitical" | "custom";
  source_node_id: string;
  magnitude: string;
  magnitude_numeric: number;
  z_score: number;
  historical_percentile: number;
  regime_context: string;
  timestamp: string;
}

export interface PropagationHop {
  hop_number: number;
  source_id: string;
  target_id: string;
  input_value: number;
  edge_weight: number;
  output_value: number;
  lag_minutes: number;
  cumulative_lag: number;
  direction: "positive" | "negative";
}

export interface PropagationResult {
  shock: Shock;
  hops: PropagationHop[];
  total_nodes_impacted: number;
  avg_depth: number;
  max_propagation_time: number;
  most_impacted: {
    node_id: string;
    expected_return_shift: number;
    lag_from_source: number;
  }[];
}

export interface Signal {
  id: string;
  ticker: string;
  direction: "LONG" | "SHORT";
  horizon_days: number;
  expected_return_before: number;
  expected_return_after: number;
  delta: number;
  buy_prob_before: number;
  buy_prob_after: number;
  confidence: "High" | "Medium" | "Low";
  timestamp: string;
  transmission_path: PropagationHop[];
  trigger_shock: Shock;
  decomposition: {
    graph_embedding_delta: number;
    macro_factor: number;
    sector_factor: number;
    sentiment_offset: number;
    net_logit_shift: number;
  };
  logit_before: number;
  logit_after: number;
  threshold: number;
  state_transition: string;
  historical_analog_sharpe: number;
  risk_adjusted_expected_return: number;
}

export interface Position {
  ticker: string;
  name: string;
  direction: "LONG" | "SHORT";
  weight: number;
  cluster_id: string;
  graph_beta_contribution: number;
  neighbor_positions: {
    ticker: string;
    edge_weight: number;
  }[];
}

export interface PortfolioRisk {
  total_positions: number;
  net_exposure: number;
  gross_exposure: number;
  portfolio_beta: number;
  expected_vol: number;
  max_risk_budget_used: number;
  cluster_risk_status: "Within Limits" | "Warning" | "Breach";
  cluster_exposures: {
    cluster_id: string;
    cluster_name: string;
    position_count: number;
    aggregate_weight: number;
    cluster_density: number;
    spillover_risk: number;
  }[];
  stress_scenarios: {
    description: string;
    expected_portfolio_impact: number;
    most_affected_ticker: string;
  }[];
}

export interface GraphMeta {
  total_nodes: number;
  total_edges: number;
  active_clusters: number;
  modularity: number;
  avg_path_length: number;
  regime: string;
  last_updated: string;
}

export type ViewType = "topology" | "propagation" | "signals" | "portfolio";

// Simulation node (extends GraphNode with position from d3-force)
export interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
}
