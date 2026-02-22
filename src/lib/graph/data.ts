import type { GraphNode, GraphEdge, Cluster, Shock, PropagationHop, PropagationResult, Signal, Position, PortfolioRisk, GraphMeta } from "./types";

// ─── Design System Colors ────────────────────────────────────────────
export const CLUSTER_COLORS: Record<string, string> = {
  cluster_semis: "#3B82F6",       // blue
  cluster_megacap: "#8B5CF6",     // violet
  cluster_financials: "#F59E0B",  // amber
  cluster_energy: "#06B6D4",      // cyan
  cluster_airlines: "#EC4899",    // pink
  cluster_industrials: "#10B981", // emerald
  cluster_utilities: "#6366F1",   // indigo
  macro: "#8896A7",               // gray for macro factors
};

// ─── Nodes (55 total) ────────────────────────────────────────────────

export const nodes: GraphNode[] = [
  // ── Macro Factors (8) ──
  { id: "FED_FUNDS", ticker: "FFR", name: "Fed Funds Rate", type: "macro", cluster_id: null, market_cap: null, centrality: 0.92, sector_beta: 0, macro_betas: { rates: 1.0, oil: 0.05, vix: 0.15, dxy: 0.35 }, sentiment_score: -0.12, current_return_1d: 0.001, expected_return_5d: 0.002, buy_probability: 0.48 },
  { id: "US_10Y", ticker: "US10Y", name: "US 10-Year Treasury Yield", type: "macro", cluster_id: null, market_cap: null, centrality: 0.88, sector_beta: 0, macro_betas: { rates: 0.95, oil: 0.08, vix: 0.22, dxy: 0.31 }, sentiment_score: -0.08, current_return_1d: 0.003, expected_return_5d: 0.001, buy_probability: 0.46 },
  { id: "WTI_CRUDE", ticker: "WTI", name: "WTI Crude Oil", type: "macro", cluster_id: null, market_cap: null, centrality: 0.85, sector_beta: 0, macro_betas: { rates: 0.12, oil: 1.0, vix: 0.18, dxy: -0.42 }, sentiment_score: 0.31, current_return_1d: 0.024, expected_return_5d: 0.018, buy_probability: 0.62 },
  { id: "VIX", ticker: "VIX", name: "CBOE Volatility Index", type: "macro", cluster_id: null, market_cap: null, centrality: 0.91, sector_beta: 0, macro_betas: { rates: 0.18, oil: 0.1, vix: 1.0, dxy: 0.08 }, sentiment_score: -0.45, current_return_1d: 0.052, expected_return_5d: -0.015, buy_probability: 0.38 },
  { id: "DXY", ticker: "DXY", name: "US Dollar Index", type: "macro", cluster_id: null, market_cap: null, centrality: 0.79, sector_beta: 0, macro_betas: { rates: 0.45, oil: -0.15, vix: 0.12, dxy: 1.0 }, sentiment_score: 0.14, current_return_1d: -0.003, expected_return_5d: 0.004, buy_probability: 0.52 },
  { id: "CHINA_PMI", ticker: "CNPMI", name: "China Manufacturing PMI", type: "macro", cluster_id: null, market_cap: null, centrality: 0.61, sector_beta: 0, macro_betas: { rates: 0.05, oil: 0.22, vix: -0.08, dxy: -0.18 }, sentiment_score: -0.21, current_return_1d: -0.002, expected_return_5d: 0.003, buy_probability: 0.44 },
  { id: "GOLD", ticker: "GOLD", name: "Gold Spot Price", type: "macro", cluster_id: null, market_cap: null, centrality: 0.67, sector_beta: 0, macro_betas: { rates: -0.32, oil: 0.1, vix: 0.28, dxy: -0.55 }, sentiment_score: 0.38, current_return_1d: 0.008, expected_return_5d: 0.012, buy_probability: 0.61 },
  { id: "BTC", ticker: "BTC", name: "Bitcoin", type: "macro", cluster_id: null, market_cap: null, centrality: 0.48, sector_beta: 0, macro_betas: { rates: -0.18, oil: 0.02, vix: -0.35, dxy: -0.22 }, sentiment_score: 0.55, current_return_1d: 0.031, expected_return_5d: 0.022, buy_probability: 0.58 },

  // ── Sector Proxies / ETFs (10) ──
  { id: "SMH", ticker: "SMH", name: "VanEck Semiconductor ETF", type: "etf", cluster_id: "cluster_semis", market_cap: 12e9, centrality: 0.82, sector_beta: 1.0, macro_betas: { rates: -0.48, oil: 0.05, vix: -0.62, dxy: -0.12 }, sentiment_score: 0.42, current_return_1d: 0.014, expected_return_5d: 0.019, buy_probability: 0.68 },
  { id: "XLK", ticker: "XLK", name: "Technology Select SPDR", type: "etf", cluster_id: "cluster_megacap", market_cap: 62e9, centrality: 0.78, sector_beta: 1.0, macro_betas: { rates: -0.38, oil: 0.03, vix: -0.55, dxy: -0.08 }, sentiment_score: 0.35, current_return_1d: 0.009, expected_return_5d: 0.013, buy_probability: 0.65 },
  { id: "XLF", ticker: "XLF", name: "Financial Select SPDR", type: "etf", cluster_id: "cluster_financials", market_cap: 38e9, centrality: 0.75, sector_beta: 1.0, macro_betas: { rates: 0.65, oil: -0.05, vix: -0.42, dxy: 0.18 }, sentiment_score: 0.18, current_return_1d: 0.006, expected_return_5d: 0.009, buy_probability: 0.59 },
  { id: "XLE", ticker: "XLE", name: "Energy Select SPDR", type: "etf", cluster_id: "cluster_energy", market_cap: 32e9, centrality: 0.77, sector_beta: 1.0, macro_betas: { rates: 0.12, oil: 0.81, vix: -0.28, dxy: -0.39 }, sentiment_score: 0.29, current_return_1d: 0.019, expected_return_5d: 0.021, buy_probability: 0.64 },
  { id: "JETS", ticker: "JETS", name: "US Global Jets ETF", type: "etf", cluster_id: "cluster_airlines", market_cap: 1.5e9, centrality: 0.72, sector_beta: 1.0, macro_betas: { rates: -0.15, oil: -0.74, vix: -0.45, dxy: -0.08 }, sentiment_score: 0.05, current_return_1d: -0.012, expected_return_5d: 0.012, buy_probability: 0.52 },
  { id: "XLI", ticker: "XLI", name: "Industrial Select SPDR", type: "etf", cluster_id: "cluster_industrials", market_cap: 18e9, centrality: 0.68, sector_beta: 1.0, macro_betas: { rates: -0.18, oil: -0.35, vix: -0.38, dxy: -0.12 }, sentiment_score: 0.12, current_return_1d: 0.004, expected_return_5d: 0.008, buy_probability: 0.56 },
  { id: "XLU", ticker: "XLU", name: "Utilities Select SPDR", type: "etf", cluster_id: "cluster_utilities", market_cap: 15e9, centrality: 0.58, sector_beta: 1.0, macro_betas: { rates: -0.58, oil: -0.08, vix: 0.15, dxy: 0.05 }, sentiment_score: 0.08, current_return_1d: -0.003, expected_return_5d: 0.004, buy_probability: 0.51 },
  { id: "QQQ", ticker: "QQQ", name: "Invesco QQQ Trust", type: "etf", cluster_id: "cluster_megacap", market_cap: 250e9, centrality: 0.84, sector_beta: 1.0, macro_betas: { rates: -0.42, oil: 0.04, vix: -0.68, dxy: -0.1 }, sentiment_score: 0.39, current_return_1d: 0.011, expected_return_5d: 0.016, buy_probability: 0.66 },
  { id: "IYR", ticker: "IYR", name: "iShares US Real Estate ETF", type: "etf", cluster_id: "cluster_utilities", market_cap: 4.5e9, centrality: 0.52, sector_beta: 1.0, macro_betas: { rates: -0.52, oil: -0.05, vix: -0.18, dxy: 0.02 }, sentiment_score: -0.05, current_return_1d: -0.005, expected_return_5d: 0.003, buy_probability: 0.47 },
  { id: "GDX", ticker: "GDX", name: "VanEck Gold Miners ETF", type: "etf", cluster_id: null, market_cap: 14e9, centrality: 0.55, sector_beta: 0.85, macro_betas: { rates: -0.28, oil: 0.05, vix: 0.22, dxy: -0.56 }, sentiment_score: 0.32, current_return_1d: 0.015, expected_return_5d: 0.011, buy_probability: 0.59 },

  // ── Semiconductors Cluster (8) ──
  { id: "NVDA", ticker: "NVDA", name: "NVIDIA Corp", type: "stock", cluster_id: "cluster_semis", market_cap: 2.2e12, centrality: 0.89, sector_beta: 1.15, macro_betas: { rates: -0.52, oil: 0.04, vix: -0.72, dxy: -0.14 }, sentiment_score: 0.72, current_return_1d: 0.018, expected_return_5d: 0.024, buy_probability: 0.71 },
  { id: "AMD", ticker: "AMD", name: "Advanced Micro Devices", type: "stock", cluster_id: "cluster_semis", market_cap: 210e9, centrality: 0.76, sector_beta: 1.22, macro_betas: { rates: -0.48, oil: 0.03, vix: -0.65, dxy: -0.11 }, sentiment_score: 0.58, current_return_1d: 0.022, expected_return_5d: 0.019, buy_probability: 0.67 },
  { id: "AVGO", ticker: "AVGO", name: "Broadcom Inc", type: "stock", cluster_id: "cluster_semis", market_cap: 780e9, centrality: 0.71, sector_beta: 1.05, macro_betas: { rates: -0.38, oil: 0.02, vix: -0.52, dxy: -0.09 }, sentiment_score: 0.45, current_return_1d: 0.012, expected_return_5d: 0.016, buy_probability: 0.64 },
  { id: "ASML", ticker: "ASML", name: "ASML Holding", type: "stock", cluster_id: "cluster_semis", market_cap: 340e9, centrality: 0.65, sector_beta: 1.08, macro_betas: { rates: -0.35, oil: 0.01, vix: -0.48, dxy: -0.22 }, sentiment_score: 0.38, current_return_1d: 0.008, expected_return_5d: 0.014, buy_probability: 0.62 },
  { id: "TSM", ticker: "TSM", name: "Taiwan Semiconductor", type: "stock", cluster_id: "cluster_semis", market_cap: 650e9, centrality: 0.74, sector_beta: 1.1, macro_betas: { rates: -0.41, oil: 0.02, vix: -0.55, dxy: -0.18 }, sentiment_score: 0.51, current_return_1d: 0.015, expected_return_5d: 0.018, buy_probability: 0.66 },
  { id: "INTC", ticker: "INTC", name: "Intel Corp", type: "stock", cluster_id: "cluster_semis", market_cap: 110e9, centrality: 0.52, sector_beta: 0.92, macro_betas: { rates: -0.32, oil: 0.02, vix: -0.42, dxy: -0.08 }, sentiment_score: -0.25, current_return_1d: -0.008, expected_return_5d: -0.005, buy_probability: 0.38 },
  { id: "QCOM", ticker: "QCOM", name: "Qualcomm Inc", type: "stock", cluster_id: "cluster_semis", market_cap: 190e9, centrality: 0.62, sector_beta: 1.02, macro_betas: { rates: -0.36, oil: 0.02, vix: -0.48, dxy: -0.1 }, sentiment_score: 0.28, current_return_1d: 0.006, expected_return_5d: 0.011, buy_probability: 0.58 },
  { id: "MRVL", ticker: "MRVL", name: "Marvell Technology", type: "stock", cluster_id: "cluster_semis", market_cap: 62e9, centrality: 0.55, sector_beta: 1.18, macro_betas: { rates: -0.44, oil: 0.01, vix: -0.58, dxy: -0.09 }, sentiment_score: 0.35, current_return_1d: 0.01, expected_return_5d: 0.013, buy_probability: 0.6 },

  // ── Mega-Cap Tech Cluster (5) ──
  { id: "AAPL", ticker: "AAPL", name: "Apple Inc", type: "stock", cluster_id: "cluster_megacap", market_cap: 3.4e12, centrality: 0.86, sector_beta: 0.95, macro_betas: { rates: -0.32, oil: 0.02, vix: -0.48, dxy: -0.05 }, sentiment_score: 0.48, current_return_1d: 0.007, expected_return_5d: 0.011, buy_probability: 0.63 },
  { id: "MSFT", ticker: "MSFT", name: "Microsoft Corp", type: "stock", cluster_id: "cluster_megacap", market_cap: 3.1e12, centrality: 0.87, sector_beta: 0.98, macro_betas: { rates: -0.35, oil: 0.01, vix: -0.52, dxy: -0.06 }, sentiment_score: 0.52, current_return_1d: 0.009, expected_return_5d: 0.014, buy_probability: 0.66 },
  { id: "GOOGL", ticker: "GOOGL", name: "Alphabet Inc", type: "stock", cluster_id: "cluster_megacap", market_cap: 2.0e12, centrality: 0.81, sector_beta: 1.02, macro_betas: { rates: -0.3, oil: 0.02, vix: -0.5, dxy: -0.07 }, sentiment_score: 0.41, current_return_1d: 0.005, expected_return_5d: 0.01, buy_probability: 0.61 },
  { id: "AMZN", ticker: "AMZN", name: "Amazon.com Inc", type: "stock", cluster_id: "cluster_megacap", market_cap: 1.9e12, centrality: 0.79, sector_beta: 1.05, macro_betas: { rates: -0.28, oil: -0.08, vix: -0.55, dxy: -0.04 }, sentiment_score: 0.44, current_return_1d: 0.012, expected_return_5d: 0.015, buy_probability: 0.64 },
  { id: "META", ticker: "META", name: "Meta Platforms", type: "stock", cluster_id: "cluster_megacap", market_cap: 1.3e12, centrality: 0.75, sector_beta: 1.08, macro_betas: { rates: -0.25, oil: 0.01, vix: -0.52, dxy: -0.06 }, sentiment_score: 0.36, current_return_1d: 0.014, expected_return_5d: 0.012, buy_probability: 0.6 },

  // ── Financials Cluster (6) ──
  { id: "JPM", ticker: "JPM", name: "JPMorgan Chase", type: "stock", cluster_id: "cluster_financials", market_cap: 580e9, centrality: 0.82, sector_beta: 1.08, macro_betas: { rates: 0.62, oil: -0.04, vix: -0.38, dxy: 0.15 }, sentiment_score: 0.42, current_return_1d: 0.008, expected_return_5d: 0.011, buy_probability: 0.63 },
  { id: "GS", ticker: "GS", name: "Goldman Sachs", type: "stock", cluster_id: "cluster_financials", market_cap: 150e9, centrality: 0.74, sector_beta: 1.18, macro_betas: { rates: 0.55, oil: -0.03, vix: -0.45, dxy: 0.12 }, sentiment_score: 0.35, current_return_1d: 0.011, expected_return_5d: 0.013, buy_probability: 0.61 },
  { id: "MS", ticker: "MS", name: "Morgan Stanley", type: "stock", cluster_id: "cluster_financials", market_cap: 140e9, centrality: 0.69, sector_beta: 1.15, macro_betas: { rates: 0.52, oil: -0.02, vix: -0.42, dxy: 0.1 }, sentiment_score: 0.28, current_return_1d: 0.007, expected_return_5d: 0.01, buy_probability: 0.58 },
  { id: "BAC", ticker: "BAC", name: "Bank of America", type: "stock", cluster_id: "cluster_financials", market_cap: 300e9, centrality: 0.71, sector_beta: 1.05, macro_betas: { rates: 0.58, oil: -0.03, vix: -0.35, dxy: 0.14 }, sentiment_score: 0.15, current_return_1d: 0.004, expected_return_5d: 0.007, buy_probability: 0.55 },
  { id: "C", ticker: "C", name: "Citigroup", type: "stock", cluster_id: "cluster_financials", market_cap: 120e9, centrality: 0.58, sector_beta: 1.12, macro_betas: { rates: 0.48, oil: -0.02, vix: -0.38, dxy: 0.11 }, sentiment_score: 0.08, current_return_1d: 0.003, expected_return_5d: 0.005, buy_probability: 0.5 },
  { id: "WFC", ticker: "WFC", name: "Wells Fargo", type: "stock", cluster_id: "cluster_financials", market_cap: 195e9, centrality: 0.64, sector_beta: 1.0, macro_betas: { rates: 0.55, oil: -0.02, vix: -0.32, dxy: 0.12 }, sentiment_score: 0.11, current_return_1d: 0.005, expected_return_5d: 0.006, buy_probability: 0.53 },

  // ── Energy Cluster (5) ──
  { id: "XOM", ticker: "XOM", name: "Exxon Mobil", type: "stock", cluster_id: "cluster_energy", market_cap: 460e9, centrality: 0.78, sector_beta: 1.02, macro_betas: { rates: 0.1, oil: 0.76, vix: -0.22, dxy: -0.35 }, sentiment_score: 0.34, current_return_1d: 0.016, expected_return_5d: 0.018, buy_probability: 0.63 },
  { id: "CVX", ticker: "CVX", name: "Chevron Corp", type: "stock", cluster_id: "cluster_energy", market_cap: 270e9, centrality: 0.72, sector_beta: 0.98, macro_betas: { rates: 0.08, oil: 0.72, vix: -0.2, dxy: -0.32 }, sentiment_score: 0.28, current_return_1d: 0.013, expected_return_5d: 0.015, buy_probability: 0.61 },
  { id: "COP", ticker: "COP", name: "ConocoPhillips", type: "stock", cluster_id: "cluster_energy", market_cap: 130e9, centrality: 0.65, sector_beta: 1.05, macro_betas: { rates: 0.06, oil: 0.68, vix: -0.25, dxy: -0.3 }, sentiment_score: 0.22, current_return_1d: 0.014, expected_return_5d: 0.014, buy_probability: 0.59 },
  { id: "SLB", ticker: "SLB", name: "Schlumberger", type: "stock", cluster_id: "cluster_energy", market_cap: 58e9, centrality: 0.56, sector_beta: 1.15, macro_betas: { rates: 0.04, oil: 0.62, vix: -0.28, dxy: -0.28 }, sentiment_score: 0.15, current_return_1d: 0.018, expected_return_5d: 0.012, buy_probability: 0.57 },
  { id: "OXY", ticker: "OXY", name: "Occidental Petroleum", type: "stock", cluster_id: "cluster_energy", market_cap: 48e9, centrality: 0.51, sector_beta: 1.2, macro_betas: { rates: 0.05, oil: 0.7, vix: -0.3, dxy: -0.32 }, sentiment_score: 0.1, current_return_1d: 0.02, expected_return_5d: 0.016, buy_probability: 0.58 },

  // ── Airlines & Transport Cluster (4) ──
  { id: "DAL", ticker: "DAL", name: "Delta Air Lines", type: "stock", cluster_id: "cluster_airlines", market_cap: 32e9, centrality: 0.68, sector_beta: 1.12, macro_betas: { rates: -0.12, oil: -0.65, vix: -0.42, dxy: -0.05 }, sentiment_score: 0.15, current_return_1d: -0.008, expected_return_5d: 0.012, buy_probability: 0.64 },
  { id: "UAL", ticker: "UAL", name: "United Airlines", type: "stock", cluster_id: "cluster_airlines", market_cap: 24e9, centrality: 0.62, sector_beta: 1.18, macro_betas: { rates: -0.1, oil: -0.62, vix: -0.48, dxy: -0.04 }, sentiment_score: 0.08, current_return_1d: -0.006, expected_return_5d: 0.009, buy_probability: 0.58 },
  { id: "AAL", ticker: "AAL", name: "American Airlines", type: "stock", cluster_id: "cluster_airlines", market_cap: 9e9, centrality: 0.55, sector_beta: 1.35, macro_betas: { rates: -0.15, oil: -0.7, vix: -0.52, dxy: -0.06 }, sentiment_score: -0.12, current_return_1d: -0.015, expected_return_5d: 0.006, buy_probability: 0.48 },
  { id: "LUV", ticker: "LUV", name: "Southwest Airlines", type: "stock", cluster_id: "cluster_airlines", market_cap: 18e9, centrality: 0.51, sector_beta: 1.08, macro_betas: { rates: -0.08, oil: -0.58, vix: -0.38, dxy: -0.03 }, sentiment_score: 0.02, current_return_1d: -0.004, expected_return_5d: 0.007, buy_probability: 0.52 },

  // ── Industrials Cluster (5) ──
  { id: "CAT", ticker: "CAT", name: "Caterpillar Inc", type: "stock", cluster_id: "cluster_industrials", market_cap: 160e9, centrality: 0.72, sector_beta: 1.08, macro_betas: { rates: -0.15, oil: -0.28, vix: -0.35, dxy: -0.18 }, sentiment_score: 0.25, current_return_1d: 0.005, expected_return_5d: 0.009, buy_probability: 0.58 },
  { id: "DE", ticker: "DE", name: "Deere & Co", type: "stock", cluster_id: "cluster_industrials", market_cap: 110e9, centrality: 0.64, sector_beta: 1.02, macro_betas: { rates: -0.12, oil: -0.22, vix: -0.32, dxy: -0.15 }, sentiment_score: 0.18, current_return_1d: 0.003, expected_return_5d: 0.007, buy_probability: 0.55 },
  { id: "HON", ticker: "HON", name: "Honeywell Intl", type: "stock", cluster_id: "cluster_industrials", market_cap: 140e9, centrality: 0.61, sector_beta: 0.95, macro_betas: { rates: -0.1, oil: -0.18, vix: -0.3, dxy: -0.1 }, sentiment_score: 0.2, current_return_1d: 0.004, expected_return_5d: 0.008, buy_probability: 0.56 },
  { id: "GE", ticker: "GE", name: "GE Aerospace", type: "stock", cluster_id: "cluster_industrials", market_cap: 190e9, centrality: 0.67, sector_beta: 1.05, macro_betas: { rates: -0.08, oil: -0.15, vix: -0.35, dxy: -0.08 }, sentiment_score: 0.32, current_return_1d: 0.009, expected_return_5d: 0.012, buy_probability: 0.62 },
  { id: "RTX", ticker: "RTX", name: "RTX Corp", type: "stock", cluster_id: "cluster_industrials", market_cap: 150e9, centrality: 0.59, sector_beta: 0.88, macro_betas: { rates: -0.06, oil: -0.12, vix: -0.25, dxy: -0.05 }, sentiment_score: 0.28, current_return_1d: 0.006, expected_return_5d: 0.01, buy_probability: 0.59 },

  // ── Utilities & REITs Cluster (4) ──
  { id: "NEE", ticker: "NEE", name: "NextEra Energy", type: "stock", cluster_id: "cluster_utilities", market_cap: 155e9, centrality: 0.62, sector_beta: 1.05, macro_betas: { rates: -0.55, oil: -0.06, vix: 0.12, dxy: 0.04 }, sentiment_score: 0.15, current_return_1d: -0.002, expected_return_5d: 0.005, buy_probability: 0.53 },
  { id: "DUK", ticker: "DUK", name: "Duke Energy", type: "stock", cluster_id: "cluster_utilities", market_cap: 85e9, centrality: 0.54, sector_beta: 0.92, macro_betas: { rates: -0.52, oil: -0.04, vix: 0.1, dxy: 0.03 }, sentiment_score: 0.08, current_return_1d: -0.001, expected_return_5d: 0.003, buy_probability: 0.5 },
  { id: "AMT", ticker: "AMT", name: "American Tower", type: "stock", cluster_id: "cluster_utilities", market_cap: 95e9, centrality: 0.56, sector_beta: 0.98, macro_betas: { rates: -0.48, oil: -0.03, vix: -0.12, dxy: 0.02 }, sentiment_score: 0.05, current_return_1d: -0.004, expected_return_5d: 0.004, buy_probability: 0.49 },
  { id: "PLD", ticker: "PLD", name: "Prologis Inc", type: "stock", cluster_id: "cluster_utilities", market_cap: 105e9, centrality: 0.58, sector_beta: 1.01, macro_betas: { rates: -0.5, oil: -0.02, vix: -0.15, dxy: 0.01 }, sentiment_score: 0.1, current_return_1d: -0.003, expected_return_5d: 0.005, buy_probability: 0.51 },
];

