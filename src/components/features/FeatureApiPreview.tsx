"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Token = {
  text: string;
  color: string;
};

type CodeLine =
  | { type: 'comment'; content: string }
  | { type: 'code'; content: Token[] }
  | { type: 'output'; content: string };

const REQUEST_LINES: CodeLine[] = [
  { type: "code", content: [
    { text: "curl", color: "text-[#B066FF]" }, // Purple accent
    { text: " https://api.ravengraph.com/v1/signals/live \\", color: "text-zinc-400" }
  ]},
  { type: "code", content: [
    { text: "  -H ", color: "text-[#B066FF]" },
    { text: "'Authorization: Bearer sk_live_...'", color: "text-zinc-400" },
    { text: " \\", color: "text-zinc-500" }
  ]},
  { type: "code", content: [
    { text: "  -d ", color: "text-[#B066FF]" },
    { text: "'{ \"sector\": \"SEMICONDUCTORS\", \"depth\": 2 }'", color: "text-zinc-400" }
  ]}
];

const RESPONSE_LINES: CodeLine[] = [
  { type: "output", content: "{" },
  { type: "output", content: "  \"id\": \"sig_99283_lx\"," },
  { type: "output", content: "  \"timestamp\": \"2025-11-19T14:32:01Z\"," },
  { type: "output", content: "  \"regime\": \"volatility_expansion\"," },
  { type: "output", content: "  \"propagation_risk\": 0.87," },
  { type: "output", content: "  \"affected_nodes\": [" },
  { type: "output", content: "    { \"ticker\": \"NVDA\", \"lag\": \"0ms\" }," },
  { type: "output", content: "    { \"ticker\": \"AMD\", \"lag\": \"+42ms\" }," },
  { type: "output", content: "    { \"ticker\": \"TSM\", \"lag\": \"+110ms\" }" },
  { type: "output", content: "  ]" },
  { type: "output", content: "}" },
];

export function FeatureApiPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C15] p-0 shadow-2xl shadow-purple-900/10 ${className}`}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#151725]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">api_stream.json</div>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>

      <div className="p-6 font-mono text-xs md:text-[13px] leading-relaxed overflow-x-auto">
        
        {/* Request Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-1.5 py-0.5 rounded bg-[#B066FF]/10 text-[#B066FF] text-[10px] font-bold uppercase tracking-wider">POST</div>
            <div className="text-zinc-600 text-[10px] uppercase tracking-wider">Request Payload</div>
          </div>
          <div className="space-y-1 pl-1">
            {REQUEST_LINES.map((line, idx) => (
              <div key={`req-${idx}`} className="flex whitespace-pre">
                {line.type === 'code' && (
                  <span>
                    {line.content.map((token, i) => (
                      <span key={i} className={token.color}>{token.text}</span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Response Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              200 OK
            </div>
            <div className="text-zinc-600 text-[10px] uppercase tracking-wider">Real-time Stream</div>
          </div>
          <div className="space-y-1 border-l-2 border-white/10 pl-4">
            {RESPONSE_LINES.map((line, idx) => (
              <motion.div 
                key={`res-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 + idx * 0.05 }}
                className="text-zinc-300 whitespace-pre"
              >
                {line.content}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
