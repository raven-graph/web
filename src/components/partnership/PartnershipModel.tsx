"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function PartnershipModel() {
    return (
        <section id="how-it-works" className="py-24 relative bg-[#0B0C15]">
            {/* Background gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151725]/30 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <ScrollReveal>
                    <div className="mb-16">
                        <span className="block text-[#B066FF] font-mono text-xs tracking-widest mb-6 uppercase">
                            002 / The Partnership Model
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight mb-4">
                            Aligned incentives. <br />
                            No subscriptions. No retainers.
                        </h2>
                        <p className="text-zinc-300 font-mono text-sm tracking-wide">
                            We earn only when our signals generate profits for your fund.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 pt-8 border-t border-white/5">
                        {/* Step 1 */}
                        <div className="space-y-4">
                            <span className="text-4xl font-mono font-bold text-[#B066FF]/50">01</span>
                            <div className="h-px w-20 bg-[#B066FF] mb-6"></div>
                            <h3 className="text-2xl font-display text-white">You deploy capital</h3>
                            <p className="text-zinc-300 font-sans leading-relaxed">
                                Your fund allocates capital to a strategy powered by our graph predictions.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-4">
                            <span className="text-4xl font-mono font-bold text-[#B066FF]/50">02</span>
                            <div className="h-px w-20 bg-[#B066FF] mb-6"></div>
                            <h3 className="text-2xl font-display text-white">You trade our signals</h3>
                            <p className="text-zinc-300 font-sans leading-relaxed">
                                Our graph models generate signals across equities, crypto, or commodities at flexible granularities — delivered in your preferred format.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-4">
                            <span className="text-4xl font-mono font-bold text-[#B066FF]/50">03</span>
                            <div className="h-px w-20 bg-[#B066FF] mb-6"></div>
                            <h3 className="text-2xl font-display text-white">We share in the upside</h3>
                            <p className="text-zinc-300 font-sans leading-relaxed">
                                Flexible performance fee based on net profits. No payment if there are no profits.
                            </p>
                        </div>

                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5">
                        <p className="text-[#B066FF] font-mono italic text-sm">
                            → Currently onboarding 5–7 partner funds across strategies.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
