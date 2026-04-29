import { describe, it, expect } from 'vitest';
import { tokenize, parseRE }   from './lexer.js';
import { regexToNFA }           from './thompson.js';
import { englishToRE }          from './englishToRE.js';

describe('englishToRE', () => {
  it('starts with', ()  => expect(englishToRE('Starts with ab')).toBe('ab(a+b)*'));
  it('ends with',   ()  => expect(englishToRE('Ends with ba')).toBe('(a+b)*ba'));
  it('contains',    ()  => expect(englishToRE('Contains substring aba')).toBe('(a+b)*aba(a+b)*'));
  it('length 3',    ()  => expect(englishToRE('Exactly length 3')).toBe('(a+b)(a+b)(a+b)'));
  it('even a',      ()  => expect(englishToRE('Even number of a')).toBe('(aa)*'));
  it('even-even',   ()  => expect(englishToRE('even-even language')).toBe('(aa+bb+(ab+ba)(aa+bb)*(ab+ba))*'));
  it('no match',    ()  => expect(englishToRE('random phrase')).toBeNull());
});

describe('lexer tokenize', () => {
  it('tokenizes a simple RE', () => {
    const t = tokenize('a|b');
    expect(t).toEqual([
      { type: 'LITERAL', value: 'a' },
      { type: 'UNION' },
      { type: 'LITERAL', value: 'b' }
    ]);
  });
});

describe('regexToNFA', () => {
  it('produces a valid AutomataObject for "a"', () => {
    const nfa = regexToNFA('a');
    expect(nfa.type).toBe('NFA');
    expect(nfa.states.filter(s => s.isStart).length).toBe(1);
    expect(nfa.states.filter(s => s.isAccept).length).toBe(1);
    expect(nfa.transitions.some(t => t.symbol === 'a')).toBe(true);
  });

  it('produces ε-transitions for union', () => {
    const nfa = regexToNFA('a|b');
    expect(nfa.transitions.some(t => t.symbol === 'ε')).toBe(true);
  });

  it('handles star operator', () => {
    const nfa = regexToNFA('a*');
    expect(nfa.transitions.length).toBeGreaterThan(1);
  });
});
