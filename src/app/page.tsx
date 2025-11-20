"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu,
  X,
  ArrowRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { GeometricParticleField } from "@/components/GeometricParticleField";
import { FeatureGraphPreview } from "@/components/features/FeatureGraphPreview";
import { FeatureTimeseriesPreview } from "@/components/features/FeatureTimeseriesPreview";
import { FeatureApiPreview } from "@/components/features/FeatureApiPreview";
import Image from "next/image";

// --- Components ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors"
  >
    {children}
  </a>
);

const FeatureSection = ({ 
  title, 
  subtitle,
  description, 
  children, 
  align = "left",
}: { 
  title: string;
  subtitle: string;
  description: string; 
  children: React.ReactNode; 
  align?: "left" | "right";
}) => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${align === "right" ? "lg:grid-flow-dense" : ""}`}>
          
          {/* Text Content */}
          <div className={`space-y-6 ${align === "right" ? "lg:col-start-2" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#B066FF]/50"></span>
              <span className="text-[#B066FF] font-sans text-xs uppercase tracking-widest font-semibold">{subtitle}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed font-light">
              {description}
            </p>
            <div className="pt-4">
               <button className="group flex items-center text-sm font-medium text-white hover:text-[#B066FF] transition-colors">
                Read Documentation <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Visual Content */}
          <div className={`relative ${align === "right" ? "lg:col-start-1" : ""}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#B066FF]/20 to-purple-900/20 blur-2xl opacity-20" />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

const RavenLogo = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
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
            <NavLink href="#capabilities">Capabilities</NavLink>
            <a 
              href="#integration"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('integration');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm font-sans font-medium text-zinc-400 hover:text-[#B066FF] transition-colors"
            >
              Integration
            </a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Log In
            </button>
            <Button 
              onClick={() => setShowLogin(true)}
              className="bg-[#B066FF] hover:bg-[#9d4edd] text-white rounded-full px-6 h-10 text-sm font-semibold shadow-[0_0_20px_-5px_rgba(176,102,255,0.4)]"
            >
              Request Access
            </Button>
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
              <a href="#capabilities" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
              <a href="#integration" onClick={() => {
                setMobileMenuOpen(false);
                const element = document.getElementById('integration');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}>Integration</a>
              <Button onClick={() => setShowLogin(true)} className="w-full bg-[#B066FF] text-white mt-4 rounded-full">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
          <GeometricParticleField className="opacity-40" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
            <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B066FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B066FF]"></span>
                </span>
                <span className="text-zinc-300 text-xs font-medium tracking-wide">v2.4 Graph Model Live</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight leading-[1.1]"
              >
                Reveal the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B066FF] via-white to-[#B066FF]">
                  Invisible
                </span>
              </motion.h1>

          <motion.p
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-light"
          >
                The market isn't just time-series. It's a complex network. We build <span className="text-white font-medium">Graph Intelligence</span> to map the dynamic fabric of financial reality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              >
                <Button 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById('integration');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="h-12 px-8 bg-[#B066FF] hover:bg-[#9d4edd] text-white font-semibold text-base rounded-full shadow-[0_0_30px_-5px_rgba(176,102,255,0.6)]"
                >
                  Start Integration
                </Button>
              </motion.div>

            </div>
        </div>
      </section>

        {/* Metrics Strip */}
        <section className="border-y border-white/5 bg-[#0B0C15]/50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
            {[
              { label: "Latency", value: "< 50ms" },
              { label: "Active Edges", value: "10M+" },
              { label: "Assets", value: "3,000+" },
              { label: "Alpha Lift", value: "24%" },
            ].map((stat, i) => (
              <div key={i} className="py-8 md:py-10 text-center border-r border-white/5 last:border-r-0">
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
            </div>
            ))}
        </div>
      </section>

        {/* Features */}
        <div id="capabilities">
          <FeatureSection 
            title="The Invisible Web"
            subtitle="Graph Intelligence"
            description="Markets are living networks. See how a shock in semiconductor supply chains propagates to automotive equities before the price moves. Our GNNs map hidden dependencies in real-time."
            align="left"
          >
            <FeatureGraphPreview />
          </FeatureSection>

          <FeatureSection 
            title="Regime Detection"
            subtitle="Temporal Dynamics"
            description="Identify volatility clusters and correlation breakdowns milliseconds after they begin. RavenGraph signals structural breaks that standard covariance models miss."
            align="right"
          >
            <FeatureTimeseriesPreview />
          </FeatureSection>

          <FeatureSection 
            title="Direct Neural Interface"
            subtitle="Developer First"
            description="Built for quants. Stream raw embeddings, adjacency matrices, or propagation signals directly into your execution engine via our low-latency API."
            align="left"
          >
            <div id="integration" className="scroll-mt-24">
              <FeatureApiPreview />
            </div>
          </FeatureSection>
          </div>

        {/* Footer */}
        <footer className="bg-[#05060A] py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-2">
              <RavenLogo className="w-6 h-6" />
              <span className="font-display font-bold text-lg tracking-tight text-white">RavenGraph</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-zinc-600 font-mono">
              <p>© 2025 RavenGraph Inc.</p>
              <p>SYSTEM: ONLINE</p>
          </div>
        </div>
      </footer>
      </main>

      {showLogin && <LoginForm />}
    </div>
  );
}
