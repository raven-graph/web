"use client";

import React from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function TheGap() {
    return (
        <section className="py-24 md:py-32 relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <ScrollReveal>
                    <span className="block text-[#B066FF] font-mono text-xs tracking-widest mb-6">
                        001 / THE GAP
                    </span>

                    <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                        <h2 className="text-4xl md:text-5xl font-display leading-tight">
                            Most quant signals are built in isolation. <br />
                            <span className="text-zinc-300">Markets aren&apos;t.</span>
                        </h2>

                        <div className="space-y-6 text-zinc-200 font-sans text-lg leading-relaxed">
                            <p>
                                Traditional models treat assets as independent time series.
                                But equities, commodities, and crypto don&apos;t move in a vacuum —
                                they move through networks of relationships: supply chains, capital flows, correlated exposures, and sentiment contagion.
                            </p>
                            <p>
                                Temporal graph neural networks capture this structure.
                                They model which nodes influence which, when, and how strongly.
                                The result: signals that see around corners.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
