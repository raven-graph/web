"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Node = {
  id: string;
  x: number;
  y: number;
  radius: number;
};

const NODES: Node[] = [
  { id: "equities", x: 18, y: 50, radius: 5.6 },
  { id: "sectors", x: 38, y: 18, radius: 4 },
  { id: "macro", x: 63, y: 15, radius: 4.6 },
  { id: "fx", x: 86, y: 36, radius: 3.6 },
  { id: "sentiment", x: 74, y: 64, radius: 4.8 },
  { id: "commodities", x: 40, y: 78, radius: 4.4 },
];

const EDGES = [
  { id: "e1", source: "equities", target: "sectors" },
  { id: "e2", source: "equities", target: "macro" },
  { id: "e3", source: "equities", target: "sentiment" },
  { id: "e4", source: "sectors", target: "macro" },
  { id: "e5", source: "macro", target: "fx" },
  { id: "e6", source: "fx", target: "sentiment" },
  { id: "e7", source: "sentiment", target: "commodities" },
  { id: "e8", source: "commodities", target: "sectors" },
];

const ACTIVE_LOOP = ["equities", "macro", "fx", "sentiment", "equities"];

const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node])) as Record<string, Node>;

export function FeatureGraphPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  // Simple curved paths
  const paths = EDGES.map(edge => {
    const s = nodeMap[edge.source];
    const t = nodeMap[edge.target];
    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2;
    // Slight offset for curve
    const off = 5; 
    return `M ${s.x} ${s.y} Q ${mx + off} ${my - off} ${t.x} ${t.y}`;
  });

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C15] p-10 shadow-[0_35px_90px_-50px_rgba(176,102,255,0.25)] ${className}`}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Purple Glow Center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,102,255,0.15),transparent_60%)]" />

      <motion.svg
        viewBox="0 0 100 100"
        className="relative z-10 h-[320px] w-[320px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Edges */}
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(176,102,255,0.4)" // Increased brightness
            strokeWidth="0.6"
          />
        ))}

        {/* Active Signal Pulse */}
        {!shouldReduceMotion && (
          <motion.circle
            r="1.8"
            fill="#D8B4FE"
            filter="url(#glow)"
            animate={{
              offsetDistance: ["0%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Moving along path requires complex SVG setup, simplified here with node pulsing for stability */}
          </motion.circle>
        )}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <g key={node.id}>
            {/* Outer Ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.radius + 2}
              stroke="rgba(176,102,255,0.5)"
              strokeWidth="0.3"
              fill="none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.7, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
            
            {/* Core */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill="#151725" // Dark core
              stroke="#D8B4FE" // Brighter purple rim
              strokeWidth="1"
            />
            
            {/* Label */}
            <text
              x={node.x}
              y={node.y + node.radius + 6}
              textAnchor="middle"
              className="text-[3px] fill-zinc-300 font-sans uppercase tracking-wider font-semibold"
            >
              {node.id}
            </text>
          </g>
        ))}
        
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
}
