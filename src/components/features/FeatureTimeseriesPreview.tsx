"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const CONTROL_POINTS = [
  { x: 0, y: 70 },
  { x: 8, y: 64 },
  { x: 16, y: 60 },
  { x: 24, y: 68 },
  { x: 34, y: 50 },
  { x: 46, y: 44 },
  { x: 56, y: 32 },
  { x: 66, y: 42 },
  { x: 78, y: 28 },
  { x: 88, y: 30 },
  { x: 100, y: 18 },
];

function buildSmoothPath(points: { x: number; y: number }[]) {
  const [first, ...rest] = points;
  if (!first) return "";

  const path: string[] = [`M ${first.x} ${first.y}`];

  for (let i = 0; i < rest.length; i++) {
    const current = points[i];
    const next = rest[i];
    if (!current || !next) continue;

    const cx = (current.x + next.x) / 2;
    const cy = (current.y + next.y) / 2;
    path.push(`Q ${current.x} ${current.y} ${cx} ${cy}`);
  }

  path.push(`T ${points.at(-1)?.x ?? first.x} ${points.at(-1)?.y ?? first.y}`);
  return path.join(" ");
}

const PATH_D = buildSmoothPath(CONTROL_POINTS);

export function FeatureTimeseriesPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950/60 via-zinc-900/50 to-zinc-950/60 p-7 shadow-[0_30px_80px_-45px_rgba(176,102,255,0.5)] ${className}`}
    >
      <div className="absolute inset-x-4 inset-y-6 rounded-[2rem] border border-white/5 bg-black/25 backdrop-blur-sm" />
      <motion.svg
        viewBox="0 0 100 80"
        className="relative z-10 h-full w-full text-white"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="feature-timeseries" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(176,102,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.65)" />
          </linearGradient>
          <linearGradient id="feature-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(176,102,255,0.22)" />
            <stop offset="100%" stopColor="rgba(176,102,255,0)" />
          </linearGradient>
        </defs>

        <g transform="translate(0, 6)">
          <motion.path
            d={`${PATH_D} L 100 80 L 0 80 Z`}
            fill="url(#feature-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <motion.path
            d={PATH_D}
            stroke="url(#feature-timeseries)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          {!shouldReduceMotion && (
            <motion.circle
              r={1.7}
              fill="#ffffff"
              stroke="rgba(176,102,255,0.6)"
              strokeWidth="0.6"
              initial={false}
              animate={{
                cx: CONTROL_POINTS.map((p) => p.x),
                cy: CONTROL_POINTS.map((p) => p.y),
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />
          )}
        </g>

        <motion.g
          className="text-[3px] font-medium"
          fill="rgba(255,255,255,0.55)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <text x="4" y="12">Structural pulse</text>
          <text x="4" y="74">Now</text>
          <text x="82" y="74">+6h</text>
        </motion.g>
      </motion.svg>
    </div>
  );
}
