"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Node = {
  id: string;
  x: number;
  y: number;
  radius: number;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  weight: number;
};

const NODES: Node[] = [
  { id: "equities", x: 18, y: 50, radius: 5.6 },
  { id: "sectors", x: 38, y: 18, radius: 4 },
  { id: "macro", x: 63, y: 15, radius: 4.6 },
  { id: "fx", x: 86, y: 36, radius: 3.6 },
  { id: "sentiment", x: 74, y: 64, radius: 4.8 },
  { id: "commodities", x: 40, y: 78, radius: 4.4 },
];

const EDGES: Edge[] = [
  { id: "equities-sectors", source: "equities", target: "sectors", weight: 0.9 },
  { id: "equities-macro", source: "equities", target: "macro", weight: 0.65 },
  { id: "equities-sentiment", source: "equities", target: "sentiment", weight: 0.74 },
  { id: "equities-commodities", source: "equities", target: "commodities", weight: 0.6 },
  { id: "sectors-macro", source: "sectors", target: "macro", weight: 0.8 },
  { id: "macro-fx", source: "macro", target: "fx", weight: 0.72 },
  { id: "macro-sentiment", source: "macro", target: "sentiment", weight: 0.45 },
  { id: "sentiment-fx", source: "sentiment", target: "fx", weight: 0.5 },
  { id: "sentiment-commodities", source: "sentiment", target: "commodities", weight: 0.66 },
  { id: "commodities-sectors", source: "commodities", target: "sectors", weight: 0.58 },
];

const LABELS: Record<string, string> = {
  equities: "Equities",
  sectors: "Sectors",
  macro: "Macro",
  fx: "FX / Rates",
  sentiment: "Sentiment",
  commodities: "Commodities",
};

const ACTIVE_LOOP: [string, string][] = [
  ["equities", "macro"],
  ["macro", "fx"],
  ["fx", "sentiment"],
  ["sentiment", "equities"],
];

type CurveData = {
  id: string;
  path: string;
  points: { x: number; y: number }[];
  weight: number;
  isActive: boolean;
  delay: number;
};

const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node])) as Record<
  string,
  Node
>;

function createControlPoint(source: Node, target: Node, bend: number) {
  const mx = (source.x + target.x) / 2;
  const my = (source.y + target.y) / 2;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  const ox = (-dy / distance) * bend;
  const oy = (dx / distance) * bend;
  return { x: mx + ox, y: my + oy };
}

function sampleQuadraticPoints(
  source: Node,
  target: Node,
  control: { x: number; y: number },
  steps = 48
) {
  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1);
    const inv = 1 - t;
    const x = inv * inv * source.x + 2 * inv * t * control.x + t * t * target.x;
    const y = inv * inv * source.y + 2 * inv * t * control.y + t * t * target.y;
    return { x, y };
  });
}

function buildCurves(): CurveData[] {
  return EDGES.map((edge, index) => {
    const source = nodeMap[edge.source];
    const target = nodeMap[edge.target];
    const bend = 6 + edge.weight * 8;
    const control = createControlPoint(source, target, bend);
    const path = `M ${source.x} ${source.y} Q ${control.x} ${control.y} ${target.x} ${target.y}`;
    const points = sampleQuadraticPoints(source, target, control);
    const isActive = ACTIVE_LOOP.some(
      ([s, t]) => s === edge.source && t === edge.target
    );
    return {
      id: edge.id,
      path,
      points,
      weight: edge.weight,
      isActive,
      delay: index * 0.25,
    };
  });
}

const CURVES = buildCurves();

const PARTICLES = [
  { id: "p1", cx: 18, cy: 30, delay: 0 },
  { id: "p2", cx: 32, cy: 64, delay: 1.5 },
  { id: "p3", cx: 58, cy: 46, delay: 2.3 },
  { id: "p4", cx: 78, cy: 28, delay: 1.1 },
];