// ─── Edges ────────────────────────────────────────────────────────────

const specifiedEdges: GraphEdge[] = [
  // Macro → Sector Transmission Edges
  { id: "FED_FUNDS->XLF", source: "FED_FUNDS", target: "XLF", weight: 0.65, lag_minutes: 3, direction: "positive", confidence: 0.88, active: true },
  { id: "FED_FUNDS->XLU", source: "FED_FUNDS", target: "XLU", weight: 0.58, lag_minutes: 4, direction: "negative", confidence: 0.85, active: true },
  { id: "FED_FUNDS->IYR", source: "FED_FUNDS", target: "IYR", weight: 0.52, lag_minutes: 5, direction: "negative", confidence: 0.82, active: true },
  { id: "FED_FUNDS->SMH", source: "FED_FUNDS", target: "SMH", weight: 0.48, lag_minutes: 5, direction: "negative", confidence: 0.79, active: true },
  { id: "US_10Y->XLF", source: "US_10Y", target: "XLF", weight: 0.71, lag_minutes: 2, direction: "positive", confidence: 0.91, active: true },
  { id: "US_10Y->XLU", source: "US_10Y", target: "XLU", weight: 0.62, lag_minutes: 3, direction: "negative", confidence: 0.87, active: true },
  { id: "WTI_CRUDE->XLE", source: "WTI_CRUDE", target: "XLE", weight: 0.81, lag_minutes: 2, direction: "positive", confidence: 0.94, active: true },
  { id: "WTI_CRUDE->JETS", source: "WTI_CRUDE", target: "JETS", weight: 0.74, lag_minutes: 3, direction: "negative", confidence: 0.91, active: true },
  { id: "WTI_CRUDE->XLI", source: "WTI_CRUDE", target: "XLI", weight: 0.35, lag_minutes: 6, direction: "negative", confidence: 0.72, active: true },
  { id: "VIX->QQQ", source: "VIX", target: "QQQ", weight: 0.68, lag_minutes: 1, direction: "negative", confidence: 0.9, active: true },
  { id: "VIX->XLF", source: "VIX", target: "XLF", weight: 0.42, lag_minutes: 2, direction: "negative", confidence: 0.78, active: true },
  { id: "DXY->XLE", source: "DXY", target: "XLE", weight: 0.39, lag_minutes: 4, direction: "negative", confidence: 0.75, active: true },
  { id: "DXY->GDX", source: "DXY", target: "GDX", weight: 0.56, lag_minutes: 3, direction: "negative", confidence: 0.82, active: true },
  { id: "CHINA_PMI->XLI", source: "CHINA_PMI", target: "XLI", weight: 0.62, lag_minutes: 3, direction: "positive", confidence: 0.76, active: true },
  { id: "CHINA_PMI->XLE", source: "CHINA_PMI", target: "XLE", weight: 0.38, lag_minutes: 5, direction: "positive", confidence: 0.71, active: true },
  { id: "GOLD->GDX", source: "GOLD", target: "GDX", weight: 0.83, lag_minutes: 1, direction: "positive", confidence: 0.95, active: true },
  { id: "BTC->QQQ", source: "BTC", target: "QQQ", weight: 0.29, lag_minutes: 3, direction: "positive", confidence: 0.65, active: true },

  // Sector → Stock Transmission Edges
  { id: "XLE->XOM", source: "XLE", target: "XOM", weight: 0.76, lag_minutes: 1, direction: "positive", confidence: 0.92, active: true },
  { id: "XLE->CVX", source: "XLE", target: "CVX", weight: 0.72, lag_minutes: 1, direction: "positive", confidence: 0.9, active: true },
  { id: "XLE->COP", source: "XLE", target: "COP", weight: 0.65, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "XLE->SLB", source: "XLE", target: "SLB", weight: 0.58, lag_minutes: 2, direction: "positive", confidence: 0.83, active: true },
  { id: "XLE->OXY", source: "XLE", target: "OXY", weight: 0.61, lag_minutes: 2, direction: "positive", confidence: 0.85, active: true },
  { id: "JETS->DAL", source: "JETS", target: "DAL", weight: 0.78, lag_minutes: 1, direction: "positive", confidence: 0.93, active: true },
  { id: "JETS->UAL", source: "JETS", target: "UAL", weight: 0.71, lag_minutes: 1, direction: "positive", confidence: 0.9, active: true },
  { id: "JETS->AAL", source: "JETS", target: "AAL", weight: 0.67, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "JETS->LUV", source: "JETS", target: "LUV", weight: 0.63, lag_minutes: 2, direction: "positive", confidence: 0.85, active: true },
  { id: "SMH->NVDA", source: "SMH", target: "NVDA", weight: 0.54, lag_minutes: 2, direction: "positive", confidence: 0.84, active: true },
  { id: "SMH->AMD", source: "SMH", target: "AMD", weight: 0.61, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "SMH->AVGO", source: "SMH", target: "AVGO", weight: 0.49, lag_minutes: 3, direction: "positive", confidence: 0.81, active: true },
  { id: "SMH->ASML", source: "SMH", target: "ASML", weight: 0.44, lag_minutes: 3, direction: "positive", confidence: 0.78, active: true },
  { id: "SMH->TSM", source: "SMH", target: "TSM", weight: 0.57, lag_minutes: 2, direction: "positive", confidence: 0.85, active: true },
  { id: "SMH->QCOM", source: "SMH", target: "QCOM", weight: 0.46, lag_minutes: 3, direction: "positive", confidence: 0.79, active: true },
  { id: "SMH->INTC", source: "SMH", target: "INTC", weight: 0.39, lag_minutes: 3, direction: "positive", confidence: 0.74, active: true },
  { id: "SMH->MRVL", source: "SMH", target: "MRVL", weight: 0.42, lag_minutes: 3, direction: "positive", confidence: 0.76, active: true },
  { id: "XLK->AAPL", source: "XLK", target: "AAPL", weight: 0.52, lag_minutes: 2, direction: "positive", confidence: 0.84, active: true },
  { id: "XLK->MSFT", source: "XLK", target: "MSFT", weight: 0.57, lag_minutes: 2, direction: "positive", confidence: 0.86, active: true },
  { id: "XLK->GOOGL", source: "XLK", target: "GOOGL", weight: 0.48, lag_minutes: 2, direction: "positive", confidence: 0.82, active: true },
  { id: "XLK->AMZN", source: "XLK", target: "AMZN", weight: 0.44, lag_minutes: 3, direction: "positive", confidence: 0.8, active: true },
  { id: "XLK->META", source: "XLK", target: "META", weight: 0.41, lag_minutes: 3, direction: "positive", confidence: 0.78, active: true },
  { id: "QQQ->XLK", source: "QQQ", target: "XLK", weight: 0.73, lag_minutes: 1, direction: "positive", confidence: 0.92, active: true },
  { id: "XLF->JPM", source: "XLF", target: "JPM", weight: 0.71, lag_minutes: 2, direction: "positive", confidence: 0.91, active: true },
  { id: "XLF->GS", source: "XLF", target: "GS", weight: 0.63, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "XLF->MS", source: "XLF", target: "MS", weight: 0.59, lag_minutes: 2, direction: "positive", confidence: 0.85, active: true },
  { id: "XLF->BAC", source: "XLF", target: "BAC", weight: 0.66, lag_minutes: 2, direction: "positive", confidence: 0.88, active: true },
  { id: "XLF->C", source: "XLF", target: "C", weight: 0.54, lag_minutes: 3, direction: "positive", confidence: 0.83, active: true },
  { id: "XLF->WFC", source: "XLF", target: "WFC", weight: 0.61, lag_minutes: 2, direction: "positive", confidence: 0.86, active: true },
  { id: "XLI->CAT", source: "XLI", target: "CAT", weight: 0.64, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "XLI->DE", source: "XLI", target: "DE", weight: 0.58, lag_minutes: 3, direction: "positive", confidence: 0.84, active: true },
  { id: "XLI->HON", source: "XLI", target: "HON", weight: 0.51, lag_minutes: 3, direction: "positive", confidence: 0.81, active: true },
  { id: "XLI->GE", source: "XLI", target: "GE", weight: 0.55, lag_minutes: 2, direction: "positive", confidence: 0.83, active: true },
  { id: "XLI->RTX", source: "XLI", target: "RTX", weight: 0.49, lag_minutes: 3, direction: "positive", confidence: 0.8, active: true },
  { id: "XLU->NEE", source: "XLU", target: "NEE", weight: 0.68, lag_minutes: 2, direction: "positive", confidence: 0.89, active: true },
  { id: "XLU->DUK", source: "XLU", target: "DUK", weight: 0.64, lag_minutes: 2, direction: "positive", confidence: 0.87, active: true },
  { id: "IYR->AMT", source: "IYR", target: "AMT", weight: 0.62, lag_minutes: 2, direction: "positive", confidence: 0.86, active: true },
  { id: "IYR->PLD", source: "IYR", target: "PLD", weight: 0.59, lag_minutes: 2, direction: "positive", confidence: 0.84, active: true },

  // Notable Cross-Cluster Edges
  { id: "WTI_CRUDE->DAL", source: "WTI_CRUDE", target: "DAL", weight: 0.41, lag_minutes: 5, direction: "negative", confidence: 0.77, active: true },
  { id: "XOM->SLB", source: "XOM", target: "SLB", weight: 0.52, lag_minutes: 3, direction: "positive", confidence: 0.82, active: true },
  { id: "NVDA->MSFT", source: "NVDA", target: "MSFT", weight: 0.37, lag_minutes: 4, direction: "positive", confidence: 0.74, active: true },
  { id: "GOOGL->META", source: "GOOGL", target: "META", weight: 0.43, lag_minutes: 2, direction: "positive", confidence: 0.79, active: true },
  { id: "JPM->GS", source: "JPM", target: "GS", weight: 0.48, lag_minutes: 1, direction: "positive", confidence: 0.82, active: true },
  { id: "CAT->DE", source: "CAT", target: "DE", weight: 0.45, lag_minutes: 2, direction: "positive", confidence: 0.78, active: true },
  { id: "NEE->DUK", source: "NEE", target: "DUK", weight: 0.51, lag_minutes: 2, direction: "positive", confidence: 0.81, active: true },
  { id: "AMT->PLD", source: "AMT", target: "PLD", weight: 0.38, lag_minutes: 3, direction: "positive", confidence: 0.74, active: true },
  { id: "NVDA->AMD", source: "NVDA", target: "AMD", weight: 0.38, lag_minutes: 1, direction: "positive", confidence: 0.76, active: true },
  { id: "GE->RTX", source: "GE", target: "RTX", weight: 0.42, lag_minutes: 2, direction: "positive", confidence: 0.77, active: true },
  { id: "TSM->ASML", source: "TSM", target: "ASML", weight: 0.46, lag_minutes: 3, direction: "positive", confidence: 0.79, active: true },
  { id: "WTI_CRUDE->CAT", source: "WTI_CRUDE", target: "CAT", weight: 0.28, lag_minutes: 8, direction: "negative", confidence: 0.65, active: true },
  { id: "GOLD->BTC", source: "GOLD", target: "BTC", weight: 0.22, lag_minutes: 6, direction: "positive", confidence: 0.58, active: true },
  { id: "DXY->XLF", source: "DXY", target: "XLF", weight: 0.25, lag_minutes: 5, direction: "positive", confidence: 0.64, active: true },
  { id: "BTC->SMH", source: "BTC", target: "SMH", weight: 0.18, lag_minutes: 5, direction: "positive", confidence: 0.55, active: true },

  // Scenario-required edges
  { id: "FED_FUNDS->US_10Y", source: "FED_FUNDS", target: "US_10Y", weight: 0.72, lag_minutes: 1, direction: "positive", confidence: 0.90, active: true },
  { id: "US_10Y->IYR", source: "US_10Y", target: "IYR", weight: 0.58, lag_minutes: 3, direction: "negative", confidence: 0.84, active: true },
  { id: "CHINA_PMI->SMH", source: "CHINA_PMI", target: "SMH", weight: 0.35, lag_minutes: 4, direction: "positive", confidence: 0.68, active: true },
  { id: "NVDA->SMH", source: "NVDA", target: "SMH", weight: 0.65, lag_minutes: 1, direction: "positive", confidence: 0.88, active: true },
  { id: "NVDA->AVGO", source: "NVDA", target: "AVGO", weight: 0.43, lag_minutes: 2, direction: "positive", confidence: 0.78, active: true },
  { id: "NVDA->TSM", source: "NVDA", target: "TSM", weight: 0.40, lag_minutes: 2, direction: "positive", confidence: 0.76, active: true },
  { id: "SMH->XLK", source: "SMH", target: "XLK", weight: 0.44, lag_minutes: 2, direction: "positive", confidence: 0.74, active: true },
];

