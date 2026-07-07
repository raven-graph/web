# Handoff: RavenGraph Landing Page

## Overview
A complete redesign of **ravengraph.com** — the marketing site for a graph-native hedge fund. Single long-scroll landing page, dark "instrument/terminal" aesthetic, headline-led, one idea per screen. Audience: YC reviewers and investors. The centerpiece is an interactive **shock-propagation simulator**; there is also a **live performance chart** driven by real data.

This page replaces the old SaaS/alt-data positioning. The thesis: *markets are networks; we model the structure as a real-time graph and trade on it.*

---

## About the Design Files
The files in `reference/` are a **design reference created in HTML** — a working prototype showing the intended look and behavior. They are **not** production code to copy verbatim.

`reference/RavenGraph.dc.html` is authored in a small custom HTML component runtime (loaded via `reference/support.js`). Open it in a browser to see and interact with the real thing — **it is the source of truth for exact pixels, motion, and interaction.** All SVG figures are built programmatically in the `<script>` logic class at the bottom of that file; read that script for the precise geometry and animation math.

**Your task:** recreate this design natively in the target codebase (the `ravengraph-web` repo — Next.js / React). Rebuild the SVG figures as React components using the data and logic documented below. Do not ship the `.dc.html` runtime.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all specified. Recreate pixel-perfectly. Exact hex values, font stacks, and the full interactive data models are in this README; use the reference file to confirm anything ambiguous.

---

## Design Tokens

### Typography
Load from Google Fonts:
```
Spectral: ital,wght@0,400;0,500;1,400
IBM Plex Sans: wght@300;400;500;600
IBM Plex Mono: wght@400;500;600
```
- **Display / headings** — `'Spectral', serif`, weight **500**, `letter-spacing:-0.01em`, `line-height:1.0–1.08`. Emphasis phrases use `font-style:italic` in `#C9CCD6`. Sizes are fluid: hero `clamp(40px,5.6vw,76px)`; section H2 `clamp(30px,4.8vw,54px)`; pull-quote `clamp(26px,4vw,44px)`.
- **Body / UI** — `'IBM Plex Sans', sans-serif`. Body copy weight **300** at `clamp(16px,1.4vw,19px)`–`21px`, `line-height:1.6`, color `#9CA0B0`. Buttons weight **600**.
- **Labels / data / mono** — `'IBM Plex Mono', monospace`. Kickers/eyebrows: `11px`, `letter-spacing:0.2em`, `text-transform:uppercase`, color `#5C82FF`. All numeric/ticker/edge readouts are mono.

### Color palette
| Role | Hex |
|---|---|
| Page background | `#0B0C11` |
| Darker bands (tape, hero bg) | `#0A0B0F`, `#0A0B11` |
| Footer background | `#08090D` |
| Panel background (raised) | `#0E0F17` |
| Card background | `#14161F` |
| Figure/graph inner background | `#0C0D14` |
| Heading text | `#F1F2F5` |
| Strong body text | `#ECEDF1` |
| Italic emphasis text | `#C9CCD6` |
| Body text | `#9CA0B0` |
| Secondary body | `#D7DAE2`, `#C7CAD3`, `#B6BAC6` |
| Muted / captions | `#7B7F8E`, `#5C606F` |
| Faint / disabled | `#4C4F5C`, `#2E3140` |
| **Accent — cobalt (primary)** | `#2D5BFF` |
| Cobalt hover | `#1E47E0` |
| Cobalt light (kickers, schematic) | `#5C82FF` |
| Cobalt lighter (data labels) | `#9DB4FF`, `#BAC9FF` |
| **Data — positive (teal)** | `#3FB98C` |
| **Data — negative (rose)** | `#E2606E` |
| **Data — shock origin (amber)** | `#D8A23B` |
| Benchmark line (gray) | `#6B6F7C` |
| Hairline borders | `rgba(255,255,255,0.06)` → `0.08` |

### Spacing / shape
- Content container: `max-width:1240px; margin:0 auto; padding:0 32px`.
- Section vertical rhythm: `~100px` top/bottom (`padding:100px 0`). Hero is full-height (`min-height:calc(100vh - 102px)`).
- Border radius: cards/panels **14px**, buttons **8px**, inner figures **10px**, chips **10px**, small pills **5–8px**.
- Buttons: height `38–52px`, `padding:0 18–28px`. Primary = cobalt fill, white text, hover `#1E47E0`.
- Hairline dividers between sections: `1px solid rgba(255,255,255,0.06)`.

