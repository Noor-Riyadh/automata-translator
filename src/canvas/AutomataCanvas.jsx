import React, { useMemo } from "react";
import dagre from "dagre";

const AutomataCanvas = ({ nodes = [], edges = [], activeStateId, onStep }) => {
  const layout = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((n) => g.setNode(n.id, { ...n, width: 60, height: 60 }));
    edges.forEach((e) => g.setEdge(e.from, e.to, { label: e.label }));

    dagre.layout(g);
    return g;
  }, [nodes, edges]);

  return (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center relative p-10">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 1. DRAW EDGES */}
        {layout.edges().map((e, i) => {
          const edge = layout.edge(e);
          const source = layout.node(e.v);
          const target = layout.node(e.w);
          const isEpsilon = edge.label === "ε" || edge.label === "";

          return (
            <g key={`edge-${i}`}>
              {e.v === e.w ? (
                <path
                  d={`M ${source.x - 20} ${source.y - 25} A 25 25 0 1 1 ${source.x + 20} ${source.y - 25}`}
                  fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"
                  strokeDasharray={isEpsilon ? "5,5" : "0"}
                />
              ) : (
                <line
                  x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                  stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"
                  strokeDasharray={isEpsilon ? "5,5" : "0"}
                />
              )}
              <g transform={`translate(${(source.x + target.x) / 2}, ${(source.y + target.y) / 2 - 12})`}>
                <rect x="-10" y="-10" width="20" height="20" fill="#1e293b" rx="4" />
                <text dy=".3em" textAnchor="middle" fill="#60a5fa" className="text-xs font-bold font-mono">
                  {edge.label || "ε"}
                </text>
              </g>
            </g>
          );
        })}

        {/* 2. DRAW NODES */}
        {layout.nodes().map((v) => {
          const node = layout.node(v);
          const isActive = v === activeStateId;

          return (
            <g key={v} transform={`translate(${node.x}, ${node.y})`}>
              {node.isStart && (
                <line x1="-70" y1="0" x2="-35" y2="0" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
              )}
              <circle
                r="30"
                fill={isActive ? "#1e3a8a" : "#1e293b"}
                stroke={isActive ? "#60a5fa" : "#10b981"}
                strokeWidth="3"
                className="transition-colors duration-500"
              />
              {node.isAccept && (
                <circle r="24" fill="transparent" stroke={isActive ? "#60a5fa" : "#10b981"} strokeWidth="2" />
              )}
              <text dy=".3em" textAnchor="middle" fill="white" className="font-bold">{node.label}</text>
            </g>
          );
        })}
      </svg>

      {/* 3. CONTROL BAR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-2xl z-50 backdrop-blur-sm">
        <input
          type="text"
          placeholder="Enter test string..."
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500 w-48 text-emerald-400 font-mono"
        />
        <button
          onClick={onStep}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
        >
          Step
        </button>
      </div>
    </div>
  );
};

export default AutomataCanvas;