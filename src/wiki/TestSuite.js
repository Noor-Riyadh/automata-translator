import { describe, it, expect } from "vitest";
import { tokenize, parseRE } from "../engine/lexer.js";
import { regexToNFA } from "../engine/thompson.js";
import { nfaToDFA } from "../engine/subset.js";
import { testString } from "../engine/subset.js";
import { englishToRE } from "../engine/englishToRE.js";
import endsInAb from "./machines/ends_in_ab.json";
import evenEven from "./machines/even_even.json";
import divBy3 from "./machines/divisible_by_3.json";
import palindrome from "./machines/palindrome.json";

// ── englishToRE ──────────────────────────────────────────────
describe("englishToRE", () => {
  it("starts with", () =>
    expect(englishToRE("Starts with ab")).toBe("ab(a+b)*"));
  it("ends with", () => expect(englishToRE("Ends with ba")).toBe("(a+b)*ba"));
  it("contains", () =>
    expect(englishToRE("Contains substring aba")).toBe("(a+b)*aba(a+b)*"));
  it("length 3", () =>
    expect(englishToRE("Exactly length 3")).toBe("(a+b)(a+b)(a+b)"));
  it("even a", () => expect(englishToRE("Even number of a")).toBe("(aa)*"));
  it("even-even", () =>
    expect(englishToRE("even-even language")).toBe(
      "(aa+bb+(ab+ba)(aa+bb)*(ab+ba))*",
    ));
  it("no match", () => expect(englishToRE("random phrase")).toBeNull());
});

// ── lexer ────────────────────────────────────────────────────
describe("lexer tokenize", () => {
  it("tokenizes a|b", () => {
    expect(tokenize("a|b")).toEqual([
      { type: "LITERAL", value: "a" },
      { type: "UNION" },
      { type: "LITERAL", value: "b" },
    ]);
  });
  it("tokenizes a*", () => {
    expect(tokenize("a*")).toEqual([
      { type: "LITERAL", value: "a" },
      { type: "STAR" },
    ]);
  });
});

// ── regexToNFA ───────────────────────────────────────────────
describe("regexToNFA", () => {
  it('valid AutomataObject for "a"', () => {
    const nfa = regexToNFA("a");
    expect(nfa.type).toBe("NFA");
    expect(nfa.states.filter((s) => s.isStart).length).toBe(1);
    expect(nfa.states.filter((s) => s.isAccept).length).toBe(1);
    expect(nfa.transitions.some((t) => t.symbol === "a")).toBe(true);
  });
  it("ε-transitions for union", () => {
    const nfa = regexToNFA("a|b");
    expect(nfa.transitions.some((t) => t.symbol === "ε")).toBe(true);
  });
  it("handles star operator", () => {
    const nfa = regexToNFA("a*");
    expect(nfa.transitions.length).toBeGreaterThan(1);
  });
});

// ── Golden machines — ends_in_ab ─────────────────────────────
describe("ends_in_ab machine", () => {
  it('accepts "ab"', () => expect(testString(endsInAb, "ab")).toBe(true));
  it('accepts "aab"', () => expect(testString(endsInAb, "aab")).toBe(true));
  it('accepts "bab"', () => expect(testString(endsInAb, "bab")).toBe(true));
  it('rejects "a"', () => expect(testString(endsInAb, "a")).toBe(false));
  it('rejects "ba"', () => expect(testString(endsInAb, "ba")).toBe(false));
  it('rejects ""', () => expect(testString(endsInAb, "")).toBe(false));
});

// ── Golden machines — even_even ──────────────────────────────
describe("even_even machine", () => {
  it('accepts "" (empty)', () => expect(testString(evenEven, "")).toBe(true));
  it('accepts "aabb"', () => expect(testString(evenEven, "aabb")).toBe(true));
  it('accepts "bbaa"', () => expect(testString(evenEven, "bbaa")).toBe(true));
  it('rejects "a"', () => expect(testString(evenEven, "a")).toBe(false));
  it('rejects "ab"', () => expect(testString(evenEven, "ab")).toBe(false));
});

// ── Golden machines — divisible_by_3 ────────────────────────
describe("divisible_by_3 machine", () => {
  it('accepts "0"', () => expect(testString(divBy3, "0")).toBe(true));
  it('accepts "11"', () => expect(testString(divBy3, "11")).toBe(true));
  it('accepts "110"', () => expect(testString(divBy3, "110")).toBe(true));
  it('accepts "1001"', () => expect(testString(divBy3, "1001")).toBe(true));
  it('rejects "1"', () => expect(testString(divBy3, "1")).toBe(false));
  it('rejects "10"', () => expect(testString(divBy3, "10")).toBe(false));
});

// ── Golden machines — palindrome ─────────────────────────────
describe("palindrome machine (simplified)", () => {
  it('accepts "" (empty)', () => expect(testString(palindrome, "")).toBe(true));
  it('accepts "a"', () => expect(testString(palindrome, "a")).toBe(true));
  it('accepts "b"', () => expect(testString(palindrome, "b")).toBe(true));
  it('accepts "aa"', () => expect(testString(palindrome, "aa")).toBe(true));
  it('accepts "bb"', () => expect(testString(palindrome, "bb")).toBe(true));
  it('rejects "ab"', () => expect(testString(palindrome, "ab")).toBe(false));
  it('rejects "aba"', () => expect(testString(palindrome, "aba")).toBe(false));
});
