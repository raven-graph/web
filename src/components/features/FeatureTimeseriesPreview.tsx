"use client";

import React from "react";
import { motion } from "framer-motion";

const POINTS = [
  { x: 0, y: 70, regime: "low" }, 
  { x: 10, y: 65, regime: "low" }, 
  { x: 20, y: 68, regime: "low" }, 
  { x: 30, y: 50, regime: "med" }, 
  { x: 40, y: 55, regime: "med" }, 
  { x: 50, y: 40, regime: "high" }, 
  { x: 60, y: 45, regime: "high" }, 
  { x: 70, y: 30, regime: "high" }, 
  { x: 80, y: 35, regime: "high" }, 
  { x: 90, y: 20, regime: "extreme" }, 
  { x: 100, y: 15, regime: "extreme" }
];

// Function to get color based on regime
const getRegimeColor = (regime: string) => {
  switch (regime) {
    case "low": return "#D8B4FE"; // Default Purple
    case "med": return "#60A5FA"; // Blue - Transition
    case "high": return "#F59E0B"; // Amber - Warning
    case "extreme": return "#EF4444"; // Red - Danger
    default: return "#D8B4FE";
  }
};

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
            <div className="text-2xl text-white font-display font-semibold">94.2 <span className="text-[#EF4444] text-sm font-normal">+4.2%</span></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-[#D8B4FE]/20 rounded-sm" />
            <div className="w-1 h-6 bg-[#60A5FA]/40 rounded-sm" />
            <div className="w-1 h-3 bg-[#F59E0B]/60 rounded-sm" />
            <div className="w-1 h-8 bg-[#EF4444] rounded-sm animate-pulse" />
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
            
            {/* Gradient for the line segments to blend colors */}
            <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
              {POINTS.map((p, i) => (
                <stop 
                  key={i} 
                  offset={`${(p.x / 100)}`} 
                  stopColor={getRegimeColor(p.regime)} 
                />
              ))}
            </linearGradient>
          </defs>
          
          {/* Fill */}
          <path
            d={`M ${POINTS[0].x},${POINTS[0].y} ${POINTS.map(p => `L ${p.x},${p.y}`).join(" ")} L 100 100 L 0 100 Z`}
            fill="url(#fillGradient)"
          />
          
          {/* Multi-colored Line */}
          {POINTS.map((p, i) => {
            if (i === POINTS.length - 1) return null;
            const nextP = POINTS[i + 1];
            return (
              <motion.line
                key={`line-${i}`}
                x1={p.x}
                y1={p.y}
                x2={nextP.x}
                y2={nextP.y}
                stroke={getRegimeColor(nextP.regime)} // Use target regime color for the segment
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "linear" }}
              />
            );
          })}
          
          {/* Points */}
          {POINTS.map((p, i) => (
            <motion.circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill="#0B0C15"
              stroke={getRegimeColor(p.regime)}
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  );
}
