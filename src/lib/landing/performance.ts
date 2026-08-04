// Real performance track record for Fig. 3.
// Derived from ravengraph_vs_sp500.csv
// (124 trading days, 2026-02-05 → 2026-08-04), cumulative-return columns
// rounded to 2dp. RavenGraph ends +28.70%, S&P 500 ends +12.52%, spread ≈ +16pp.
// If the CSV updates, regenerate these arrays — never inflate the copy.

export interface PerfData {
  N: number;
  rg: number[]; // RavenGraph cumulative return %
  ndx: number[]; // benchmark cumulative return %
  dates: string[]; // "MMM D"
  ticks: [number, string][]; // [index, month label]
  benchLabel: string; // benchmark name for legend/tooltip
  yMin: number; // chart y-axis bounds (%)
  yMax: number;
  grid: number[]; // horizontal gridline values (%)
}

const rg = [
  0, 0, 0.18, 1.3, 1.45, -0.03, -0.21, 1.15, 0.43, 1.74, 1.17, 0.11, -2.53,
  -2.94, -1.24, 0.64, 0.06, 1.05, 2.48, 3.45, 5.51, 5.7, 6.91, 6.92, 7.14,
  7.07, 7.11, 7.99, 8.58, 8.57, 9.21, 8.95, 9.24, 9.61, 8.97, 9.82, 7.95, 7.77,
  11.15, 14.59, 14.62, 15.11, 14.12, 12.84, 12.62, 11.88, 10.47, 9.11, 8.77,
  9.01, 7.33, 7.23, 7.43, 5.34, 4.76, 2.63, 3.57, 2.63, 3.12, 5.15, 6.72, 6.72,
  10.03, 14.79, 13.66, 17.91, 18.61, 16.69, 18.93, 19.86, 17.93, 17.46, 17.31,
  21.15, 22.78, 25.81, 31.58, 30.34, 32.5, 34.99, 36.58, 37.79, 44.36, 43.06,
  32.36, 36.22, 33.4, 30.44, 36.39, 32.56, 37.1, 32.85, 33.71, 37.8, 38.14,
  31.93, 31.01, 39.72, 37, 42.73, 47.22, 40.97, 34.58, 38.19, 33.39, 34.68,
  37.86, 37.49, 32.96, 35.97, 34.01, 29.96, 27.38, 27.45, 31.87, 31, 29.59,
  26.42, 25.92, 25.33, 25.35, 25.26, 26.97, 29.7,
];

const ndx = [
  0, 1.96, 1.96, 2.17, 2.12, 0.55, 0.62, 0.62, 1.29, 1.04, 1.77, 1.77, 1.46,
  2.31, 1.75, 1.29, 1.29, 0.42, 1.14, 0.58, -0.74, -0.74, -0.05, -0.16, -1.68,
  -2.23, -2.23, -0.99, -2.35, -2.59, -4.01, -4.01, -3.31, -2.79, -4.51, -6.15,
  -6.15, -3.77, -3.02, -2.93, -2.93, -2.42, 0.06, 0.64, 0.56, 0.56, 2.78, 3.58,
  3.84, 5.11, 5.11, 4.2, 5.27, 4.86, 5.69, 5.69, 5.35, 5.33, 6.34, 6.65, 6.65,
  7.13, 8.61, 8.28, 9.17, 9.17, 9.27, 9.88, 10.74, 9.4, 9.4, 8.62, 9.73, 9.94,
  10.38, 10.38, 11.11, 11.71, 11.96, 11.96, 12.42, 11.64, 12.05, 9.16, 9.16,
  9.1, 7.4, 9.19, 9.78, 9.78, 11.1, 9.69, 10.82, 10.82, 8.87, 8.83, 8.83, 8.24,
  8.24, 10.81, 10.66, 10.54, 10.54, 10.97, 10.6, 11.53, 12.04, 12.04, 11.59,
  12.01, 11.43, 10.31, 10.31, 11.03, 10.93, 9.53, 9.66, 9.66, 9.94, 8.27,
  10.06, 10.83, 10.83, 12.52,
];

