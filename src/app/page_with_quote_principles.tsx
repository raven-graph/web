"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// RavenGraph Silhouette Logo (inline SVG)
const RavenLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-label="RavenGraph" className={className}>
    <defs>
      <linearGradient id="rgPurple" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopOpacity="1" stopColor="#7c3aed" />
        <stop offset="100%" stopOpacity="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <path d="M364.4 179.3c-18.2-22.8-48.6-38.1-82.5-42.4-39.7-5-83.7 6.6-117.3 27.1-36.5 22.1-57.6 51.6-61.8 84.8-3 23.8 5.7 45.1 23.3 60.8 14.8 13.2 35.2 21.7 57.9 24.9-2.9 8.4-8.2 17.1-15.8 25.8-6.2 7.1-6.3 14.9-.1 20.6 6.1 5.7 16.5 7.9 27.8 2.8 27.4-12.3 49.4-31.7 64.6-52.2 3 .2 6 .3 9.1.3 63.1 0 121.8-27.8 144.8-71.8 12.2-23.4 9.4-52.4-9.9-80.7zm-213.2 55.5c5.7-26.8 34.9-51.8 74.6-64.7 37.8-12.4 75.8-9.4 96.6 7.7 8.8 7.3 12.4 16.1 11.2 25.5-3.1 24.2-39.8 51.9-83.5 63.6-45.9 12.3-92.8 4.6-99-17.1-1.3-4.6-1.4-9.6.1-15z" fill="url(#rgPurple)" />
    <circle cx="330" cy="184" r="10" fill="#1f2937" />
  </svg>
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
            We build quietly.\n            \n            <p className=\"mt-3 italic text-zinc-400 text-base\">“At the still point of the turning world… there the dance is.” — T.S. Eliot</p>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-lg text-zinc-300"
          >
            A private research effort exploring networked market dynamics. If your work touches systematic strategies or discretionary macro and you value craft over noise, say hello.
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
          {[{t:"Quiet"},{t:"Selective"},{t:"Enduring"}].map(({t}) => (
            <Card key={t} className="rounded-3xl border-white/10 bg-zinc-900/60">
              <CardContent className="p-6">
                <div className="text-xl font-medium">{t}</div>
                <p className="mt-2 text-zinc-300">{t==="Quiet"?"We work away from the noise.":t==="Selective"?"We share only with a few.":"We think in decades, not days."}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm">
            <RavenLogo className="w-5 h-5" /> RavenGraph © {new Date().getFullYear()}
          </div>
          <div className="text-sm text-zinc-400">contact@ravengraph.com</div>
          <div className="text-sm text-zinc-500">Private beta</div>
        </div>
      </footer>
    </div>
  );
}