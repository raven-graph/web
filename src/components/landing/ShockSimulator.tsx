"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildModel,
  ease,
  FNODES,
  lerp,
  maxLag,
  SCENARIOS,
  Scenario,
  SPEED,
} from "@/lib/landing/figures";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";

const SHOW_EDGE_LABELS = true;
const RAMP = 4;
const RING = 5;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const fmt = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(1) + "%";
const fmtUnit = (x: number, u: string) =>
  u === "%"
    ? (x >= 0 ? "+" : "") + x.toFixed(1) + "%"
    : (x >= 0 ? "+" : "") + Math.round(x) + " " + u;

function btnStyle(active: boolean): React.CSSProperties {
  return active
    ? {
        background: "rgba(45,91,255,0.16)",
        color: "#BAC9FF",
        border: "1px solid #2D5BFF",
      }
    : {
        background: "transparent",
        color: "#9CA0B0",
        border: "1px solid rgba(255,255,255,0.14)",
      };
}

export function ShockSimulator() {
  const [scenarioId, setScenarioId] = useState<Scenario["key"]>("oil");
  const [mult, setMult] = useState(1);
  const [t, setT] = useState(0);
  const [fired, setFired] = useState(false);

  const tRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const scRef = useRef(scenarioId);
  scRef.current = scenarioId;
  const firedRef = useRef(false);
  const draggingRef = useRef(false);
  const graphRef = useRef<HTMLDivElement>(null);

  const tick = useCallback(() => {
    const sc = SCENARIOS[scRef.current];
    const MAXT = maxLag(sc) + 6;
    const now = performance.now();
    const dt = (now - lastRef.current) / 1000;
    lastRef.current = now;
    let nt = tRef.current + dt * SPEED;
    if (nt >= MAXT) {
      nt = MAXT;
      tRef.current = nt;
      setT(nt);
      rafRef.current = null;
      return;
    }
    tRef.current = nt;
    setT(nt);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, tick]);

  const fire = useCallback(() => {
    firedRef.current = true;
    tRef.current = 0;
    setFired(true);
    setT(0);
    startLoop();
  }, [startLoop]);

  const pickScenario = useCallback(
    (key: Scenario["key"]) => () => {
      scRef.current = key;
      firedRef.current = true;
      tRef.current = 0;
      setScenarioId(key);
      setFired(true);
      setT(0);
      startLoop();
    },
    [startLoop],
  );

  const seek = useCallback(
    (clientX: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const frac = clamp((clientX - rect.left) / rect.width, 0, 1);
      stopLoop();
      const sc = SCENARIOS[scRef.current];
      const MAXT = maxLag(sc) + 6;
      firedRef.current = true;
      tRef.current = frac * MAXT;
      setFired(true);
      setT(tRef.current);
    },
    [stopLoop],
  );

  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    seek(e.clientX, e.currentTarget);
  };
  const onTrackMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) seek(e.clientX, e.currentTarget);
  };
  const onTrackUp = () => {
    draggingRef.current = false;
  };

  // Auto-fire the default scenario once when the figure scrolls into view.
  useEffect(() => {
    const el = graphRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !firedRef.current) fire();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fire]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const sc = SCENARIOS[scenarioId];
  const MAXLAG = maxLag(sc);
  const MAXT = MAXLAG + 6;

  const frame = useMemo(() => {
    const { val, lag } = buildModel(sc, mult);
    const participants = new Set([sc.origin, ...sc.hops.map((e) => e.t)]);

    const nodeData = Object.keys(FNODES).map((k) => {
      const n = FNODES[k];
      const part = participants.has(k);
      const L = lag[k];
      const v = val[k];
      const isOrigin = k === sc.origin;
      const reached = part && fired && t >= L - 0.001;
      const prog = reached ? ease((t - L) / RAMP) : 0;
      const pos = (v ?? 0) >= 0;

      let stroke = "rgba(255,255,255,0.08)";
      let fill = "#10121A";
      let tickerColor = "#4C4F5C";
      let strokeW = 1.2;
      let valueColor = "#4C4F5C";
      let valueLabel = "";
      if (part) {
        stroke = "rgba(255,255,255,0.18)";
        fill = "#14161F";
        tickerColor = "#9CA0B0";
        valueLabel = "·";
      }
      if (reached) {
        if (isOrigin) {
          stroke = COLOR.amber;
          fill = "#1C1608";
          valueColor = COLOR.amber;
          valueLabel = fmtUnit(sc.originBase * mult * prog, sc.unit);
        } else if (pos) {
          stroke = COLOR.teal;
          fill = "#0F1A16";
          valueColor = COLOR.teal;
          valueLabel = fmt(v * prog);
        } else {
          stroke = COLOR.rose;
          fill = "#1B1014";
          valueColor = COLOR.rose;
          valueLabel = fmt(v * prog);
        }
        tickerColor = "#F1F2F5";
        strokeW = 2.2;
      }

      let ring: { r: number; opacity: number; color: string } | null = null;
      if (reached) {
        const rp = (t - L) / RING;
        if (rp >= 0 && rp <= 1) {
          ring = {
            r: 19 + rp * 18,
            opacity: (1 - rp) * 0.5,
            color: isOrigin ? COLOR.amber : pos ? COLOR.teal : COLOR.rose,
          };
        }
      }
      return {
        id: k,
        ticker: n.t,
        cx: n.x,
        cy: n.y,
        stroke,
        fill,
        tickerColor,
        strokeW,
        valueColor,
        valueLabel,
        tickerY: n.y + 3.5,
        valueY: n.y + 34,
        ring,
        opacity: part ? 1 : 0.45,
      };
    });

    const edgeData = sc.hops.map((e) => {
      const s = FNODES[e.s];
      const g = FNODES[e.t];
      const charged = fired && t >= lag[e.t] - 0.001;
      const col = val[e.t] >= 0 ? COLOR.teal : COLOR.rose;
      return {
        x1: s.x,
        y1: s.y,
        x2: g.x,
        y2: g.y,
        stroke: charged ? col : "rgba(255,255,255,0.12)",
        width: charged ? 2.2 : 1.2,
        lx: (s.x + g.x) / 2,
        ly: (s.y + g.y) / 2 - 8,
        label: "β " + (e.w >= 0 ? "+" : "") + e.w.toFixed(2) + " · " + e.lag + "m",
        labelColor: charged ? "#C3C6D0" : "#5C606F",
        labelOpacity: SHOW_EDGE_LABELS ? (charged ? 1 : 0.42) : 0,
      };
    });

    const pulses: { x: number; y: number; color: string }[] = [];
    if (fired) {
      for (const e of sc.hops) {
        const a = lag[e.s];
        const b = lag[e.t];
        if (t >= a && t < b) {
          const f = (t - a) / (b - a);
          const s = FNODES[e.s];
          const g = FNODES[e.t];
          pulses.push({
            x: lerp(s.x, g.x, f),
            y: lerp(s.y, g.y, f),
            color: val[e.t] >= 0 ? COLOR.teal : COLOR.rose,
          });
        }
      }
    }

    const clockLabel =
      "T + " + (fired ? Math.round(Math.min(t, MAXLAG)) : 0) + "m";

    const pathChips = sc.path.map((id, idx) => {
      const v = val[id];
      const L = lag[id];
      const reached = fired && t >= L - 0.001;
      const isO = id === sc.origin;
      const prog = reached ? ease((t - L) / RAMP) : 0;
      const pos = (v ?? 0) >= 0;
      const col = isO ? COLOR.amber : pos ? COLOR.teal : COLOR.rose;
      const valStr = !reached
        ? "—"
        : isO
          ? fmtUnit(sc.originBase * mult * prog, sc.unit)
          : fmt(v * prog);
      return {
        ticker: FNODES[id].t,
        sub: (idx === 0 ? "origin" : FNODES[id].d) + " · T+" + L + "m",
        val: valStr,
        color: reached ? col : "#5C606F",
        dim: reached ? 1 : 0.45,
      };
    });

    const oLab = fmtUnit(sc.originBase * mult, sc.unit);
    let takeaway: string;
    if (sc.key === "oil")
      takeaway = `A ${oLab} crude shock prices a ${fmt(val.DAL)} move into DAL within ~${lag.DAL} minutes — down through the airline cluster, before the tape reflects it.`;
    else if (sc.key === "rates")
      takeaway = `A ${oLab} rates surprise reprices NVDA ${fmt(val.NVDA)} within ~${lag.NVDA} minutes — rate-sensitivity flowing through the tech cluster.`;
    else
      takeaway = `A ${oLab} VIX spike pulls XLK ${fmt(val.XLK)} within ~${lag.XLK} minutes — correlations snapping toward one across the market.`;

    return { nodeData, edgeData, pulses, clockLabel, pathChips, takeaway };
  }, [sc, mult, t, fired, MAXLAG]);

  const originN = FNODES[sc.origin];
  const playFrac = clamp(t / MAXT, 0, 1);
  const playPct = (playFrac * 100).toFixed(2) + "%";

  return (
    <section style={{ position: "relative" }}>
      <div style={CONTAINER}>
        <div style={{ padding: "86px 0 0" }}>
          <Kicker label="Demonstration" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "28px 56px",
              alignItems: "end",
              marginBottom: 38,
            }}
          >
            <h2 style={headingStyle}>
              Watch a shock{" "}
              <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
                propagate.
              </span>
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.6,
                color: "#9CA0B0",
                fontWeight: 300,
              }}
            >
              A shock enters the graph at its origin and cascades through
              calibrated edges — weights and lags learned from history. Pick a
              scenario, set the severity, scrub the timeline.
            </p>
          </div>

          <div
            ref={graphRef}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            {/* Graph card */}
            <div
              style={{
                flex: "1 1 600px",
                minWidth: 300,
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                background: "#14161F",
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
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
                    {sc.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.serif,
                      fontSize: 21,
                      color: "#ECEDF1",
                      marginTop: 4,
                    }}
                  >
                    {sc.subtitle}
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 13px",
                    borderRadius: 8,
                    border: "1px solid rgba(45,91,255,0.3)",
                    background: "rgba(45,91,255,0.09)",
                    fontFamily: FONT.mono,
                    fontSize: 12,
                    color: COLOR.cobaltLight,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: COLOR.cobalt,
                    }}
                  />
                  {frame.clockLabel}
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "#0C0D14",
                  overflow: "hidden",
                }}
              >
                <svg
                  viewBox="0 0 720 380"
                  style={{ width: "100%", height: "auto", display: "block" }}
                >
                  {/* origin ring */}
                  <circle
                    cx={originN.x}
                    cy={originN.y}
                    r={30}
                    fill="none"
                    stroke={COLOR.amber}
                    strokeWidth={1.2}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: "rgring 2.6s ease-in-out infinite",
                    }}
                  />
                  {/* edges */}
                  {frame.edgeData.map((e, i) => (
                    <g key={`e${i}`}>
                      <line
                        x1={e.x1}
                        y1={e.y1}
                        x2={e.x2}
                        y2={e.y2}
                        stroke={e.stroke}
                        strokeWidth={e.width}
                        strokeLinecap="round"
                      />
                      <text
                        x={e.lx}
                        y={e.ly}
                        textAnchor="middle"
                        fill={e.labelColor}
                        opacity={e.labelOpacity}
                        fontFamily={FONT.mono}
                        fontSize={9}
                      >
                        {e.label}
                      </text>
                    </g>
                  ))}
                  {/* impact rings */}
                  {frame.nodeData
                    .filter((n) => n.ring)
                    .map((n, i) => (
                      <circle
                        key={`rg${i}`}
                        cx={n.cx}
                        cy={n.cy}
                        r={n.ring!.r}
                        fill="none"
                        stroke={n.ring!.color}
                        strokeWidth={1.5}
                        opacity={n.ring!.opacity}
                      />
                    ))}
                  {/* traveling pulses */}
                  {frame.pulses.map((p, i) => (
                    <g key={`p${i}`}>
                      <circle cx={p.x} cy={p.y} r={8} fill={p.color} opacity={0.18} />
                      <circle cx={p.x} cy={p.y} r={4} fill={p.color} />
                    </g>
                  ))}
                  {/* nodes */}
                  {frame.nodeData.map((n, i) => (
                    <g key={`n${i}`} opacity={n.opacity}>
                      <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={19}
                        fill={n.fill}
                        stroke={n.stroke}
                        strokeWidth={n.strokeW}
                      />
                      <text
                        x={n.cx}
                        y={n.tickerY}
                        textAnchor="middle"
                        fill={n.tickerColor}
                        fontFamily={FONT.mono}
                        fontSize={10.5}
                        fontWeight={600}
                      >
                        {n.ticker}
                      </text>
                      {n.valueLabel && (
                        <text
                          x={n.cx}
                          y={n.valueY}
                          textAnchor="middle"
                          fill={n.valueColor}
                          fontFamily={FONT.mono}
                          fontSize={10}
                          fontWeight={600}
                        >
                          {n.valueLabel}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* controls */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <ControlLabel>Scenario</ControlLabel>
                  {Object.keys(SCENARIOS).map((key) => {
                    const s = SCENARIOS[key as Scenario["key"]];
                    return (
                      <button
                        key={key}
                        onClick={pickScenario(key as Scenario["key"])}
                        style={{
                          padding: "8px 13px",
                          borderRadius: 8,
                          fontFamily: FONT.mono,
                          fontSize: 12,
                          cursor: "pointer",
                          transition: "all .15s",
                          ...btnStyle(key === scenarioId),
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={fire}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      height: 42,
                      padding: "0 20px",
                      border: "none",
                      borderRadius: 8,
                      background: COLOR.cobalt,
                      color: "#fff",
                      fontFamily: FONT.sans,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {fired ? "Replay" : "Fire shock"}
                  </button>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <ControlLabel>Severity</ControlLabel>
                    {([["Mild", 0.6], ["Base", 1.0], ["Severe", 1.6]] as const).map(
                      ([label, m]) => (
                        <button
                          key={label}
                          onClick={() => setMult(m)}
                          style={{
                            padding: "7px 12px",
                            borderRadius: 8,
                            fontFamily: FONT.mono,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all .15s",
                            ...btnStyle(Math.abs(mult - m) < 0.01),
                          }}
                        >
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                {/* timeline scrubber */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 11,
                      color: "#5C606F",
                      whiteSpace: "nowrap",
                    }}
                  >
                    T+0
                  </span>
                  <div
                    onPointerDown={onTrackDown}
                    onPointerMove={onTrackMove}
                    onPointerUp={onTrackUp}
                    style={{
                      position: "relative",
                      flex: 1,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      touchAction: "none",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 4,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.09)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        height: 4,
                        borderRadius: 999,
                        background: COLOR.cobalt,
                        width: playPct,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translate(-50%,-50%)",
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 0 0 4px rgba(45,91,255,0.25)",
                        left: playPct,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 11,
                      color: "#9CA0B0",
                      whiteSpace: "nowrap",
                      minWidth: 54,
                      textAlign: "right",
                    }}
                  >
                    {frame.clockLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Side column */}
            <div
              style={{
                flex: "1 1 280px",
                minWidth: 260,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={sideCard}>
                <ControlLabel>Headline path</ControlLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    marginTop: 14,
                  }}
                >
                  {frame.pathChips.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 13px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "#0F1119",
                        opacity: p.dim,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT.mono,
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#ECEDF1",
                          }}
                        >
                          {p.ticker}
                        </span>
                        <span
                          style={{
                            fontFamily: FONT.mono,
                            fontSize: 9.5,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#5C606F",
                          }}
                        >
                          {p.sub}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: FONT.mono,
                          fontWeight: 600,
                          fontSize: 16,
                          color: p.color,
                        }}
                      >
                        {p.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={sideCard}>
                <ControlLabel>Read</ControlLabel>
                <p
                  style={{
                    margin: "11px 0 0",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "#B6BAC6",
                  }}
                >
                  {frame.takeaway}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              fontFamily: FONT.mono,
              fontSize: 10.5,
              lineHeight: 1.55,
              color: "#4C4F5C",
            }}
          >
            Fig. 1 — Edge weights and lags are calibrated examples, not live
            signals. The graph-powered model is in build.
          </div>
          <div style={{ height: 96 }} />
        </div>
      </div>
    </section>
  );
}

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: FONT.serif,
  fontWeight: 500,
  fontSize: "clamp(30px,4.6vw,52px)",
  lineHeight: 1.06,
  letterSpacing: "-0.01em",
  color: "#F1F2F5",
};

const sideCard: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  background: "#14161F",
  padding: 20,
};

function Kicker({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 22,
      }}
    >
      <span style={{ width: 22, height: 1, background: COLOR.cobalt }} />
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLOR.cobaltLight,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: 10.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#5C606F",
      }}
    >
      {children}
    </span>
  );
}