// Generate intra-cluster edges (each member connected to 2-3 others within cluster)
function generateIntraClusterEdges(): GraphEdge[] {
  const intra: GraphEdge[] = [];
  const clusterStocks: Record<string, string[]> = {
    cluster_semis: ["NVDA", "AMD", "AVGO", "ASML", "TSM", "INTC", "QCOM", "MRVL"],
    cluster_megacap: ["AAPL", "MSFT", "GOOGL", "AMZN", "META"],
    cluster_financials: ["JPM", "GS", "MS", "BAC", "C", "WFC"],
    cluster_energy: ["XOM", "CVX", "COP", "SLB", "OXY"],
    cluster_airlines: ["DAL", "UAL", "AAL", "LUV"],
    cluster_industrials: ["CAT", "DE", "HON", "GE", "RTX"],
    cluster_utilities: ["NEE", "DUK", "AMT", "PLD"],
  };

  const existingIds = new Set(specifiedEdges.map((e) => e.id));

  for (const [, members] of Object.entries(clusterStocks)) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const id1 = `${members[i]}->${members[j]}`;
        const id2 = `${members[j]}->${members[i]}`;
        if (existingIds.has(id1) || existingIds.has(id2)) continue;
        // Only add ~60% of possible pairs to keep density realistic
        if (Math.sin(i * 7 + j * 13) > -0.1) {
          const w = 0.3 + Math.abs(Math.sin(i * 3 + j * 5)) * 0.35;
          intra.push({
            id: id1,
            source: members[i],
            target: members[j],
            weight: Math.round(w * 100) / 100,
            lag_minutes: 1 + Math.floor(Math.abs(Math.sin(i + j)) * 3),
            direction: "positive",
            confidence: 0.65 + Math.abs(Math.sin(i * 2 + j)) * 0.2,
            active: true,
          });
          existingIds.add(id1);
        }
      }
    }
  }
  return intra;
}

