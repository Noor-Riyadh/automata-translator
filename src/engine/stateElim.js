// stateElim.js
// DFA → Regular Expression via GNFA State Elimination
// Algorithm: add new start + accept, remove states one by one,
// update transition labels with union/concat of regex strings

export function dfaToRegex(dfa) {
  const labels = {};

  const set = (from, to, re) => {
    if (!labels[from]) labels[from] = {};
    labels[from][to] = labels[from][to] ? `(${labels[from][to]})|(${re})` : re;
  };

  const get = (from, to) => labels[from]?.[to] ?? null;

  const START = "__START__";
  const ACCEPT = "__ACCEPT__";
  const allStates = [START, ...dfa.states.map((s) => s.id), ACCEPT];

  const origStart = dfa.states.find((s) => s.isStart).id;
  set(START, origStart, "ε");

  for (const s of dfa.states) {
    if (s.isAccept) set(s.id, ACCEPT, "ε");
  }

  for (const t of dfa.transitions) {
    set(t.from, t.to, t.symbol);
  }

  const toElim = dfa.states.map((s) => s.id);

  for (const elim of toElim) {
    const states = allStates.filter((s) => s !== elim);
    const loop = get(elim, elim);

    for (const qi of states) {
      const qiToElim = get(qi, elim);
      if (!qiToElim) continue;

      for (const qj of states) {
        const elimToQj = get(elim, qj);
        if (!elimToQj) continue;

        const loopPart = loop ? `(${loop})*` : "";
        const newPart = `(${qiToElim})${loopPart}(${elimToQj})`;
        set(qi, qj, newPart);
      }
    }

    delete labels[elim];
    for (const s of states) {
      if (labels[s]) delete labels[s][elim];
    }
  }
  // Simplify common patterns in the generated RE string
  function simplify(re) {
    if (!re) return re;

    let prev = null;
    while (prev !== re) {
      prev = re;

      // Remove double ε: (ε)ε → ε
      re = re.replace(/\(ε\)ε/g, "ε");

      // Remove wrapping parens around single char: (a) → a
      re = re.replace(/\(([a-z0-9ε])\)/g, "$1");

      // Remove ε concatenation: εX → X and Xε → X
      re = re.replace(/ε([^*+?|)(\s])/g, "$1");
      re = re.replace(/([^*+?|)(\s])ε/g, "$1");

      // Remove empty union branches: (|X) → X and (X|) → X
      re = re.replace(/\(\|([^)]+)\)/g, "($1)");
      re = re.replace(/\(([^)]+)\|\)/g, "($1)");

      // Collapse (X)* → X* for single chars
      re = re.replace(/\(([a-z0-9ε])\)\*/g, "$1*");

      // Remove double parens: ((X)) → (X)
      re = re.replace(/\(\(([^()]+)\)\)/g, "($1)");
    }

    return re;
  }

  return simplify(get(START, ACCEPT) ?? "ε");

}
