"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Radar } from "lucide-react";
import { SIGNAL_THESES, formatReturn, getNodeById, oilShockResult, signals } from "@/lib/graph/data";
import type { Signal } from "@/lib/graph/types";

const CONFIDENCE_ORDER: Record<Signal["confidence"], number> = {
    High: 0,
    Medium: 1,
    Low: 2,
};

const NODE_LAYOUT: Record<string, { x: number; y: number }> = {
    WTI_CRUDE: { x: 90, y: 170 },
    JETS: { x: 290, y: 120 },
    XLE: { x: 290, y: 220 },
    DAL: { x: 510, y: 80 },
    UAL: { x: 510, y: 125 },
    AAL: { x: 510, y: 170 },
    XOM: { x: 510, y: 230 },
};

export const SignalShowcaseSection = () => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    const featuredSignals = useMemo(() => {
        return [...signals]
            .sort((a, b) => {
                const byConfidence = CONFIDENCE_ORDER[a.confidence] - CONFIDENCE_ORDER[b.confidence];
                if (byConfidence !== 0) return byConfidence;
                return Math.abs(b.delta) - Math.abs(a.delta);
            })
            .slice(0, 4);
    }, []);

    const maxDelta = useMemo(() => {
        return Math.max(0.001, ...featuredSignals.map((sig) => Math.abs(sig.delta)));
    }, [featuredSignals]);

    const hopsBySignal = useMemo(() => {
        return featuredSignals.map((sig) =>
            sig.transmission_path.filter((hop) => NODE_LAYOUT[hop.source_id] && NODE_LAYOUT[hop.target_id]),
        );
    }, [featuredSignals]);

    const previewSteps = useMemo(
        () =>
            hopsBySignal.flatMap((signalHops, signalIndex) =>
                signalHops.map((_, hopIndex) => ({ signalIndex, hopIndex })),
            ),
        [hopsBySignal],
    );

    const firstStepBySignalIndex = useMemo(() => {
        const lookup = new Map<number, number>();
        previewSteps.forEach((step, idx) => {
            if (!lookup.has(step.signalIndex)) lookup.set(step.signalIndex, idx);
        });
        return lookup;
    }, [previewSteps]);

    const activeStep = previewSteps[activeStepIndex] ?? null;
    const activeSignalIndex = activeStep?.signalIndex ?? 0;
    const activeSignal = featuredSignals[activeSignalIndex] ?? null;
    const propagationPreviewHops = activeSignal ? hopsBySignal[activeSignalIndex] ?? [] : [];
    const activeHopIndex = activeStep?.hopIndex ?? 0;
    const activeHop = propagationPreviewHops[activeHopIndex] ?? null;
    const sourcePoint = activeHop ? NODE_LAYOUT[activeHop.source_id] : undefined;
    const targetPoint = activeHop ? NODE_LAYOUT[activeHop.target_id] : undefined;
    const visibleNodeIds = useMemo(() => {
        const ids = new Set<string>();
        propagationPreviewHops.forEach((hop) => {
            ids.add(hop.source_id);
            ids.add(hop.target_id);
        });
        ids.add(oilShockResult.shock.source_node_id);
        return ids;
    }, [propagationPreviewHops]);

    useEffect(() => {
        if (previewSteps.length === 0 || featuredSignals.length === 0) return;

        setActiveStepIndex((idx) => idx % previewSteps.length);
        const timer = window.setInterval(() => {
            setActiveStepIndex((idx) => (idx + 1) % previewSteps.length);
        }, 2200);
        return () => window.clearInterval(timer);
    }, [featuredSignals.length, previewSteps.length]);

    return (
        <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <ScrollReveal className="mb-6">
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed max-w-2xl">
                        A +8% WTI move propagating through the learned graph — each edge a calibrated weight and lag.
                    </p>
                </ScrollReveal>

                <div className="grid xl:grid-cols-[1.25fr_1fr] gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="rounded-2xl border border-white/10 bg-[#0F111A] p-6 md:p-7 relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(circle at 18% 24%, rgba(176,102,255,0.16), transparent 48%), radial-gradient(circle at 84% 82%, rgba(16,185,129,0.12), transparent 38%)",
                            }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-mono">Propagation Preview</p>
                                    <p className="text-white font-display text-xl">Oil Shock Transmission</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B066FF]/30 bg-[#B066FF]/10 text-[#D8BAFF] text-xs font-mono">
                                    <Clock3 className="w-3.5 h-3.5" />
                                    {activeHop ? `T + ${activeHop.cumulative_lag}m` : "T + 0m"}
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#090B12] overflow-hidden">
                                <svg viewBox="0 0 620 320" className="w-full h-[280px]">
                                    {propagationPreviewHops.map((hop) => {
                                        const start = NODE_LAYOUT[hop.source_id];
                                        const end = NODE_LAYOUT[hop.target_id];
                                        if (!start || !end) return null;
                                        const isActive = activeHop?.hop_number === hop.hop_number;
                                        const strokeColor = hop.direction === "positive" ? "#2DD4BF" : "#F87171";

                                        return (
                                            <g key={`edge-${hop.hop_number}`}>
                                                <line
                                                    x1={start.x}
                                                    y1={start.y}
                                                    x2={end.x}
                                                    y2={end.y}
                                                    stroke={isActive ? strokeColor : "#4A5568"}
                                                    strokeWidth={isActive ? 3.2 : 1.8}
                                                    strokeOpacity={isActive ? 1 : 0.45}
                                                />
                                                <text
                                                    x={(start.x + end.x) / 2}
                                                    y={(start.y + end.y) / 2 - 8}
                                                    textAnchor="middle"
                                                    fill={isActive ? "#E4E4E7" : "#71717A"}
                                                    fontFamily="var(--font-mono), monospace"
                                                    fontSize="10"
                                                >
                                                    {formatReturn(hop.output_value)}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {sourcePoint && targetPoint && activeHop && (
                                        <motion.circle
                                            key={`pulse-${activeHop.hop_number}-${activeHopIndex}`}
                                            r="5"
                                            fill={activeHop.direction === "positive" ? "#2DD4BF" : "#F87171"}
                                            initial={{ cx: sourcePoint.x, cy: sourcePoint.y, opacity: 0 }}
                                            animate={{
                                                cx: targetPoint.x,
                                                cy: targetPoint.y,
                                                opacity: [0, 1, 1, 0],
                                            }}
                                            transition={{ duration: 1.7, ease: "easeInOut" }}
                                        />
                                    )}

                                    {Object.entries(NODE_LAYOUT).map(([nodeId, point]) => {
                                        const node = getNodeById(nodeId);
                                        const activeNode =
                                            activeHop &&
                                            (activeHop.source_id === nodeId || activeHop.target_id === nodeId);
                                        const isPathNode = visibleNodeIds.has(nodeId);
                                        const nodeOpacity = activeNode ? 1 : isPathNode ? 0.78 : 0.32;
                                        const isShockSource = nodeId === oilShockResult.shock.source_node_id;

                                        return (
                                            <g key={`node-${nodeId}`} opacity={nodeOpacity}>
                                                {isShockSource && (
                                                    <motion.circle
                                                        cx={point.x}
                                                        cy={point.y}
                                                        r="21"
                                                        fill="transparent"
                                                        stroke="#F59E0B"
                                                        strokeWidth="1.3"
                                                        animate={{ opacity: [0.35, 0.95, 0.35], scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                                                    />
                                                )}
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="18"
                                                    fill={activeNode ? "#181D2C" : "#111827"}
                                                    stroke={activeNode ? "#B066FF" : "#374151"}
                                                    strokeWidth="1.6"
                                                />
                                                <text
                                                    x={point.x}
                                                    y={point.y + 4}
                                                    textAnchor="middle"
                                                    fill="#F4F4F5"
                                                    fontFamily="var(--font-mono), monospace"
                                                    fontSize="11"
                                                    fontWeight="600"
                                                >
                                                    {node?.ticker ?? nodeId}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                {propagationPreviewHops.map((hop, idx) => {
                                    const isActive = idx === activeHopIndex;
                                    const source = getNodeById(hop.source_id)?.ticker ?? hop.source_id;
                                    const target = getNodeById(hop.target_id)?.ticker ?? hop.target_id;
                                    const directionClass = hop.direction === "positive" ? "text-teal-300" : "text-rose-400";

                                    return (
                                        <button
                                            key={`hop-card-${hop.hop_number}`}
                                            onClick={() => {
                                                const matchingStepIndex = previewSteps.findIndex(
                                                    (step) => step.signalIndex === activeSignalIndex && step.hopIndex === idx,
                                                );
                                                if (matchingStepIndex >= 0) setActiveStepIndex(matchingStepIndex);
                                            }}
                                            className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                                                isActive
                                                    ? "bg-white/10 border-white/25"
                                                    : "bg-[#0B0F17] border-white/10 hover:border-white/20"
                                            }`}
                                        >
                                            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">Hop {hop.hop_number}</div>
                                            <div className="text-sm font-mono text-zinc-100 mt-1">{source} → {target}</div>
                                            <div className={`text-xs font-mono mt-1 ${directionClass}`}>
                                                {formatReturn(hop.output_value)} · {hop.cumulative_lag}m cumulative
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.08 }}
                        className="rounded-2xl border border-white/10 bg-[#0F111A] p-6 md:p-7"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-mono">Signals Feed</p>
                                <p className="text-white font-display text-xl">Top Graph-Derived Calls</p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                                <Radar className="w-3.5 h-3.5 text-[#B066FF]" />
                                Ranked feed
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {featuredSignals.map((sig, idx) => {
                                const isActive = idx === activeSignalIndex;
                                const confidenceColor =
                                    sig.confidence === "High"
                                        ? "text-teal-300"
                                        : sig.confidence === "Medium"
                                            ? "text-amber-400"
                                            : "text-zinc-400";
                                const directionColor = sig.direction === "LONG" ? "text-teal-300" : "text-rose-400";
                                const barWidth = Math.max((Math.abs(sig.delta) / maxDelta) * 100, 10);

                                return (
                                    <button
                                        key={sig.id}
                                        onClick={() => {
                                            const stepIdx = firstStepBySignalIndex.get(idx);
                                            if (stepIdx !== undefined) setActiveStepIndex(stepIdx);
                                        }}
                                        className={`w-full text-left rounded-lg border p-3 transition-colors ${
                                            isActive
                                                ? "bg-white/10 border-white/25"
                                                : "bg-[#0B0F17] border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="font-mono font-bold text-base text-white">{sig.ticker}</span>
                                                <span className={`text-[11px] font-mono ${directionColor}`}>{sig.direction}</span>
                                                <span className={`text-[11px] font-mono ${confidenceColor}`}>{sig.confidence}</span>
                                            </div>
                                            <span className={`text-sm font-mono ${sig.delta >= 0 ? "text-teal-300" : "text-rose-400"}`}>
                                                {formatReturn(sig.delta)}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className={`h-full ${sig.delta >= 0 ? "bg-teal-500/80" : "bg-rose-500/80"}`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {activeSignal && (
                            <div className="mt-4 rounded-lg border border-white/10 bg-[#0A0E17] p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 font-mono mb-2">
                                    Active Signal Thesis
                                </div>
                                <p className="text-sm leading-relaxed text-zinc-300">
                                    {SIGNAL_THESES[activeSignal.id]?.thesis ?? "Graph-proven signal with multi-hop transmission evidence."}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                                    <span>{SIGNAL_THESES[activeSignal.id]?.path ?? `${activeSignal.ticker} transmission path`}</span>
                                    <span>Exp Return {formatReturn(activeSignal.expected_return_after)}</span>
                                </div>
                            </div>
                        )}

                        <a
                            href="/graph"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-[#C9A7FF] hover:text-[#DEC9FF] transition-colors"
                        >
                            Open full graph workspace
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