export const edges: GraphEdge[] = [...specifiedEdges, ...generateIntraClusterEdges()];

// ─── Clusters ────────────────────────────────────────────────────────

// §4 v4 — Unique density histories per cluster (30 data points each)
// Each cluster tells a different story visible from the sparkline shape

// Semiconductors: steady tightening over 30 days, 0.62 → 0.78, low volatility
const semisDensity = [0.62,0.63,0.63,0.64,0.65,0.65,0.66,0.66,0.67,0.68,0.68,0.69,0.69,0.70,0.70,0.71,0.71,0.72,0.72,0.73,0.73,0.74,0.74,0.75,0.75,0.76,0.76,0.77,0.77,0.78];

// Mega-Cap Tech: flat with dip in middle, 0.48–0.56, ends at 0.52
const megacapDensity = [0.53,0.52,0.54,0.53,0.52,0.51,0.50,0.49,0.48,0.48,0.49,0.48,0.49,0.48,0.49,0.50,0.49,0.50,0.51,0.50,0.51,0.52,0.51,0.52,0.53,0.52,0.53,0.52,0.52,0.52];

// Financials: was tighter, loosened, stabilizing. 0.68 → 0.55 → 0.61
const financialsDensity = [0.68,0.67,0.66,0.65,0.64,0.63,0.62,0.61,0.60,0.59,0.58,0.57,0.56,0.55,0.55,0.55,0.56,0.56,0.57,0.57,0.58,0.58,0.59,0.59,0.59,0.60,0.60,0.60,0.61,0.61];

