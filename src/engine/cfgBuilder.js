export function dfaToCFG(dfa) {
  const rules = [];
  dfa.states.forEach((state) => {
    const transitions = dfa.transitions.filter((t) => t.from === state.id);
    transitions.forEach((t) => {
      const symbol = t.label || "";
      rules.push(`${state.label} → ${symbol} ${t.to}`);
    });
    if (state.isAccept) {
      rules.push(`${state.label} → ε`);
    }
  });
  return { rules };
}
