"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type { ViewType, PropagationResult } from "@/lib/graph/types";
import {
  nodes,
  edges,
  clusters,
  signals,
  positions,
  dalPosition,
  getNodeColor,
  formatMarketCap,
  CLUSTER_COLORS,
} from "@/lib/graph/data";

// ─── Types ──────────────────────────────────────────────────────────

interface SimNode extends SimulationNodeDatum {
  id: string;
  cluster_id: string | null;
  market_cap: number | null;
  type: string;
  ticker: string;
  name: string;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  id: string;
  weight: number;
  direction: "positive" | "negative";
  lag_minutes: number;
  sourceId: string;
  targetId: string;
}

interface GraphCanvasProps {
  view: ViewType;
  selectedNodeId: string | null;
  selectedClusterId: string | null;
  selectedSignalId: string | null;
  selectedPositionTicker: string | null;
  propagationState: "idle" | "running" | "complete";
  propagationProgress: number;
  propagationResult: PropagationResult | null;
  onNodeClick: (nodeId: string | null) => void;
  onCanvasClick: () => void;
}

// ─── PRIMARY propagation path ───────────────────────────────────────
const PRIMARY_HOP_NUMBERS = new Set([1, 2, 3]);

// ─── Node radius (log scale, wide dynamic range §3) ────────────────
function nodeRadius(node: SimNode): number {
  if (node.type === "macro") return 14;
  if (!node.market_cap) return 8;
  const logCap = Math.log10(node.market_cap);
  return Math.max(6, Math.min(32, 6 + (logCap - 9.9) * 9.5));
}

// ─── Cluster center targets ─────────────────────────────────────────
function getClusterCenter(clusterId: string): { x: number; y: number } {
  const angleMap: Record<string, number> = {
    cluster_semis: -0.3,
    cluster_megacap: Math.PI * 0.28,
    cluster_financials: Math.PI * 0.62,
    cluster_energy: Math.PI * 1.0,
    cluster_airlines: Math.PI * 1.32,
    cluster_industrials: Math.PI * 1.58,
    cluster_utilities: Math.PI * 1.85,
  };
  const angle = angleMap[clusterId] ?? 0;
  return { x: Math.cos(angle) * 160, y: Math.sin(angle) * 160 };
}

// ═════════════════════════════════════════════════════════════════════

