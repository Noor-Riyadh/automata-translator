import React, { useState } from "react";
import AutomataCanvas from "./canvas/AutomataCanvas";

function App() {
  const [nodes] = useState([
    { id: "q0", label: "q0", isStart: true, isAccept: false },
    { id: "q1", label: "q1", isStart: false, isAccept: true },
  ]);

  const [edges] = useState([
    { from: "q0", to: "q1", label: "a" },
    { from: "q1", to: "q1", label: "b" },
  ]);

  // State to track which node is currently "active" in the simulation
  const [activeStateId, setActiveStateId] = useState("q0");

  const handleStep = () => {
    // Basic logic to toggle between q0 and q1 for testing
    setActiveStateId((prev) => (prev === "q0" ? "q1" : "q0"));
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      {/* LEFT: Input Area */}
      <aside className="w-1/4 border-r border-slate-700 p-6 flex flex-col bg-slate-900/50">
        <h2 className="text-xl font-bold text-blue-400 mb-6 font-mono italic underline">
          1. Input
        </h2>
        <div className="space-y-4">
          <label className="text-sm text-slate-400 font-medium">
            Regular Expression
          </label>
          <input
            type="text"
            placeholder="e.g., (a|b)*abb"
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold shadow-lg transition-all active:scale-95">
            Generate Automata
          </button>
        </div>
      </aside>

      {/* CENTER: Canvas Workspace */}
      <main className="flex-1 bg-slate-800 flex items-center justify-center relative">
        <div className="absolute top-6 left-6 z-10">
          <h2 className="text-xl font-bold text-emerald-400 font-mono italic underline">
            Interactive Graph Canvas
          </h2>
        </div>

        {/* Pass activeStateId and the step handler to the canvas */}
        <AutomataCanvas
          nodes={nodes}
          edges={edges}
          activeStateId={activeStateId}
          onStep={handleStep}
        />
      </main>

      {/* RIGHT: Results Area */}
      <aside className="w-1/4 border-l border-slate-700 p-6 bg-slate-900/50">
        <h2 className="text-xl font-bold text-purple-400 mb-6 font-mono italic underline">
          3. Results
        </h2>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            DFA Transition Table
          </h3>
          <p className="text-sm text-slate-400 italic">No output yet.</p>
        </div>
      </aside>
    </div>
  );
}

export default App;
