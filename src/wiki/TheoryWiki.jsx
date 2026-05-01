import React from "react";

export default function TheoryWiki() {
  return (
    <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-md">
      
      <h2 className="text-lg font-bold text-blue-400 mb-3"> Theory Wiki</h2>

      <div className="space-y-4 text-sm leading-relaxed">

        <div>
          <h3 className="text-emerald-400 font-semibold">DFA</h3>
          <p className="text-slate-300">
            A Deterministic Finite Automaton (DFA) reads input one symbol at a time.
            Each state has exactly one transition for each symbol.
          </p>
        </div>

        <div>
          <h3 className="text-emerald-400 font-semibold">NFA</h3>
          <p className="text-slate-300">
            A Non-deterministic Finite Automaton (NFA) can have multiple transitions
            and may include epsilon (ε) transitions.
          </p>
        </div>

        <div>
          <h3 className="text-emerald-400 font-semibold">Regular Expression</h3>
          <p className="text-slate-300">
            A Regular Expression describes patterns in strings.
            Example: <span className="text-yellow-300">(a+b)*</span>
          </p>
        </div>

        <div>
          <h3 className="text-emerald-400 font-semibold">CFG</h3>
          <p className="text-slate-300">
            A Context-Free Grammar (CFG) is a set of rules used to generate strings.
            Example: <span className="text-yellow-300">S → aS | bS | ε</span>
          </p>
        </div>

      </div>
    </div>
  );
}