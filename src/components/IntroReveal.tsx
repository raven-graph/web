"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const IntroReveal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Allow animation to complete before unmounting
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ clipPath: "inset(0 0 0 0)" }}
              animate={{ clipPath: "inset(100% 0 0 0)" }}
              transition={{
                duration: 1.2,
                ease: [0.77, 0, 0.175, 1],
                delay: i * 0.05,
              }}
              className="h-full w-full bg-[#0B0C15] relative border-r border-white/5 last:border-r-0"
            >
              {/* Optional inner gradient for texture during reveal */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#B066FF]/10" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

