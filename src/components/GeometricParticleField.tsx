"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NODE_COUNT = 16;
const EDGE_MULTIPLIER = 2;
const CANVAS_SIZE = { width: 1200, height: 720 };
const NODE_MOVE_DURATION = 8;
const RNG_SEED = 1337;
const MOVE_RANGE_X = 0.08;
const MOVE_RANGE_Y = 0.06;

type Node = {
  id: string;
  x: number;
  y: number;
  radius: number;
  pulse: number;
  pulseOffset: number;
  hue: number;
  shimmerDuration: number;
  glowDuration: number;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  opacity: number;
  duration: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const createRng = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const seededRange = (rng: () => number, min: number, max: number) => rng() * (max - min) + min;

function generateNodes(rng: () => number): Node[] {
  return Array.from({ length: NODE_COUNT }).map((_, index) => ({
    id: `node-${index}`,
    x: seededRange(rng, 0.08, 0.92),
    y: seededRange(rng, 0.22, 0.88),
    radius: seededRange(rng, 4, 10),
    pulse: seededRange(rng, 5.5, 11.5),
    pulseOffset: seededRange(rng, -2, 2),
    hue: seededRange(rng, 260, 285),
    shimmerDuration: seededRange(rng, 7, 10),
    glowDuration: seededRange(rng, 5, 8),
  }));
}

function generateEdges(nodes: Node[], rng: () => number): Edge[] {
  const edges: Edge[] = [];
  const maxEdges = Math.floor(nodes.length * EDGE_MULTIPLIER);

  for (let i = 0; i < nodes.length; i++) {
    const source = nodes[i];
    const neighbors = [...nodes]
      .filter((candidate) => candidate.id !== source.id)
      .sort((a, b) => {
        const dxA = a.x - source.x;
        const dyA = a.y - source.y;
        const dxB = b.x - source.x;
        const dyB = b.y - source.y;
        return dxA * dxA + dyA * dyA - (dxB * dxB + dyB * dyB);
      })
      .slice(0, 3);

    neighbors.forEach((target, index) => {
      const edgeId = `${source.id}-${target.id}`;
      const reverseId = `${target.id}-${source.id}`;
      const exists = edges.some((edge) => edge.id === reverseId);

      if (!exists && edges.length < maxEdges) {
        edges.push({
          id: edgeId,
          source: source.id,
          target: target.id,
          opacity: index === 0 ? 0.55 : 0.32,
          duration: seededRange(rng, 5, 8.5),
        });
      }
    });
  }

  return edges;
}

export function GeometricParticleField({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const seededInitialState = useMemo(() => {
    const rng = createRng(RNG_SEED);
    const seededNodes = generateNodes(rng);
    const seededEdges = generateEdges(seededNodes, rng);
    return { nodes: seededNodes, edges: seededEdges };
  }, []);
  const [nodes, setNodes] = useState<Node[]>(seededInitialState.nodes);
  const edges = seededInitialState.edges;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updatePositions = () =>
      setNodes((prev) =>
        prev.map((node) => {
          const nextX = clamp(node.x + randomRange(-MOVE_RANGE_X, MOVE_RANGE_X), 0.04, 0.96);
          const nextY = clamp(node.y + randomRange(-MOVE_RANGE_Y, MOVE_RANGE_Y), 0.15, 0.95);
          return { ...node, x: nextX, y: nextY };
        })
      );
    const initialKick = window.setTimeout(updatePositions, 600);
    const interval = window.setInterval(updatePositions, 9000);

    return () => {
      window.clearTimeout(initialKick);
      window.clearInterval(interval);
    };
  }, [shouldReduceMotion]);

  const nodeLookup = useMemo(() => {
    const lookup: Record<string, Node> = {};
    nodes.forEach((node) => {
      lookup[node.id] = node;
    });
    return lookup;
  }, [nodes]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(60,16,110,0.32),rgba(20,20,30,0)_70%)]" />
      <div className="absolute inset-x-0 top-[-35%] bottom-[-45%] bg-[radial-gradient(circle_at_center,rgba(150,60,255,0.22),rgba(20,20,30,0)_75%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.5),rgba(10,10,15,0)_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/70" />

      <motion.svg
        viewBox={`0 0 ${CANVAS_SIZE.width} ${CANVAS_SIZE.height}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="edge-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(176,102,255,0.05)" />
            <stop offset="0.5" stopColor="rgba(176,102,255,0.6)" />
            <stop offset="1" stopColor="rgba(176,102,255,0.05)" />
          </linearGradient>
        </defs>

        {edges.map((edge) => {
          const source = nodeLookup[edge.source];
          const target = nodeLookup[edge.target];
          if (!source || !target) return null;

          const animatedStroke =
            edge.opacity * 0.7 < 0.05
              ? [edge.opacity * 0.9, edge.opacity, edge.opacity * 0.9]
              : [edge.opacity * 0.7, edge.opacity, edge.opacity * 0.6];

          return (
            <motion.line
              key={edge.id}
              stroke="url(#edge-glow)"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={false}
              animate={
                shouldReduceMotion
                  ? {
                      x1: source.x * CANVAS_SIZE.width,
                      y1: source.y * CANVAS_SIZE.height,
                      x2: target.x * CANVAS_SIZE.width,
                      y2: target.y * CANVAS_SIZE.height,
                      strokeOpacity: edge.opacity,
                    }
                  : {
                      x1: source.x * CANVAS_SIZE.width,
                      y1: source.y * CANVAS_SIZE.height,
                      x2: target.x * CANVAS_SIZE.width,
                      y2: target.y * CANVAS_SIZE.height,
                      strokeOpacity: animatedStroke,
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      default: {
                        duration: NODE_MOVE_DURATION,
                        ease: "easeInOut",
                      },
                      strokeOpacity: {
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: edge.duration,
                        ease: "easeInOut",
                      },
                    }
              }
            />
          );
        })}

        {nodes.map((node) => {
          const cx = node.x * CANVAS_SIZE.width;
          const cy = node.y * CANVAS_SIZE.height;
          const fill = `hsla(${node.hue}, 90%, 58%, 0.28)`;
          const moveTransition = shouldReduceMotion
            ? undefined
            : { duration: NODE_MOVE_DURATION, ease: "easeInOut" };

          return (
            <React.Fragment key={node.id}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={node.radius * 2.3}
                fill="url(#node-glow)"
                opacity={0.06}
                initial={false}
                animate={
                  shouldReduceMotion
                    ? {
                        cx,
                        cy,
                        r: node.radius * 2.3,
                        opacity: 0.06,
                      }
                    : {
                        cx,
                        cy,
                        r: [node.radius * 2, node.radius * 2.7, node.radius * 2],
                        opacity: [0.04, 0.1, 0.04],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        cx: moveTransition,
                        cy: moveTransition,
                        r: {
                          duration: Math.max(4, node.pulse + node.pulseOffset),
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        },
                        opacity: {
                          duration: Math.max(4, node.pulse + node.pulseOffset),
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        },
                      }
                }
              />

              <motion.circle
                cx={cx}
                cy={cy}
                r={node.radius}
                fill={fill}
                stroke={`hsla(${node.hue}, 100%, 78%, 0.34)`}
                opacity={0.45}
                strokeWidth={1}
                initial={false}
                animate={
                  shouldReduceMotion
                    ? {
                        cx,
                        cy,
                        r: node.radius,
                        opacity: 0.45,
                      }
                    : {
                        cx,
                        cy,
                        r: [node.radius * 0.92, node.radius * 1.08, node.radius * 0.92],
                        opacity: [0.35, 0.65, 0.35],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        cx: moveTransition,
                        cy: moveTransition,
                        r: {
                          duration: node.shimmerDuration,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "mirror",
                        },
                        opacity: {
                          duration: node.shimmerDuration,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "mirror",
                        },
                      }
                }
              />

              <motion.circle
                cx={cx}
                cy={cy}
                r={node.radius / 2.8}
                fill="rgba(255,255,255,0.6)"
                initial={false}
                animate={
                  shouldReduceMotion
                    ? {
                        cx,
                        cy,
                        opacity: 0.4,
                      }
                    : {
                        cx,
                        cy,
                        opacity: [0.35, 0.6, 0.3],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        cx: moveTransition,
                        cy: moveTransition,
                        opacity: {
                          duration: node.glowDuration,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "mirror",
                        },
                      }
                }
              />

            </React.Fragment>
          );
        })}
      </motion.svg>
    </div>
  );
}
