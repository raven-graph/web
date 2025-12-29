"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export const AlphaLiftSection = () => {
    return (
        <section className="py-24 bg-[#0B0C15] border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* Text Side */}
                    <div className="lg:col-span-4">
                        <ScrollReveal className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#B066FF]/50"></span>
                                <span className="text-[#B066FF] font-sans text-xs uppercase tracking-widest font-semibold">Proven Results</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                                Information Gain
                            </h2>
                            <p className="text-lg text-zinc-400 leading-relaxed font-light">
                                RavenGraph doesn't just "add features." It adds structure. By embedding network effects, we consistently outperform isolated time-series baselines.
                            </p>

                            <div className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-zinc-400 text-sm">Baseline (XGBoost)</span>
                                    <span className="text-white font-mono font-bold">0.62 Sharpe</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[#B066FF]/10 border border-[#B066FF]/30">
                                    <span className="text-[#B066FF] text-sm font-semibold">RavenGraph (SAGE+LSTM)</span>
                                    <span className="text-white font-mono font-bold">2.45 Sharpe</span>
                                </div>
                                <div className="text-xs text-zinc-500 font-mono pt-2">
                                    * Walk-forward validation, 10-month backtest (Daily)
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Chart Side */}
                    <div className="lg:col-span-8">
                        <ScrollReveal delay={0.2}>
                            <div className="relative aspect-[16/9] w-full bg-[#0F111A] rounded-2xl border border-white/10 overflow-hidden p-8 flex items-end">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                                {/* Chart Area */}
                                <div className="relative w-full h-[80%]">

                                    {/* Baseline Line */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                                        <motion.path
                                            d="M 0,300 C 100,280 200,290 300,250 C 400,240 500,220 600,200 C 700,190 800,180 900,150"
                                            fill="none"
                                            stroke="#52525b"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 2, ease: "linear" }}
                                        />
                                        {/* Baseline Label */}
                                        <text x="850" y="140" fill="#71717a" fontSize="12" fontFamily="monospace">Use(Time-Series)</text>
                                    </svg>

                                    {/* RavenGraph Line */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#B066FF" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#B066FF" stopOpacity="1" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            d="M 0,300 C 100,260 200,240 300,150 C 400,120 500,100 600,60 C 700,40 800,20 900,-20"
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 2.5, ease: "easeOut" }}
                                        />
                                        {/* RavenGraph Label */}
                                        <g transform="translate(850, -30)">
                                            <rect x="-10" y="-20" width="120" height="30" rx="4" fill="#B066FF" />
                                            <text x="50" y="0" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">RavenGraph</text>
                                        </g>
                                    </svg>

                                    {/* Lift Marker */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2, duration: 0.5 }}
                                        className="absolute top-[20%] left-[60%] -translate-x-1/2"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="h-16 w-px bg-[#B066FF] border-l border-dashed border-white/50"></div>
                                            <div className="bg-[#B066FF] text-white text-xs font-bold px-3 py-1 rounded-full mt-2 shadow-[0_0_15px_rgba(176,102,255,0.5)]">
                                                +15% Predictive Lift
                                            </div>
                                        </div>
                                    </motion.div>

                                </div>

                            </div>
                        </ScrollReveal>
                    </div>

                </div>
            </div>
        </section>
    );
};