// Energy: flat ~0.58 for 20 days then sharp ramp to 0.73
const energyDensity = [0.57,0.58,0.57,0.58,0.59,0.58,0.57,0.58,0.59,0.58,0.58,0.57,0.58,0.59,0.58,0.58,0.59,0.58,0.59,0.60,0.62,0.64,0.65,0.67,0.68,0.70,0.71,0.72,0.72,0.73];

// Airlines & Transport: hockey stick. 0.30 → 0.45 (day 15) → 0.68. THE demo story.
const airlinesDensity = [0.30,0.31,0.32,0.33,0.34,0.35,0.36,0.37,0.38,0.39,0.40,0.41,0.42,0.43,0.45,0.47,0.49,0.51,0.53,0.55,0.57,0.59,0.61,0.63,0.64,0.65,0.66,0.67,0.68,0.68];

// Industrials: slight downward drift, 0.60 → 0.55, low volatility
const industrialsDensity = [0.60,0.60,0.59,0.59,0.59,0.59,0.58,0.58,0.58,0.58,0.57,0.57,0.57,0.57,0.57,0.56,0.56,0.56,0.56,0.56,0.56,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55,0.55];

// Utilities & REITs: choppy, no trend. 0.40–0.52, ends at 0.47
const utilitiesDensity = [0.45,0.47,0.44,0.48,0.46,0.43,0.47,0.50,0.48,0.45,0.43,0.46,0.49,0.52,0.50,0.47,0.44,0.46,0.49,0.51,0.48,0.45,0.43,0.46,0.49,0.47,0.45,0.46,0.47,0.47];

export const clusters: Cluster[] = [
  { id: "cluster_semis", name: "Semiconductors", node_ids: ["NVDA", "AMD", "AVGO", "ASML", "TSM", "INTC", "QCOM", "MRVL", "SMH"], density: 0.78, avg_internal_weight: 0.63, capital_concentration: 0.28, avg_internal_lag: 2.2, aggregate_market_cap: 4.554e12, density_history: semisDensity, color: CLUSTER_COLORS.cluster_semis },
  { id: "cluster_megacap", name: "Mega-Cap Tech", node_ids: ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "XLK", "QQQ"], density: 0.52, avg_internal_weight: 0.51, capital_concentration: 0.42, avg_internal_lag: 2.5, aggregate_market_cap: 12.012e12, density_history: megacapDensity, color: CLUSTER_COLORS.cluster_megacap },
  { id: "cluster_financials", name: "Financials", node_ids: ["JPM", "GS", "MS", "BAC", "C", "WFC", "XLF"], density: 0.61, avg_internal_weight: 0.58, capital_concentration: 0.1, avg_internal_lag: 2.0, aggregate_market_cap: 1.523e12, density_history: financialsDensity, color: CLUSTER_COLORS.cluster_financials },
  { id: "cluster_energy", name: "Energy", node_ids: ["XOM", "CVX", "COP", "SLB", "OXY", "XLE"], density: 0.73, avg_internal_weight: 0.65, capital_concentration: 0.06, avg_internal_lag: 1.8, aggregate_market_cap: 998e9, density_history: energyDensity, color: CLUSTER_COLORS.cluster_energy },
  { id: "cluster_airlines", name: "Airlines & Transport", node_ids: ["DAL", "UAL", "AAL", "LUV", "JETS"], density: 0.68, avg_internal_weight: 0.61, capital_concentration: 0.005, avg_internal_lag: 1.5, aggregate_market_cap: 84.5e9, density_history: airlinesDensity, color: CLUSTER_COLORS.cluster_airlines },
  { id: "cluster_industrials", name: "Industrials", node_ids: ["CAT", "DE", "HON", "GE", "RTX", "XLI"], density: 0.55, avg_internal_weight: 0.52, capital_concentration: 0.05, avg_internal_lag: 2.5, aggregate_market_cap: 768e9, density_history: industrialsDensity, color: CLUSTER_COLORS.cluster_industrials },
  { id: "cluster_utilities", name: "Utilities & REITs", node_ids: ["NEE", "DUK", "AMT", "PLD", "XLU", "IYR"], density: 0.47, avg_internal_weight: 0.48, capital_concentration: 0.03, avg_internal_lag: 2.3, aggregate_market_cap: 459.5e9, density_history: utilitiesDensity, color: CLUSTER_COLORS.cluster_utilities },
];

// ─── Demo Scenario: Oil Shock ──────────────────────────────────────

export const oilShock: Shock = {
  id: "shock_oil_001",
  type: "oil_shock",
  source_node_id: "WTI_CRUDE",
  magnitude: "+8% crude",
  magnitude_numeric: 0.08,
  z_score: 2.1,
  historical_percentile: 91,
  regime_context: "Elevated Volatility",
  timestamp: "2026-02-21T14:32:00Z",
};

export const oilShockHops: PropagationHop[] = [
  // Primary path: WTI → JETS → DAL
  { hop_number: 1, source_id: "WTI_CRUDE", target_id: "JETS", input_value: 0.08, edge_weight: 0.74, output_value: -0.0592, lag_minutes: 3, cumulative_lag: 3, direction: "negative" },
  { hop_number: 2, source_id: "JETS", target_id: "DAL", input_value: -0.0592, edge_weight: 0.78, output_value: -0.0462, lag_minutes: 1, cumulative_lag: 4, direction: "negative" },
  // Direct path: WTI → DAL
  { hop_number: 3, source_id: "WTI_CRUDE", target_id: "DAL", input_value: 0.08, edge_weight: 0.41, output_value: -0.0328, lag_minutes: 5, cumulative_lag: 5, direction: "negative" },
  // Secondary: WTI → XLE → XOM
  { hop_number: 4, source_id: "WTI_CRUDE", target_id: "XLE", input_value: 0.08, edge_weight: 0.81, output_value: 0.0648, lag_minutes: 2, cumulative_lag: 2, direction: "positive" },
  { hop_number: 5, source_id: "XLE", target_id: "XOM", input_value: 0.0648, edge_weight: 0.76, output_value: 0.0493, lag_minutes: 1, cumulative_lag: 3, direction: "positive" },
  // Secondary: WTI → XLE → CVX
  { hop_number: 6, source_id: "XLE", target_id: "CVX", input_value: 0.0648, edge_weight: 0.72, output_value: 0.0467, lag_minutes: 1, cumulative_lag: 3, direction: "positive" },
  // Secondary: WTI → XLI → CAT
  { hop_number: 7, source_id: "WTI_CRUDE", target_id: "XLI", input_value: 0.08, edge_weight: 0.35, output_value: -0.028, lag_minutes: 6, cumulative_lag: 6, direction: "negative" },
  { hop_number: 8, source_id: "XLI", target_id: "CAT", input_value: -0.028, edge_weight: 0.64, output_value: -0.0179, lag_minutes: 2, cumulative_lag: 8, direction: "negative" },
  // Secondary: WTI → JETS → UAL
  { hop_number: 9, source_id: "JETS", target_id: "UAL", input_value: -0.0592, edge_weight: 0.71, output_value: -0.042, lag_minutes: 1, cumulative_lag: 4, direction: "negative" },
  // Secondary: WTI → JETS → AAL
  { hop_number: 10, source_id: "JETS", target_id: "AAL", input_value: -0.0592, edge_weight: 0.67, output_value: -0.0397, lag_minutes: 2, cumulative_lag: 5, direction: "negative" },
  // Secondary: WTI → XLE → COP
  { hop_number: 11, source_id: "XLE", target_id: "COP", input_value: 0.0648, edge_weight: 0.65, output_value: 0.0421, lag_minutes: 2, cumulative_lag: 4, direction: "positive" },
  // Secondary: WTI → XLE → SLB
  { hop_number: 12, source_id: "XLE", target_id: "SLB", input_value: 0.0648, edge_weight: 0.58, output_value: 0.0376, lag_minutes: 2, cumulative_lag: 4, direction: "positive" },
];

