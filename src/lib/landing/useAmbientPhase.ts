"use client";

import { useEffect, useRef, useState } from "react";

// Shared ambient animation clock. The hero background, Fig. 0 sweep, and the
// blind-spot viz all read this same ~11s phase so they stay visually in sync —
// phase is derived purely from the wall clock, so independent rAF loops on each
// consumer produce identical values. Throttled to ~30fps.
const PERIOD_MS = 11000;
const FRAME_MS = 33;

export function useAmbientPhase(): number {
  const [phase, setPhase] = useState(0);
  const last = useRef(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      if (now - last.current >= FRAME_MS) {
        last.current = now;
        setPhase((now / PERIOD_MS) % 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return phase;
}
