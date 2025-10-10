"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const REQUEST = {
  method: "GET",
  path: "/v1/signals/market-structure",
  query: "?universe=global-alpha",
};

const RESPONSE_LINES = [
  "{",
  '  "as_of": "2025-10-10T14:30:00Z",',
  '  "summary": "Cross-sector propagation detected",',
  '  "clusters": [',
  '   {"name": "Growth–AI", "strength": 0.84, "momentum": "rising" },',
  '   {"name": "Energy–Commodities", "strength": 0.42, "momentum": "fading"}',
  "  ],",
  '  "signals": [',
  '   {"ticker": "NVDA", "score": 0.82, "regime": "growth"},',
  '   {"ticker": "QQQ", "score": 0.68, "influence": ["NVDA", "META"]}',
  "  ]",
  "}",
] as const;

const TOKEN_CLASS_MAP: Record<string, string> = {
  plain: "text-zinc-500/70",
  key: "text-[#B066FF]",
  string: "text-zinc-100",
  number: "text-emerald-300",
  punct: "text-zinc-500/70",
};

function tokenizeJsonLine(line: string) {
  const tokens: Array<{ type: keyof typeof TOKEN_CLASS_MAP; value: string }> = [];
  const regex = /(".*?"|\b\d+(?:\.\d+)?\b|[{}[\],:])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', value: line.slice(lastIndex, match.index) });
    }

    const token = match[0];
    let type: keyof typeof TOKEN_CLASS_MAP = 'punct';

    if (token.startsWith('"')) {
      const nextChar = line[regex.lastIndex] ?? '';
      type = nextChar === ':' ? 'key' : 'string';
    } else if (/^\d/.test(token)) {
      type = 'number';
    }

    tokens.push({ type, value: token });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ type: 'plain', value: line.slice(lastIndex) });
  }

  return tokens;
}


export function FeatureApiPreview({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950/65 via-zinc-900/50 to-zinc-950/60 p-7 shadow-[0_30px_80px_-45px_rgba(176,102,255,0.5)] ${className}`}
    >
      <div className="absolute inset-3 rounded-3xl border border-white/5 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 grid gap-5">
        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-zinc-100">
            <span>Request</span>
            <span className="rounded-full bg-white/5 px-8 py-0.5 font-semibold text-[10px] uppercase text-zinc-300">
              curl
            </span>
          </div>

          <div className="font-mono text-[11px] text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[rgba(176,102,255,0.25)] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgba(176,102,255,0.9)]">
                {REQUEST.method}
              </span>
              <span className="text-zinc-100">{`${REQUEST.path}${REQUEST.query}`}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-zinc-100">
            <span>Response</span>
            <span className="rounded-full bg-white/5 px-8 py-0.5 font-semibold text-[10px] uppercase text-zinc-300">
              200 OK
            </span>
          </div>

          <div className="relative rounded-2xl border border-white/5 bg-black/50 p-4 font-mono text-[11px] text-zinc-200">
            {/* <div className="absolute left-4 top-4 flex gap-1 text-[rgba(176,102,255,0.45)]">
              <span className="inline-block h-2 w-2 rounded-full bg-[rgba(176,102,255,0.6)]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[rgba(255,255,255,0.45)]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[rgba(255,255,255,0.25)]" />
            </div> */}
            <div className="space-y-1 text-left whitespace-pre -ml-4">
              {RESPONSE_LINES.map((line, index) => {
                const tokens = tokenizeJsonLine(line);
                return (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={shouldReduceMotion ? undefined : { delay: 0.2 + index * 0.05, duration: 0.25, ease: 'easeOut' }}
                  >
                    {tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={TOKEN_CLASS_MAP[token.type]}>
                        {token.value}
                      </span>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
