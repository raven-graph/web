"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GeometricParticleField } from "@/components/GeometricParticleField";
import { ScrollReveal } from "@/components/ScrollReveal";

export function PartnershipHero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 overflow-hidden">
            <GeometricParticleField className="opacity-40" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
                <div className="max-w-4xl">
                    <ScrollReveal>
                        <div className="flex flex-col gap-6">
                            <p className="text-[#B066FF] font-mono text-sm tracking-wider uppercase font-semibold">
                                Signal Intelligence · Co-Investment Partnerships
                            </p>

                            <h1 className="text-6xl md:text-8xl font-display font-medium text-white tracking-tighter leading-[1.0]">
                                Markets are networks. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    We model them that way.
                                </span>
                            </h1>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="mt-8 max-w-2xl">
                            <p className="text-xl md:text-2xl text-zinc-200 font-light font-sans leading-relaxed">
                                RavenGraph builds temporal graph neural networks that capture how information flows through financial markets — relationships, timing, and structure that time-series models miss entirely.
                            </p>
                            <p className="mt-6 text-lg text-zinc-300 font-mono">
                                We partner with emerging hedge funds to put these signals to work. <br />
                                You trade. We earn when you profit.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4}>
                        <div className="mt-12">
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#B066FF]/50 text-[#B066FF] hover:bg-[#B066FF]/10 hover:border-[#B066FF] transition-all duration-300 font-mono text-sm uppercase tracking-wide"
                            >
                                Explore Partnership
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