const dates = [
  "Feb 5", "Feb 6", "Feb 7", "Feb 10", "Feb 11", "Feb 12", "Feb 13", "Feb 14",
  "Feb 18", "Feb 19", "Feb 20", "Feb 21", "Feb 24", "Feb 25", "Feb 26",
  "Feb 27", "Feb 28", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 10",
  "Mar 11", "Mar 12", "Mar 13", "Mar 14", "Mar 17", "Mar 18", "Mar 19",
  "Mar 20", "Mar 21", "Mar 24", "Mar 25", "Mar 26", "Mar 27", "Mar 28",
  "Mar 31", "Apr 1", "Apr 2", "Apr 3", "Apr 7", "Apr 8", "Apr 9", "Apr 10",
  "Apr 11", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18", "Apr 21",
  "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 28", "Apr 29", "Apr 30",
  "May 1", "May 2", "May 5", "May 6", "May 7", "May 8", "May 9", "May 12",
  "May 13", "May 14", "May 15", "May 16", "May 19", "May 20", "May 21",
  "May 22", "May 23", "May 27", "May 28", "May 29", "May 30", "Jun 2", "Jun 3",
  "Jun 4", "Jun 5", "Jun 6", "Jun 9", "Jun 10", "Jun 11", "Jun 12", "Jun 13",
  "Jun 16", "Jun 17", "Jun 18", "Jun 19", "Jun 23", "Jun 24", "Jun 25",
  "Jun 26", "Jun 27", "Jun 30", "Jul 1", "Jul 2", "Jul 3", "Jul 7", "Jul 8",
  "Jul 9", "Jul 10", "Jul 11", "Jul 14", "Jul 15", "Jul 16", "Jul 17",
  "Jul 18", "Jul 21", "Jul 22", "Jul 23", "Jul 24", "Jul 25", "Jul 28",
  "Jul 29", "Jul 30", "Jul 31", "Aug 1", "Aug 4",
];

const ticks: [number, string][] = [
  [0, "Feb"],
  [17, "Mar"],
  [38, "Apr"],
  [59, "May"],
  [80, "Jun"],
  [100, "Jul"],
  [122, "Aug"],
];

export const PERF: PerfData = {
  N: rg.length,
  rg,
  ndx,
  dates,
  ticks,
  benchLabel: "S&P 500",
  yMin: -3,
  yMax: 50,
  grid: [0, 10, 20, 30, 40],
};

// ─── ETH book vs ETH ─────────────────────────────────────────────────
// Derived from eth_h7_v2_vs_eth.csv (63 days, 2026-06-03 → 2026-08-04),
// cumulative-return columns rounded to 2dp. RavenGraph ETH book ends
// +5.56%, ETH spot ends +0.02%. Same rule: regenerate, never inflate.

const ethRg = [
  0, 1.2, 1.58, 4.39, 0.24, -0.86, -0.91, 0.23, 0.74, -0.57, -0.36, -0.89,
  -2.57, -5.09, -5.05, -3.63, -1.84, -1.77, -2.55, -1.81, -2.26, -1.08, -0.3,
  0.43, 0.35, 0.36, 0.29, 1.11, 0.43, 1.13, 3.11, 3.75, 3.73, 3.65, 3.42,
  3.96, 4.92, 4.86, 3.52, 3.68, 3.4, 3.47, 4, 4.13, 3.91, 3.82, 3.88, 3.83,
  3.6, 3.08, 3.02, 4.47, 4.92, 4.46, 1.86, 4.17, 2.77, 3.28, 2.92, 5.51,
  6.38, 4.55, 5.56,
];

const ethBench = [
  0, -2.51, -4.77, -14.88, -15.61, -9.12, -9.16, -11.86, -12.81, -10.02,
  -10.4, -9.61, -7.19, -3.42, -3.56, -5.88, -7.96, -7.95, -6.37, -8.22,
  -7.05, -10.36, -12.79, -15.73, -15.14, -15.39, -15.5, -13.27, -15.47,
  -13.47, -8.48, -5.36, -4.19, -3.91, -3.15, -4.68, -6.21, -6.13, -3.36,
  -3.86, -2.81, -4.42, 1.76, 3.19, 0.33, -0.94, 0.22, 0.71, 2.42, 3.79, 4,
  1.01, 0.11, 0.82, 5.12, 1.75, 3.36, 2.74, 3.15, 0.14, -0.81, 1.38, 0.02,
];

const ethDates = [
  "Jun 3", "Jun 4", "Jun 5", "Jun 6", "Jun 7", "Jun 8", "Jun 9", "Jun 10",
  "Jun 11", "Jun 12", "Jun 13", "Jun 14", "Jun 15", "Jun 16", "Jun 17",
  "Jun 18", "Jun 19", "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24",
  "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30", "Jul 1",
  "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9",
  "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15", "Jul 16",
  "Jul 17", "Jul 18", "Jul 19", "Jul 20", "Jul 21", "Jul 22", "Jul 23",
  "Jul 24", "Jul 25", "Jul 26", "Jul 27", "Jul 28", "Jul 29", "Jul 30",
  "Jul 31", "Aug 1", "Aug 2", "Aug 3", "Aug 4",
];

const ethTicks: [number, string][] = [
  [0, "Jun"],
  [28, "Jul"],
  [59, "Aug"],
];

export const ETH_PERF: PerfData = {
  N: ethRg.length,
  rg: ethRg,
  ndx: ethBench,
  dates: ethDates,
  ticks: ethTicks,
  benchLabel: "ETH",
  yMin: -18,
  yMax: 8,
  grid: [-15, -10, -5, 0, 5],
};
