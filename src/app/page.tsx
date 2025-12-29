
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { GeometricParticleField } from "@/components/GeometricParticleField";
import Image from "next/image";

import { IntroReveal } from "@/components/IntroReveal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CodeDemoSection } from "@/components/CodeDemoSection";
import { TechSpecsSection } from "@/components/TechSpecsSection";
import { SignalShowcaseSection } from "@/components/SignalShowcaseSection";
import { ComparisonTableSection } from "@/components/ComparisonTableSection";

// --- Components ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors"
  >
    {children}
  </a>
);

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

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white font-sans selection:bg-[#B066FF]/30">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0C15]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RavenLogo className="w-8 h-8" />
            <span className="font-display font-bold text-xl tracking-tight text-white">RavenGraph</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#signals">Signals</NavLink>
            <NavLink href="#specs">Specifications</NavLink>
            <NavLink href="#api">Api</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Log In
            </button>
            <a
              href="mailto:gabriel@ravengraph.com"
              className="inline-flex items-center justify-center bg-[#B066FF] hover:bg-[#9d4edd] text-white rounded-full px-6 h-10 text-sm font-semibold shadow-[0_0_20px_-5px_rgba(176,102,255,0.4)] transition-colors"
            >
              Request Data Sample
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
            <div className="flex flex-col gap-6 font-display text-xl">
              <a href="#signals" onClick={() => setMobileMenuOpen(false)}>Signals</a>
              <a href="#specs" onClick={() => setMobileMenuOpen(false)}>Specifications</a>
              <a href="#api" onClick={() => setMobileMenuOpen(false)}>Api</a>
              <Button onClick={() => setShowLogin(true)} className="w-full bg-[#B066FF] text-white mt-4 rounded-full">Request Data</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <IntroReveal />
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 overflow-hidden">
          <GeometricParticleField className="opacity-40" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
            <div className="flex flex-col items-center text-center gap-10 max-w-5xl mx-auto">

              <ScrollReveal>
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B066FF]/10 border border-[#B066FF]/20 backdrop-blur-md mb-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B066FF] shadow-[0_0_10px_#B066FF]"></span>
                    <span className="text-[#B066FF] text-[10px] font-mono tracking-[0.2em] uppercase font-bold">Private Preview</span>
                  </motion.div>

                  <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-medium text-white tracking-tighter leading-[0.9]">
                    The Market <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 italic">
                      Is A Graph.
                    </span>
                  </h1>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed font-light font-sans space-y-2">
                  <p><span className="text-white font-medium">Graph-derived signals and embeddings</span> for systematic trading.</p>
                  <p className="text-lg text-zinc-500">Drop-in features. Point-in-time safe. Built for research and production.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex flex-col items-center gap-6 pt-8">
                  <a
                    href="mailto:gabriel@ravengraph.com?subject=Request%20Backtest%20Artifacts"
                    className="group relative h-14 px-8 bg-white text-black hover:bg-zinc-200 font-medium text-lg rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
                  >
                    Request Backtest Artifacts
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <div className="text-xs text-zinc-500 font-mono text-center space-y-3">
                    <p className="uppercase tracking-widest opacity-70">Private preview · Offline evaluation · No live trading required</p>

                    <div className="flex flex-wrap justify-center gap-4 text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#B066FF]" />
                        64-dim Graph Embeddings
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#B066FF]" />
                        300+ US Equities
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#B066FF]" />
                        Parquet + Schema
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* Signals Section */}
        <div id="signals">
          <SignalShowcaseSection />
        </div>

        {/* Tech Specifications */}
        <div id="specs">
          <TechSpecsSection />
        </div>

        {/* Comparison Table */}
        <ComparisonTableSection />

        {/* API Integration */}
        <div id="api">
          <CodeDemoSection />
        </div>

        {/* Footer */}
        <footer className="bg-[#05060A] py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-2">
              <RavenLogo className="w-6 h-6" />
              <span className="font-display font-bold text-lg tracking-tight text-white">RavenGraph</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-zinc-600 font-mono">
              <a href="mailto:hello@ravengraph.com" className="hover:text-[#B066FF] transition-colors">hello@ravengraph.com</a>
              <p>SYSTEM: ONLINE</p>
            </div>
          </div>
        </footer>
      </main>

      {showLogin && <LoginForm />}
    </div>
  );
}

