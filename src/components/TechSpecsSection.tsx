"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Cpu, Network, Zap, Server, Sliders, Activity } from "lucide-react";

export const TechSpecsSection = () => {
    return (
        <section className="py-24 bg-[#0B0C15] relative overflow-hidden border-t border-white/5">

            {/* HUD Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                <ScrollReveal className="mb-16 text-center">
                    <h2 className="text-sm font-bold text-[#B066FF] tracking-widest uppercase mb-4">
                        System Specifications
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-display font-bold text-white">
                        Engineering Superiority
                    </h3>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">

                    {/* Spec Item 1 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Network className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Architecture</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Heterogeneous Graph Models</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            Temporal GNNs optimized for <span className="text-white">financial causality</span>. Natively fuses price, sector, and macro topologies.
                        </div>
                    </div>

                    {/* Spec Item 2 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Sliders className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Topology</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Dynamic Multi-Edge</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            <span className="text-white">350+ Stocks</span>, 10 Sector Indices, 14 Macro Indicators. Edges re-weighted by real-time correlation regimes.
                        </div>
                    </div>

                    {/* Spec Item 3 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Zap className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Latency</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Target: &lt; 50ms</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            Designed for <span className="text-white">Apache Kafka</span> ingestion and <span className="text-white">gRPC</span> delivery. Optimized for high-frequency decision loops.
                        </div>
                    </div>

                    {/* Spec Item 4 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Server className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Infrastructure</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Multi-GPU Clusters</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            Training and inference optimized for <span className="text-white">NVIDIA A100</span> clusters. Distributed graph processing for massive scale.
                        </div>
                    </div>

                    {/* Spec Item 5 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Activity className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Features</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Causal & Point-in-Time</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            80+ engineered signals including <span className="text-white">Fractals</span> and <span className="text-white">Number-Theory Rhythms</span>. Strictly leakage-safe.
                        </div>
                    </div>

                    {/* Spec Item 6 */}
                    <div className="bg-[#0B0C15] p-8 group hover:bg-[#0B0C15]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-[#B066FF] transition-colors">
                            <Cpu className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-wider">Embeddings</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">Dynamic Vectors</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">
                            64-dim node embeddings updated per minute. Encapsulates <span className="text-white">Lead-Lag</span> and <span className="text-white">Shock Propagation</span> mechanics.
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};
