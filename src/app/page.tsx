"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Share2, Radar, Rocket, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { GeometricParticleField } from "@/components/GeometricParticleField";
import { FeatureGraphPreview } from "@/components/features/FeatureGraphPreview";
import { FeatureTimeseriesPreview } from "@/components/features/FeatureTimeseriesPreview";
import { FeatureApiPreview } from "@/components/features/FeatureApiPreview";

const RavenLogo: React.FC<{ className?: string }> = ({ className }) => (
  <Image 
    src="/icon-white-transparent.svg" 
    alt="RavenGraph"
    width={32}
    height={32}
    className={className}
    style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)" }}
  />
);

const GradientOrb: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute blur-3xl opacity-25 ${className}`}>
    <div
      className="size-72 md:size-[28rem] rounded-full"
      style={{ background: "radial-gradient(closest-side, #B066FF 0%, rgba(176,102,255,0.08) 60%, transparent 70%)" }}
    />
  </div>
);

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
      {/* Background ornaments */}
      <GradientOrb className="-top-10 -left-10" />
      <GradientOrb className="bottom-10 right-0" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RavenLogo className="w-8 h-8" />
            <span className="font-semibold tracking-wide text-lg">RavenGraph</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#problem" className="transition-colors hover:text-white/90">Problem</a>
            <a href="#solution" className="transition-colors hover:text-white/90">Solution</a>
            <a href="#business" className="transition-colors hover:text-white/90">Business</a>
            <a href="#access" className="transition-colors hover:text-white/90">Access</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowLogin(true)}
              className="rounded-2xl h-10"
              style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <a href="#access">
              <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-zinc-800/50 bg-transparent h-10 text-zinc-200">
                Join the waitlist
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <GeometricParticleField className="z-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-32 md:py-40 text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[2.75rem] md:text-[3.75rem] font-semibold tracking-tight leading-[1.05]"
          >
            Reveal the invisible fabric of global markets.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="text-lg md:text-xl text-zinc-300/90 max-w-3xl mx-auto"
          >
            RavenGraph maps how information flows between stocks, sectors, and macro signals, turning market complexity into real-time, usable intelligence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              className="rounded-full px-6 py-3 text-sm font-semibold"
              style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}
              onClick={() => setShowLogin(true)}
            >
              Request early access
            </Button>
            <div className="text-sm font-semibold text-zinc-300 transition-colors hover:text-white/90">
              <a href="#problem">Why RavenGraph?</a>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="text-xs uppercase tracking-[0.3em] text-zinc-500"
          >
            Now piloting with select funds; limited early-access seats.
          </motion.p>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid gap-8 md:grid-cols-3"
          >
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                10M<span style={{ color: "#B066FF" }}>+</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                market relationships trained
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                3,000<span style={{ color: "#B066FF" }}>+</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                symbols supported
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                50<span style={{ color: "#B066FF" }}>+</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                macro & sector signals integrated
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="problem" className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-zinc-300">
            Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 leading-tight">
            Markets aren’t time series. They’re living networks.
          </h2>
          <p className="text-lg text-zinc-300/90">
            Most stacks still treat each asset as an isolated stream. They miss how sectors ripple, how macro shocks cascade, and how sentiment shifts risk appetite—in real time.
          </p>
          <div className="grid gap-4 text-left text-sm text-zinc-300/90 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <span className="font-semibold text-zinc-100">Structural blind spots</span>
              <p className="mt-2 text-zinc-400">Models overlook cross-asset dependencies and how influence travels across the market graph.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <span className="font-semibold text-zinc-100">Causality flattened</span>
              <p className="mt-2 text-zinc-400">Lagging features blur lead–lag dynamics into noise.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <span className="font-semibold text-zinc-100">Static pipelines</span>
              <p className="mt-2 text-zinc-400">Streaming multi-source data overwhelms batch-era infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section id="solution" className="relative overflow-hidden py-24 border-t border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(176,102,255,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4">
          <div id="overview" className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-zinc-300">
              Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 leading-tight max-w-4xl mx-auto">
              Turn market structure into real-time, actionable intelligence.
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
              A living graph of assets, macro, and sentiment feeds your desk with structural signals—surfacing shifts before they appear in returns. Graph ML frameworks and cloud GPUs have made real-time market graphs practical—the edge is moving from latency to understanding.
            </p>
          </div>

          <div className="space-y-16">
            <motion.div
              className="grid gap-10 lg:grid-cols-2 lg:items-center"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
                  <Share2 className="h-4 w-4" style={{ color: "#B066FF" }} />
                  Graph Layer
                </div>
                <h3 className="text-2xl font-semibold text-zinc-100 leading-tight">
                  Living market graph
                </h3>
                <p className="text-base text-zinc-300 leading-relaxed">
                  A continuously updated network of equities, sectors, macro indicators, commodities, and sentiment.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every edge refreshes in real time, revealing how information flows through markets as it happens.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Watch clusters, correlations, and lead–lag paths form—the topology that explains why a move begins.
                </p>
              </div>
              <FeatureGraphPreview className="max-w-[540px] min-h-[340px] justify-self-center lg:justify-self-end" />
            </motion.div>

            <motion.div
              className="grid gap-10 lg:grid-cols-2 lg:items-center"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <FeatureTimeseriesPreview className="min-h-[320px] lg:order-1" />
              <div className="space-y-5 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
                  <Radar className="h-4 w-4" style={{ color: "#B066FF" }} />
                  Model Layer
                </div>
                <h3 className="text-2xl font-semibold text-zinc-100 leading-tight">
                  Structure-aware intelligence
                </h3>
                <p className="text-base text-zinc-300 leading-relaxed">
                  Temporal models track how influence ripples across the graph—identifying rising conviction, fading themes, and emerging risk pockets.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Delivered as clear, actionable signals: trend strength, propagation alerts, and optimal entry windows.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid gap-10 lg:grid-cols-2 lg:items-center"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
                  <Rocket className="h-4 w-4" style={{ color: "#B066FF" }} />
                  Signal Layer
                </div>
                <h3 className="text-2xl font-semibold text-zinc-100 leading-tight">
                  Seamless delivery
                </h3>
                <p className="text-base text-zinc-300 leading-relaxed">
                  Stream embeddings, alerts, and graph-derived factors straight into your dashboards, notebooks, or automated strategies.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Accessible through APIs, webhooks, or export payloads—so your team stays focused on ideas, not integration.
                </p>
              </div>
              <FeatureApiPreview className="min-h-[320px]" />
            </motion.div>
          </div>

        </div>
      </section>

      <section id="business" className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 space-y-12 text-center md:text-left">
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-zinc-300">
              Business
            </span>
            <h2 className="text-3xl md:text-[2.6rem] font-semibold text-zinc-100 leading-tight">
              Who It’s For
            </h2>
            <p className="text-lg text-zinc-300/90 max-w-3xl mx-auto text-center">
              RavenGraph delivers real-time market intelligence to funds, fintechs, and institutional research teams — as live data, tailored insights, or embedded intelligence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left text-sm text-zinc-300/90">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 space-y-2">
              <h3 className="text-zinc-100 font-semibold">Structural Intelligence Feed</h3>
              <p>Real-time embeddings, alerts, and propagation metrics streamed directly into your systems via API or data connector.</p>
              <p className="text-zinc-400">Ideal for funds running internal models and automated strategies.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 space-y-2">
              <h3 className="text-zinc-100 font-semibold">Research Access</h3>
              <p>Custom model outputs, feature sets, and graph snapshots for institutional research and strategy development.</p>
              <p className="text-zinc-400">Ideal for macro researchers and discretionary desks exploring new regimes.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 space-y-2">
              <h3 className="text-zinc-100 font-semibold">Embedded Intelligence</h3>
              <p>Fintech and analytics platforms integrate RavenGraph insights to power next-generation dashboards, portfolio tools, and client experiences.</p>
              <p className="text-zinc-400">Ideal for product teams embedding structural awareness into their UX.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-100">Who Uses RavenGraph</h3>
              <p className="text-sm text-zinc-300/90">
                Portfolio managers, macro researchers, and systematic teams use RavenGraph to:
              </p>
              <div className="grid gap-3 text-sm text-zinc-300/90 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#B066FF" }} />
                  Surface cross-asset opportunities early
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#B066FF" }} />
                  Identify regime transitions before consensus
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#B066FF" }} />
                  Add structural explainability to risk overlays
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#B066FF" }} />
                  Stream live propagation feeds into execution
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500/80">
              Next verticals: climate-linked commodities, credit risk networks, DeFi anomaly detection.
            </p>
          </div>
        </div>
      </section>


      <section id="access" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <h3 className="text-3xl md:text-4xl font-semibold text-white">See hidden connections.</h3>
          <p className="text-lg text-zinc-400">Unlock financial network intelligence now.</p>
          <Button
            className="rounded-full px-6 py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}
            onClick={() => setShowLogin(true)}
          >
            Request access
          </Button>
          <p className="text-xs text-zinc-500/80">Limited seats; we onboard 2–3 funds per month.</p>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-10 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col items-center gap-4 text-sm text-zinc-400 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 text-zinc-300">
            <RavenLogo className="w-5 h-5" /> RavenGraph © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            <span>contact@ravengraph.com</span>
            <span className="hidden h-4 w-px bg-white/10 md:inline-block" />
            <span className="text-zinc-500">Private beta</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && <LoginForm />}
    </div>
  );
}
