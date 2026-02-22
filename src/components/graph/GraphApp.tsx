"use client";

import { useState, useCallback, useMemo } from "react";
import type { ViewType, PropagationResult } from "@/lib/graph/types";
import { oilShock, SCENARIOS } from "@/lib/graph/data";
import { TopNav } from "./TopNav";
import { GraphCanvas } from "./GraphCanvas";
import { TopologyLeftPanel, TopologyRightPanel } from "./panels/TopologyPanels";
import { PropagationLeftPanel, PropagationRightPanel } from "./panels/PropagationPanels";
import { SignalLeftPanel, SignalRightPanel } from "./panels/SignalPanels";
import { PortfolioLeftPanel, PortfolioRightPanel } from "./panels/PortfolioPanels";

export function GraphApp() {
  const [view, setView] = useState<ViewType>("topology");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [selectedPositionTicker, setSelectedPositionTicker] = useState<string | null>(null);

  // Propagation state
  const [propagationState, setPropagationState] = useState<"idle" | "running" | "complete">("idle");
  const [propagationResult, setPropagationResult] = useState<PropagationResult | null>(null);
  const [propagationProgress, setPropagationProgress] = useState(0);

  // Scenario selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("oil");

  // Shock form state (synced from selected scenario)
  const [shockType, setShockType] = useState<string>(oilShock.type);
  const [shockSource, setShockSource] = useState<string>(oilShock.source_node_id);
  const [shockMagnitude, setShockMagnitude] = useState<string>(oilShock.magnitude);

  // Active hop index for scroll sync
  const activeHopIndex = useMemo(() => {
    if (propagationState === "idle" || !propagationResult) return -1;
    const maxLag = propagationResult.max_propagation_time || 8;
    const hops = propagationResult.hops;
    let last = -1;
    for (let i = 0; i < hops.length; i++) {
      const arrNorm = hops[i].cumulative_lag / maxLag;
      if (propagationProgress >= arrNorm) last = i;
    }
    return last;
  }, [propagationState, propagationResult, propagationProgress]);

  const handleViewChange = useCallback((v: ViewType) => {
    setView(v);
    setSelectedNodeId(null);
    setSelectedClusterId(null);
    setSelectedSignalId(null);
    setSelectedPositionTicker(null);
  }, []);

  const handleNodeClick = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) setSelectedClusterId(null);
  }, []);

  const handleClusterClick = useCallback((clusterId: string | null) => {
    setSelectedClusterId(clusterId);
    if (clusterId) setSelectedNodeId(null);
  }, []);

  // §3e: Preset click — sync form fields, reset propagation, select scenario
  const handlePresetClick = useCallback((scenarioId: string) => {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return;
    setSelectedScenarioId(scenarioId);
    setShockType(scenario.shock.type);
    setShockSource(scenario.shock.source_node_id);
    setShockMagnitude(scenario.shock.magnitude);
    setPropagationState("idle");
    setPropagationResult(null);
    setPropagationProgress(0);
  }, []);

  // §3e: Run scenario with selected scenario data
  const handleRunPropagation = useCallback(() => {
    const scenario = SCENARIOS[selectedScenarioId];
    if (!scenario) return;

    setPropagationState("running");
    setPropagationProgress(0);
    setPropagationResult(scenario.result);

    const duration = 5000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPropagationProgress(progress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPropagationState("complete");
      }
    };
    requestAnimationFrame(animate);
  }, [selectedScenarioId]);

  const handleSignalClick = useCallback((signalId: string | null) => {
    setSelectedSignalId(signalId);
  }, []);

  const handlePositionClick = useCallback((ticker: string | null) => {
    setSelectedPositionTicker(ticker);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedClusterId(null);
  }, []);

  // Render left panel based on view
  const renderLeftPanel = () => {
    switch (view) {
      case "topology":
        return (
          <TopologyLeftPanel
            selectedClusterId={selectedClusterId}
            onClusterClick={handleClusterClick}
          />
        );
      case "propagation":
        return (
          <PropagationLeftPanel
            shockType={shockType}
            shockSource={shockSource}
            shockMagnitude={shockMagnitude}
            onShockTypeChange={setShockType}
            onShockSourceChange={setShockSource}
            onShockMagnitudeChange={setShockMagnitude}
            onRun={handleRunPropagation}
            propagationState={propagationState}
            selectedScenarioId={selectedScenarioId}
            onPresetClick={handlePresetClick}
          />
        );
      case "signals":
        return (
          <SignalLeftPanel
            selectedSignalId={selectedSignalId}
            onSignalClick={handleSignalClick}
          />
        );
      case "portfolio":
        return (
          <PortfolioLeftPanel
            selectedPositionTicker={selectedPositionTicker}
            onPositionClick={handlePositionClick}
          />
        );
    }
  };

  // Render right panel based on view
  const renderRightPanel = () => {
    switch (view) {
      case "topology":
        return (
          <TopologyRightPanel
            selectedNodeId={selectedNodeId}
            selectedClusterId={selectedClusterId}
          />
        );
      case "propagation":
        return (
          <PropagationRightPanel
            propagationState={propagationState}
            propagationResult={propagationResult}
            activeHopIndex={activeHopIndex}
          />
        );
      case "signals":
        return (
          <SignalRightPanel selectedSignalId={selectedSignalId} />
        );
      case "portfolio":
        return (
          <PortfolioRightPanel
            selectedPositionTicker={selectedPositionTicker}
          />
        );
    }
  };

  return (
    <div
      className="graph-shell"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0B0C15",
        color: "#E8ECF1",
        fontFamily: "var(--font-heading), 'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      <TopNav view={view} onViewChange={handleViewChange} />

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "280px 1fr 360px",
          overflow: "hidden",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            background: "#0B0C15",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderLeftPanel()}
        </div>

        {/* Center: Graph Canvas */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <GraphCanvas
            view={view}
            selectedNodeId={selectedNodeId}
            selectedClusterId={selectedClusterId}
            selectedSignalId={selectedSignalId}
            selectedPositionTicker={selectedPositionTicker}
            propagationState={propagationState}
            propagationProgress={propagationProgress}
            propagationResult={propagationResult}
            onNodeClick={handleNodeClick}
            onCanvasClick={handleCanvasClick}
          />
        </div>

        {/* Right Panel */}
        <div
          style={{
            background: "#0B0C15",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
}
