export function dfaToCFG(dfa) {
  const rules = [];
  for (const t of dfa.transitions) {
    rules.push(`${t.from} → ${t.symbol} ${t.to}`);
  }

  for (const s of dfa.states) {
    if (s.isAccept) {
      rules.push(`${s.id} → ε`);
    }
  }
  return { rules };
}
