import { generateStrings } from "./stringGen.js";

// This is EXACTLY Example 5 from your TOCL03 lecture
// State 1 = ± (start AND accept)
// State 2 = plain circle (not accept)
// Language = all strings with even number of total letters

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

const result = generateStrings(dfa, 4);
console.log("Accepted strings:", result);
