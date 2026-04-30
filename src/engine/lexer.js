export function tokenize(regex) {
  const tokens = [];
  for (const ch of regex) {
    if (/[a-z0-9]/.test(ch)) tokens.push({ type: 'LITERAL', value: ch });
    else if (ch === '|')           tokens.push({ type: 'UNION' });
    else if (ch === '+')           tokens.push({ type: 'PLUS' });   //  that fixed for error num1 okay noor 
    else if (ch === '*')           tokens.push({ type: 'STAR' });
    else if (ch === '?')           tokens.push({ type: 'OPT' });
    else if (ch === '(')           tokens.push({ type: 'LPAREN' });
    else if (ch === ')')           tokens.push({ type: 'RPAREN' });
    else if (ch === 'ε')           tokens.push({ type: 'EPSILON' });
  }
  return tokens;
}

function parseUnion(tokens, pos) {
  let [left, p] = parseConcat(tokens, pos);
  while (p < tokens.length && tokens[p].type === 'UNION') {
    p++;
    const [right, p2] = parseConcat(tokens, p);
    left = { type: 'UNION', left, right };
    p = p2;
  }
  return [left, p];
}

function parseConcat(tokens, pos) {
  let [left, p] = parseStar(tokens, pos);
  while (
    p < tokens.length &&
    ['LITERAL', 'LPAREN', 'EPSILON'].includes(tokens[p].type)
  ) {
    const [right, p2] = parseStar(tokens, p);
    left = { type: 'CONCAT', left, right };
    p = p2;
  }
  return [left, p];
}

function parseStar(tokens, pos) {
  let [node, p] = parseAtom(tokens, pos);
  while (
    p < tokens.length &&
    ['STAR', 'OPT', 'PLUS'].includes(tokens[p].type)  // ← PLUS added here
  ) {
    node = { type: tokens[p].type, child: node };
    p++;
  }
  return [node, p];
}

function parseAtom(tokens, pos) {
  if (pos >= tokens.length) throw new Error('Unexpected end of input');
  const tk = tokens[pos];
  if (tk.type === 'LITERAL') return [{ type: 'LITERAL', value: tk.value }, pos + 1];
  if (tk.type === 'EPSILON') return [{ type: 'EPSILON' }, pos + 1];
  if (tk.type === 'LPAREN') {
    const [inner, p] = parseUnion(tokens, pos + 1);
    if (p >= tokens.length || tokens[p].type !== 'RPAREN')
      throw new Error('Missing closing parenthesis');
    return [inner, p + 1];
  }
  throw new Error('Unexpected token: ' + tk.type);
}

export function parseRE(tokens) {
  const [ast, pos] = parseUnion(tokens, 0);
  if (pos < tokens.length) throw new Error('Unexpected token after end');
  return ast;
}