### Keyframe animations
```css
@keyframes rgring  { 0%,100%{opacity:.22; transform:scale(1)} 50%{opacity:.8; transform:scale(1.16)} } /* shock origin ring */
@keyframes rgtape  { from{transform:translateX(0)} to{transform:translateX(-50%)} }                    /* marquee, 38s linear */
@keyframes rgblink { 0%,100%{opacity:.35} 50%{opacity:1} }                                             /* "SYSTEM LIVE" dot, 2.4s */
```

---

## Screens / Views
One continuous page. Top→bottom:

### 1. Top bar  (height 64px)
- Left: raven icon (`public/icon-white-transparent.svg`, 22×22) + wordmark **"RavenGraph"** (Plex Sans 600, 18px) + vertical divider + mono tag **"Graph-native hedge fund"** (10.5px, uppercase, `0.12em`, `#5C606F`).
- Right: **"SYSTEM LIVE"** (mono 11px, `#5C606F`) preceded by a 6px green dot `#3FB98C` animating `rgblink`; then **"Get in touch"** button (cobalt, 38px) → `mailto:gabriel@ravengraph.com`.
- Bottom border hairline.

### 2. Edge tape  (height 38px, bg `#0A0B0F`)
A horizontally scrolling marquee (animation `rgtape 38s linear infinite`, duplicated track for seamless loop), masked with a left/right fade (`mask-image:linear-gradient(90deg,transparent,#000 4%,#000 92%,transparent)`). A flush-left mono pill **"EDGES"** (cobalt, bordered). Content = calibrated edge readouts, e.g.:
`WTI→XLE β+0.62 · 8m` · `WTI→JETS β−0.48 · 15m` · `10Y→XLK β−0.55 · 12m` · `VIX→SPY β−0.42 · 6m` · `XLK→NVDA β+0.88 · 5m` · `10Y→XLF β+0.45 · 10m`. Positive β in teal, negative in rose.

### 3. Hero
Two-column grid (`repeat(auto-fit,minmax(360px,1fr))`, gap 56px), full viewport height.
- **Animated background** (absolutely positioned, `z-index:0`, behind content): a faint cobalt node-lattice with a **signal sweep** drifting left→right (see *Animated background* below). Masked with a radial gradient so it fades behind the text: `radial-gradient(ellipse 66% 72% at 31% 47%, transparent 8%, #000 66%)`.
- **Left column:** kicker "Graph-native hedge fund"; H1 **"Markets are networks."** / italic **"We trade the structure."**; paragraph: *"RavenGraph models the market as a living graph of stocks, sectors, macro and commodities. **The graph is the asset.**"* (last sentence `#ECEDF1` weight 500); CTA **"Get in touch →"** (cobalt, 50px); mono meta row: `Live, micro-size  /  ~38% YTD equities  /  graph layer in build`.
- **Right column — Fig. 0 instrument panel** (see *Fig. 0* below).

### 4. Demonstration — Fig. 1 shock simulator
Kicker "Demonstration". H2 **"Watch a shock propagate."** (italic "propagate."). Intro paragraph: *"A shock enters the graph at its origin and cascades through calibrated edges — weights and lags learned from history. Pick a scenario, set the severity, scrub the timeline."* Then the interactive (see *Fig. 1* below) laid out as a flex row: large graph card (`flex:1 1 600px`) + a 280px side column with "Headline path" chips and a "Read" takeaway. Small mono footnote: *"Fig. 1 — Edge weights and lags are calibrated examples, not live signals. The graph-powered model is in build."*

### 5. The blind spot
Kicker "The blind spot". H2 **"Everyone trades the same *isolated* time series."** Paragraph about modeling tickers one at a time vs. modeling the structure between them. Below, a 2-column before/after micro-viz (see *Blind-spot viz*):
- Left card: "Isolated time series" — three independent drifting sparklines (AAPL / XOM / JPM). Caption: *"Each ticker modeled alone — moving on its own clock."*
- Right card (cobalt-tinted border): "The graph" — a small connected node graph where one move ripples outward. Caption: *"One move, propagating through the structure."*

