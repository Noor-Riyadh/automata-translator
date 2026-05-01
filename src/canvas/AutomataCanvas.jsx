import React, { useMemo, useRef, useState, useCallback } from "react";
import dagre from "dagre";

const AutomataCanvas = ({ nodes = [], edges = [], activeStateId }) => {
  const svgRef = useRef(null);

  // ── Pan & Zoom state ──
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // ── Dagre layout ──
  const layout = useMemo(() => {
    const g = new dagre.graphlib.Graph({ multigraph: true });
    g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((n) => g.setNode(n.id, { ...n, width: 60, height: 60 }));
    edges.forEach((e, i) =>
      g.setEdge(e.from, e.to, { label: e.symbol ?? e.label }, `e${i}`),
    );
    dagre.layout(g);
    return g;
  }, [nodes, edges]);

  // ── Compute viewBox bounds ──
  const allNodeData = layout
    .nodes()
    .map((v) => layout.node(v))
    .filter(Boolean);
  const pad = 100;
  const minX = allNodeData.length
    ? Math.min(...allNodeData.map((n) => n.x)) - pad
    : 0;
  const minY = allNodeData.length
    ? Math.min(...allNodeData.map((n) => n.y)) - pad
    : 0;
  const maxX = allNodeData.length
    ? Math.max(...allNodeData.map((n) => n.x)) + pad
    : 800;
  const maxY = allNodeData.length
    ? Math.max(...allNodeData.map((n) => n.y)) + pad
    : 600;
  const vbW = Math.max(800, maxX - minX);
  const vbH = Math.max(600, maxY - minY);

  const NODE_R = 30;

  const shorten = (x1, y1, x2, y2) => {
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {
      x1: x1 + (dx / len) * NODE_R,
      y1: y1 + (dy / len) * NODE_R,
      x2: x2 - (dx / len) * (NODE_R + 8),
      y2: y2 - (dy / len) * (NODE_R + 8),
    };
  };

  // ── Mouse handlers for pan ──
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // ── Scroll wheel for zoom ──
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((t) => {
      const newScale = Math.min(4, Math.max(0.2, t.scale * factor));
      return { ...t, scale: newScale };
    });
  }, []);

  // Reset view
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  return (
    <div className="w-full h-full bg-slate-800 relative overflow-hidden">
      {/* ── Zoom controls ── */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
        <button
          onClick={() =>
            setTransform((t) => ({ ...t, scale: Math.min(4, t.scale * 1.2) }))
          }
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded text-lg font-bold flex items-center justify-center shadow"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() =>
            setTransform((t) => ({ ...t, scale: Math.max(0.2, t.scale * 0.8) }))
          }
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded text-lg font-bold flex items-center justify-center shadow"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold flex items-center justify-center shadow"
          title="Reset view"
        >
          ⟳
        </button>
      </div>

      {/* ── Pan hint ── */}
      <div className="absolute bottom-4 right-4 z-20 text-slate-500 text-xs select-none">
        Drag to pan · Scroll to zoom
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
        style={{
          cursor: isPanning.current ? "grabbing" : "grab",
          display: "block",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="6"
            refX="0"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
          <marker
            id="arrow-green"
            markerWidth="8"
            markerHeight="6"
            refX="0"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
        </defs>

        {/* Everything inside this group moves and scales together */}
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          style={{ transformOrigin: "center" }}
        >
          {/* ── EDGES ── */}
          {layout.edges().map((e, i) => {
            const edge = layout.edge(e);
            const source = layout.node(e.v);
            const target = layout.node(e.w);
            if (!source || !target) return null;

            const sx = source.x,
              sy = source.y;
            const tx = target.x,
              ty = target.y;
            const rawLabel = edge.label ?? "";
            const isEpsilon =
              rawLabel === "ε" || rawLabel === "Îµ" || rawLabel === "";
            const displayLabel = isEpsilon ? "ε" : rawLabel;
            const dash = isEpsilon ? "5,5" : "0";

            // Self-loop
            if (e.v === e.w) {
              return (
                <g key={`edge-${i}`}>
                  <path
                    d={`M ${sx - 20} ${sy - 28} A 28 28 0 1 1 ${sx + 20} ${sy - 28}`}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray={dash}
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={sx}
                    y={sy - 70}
                    textAnchor="middle"
                    fill="#60a5fa"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {displayLabel}
                  </text>
                </g>
              );
            }

            // Bidirectional — curved arc
            const hasReverse = layout
              .edges()
              .some((r) => r.v === e.w && r.w === e.v);
            if (hasReverse) {
              const mx = (sx + tx) / 2,
                my = (sy + ty) / 2;
              const dx = tx - sx,
                dy = ty - sy;
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              const offset = 40;
              const cx = mx - (dy / len) * offset;
              const cy = my + (dx / len) * offset;
              const startAngle = Math.atan2(cy - sy, cx - sx);
              const endAngle = Math.atan2(cy - ty, cx - tx);
              const x1 = sx + Math.cos(startAngle) * NODE_R;
              const y1 = sy + Math.sin(startAngle) * NODE_R;
              const x2 = tx + Math.cos(endAngle) * (NODE_R + 8);
              const y2 = ty + Math.sin(endAngle) * (NODE_R + 8);
              return (
                <g key={`edge-${i}`}>
                  <path
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray={dash}
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    fill="#60a5fa"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {displayLabel}
                  </text>
                </g>
              );
            }

            // Straight edge
            const { x1, y1, x2, y2 } = shorten(sx, sy, tx, ty);
            const lx = (x1 + x2) / 2;
            const ly = (y1 + y2) / 2 - 12;
            return (
              <g key={`edge-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray={dash}
                  markerEnd="url(#arrow)"
                />
                <rect
                  x={lx - 10}
                  y={ly - 10}
                  width="20"
                  height="20"
                  fill="#1e293b"
                  rx="4"
                />
                <text
                  x={lx}
                  y={ly + 5}
                  textAnchor="middle"
                  fill="#60a5fa"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {displayLabel}
                </text>
              </g>
            );
          })}

          {/* ── NODES ── */}
          {layout.nodes().map((v) => {
            const node = layout.node(v);
            if (!node) return null;
            const isActive = v === activeStateId;
            const x = node.x,
              y = node.y;
            return (
              <g key={v} transform={`translate(${x}, ${y})`}>
                {node.isStart && (
                  <line
                    x1="-75"
                    y1="0"
                    x2={-(NODE_R + 8)}
                    y2="0"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    markerEnd="url(#arrow-green)"
                  />
                )}
                <circle
                  r={NODE_R}
                  fill={isActive ? "#1e3a8a" : "#1e293b"}
                  stroke={isActive ? "#60a5fa" : "#10b981"}
                  strokeWidth="3"
                  className="transition-colors duration-500"
                />
                {node.isAccept && (
                  <circle
                    r={NODE_R - 6}
                    fill="transparent"
                    stroke={isActive ? "#60a5fa" : "#10b981"}
                    strokeWidth="2"
                  />
                )}
                <text
                  dy=".35em"
                  textAnchor="middle"
                  fill="white"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AutomataCanvas;