export const oilShockResult: PropagationResult = {
  shock: oilShock,
  hops: oilShockHops,
  total_nodes_impacted: 14,
  avg_depth: 2.1,
  max_propagation_time: 8,
  most_impacted: [
    { node_id: "XLE", expected_return_shift: 0.0648, lag_from_source: 2 },
    { node_id: "DAL", expected_return_shift: -0.0462, lag_from_source: 4 },
    { node_id: "XOM", expected_return_shift: 0.0493, lag_from_source: 3 },
    { node_id: "CVX", expected_return_shift: 0.0467, lag_from_source: 3 },
    { node_id: "UAL", expected_return_shift: -0.042, lag_from_source: 4 },
  ],
};

// ─── Demo Scenario: Rates Surprise ──────────────────────────────────

export const ratesShock: Shock = {
  id: "shock_rates_001",
  type: "rates_surprise",
  source_node_id: "FED_FUNDS",
  magnitude: "+25bps",
  magnitude_numeric: 0.05,
  z_score: 1.8,
  historical_percentile: 85,
  regime_context: "Elevated Volatility",
  timestamp: "2026-02-21T14:32:00Z",
};

export const ratesShockHops: PropagationHop[] = [
  // Primary: FFR → US10Y → IYR → AMT
  { hop_number: 1, source_id: "FED_FUNDS", target_id: "US_10Y", input_value: 0.05, edge_weight: 0.72, output_value: 0.036, lag_minutes: 1, cumulative_lag: 1, direction: "positive" },
  { hop_number: 2, source_id: "US_10Y", target_id: "IYR", input_value: 0.036, edge_weight: 0.58, output_value: -0.02088, lag_minutes: 3, cumulative_lag: 4, direction: "negative" },
  { hop_number: 3, source_id: "IYR", target_id: "AMT", input_value: -0.02088, edge_weight: 0.62, output_value: -0.01295, lag_minutes: 2, cumulative_lag: 6, direction: "negative" },
  // Secondary: FFR → XLF → JPM
  { hop_number: 4, source_id: "FED_FUNDS", target_id: "XLF", input_value: 0.05, edge_weight: 0.65, output_value: 0.0325, lag_minutes: 3, cumulative_lag: 3, direction: "positive" },
  { hop_number: 5, source_id: "XLF", target_id: "JPM", input_value: 0.0325, edge_weight: 0.71, output_value: 0.02308, lag_minutes: 2, cumulative_lag: 5, direction: "positive" },
  // Secondary: FFR → XLU → NEE
  { hop_number: 6, source_id: "FED_FUNDS", target_id: "XLU", input_value: 0.05, edge_weight: 0.58, output_value: -0.029, lag_minutes: 4, cumulative_lag: 4, direction: "negative" },
  { hop_number: 7, source_id: "XLU", target_id: "NEE", input_value: -0.029, edge_weight: 0.68, output_value: -0.01972, lag_minutes: 2, cumulative_lag: 6, direction: "negative" },
];

export const ratesShockResult: PropagationResult = {
  shock: ratesShock,
  hops: ratesShockHops,
  total_nodes_impacted: 8,
  avg_depth: 2.3,
  max_propagation_time: 6,
  most_impacted: [
    { node_id: "US_10Y", expected_return_shift: 0.036, lag_from_source: 1 },
    { node_id: "XLF", expected_return_shift: 0.0325, lag_from_source: 3 },
    { node_id: "XLU", expected_return_shift: -0.029, lag_from_source: 4 },
    { node_id: "JPM", expected_return_shift: 0.02308, lag_from_source: 5 },
    { node_id: "IYR", expected_return_shift: -0.02088, lag_from_source: 4 },
  ],
};

// ─── Demo Scenario: China PMI Collapse ──────────────────────────────

export const chinaShock: Shock = {
  id: "shock_china_001",
  type: "china_pmi",
  source_node_id: "CHINA_PMI",
  magnitude: "−3pts",
  magnitude_numeric: -0.08,
  z_score: 2.4,
  historical_percentile: 94,
  regime_context: "Elevated Volatility",
  timestamp: "2026-02-21T14:32:00Z",
};

export const chinaShockHops: PropagationHop[] = [
  // Primary: CNPMI → XLI → CAT
  { hop_number: 1, source_id: "CHINA_PMI", target_id: "XLI", input_value: -0.08, edge_weight: 0.62, output_value: -0.0496, lag_minutes: 3, cumulative_lag: 3, direction: "negative" },
  { hop_number: 2, source_id: "XLI", target_id: "CAT", input_value: -0.0496, edge_weight: 0.64, output_value: -0.0317, lag_minutes: 2, cumulative_lag: 5, direction: "negative" },
  // Secondary: XLI → DE
  { hop_number: 3, source_id: "XLI", target_id: "DE", input_value: -0.0496, edge_weight: 0.58, output_value: -0.0288, lag_minutes: 3, cumulative_lag: 6, direction: "negative" },
  // Secondary: CNPMI → SMH → TSM
  { hop_number: 4, source_id: "CHINA_PMI", target_id: "SMH", input_value: -0.08, edge_weight: 0.35, output_value: -0.028, lag_minutes: 4, cumulative_lag: 4, direction: "negative" },
  { hop_number: 5, source_id: "SMH", target_id: "TSM", input_value: -0.028, edge_weight: 0.57, output_value: -0.016, lag_minutes: 2, cumulative_lag: 6, direction: "negative" },
  // Secondary: CNPMI → XLE
  { hop_number: 6, source_id: "CHINA_PMI", target_id: "XLE", input_value: -0.08, edge_weight: 0.38, output_value: -0.0304, lag_minutes: 5, cumulative_lag: 5, direction: "negative" },
];

export const chinaShockResult: PropagationResult = {
  shock: chinaShock,
  hops: chinaShockHops,
  total_nodes_impacted: 9,
  avg_depth: 2.0,
  max_propagation_time: 6,
  most_impacted: [
    { node_id: "XLI", expected_return_shift: -0.0496, lag_from_source: 3 },
    { node_id: "CAT", expected_return_shift: -0.0317, lag_from_source: 5 },
    { node_id: "XLE", expected_return_shift: -0.0304, lag_from_source: 5 },
    { node_id: "DE", expected_return_shift: -0.0288, lag_from_source: 6 },
    { node_id: "SMH", expected_return_shift: -0.028, lag_from_source: 4 },
  ],
};

// ─── Demo Scenario: Tech Earnings Miss ──────────────────────────────

export const techShock: Shock = {
  id: "shock_tech_001",
  type: "earnings_miss",
  source_node_id: "NVDA",
  magnitude: "−12%",
  magnitude_numeric: -0.12,
  z_score: 3.1,
  historical_percentile: 97,
  regime_context: "Elevated Volatility",
  timestamp: "2026-02-21T14:32:00Z",
};

export const techShockHops: PropagationHop[] = [
  // Primary: NVDA → SMH → AMD
  { hop_number: 1, source_id: "NVDA", target_id: "SMH", input_value: -0.12, edge_weight: 0.65, output_value: -0.078, lag_minutes: 1, cumulative_lag: 1, direction: "negative" },
  { hop_number: 2, source_id: "SMH", target_id: "AMD", input_value: -0.078, edge_weight: 0.61, output_value: -0.0476, lag_minutes: 1, cumulative_lag: 2, direction: "negative" },
  // Secondary: NVDA → AVGO
  { hop_number: 3, source_id: "NVDA", target_id: "AVGO", input_value: -0.12, edge_weight: 0.43, output_value: -0.0516, lag_minutes: 2, cumulative_lag: 2, direction: "negative" },
  // Secondary: NVDA → TSM
  { hop_number: 4, source_id: "NVDA", target_id: "TSM", input_value: -0.12, edge_weight: 0.40, output_value: -0.048, lag_minutes: 2, cumulative_lag: 2, direction: "negative" },
  // Secondary: SMH → XLK → MSFT
  { hop_number: 5, source_id: "SMH", target_id: "XLK", input_value: -0.078, edge_weight: 0.44, output_value: -0.0343, lag_minutes: 2, cumulative_lag: 3, direction: "negative" },
  { hop_number: 6, source_id: "XLK", target_id: "MSFT", input_value: -0.0343, edge_weight: 0.57, output_value: -0.0196, lag_minutes: 3, cumulative_lag: 6, direction: "negative" },
];