### 6. AI-native
Kicker "AI-native". H2 **"Agents research. *Validated models trade.*"** Two cards:
- **Research** (label `#5C82FF`): "Agents do the research." — *"They generate hypotheses, extract features from filings and news, and query the graph directly. Two people ship like twenty — the system scales without a floor of analysts."*
- **Execution** (label `#3FB98C`): "Validated models make the trades." — *"Features flow into neural models and graph embeddings to produce a signal — walk-forward validated before a dollar moves. No agent ever touches an order."*
- Pull quote (Spectral italic, large): **"An LLM is a great feature extractor and a terrible portfolio manager."** with cobalt quotation marks; sub-line "We never confuse the two."

### 7. Status
Kicker "Status". H2 **"Early, live, and *honest* about it."** Then **Fig. 2 performance chart** (see below), then three definition rows (`grid-template-columns:minmax(120px,190px) 1fr`, each separated by top hairline):
- **Equities** (label cobalt): *"Up **~38% year-to-date**, roughly 27 points ahead of the S&P 500. Live trading, on a small own book."*
- **Crypto** (label teal): *"Live on Hyperliquid in a pilot with **Avant Protocol**, our DeFi design partner. Micro-size, with performance shared weekly."*
- **The graph layer** (label amber): *"Still in build — the core bet, and the hard part. Today's results come from the baseline model."*

### 8. Footer  (bg `#08090D`)
H2 **"The market is a graph."** / italic **"We're trading on it first."**; CTA "Get in touch →"; bottom bar with icon + wordmark and `gabriel@ravengraph.com`.

---

## Fig. 0 — Hero market-graph schematic
A static node-link schematic with a continuous animated sweep. **viewBox `0 0 500 372`.**
- Panel chrome: header "Fig. 0 · Market graph" + "SCHEMATIC" pill; the SVG; then three mono edge readouts (`10Y → XLF  β +0.41 · 20m`, `WTI → JETS  β −0.48 · 15m`, `SMH → NVDA  β +0.83 · 6m`); footnote *"Nodes: assets, sectors, macro, commodities. Edges: calibrated lead–lag. Illustrative of the model in build."*
- **17 nodes** (id → x,y,label; `SPY` is the hub, `WTI` is styled as the shock node):
  `SPY(250,46)·hub`, `DXY(60,92)`, `10Y(46,178)`, `VIX(74,262)`, `WTI(118,330)·shock`, `NG(192,320)`, `XLE(210,250)`, `XOM(276,322)`, `JETS(236,150)`, `DAL(312,92)`, `UAL(344,150)`, `AAL(318,214)`, `XLF(300,280)`, `JPM(382,300)`, `XLK(398,96)`, `NVDA(452,150)`, `SMH(438,226)`.
- Node circle r = 15 (hub) / 12.5 (others), fill `#11131C`; stroke `#5C82FF`(shock)/`rgba(255,255,255,0.34)`(hub)/`rgba(255,255,255,0.2)`. Label mono 8.5px, weight 600.
- **Edges** (pairs): DXY–10Y, 10Y–VIX, VIX–SPY, SPY–DXY, WTI–XLE, XLE–XOM, WTI–NG, NG–XLE, WTI–JETS, JETS–DAL, JETS–UAL, JETS–AAL, 10Y–XLF, XLF–JPM, JPM–SPY, SPY–XLK, XLK–NVDA, XLK–SMH, NVDA–SMH, SPY–XLE, SPY–JETS, DXY–WTI. Stroke `#2D5BFF`.
- **Sweep animation:** a soft wavefront moves left→right on an ~11s loop (shared clock with the hero background). Front position `x = -70 + phase*640`; activation `a(x)=exp(-((x-front)/85)²)`. As the front passes a node, draw a cobalt halo ring (r+4, `#5C82FF`, opacity `a*0.55`); edges brighten with opacity `0.22 + a*0.5` and width `1 + a*0.7`. `phase` ∈ [0,1) advances ~30fps.

---

## Fig. 1 — Shock-propagation simulator  ⭐ centerpiece
An interactive directed-graph simulator. The user picks a **scenario**, sets **severity**, and fires a shock that cascades through calibrated edges with per-edge weights (β) and lags (minutes). **viewBox `0 0 720 380`.**

