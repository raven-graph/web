"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Share2, Radar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Base text that stays constant
const BASE_TEXT = "Discover hidden signals";

// Words that rotate after "in"
const ROTATING_WORDS = [
  "networks", 
  "markets", 
  "structures", 
  "connections", 
  "graphs"
];

/** Typewriter component */
export function Typewriter({
  typingSpeed = 22,
  deletingSpeed = 18,
  pauseBeforeDelete = 1200,
  pauseBetweenPhrases = 350,
  loop = true,
  deleteMode = "backspace",
  className = "",
}: {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseBeforeDelete?: number;
  pauseBetweenPhrases?: number;
  loop?: boolean;
  deleteMode?: "none" | "backspace" | "erase";
  className?: string;
}) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"typing" | "pausing" | "deleting" | "done">("typing");
  const timer = useRef<number | null>(null);

  // Memoize timer functions to prevent unnecessary re-renders
  const clearTimer = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const setTypingTimer = useCallback((callback: () => void, delay: number) => {
    clearTimer();
    timer.current = window.setTimeout(callback, delay);
  }, [clearTimer]);

  useEffect(() => {
    const changingWord = ROTATING_WORDS[i] ?? "";
    
    if (mode === "typing") {
      // If we have a zero-width space, replace it with the first character
      if (text === "\u200B") {
        setText(changingWord[0] || "");
        return;
      }
      
      if (text.length < changingWord.length) {
        setTypingTimer(() => setText(changingWord.slice(0, text.length + 1)), typingSpeed);
      } else {
        if (deleteMode === "none" && !loop && i === ROTATING_WORDS.length - 1) {
          setMode("done");
        } else if (deleteMode === "none") {
          setTypingTimer(() => setMode("pausing"), pauseBeforeDelete);
        } else {
          setMode("pausing");
        }
      }
    } else if (mode === "pausing") {
      setTypingTimer(() => {
        if (deleteMode === "backspace") setMode("deleting");
        else if (deleteMode === "erase") { setText(""); setMode("deleting"); }
        else {
          const next = i + 1;
          if (next < ROTATING_WORDS.length) { setI(next); setMode("typing"); }
          else if (loop) { setI(0); setMode("typing"); }
          else { setMode("done"); }
        }
      }, pauseBeforeDelete);
    } else if (mode === "deleting") {
      if (deleteMode === "backspace" && text.length > 0) {
        setTypingTimer(() => setText((t: string) => t.slice(0, -1)), deletingSpeed);
      } else {
        // Changing word has been completely deleted, move to next phrase immediately
        const next = (i + 1) % ROTATING_WORDS.length;
        if (!loop && i === ROTATING_WORDS.length - 1) { 
          setMode("done"); 
        } else { 
          setI(next); 
          setText("\u200B"); // Use zero-width space to maintain cursor position
          setMode("typing"); // Move to typing mode immediately
        }
      }
    }
    
    return clearTimer;
  }, [text, i, mode, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBetweenPhrases, loop, deleteMode, setTypingTimer, clearTimer]);

  return (
    <div className={`flex flex-col items-center ${className}`} aria-label={`${BASE_TEXT} in ${ROTATING_WORDS[i]}`}>
      <div className="text-center">
        <span>{BASE_TEXT}</span>
      </div>
      <div className="text-center">
        <span>in{' '}</span>
        <span className="text-purple-400 font-semibold">{text}</span>
        <span className="ml-0.5 w-[1px] h-[1.2em] bg-current animate-pulse inline-block" />
      </div>
    </div>
  );
}


// RavenGraph Logo using external SVG
const RavenLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/noun-raven-1040402.svg" 
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
              <Button className="rounded-2xl">Join the waitlist</Button>
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
            <Typewriter
              typingSpeed={40}
              deletingSpeed={18}
              pauseBeforeDelete={1600}
              pauseBetweenPhrases={350}
              loop={true}
              deleteMode="backspace"
              className="leading-tight"
            />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-lg text-zinc-300"
          >
            An invitation-only project at the frontier of networks and markets — for those who seek patterns before they emerge.
          </motion.p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center" id="waitlist">
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks. We'll be in touch."); }} className="grid sm:grid-cols-[1fr_auto] gap-3 w-full max-w-xl">
              <Input required type="email" placeholder="you@firm.com" className="h-12 rounded-xl border-white/20 bg-zinc-900/70" />
              <Button type="submit" className="h-12 rounded-xl"><Mail className="mr-2 w-4 h-4" /> Join the waitlist</Button>
            </form>
          </div>

          <p className="mt-4 text-xs text-zinc-500">Private beta — limited spots, invitations released in waves.</p>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Main description */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 leading-tight max-w-5xl mx-auto mb-6">
              RavenGraph maps markets as living graphs, connecting assets, trends, and sentiment in real time.
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-4xl mx-auto">
              By modeling markets as networks rather than isolated time series, we surface early signals and structural patterns missed by conventional methods — turning complexity into clarity.
            </p>
          </div>
          
          {/* Three key points */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="rounded-3xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300 hover:scale-105 hover:border-white/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="text-xl font-semibold text-zinc-100 leading-tight">
                    See the market as a network, not tickers.
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed text-base">
                  Stocks, commodities, and indicators become interconnected nodes linked by influence, correlation, and lead–lag effects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300 hover:scale-105 hover:border-white/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Radar className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="text-xl font-semibold text-zinc-100 leading-tight">
                    Unlock hidden signals from structure.
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed text-base">
                  We turn the invisible fabric of global markets into actionable insights — embeddings that forecast risk regimes, directional moves, and anomalies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl border-white/20 bg-zinc-900/80 hover:bg-zinc-900/90 transition-all duration-300 hover:scale-105 hover:border-white/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="text-xl font-semibold text-zinc-100 leading-tight">
                    Built for the frontier, not for consensus.
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed text-base">
                Our edge is uniting graph learning, real-time infrastructure, and production ML into a single stack.
                </p>
              </CardContent>
            </Card>
          </div>
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