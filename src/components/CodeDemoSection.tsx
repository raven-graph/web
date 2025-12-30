"use client";

import React, { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Copy, Check, Calendar, Layers, Database } from "lucide-react";

export const CodeDemoSection = () => {
    const [activeTab, setActiveTab] = useState<"python" | "cpp">("python");
    const [copied, setCopied] = useState(false);

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
                    <ScrollReveal className="space-y-8 lg:sticky lg:top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-[#B066FF]/50"></span>
                            <span className="text-[#B066FF] font-sans text-xs uppercase tracking-widest font-semibold">Research Integration</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                            Built for <br />
                            <span className="text-zinc-500">Feature Integration</span>
                        </h2>
                        <p className="text-lg text-zinc-400 leading-relaxed font-light">
                            Retrieve leakage-safe graph embeddings and join them directly into existing models.
                        </p>

                        <div className="space-y-8 mt-8">
                            {/* Bullet 1 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-[#B066FF]/10 flex items-center justify-center text-[#B066FF] shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-lg">Point-in-Time Embeddings</h4>
                                    <p className="text-zinc-500 leading-relaxed mt-1">
                                        Embeddings are generated as-of a specific timestamp and horizon. No future data. No normalization leakage.
                                    </p>
                                </div>
                            </div>

                            {/* Bullet 2 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-[#B066FF]/10 flex items-center justify-center text-[#B066FF] shrink-0">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-lg">Model-Agnostic</h4>
                                    <p className="text-zinc-500 leading-relaxed mt-1">
                                        Designed to plug into existing research pipelines (XGBoost, linear models, neural nets).
                                    </p>
                                </div>
                            </div>

                            {/* Bullet 3 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-10 h-10 rounded-full bg-[#B066FF]/10 flex items-center justify-center text-[#B066FF] shrink-0">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-lg">Offline First</h4>
                                    <p className="text-zinc-500 leading-relaxed mt-1">
                                        Evaluate via Parquet artifacts before any live integration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Code Visual */}
                    <ScrollReveal delay={0.2}>
                        {/* Language Tabs */}
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab("python")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "python" ? "bg-[#B066FF] text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}
                            >
                                Python (Research)
                            </button>
                            <button
                                onClick={() => setActiveTab("cpp")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "cpp" ? "bg-[#B066FF] text-white" : "bg-white/5 text-zinc-400 hover:text-white"}`}
                            >
                                C++ (Production)
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
                                    {activeTab === "python" ? "research_notebook.ipynb" : "production_loader.cpp"}
                                </div>
                                <button onClick={copyCode} className="text-zinc-500 hover:text-white transition-colors">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 overflow-y-auto" style={{ height: '380px' }}>
                                <div className="space-y-1 font-mono text-sm">
                                    {activeTab === "python" ? (
                                        <>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">1</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-[#B066FF]">from</span> <span className="text-white">ravengraph</span> <span className="text-[#B066FF]">import</span> <span className="text-white">Client</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">2</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-[#B066FF]">import</span> <span className="text-white">pandas</span> <span className="text-[#B066FF]">as</span> <span className="text-white">pd</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">3</span><div></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">4</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">rg</span> <span className="text-zinc-400">=</span> <span className="text-white">Client(api_key=API_KEY)</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">5</span><div></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">6</span><span className="text-zinc-500">{"# Point-in-time graph embeddings (leakage-safe)"}</span></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">7</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">embeddings</span> <span className="text-zinc-400">=</span> <span className="text-white">rg.embeddings.get(</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">8</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white pl-4">universe=</span><span className="text-green-400">&quot;dynamic_sp500&quot;</span><span className="text-white">,</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">9</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white pl-4">asof=</span><span className="text-green-400">&quot;2024-11-15&quot;</span><span className="text-white">,</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">10</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white pl-4">horizon=</span><span className="text-green-400">&quot;1d&quot;</span><span className="text-white">,</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">11</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white pl-4">dims=</span><span className="text-orange-400">64</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">12</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">)</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">13</span><div></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">14</span><span className="text-zinc-500">{"# Join with existing feature matrix"}</span></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">15</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">X</span> <span className="text-zinc-400">=</span> <span className="text-white">price_features.join(embeddings, on=</span><span className="text-green-400">&quot;ticker&quot;</span><span className="text-white">)</span></div></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">1</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-[#B066FF]">EmbeddingsRequest</span> <span className="text-white">req;</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">2</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">req.set_universe(</span><span className="text-green-400">&quot;dynamic_sp500&quot;</span><span className="text-white">);</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">3</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">req.set_asof(</span><span className="text-green-400">&quot;2024-11-15&quot;</span><span className="text-white">);</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">4</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">req.set_horizon(</span><span className="text-green-400">&quot;1d&quot;</span><span className="text-white">);</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">5</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-white">req.set_dims(</span><span className="text-orange-400">64</span><span className="text-white">);</span></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">6</span><div></div></div>
                                            <div className="grid grid-cols-[2rem_1fr]"><span className="text-zinc-600 select-none">7</span><div className="text-zinc-100 whitespace-pre-wrap break-words"><span className="text-blue-400">auto</span> <span className="text-white">embeddings = client.GetEmbeddings(req);</span></div></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Micro-copy */}
                            <div className="border-t border-white/10 bg-black/50 p-4 text-center">
                                <p className="text-zinc-400 text-xs font-medium">
                                    Private Preview · Offline Evaluation · Parquet + Schema Included
                                </p>
                                <p className="text-zinc-600 text-[10px] mt-1">
                                    Embeddings updated daily and intraday depending on horizon.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    );
};
