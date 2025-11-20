"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NODE_COUNT = 40;
const CANVAS_SIZE = { width: 1200, height: 720 };
const MOVE_RANGE = 0.08;
const MOVE_DURATION = 12;

type Node = {
  id: number;
  x: number;
  y: number;
  r: number;
};

type Edge = {
  source: number;
  target: number;
  opacity: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export function GeometricParticleField({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Initialize nodes deterministically for SSR matching if needed, but client-side random is fine for this visual
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Initial Setup
  useEffect(() => {
    const initialNodes = Array.from({ length: NODE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * CANVAS_SIZE.width,
      y: Math.random() * CANVAS_SIZE.height,
      r: Math.random() * 4 + 2,
    }));
    setNodes(initialNodes);
  }, []);

  // Continuous Movement
  useEffect(() => {
    if (shouldReduceMotion || nodes.length === 0) return;

    const updatePositions = () => {
      setNodes(prevNodes => prevNodes.map(node => {
        const dx = randomRange(-MOVE_RANGE, MOVE_RANGE) * CANVAS_SIZE.width;
        const dy = randomRange(-MOVE_RANGE, MOVE_RANGE) * CANVAS_SIZE.height;
        return {
          ...node,
          x: clamp(node.x + dx, 0, CANVAS_SIZE.width),
          y: clamp(node.y + dy, 0, CANVAS_SIZE.height),
        };
      }));
    };

    const interval = setInterval(updatePositions, MOVE_DURATION * 1000); // Long interval for smooth CSS transitions
    // Initial tiny kick to start motion
    const timeout = setTimeout(updatePositions, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [shouldReduceMotion, nodes.length]); // Depend on nodes.length to start after initial render

  // Recompute edges whenever nodes move
  useEffect(() => {
    const newEdges: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          newEdges.push({ source: i, target: j, opacity: 1 - dist / 300 });
        }
      }
    }
    setEdges(newEdges);
  }, [nodes]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C15] via-[#151725] to-[#0B0C15]" />
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_0%,rgba(176,102,255,0.25),transparent_70%)]" />

      <svg
        viewBox={`0 0 ${CANVAS_SIZE.width} ${CANVAS_SIZE.height}`}
        className="absolute inset-0 w-full h-full opacity-70"
        preserveAspectRatio="xMidYMid slice"
      >
        {edges.map((edge) => {
          const s = nodes[edge.source];
          const t = nodes[edge.target];
          if (!s || !t) return null;
          return (
            <motion.line
              key={`${edge.source}-${edge.target}`}
              animate={{
                x1: s.x,
                y1: s.y,
                x2: t.x,
                y2: t.y,
                strokeOpacity: edge.opacity
              }}
              transition={{ duration: MOVE_DURATION, ease: "linear" }}
              stroke="rgba(176,102,255,0.6)" // Increased brightness
              strokeWidth="1" // Slightly thicker
            />
          );
        })}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            animate={{
              cx: node.x,
              cy: node.y,
            }}
            transition={{ duration: MOVE_DURATION, ease: "linear" }}
            r={node.r}
            fill="#D8B4FE" // Lighter purple for visibility
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  );
}