### Graph nodes (FNODES — id → x,y,label,descriptor)
`VIX(58,70,"VIX","vol")`, `TNX(58,196,"10Y","rates")`, `WTI(92,330,"WTI","crude")`, `SPY(372,56,"SPY","index")`, `JETS(232,150,"JETS","airlines")`, `XLE(250,300,"XLE","energy")`, `XOM(388,338,"XOM","exxon")`, `DAL(392,120,"DAL","delta")`, `UAL(392,186,"UAL","united")`, `AAL(300,226,"AAL","american")`, `XLF(520,300,"XLF","financials")`, `JPM(660,322,"JPM","jpmorgan")`, `XLK(548,92,"XLK","tech")`, `NVDA(672,150,"NVDA","nvidia")`, `SMH(628,226,"SMH","semis")`.
Node circle r = 19. Only nodes participating in the active scenario are fully lit; others stay dim (`fill:#10121A`, `stroke:rgba(255,255,255,0.08)`, opacity 0.45) as context.

### Scenarios (3)
Each scenario has an **origin**, an **origin display unit**, a numeric **shock** driver (scaled by severity), a list of **hops** `{from, to, β(w), lag(min)}`, and a 3-node **headline path**.

**Oil · WTI** — origin `WTI`, display `+8.0%` (originBase 8, unit `%`), shock driver 8.
Hops: `WTI→XLE 0.62/8`, `XLE→XOM 0.78/12`, `WTI→JETS -0.48/15`, `JETS→DAL 0.71/11`, `JETS→UAL 0.66/13`, `JETS→AAL 0.69/14`. Path: WTI → JETS → DAL. Title "Fig. 1 · Oil-shock transmission", subtitle "WTI crude → sector network".

**Rates · 10Y** — origin `TNX`, display `+50 bps` (originBase 50, unit `bps`), shock driver 3.0.
Hops: `TNX→XLF 0.45/10`, `XLF→JPM 0.82/6`, `TNX→XLK -0.55/12`, `XLK→NVDA 0.88/5`, `XLK→SMH 0.80/6`, `TNX→SPY -0.18/14`. Path: 10Y → XLK → NVDA. Title "Fig. 1 · Rates-shock transmission", subtitle "10Y yield → equity clusters".

**Vol · VIX** — origin `VIX`, display `+12 pts` (originBase 12, unit `pts`), shock driver 5.0.
Hops: `VIX→SPY -0.42/6`, `SPY→XLK 0.95/8`, `SPY→XLF 0.88/8`, `SPY→JETS 0.80/10`, `SPY→XLE 0.75/10`, `XLK→NVDA 0.90/5`. Path: VIX → SPY → XLK. Title "Fig. 1 · Vol-spike transmission", subtitle "VIX → broad market".

### Propagation model
```
mult       = severity multiplier (Mild 0.6 / Base 1.0 / Severe 1.6)
val[origin] = shock * mult              // driver, hidden; origin DISPLAYS originBase*mult in its unit
val[to]     = val[from] * w             // each hop, in % move
lag[origin] = 0;  lag[to] = lag[from] + hop.lag   // cumulative minutes
```
A clock `t` (model-minutes) advances at SPEED = 14 min/s. `MAXLAG` = max accumulated lag for the active scenario; the timeline runs to `MAXT = MAXLAG + 6`.
- **Node display:** before `t ≥ lag` show `·`. When reached, ramp the value with `ease(p)=1-(1-p)² , p=(t-lag)/4`. Origin shows `±originBase*mult` in its unit (e.g. `+50 bps`); other nodes show `±val%` (1 dp). Reached node colors: origin = amber set (`stroke #D8A23B, fill #1C1608`), positive = teal set (`#3FB98C / #0F1A16`), negative = rose set (`#E2606E / #1B1014`); stroke width 2.2, ticker `#F1F2F5`.
- **Edges:** drawn only for the active scenario. Charged (when `t ≥ lag[to]`) → colored by sign (teal/rose), width 2.2; else `rgba(255,255,255,0.12)`, width 1.2. Optional β/lag label at midpoint (toggle `showEdgeLabels`).
- **Traveling pulses:** for each hop in transit (`lag[from] ≤ t < lag[to]`), draw a dot interpolated along the edge at `f=(t-lag[from])/(lag[to]-lag[from])`, colored by sign.
- **Impact ripple:** when a node is first reached, expand a ring over `(t-lag)/5 ∈ [0,1]`: radius `19 + p*18`, opacity `(1-p)*0.5`, color by sign.
- **Origin ring:** persistent amber ring around the origin animating `rgring`.

