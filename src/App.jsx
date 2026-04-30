import React, { useState } from "react";
import { regexToNFA } from "./engine/thompson.js";
import { nfaToDFA } from "./engine/subset.js";
import { generateStrings } from "./engine/stringGen.js";
import { dfaToCFG } from "./engine/cfgBuilder.js";
import AutomataCanvas from "./canvas/AutomataCanvas";

export default function App() {
  const [regexInput, setRegexInput] = useState("");
  const [nfa, setNfa] = useState(null);
  const [dfa, setDfa] = useState(null);
  const [view, setView] = useState("NFA");
  const [testInput, setTestInput] = useState("");
  const [activeStateId, setActiveStateId] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedStrings, setGeneratedStrings] = useState([]);
  const [cfgRules, setCfgRules] = useState([]);

  const clearSimulation = () => {
    setActiveStateId(null);
    setCurrentStepIndex(0);
  };

  const handleGenerate = () => {
    if (!regexInput) return;
    try {
      const nfaResult = regexToNFA(regexInput);
      const dfaResult = nfaToDFA(nfaResult);
      const strings = generateStrings(dfaResult, 5);
      const cfg = dfaToCFG(dfaResult);
      setNfa(nfaResult);
      setDfa(dfaResult);
      setGeneratedStrings(strings);
      setCfgRules(cfg.rules);
      clearSimulation();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleStep = () => {
    if (!dfa || !testInput) {
      alert("Please generate a DFA and enter a test string first.");
      return;
    }
    if (activeStateId === null) {
      const startNode = dfa.states.find((s) => s.isStart);
      if (startNode) {
        setActiveStateId(startNode.id);
        setCurrentStepIndex(0);
      } else {
        alert("Error: No start state found.");
      }
      return;
    }
    const char = testInput[currentStepIndex];
    if (char) {
      const transition = dfa.transitions.find(
        (t) => t.from === activeStateId && t.label === char
      );
      if (transition) {
        setActiveStateId(transition.to);
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        alert(`Rejected: No transition for '${char}'`);
        clearSimulation();
      }
    } else {
      const finalNode = dfa.states.find((n) => n.id === activeStateId);
      if (finalNode?.isAccept) {
        alert("Success: String Accepted!");
      } else {
        alert("Rejected: Non-accept state.");
      }
      clearSimulation();
    }
  };

  const currentData = view === "NFA" ? nfa : dfa;

  return (
    <div className="flex h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      <aside className="w-1/4 border-r border-slate-700 p-6 flex flex-col bg-slate-900/50 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-400 mb-6 font-mono italic underline">1. Input</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm text-slate-400 font-medium block mb-2">Regular Expression</label>
            <input
              type="text"
              value={regexInput}
              onChange={(e) => setRegexInput(e.target.value)}
              placeholder="e.g., (a|b)*abb"
              className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>
          <button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold shadow-lg active:scale-95 transition-all">
            Generate Automata
          </button>
          <div className="pt-4 border-t border-slate-700">
            <label className="text-sm text-slate-400 font-medium block mb-2">View Type</label>
            <div className="flex gap-2">
              {["NFA", "DFA"].map((type) => (
                <button
                  key={type}
                  onClick={() => setView(type)}
                  className={`flex-1 py-1 rounded text-xs font-bold ${view === type ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-400"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-slate-800 flex items-center justify-center relative">
        <div className="absolute top-6 left-6 z-10">
          <h2 className="text-xl font-bold text-emerald-400 font-mono italic underline">{view} Graph</h2>
        </div>
        <AutomataCanvas nodes={currentData?.states ?? []} edges={currentData?.transitions ?? []} activeStateId={activeStateId} onStep={handleStep} />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-2xl z-50 backdrop-blur-sm">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Test string..."
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500 w-48 text-emerald-400 font-mono"
          />
          <button onClick={handleStep} className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all">
            {activeStateId === null ? "Start Simulation" : "Step"}
          </button>
          {activeStateId !== null && (
            <button onClick={clearSimulation} className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all">Reset</button>
          )}
        </div>
      </main>

      <aside className="w-1/4 border-l border-slate-700 p-6 bg-slate-900/50 overflow-y-auto">
        <h2 className="text-xl font-bold text-purple-400 mb-6 font-mono italic underline">3. Results</h2>
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Accepted Strings</h3>
            <ul className="text-sm font-mono text-emerald-400">
              {generatedStrings.length > 0 ? generatedStrings.map((s, i) => <li key={i}>"{s}"</li>) : <li className="text-slate-500 italic">No strings generated</li>}
            </ul>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">CFG Rules</h3>
            <div className="text-sm font-mono text-purple-300">
              {cfgRules.length > 0 ? cfgRules.map((rule, i) => <div key={i}>{rule}</div>) : <div className="text-slate-500 italic">No CFG generated</div>}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}