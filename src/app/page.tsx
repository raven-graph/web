"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Share2, Radar, Rocket, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { useRouter } from "next/navigation";

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
        <span className="font-semibold" style={{ color: "#B066FF" }}>{text}</span>
        <span className="ml-0.5 w-[1px] h-[1.2em] bg-current animate-pulse inline-block" />
      </div>
    </div>
  );
}


// RavenGraph Logo using external SVG
const RavenLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/icon-white-transparent.svg" 
    alt="RavenGraph" 
    className={className}
    style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)' }}
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
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowLogin(true)}
              className="rounded-2xl h-10"
              style={{ backgroundColor: "#B066FF", borderColor: "#B066FF" }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <a href="#waitlist">
              <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-zinc-800/50 bg-transparent h-10">
                Join the waitlist
              </Button>
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
                  <Share2 className="w-6 h-6 flex-shrink-0" style={{ color: "#B066FF" }} />
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
                  <Radar className="w-6 h-6 flex-shrink-0" style={{ color: "#B066FF" }} />
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
                  <Rocket className="w-6 h-6 flex-shrink-0" style={{ color: "#B066FF" }} />
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

      {/* GRAPH ANIMATION & PRODUCT EXPLANATION */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Graph Animation */}
            <div className="relative">
              <div className="w-full h-96 bg-zinc-900/60 rounded-3xl border border-white/20 p-4 md:p-6 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <filter id="glowX" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <linearGradient id="pulseStrokeX" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B066FF" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#B066FF" stopOpacity="0.15"/>
                    </linearGradient>
                  </defs>

                  {/* --- Inactive (base) edges: dense network, low opacity --- */}
                  <g stroke="#52525b" strokeWidth="0.7" opacity="0.45" strokeLinecap="round">
                    {/* Connect every pair (complete-like look) */}
                    <line x1="50" y1="10" x2="20" y2="25" />
                    <line x1="50" y1="10" x2="80" y2="25" />
                    <line x1="50" y1="10" x2="10" y2="50" />
                    <line x1="50" y1="10" x2="90" y2="50" />
                    <line x1="50" y1="10" x2="30" y2="85" />
                    <line x1="50" y1="10" x2="50" y2="90" />
                    <line x1="50" y1="10" x2="70" y2="85" />

                    <line x1="20" y1="25" x2="80" y2="25" />
                    <line x1="20" y1="25" x2="10" y2="50" />
                    <line x1="20" y1="25" x2="90" y2="50" />
                    <line x1="20" y1="25" x2="30" y2="85" />
                    <line x1="20" y1="25" x2="50" y2="90" />
                    <line x1="20" y1="25" x2="70" y2="85" />

                    <line x1="80" y1="25" x2="10" y2="50" />
                    <line x1="80" y1="25" x2="90" y2="50" />
                    <line x1="80" y1="25" x2="30" y2="85" />
                    <line x1="80" y1="25" x2="50" y2="90" />
                    <line x1="80" y1="25" x2="70" y2="85" />

                    <line x1="10" y1="50" x2="90" y2="50" />
                    <line x1="10" y1="50" x2="30" y2="85" />
                    <line x1="10" y1="50" x2="50" y2="90" />
                    <line x1="10" y1="50" x2="70" y2="85" />

                    <line x1="90" y1="50" x2="30" y2="85" />
                    <line x1="90" y1="50" x2="50" y2="90" />
                    <line x1="90" y1="50" x2="70" y2="85" />

                    <line x1="30" y1="85" x2="50" y2="90" />
                    <line x1="30" y1="85" x2="70" y2="85" />
                    <line x1="50" y1="90" x2="70" y2="85" />
                  </g>

                  {/* --- Traveling pulse from TOP (node 0) to all others --- */}
                  <g stroke="url(#pulseStrokeX)" strokeLinecap="round">
                    {/* pathLength=1 lets dashoffset 1->0 animate tip-to-target */}
                    <line x1="50" y1="10" x2="20" y2="25" strokeWidth="2.6" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="1.2s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="80" y2="25" strokeWidth="2.4" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="10" y2="50" strokeWidth="2.2" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="1.8s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="90" y2="50" strokeWidth="2.8" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="2.1s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="2.1s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="30" y2="85" strokeWidth="2.0" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="2.4s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="50" y2="90" strokeWidth="2.2" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="2.7s" begin="0s" repeatCount="indefinite"/>
                    </line>
                    <line x1="50" y1="10" x2="70" y2="85" strokeWidth="2.4" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
                      <animate attributeName="stroke-dashoffset" values="1;0" dur="3.0s" begin="0s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0;1;0" dur="3.0s" begin="0s" repeatCount="indefinite"/>
                    </line>
                  </g>

                  {/* --- Nodes --- */}
                  {/* Top (source) node: glows first */}
                  <g>
                    <circle cx="50" cy="10" r="3.2" fill="#B066FF" filter="url(#glowX)"/>
                    <circle cx="50" cy="10" r="6" fill="none" stroke="#B066FF" strokeOpacity="0.35">
                      <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="stroke-opacity" values="0.35;0.08;0.35" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </g>

                  {/* Targets: light up when pulse arrives, then repeat every pulse cycle */}
                  {/* upper-left - pulse arrives at 1.2s, then repeats every 1.2s */}
                  <g>
                    <circle cx="20" cy="25" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#B066FF;#52525b" dur="0.5s" begin="1.2s;2.4s;3.6s;4.8s;6.0s;7.2s;8.4s;9.6s;10.8s;12.0s;13.2s;14.4s;15.6s;16.8s;18.0s;19.2s;20.4s;21.6s;22.8s;24.0s;25.2s;26.4s;27.6s;28.8s;30.0s;31.2s;32.4s;33.6s;34.8s;36.0s;37.2s;38.4s;39.6s;40.8s;42.0s;43.2s;44.4s;45.6s;46.8s;48.0s;49.2s;50.4s;51.6s;52.8s;54.0s;55.2s;56.4s;57.6s;58.8s;60.0s" />
                    </circle>
                    <circle cx="20" cy="25" r="2.6" fill="none" stroke="#B066FF" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="1.2s;2.4s;3.6s;4.8s;6.0s;7.2s;8.4s;9.6s;10.8s;12.0s;13.2s;14.4s;15.6s;16.8s;18.0s;19.2s;20.4s;21.6s;22.8s;24.0s;25.2s;26.4s;27.6s;28.8s;30.0s;31.2s;32.4s;33.6s;34.8s;36.0s;37.2s;38.4s;39.6s;40.8s;42.0s;43.2s;44.4s;45.6s;46.8s;48.0s;49.2s;50.4s;51.6s;52.8s;54.0s;55.2s;56.4s;57.6s;58.8s;60.0s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="1.2s;2.4s;3.6s;4.8s;6.0s;7.2s;8.4s;9.6s;10.8s;12.0s;13.2s;14.4s;15.6s;16.8s;18.0s;19.2s;20.4s;21.6s;22.8s;24.0s;25.2s;26.4s;27.6s;28.8s;30.0s;31.2s;32.4s;33.6s;34.8s;36.0s;37.2s;38.4s;39.6s;40.8s;42.0s;43.2s;44.4s;45.6s;46.8s;48.0s;49.2s;50.4s;51.6s;52.8s;54.0s;55.2s;56.4s;57.6s;58.8s;60.0s"/>
                    </circle>
                  </g>

                  {/* upper-right - pulse arrives at 1.5s, then repeats every 1.5s */}
                  <g>
                    <circle cx="80" cy="25" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#B066FF;#52525b" dur="0.5s" begin="1.5s;3.0s;4.5s;6.0s;7.5s;9.0s;10.5s;12.0s;13.5s;15.0s;16.5s;18.0s;19.5s;21.0s;22.5s;24.0s;25.5s;27.0s;28.5s;30.0s;31.5s;33.0s;34.5s;36.0s;37.5s;39.0s;40.5s;42.0s;43.5s;45.0s;46.5s;48.0s;49.5s;51.0s;52.5s;54.0s;55.5s;57.0s;58.5s;60.0s" />
                    </circle>
                    <circle cx="80" cy="25" r="2.6" fill="none" stroke="#B066FF" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="1.5s;3.0s;4.5s;6.0s;7.5s;9.0s;10.5s;12.0s;13.5s;15.0s;16.5s;18.0s;19.5s;21.0s;22.5s;24.0s;25.5s;27.0s;28.5s;30.0s;31.5s;33.0s;34.5s;36.0s;37.5s;39.0s;40.5s;42.0s;43.5s;45.0s;46.5s;48.0s;49.5s;51.0s;52.5s;54.0s;55.5s;57.0s;58.5s;60.0s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="1.5s;3.0s;4.5s;6.0s;7.5s;9.0s;10.5s;12.0s;13.5s;15.0s;16.5s;18.0s;19.5s;21.0s;22.5s;24.0s;25.5s;27.0s;28.5s;30.0s;31.5s;33.0s;34.5s;36.0s;37.5s;39.0s;40.5s;42.0s;43.5s;45.0s;46.5s;48.0s;49.5s;51.0s;52.5s;54.0s;55.5s;57.0s;58.5s;60.0s"/>
                    </circle>
                  </g>

                  {/* left-mid - pulse arrives at 1.8s, then repeats every 1.8s */}
                  <g>
                    <circle cx="10" cy="50" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#B066FF;#52525b" dur="0.5s" begin="1.8s;3.6s;5.4s;7.2s;9.0s;10.8s;12.6s;14.4s;16.2s;18.0s;19.8s;21.6s;23.4s;25.2s;27.0s;28.8s;30.6s;32.4s;34.2s;36.0s;37.8s;39.6s;41.4s;43.2s;45.0s;46.8s;48.6s;50.4s;52.2s;54.0s;55.8s;57.6s;59.4s" />
                    </circle>
                    <circle cx="10" cy="50" r="2.6" fill="none" stroke="#B066FF" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="1.8s;3.6s;5.4s;7.2s;9.0s;10.8s;12.6s;14.4s;16.2s;18.0s;19.8s;21.6s;23.4s;25.2s;27.0s;28.8s;30.6s;32.4s;34.2s;36.0s;37.8s;39.6s;41.4s;43.2s;45.0s;46.8s;48.6s;50.4s;52.2s;54.0s;55.8s;57.6s;59.4s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="1.8s;3.6s;5.4s;7.2s;9.0s;10.8s;12.6s;14.4s;16.2s;18.0s;19.8s;21.6s;23.4s;25.2s;27.0s;28.8s;30.6s;32.4s;34.2s;36.0s;37.8s;39.6s;41.4s;43.2s;45.0s;46.8s;48.6s;50.4s;52.2s;54.0s;55.8s;57.6s;59.4s"/>
                    </circle>
                  </g>

                  {/* right-mid - pulse arrives at 2.1s, then repeats every 2.1s */}
                  <g>
                    <circle cx="90" cy="50" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#B066FF;#52525b" dur="0.5s" begin="2.1s;4.2s;6.3s;8.4s;10.5s;12.6s;14.7s;16.8s;18.9s;21.0s;23.1s;25.2s;27.3s;29.4s;31.5s;33.6s;35.7s;37.8s;39.9s;42.0s;44.1s;46.2s;48.3s;50.4s;52.5s;54.6s;56.7s;58.8s" />
                    </circle>
                    <circle cx="90" cy="50" r="2.6" fill="none" stroke="#B066FF" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="2.1s;4.2s;6.3s;8.4s;10.5s;12.6s;14.7s;16.8s;18.9s;21.0s;23.1s;25.2s;27.3s;29.4s;31.5s;33.6s;35.7s;37.8s;39.9s;42.0s;44.1s;46.2s;48.3s;50.4s;52.5s;54.6s;56.7s;58.8s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="2.1s;4.2s;6.3s;8.4s;10.5s;6.3s;8.4s;10.5s;12.6s;14.7s;16.8s;18.9s;21.0s;23.1s;25.2s;27.3s;29.4s;31.5s;33.6s;35.7s;37.8s;39.9s;42.0s;44.1s;46.2s;48.3s;50.4s;52.5s;54.6s;56.7s;58.8s"/>
                    </circle>
                  </g>

                  {/* bottom-left - pulse arrives at 2.4s, then repeats every 2.4s */}
                  <g>
                    <circle cx="30" cy="85" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#a855f7;#52525b" dur="0.5s" begin="2.4s;4.8s;7.2s;9.6s;12.0s;14.4s;16.8s;19.2s;21.6s;24.0s;26.4s;28.8s;31.2s;33.6s;36.0s;38.4s;40.8s;43.2s;45.6s;48.0s;50.4s;52.8s;55.2s;57.6s;60.0s" />
                    </circle>
                    <circle cx="30" cy="85" r="2.6" fill="none" stroke="#a855f7" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="2.4s;4.8s;7.2s;9.6s;12.0s;14.4s;16.8s;19.2s;21.6s;24.0s;26.4s;28.8s;31.2s;33.6s;36.0s;38.4s;40.8s;43.2s;45.6s;48.0s;50.4s;52.8s;55.2s;57.6s;60.0s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="2.4s;4.8s;7.2s;9.6s;12.0s;14.4s;16.8s;19.2s;21.6s;24.0s;26.4s;28.8s;31.2s;33.6s;36.0s;38.4s;40.8s;43.2s;45.6s;48.0s;50.4s;52.8s;55.2s;57.6s;60.0s"/>
                    </circle>
                  </g>

                  {/* bottom - pulse arrives at 2.7s, then repeats every 2.7s */}
                  <g>
                    <circle cx="50" cy="90" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#a855f7;#52525b" dur="0.5s" begin="2.7s;5.4s;8.1s;10.8s;13.5s;16.2s;18.9s;21.6s;24.3s;27.0s;29.7s;32.4s;35.1s;37.8s;40.5s;43.2s;45.9s;48.6s;51.3s;54.0s;56.7s;59.4s" />
                    </circle>
                    <circle cx="50" cy="90" r="2.6" fill="none" stroke="#a855f7" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="2.7s;5.4s;8.1s;10.8s;13.5s;16.2s;18.9s;21.6s;24.3s;27.0s;29.7s;32.4s;35.1s;37.8s;40.5s;43.2s;45.9s;48.6s;51.3s;54.0s;56.7s;59.4s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="2.7s;5.4s;8.1s;10.8s;13.5s;16.2s;18.9s;21.6s;24.3s;27.0s;29.7s;32.4s;35.1s;37.8s;40.5s;43.2s;45.9s;48.6s;51.3s;54.0s;56.7s;59.4s"/>
                    </circle>
                  </g>

                  {/* bottom-right - pulse arrives at 3.0s, then repeats every 3.0s */}
                  <g>
                    <circle cx="70" cy="85" r="2.6" fill="#52525b">
                      <animate attributeName="fill" values="#52525b;#a855f7;#52525b" dur="0.5s" begin="3.0s;6.0s;9.0s;12.0s;15.0s;18.0s;21.0s;24.0s;27.0s;30.0s;33.0s;36.0s;39.0s;42.0s;45.0s;48.0s;51.0s;54.0s;57.0s;60.0s" />
                    </circle>
                    <circle cx="70" cy="85" r="2.6" fill="none" stroke="#a855f7" strokeOpacity="0">
                      <animate attributeName="stroke-opacity" values="0;0.7;0" dur="0.5s" begin="3.0s;6.0s;9.0s;12.0s;15.0s;18.0s;21.0s;24.0s;27.0s;30.0s;33.0s;36.0s;39.0s;42.0s;45.0s;48.0s;51.0s;54.0s;57.0s;60.0s"/>
                      <animate attributeName="r" values="2.6;4.4;2.6" dur="0.5s" begin="3.0s;6.0s;9.0s;12.0s;15.0s;18.0s;21.0s;24.0s;27.0s;30.0s;33.0s;36.0s;39.0s;42.0s;45.0s;48.0s;51.0s;54.0s;57.0s;60.0s"/>
                    </circle>
                  </g>
                </svg>
              </div>
            </div>

            {/* Product Explanation */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100">
                Unlock the Power of RavenPulse™
              </h3>
              <p className="text-lg text-zinc-300 leading-relaxed">
                RavenPulse™ is our proprietary real-time signal propagation technology that turns market noise into foresight. The moment a signal emerges — from earnings, macro data, or sentiment — RavenPulse™ tracks how it ripples across the entire market network. By capturing these cascading effects before they become obvious, RavenPulse™ uncovers opportunities traditional methods miss, giving you an edge where timing and insight matter most.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 font-medium" style={{ color: "#B066FF" }}>
                  <span>RavenPulse™ active</span>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#B066FF" }} />
                </div>
              </div>
            </div>
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

      {/* Login Modal */}
      {showLogin && <LoginForm />}
    </div>
  );
}