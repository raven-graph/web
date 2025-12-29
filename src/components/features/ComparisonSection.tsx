"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertTriangle, Zap } from "lucide-react";

// --- Components ---

const StandardModelView = () => {
  // Simulation of a "surprise" shock
  return (
    <div className="relative h-full w-full p-8 flex flex-col justify-center">
      {/* Chart Container */}
      <div className="space-y-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>ASSET_{i === 0 ? "A" : i === 1 ? "B" : "C"}</span>
              <span className="text-red-500 font-bold opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]" style={{ animationDelay: `${3 + i * 1.5}s` }}>
                SHOCK DETECTED
              </span>
            </div>
            
            <div className="h-12 relative border-b border-white/10">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <motion.path
                  d={`M 0,24 L 100,24 L 200,20 L 300,24 L 400,${i === 0 ? 50 : 24} L 500,${i === 0 ? 60 : 24}`}
                  fill="none"
                  stroke={i === 0 ? "#EF4444" : "#71717a"}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, ease: "linear" }}
                />
                {/* Delayed reaction for B and C */}
                 {i > 0 && (
                    <motion.path
                        d={`M 400,24 L 450,24 L 500,50`}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 4 + i * 1.0, duration: 1 }} // Late reaction
                    />
                 )}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Status Overlay */}
      <div className="absolute bottom-8 right-8">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 backdrop-blur-md"
         >
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
                <div className="text-red-500 font-bold text-sm">Too Late</div>
                <div className="text-red-400/70 text-xs">Correlation Breakdown</div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

const RavenGraphView = () => {
  return (
    <div className="relative h-full w-full p-8 flex items-center justify-center">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#B066FF" />
            </marker>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Edges */}
        <motion.path d="M 100,50 L 200,100" stroke="#B066FF" strokeWidth="1" strokeOpacity="0.2" />
        <motion.path d="M 100,50 L 300,50" stroke="#B066FF" strokeWidth="1" strokeOpacity="0.2" />
        <motion.path d="M 200,100 L 300,50" stroke="#B066FF" strokeWidth="1" strokeOpacity="0.2" />

        {/* Propagating Signal */}
        <motion.circle r="3" fill="#B066FF" filter="url(#glow)">
            <animateMotion path="M 100,50 L 200,100" dur="1.5s" begin="1s" fill="freeze" rotate="auto" />
        </motion.circle>
        <motion.circle r="3" fill="#B066FF" filter="url(#glow)">
            <animateMotion path="M 100,50 L 300,50" dur="1.5s" begin="1s" fill="freeze" rotate="auto" />
        </motion.circle>

        {/* Nodes */}
        <g>
            <circle cx="100" cy="50" r="20" fill="#0B0C15" stroke="#B066FF" strokeWidth="2" />
            <text x="100" y="54" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
            {/* Early Warning Pulse */}
            <motion.circle cx="100" cy="50" r="20" fill="none" stroke="#B066FF" strokeWidth="2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </g>

        <g>
            <circle cx="200" cy="100" r="15" fill="#0B0C15" stroke="#60A5FA" strokeWidth="2" />
             <text x="200" y="104" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">B</text>
             {/* Protected Shield */}
             <motion.circle cx="200" cy="100" r="18" fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{ delay: 2.5, duration: 4, ease: "linear", repeat: Infinity }}
             />
        </g>

        <g>
            <circle cx="300" cy="50" r="15" fill="#0B0C15" stroke="#60A5FA" strokeWidth="2" />
             <text x="300" y="54" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C</text>
             {/* Protected Shield */}
             <motion.circle cx="300" cy="50" r="18" fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: -360 }}
                transition={{ delay: 2.5, duration: 4, ease: "linear", repeat: Infinity }}
             />
        </g>
      </svg>

      {/* Status Overlay */}
      <div className="absolute bottom-8 right-8">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-[#B066FF]/10 border border-[#B066FF]/20 rounded-lg p-3 flex items-center gap-3 backdrop-blur-md"
         >
            <Zap className="w-5 h-5 text-[#B066FF]" />
            <div>
                <div className="text-[#B066FF] font-bold text-sm">Intervention</div>
                <div className="text-[#B066FF]/70 text-xs">Contagion Blocked</div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export function ComparisonSection() {
  const [mode, setMode] = useState<"standard" | "raven">("standard");

  return (
    <section className="py-24 bg-[#0B0C15] border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
            The Asymmetric Advantage
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
            Traditional models react to price. RavenGraph anticipates structure.
          </p>
        </div>

        {/* Comparison UI */}
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Controls / Text Side */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                {/* Toggle Card */}
                <button 
                    onClick={() => setMode("standard")}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group
                        ${mode === "standard" 
                            ? "bg-red-500/5 border-red-500/50" 
                            : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                    <div className="flex items-start justify-between mb-2">
                        <span className={`text-sm font-mono font-bold uppercase tracking-wider
                             ${mode === "standard" ? "text-red-400" : "text-zinc-500"}`}>
                            Without RavenGraph
                        </span>
                        {mode === "standard" && <X className="w-5 h-5 text-red-500" />}
                    </div>
                    <h3 className={`text-xl font-display font-semibold mb-2
                        ${mode === "standard" ? "text-white" : "text-zinc-400"}`}>
                        Standard Models
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Rely on historical covariance. When structural breaks occur, correlations spike to 1.0 and hedges fail exactly when needed.
                    </p>
                </button>

                <button 
                    onClick={() => setMode("raven")}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group
                        ${mode === "raven" 
                            ? "bg-[#B066FF]/10 border-[#B066FF]/50 shadow-[0_0_30px_-10px_rgba(176,102,255,0.2)]" 
                            : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                    <div className="flex items-start justify-between mb-2">
                        <span className={`text-sm font-mono font-bold uppercase tracking-wider
                             ${mode === "raven" ? "text-[#B066FF]" : "text-zinc-500"}`}>
                            With RavenGraph
                        </span>
                         {mode === "raven" && <Check className="w-5 h-5 text-[#B066FF]" />}
                    </div>
                    <h3 className={`text-xl font-display font-semibold mb-2
                        ${mode === "raven" ? "text-white" : "text-zinc-400"}`}>
                        Graph Intelligence
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Maps causal dependencies in real-time. Identifies shock propagation paths and rebalances before the volatility spreads.
                    </p>
                </button>
            </div>

            {/* Visual Side */}
            <div className="lg:col-span-8">
                <div className="relative aspect-[16/9] w-full bg-[#05060A] rounded-2xl border border-white/10 overflow-hidden">
                     <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                     
                     <AnimatePresence mode="wait">
                        {mode === "standard" ? (
                            <motion.div 
                                key="standard"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <StandardModelView />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="raven"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <RavenGraphView />
                            </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Label Tag */}
                     <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-md">
                        SIMULATION: SHOCK_EVENT_04
                     </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}


