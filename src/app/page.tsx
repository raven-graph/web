"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// RavenGraph Logo using external SVG
const RavenLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/noun-raven-6274501.svg" 
    alt="RavenGraph" 
    className={className}
    style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)' }}
  />
);

const GradientOrb: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute blur-3xl opacity-25 ${className}`}>
    <div
      className="size-72 md:size-[28rem] rounded-full"
      style={{ background: "radial-gradient(closest-side, #a855f7 0%, rgba(168,85,247,0.08) 60%, transparent 70%)" }}
    />
  </div>
);

export default function LandingPage() {
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
          <div className="flex items-center gap-2">
            <a href="#waitlist">
              <Button className="rounded-2xl">Request access</Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-semibold leading-[1.1]"
          >
            Where signals hide in structure.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-lg text-zinc-300"
          >
            A private effort at the edge of networks and markets. For those who listen closely, the patterns reveal themselves.
          </motion.p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center" id="waitlist">
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks. We'll be in touch."); }} className="grid sm:grid-cols-[1fr_auto] gap-3 w-full max-w-xl">
              <Input required type="email" placeholder="you@firm.com" className="h-12 rounded-xl border-white/20 bg-zinc-900/70" />
              <Button type="submit" className="h-12 rounded-xl"><Mail className="mr-2 w-4 h-4" /> Request access</Button>
            </form>
          </div>

          <p className="mt-4 text-xs text-zinc-500">Selective private beta · Invitations go out occasionally.</p>
        </div>
      </section>

      {/* PRINCIPLES (no product details) */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-3 gap-6">
          {[
            {t:"Clarity through Structure", s:"Find order in the hidden networks of markets."},
            {t:"Craft over Noise", s:"Build with rigor, elegance, and restraint."},
            {t:"Stealth and Independence", s:"Advance quietly, free from consensus and hype."}
          ].map(({t, s}) => (
            <Card key={t} className="rounded-3xl border-white/10 bg-zinc-900/60">
              <CardContent className="p-6">
                <div className="text-xl font-medium text-zinc-100">{t}</div>
                <p className="mt-2 text-zinc-300">{s}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm">
              <RavenLogo className="w-5 h-5" /> RavenGraph © {new Date().getFullYear()}
            </div>
            <div className="text-sm text-zinc-400">contact@ravengraph.com</div>
            <div className="text-sm text-zinc-500">Private beta</div>
          </div>
          <div className="text-right mt-4">
            <blockquote className="text-sm text-zinc-500 italic">
              &ldquo;Life can only be understood backwards; but it must be lived forwards.&rdquo; - K.
            </blockquote>
          </div>
        </div>
      </footer>
    </div>
  );
}