### Controls
- **Scenario selector** — 3 buttons (`Oil · WTI`, `Rates · 10Y`, `Vol · VIX`). Active = cobalt-tinted (`bg rgba(45,91,255,0.16)`, text `#BAC9FF`, border `#2D5BFF`); inactive = transparent, `#9CA0B0`, border `rgba(255,255,255,0.14)`. Clicking a scenario **switches and auto-fires** it (resets `t=0`, plays).
- **Fire / Replay** button (cobalt, 42px) — re-runs the current scenario from `t=0`.
- **Severity** — 3 buttons `Mild / Base / Severe` (same active styling).
- **Timeline scrubber** — draggable track (pointer events): `T+0` … `T + {MAXLAG}m`. Dragging seeks `t = frac*MAXT`, pauses playback. Filled portion + 13px white handle with cobalt glow.
- **Clock pill** (top-right of card): `T + {round(min(t,MAXLAG))}m`.
- **Auto-fire:** an IntersectionObserver fires the default scenario (Oil) once when the figure scrolls into view (threshold 0.4).

### Side column
- **Headline path** — 3 chips for the active scenario's path nodes: ticker (mono 14px), sub `"{descriptor} · T+{lag}m"` (origin sub = `"origin · T+0m"`), and the value (counts up, colored). Dim (opacity 0.45) until reached.
- **Read** — a takeaway sentence, computed per scenario, e.g. Rates: *"A +50 bps rates surprise reprices NVDA −1.5% within ~17 minutes — rate-sensitivity flowing through the tech cluster."* (Oil → DAL move through airline cluster; Vol → XLK with "correlations snapping toward one.")

---

## Fig. 2 — Performance chart (REAL DATA)
A cumulative-return line chart: **RavenGraph vs S&P 500**, Feb–Jun 2026. **viewBox `0 0 760 300`.**

### Data
Use `data/ravengraph_vs_sp500.csv` (94 trading days, `2026-02-05 → 2026-06-19`). Columns of interest:
- `date`
- `rg_cum_return_pct` → **RavenGraph** series (cobalt). Ends **+37.8%** (peak +44.4% on 2026-06-04).
- `sp500_cum_return_pct` → **S&P 500** series (gray). Ends **+10.8%**.
- Final spread ≈ **+27 pp**. (Other columns — equity, daily PnL, spy_close — are available if you want tooltips/extra detail.)

> The page copy ("~38% YTD, ~27 pts ahead of the S&P 500") is derived from this file. If the data updates, update the copy to match — **never inflate**: it is a small own book, presented as real-and-early, not fund-scale AUM.

### Rendering
- Plot area inside the 760×300 viewBox: left pad 46, top pad 14, width 696, height 256. Y maps `yMin=-8 … yMax=48` (%). X maps index `0…N-1` across the width.
- **Gridlines** at `0,10,20,30,40%` — hairline `rgba(255,255,255,0.06)` + right-aligned mono label `+N%` at left margin.
- **Month ticks** at the first index of each month (Feb @0, Mar @17, Apr @38, May @59, Jun @80) — mono 10px, near the bottom.
- **Area fill** under the RavenGraph line: cobalt `#2D5BFF`, opacity 0.08.
- **Lines:** S&P 500 gray `#6B6F7C` width 1.6; RavenGraph cobalt `#2D5BFF` width 2.2; both round-joined.
- **End markers:** dot + mono value label at the last point for each line (`+37.8%` cobalt-light `#9DB4FF`, `+10.8%` gray `#9CA0B0`).
- **Legend** (mono 11px, above chart): cobalt swatch "RavenGraph" + gray swatch "S&P 500".
- Card header: "Fig. 2 · Cumulative return" + "Live equity book vs. S&P 500". Footnote: *"Feb–Jun 2026 · small own book · real track record."* (the prototype says "placeholder data" — change to real now that the CSV is wired).

### Hover interaction
Wrap the chart in a pointer-tracked container (`cursor:crosshair`). On `pointermove`, map cursor x → nearest data index `i = round((vx-46)/696*(N-1))`, clamped. On hover, render:
- a vertical guide line at the index x (`rgba(255,255,255,0.22)`),
- a ringed dot on each line at that index,
- a tooltip box (mono): the **date** (`MMM D, 2026`), `RavenGraph  +X.X%`, `S&P 500  +Y.Y%` (sign-aware). Tooltip x clamps inside the plot.
On `pointerleave`, clear the hover state.

---

