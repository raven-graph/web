"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0.01, // Avoid absolute 0 as per request 
        y: 30, 
        filter: "blur(10px)" 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)" 
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.2, 0.65, 0.3, 0.9], // Custom easing
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