export const techShockResult: PropagationResult = {
  shock: techShock,
  hops: techShockHops,
  total_nodes_impacted: 11,
  avg_depth: 2.4,
  max_propagation_time: 6,
  most_impacted: [
    { node_id: "SMH", expected_return_shift: -0.078, lag_from_source: 1 },
    { node_id: "AVGO", expected_return_shift: -0.0516, lag_from_source: 2 },
    { node_id: "TSM", expected_return_shift: -0.048, lag_from_source: 2 },
    { node_id: "AMD", expected_return_shift: -0.0476, lag_from_source: 2 },
    { node_id: "XLK", expected_return_shift: -0.0343, lag_from_source: 3 },
  ],
};

// ─── Scenarios Map ──────────────────────────────────────────────────

export const SCENARIOS: Record<string, { shock: Shock; hops: PropagationHop[]; result: PropagationResult }> = {
  oil: { shock: oilShock, hops: oilShockHops, result: oilShockResult },
  rates: { shock: ratesShock, hops: ratesShockHops, result: ratesShockResult },
  china: { shock: chinaShock, hops: chinaShockHops, result: chinaShockResult },
  tech: { shock: techShock, hops: techShockHops, result: techShockResult },
};

// ─── Signal Theses ──────────────────────────────────────────────────

export const SIGNAL_THESES: Record<string, { thesis: string; path: string; edge: string }> = {
  sig_dal_001: {
    thesis: "Oil supply disruption (+8% WTI) propagates through airline cost structure via JETS ETF, creating a high-confidence SHORT opportunity in DAL.",
    path: "WTI → JETS (−5.92%) → DAL (−4.62%)",
    edge: "2 confirming paths · 4min total lag",
  },
  sig_xom_001: {
    thesis: "Oil supply disruption (+8% WTI) benefits upstream producers via XLE sector exposure, creating a high-confidence LONG opportunity in XOM.",
    path: "WTI → XLE (+6.48%) → XOM (+4.93%)",
    edge: "1 direct path · 3min total lag",
  },
  sig_ual_001: {
    thesis: "Oil supply disruption (+8% WTI) propagates through airline cost structure via JETS ETF, creating a medium-confidence SHORT opportunity in UAL.",
    path: "WTI → JETS (−5.92%) → UAL (−3.85%)",
    edge: "1 confirming path · 4min total lag",
  },
  sig_cvx_001: {
    thesis: "Oil supply disruption (+8% WTI) benefits upstream producers via XLE sector exposure, creating a medium-confidence LONG opportunity in CVX.",
    path: "WTI → XLE (+6.48%) → CVX (+4.67%)",
    edge: "1 direct path · 3min total lag",
  },
  sig_aal_001: {
    thesis: "Oil supply disruption (+8% WTI) propagates through airline cost structure via JETS ETF, creating a medium-confidence SHORT opportunity in AAL.",
    path: "WTI → JETS (−5.92%) → AAL (−3.55%)",
    edge: "1 confirming path · 5min total lag",
  },
  sig_cop_001: {
    thesis: "Oil supply disruption (+8% WTI) benefits upstream producers via XLE sector exposure, creating a low-confidence LONG opportunity in COP.",
    path: "WTI → XLE (+6.48%) → COP (+3.89%)",
    edge: "1 direct path · 3min total lag",
  },
};

// ─── Signals (7 total) ──────────────────────────────────────────────

export const signals: Signal[] = [
  {
    id: "sig_dal_001", ticker: "DAL", direction: "SHORT", horizon_days: 5,
    expected_return_before: 0.012, expected_return_after: -0.038, delta: -0.05,
    buy_prob_before: 0.64, buy_prob_after: 0.28, confidence: "High",
    timestamp: "2026-02-21T14:35:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "JETS", input_value: 0.08, edge_weight: 0.74, output_value: -0.0592, lag_minutes: 3, cumulative_lag: 3, direction: "negative" },
      { hop_number: 2, source_id: "JETS", target_id: "DAL", input_value: -0.0592, edge_weight: 0.78, output_value: -0.0462, lag_minutes: 1, cumulative_lag: 4, direction: "negative" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: -0.34, macro_factor: -0.41, sector_factor: -0.28, sentiment_offset: 0.06, net_logit_shift: -0.97 },
    logit_before: 0.22, logit_after: -0.75, threshold: 0.0, state_transition: "LONG → SHORT",
    historical_analog_sharpe: 0.31, risk_adjusted_expected_return: 0.014,
  },
  {
    id: "sig_xom_001", ticker: "XOM", direction: "LONG", horizon_days: 5,
    expected_return_before: 0.018, expected_return_after: 0.041, delta: 0.023,
    buy_prob_before: 0.63, buy_prob_after: 0.82, confidence: "High",
    timestamp: "2026-02-21T14:35:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "XLE", input_value: 0.08, edge_weight: 0.81, output_value: 0.0648, lag_minutes: 2, cumulative_lag: 2, direction: "positive" },
      { hop_number: 2, source_id: "XLE", target_id: "XOM", input_value: 0.0648, edge_weight: 0.76, output_value: 0.0493, lag_minutes: 1, cumulative_lag: 3, direction: "positive" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: 0.28, macro_factor: 0.35, sector_factor: 0.22, sentiment_offset: 0.04, net_logit_shift: 0.89 },
    logit_before: 0.18, logit_after: 1.07, threshold: 0.0, state_transition: "LONG → LONG (strengthened)",
    historical_analog_sharpe: 0.42, risk_adjusted_expected_return: 0.028,
  },
  {
    id: "sig_ual_001", ticker: "UAL", direction: "SHORT", horizon_days: 5,
    expected_return_before: 0.009, expected_return_after: -0.029, delta: -0.038,
    buy_prob_before: 0.58, buy_prob_after: 0.31, confidence: "Medium",
    timestamp: "2026-02-21T14:35:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "JETS", input_value: 0.08, edge_weight: 0.74, output_value: -0.0592, lag_minutes: 3, cumulative_lag: 3, direction: "negative" },
      { hop_number: 2, source_id: "JETS", target_id: "UAL", input_value: -0.0592, edge_weight: 0.71, output_value: -0.042, lag_minutes: 1, cumulative_lag: 4, direction: "negative" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: -0.29, macro_factor: -0.36, sector_factor: -0.24, sentiment_offset: 0.05, net_logit_shift: -0.84 },
    logit_before: 0.12, logit_after: -0.72, threshold: 0.0, state_transition: "LONG → SHORT",
    historical_analog_sharpe: 0.26, risk_adjusted_expected_return: 0.011,
  },
  {
    id: "sig_cvx_001", ticker: "CVX", direction: "LONG", horizon_days: 5,
    expected_return_before: 0.015, expected_return_after: 0.034, delta: 0.019,
    buy_prob_before: 0.61, buy_prob_after: 0.78, confidence: "Medium",
    timestamp: "2026-02-21T14:35:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "XLE", input_value: 0.08, edge_weight: 0.81, output_value: 0.0648, lag_minutes: 2, cumulative_lag: 2, direction: "positive" },
      { hop_number: 2, source_id: "XLE", target_id: "CVX", input_value: 0.0648, edge_weight: 0.72, output_value: 0.0467, lag_minutes: 1, cumulative_lag: 3, direction: "positive" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: 0.24, macro_factor: 0.31, sector_factor: 0.19, sentiment_offset: 0.03, net_logit_shift: 0.77 },
    logit_before: 0.15, logit_after: 0.92, threshold: 0.0, state_transition: "LONG → LONG (strengthened)",
    historical_analog_sharpe: 0.38, risk_adjusted_expected_return: 0.024,
  },
  {
    id: "sig_aal_001", ticker: "AAL", direction: "SHORT", horizon_days: 5,
    expected_return_before: 0.006, expected_return_after: -0.026, delta: -0.032,
    buy_prob_before: 0.48, buy_prob_after: 0.25, confidence: "Medium",
    timestamp: "2026-02-21T14:36:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "JETS", input_value: 0.08, edge_weight: 0.74, output_value: -0.0592, lag_minutes: 3, cumulative_lag: 3, direction: "negative" },
      { hop_number: 2, source_id: "JETS", target_id: "AAL", input_value: -0.0592, edge_weight: 0.67, output_value: -0.0397, lag_minutes: 2, cumulative_lag: 5, direction: "negative" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: -0.25, macro_factor: -0.32, sector_factor: -0.21, sentiment_offset: 0.04, net_logit_shift: -0.74 },
    logit_before: -0.05, logit_after: -0.79, threshold: 0.0, state_transition: "NEUTRAL → SHORT",
    historical_analog_sharpe: 0.22, risk_adjusted_expected_return: 0.009,
  },
  {
    id: "sig_cop_001", ticker: "COP", direction: "LONG", horizon_days: 5,
    expected_return_before: 0.014, expected_return_after: 0.028, delta: 0.014,
    buy_prob_before: 0.59, buy_prob_after: 0.73, confidence: "Low",
    timestamp: "2026-02-21T14:36:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "XLE", input_value: 0.08, edge_weight: 0.81, output_value: 0.0648, lag_minutes: 2, cumulative_lag: 2, direction: "positive" },
      { hop_number: 2, source_id: "XLE", target_id: "COP", input_value: 0.0648, edge_weight: 0.65, output_value: 0.0421, lag_minutes: 2, cumulative_lag: 4, direction: "positive" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: 0.18, macro_factor: 0.25, sector_factor: 0.15, sentiment_offset: 0.02, net_logit_shift: 0.6 },
    logit_before: 0.12, logit_after: 0.72, threshold: 0.0, state_transition: "LONG → LONG (strengthened)",
    historical_analog_sharpe: 0.29, risk_adjusted_expected_return: 0.018,
  },
  {
    id: "sig_slb_001", ticker: "SLB", direction: "LONG", horizon_days: 3,
    expected_return_before: 0.012, expected_return_after: 0.019, delta: 0.007,
    buy_prob_before: 0.57, buy_prob_after: 0.68, confidence: "Low",
    timestamp: "2026-02-21T14:36:00Z",
    transmission_path: [
      { hop_number: 1, source_id: "WTI_CRUDE", target_id: "XLE", input_value: 0.08, edge_weight: 0.81, output_value: 0.0648, lag_minutes: 2, cumulative_lag: 2, direction: "positive" },
      { hop_number: 2, source_id: "XLE", target_id: "SLB", input_value: 0.0648, edge_weight: 0.58, output_value: 0.0376, lag_minutes: 2, cumulative_lag: 4, direction: "positive" },
    ],
    trigger_shock: oilShock,
    decomposition: { graph_embedding_delta: 0.14, macro_factor: 0.2, sector_factor: 0.12, sentiment_offset: 0.01, net_logit_shift: 0.47 },
    logit_before: 0.08, logit_after: 0.55, threshold: 0.0, state_transition: "NEUTRAL → LONG",
    historical_analog_sharpe: 0.24, risk_adjusted_expected_return: 0.013,
  },
];

