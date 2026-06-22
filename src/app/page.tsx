
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { GeometricParticleField } from "@/components/GeometricParticleField";
import Image from "next/image";

import { IntroReveal } from "@/components/IntroReveal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SignalShowcaseSection } from "@/components/SignalShowcaseSection";

// --- Components ---

const RavenLogo = ({ className }: { className?: string }) => (
  <div className={`relative ${className} `}>
    <Image
      src="/icon-white-transparent.svg"
      alt="RavenGraph"
      fill
      className="object-contain"
      style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)" }}
    />
  </div>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#B066FF]/90">
    {children}
  </p>
);

const MAILTO = "mailto:gabriel@ravengraph.com";

const GetInTouchButton = ({ className = "" }: { className?: string }) => (
  <a
    href={MAILTO}
    className={`group inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#B066FF] hover:bg-[#9d4edd] text-white rounded-full text-base font-semibold shadow-[0_0_40px_-10px_rgba(176,102,255,0.6)] transition-colors ${className}`}
  >
    Get in touch
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </a>
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white font-sans selection:bg-[#B066FF]/30">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0C15]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RavenLogo className="w-8 h-8" />
            <span className="font-display font-bold text-xl tracking-tight text-white">RavenGraph</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href={MAILTO}
              className="inline-flex items-center justify-center bg-[#B066FF] hover:bg-[#9d4edd] text-white rounded-full px-6 h-10 text-sm font-semibold shadow-[0_0_20px_-5px_rgba(176,102,255,0.4)] transition-colors"
            >
              Get in touch
            </a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 bg-[#0B0C15] border-b border-white/10 p-6 md:hidden"
          >
            <a
              href={MAILTO}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#B066FF] text-white rounded-full py-3 font-semibold"
            >
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <IntroReveal />

        {/* Hero */}
        <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
          <GeometricParticleField className="opacity-40" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
            <div className="flex flex-col items-center text-center gap-8 max-w-5xl mx-auto">

              <ScrollReveal>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B066FF]/10 border border-[#B066FF]/20 backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B066FF] shadow-[0_0_10px_#B066FF]"></span>
                  <span className="text-[#B066FF] text-[10px] font-mono tracking-[0.2em] uppercase font-bold">
                    Graph-native hedge fund · Private
                  </span>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium text-white tracking-tighter leading-[0.92]">
                  A graph-native
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 italic">
                    hedge fund.
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl leading-relaxed font-light">
                  Markets are networks, not time series.{" "}
                  <span className="text-white font-medium">We trade the structure.</span>
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex flex-col items-center gap-6 pt-6">
                  <GetInTouchButton />
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.18em]">
                    10 months in · live micro-size · design partnership underway
                  </p>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* Section 1 — The problem */}
        <section className="relative py-32 md:py-40 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col gap-6 max-w-3xl">
              <Kicker>The problem</Kicker>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.05]">
                Everyone trades the same isolated time series.
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                The relationships between assets — who moves first, who follows, how a shock
                spreads — stay invisible to those pipelines. That&apos;s where the edge is.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Section 2 — The graph (world model) */}
        <section className="relative py-32 md:py-40 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col gap-6 max-w-3xl mb-14">
              <Kicker>The world model</Kicker>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.05]">
                A real-time graph of the market.
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                Stocks, sectors, macro, and commodities as nodes. Lead-lag and influence as
                edges. The structural map the system reasons on instead of guessing.
              </p>
            </ScrollReveal>
          </div>

          <SignalShowcaseSection />
        </section>

        {/* Section 3 — How we use AI */}
        <section className="relative py-32 md:py-40 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col gap-6 max-w-3xl">
              <Kicker>How we use AI</Kicker>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.05]">
                We use AI where it scales skill, not fragility.
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                AI-native in how we operate — not in the lazy sense of letting an agent trade.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="grid md:grid-cols-2 gap-5 mt-14">
              <div className="rounded-2xl border border-white/10 bg-[#0F111A] p-7">
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Agents do the research.
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed font-light">
                  Hypotheses, feature extraction, querying the graph. Two people ship like twenty.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0F111A] p-7">
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Validated models make the trades.
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed font-light">
                  Features → neural models → graph embeddings → signal. Walk-forward validated.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="mt-20">
              <blockquote className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-[1.1] max-w-4xl">
                <span className="text-[#B066FF]">&ldquo;</span>An LLM is a great feature
                extractor and a terrible portfolio manager.<span className="text-[#B066FF]">&rdquo;</span>
              </blockquote>
            </ScrollReveal>
          </div>
        </section>

        {/* Section 4 — Why it scales */}
        <section className="relative py-32 md:py-40 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col gap-6 max-w-3xl">
              <Kicker>Why it scales like a company</Kicker>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.05]">
                One graph. Many strategies. A handful of people.
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                AUM grows without growing the team — and the system gets better with every
                market it ingests.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Section 5 — Where we are */}
        <section className="relative py-32 md:py-40 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col gap-8 max-w-3xl">
              <Kicker>Where we are</Kicker>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[1.05]">
                10 months in, and live.
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm md:text-base font-mono text-zinc-400">
                <span>Live micro-size on Hyperliquid</span>
                <span className="text-zinc-600">·</span>
                <span>Sharpe ~2.3 baseline</span>
                <span className="text-zinc-600">·</span>
                <span>Design partnership with Avant</span>
                <span className="text-zinc-600">·</span>
                <span>Graph layer in build</span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer / CTA */}
        <footer className="relative bg-[#05060A] py-32 md:py-44 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_120%,rgba(176,102,255,0.18),transparent_60%)]" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-10">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-white tracking-tight leading-[1.05] max-w-3xl">
                The market is a graph. We&apos;re trading on it first.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <GetInTouchButton />
            </ScrollReveal>

            <div className="mt-16 w-full border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <RavenLogo className="w-6 h-6" />
                <span className="font-display font-bold text-lg tracking-tight text-white">RavenGraph</span>
              </div>
              <a
                href={MAILTO}
                className="text-xs text-zinc-500 font-mono hover:text-[#B066FF] transition-colors"
              >
                gabriel@ravengraph.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
