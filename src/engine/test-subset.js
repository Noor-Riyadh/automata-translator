// test-subset.js
// Smoke tests for nfaToDFA — run with: npm run test
import { regexToNFA } from "./thompson.js";
import { nfaToDFA } from "./subset.js";

// ── Helper ──────────────────────────────────────────────────────
function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  PASS: ${message}`);
}

// ── Test 1: Basic shape — a|b ────────────────────────────────────
console.log('\nTest 1: nfaToDFA(regexToNFA("a|b"))');
const dfa1 = nfaToDFA(regexToNFA("a|b"));

assert(dfa1.type === "DFA", 'type must be "DFA"');

assert(
  dfa1.states.filter((s) => s.isStart).length === 1,
  "exactly one start state",
);

assert(
  dfa1.states.filter((s) => s.isAccept).length >= 1,
  "at least one accept state",
);

assert(
  dfa1.states.every((s) => "id" in s && "label" in s && "position" in s),
  "every state has id, label, position fields",
);

assert(
  dfa1.transitions.every((t) => "from" in t && "to" in t && "symbol" in t),
  "every transition has from, to, symbol fields",
);

// ── Test 2: Determinism — each state has at most one transition per symbol ──
console.log("\nTest 2: DFA is deterministic");
for (const state of dfa1.states) {
  const symbols = dfa1.transitions
    .filter((t) => t.from === state.id)
    .map((t) => t.symbol);
  const unique = new Set(symbols);
  assert(
    symbols.length === unique.size,
    `state "${state.label}" has no duplicate transitions`,
  );
}

// ── Test 3: Accept states are correct ───────────────────────────
// For a|b: strings "a" and "b" should be accepted,
// "" (empty) and "ab" should NOT be accepted by the minimal DFA.
console.log("\nTest 3: Accept state membership");
const nfaAcceptIds = new Set(
  regexToNFA("a|b")
    .states.filter((s) => s.isAccept)
    .map((s) => s.id),
);
const acceptStates = dfa1.states.filter((s) => s.isAccept);
assert(acceptStates.length > 0, "DFA has accept states");
assert(
  acceptStates.every((s) => s.id.split(",").some((id) => nfaAcceptIds.has(id))),
  "every DFA accept state contains an NFA accept state",
);

// ── Test 4: Concat — ab ──────────────────────────────────────────
console.log('\nTest 4: nfaToDFA(regexToNFA("ab"))');
const dfa2 = nfaToDFA(regexToNFA("ab"));
assert(dfa2.type === "DFA", "type is DFA");
assert(dfa2.states.filter((s) => s.isStart).length === 1, "one start state");

// ── Test 5: Star — a* ────────────────────────────────────────────
console.log('\nTest 5: nfaToDFA(regexToNFA("a*"))');
const dfa3 = nfaToDFA(regexToNFA("a*"));
assert(dfa3.type === "DFA", "type is DFA");
// a* accepts empty string, so start state must be accepting
assert(
  dfa3.states.find((s) => s.isStart).isAccept === true,
  "start state is accepting for a* (accepts empty string)",
);

console.log("\n All tests passed.\n");
