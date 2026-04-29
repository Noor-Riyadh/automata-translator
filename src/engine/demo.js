import { regexToNFA } from './thompson.js';
import { englishToRE } from './englishToRE.js';

const phrase = "Ends with ab";
const regex = englishToRE(phrase);
const nfa = regexToNFA(regex);

console.log("English phrase:", phrase);
console.log("Generated Regular Expression:", regex);
console.log("NFA Output:", JSON.stringify(nfa, null, 2));
