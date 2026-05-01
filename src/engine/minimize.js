// minimize.js
// DFA Minimization — Table-Filling (Myhill-Nerode) Algorithm
// Step 1: Remove unreachable states
// Step 2: Build distinguishability table, mark accept vs non-accept pairs
// Step 3: Propagate marks via fixpoint iteration
// Step 4: Merge unmarked (equivalent) pairs using Union-Find
// Step 5: Rebuild AutomataObject from merged groups

// ─── Block 1 ───────────────────────────────────────────────────
function removeUnreachable(dfa) {
  const reachable = new Set();
  const queue = [dfa.states.find((s) => s.isStart).id];
  reachable.add(queue[0]);

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const t of dfa.transitions) {
      if (t.from === curr && !reachable.has(t.to)) {
        reachable.add(t.to);
        queue.push(t.to);
      }
    }
  }

  return {
    ...dfa,
    states: dfa.states.filter((s) => reachable.has(s.id)),
    transitions: dfa.transitions.filter(
      (t) => reachable.has(t.from) && reachable.has(t.to),
    ),
  };
}

// ─── Block 2 ───────────────────────────────────────────────────
function buildTable(states) {
  const n = states.length;
  const marked = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (states[i].isAccept !== states[j].isAccept) {
        marked[i][j] = true;
      }
    }
  }
  return marked;
}

// ─── Block 3 ───────────────────────────────────────────────────
function propagate(states, transitions, alphabet, marked) {
  const delta = (stateId, symbol) => {
    const t = transitions.find(
      (t) => t.from === stateId && t.symbol === symbol,
    );
    return t ? t.to : null;
  };

  const isMarked = (a, b) => {
    const i = states.findIndex((s) => s.id === a);
    const j = states.findIndex((s) => s.id === b);
    if (i === j) return false;
    const lo = Math.min(i, j),
      hi = Math.max(i, j);
    return marked[lo][hi];
  };

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        if (marked[i][j]) continue;
        for (const sym of alphabet) {
          const di = delta(states[i].id, sym);
          const dj = delta(states[j].id, sym);
          if (di === dj) continue;
          if (di === null || dj === null || isMarked(di, dj)) {
            marked[i][j] = true;
            changed = true;
            break;
          }
        }
      }
    }
  }
  return marked;
}

// ─── Block 4 ───────────────────────────────────────────────────
function mergeStates(states, marked) {
  const rep = {};
  states.forEach((s) => {
    rep[s.id] = s.id;
  });

  const find = (id) => {
    while (rep[id] !== id) id = rep[id];
    return id;
  };

  for (let i = 0; i < states.length; i++) {
    for (let j = i + 1; j < states.length; j++) {
      if (!marked[i][j]) {
        rep[find(states[j].id)] = find(states[i].id);
      }
    }
  }

  const groups = new Map();
  for (const s of states) {
    const r = find(s.id);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(s.id);
  }

  return { find, groups };
}

// ─── Block 5 ───────────────────────────────────────────────────
function buildMinimized(dfa, states, transitions, find, groups) {
  const minStates = [];
  for (const [repId, members] of groups) {
    minStates.push({
      id: repId,
      label: repId,
      isStart: members.some((id) => states.find((s) => s.id === id)?.isStart),
      isAccept: members.some((id) => states.find((s) => s.id === id)?.isAccept),
      position: { x: 0, y: 0 },
    });
  }

  const seen = new Set();
  const minTrans = [];
  for (const t of transitions) {
    const from = find(t.from);
    const to = find(t.to);
    const key = `${from}:${t.symbol}`;
    if (!seen.has(key)) {
      seen.add(key);
      minTrans.push({ from, to, symbol: t.symbol });
    }
  }

  return {
    type: "DFA",
    alphabet: dfa.alphabet,
    states: minStates,
    transitions: minTrans,
    meta: {
      sourceRE: dfa.meta?.sourceRE ?? "",
      description: "Minimized DFA via Table-Filling (Myhill-Nerode)",
    },
  };
}

// ─── Public export ─────────────────────────────────────────────
export function minimizeDFA(dfa) {
  const trimmed = removeUnreachable(dfa);
  const { states, transitions, alphabet } = trimmed;

  const marked = buildTable(states);
  propagate(states, transitions, alphabet, marked);

  const { find, groups } = mergeStates(states, marked);
  return buildMinimized(dfa, states, transitions, find, groups);
}
