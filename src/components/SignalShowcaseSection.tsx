"use client";

import React, { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Clock, TrendingUp, AlertTriangle } from "lucide-react";

export const SignalShowcaseSection = () => {
    const [phase, setPhase] = useState<"idle" | "shock" | "transit" | "impact">("idle");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const loop = async () => {
            setPhase("idle");
            setTimer(0);
            await new Promise(r => setTimeout(r, 1000));

            // Shock Gold
            setPhase("shock");
            await new Promise(r => setTimeout(r, 1500));

            // Transit
            setPhase("transit");
            // Simulate 3.5ms (scaled down)
            const interval = setInterval(() => {
                setTimer(t => {
                    if (t >= 3.5) {
                        clearInterval(interval);
                        return 3.5;
                    }
                    return t + 0.1;
                });
            }, 50);

            await new Promise(r => setTimeout(r, 2000));
            clearInterval(interval);

            // Impact Nasdaq
            setPhase("impact");
            await new Promise(r => setTimeout(r, 3000));

            loop();
        };
        loop();
    }, []);

    return (
        <section className="py-24 bg-[#0B0C15] border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                <ScrollReveal className="text-center mb-16">
                    <h2 className="text-sm font-bold text-[#B066FF] tracking-widest uppercase mb-4">
                        Structured Signals
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white">
                        Predict the Ripple
                    </h3>
                    <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                        Markets have memory. RavenGraph detects causal lead-lag relationships that covariance matrices miss.
                    </p>
                </ScrollReveal>

                <div className="bg-[#0F111A] border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,102,255,0.05),transparent_70%)]" />

                    <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">

                        {/* Node A: GOLD */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={phase === "shock" ? { scale: [1, 1.2, 1], borderColor: ["#3f3f46", "#EAB308", "#3f3f46"] } : {}}
                                transition={{ duration: 0.5 }}
                                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center bg-[#18181b] relative z-10
                            ${phase === "shock" ? "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]" : "border-zinc-700"}
                        `}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">XAU</div>
                                    <div className="text-xs text-zinc-500">Gold Spot</div>
                                </div>
                                {phase === "shock" && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1.5 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute -top-8 text-yellow-500 font-bold text-xs bg-yellow-500/10 px-2 py-1 rounded"
                                    >
                                        SHOCK DETECTED
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* Connection / Timer */}
                        <div className="h-px bg-zinc-800 relative w-full flex items-center justify-center">
                            {/* Progress Line */}
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 bg-[#B066FF] shadow-[0_0_10px_#B066FF]"
                                initial={{ width: "0%" }}
                                animate={phase === "transit" ? { width: "100%" } : phase === "idle" ? { width: "0%" } : {}}
                                transition={phase === "transit" ? { duration: 2, ease: "linear" } : { duration: 0 }}
                            />

                            <div className="bg-[#0B0C15] border border-zinc-800 px-4 py-2 rounded-full relative z-20 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#B066FF]" />
                                <span className="font-mono text-white text-sm">
                                    T + {timer.toFixed(1)}m
                                </span>
                            </div>
                        </div>

                        {/* Node B: NASDAQ */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={phase === "impact" ? { scale: [1, 1.1, 1], borderColor: ["#3f3f46", "#B066FF", "#3f3f46"] } : {}}
                                transition={{ duration: 0.5 }}
                                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center bg-[#18181b] relative z-10
                            ${phase === "impact" ? "border-[#B066FF] shadow-[0_0_30px_rgba(176,102,255,0.3)]" : "border-zinc-700"}
                        `}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">NDX</div>
                                    <div className="text-xs text-zinc-500">Nasdaq 100</div>
                                </div>
                                {phase === "impact" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -bottom-10 text-[#B066FF] font-bold text-xs bg-[#B066FF]/10 px-2 py-1 rounded whitespace-nowrap"
                                    >
                                        PREDICTED MOVE (+12bps)
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                    </div>

                    <div className="mt-12 text-center space-y-2">
                        <div className="inline-flex items-center gap-2 text-zinc-400 text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                            <span>Real-World Scenario: <span className="text-white">Inflationary Shock (Gold)</span> leads <span className="text-white">Tech Rout (Nasdaq)</span> by ~3.5 minutes.</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-zinc-600 font-mono">
                            <AlertTriangle className="w-3 h-3" />
                            Illustrative Example • Historical Detection (2023)
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
