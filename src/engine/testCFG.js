import { dfaToCFG } from "./cfgBuilder.js";

// Same Example 5 from your TOCL03 lecture
const dfa = {
  states: [
    { id: "1", label: "1", isStart: true, isAccept: true },
    { id: "2", label: "2", isStart: false, isAccept: false },
  ],
  transitions: [
    { from: "1", to: "2", symbol: "a" },
    { from: "1", to: "2", symbol: "b" },
    { from: "2", to: "1", symbol: "a" },
    { from: "2", to: "1", symbol: "b" },
  ],
};

const result = dfaToCFG(dfa);

console.log("CFG Production Rules:");
result.rules.forEach((r) => console.log(" ", r));
