"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function UnderTheHood() {
    return (
        <section id="the-model" className="py-24 relative border-t border-white/5 bg-[#0B0C15]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <ScrollReveal>
                    <div className="mb-12">
                        <span className="block text-[#B066FF] font-mono text-xs tracking-widest mb-6 uppercase">
                            004 / Under the Hood
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight italic text-zinc-200">
                            Temporal graph networks. <br />
                            Not another LSTM.
                        </h2>
                    </div>

                    <div className="max-w-xl text-zinc-200 font-sans text-lg leading-relaxed mb-16">
                        <p className="mb-6">
                            Most quant shops run variations of the same models — LSTM, transformer, gradient boosting on price features. The signals degrade as they get crowded.
                        </p>
                        <p>
                            RavenGraph models the market as a dynamic graph: assets as nodes, relationships as edges, updated at each timestep. The network learns which relationships matter, when they break, and what that signals about price movement.
                        </p>
                        <p className="mt-6 font-semibold text-white">
                            This is not an incremental improvement. It&apos;s a different class of model.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full max-w-2xl text-left border-collapse">
                            <tbody className="text-sm font-mono">
                                <tr className="border-b border-white/5">
                                    <td className="py-4 text-zinc-400 pr-8">Model type</td>
                                    <td className="py-4 text-[#B066FF]">Temporal Graph Neural Network (T-GNN)</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 text-zinc-400 pr-8">Input structure</td>
                                    <td className="py-4 text-zinc-200">Multi-asset relational graph, flexible granularities</td>

                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 text-zinc-400 pr-8">Signal horizon</td>
                                    <td className="py-4 text-zinc-200">Flexible · Minute to Daily</td>

                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 text-zinc-400 pr-8">Coverage</td>
                                    <td className="py-4 text-zinc-200">Equities · Crypto · Commodities</td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-zinc-400 pr-8">Status</td>
                                    <td className="py-4 text-[#B066FF]">Live partner testing · Q1 2026</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                </ScrollReveal>
            </div>
        </section>
    );
}
