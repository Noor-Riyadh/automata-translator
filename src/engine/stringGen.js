export function generateStrings(dfa, maxLen = 5) {
  const results = [];
  const queue = [];
  const seen = new Set();

  const startState = dfa.states.find((s) => s.isStart);
  queue.push({ currentState: startState.id, path: "" });

  while (queue.length > 0) {
    const { currentState, path } = queue.shift();

    const visitKey = `${currentState}:${path.length}`;
    if (seen.has(visitKey)) continue;
    seen.add(visitKey);

    const stateObj = dfa.states.find((s) => s.id === currentState);
    if (stateObj && stateObj.isAccept) {
      results.push(path);
    }

    if (path.length >= maxLen) continue;

    const transitions = dfa.transitions.filter((t) => t.from === currentState);
    for (const t of transitions) {
      queue.push({ currentState: t.to, path: path + t.symbol });
    }
  }
  return results;
}