// ─── Portfolio ──────────────────────────────────────────────────────

export const positions: Position[] = [
  { ticker: "NVDA", name: "NVIDIA Corp", direction: "LONG", weight: 0.042, cluster_id: "cluster_semis", graph_beta_contribution: 0.18, neighbor_positions: [{ ticker: "AMD", edge_weight: 0.38 }, { ticker: "MSFT", edge_weight: 0.37 }] },
  { ticker: "AMD", name: "Advanced Micro Devices", direction: "LONG", weight: 0.021, cluster_id: "cluster_semis", graph_beta_contribution: 0.09, neighbor_positions: [{ ticker: "NVDA", edge_weight: 0.38 }, { ticker: "INTC", edge_weight: 0.35 }] },
  { ticker: "MSFT", name: "Microsoft Corp", direction: "LONG", weight: 0.038, cluster_id: "cluster_megacap", graph_beta_contribution: 0.15, neighbor_positions: [{ ticker: "AAPL", edge_weight: 0.44 }, { ticker: "GOOGL", edge_weight: 0.41 }] },
  { ticker: "AAPL", name: "Apple Inc", direction: "LONG", weight: 0.035, cluster_id: "cluster_megacap", graph_beta_contribution: 0.14, neighbor_positions: [{ ticker: "MSFT", edge_weight: 0.44 }] },
  { ticker: "GOOGL", name: "Alphabet Inc", direction: "LONG", weight: 0.024, cluster_id: "cluster_megacap", graph_beta_contribution: 0.1, neighbor_positions: [{ ticker: "META", edge_weight: 0.43 }, { ticker: "MSFT", edge_weight: 0.41 }] },
  { ticker: "JPM", name: "JPMorgan Chase", direction: "LONG", weight: 0.029, cluster_id: "cluster_financials", graph_beta_contribution: 0.12, neighbor_positions: [{ ticker: "GS", edge_weight: 0.48 }] },
  { ticker: "GS", name: "Goldman Sachs", direction: "LONG", weight: 0.018, cluster_id: "cluster_financials", graph_beta_contribution: 0.08, neighbor_positions: [{ ticker: "JPM", edge_weight: 0.48 }] },
  { ticker: "XOM", name: "Exxon Mobil", direction: "LONG", weight: 0.026, cluster_id: "cluster_energy", graph_beta_contribution: 0.11, neighbor_positions: [{ ticker: "CVX", edge_weight: 0.52 }] },
  { ticker: "CVX", name: "Chevron Corp", direction: "LONG", weight: 0.019, cluster_id: "cluster_energy", graph_beta_contribution: 0.08, neighbor_positions: [{ ticker: "XOM", edge_weight: 0.52 }] },
  { ticker: "CAT", name: "Caterpillar Inc", direction: "LONG", weight: 0.015, cluster_id: "cluster_industrials", graph_beta_contribution: 0.06, neighbor_positions: [] },
  { ticker: "NEE", name: "NextEra Energy", direction: "LONG", weight: 0.012, cluster_id: "cluster_utilities", graph_beta_contribution: 0.04, neighbor_positions: [] },
  { ticker: "META", name: "Meta Platforms", direction: "SHORT", weight: 0.02, cluster_id: "cluster_megacap", graph_beta_contribution: -0.08, neighbor_positions: [{ ticker: "GOOGL", edge_weight: 0.43 }] },
  { ticker: "INTC", name: "Intel Corp", direction: "SHORT", weight: 0.014, cluster_id: "cluster_semis", graph_beta_contribution: -0.05, neighbor_positions: [{ ticker: "AMD", edge_weight: 0.35 }] },
  { ticker: "BAC", name: "Bank of America", direction: "SHORT", weight: 0.011, cluster_id: "cluster_financials", graph_beta_contribution: -0.04, neighbor_positions: [{ ticker: "JPM", edge_weight: 0.42 }] },
];

// New DAL short position (added after signal fires)
export const dalPosition: Position = {
  ticker: "DAL", name: "Delta Air Lines", direction: "SHORT", weight: 0.028, cluster_id: "cluster_airlines",
  graph_beta_contribution: -0.11,
  neighbor_positions: [{ ticker: "UAL", edge_weight: 0.52 }, { ticker: "AAL", edge_weight: 0.45 }],
};

export const portfolioRisk: PortfolioRisk = {
  total_positions: 15,
  net_exposure: 0.236,
  gross_exposure: 0.352,
  portfolio_beta: 0.96,
  expected_vol: 0.135,
  max_risk_budget_used: 0.16,
  cluster_risk_status: "Within Limits",
  cluster_exposures: [
    { cluster_id: "cluster_semis", cluster_name: "Semiconductors", position_count: 3, aggregate_weight: 0.077, cluster_density: 0.78, spillover_risk: 0.62 },
    { cluster_id: "cluster_megacap", cluster_name: "Mega-Cap Tech", position_count: 4, aggregate_weight: 0.117, cluster_density: 0.52, spillover_risk: 0.45 },
    { cluster_id: "cluster_financials", cluster_name: "Financials", position_count: 3, aggregate_weight: 0.058, cluster_density: 0.61, spillover_risk: 0.51 },
    { cluster_id: "cluster_energy", cluster_name: "Energy", position_count: 2, aggregate_weight: 0.045, cluster_density: 0.73, spillover_risk: 0.55 },
    { cluster_id: "cluster_industrials", cluster_name: "Industrials", position_count: 1, aggregate_weight: 0.015, cluster_density: 0.55, spillover_risk: 0.22 },
    { cluster_id: "cluster_utilities", cluster_name: "Utilities & REITs", position_count: 1, aggregate_weight: 0.012, cluster_density: 0.47, spillover_risk: 0.18 },
    { cluster_id: "cluster_airlines", cluster_name: "Airlines & Transport", position_count: 1, aggregate_weight: 0.028, cluster_density: 0.68, spillover_risk: 0.42 },
  ],
  stress_scenarios: [
    { description: "+50bps rates surprise", expected_portfolio_impact: -0.028, most_affected_ticker: "NVDA" },
    { description: "VIX spike to 35", expected_portfolio_impact: -0.035, most_affected_ticker: "AAPL" },
    { description: "China PMI < 48", expected_portfolio_impact: -0.018, most_affected_ticker: "CAT" },
  ],
};

// ─── Graph Metadata ─────────────────────────────────────────────────

export const graphMeta: GraphMeta = {
  total_nodes: 55,
  total_edges: edges.length,
  active_clusters: 7,
  modularity: 0.72,
  avg_path_length: 2.8,
  regime: "Elevated Volatility",
  last_updated: "2026-02-21T14:30:00Z",
};

// ─── Helpers ────────────────────────────────────────────────────────

export function getNodeById(id: string): GraphNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function getClusterById(id: string): Cluster | undefined {
  return clusters.find((c) => c.id === id);
}

export function getNodeCluster(nodeId: string): Cluster | undefined {
  return clusters.find((c) => c.node_ids.includes(nodeId));
}

export function getNodeColor(node: GraphNode): string {
  if (node.cluster_id) return CLUSTER_COLORS[node.cluster_id] || "#8896A7";
  return CLUSTER_COLORS.macro;
}

export function getEdgesForNode(nodeId: string): GraphEdge[] {
  return edges.filter((e) => e.source === nodeId || e.target === nodeId);
}

export function formatMarketCap(cap: number | null): string {
  if (cap === null) return "—";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(0)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap.toFixed(0)}`;
}

export function formatPercent(val: number, signed = true): string {
  const pct = (val * 100).toFixed(2);
  return signed && val > 0 ? `+${pct}%` : `${pct}%`;
}

export function formatReturn(val: number): string {
  const pct = (val * 100).toFixed(2);
  return val >= 0 ? `+${pct}%` : `${pct}%`;
}