## Blind-spot before/after viz
Two small SVGs (each **viewBox `0 0 300 200`**), animated on the shared ~11s clock.
- **Isolated** (left): three horizontal baselines at y = 44, 100, 156, each with a gray (`#6B6F7C`) sparkline polyline that scrolls/drifts independently (sum-of-sines per lane, phase advanced by the clock). Ticker labels AAPL / XOM / JPM at the left. The point: each line moves on its own, unconnected.
- **Graph** (right): 6 nodes — `A(54,100)·origin`, `B(138,54)`, `C(138,150)`, `D(236,44)`, `E(248,108)`, `F(228,166)`; edges A–B, A–C, B–D, B–E, C–E, C–F. A wavefront expands from A by Euclidean distance (`front = gp*(maxDist+46)`, where `gp = (phase*3)%1` — ~3 cycles per loop). As it passes, nodes light cobalt (`fill #13203A, stroke #5C82FF`) with a brief expanding ring; edges whose both endpoints are within the front turn cobalt. The point: one move propagates through the structure.

---

## Animated background (hero)
A full-bleed SVG lattice behind the hero, masked to fade behind the text.
- Build a jittered grid of nodes: 11 cols × 8 rows over a 1200×760 space; each node offset by a small seeded random (`±35` x, `±30` y). Edges: connect right & down neighbors, plus a sparse diagonal every 3rd cell.
- A **signal front** sweeps left→right on an 11s loop: `front = -200 + phase*(1200+400)`; activation `a(x)=exp(-((x-front)/185)²)`. Node radius `1.5 + a*1.8`, opacity `0.08 + a*0.38`; edge opacity `0.04 + a*0.32`. All cobalt `#2D5BFF`.
- Throttle to ~30fps. Use `preserveAspectRatio:"xMidYMid slice"`. The hero overlays a radial mask so the lattice is only visible around the edges, never behind the headline.

---

## Interactions & Behavior — summary
- **Shared animation clock:** hero background, Fig. 0 sweep, and blind-spot viz all read one ~11s phase (one rAF loop, ~30fps). In React, a single `requestAnimationFrame` loop writing a `phase` ref/state, or CSS where possible.
- **Fig. 1** drives its own clock while firing (rAF, 14 model-min/s); pauses on scrub; auto-fires once on scroll-in.
- **Fig. 2** is static except for the hover tooltip.
- **Buttons/links:** primary CTAs are `mailto:gabriel@ravengraph.com`. Hover darkens cobalt to `#1E47E0`.
- **Responsive:** all multi-column areas use `grid-template-columns:repeat(auto-fit,minmax(…,1fr))` and `flex-wrap`, so they collapse to single column on narrow screens. The hero figure stacks under the headline. Figures scale via `width:100%; height:auto` on their SVGs (viewBox handles the rest).

## State Management (for the React port)
- `phase` — shared ambient animation clock (number 0–1, rAF).
- Fig. 1: `scenarioId` ('oil'|'rates'|'vol'), `severity` (0.6|1.0|1.6), `t` (model-minutes), `playing` (bool), plus a derived model `{val, lag}` recomputed from scenario+severity. Fire/replay reset `t=0`; scrub sets `t`.
- Fig. 2: `hoverIdx` (number|null).
- No data fetching required for v1 — the performance series can be imported from the CSV/JSON at build time. The graph layer is "in build"; nothing here is live-wired to a backend.

## Assets
In `reference/public/` (all RavenGraph's own marks):
- `icon-white-transparent.svg` — raven glyph used in the top bar (22px) and footer (20px).
- `logo-no-background.svg`, `ravengraph-high-resolution-logo-transparent.png` — full lockups, if needed elsewhere.

Fonts are Google Fonts (Spectral, IBM Plex Sans, IBM Plex Mono) — no local font files.

## Files in this bundle
- `reference/RavenGraph.dc.html` — the working design prototype (**source of truth**). Open in a browser. All figure geometry + animation math is in the `<script>` logic class at the bottom.
- `reference/support.js` — the runtime that powers the prototype (do not port; reference only).
- `reference/public/*` — brand assets.
- `data/ravengraph_vs_sp500.csv` — real performance data for Fig. 2.

## Accuracy guardrails (important to the client)
- Equities = **live but small own book**; present as real-and-early, **not** managed AUM or a fund-scale track record.
- Avant Protocol = a **pilot / design partnership**; do not imply large third-party capital is deployed.
- The **graph layer is not live** — don't invent metrics for it. Today's results are from the baseline model.
- Agents do **research**; validated ML models make **trades**. Nothing should imply an agent makes trading decisions.
