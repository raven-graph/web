"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Check } from "lucide-react";

export const ComparisonTableSection = () => {
    return (
        <section className="py-24 bg-[#0B0C15] border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 md:px-6">

                <ScrollReveal className="text-center mb-12">
                    <h2 className="text-sm font-bold text-[#B066FF] tracking-widest uppercase mb-4">
                        Performance Delta
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
                        Information Gain
                    </h3>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F111A]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">Metric (10-Month Walk-Forward)</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium text-right">Baseline (XGBoost)</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-[#B066FF] font-bold text-right">RavenGraph Features</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-green-500 font-medium text-right">Delta</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">

                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white font-medium">
                                        Implied Sharpe
                                        <div className="text-[10px] text-zinc-500 font-normal uppercase tracking-wide mt-1">Downstream Signal Quality Proxy</div>
                                    </td>
                                    <td className="p-6 text-zinc-400 text-right font-mono">1.10</td>
                                    <td className="p-6 text-white text-right font-mono font-bold">2.45</td>
                                    <td className="p-6 text-green-400 text-right font-mono">+1.35</td>
                                </tr>

                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white font-medium">Predictive Lift (AUC)</td>
                                    <td className="p-6 text-zinc-400 text-right font-mono">Baseline</td>
                                    <td className="p-6 text-white text-right font-mono font-bold">+15%</td>
                                    <td className="p-6 text-green-400 text-right font-mono">+15%</td>
                                </tr>

                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white font-medium">Information Coefficient (IC)</td>
                                    <td className="p-6 text-zinc-400 text-right font-mono">0.02</td>
                                    <td className="p-6 text-white text-right font-mono font-bold">0.05</td>
                                    <td className="p-6 text-green-400 text-right font-mono">+150%</td>
                                </tr>

                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-white font-medium">Regime Robustness</td>
                                    <td className="p-6 text-zinc-400 text-right font-mono">Low</td>
                                    <td className="p-6 text-white text-right font-mono font-bold">High</td>
                                    <td className="p-6 text-green-400 text-right font-mono flex justify-end"><Check className="w-4 h-4" /></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-center text-xs text-zinc-600 font-mono">
                        * Results based on internal backtest (2023-2024). Past performance is not indicative of future results.
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
};
