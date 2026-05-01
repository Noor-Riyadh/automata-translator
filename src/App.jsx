import React, { useState } from "react";
import { regexToNFA } from "./engine/thompson.js";
import { nfaToDFA } from "./engine/subset.js";
import { generateStrings } from "./engine/stringGen.js";
import { dfaToCFG } from "./engine/cfgBuilder.js";
import AutomataCanvas from "./canvas/AutomataCanvas";
import { englishToRE } from "./engine/englishToRE.js";
import { minimizeDFA } from "./engine/minimize.js";
import { dfaToRegex } from "./engine/stateElim.js";
import TheoryWiki from "./wiki/TheoryWiki";

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
  const [englishInput, setEnglishInput] = useState("");
  const [minDfa, setMinDfa] = useState(null);
  const [reOutput, setReOutput] = useState("");
  const [showWiki, setShowWiki] = useState(false); // ← NEW

  const clearSimulation = () => {
    setActiveStateId(null);
    setCurrentStepIndex(0);
  };

  const runPipeline = (regex) => {
    const nfaResult = regexToNFA(regex);
    const dfaResult = nfaToDFA(nfaResult);
    const minDfaResult = minimizeDFA(dfaResult);
    const reResult = dfaToRegex(dfaResult);
    const strings = generateStrings(dfaResult, 5).filter(
      (s) => s !== undefined && s !== null,
    );
    const cfg = dfaToCFG(dfaResult);
    setNfa(nfaResult);
    setDfa(dfaResult);
    setMinDfa(minDfaResult);
    setReOutput(reResult);
    setGeneratedStrings(strings);
    setCfgRules(cfg.rules);
    clearSimulation();
  };

  const handleGenerate = () => {
    if (!regexInput) return;
    try {
      runPipeline(regexInput);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleEnglishGenerate = () => {
    const re = englishToRE(englishInput);
    if (!re) {
      alert(
        "Pattern not recognised. Please use one of the supported phrase formats.",
      );
      return;
    }
    setRegexInput(re);
    try {
      runPipeline(re);
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
        (t) => t.from === activeStateId && t.symbol === char,
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

  const currentData = view === "NFA" ? nfa : view === "DFA" ? dfa : minDfa;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-white font-sans overflow-hidden">
      {/* ── TOP NAV BAR ── */}
      <nav className="flex-shrink-0 bg-slate-950 border-b border-slate-700 flex items-center gap-3 px-6 py-2 z-50">
        <span className="text-blue-400 font-mono font-bold text-sm mr-2">
          UAT Simulator
        </span>
        <button
          onClick={() => setShowWiki(false)}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            !showWiki
              ? "bg-emerald-600 text-white"
              : "bg-slate-700 text-slate-400 hover:bg-slate-600"
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => setShowWiki(true)}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            showWiki
              ? "bg-emerald-600 text-white"
              : "bg-slate-700 text-slate-400 hover:bg-slate-600"
          }`}
        >
          Theory Wiki
        </button>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">
        {showWiki ? (
          /* ── WIKI PAGE — full width ── */
          <div className="w-full overflow-y-auto">
            <TheoryWiki />
          </div>
        ) : (
          /* ── SIMULATOR — three panels ── */
          <>
            {/* LEFT PANEL */}
            <aside className="w-1/4 border-r border-slate-700 p-6 flex flex-col bg-slate-900/50 overflow-y-auto">
              <h2 className="text-xl font-bold text-blue-400 mb-6 font-mono italic underline">
                1. Input
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-slate-400 font-medium block mb-2">
                    Regular Expression
                  </label>
                  <input
                    type="text"
                    value={regexInput}
                    onChange={(e) => setRegexInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="e.g., (a|b)*abb"
                    className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold shadow-lg active:scale-95 transition-all"
                >
                  Generate Automata
                </button>

                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm text-slate-400 font-medium block mb-2">
                    English Phrase
                  </label>
                  <input
                    type="text"
                    value={englishInput}
                    onChange={(e) => setEnglishInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEnglishGenerate()
                    }
                    placeholder="e.g., Starts with ab"
                    className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                  <button
                    onClick={handleEnglishGenerate}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-500 py-2 rounded font-semibold shadow-lg active:scale-95 transition-all"
                  >
                    Generate from English
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <label className="text-sm text-slate-400 font-medium block mb-2">
                    View Type
                  </label>
                  <div className="flex gap-2">
                    {["NFA", "DFA", "Min DFA"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setView(type)}
                        className={`flex-1 py-1 rounded text-xs font-bold ${
                          view === type
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <label className="text-sm text-slate-400 font-medium block mb-2">
                  Load Example Machine
                </label>
                <select
                  onChange={(e) => {
                    if (!e.target.value) return;
                    import(`./wiki/machines/${e.target.value}`).then((m) => {
                      const machine = m.default;
                      if (machine.type === "DFA") {
                        setDfa(machine);
                        setNfa(null);
                        setView("DFA");
                        const strings = generateStrings(machine, 5).filter(
                          Boolean,
                        );
                        const cfg = dfaToCFG(machine);
                        setGeneratedStrings(strings);
                        setCfgRules(cfg.rules);
                        setReOutput(dfaToRegex(machine));
                      }
                    });
                  }}
                  className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-slate-300 text-sm"
                >
                  <option value="">Select an example...</option>
                  <option value="ends_in_ab.json">Ends in ab</option>
                  <option value="even_even.json">Even a's and b's</option>
                  <option value="divisible_by_3.json">Divisible by 3</option>
                  <option value="palindrome.json">
                    Palindrome (simplified)
                  </option>
                </select>
              </div>
            </aside>

            {/* CENTRE PANEL */}
            <main className="flex-1 bg-slate-800 flex items-center justify-center relative">
              <div className="absolute top-6 left-6 z-10">
                <h2 className="text-xl font-bold text-emerald-400 font-mono italic underline">
                  {view} Graph
                </h2>
              </div>
              <AutomataCanvas
                nodes={(currentData?.states ?? []).filter((s) => s.id !== "∅")}
                edges={(currentData?.transitions ?? []).filter(
                  (t) => t.from !== "∅" && t.to !== "∅",
                )}
                activeStateId={activeStateId}
                onStep={handleStep}
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-2xl z-50 backdrop-blur-sm">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Test string..."
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500 w-48 text-emerald-400 font-mono"
                />
                <button
                  onClick={handleStep}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all"
                >
                  {activeStateId === null ? "Start Simulation" : "Step"}
                </button>
                {activeStateId !== null && (
                  <button
                    onClick={clearSimulation}
                    className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            </main>

            {/* RIGHT PANEL */}
            <aside className="w-1/4 border-l border-slate-700 p-6 bg-slate-900/50 overflow-y-auto">
              <h2 className="text-xl font-bold text-purple-400 mb-6 font-mono italic underline">
                3. Results
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Accepted Strings
                  </h3>
                  <ul className="text-sm font-mono text-emerald-400">
                    {generatedStrings.length > 0 ? (
                      generatedStrings.map((s, i) => <li key={i}>"{s}"</li>)
                    ) : (
                      <li className="text-slate-500 italic">
                        No strings generated
                      </li>
                    )}
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    CFG Rules
                  </h3>
                  <div className="text-sm font-mono text-purple-300">
                    {cfgRules.length > 0 ? (
                      cfgRules.map((rule, i) => <div key={i}>{rule}</div>)
                    ) : (
                      <div className="text-slate-500 italic">
                        No CFG generated
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Regular Expression
                  </h3>
                  <div className="text-sm font-mono text-blue-300 break-all">
                    {reOutput ? (
                      reOutput
                    ) : (
                      <span className="text-slate-500 italic">
                        No RE generated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
