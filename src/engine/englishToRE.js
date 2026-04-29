const TEMPLATES = [
  {
    test: s => /^starts?\s+with\s+(.+)/i.test(s),
    toRE: s => s.match(/^starts?\s+with\s+(.+)/i)[1].trim() + '(a+b)*'
  },
  {
    test: s => /^ends?\s+with\s+(.+)/i.test(s),
    toRE: s => '(a+b)*' + s.match(/^ends?\s+with\s+(.+)/i)[1].trim()
  },
  {
    test: s => /contains?\s+(?:the\s+)?substring\s+(.+)/i.test(s),
    toRE: s => {
      const x = s.match(/contains?\s+(?:the\s+)?substring\s+(.+)/i)[1].trim();
      return '(a+b)*' + x + '(a+b)*';
    }
  },
  {
    test: s => /exactly\s+length\s+(\d+)/i.test(s),
    toRE: s => {
      const n = parseInt(s.match(/exactly\s+length\s+(\d+)/i)[1]);
      return '(a+b)'.repeat(n);
    }
  },
  {
    test: s => /even\s+number\s+of\s+([a-z])/i.test(s),
    toRE: s => {
      const x = s.match(/even\s+number\s+of\s+([a-z])/i)[1];
      return '(' + x + x + ')*';
    }
  },
  {
    test: s => /even[\s-]?even/i.test(s),
    toRE: () => '(aa+bb+(ab+ba)(aa+bb)*(ab+ba))*'
  }
];

export function englishToRE(phrase) {
  for (const t of TEMPLATES) {
    if (t.test(phrase)) return t.toRE(phrase);
  }
  return null;
}