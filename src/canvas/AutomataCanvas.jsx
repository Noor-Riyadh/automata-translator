import React, { useMemo } from "react";
import dagre from "dagre";

const AutomataCanvas = ({ nodes = [], edges = [], activeStateId, onStep }) => {
  const layout = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((n) => g.setNode(n.id, { ...n, width: 60, height: 60 }));
    edges.forEach((e) => g.setEdge(e.from, e.to, { label: e.symbol }));
    // edges.forEach((e) => g.setEdge(e.from, e.to, { label: e.symbol ?? e.label }));


    dagre.layout(g);
    return g;
  }, [nodes, edges]);

  return (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center relative p-10">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        {layout.edges().map((e, i) => {
          const edge = layout.edge(e);
          const source = layout.node(e.v);
          const target = layout.node(e.w);
          const isEpsilon = edge.label === "ε" || edge.label === "";

          const sx = source.x || 0;
          const sy = source.y || 0;
          const tx = target.x || 0;
          const ty = target.y || 0;

          return (
            <g key={`edge-${i}`}>
              {e.v === e.w ? (
                <path
                  d={`M ${sx - 20} ${sy - 25} A 25 25 0 1 1 ${sx + 20} ${sy - 25}`}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                  strokeDasharray={isEpsilon ? "5,5" : "0"}
                />
              ) : (
                <line
                  x1={sx}
                  y1={sy}
                  x2={tx}
                  y2={ty}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                  strokeDasharray={isEpsilon ? "5,5" : "0"}
                />
              )}
              <g
                transform={`translate(${(sx + tx) / 2}, ${(sy + ty) / 2 - 12})`}
              >
                <rect
                  x="-10"
                  y="-10"
                  width="20"
                  height="20"
                  fill="#1e293b"
                  rx="4"
                />
                <text
                  dy=".3em"
                  textAnchor="middle"
                  fill="#60a5fa"
                  className="text-xs font-bold font-mono"
                >
                  {edge.label || "ε"}
                </text>
              </g>
            </g>
          );
        })}

        {layout.nodes().map((v) => {
          const node = layout.node(v);
          const isActive = v === activeStateId;

          const x = node.x || 0;
          const y = node.y || 0;

          return (
            <g key={v} transform={`translate(${x}, ${y})`}>
              {node.isStart && (
                <line
                  x1="-70"
                  y1="0"
                  x2="-35"
                  y2="0"
                  stroke="#10b981"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
              )}
              <circle
                r="30"
                fill={isActive ? "#1e3a8a" : "#1e293b"}
                stroke={isActive ? "#60a5fa" : "#10b981"}
                strokeWidth="3"
                className="transition-colors duration-500"
              />
              {node.isAccept && (
                <circle
                  r="24"
                  fill="transparent"
                  stroke={isActive ? "#60a5fa" : "#10b981"}
                  strokeWidth="2"
                />
              )}
              <text
                dy=".3em"
                textAnchor="middle"
                fill="white"
                className="font-bold"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AutomataCanvas;
