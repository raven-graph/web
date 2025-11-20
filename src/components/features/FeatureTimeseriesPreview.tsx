"use client";

import React from "react";
import { motion } from "framer-motion";

const POINTS = [
  { x: 0, y: 70 }, { x: 10, y: 65 }, { x: 20, y: 68 }, 
  { x: 30, y: 50 }, { x: 40, y: 55 }, { x: 50, y: 40 }, 
  { x: 60, y: 45 }, { x: 70, y: 30 }, { x: 80, y: 35 }, 
  { x: 90, y: 20 }, { x: 100, y: 15 }
];

const PATH = `M ${POINTS.map(p => `${p.x},${p.y}`).join(" L ")}`;

export function FeatureTimeseriesPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C15] p-8 ${className}`}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Volatility Index</div>
            <div className="text-2xl text-white font-display font-semibold">94.2 <span className="text-[#D8B4FE] text-sm font-normal">+4.2%</span></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-[#B066FF]/40 rounded-sm" />
            <div className="w-1 h-6 bg-[#B066FF]/60 rounded-sm" />
            <div className="w-1 h-3 bg-[#B066FF]/80 rounded-sm" />
            <div className="w-1 h-8 bg-[#D8B4FE] rounded-sm animate-pulse" />
          </div>
        </div>

        <motion.svg
          viewBox="0 0 100 80"
          className="w-full flex-1 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(176,102,255,0.3)" />
              <stop offset="100%" stopColor="rgba(176,102,255,0)" />
            </linearGradient>
          </defs>
          
          {/* Fill */}
          <path
            d={`${PATH} L 100 100 L 0 100 Z`}
            fill="url(#fillGradient)"
          />
          
          {/* Line */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="#D8B4FE"
            strokeWidth="1.5" // Thicker line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Points */}
          {POINTS.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill="#0B0C15"
              stroke="#D8B4FE"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + (i * 0.1) }}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  );
}