export function FeatureGraphPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  const pulseTiming = useMemo(() => {
    const map: Record<string, number> = {};
    ACTIVE_LOOP.forEach(([source], index) => {
      map[source] = index * 0.65;
    });
    return map;
  }, []);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950/70 via-zinc-900/45 to-zinc-950/60 p-10 shadow-[0_35px_90px_-50px_rgba(176,102,255,0.55)] ${className}`}
    >
      <div className="absolute inset-3 rounded-[2.2rem] border border-white/5 bg-black/25 backdrop-blur-sm" />
      <div className="absolute inset-6 rounded-[2.1rem] opacity-60 [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.75),transparent)]">
        <svg viewBox="0 0 150 110" className="h-full w-full">
          <pattern id="feature-grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" stroke="rgba(255,255,255,0.06)" strokeWidth="0.35" />
          </pattern>
          <rect width="150" height="110" fill="url(#feature-grid)" />
        </svg>
      </div>
      <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(176,102,255,0.18),rgba(12,12,20,0))]" />

      <motion.svg
        viewBox="0 0 100 100"
        className="relative z-10 h-[320px] w-[320px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="feature-graph-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(176,102,255,0.08)" />
            <stop offset="50%" stopColor="rgba(176,102,255,0.68)" />
            <stop offset="100%" stopColor="rgba(176,102,255,0.08)" />
          </linearGradient>
          <radialGradient id="feature-graph-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(176,102,255,0.92)" />
            <stop offset="100%" stopColor="rgba(176,102,255,0)" />
          </radialGradient>
        </defs>

        {CURVES.map((curve) => (
          <motion.path
            key={curve.id}
            d={curve.path}
            stroke="url(#feature-graph-edge)"
            strokeWidth={0.7 + curve.weight * 0.65}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.2 }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: curve.isActive ? [0.35, 0.9, 0.35] : [0.25, 0.55, 0.25],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: curve.isActive ? 4.3 : 6.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "mirror",
                    delay: curve.delay,
                  }
            }
          />
        ))}

        {NODES.map((node) => {
          const pulseDelay = pulseTiming[node.id] ?? 0;
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.radius + 4}
                fill="url(#feature-graph-node)"
                opacity={0.16}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        r: [node.radius + 2, node.radius + 5, node.radius + 2],
                        opacity: [0.12, 0.24, 0.12],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 4.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pulseDelay,
                      }
                }
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill="rgba(176,102,255,0.85)"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={0.6}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        r: [node.radius * 0.95, node.radius, node.radius * 0.95],
                        opacity: [0.65, 1, 0.65],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 3.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pulseDelay,
                      }
                }
              />
              <text
                x={node.x}
                y={node.y + node.radius + 5.5}
                textAnchor="middle"
                className="text-[3.6px] font-semibold fill-[rgba(255,255,255,0.88)] font-sans"
              >
                {LABELS[node.id]}
              </text>
            </g>
          );
        })}

        {!shouldReduceMotion &&
          ACTIVE_LOOP.map(([sourceId, targetId], index) => {
            const curve = CURVES.find(
              (c) => c.id === `${sourceId}-${targetId}`
            );

            const reverseCurve = CURVES.find(
              (c) => c.id === `${targetId}-${sourceId}`
            );

            const selectedCurve = curve ?? reverseCurve;
            if (!selectedCurve) return null;

            const frames =
              curve !== undefined
                ? selectedCurve.points
                : [...selectedCurve.points].reverse();

            return (
              <motion.circle
                key={`${sourceId}-${targetId}-indicator`}
                r={1.3}
                fill="#ffffff"
                initial={false}
                animate={{
                  cx: frames.map((point) => point.x),
                  cy: frames.map((point) => point.y),
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: index * 0.7,
                }}
              />
            );
          })}

        {!shouldReduceMotion &&
          PARTICLES.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.cx}
              cy={particle.cy}
              r={0.9}
              fill="rgba(255,255,255,0.8)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.2, 1, 0], cy: [particle.cy - 2, particle.cy + 2] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
      </motion.svg>
    </div>
  );
}
