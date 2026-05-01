import React, { useState } from "react";

const TABS = ["DFA", "NFA", "TG / GTG", "Thompson's", "RE Cheat-Sheet", "CFG"];

export default function TheoryWiki() {
  const [active, setActive] = useState("DFA");

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold text-blue-400 mb-6 font-mono italic underline">
        Theory Wiki
      </h1>

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              active === tab
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-sm leading-relaxed">
        {/* ── DFA ── */}
        {active === "DFA" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Deterministic Finite Automaton (DFA)
            </h2>
            <p className="text-slate-300">
              A DFA is a machine that reads an input string one symbol at a time
              and decides whether to accept or reject it. It is called
              deterministic because from any state, reading any symbol leads to
              exactly one next state — no ambiguity, no choice.
            </p>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Formal Definition
              </h3>
              <p className="text-slate-300">
                A DFA is a 5-tuple (Q, Σ, δ, q₀, F) where:
              </p>
              <ul className="mt-2 space-y-1 text-slate-300 list-none ml-4">
                <li>
                  <span className="text-emerald-400">Q</span> — finite set of
                  states
                </li>
                <li>
                  <span className="text-emerald-400">Σ</span> — input alphabet
                  (e.g. {"{a, b}"})
                </li>
                <li>
                  <span className="text-emerald-400">δ</span> — transition
                  function: Q × Σ → Q
                </li>
                <li>
                  <span className="text-emerald-400">q₀</span> — start state (q₀
                  ∈ Q)
                </li>
                <li>
                  <span className="text-emerald-400">F</span> — set of accept
                  states (F ⊆ Q)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Example — Strings ending in b
              </h3>
              <p className="text-slate-300 mb-2">
                RE: <span className="text-yellow-300">(a|b)*b</span>
              </p>
              <table className="w-full text-center border-collapse text-slate-300">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="border border-slate-600 px-4 py-2">State</th>
                    <th className="border border-slate-600 px-4 py-2">a</th>
                    <th className="border border-slate-600 px-4 py-2">b</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-600 px-4 py-2">
                      → q0 (start)
                    </td>
                    <td className="border border-slate-600 px-4 py-2">q0</td>
                    <td className="border border-slate-600 px-4 py-2">q1</td>
                  </tr>
                  <tr className="bg-slate-750">
                    <td className="border border-slate-600 px-4 py-2">
                      ★ q1 (accept)
                    </td>
                    <td className="border border-slate-600 px-4 py-2">q0</td>
                    <td className="border border-slate-600 px-4 py-2">q1</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-slate-400 mt-2 text-xs">
                → means start state. ★ means accept state.
              </p>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Key Rules</h3>
              <ul className="text-slate-300 space-y-1 list-disc ml-5">
                <li>Every state must have exactly one transition per symbol</li>
                <li>Exactly one start state</li>
                <li>Zero or more accept states</li>
                <li>
                  A string is accepted if the machine ends in an accept state
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ── NFA ── */}
        {active === "NFA" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Non-deterministic Finite Automaton (NFA)
            </h2>
            <p className="text-slate-300">
              An NFA is like a DFA but with two extra powers: a state can have
              multiple transitions on the same symbol, and it can have
              ε-transitions (moves that consume no input). An NFA accepts a
              string if ANY path through the machine leads to an accept state.
            </p>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Key Differences from DFA
              </h3>
              <table className="w-full text-center border-collapse text-slate-300">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="border border-slate-600 px-4 py-2">
                      Feature
                    </th>
                    <th className="border border-slate-600 px-4 py-2">DFA</th>
                    <th className="border border-slate-600 px-4 py-2">NFA</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Transitions per symbol", "Exactly 1", "0, 1, or many"],
                    ["ε-transitions", "Not allowed", "Allowed"],
                    ["Acceptance", "One path", "Any path"],
                    ["Expressive power", "Equal", "Equal"],
                  ].map(([f, d, n]) => (
                    <tr key={f}>
                      <td className="border border-slate-600 px-4 py-2">{f}</td>
                      <td className="border border-slate-600 px-4 py-2">{d}</td>
                      <td className="border border-slate-600 px-4 py-2">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">ε-closure</h3>
              <p className="text-slate-300">
                The ε-closure of a state q is the set of all states reachable
                from q by following zero or more ε-transitions. This is the
                foundation of the Subset Construction algorithm that converts an
                NFA to a DFA.
              </p>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">
                NFA → DFA (Subset Construction)
              </h3>
              <p className="text-slate-300">
                Every NFA can be converted to an equivalent DFA. Each DFA state
                represents a{" "}
                <span className="text-yellow-300">set of NFA states</span>. The
                initial DFA state is ε-closure({"q₀"}). A DFA state is accepting
                if it contains any NFA accept state.
              </p>
            </div>
          </div>
        )}

        {/* ── TG / GTG ── */}
        {active === "TG / GTG" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Transition Graphs (TG) and Generalized Transition Graphs (GTG)
            </h2>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">
                Transition Graph (TG)
              </h3>
              <p className="text-slate-300">
                A TG is a generalization of an NFA where edge labels can be
                entire strings (not just single symbols). A path is successful
                if concatenating all its edge labels produces the input string.
              </p>
              <ul className="text-slate-300 space-y-1 list-disc ml-5 mt-2">
                <li>Can have multiple start states</li>
                <li>Can have multiple accept states</li>
                <li>Edge labels can be strings like "ab" or "bba"</li>
                <li>
                  No ε-transitions needed — edges can be labeled with empty
                  string directly
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">
                Generalized Transition Graph (GTG)
              </h3>
              <p className="text-slate-300">
                A GTG is a further generalization where edge labels can be full
                Regular Expressions. This makes GTGs very powerful for
                representing languages compactly. GTGs are used in the State
                Elimination algorithm to convert a DFA back to a Regular
                Expression.
              </p>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">Comparison</h3>
              <table className="w-full text-center border-collapse text-slate-300">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="border border-slate-600 px-4 py-2">Model</th>
                    <th className="border border-slate-600 px-4 py-2">
                      Edge Labels
                    </th>
                    <th className="border border-slate-600 px-4 py-2">
                      Start States
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["FA / DFA", "Single symbols", "Exactly 1"],
                    ["NFA", "Single symbols + ε", "Exactly 1"],
                    ["TG", "Strings", "One or more"],
                    ["GTG", "Regular Expressions", "One or more"],
                  ].map(([m, e, s]) => (
                    <tr key={m}>
                      <td className="border border-slate-600 px-4 py-2">{m}</td>
                      <td className="border border-slate-600 px-4 py-2">{e}</td>
                      <td className="border border-slate-600 px-4 py-2">{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Thompson's Construction ── */}
        {active === "Thompson's" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Thompson's Construction (RE → NFA)
            </h2>
            <p className="text-slate-300">
              Thompson's Construction converts a Regular Expression into an NFA
              by applying four recursive rules. Every NFA fragment has exactly
              one start state and one accept state.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <h3 className="text-yellow-300 font-semibold mb-1">
                  Rule 1 — Single Symbol a
                </h3>
                <p className="text-slate-300">
                  Create two states. Add one transition labeled a.
                </p>
                <p className="font-mono text-emerald-400 mt-1">
                  → (start) —a→ (accept)
                </p>
              </div>

              <div className="bg-slate-700 rounded p-3">
                <h3 className="text-yellow-300 font-semibold mb-1">
                  Rule 2 — Union (r | s)
                </h3>
                <p className="text-slate-300">
                  Create new start and accept. Add ε from new start to both
                  sub-NFAs. Add ε from both sub-NFA accepts to new accept.
                </p>
                <p className="font-mono text-emerald-400 mt-1">
                  → (new start) —ε→ [NFA for r] —ε→ (new accept)
                </p>
                <p className="font-mono text-emerald-400">
                  → (new start) —ε→ [NFA for s] —ε→ (new accept)
                </p>
              </div>

              <div className="bg-slate-700 rounded p-3">
                <h3 className="text-yellow-300 font-semibold mb-1">
                  Rule 3 — Concatenation (r · s)
                </h3>
                <p className="text-slate-300">
                  Connect the accept state of NFA for r to the start state of
                  NFA for s with an ε-transition.
                </p>
                <p className="font-mono text-emerald-400 mt-1">
                  [NFA for r] —ε→ [NFA for s]
                </p>
              </div>

              <div className="bg-slate-700 rounded p-3">
                <h3 className="text-yellow-300 font-semibold mb-1">
                  Rule 4 — Star (r*)
                </h3>
                <p className="text-slate-300">
                  Add new start and accept. New start connects to NFA for r and
                  directly to new accept (bypass). NFA accept loops back to NFA
                  start.
                </p>
                <p className="font-mono text-emerald-400 mt-1">
                  (new start) —ε→ [NFA for r] —ε→ (new accept)
                </p>
                <p className="font-mono text-emerald-400">
                  (new start) —ε→ (new accept) [bypass for empty]
                </p>
                <p className="font-mono text-emerald-400">
                  [NFA accept] —ε→ [NFA start] [loop]
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">
                Example — RE: a|b
              </h3>
              <p className="text-slate-300">
                Apply Rule 2 (union): new start q0, ε to q2 (start of NFA for a)
                and q4 (start of NFA for b). q3 (accept of a-NFA) and q5 (accept
                of b-NFA) both connect via ε to q1 (new accept). Total: 6
                states, 6 ε-transitions, 2 real transitions.
              </p>
            </div>
          </div>
        )}

        {/* ── RE Cheat-Sheet ── */}
        {active === "RE Cheat-Sheet" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Regular Expressions — Cheat Sheet
            </h2>
            <p className="text-slate-300">
              Regular Expressions (REs) are algebraic notation for describing
              languages. All regular languages can be expressed as a regular
              expression.
            </p>

           <table className="w-full border-collapse text-slate-300 text-xs">

              <thead>
                <tr className="bg-slate-700">
                  <th className="border border-slate-600 px-2 py-1.5 text-left">
                    Operator
                  </th>
                  <th className="border border-slate-600 px-2 py-1.5 text-left">
                    Meaning
                  </th>
                  <th className="border border-slate-600 px-2 py-1.5 text-left">
                    Example
                  </th>
                  <th className="border border-slate-600 px-2 py-1.5 text-left">
                    Accepts
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["a", "Literal symbol", "a", 'only "a"'],
                  ["ε", "Empty string", "ε", "only the empty string"],
                  ["r | s", "Union (or)", "a | b", '"a" or "b"'],
                  ["r · s", "Concatenation", "ab", '"ab" only'],
                  ["r*", "Star (zero or more)", "a*", "ε, a, aa, aaa, ..."],
                  ["r+", "Plus (one or more)", "a+", "a, aa, aaa, ..."],
                  ["r?", "Optional (zero or one)", "a?", "ε or a"],
                  ["(r)", "Grouping", "(a|b)*", "any string over {a,b}"],
                ].map(([op, meaning, ex, acc]) => (
                  <tr key={op}>
                    <td className="border border-slate-600 px-4 py-2 font-mono text-yellow-300">
                      {op}
                    </td>
                    <td className="border border-slate-600 px-4 py-2">
                      {meaning}
                    </td>
                    <td className="border border-slate-600 px-4 py-2 font-mono text-emerald-400">
                      {ex}
                    </td>
                    <td className="border border-slate-600 px-4 py-2 text-slate-400">
                      {acc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Precedence (highest to lowest)
              </h3>
              <ol className="text-slate-300 list-decimal ml-5 space-y-1">
                <li>
                  Parentheses{" "}
                  <span className="font-mono text-yellow-300">( )</span>
                </li>
                <li>
                  Star / Plus / Optional{" "}
                  <span className="font-mono text-yellow-300">* + ?</span>
                </li>
                <li>
                  Concatenation{" "}
                  <span className="font-mono text-yellow-300">·</span>{" "}
                  (implicit)
                </li>
                <li>
                  Union <span className="font-mono text-yellow-300">|</span>{" "}
                  (lowest)
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Common Patterns
              </h3>
              <table className="w-full border-collapse text-slate-300">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="border border-slate-600 px-4 py-2 text-left">
                      Language
                    </th>
                    <th className="border border-slate-600 px-4 py-2 text-left">
                      RE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["All strings over {a,b}", "(a|b)*"],
                    ["Strings starting with a", "a(a|b)*"],
                    ["Strings ending in b", "(a|b)*b"],
                    ["Strings containing ab", "(a|b)*ab(a|b)*"],
                    ["Even length strings", "((a|b)(a|b))*"],
                    ["Strings with even number of a's", "(b*ab*a)*b*"],
                  ].map(([lang, re]) => (
                    <tr key={lang}>
                      <td className="border border-slate-600 px-4 py-2">
                        {lang}
                      </td>
                      <td className="border border-slate-600 px-4 py-2 font-mono text-emerald-400">
                        {re}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CFG ── */}
        {active === "CFG" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">
              Context-Free Grammars (CFG)
            </h2>
            <p className="text-slate-300">
              A CFG is a set of production rules that generate strings. Every
              regular language can be expressed as a right-linear CFG. CFGs are
              more powerful than regular expressions — they can describe
              languages like matched parentheses that no FA can recognize.
            </p>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Formal Definition
              </h3>
              <p className="text-slate-300">
                A CFG is a 4-tuple (V, Σ, R, S) where:
              </p>
              <ul className="mt-2 space-y-1 text-slate-300 list-none ml-4">
                <li>
                  <span className="text-emerald-400">V</span> — finite set of
                  variables (non-terminals), e.g. S, A, B
                </li>
                <li>
                  <span className="text-emerald-400">Σ</span> — terminal symbols
                  (the actual alphabet), e.g. {"{a, b}"}
                </li>
                <li>
                  <span className="text-emerald-400">R</span> — production
                  rules, each of the form V → string
                </li>
                <li>
                  <span className="text-emerald-400">S</span> — start variable
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Right-Linear Grammar (DFA → CFG)
              </h3>
              <p className="text-slate-300 mb-2">
                This simulator converts a DFA to a right-linear CFG using these
                rules:
              </p>
              <ul className="text-slate-300 space-y-1 list-disc ml-5">
                <li>
                  For each transition δ(qi, a) = qj → add rule{" "}
                  <span className="font-mono text-yellow-300">qi → a qj</span>
                </li>
                <li>
                  For each accept state qi → add rule{" "}
                  <span className="font-mono text-yellow-300">qi → ε</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">
                Example — Language a|b
              </h3>
              <p className="text-slate-300 mb-2">
                DFA has states S0 (start), S1 (accept for a), S2 (accept for b)
              </p>
              <div className="font-mono text-emerald-400 space-y-1 bg-slate-700 p-3 rounded">
                <div>S0 → a S1</div>
                <div>S0 → b S2</div>
                <div>S1 → ε</div>
                <div>S2 → ε</div>
              </div>
              <p className="text-slate-400 mt-2 text-xs">
                This grammar generates exactly the strings "a" and "b" —
                matching the language a|b.
              </p>
            </div>

            <div>
              <h3 className="text-yellow-300 font-semibold mb-1">
                CFG vs Regular Grammar
              </h3>
              <p className="text-slate-300">
                A right-linear grammar (all rules of form A → aB or A → ε) is
                equivalent to a regular language. A full CFG allows rules like A
                → BC which generates context-free languages — more powerful than
                regular, less powerful than context-sensitive.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
