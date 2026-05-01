export function dfaToCFG(dfa) {
  const rules = [];

  for (const t of dfa.transitions) {
    // Skip transitions involving the dead state
    if (t.from === "∅" || t.to === "∅") continue;
    rules.push(`${t.from} → ${t.symbol} ${t.to}`);
  }

  for (const s of dfa.states) {
    // Skip dead state, only add ε for accept states
    if (s.id === "∅") continue;
    if (s.isAccept) {
      rules.push(`${s.id} → ε`);
    }
  }

  return { rules };
}
