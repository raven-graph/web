"use client";

import React, { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check, Cpu, Code2 } from "lucide-react";

export const CodeDemoSection = () => {
    const [activeTab, setActiveTab] = useState<"cpp" | "python">("cpp");
    const [step, setStep] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const copyCode = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 bg-[#0B0C15] border-y border-white/5 relative overflow-hidden">
            {/* Background Grids */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Context Side */}
                    <ScrollReveal className="space-y-8 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-[#B066FF]/50"></span>
                            <span className="text-[#B066FF] font-sans text-xs uppercase tracking-widest font-semibold">Production Ready</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                            Built for <br />
                            <span className="text-zinc-500">Low Latency</span>
                        </h2>
                        <p className="text-lg text-zinc-400 leading-relaxed font-light">
                            Whether you are backtesting strategies in Python or executing live in C++, RavenGraph provides standardized, low-latency access to the global graph structure.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#B066FF]/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#B066FF]/10 flex items-center justify-center text-[#B066FF]">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">C++ gRPC Client</div>
                                    <div className="text-sm text-zinc-500">Sub-millisecond signal retrieval for HFT systems</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#B066FF]/30 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#B066FF]/10 flex items-center justify-center text-[#B066FF]">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">Python Research SDK</div>
                                    <div className="text-sm text-zinc-500">Seemless integration with pandas and PyTorch</div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Code Visual */}
                    <ScrollReveal delay={0.2}>
                        {/* Language Tabs */}
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab("cpp")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "cpp" ? "bg-[#B066FF] text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}
                            >
                                C++ (Production)
                            </button>
                            <button
                                onClick={() => setActiveTab("python")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "python" ? "bg-[#B066FF] text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}
                            >
                                Python (Research)
                            </button>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#0F111A] shadow-2xl overflow-hidden font-mono text-sm relative group">

                            {/* Window Controls */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-zinc-500 text-xs text-center absolute left-0 right-0 pointer-events-none">
                                    {activeTab === "cpp" ? "execution_engine.cpp" : "strategy_backtest.py"}
                                </div>
                                <button onClick={copyCode} className="text-zinc-500 hover:text-white transition-colors">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 overflow-x-auto min-h-[300px]">
                                {activeTab === "python" ? (
                                    <div className="space-y-1">
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">1</span><span className="text-[#B066FF]">import</span> <span className="text-white ml-2">ravengraph</span> <span className="text-[#B066FF] ml-2">as</span> <span className="text-white ml-2">rg</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">2</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">3</span><span className="text-zinc-500">{"# streaming realtime signals"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">4</span><span className="text-white">client</span> <span className="text-zinc-400">=</span> <span className="text-white">rg.Client(</span><span className="text-green-400">&quot;api_key_...&quot;</span><span className="text-white">)</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">5</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">6</span><span className="text-[#B066FF]">for</span> <span className="text-white ml-2">signal</span> <span className="text-[#B066FF] ml-2">in</span> <span className="text-white ml-2">client.stream_signals():</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">7</span><span className="text-white ml-4">if signal.is_shock_event():</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">8</span><span className="text-white ml-8">print(signal.propagation_path)</span></div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">1</span><span className="text-[#B066FF]">#include</span> <span className="text-green-400">&lt;ravengraph/client.h&gt;</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">2</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">3</span><span className="text-zinc-500">{"// Initialize gRPC channel"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">4</span><span className="text-blue-400">auto</span> <span className="text-white">channel = grpc::CreateChannel(</span><span className="text-green-400">&quot;api.ravengraph.com&quot;</span><span className="text-white">);</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">5</span><span className="text-blue-400">auto</span> <span className="text-white">stub = RavenGraph::NewStub(channel);</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">6</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">7</span><span className="text-zinc-500">{"// High-frequency signal loop"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">8</span><span className="text-[#B066FF]">while</span> <span className="text-white">(stream-&gt;Read(&signal)) {"{"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">9</span><span className="text-white ml-4">if (signal.confidence() &gt; </span><span className="text-orange-400">0.95</span><span className="text-white">) {"{"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">10</span><span className="text-white ml-8">Execution::SubmitOrder(signal.asset_id());</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">11</span><span className="text-white ml-4">{"}"}</span></div>
                                        <div className="flex"><span className="text-zinc-600 w-8 select-none">12</span><span className="text-white">{"}"}</span></div>
                                    </div>
                                )}
                            </div>

                            {/* Terminal Output Simulation */}
                            <div className="border-t border-white/10 bg-black/50 p-4 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-2 text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
                                    <Terminal className="w-3 h-3" /> System Output
                                </div>
                                <div className="space-y-2">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={step}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="font-mono"
                                        >
                                            {step === 0 && (
                                                <div className="text-zinc-400">Initializing secure connection...</div>
                                            )}
                                            {step >= 1 && (
                                                <div className="text-green-400">
                                                    [OK] gRPC Channel Established (3ms)
                                                </div>
                                            )}
                                            {step >= 2 && (
                                                <div className="mt-1">
                                                    <span className="text-blue-400">[STREAM] 10,402 edges/sec </span>
                                                </div>
                                            )}
                                            {step >= 3 && (
                                                <div className="mt-1 pl-4 border-l border-zinc-700">
                                                    <div className="text-zinc-400">Propagation Signal</div>
                                                    <div className="text-[#B066FF]">&gt; BUY 200 NVDA (Confidence 0.98)</div>
                                                    <div className="text-zinc-600 text-[10px]">Lat: 1.2ms | Id: 0x8F2A</div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    );
};