export function GraphCanvas({
  view, selectedNodeId, selectedClusterId, selectedSignalId,
  selectedPositionTicker, propagationState, propagationProgress,
  propagationResult, onNodeClick, onCanvasClick,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const basePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const cameraRef = useRef({ x: 0, y: 0, scale: 0.85 });
  const hoveredNodeRef = useRef<string | null>(null);
  const hoverStartRef = useRef<number>(0);
  const [, setRenderTrigger] = useState(0);
  const isDraggingRef = useRef(false);
  const mouseDownPosRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const cameraTargetRef = useRef({ x: 0, y: 0, scale: 0.85 });

  // ── Force simulation (§1) ───────────────────────────────────────
  useEffect(() => {
    let seed = 42;
    function srand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    const clusterSets = new Map<string, Set<string>>();
    clusters.forEach((c) => clusterSets.set(c.id, new Set(c.node_ids)));

    // Nodes that should sit in the center of the graph, not the outer perimeter
    const centerNodeIds = new Set(["BTC", "DXY", "GOLD", "GDX", "CNPMI", "WTI_CRUDE"]);
    const macroIds = nodes.filter((n) => !n.cluster_id).map((n) => n.id);
    const peripheryMacroIds = macroIds.filter((id) => !centerNodeIds.has(id));

    const simNodes: SimNode[] = nodes.map((n) => {
      let ix = (srand() - 0.5) * 40;
      let iy = (srand() - 0.5) * 40;
      if (n.cluster_id) {
        const cc = getClusterCenter(n.cluster_id);
        ix += cc.x; iy += cc.y;
      } else if (centerNodeIds.has(n.id)) {
        // Center nodes: start near origin with small jitter
        ix = (srand() - 0.5) * 60;
        iy = (srand() - 0.5) * 60;
      } else {
        const idx = peripheryMacroIds.indexOf(n.id);
        const angle = (idx / peripheryMacroIds.length) * Math.PI * 2 - Math.PI / 4;
        ix = Math.cos(angle) * 300 + (srand() - 0.5) * 15;
        iy = Math.sin(angle) * 300 + (srand() - 0.5) * 15;
      }
      return { ...n, x: ix, y: iy };
    });

    const nodeMap = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks: SimLink[] = edges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({
        id: e.id, source: nodeMap.get(e.source)!, target: nodeMap.get(e.target)!,
        weight: e.weight, direction: e.direction, lag_minutes: e.lag_minutes,
        sourceId: e.source, targetId: e.target,
      }));

    simNodesRef.current = simNodes;
    simLinksRef.current = simLinks;

    function isIntraCluster(a: string, b: string) {
      for (const [, members] of clusterSets) {
        if (members.has(a) && members.has(b)) return true;
      }
      return false;
    }

    function clusterForce(alpha: number) {
      for (const node of simNodes) {
        if (node.cluster_id) {
          const cc = getClusterCenter(node.cluster_id);
          node.vx = (node.vx || 0) + (cc.x - (node.x || 0)) * alpha * 0.22;
          node.vy = (node.vy || 0) + (cc.y - (node.y || 0)) * alpha * 0.22;
        } else if (!centerNodeIds.has(node.id)) {
          // Push periphery macro nodes outward — skip center nodes
          const cx = node.x || 0, cy = node.y || 0;
          const dist = Math.sqrt(cx * cx + cy * cy);
          if (dist < 250) {
            const a = Math.atan2(cy, cx) || 0;
            const push = (250 - dist) * alpha * 0.15;
            node.vx = (node.vx || 0) + Math.cos(a) * push;
            node.vy = (node.vy || 0) + Math.sin(a) * push;
          }
        }
      }
    }

    const sim = forceSimulation<SimNode>(simNodes)
      .force("link", forceLink<SimNode, SimLink>(simLinks).id((d) => d.id)
        .distance((d) => isIntraCluster(d.sourceId, d.targetId) ? 35 : 80)
        .strength((d) => isIntraCluster(d.sourceId, d.targetId) ? d.weight * 0.6 : d.weight * 0.15))
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(0, 0).strength(0.03))
      .force("collision", forceCollide<SimNode>().radius((d) => nodeRadius(d) + 3).strength(0.7))
      .force("clusterX", forceX<SimNode>().x((d) => d.cluster_id ? getClusterCenter(d.cluster_id).x : 0).strength((d) => d.cluster_id ? 0.1 : centerNodeIds.has(d.id) ? 0.08 : 0.01))
      .force("clusterY", forceY<SimNode>().y((d) => d.cluster_id ? getClusterCenter(d.cluster_id).y : 0).strength((d) => d.cluster_id ? 0.1 : centerNodeIds.has(d.id) ? 0.08 : 0.01))
      .alphaDecay(0.015).velocityDecay(0.35);

    sim.on("tick", () => clusterForce(sim.alpha()));
    for (let i = 0; i < 400; i++) sim.tick();
    sim.stop();

    const base = new Map<string, { x: number; y: number }>();
    simNodes.forEach((n) => base.set(n.id, { x: n.x || 0, y: n.y || 0 }));
    basePositionsRef.current = base;

    return () => { sim.stop(); };
  }, []);

  // ── Reset camera when switching views ──────────────────────────
  useEffect(() => {
    const defaultCam = { x: 0, y: 0, scale: 0.85 };
    cameraRef.current = { ...defaultCam };
    cameraTargetRef.current = { ...defaultCam };
  }, [view]);

  // ── §8b: Cluster click zoom — compute camera target ────────────
  useEffect(() => {
    if (view !== "topology") return;
    const simNodes = simNodesRef.current;
    if (!selectedClusterId) {
      cameraTargetRef.current = { x: 0, y: 0, scale: 0.85 };
      return;
    }
    const cluster = clusters.find((c) => c.id === selectedClusterId);
    if (!cluster) return;
    const cn = simNodes.filter((n) => cluster.node_ids.includes(n.id));
    if (cn.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    cn.forEach((n) => {
      if (n.x != null && n.y != null) {
        minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
      }
    });
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pad = 2.5;
    const bw = (maxX - minX) * pad || 300;
    const bh = (maxY - minY) * pad || 300;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rawScale = Math.min(rect.width / bw, rect.height / bh) * 0.6;
    const scale = Math.max(0.85, Math.min(rawScale, 1.6));
    cameraTargetRef.current = { x: -cx * scale, y: -cy * scale, scale };
  }, [selectedClusterId, view]);

  // ── Render loop ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    function resize() {
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function render() {
      if (!running || !ctx || !canvas || !container) return;
      timeRef.current += 0.016;
      const t = timeRef.current;
      const cam = cameraRef.current;
      // §8b: Smooth camera lerp toward target
      const ct = cameraTargetRef.current;
      const lerpSpeed = 0.08;
      if (!isDraggingRef.current) {
        cam.x += (ct.x - cam.x) * lerpSpeed;
        cam.y += (ct.y - cam.y) * lerpSpeed;
        cam.scale += (ct.scale - cam.scale) * lerpSpeed;
      }
      const rect = container.getBoundingClientRect();
      const w = rect.width, h = rect.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0B0C15";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2 + cam.x, h / 2 + cam.y);
      ctx.scale(cam.scale, cam.scale);

      const simNodes = simNodesRef.current;
      const simLinks = simLinksRef.current;
      const hovered = hoveredNodeRef.current;

      // ── Pre-compute view data ──

      const signalPathEdges = new Set<string>();
      const signalPathNodes = new Set<string>();
      let sigTargetTicker: string | null = null;
      let sigDirection: string | null = null;
      if (view === "signals" && selectedSignalId) {
        const sig = signals.find((s) => s.id === selectedSignalId);
        if (sig) {
          sigTargetTicker = sig.ticker;
          sigDirection = sig.direction;
          sig.transmission_path.forEach((hop) => {
            signalPathNodes.add(hop.source_id);
            signalPathNodes.add(hop.target_id);
            signalPathEdges.add(`${hop.source_id}->${hop.target_id}`);
          });
        }
      }

      const allPos = [...positions, dalPosition];
      const portTickers = new Set(allPos.map((p) => p.ticker));
      const portMap = new Map(allPos.map((p) => [p.ticker, p]));
      const portClusters = new Set(allPos.map((p) => p.cluster_id));

      const maxLag = propagationResult?.max_propagation_time || 8;
      const propEdges = new Map<string, { progress: number; dir: "positive" | "negative"; primary: boolean }>();
      const propNodes = new Map<string, { val: number; arrNorm: number; primary: boolean }>();
      const propActive = propagationState !== "idle";

      if (propActive && propagationResult) {
        propagationResult.hops.forEach((hop) => {
          const key = `${hop.source_id}->${hop.target_id}`;
          const arrNorm = hop.cumulative_lag / maxLag;
          const startNorm = (hop.cumulative_lag - hop.lag_minutes) / maxLag;
          const primary = PRIMARY_HOP_NUMBERS.has(hop.hop_number);
          if (propagationProgress >= startNorm) {
            const prog = Math.min(1, (propagationProgress - startNorm) / (arrNorm - startNorm + 0.001));
            propEdges.set(key, { progress: prog, dir: hop.direction, primary });
          }
          if (propagationProgress >= arrNorm) {
            propNodes.set(hop.target_id, { val: hop.output_value, arrNorm, primary });
          }
        });
        propNodes.set(propagationResult.shock.source_node_id, { val: propagationResult.shock.magnitude_numeric, arrNorm: 0, primary: true });
      }

      const selNodeEdges = new Set<string>();
      const selNodeNeighbors = new Set<string>();
      const hovEdges = new Set<string>();
      const hovNodeNeighbors = new Set<string>();
      const selClusterNodes = new Set<string>();
      if (selectedNodeId) simLinks.forEach((l) => {
        if (l.sourceId === selectedNodeId || l.targetId === selectedNodeId) {
          selNodeEdges.add(l.id);
          selNodeNeighbors.add(l.sourceId === selectedNodeId ? l.targetId : l.sourceId);
        }
      });
      if (hovered && !selectedNodeId) simLinks.forEach((l) => {
        if (l.sourceId === hovered || l.targetId === hovered) {
          hovEdges.add(l.id);
          hovNodeNeighbors.add(l.sourceId === hovered ? l.targetId : l.sourceId);
        }
      });
      if (selectedClusterId) { const cl = clusters.find((c) => c.id === selectedClusterId); if (cl) cl.node_ids.forEach((id) => selClusterNodes.add(id)); }

      // ── Cluster hulls ──
      if (view === "topology" || view === "portfolio" || view === "propagation" || view === "signals") {
        clusters.forEach((cluster) => {
          if (view === "portfolio" && !portClusters.has(cluster.id)) return;
          const cn = simNodes.filter((n) => cluster.node_ids.includes(n.id));
          if (cn.length < 3) return;
          const isSel = selectedClusterId === cluster.id;
          const dimmed = view === "topology" && selectedClusterId !== null && !isSel;
          const pts = cn.map((n) => ({ x: n.x || 0, y: n.y || 0 }));
          const hull = convexHull(pts);
          if (hull.length < 3) return;
          const cx2 = hull.reduce((s, p) => s + p.x, 0) / hull.length;
          const cy2 = hull.reduce((s, p) => s + p.y, 0) / hull.length;
          const exp = hull.map((p) => { const dx = p.x - cx2, dy = p.y - cy2, d = Math.sqrt(dx * dx + dy * dy) || 1; return { x: p.x + (dx / d) * 25, y: p.y + (dy / d) * 25 }; });
          ctx.beginPath();
          ctx.moveTo(exp[0].x, exp[0].y);
          for (let i = 1; i < exp.length; i++) ctx.lineTo(exp[i].x, exp[i].y);
          ctx.closePath();
          let hullFill: number, hullStroke: number;
          if (view === "propagation") {
            hullFill = 0.07; hullStroke = 0.10;
          } else if (view === "signals") {
            hullFill = 0.09; hullStroke = 0.12;
          } else {
            hullFill = isSel ? 0.08 : dimmed ? 0.02 : 0.045;
            hullStroke = isSel ? 0.30 : dimmed ? 0.04 : 0.18;
          }
          ctx.fillStyle = hexToRgba(cluster.color, hullFill);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(cluster.color, hullStroke);
          ctx.lineWidth = isSel ? 1.5 : 1;
          ctx.stroke();
        });
      }

      // ── Node-to-cluster lookup for edge coloring ──
      const nodeClusterMap = new Map<string, string>();
      simNodes.forEach((n) => { if (n.cluster_id) nodeClusterMap.set(n.id, n.cluster_id); });

      // ── Edges (§1a — visible, cluster-colored intra-cluster edges) ──
      simLinks.forEach((link) => {
        const src = link.source as SimNode, tgt = link.target as SimNode;
        if (!src.x || !src.y || !tgt.x || !tgt.y) return;

        const srcCluster = nodeClusterMap.get(link.sourceId);
        const tgtCluster = nodeClusterMap.get(link.targetId);
        const isIntra = srcCluster && tgtCluster && srcCluster === tgtCluster;

        // Topology base state: intra-cluster uses cluster color, cross-cluster uses gray
        let lw: number, alpha: number, color: string;
        if (isIntra) {
          color = CLUSTER_COLORS[srcCluster] || "#4A5568";
          lw = 1 + link.weight * 2.5;          // 1px at w=0, 3.5px at w=1
          alpha = 0.25 + link.weight * 0.10;    // 0.25–0.35
        } else {
          color = "#6B7A8D";
          lw = 0.8 + link.weight * 1.8;         // 0.8–2.6px — visible at all zoom levels
          alpha = 0.14 + link.weight * 0.18;     // 0.14 at low weight, up to 0.32 at high weight
        }

        if (view === "topology") {
          if (selectedClusterId) {
            const srcIn = selClusterNodes.has(link.sourceId);
            const tgtIn = selClusterNodes.has(link.targetId);
            if (srcIn && tgtIn) {
              // Intra-selected-cluster edge
              alpha = 0.5;
            } else if (srcIn || tgtIn) {
              // Edge connecting cluster to external node
              alpha = 0.3;
            } else {
              alpha = 0.025;
            }
          } else if (selectedNodeId) {
            if (selNodeEdges.has(link.id)) {
              alpha = 0.7;
              const nd = nodes.find((n) => n.id === selectedNodeId);
              if (nd) color = getNodeColor(nd);
              lw = Math.max(lw, 1 + link.weight * 3);
            } else {
              alpha = 0.05;
            }
          } else if (hovered) {
            if (hovEdges.has(link.id)) {
              alpha = 0.6;
              const nd = nodes.find((n) => n.id === hovered);
              if (nd) color = getNodeColor(nd);
              lw = Math.max(lw, 1 + link.weight * 3);
            } else {
              alpha = 0.03;
            }
          }
        }

        // §1c: Propagation edges — primary 5.5px/1.0, secondary 2.5px/0.55, bg 0.03
        if (view === "propagation") {
          const pe = propEdges.get(`${link.sourceId}->${link.targetId}`);
          if (pe) {
            color = pe.dir === "negative" ? "#EF4444" : "#3B82F6";
            lw = pe.primary ? 5.5 : 2.5;
            alpha = (pe.primary ? 1.0 : 0.55) * Math.min(1, pe.progress * 2);
            // Traveling pulse
            if (pe.progress > 0 && pe.progress < 1) {
              const px = src.x + (tgt.x - src.x) * pe.progress;
              const py = src.y + (tgt.y - src.y) * pe.progress;
              ctx.save();
              ctx.shadowColor = color; ctx.shadowBlur = pe.primary ? 22 : 12;
              ctx.beginPath(); ctx.arc(px, py, pe.primary ? 5 : 3, 0, Math.PI * 2);
              ctx.fillStyle = color; ctx.fill(); ctx.restore();
            }
            // Direction particles post-arrival
            if (pe.progress >= 1) {
              const dx = tgt.x - src.x, dy = tgt.y - src.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const count = Math.floor(len / 12);
              for (let i = 0; i < count; i++) {
                const tt = ((i / count + t * 0.4) % 1);
                ctx.beginPath(); ctx.arc(src.x + dx * tt, src.y + dy * tt, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(color, 0.35); ctx.fill();
              }
            }
          } else if (propActive) { alpha = 0.045; color = "#2A2E35"; }
        }

        // §1d: Signals path edges — same treatment as propagation primary
        if (view === "signals") {
          const key = `${link.sourceId}->${link.targetId}`;
          if (signalPathEdges.has(key)) {
            const sig = signals.find((s) => s.id === selectedSignalId);
            const hop = sig?.transmission_path.find((h) => h.source_id === link.sourceId && h.target_id === link.targetId);
            color = hop?.direction === "negative" ? "#EF4444" : "#3B82F6";
            alpha = 1.0; lw = 5;
            // Animated directional particles
            const dx = tgt.x - src.x, dy = tgt.y - src.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const count = Math.max(2, Math.floor(len / 14));
            for (let i = 0; i < count; i++) {
              const pp = ((i / count + t * 0.35) % 1);
              ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 8;
              ctx.beginPath(); ctx.arc(src.x + dx * pp, src.y + dy * pp, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = hexToRgba(color, 0.6); ctx.fill(); ctx.restore();
            }
          } else {
            alpha = selectedSignalId ? 0.055 : 0.1;
            color = selectedSignalId ? "#384050" : color;
          }
        }

        // §1e: Portfolio edges — non-portfolio at 0, same-cluster 0.25, diff-cluster 0.10
        if (view === "portfolio") {
          const srcPort = portTickers.has(link.sourceId);
          const tgtPort = portTickers.has(link.targetId);
          if (srcPort && tgtPort) {
            const sp = portMap.get(link.sourceId), tp = portMap.get(link.targetId);
            if (sp && tp && sp.cluster_id === tp.cluster_id) {
              alpha = 0.25;
              const cl = clusters.find((c) => c.id === sp.cluster_id);
              if (cl) color = cl.color;
              lw = 1.5 + link.weight * 2;
            } else {
              alpha = 0.10; color = "#4A5568";
              lw = 0.8 + link.weight * 1;
            }
          } else {
            alpha = 0; lw = 0;
          }
        }

        ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = hexToRgba(color, alpha); ctx.lineWidth = lw; ctx.stroke();
      });

      // Portfolio: extra dashed connecting lines between same-cluster positions
      if (view === "portfolio") {
        const pNodes = simNodes.filter((n) => portTickers.has(n.id));
        for (let i = 0; i < pNodes.length; i++) {
          for (let j = i + 1; j < pNodes.length; j++) {
            const a = pNodes[i], b = pNodes[j];
            const pa = portMap.get(a.id), pb = portMap.get(b.id);
            if (pa && pb && pa.cluster_id === pb.cluster_id && a.x && a.y && b.x && b.y) {
              const exists = simLinks.some((l) => (l.sourceId === a.id && l.targetId === b.id) || (l.sourceId === b.id && l.targetId === a.id));
              if (!exists) {
                const cl = clusters.find((c) => c.id === pa.cluster_id);
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = hexToRgba(cl?.color || "#4A5568", 0.15);
                ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
              }
            }
          }
        }
      }

      // Topology: ambient particles on strong edges
      if (view === "topology" && !selectedNodeId && !selectedClusterId && !hovered) {
        simLinks.forEach((link) => {
          const src = link.source as SimNode, tgt = link.target as SimNode;
          if (!src.x || !src.y || !tgt.x || !tgt.y || link.weight < 0.55) return;
          const pos = (t * (0.12 + link.weight * 0.08) + link.weight * 7) % 1;
          ctx.beginPath(); ctx.arc(src.x + (tgt.x - src.x) * pos, src.y + (tgt.y - src.y) * pos, 1, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba("#8896A7", 0.25); ctx.fill();
        });
      }

      // ── Nodes ──
      const labels: Array<{ text: string; x: number; y: number; nodeX: number; bold?: boolean; ringColor?: string }> = [];

      simNodes.forEach((node) => {
        if (!node.x || !node.y) return;
        const r = nodeRadius(node);
        const orig = nodes.find((n) => n.id === node.id)!;
        let color = getNodeColor(orig);
        let alpha = 1, glow = 0, dr = r;
        let showLabel = false, labelBold = false;
        let ringColor: string | undefined;
        const isMacro = node.type === "macro", isETF = node.type === "etf";

        // ── Topology (§1b — neighbor highlight, node dimming) ──
        if (view === "topology") {
          glow = 5;
          if (isMacro || isETF) showLabel = true;
          if (selectedClusterId) {
            if (selClusterNodes.has(node.id)) { alpha = 1; glow = 10; showLabel = true; }
            else { alpha = 0.10; glow = 0; }
          } else if (selectedNodeId) {
            if (node.id === selectedNodeId) { alpha = 1; glow = 18; showLabel = true; labelBold = true; }
            else if (selNodeNeighbors.has(node.id)) { alpha = 0.8; glow = 6; showLabel = true; }
            else { alpha = 0.2; glow = 0; }
          } else if (hovered) {
            if (node.id === hovered) { alpha = 1; glow = 16; showLabel = true; dr *= 1.15; }
            else if (hovNodeNeighbors.has(node.id)) { alpha = 0.7; glow = 4; showLabel = true; }
            else { alpha = 0.1; glow = 0; }
          }
        }

        // ── Propagation (§1c — monochrome bg, brighter impacts) ──
        if (view === "propagation") {
          const isSource = propagationResult?.shock.source_node_id === node.id;
          const impact = propNodes.get(node.id);
          if (isSource && propActive) {
            color = "#F59E0B";
            const pulse = Math.sin(t * 4) * 0.3 + 1.3;
            glow = 28 + Math.sin(t * 3) * 10;
            dr = r * pulse; showLabel = true; labelBold = true;
          } else if (impact) {
            color = impact.val < 0 ? "#EF4444" : "#3B82F6";
            const elapsed = propagationProgress - impact.arrNorm;
            const flash = Math.max(0, 1 - elapsed * 4);
            dr = r * (impact.primary ? (1 + flash * 0.2) : (1 + flash * 0.1));
            glow = impact.primary ? (12 + flash * 20) : (6 + flash * 10);
            showLabel = true;
          } else if (propActive) {
            // Desaturated cluster hint — enough to identify cluster regions
            const origColor = getNodeColor(orig);
            color = desaturate(origColor, 0.7); alpha = 0.15; glow = 0;
          } else {
            // Pre-run: dramatic WTI glow (§4c)
            if (node.id === "WTI_CRUDE") {
              color = "#F59E0B"; glow = 20 + Math.sin(t * 2) * 8;
              dr = r * 1.15; showLabel = true;
            } else { glow = 3; }
          }
          if (hovered === node.id) showLabel = true;
        }

        // ── Signals (§1d — bright path nodes, dimmed background) ──
        if (view === "signals") {
          if (selectedSignalId) {
            if (signalPathNodes.has(node.id)) {
              alpha = 1; glow = 16; showLabel = true;
              if (node.ticker === sigTargetTicker) {
                ringColor = sigDirection === "SHORT" ? "#EF4444" : "#22C55E";
                labelBold = true;
              }
            } else { const origColor = getNodeColor(orig); color = desaturate(origColor, 0.8); alpha = 0.16; glow = 0; }
          } else { alpha = 0.4; glow = 2; if (isMacro || isETF) showLabel = true; }
          if (hovered === node.id) { showLabel = true; alpha = Math.max(alpha, 0.6); }
        }

        // ── Portfolio (§6) ──
        if (view === "portfolio") {
          const pos = portMap.get(node.id);
          if (pos) {
            color = pos.direction === "LONG" ? "#22C55E" : "#EF4444";
            dr = Math.max(7, pos.weight * 380); alpha = 1; glow = 10; showLabel = true;
          } else { color = "#4A5568"; dr = 2.5; alpha = 0.08; glow = 0; }
          if (hovered === node.id) { showLabel = true; alpha = Math.max(alpha, 0.5); }
        }

        if (hovered === node.id) { glow = Math.max(glow, 18); alpha = Math.max(alpha, 0.9); }

        // Draw glow
        if (glow > 0) {
          ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = glow;
          ctx.beginPath(); ctx.arc(node.x, node.y, dr + 1, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.2); ctx.fill(); ctx.restore();
        }

        // Draw shape (§3 — macro=ring, etf=border, stock=filled)
        if (isMacro) {
          ctx.beginPath(); ctx.arc(node.x, node.y, dr, 0, Math.PI * 2);
          ctx.strokeStyle = hexToRgba(color, alpha * 0.9); ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(node.x, node.y, dr * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.7); ctx.fill();
        } else if (isETF) {
          ctx.beginPath(); ctx.arc(node.x, node.y, dr, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.6); ctx.fill();
          ctx.strokeStyle = hexToRgba(color, alpha * 0.4); ctx.lineWidth = 1.5; ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(node.x, node.y, dr, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.75); ctx.fill();
          ctx.beginPath(); ctx.arc(node.x, node.y, dr * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, alpha * 0.95); ctx.fill();
        }

        // Direction ring (signals §5)
        if (ringColor) {
          ctx.save(); ctx.shadowColor = ringColor; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(node.x, node.y, dr + 4, 0, Math.PI * 2);
          ctx.strokeStyle = ringColor; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
        }

        // Selection ring
        if (selectedNodeId === node.id) {
          ctx.beginPath(); ctx.arc(node.x, node.y, dr + 3, 0, Math.PI * 2);
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5; ctx.stroke();
        }

        // DAL impact ring (§4)
        if (view === "propagation" && node.id === "DAL" && propActive) {
          const di = propNodes.get("DAL");
          if (di) {
            const el = propagationProgress - di.arrNorm;
            if (el > 0 && el < 0.3) {
              const p = el / 0.3;
              ctx.beginPath(); ctx.arc(node.x, node.y, dr + p * 30, 0, Math.PI * 2);
              ctx.strokeStyle = hexToRgba("#EF4444", (1 - p) * 0.6); ctx.lineWidth = 2; ctx.stroke();
            }
          }
        }

        // §5 v4: Ambient breathing + return-color ring (topology only)
        if (view === "topology" && !isMacro) {
          // Breathing: gentle scale oscillation, each node on different phase
          const phase = (node.x || 0) * 0.03 + (node.y || 0) * 0.02;
          const breathCycle = 3.5 + Math.abs(Math.sin(phase)) * 1.5; // 3.5–5s per node
          const breath = Math.sin(t * (Math.PI * 2 / breathCycle) + phase) * 0.5 + 0.5;
          if (!selectedNodeId && !selectedClusterId && !hovered) {
            ctx.beginPath(); ctx.arc(node.x, node.y, dr + breath * 1.2, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(color, 0.05 * breath); ctx.lineWidth = 1; ctx.stroke();
          }
          // Return-color ring: faint green/red ring proportional to |current_return_1d|
          const ret1d = orig.current_return_1d;
          if (ret1d !== 0 && alpha > 0.3) {
            const ringC = ret1d > 0 ? "#22C55E" : "#EF4444";
            const ringAlpha = Math.min(0.20, Math.abs(ret1d) * 5) * (0.8 + breath * 0.2);
            ctx.beginPath(); ctx.arc(node.x, node.y, dr + 3, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(ringC, ringAlpha); ctx.lineWidth = 2; ctx.stroke();
          }
        }

        if (showLabel) labels.push({ text: node.ticker, x: node.x + dr + 4, y: node.y + dr * 0.3, nodeX: node.x, bold: labelBold, ringColor });
      });

      // ── Labels with collision avoidance + boundary clipping (§7) ──
      const labelRects: Array<{ x: number; y: number; w: number; h: number }> = [];
      const fontSize = Math.max(8, Math.min(11, 10 / Math.sqrt(cam.scale)));
      // World-space canvas bounds for boundary checks
      const worldLeft = -w / (2 * cam.scale) - cam.x / cam.scale;
      const worldRight = w / (2 * cam.scale) - cam.x / cam.scale;
      const worldTop = -h / (2 * cam.scale) - cam.y / cam.scale;
      const worldBottom = h / (2 * cam.scale) - cam.y / cam.scale;

      labels.forEach((label) => {
        ctx.font = `${label.bold ? 700 : 500} ${fontSize}px "JetBrains Mono", monospace`;
        const mw = ctx.measureText(label.text).width;
        const lw = mw + 6, lh = fontSize + 4;
        let lx = label.x, ly = label.y;

        // §7a: Boundary clipping — flip label to opposite side if it would go off-screen
        if (lx + lw > worldRight) lx = label.x - lw - (label.x - label.nodeX) * 2 - 4;
        if (lx - 3 < worldLeft) lx = worldLeft + 4;
        if (ly + lh / 2 > worldBottom) ly = worldBottom - lh / 2 - 2;
        if (ly - lh / 2 < worldTop) ly = worldTop + lh / 2 + 2;

        // §7b: Collision avoidance
        for (const r of labelRects) {
          if (Math.abs(lx + lw / 2 - r.x) < (lw + r.w) / 2 + 2 && Math.abs(ly - r.y) < (lh + r.h) / 2) {
            ly = r.y + r.h / 2 + lh / 2 + 2;
          }
        }

        ctx.fillStyle = "rgba(11,12,21,0.82)";
        drawRoundRect(ctx, lx - 3, ly - lh / 2, lw, lh, 3); ctx.fill();
        ctx.fillStyle = label.ringColor || "#E8ECF1";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(label.text, lx, ly);
        labelRects.push({ x: lx + lw / 2, y: ly, w: lw, h: lh });
      });

      // ── Tooltip (§10 — 150ms delay) ──
      if (hovered && (Date.now() - hoverStartRef.current) > 150) {
        const node = simNodes.find((n) => n.id === hovered);
        if (node && node.x != null && node.y != null) {
          const orig = nodes.find((n) => n.id === hovered);
          const lines = [`${node.ticker} — ${node.name}`];
          if (orig?.market_cap) lines.push(formatMarketCap(orig.market_cap));
          else lines.push(node.type.toUpperCase());
          const cl = orig?.cluster_id ? clusters.find((c) => c.id === orig.cluster_id)?.name : "Macro Factor";
          if (cl) lines.push(cl);

          ctx.font = '500 10px "JetBrains Mono", monospace';
          const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));
          const tw = maxW + 16, lineH = 14, th = lineH * lines.length + 10;
          const tx = node.x - tw / 2;
          const ty = node.y - nodeRadius(node as SimNode) - th - 8;

          ctx.save();
          ctx.fillStyle = "#1A2236"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 1;
          drawRoundRect(ctx, tx, ty, tw, th, 4); ctx.fill(); ctx.stroke();
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          lines.forEach((line, i) => {
            ctx.fillStyle = i === 0 ? "#FFFFFF" : "#8896A7";
            ctx.fillText(line, node.x!, ty + 5 + i * lineH);
          });
          ctx.restore();
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);
    return () => { running = false; window.removeEventListener("resize", resize); cancelAnimationFrame(animFrameRef.current); };
  }, [view, selectedNodeId, selectedClusterId, selectedSignalId, selectedPositionTicker, propagationState, propagationProgress, propagationResult]);

  // ── Mouse interaction ──

  const screenToWorld = useCallback((sx: number, sy: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const cam = cameraRef.current;
    return { x: (sx - rect.width / 2 - cam.x) / cam.scale, y: (sy - rect.height / 2 - cam.y) / cam.scale };
  }, []);

  const findNodeAt = useCallback((wx: number, wy: number): SimNode | null => {
    const cam = cameraRef.current;
    let closest: SimNode | null = null, closestDist = Infinity;
    const pad = 6 / cam.scale;
    for (const node of simNodesRef.current) {
      if (!node.x || !node.y) continue;
      const d = Math.sqrt((node.x - wx) ** 2 + (node.y - wy) ** 2);
      if (d < nodeRadius(node) + pad && d < closestDist) { closest = node; closestDist = d; }
    }
    return closest;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      cameraTargetRef.current.x += dx;
      cameraTargetRef.current.y += dy;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const node = findNodeAt(world.x, world.y);
    const id = node ? node.id : null;
    if (id !== hoveredNodeRef.current) {
      hoveredNodeRef.current = id;
      hoverStartRef.current = Date.now();
      setRenderTrigger((v) => v + 1);
      if (canvasRef.current) canvasRef.current.style.cursor = id ? "pointer" : "grab";
    }
  }, [screenToWorld, findNodeAt]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const moved = Math.abs(e.clientX - mouseDownPosRef.current.x) > 3 || Math.abs(e.clientY - mouseDownPosRef.current.y) > 3;
    isDraggingRef.current = false;
    if (moved) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const node = findNodeAt(world.x, world.y);
    if (node) onNodeClick(node.id); else onCanvasClick();
  }, [screenToWorld, findNodeAt, onNodeClick, onCanvasClick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = cameraRef.current;
      const newScale = Math.max(0.3, Math.min(6, cam.scale * (e.deltaY > 0 ? 0.92 : 1.08)));
      cam.scale = newScale;
      cameraTargetRef.current.scale = newScale;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ width: "100%", height: "100%", cursor: "grab" }} />
    </div>
  );
}

// ── Utilities ──

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function hexToRgba(hex: string, a: number): string {
  return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;
}

function desaturate(hex: string, amount: number): string {
  let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
  r = Math.round(r + (gray - r) * amount); g = Math.round(g + (gray - g) * amount); b = Math.round(b + (gray - b) * amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function convexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  function cross(O: { x: number; y: number }, A: { x: number; y: number }, B: { x: number; y: number }) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  }
  const lower: typeof points = [];
  for (const p of sorted) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  const upper: typeof points = [];
  for (const p of sorted.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}
