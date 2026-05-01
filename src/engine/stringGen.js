export function generateStrings(dfa, maxLen = 5) {
  const results = [];
  const queue = [];
  const seen = new Set();

  const startState = dfa.states.find((s) => s.isStart);
  if (!startState) return results;

  queue.push({ currentState: startState.id, path: "" });

  while (queue.length > 0) {
    const { currentState, path } = queue.shift();

    if (currentState === "" || currentState === "∅") continue;

    const visitKey = `${currentState}:${path.length}`;
    if (seen.has(visitKey)) continue;
    seen.add(visitKey);

    const stateObj = dfa.states.find((s) => s.id === currentState);
    if (!stateObj) continue;

    if (stateObj.isAccept) {
      results.push(path === "" ? "ε" : path);
    }

    if (path.length < maxLen) {
      const outgoing = dfa.transitions.filter(
        (t) => t.from === currentState && t.to !== "" && t.to !== "∅",
      );
      for (const t of outgoing) {
        queue.push({ currentState: t.to, path: path + t.symbol });
      }
    }
  }

  return results;
}
