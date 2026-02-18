"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Check } from "lucide-react";

export function TargetProfile() {
    return (
        <section className="py-24 relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <ScrollReveal>
                    <div className="mb-16">
                        <span className="block text-[#B066FF] font-mono text-xs tracking-widest mb-6 uppercase">
                            006 / Who We Partner With
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight">
                            We are selective. <br />
                            So are the funds we work with.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                        {/* Left Column */}
                        <div>
                            <h3 className="text-xl font-mono text-white mb-8 border-b border-[#B066FF]/30 pb-2 inline-block">
                                — Ideal Partner Profile
                            </h3>
                            <ul className="space-y-4 text-zinc-300 font-sans text-lg">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B066FF] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B066FF]" />
                                    Emerging fund, $50M–$500M AUM
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B066FF] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B066FF]" />
                                    Strategy fit: equities, crypto, or commodities
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B066FF] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B066FF]" />
                                    Execution infrastructure already in place
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B066FF] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B066FF]" />
                                    PM open to signal integration (discretionary or systematic)
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#B066FF] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B066FF]" />
                                    Motivated by differentiation, not cost savings
                                </li>
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="text-xl font-mono text-white mb-8 border-b border-[#B066FF]/30 pb-2 inline-block">
                                — What We Bring
                            </h3>
                            <ul className="space-y-4 text-zinc-300 font-sans text-lg">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#B066FF] shrink-0" />
                                    Graph-based alpha signals, flexible granularities
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#B066FF] shrink-0" />
                                    Strategy-specific model calibration
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#B066FF] shrink-0" />
                                    Ongoing research and signal refinement
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#B066FF] shrink-0" />
                                    Co-investment structure, performance-aligned
                                </li>

                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-[#B066FF] shrink-0" />
                                    Shared upside: flexible performance fee
                                </li>

                            </ul>
                        </div>
                    </div>

                </ScrollReveal>
            </div>
        </section>
    );
}
