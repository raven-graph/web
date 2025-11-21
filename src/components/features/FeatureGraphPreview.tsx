"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Node = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
};

const NODES: Node[] = [
  { id: "equities", x: 20, y: 50, radius: 6, color: "#D8B4FE" }, // Purple
  { id: "sectors", x: 40, y: 20, radius: 4, color: "#60A5FA" }, // Blue
  { id: "macro", x: 65, y: 15, radius: 5, color: "#34D399" },   // Emerald
  { id: "fx", x: 85, y: 40, radius: 4, color: "#F472B6" },      // Pink
  { id: "sentiment", x: 75, y: 70, radius: 5, color: "#F59E0B" }, // Amber
  { id: "commodities", x: 40, y: 80, radius: 4.5, color: "#A78BFA" }, // Indigo
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
  { id: "e9", source: "macro", target: "commodities" },
];

const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node])) as Record<string, Node>;

export function FeatureGraphPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C15] p-10 shadow-2xl ${className}`}
    >
      {/* Background Grid - subtle movement */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#B066FF15,transparent)]" />

      <motion.svg
        viewBox="0 0 100 100"
        className="relative z-10 h-[320px] w-[320px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {EDGES.map((edge, i) => {
             const s = nodeMap[edge.source];
             const t = nodeMap[edge.target];
             return (
               <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y} gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                 <stop offset="50%" stopColor={s.color} stopOpacity="0.5" />
                 <stop offset="100%" stopColor={t.color} stopOpacity="0.2" />
               </linearGradient>
             )
          })}
          <filter id="glow-node">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const s = nodeMap[edge.source];
          const t = nodeMap[edge.target];
          // Curved path calculation
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate offset for curve based on distance (subtle curve)
          // Alternating curve direction for visual interest
          const offset = Math.min(dist * 0.2, 8) * (i % 2 === 0 ? 1 : -1);
          
          // Normal vector for offset
          const nx = -dy / dist;
          const ny = dx / dist;
          
          const cx = mx + nx * offset;
          const cy = my + ny * offset;
          
          const d = `M ${s.x} ${s.y} Q ${cx} ${cy} ${t.x} ${t.y}`;

          return (
            <g key={edge.id}>
              {/* Static Line */}
              <path
                d={d}
                fill="none"
                stroke={`url(#grad-${i})`}
                strokeWidth="0.5"
              />
              
              {/* Moving Particle */}
              {!shouldReduceMotion && (
                <motion.circle
                  r="1"
                  fill="white"
                  filter="url(#glow-node)"
                  animate={{
                    offsetDistance: ["0%", "100%"]
                  }}
                  style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
                  transition={{
                    duration: 2 + (i % 3), // Vary speeds
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <g key={node.id}>
            {/* Rotating Ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.radius + 3}
              fill="none"
              stroke={node.color}
              strokeWidth="0.2"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
              animate={{ rotate: 360 }}
              transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
            />
            
            {/* Pulse Effect */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill={node.color}
              initial={{ opacity: 0.2, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />

            {/* Core Node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill="#151725"
              stroke={node.color}
              strokeWidth="1.5"
            />
            
            {/* Icon/Dot in center */}
            <circle
              cx={node.x}
              cy={node.y}
              r={1.5}
              fill={node.color}
            />

            {/* Label */}
            <text
              x={node.x}
              y={node.y + node.radius + 5}
              textAnchor="middle"
              className="font-mono font-medium uppercase tracking-wider fill-zinc-400"
              style={{ fontSize: '3px' }}
            >
              {node.id}
            </text>
          </g>
        ))}
      </motion.svg>
    </div>
  );
}
