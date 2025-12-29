"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export const PerformanceSection = () => {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/5 bg-[#0B0C15]">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <ScrollReveal className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-8 bg-[#B066FF]/50"></span>
                                <span className="text-[#B066FF] font-sans text-xs uppercase tracking-widest font-semibold">Signal Intelligence</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
                                Proven <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B066FF] to-purple-400">
                                    Signal Quality
                                </span>
                            </h2>
                            <p className="text-lg text-zinc-400 leading-relaxed font-light max-w-xl">
                                Our graph-native models demonstrate significant predictive power over traditional baselines. By mapping hidden relationships, RavenGraph captures alpha that time-series models miss.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="text-5xl font-display font-bold text-white mb-2">3,000+</div>
                                <div className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Global Assets</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="text-5xl font-display font-bold text-[#B066FF] mb-2">Tick-Level</div>
                                <div className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Signal Frequency</div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2} className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#B066FF]/20 to-blue-500/20 blur-3xl opacity-30" />
                        <div className="relative rounded-3xl border border-white/10 bg-[#0B0C15]/80 backdrop-blur-xl p-8 overflow-hidden">
                            {/* Simulated Graph Chart Visualization */}
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#B066FF]"></div> RavenGraph</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-600"></div> S&P 500</span>
                                </div>
                            </div>

                            <div className="h-64 md:h-80 w-full flex items-end gap-1 relative mt-8">
                                {/* Bars / Line simulation */}
                                {Array.from({ length: 40 }).map((_, i) => {
                                    const height = 30 + Math.random() * 40 + (i * 1.5); // Upward trend
                                    const height2 = 30 + Math.random() * 30 + (i * 1); // Slower trend
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: i * 0.02 }}
                                                className="w-full bg-[#B066FF] opacity-80 rounded-t-sm"
                                            />
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${height2}%` }}
                                                transition={{ duration: 1, delay: i * 0.02 }}
                                                className="w-full bg-zinc-700 opacity-30 rounded-t-sm"
                                            />
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Baseline Model Performance</span>
                                    <span className="text-white font-mono">0.62 PR-AUC</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '62%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-zinc-600"
                                    />
                                </div>

                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-zinc-400">RavenGraph Performance</span>
                                    <span className="text-[#B066FF] font-mono">0.77 PR-AUC</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '77%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-[#B066FF]"
                                    />
                                </div>
                            </div>

                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>
    );
};
