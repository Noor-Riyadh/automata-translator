import { tokenize, parseRE } from './lexer.js';

let _counter = 0;
const newId = () => 'q' + (_counter++);

export function regexToNFA(regex) {
  _counter = 0;
  const tokens = tokenize(regex);
  const ast    = parseRE(tokens);
  return buildNFA(ast);
}

function buildNFA(node) {
  const start  = newId();
  const accept = newId();
  const states = [
    { id: start,  label: start,  isStart: true,  isAccept: false, position: { x: 0, y: 0 } },
    { id: accept, label: accept, isStart: false, isAccept: true,  position: { x: 0, y: 0 } }
  ];
  const transitions = [];

  fill(node, start, accept, states, transitions);

  // Fix num2
  const alphabet = [
    ...new Set(
      transitions
        .map(t => t.symbol)
        .filter(s => s !== 'ε')   
    )
  ].sort();

  return {
    type: 'NFA',
    alphabet,                      
    states,
    transitions,
    meta: {}
  };
}

function fill(node, from, to, states, transitions) {
  const addState = (id) => {
    states.push({
      id, label: id,
      isStart: false, isAccept: false,
      position: { x: 0, y: 0 }
    });
  };
  const addTrans = (f, t, sym) =>
    transitions.push({ from: f, to: t, symbol: sym });

  if (node.type === 'LITERAL') {
    addTrans(from, to, node.value);

  } else if (node.type === 'EPSILON') {
    addTrans(from, to, 'ε');

  } else if (node.type === 'UNION') {
    const s1 = newId(), a1 = newId(),
          s2 = newId(), a2 = newId();
    addState(s1); addState(a1);
    addState(s2); addState(a2);
    addTrans(from, s1, 'ε'); addTrans(from, s2, 'ε');
    addTrans(a1, to, 'ε');   addTrans(a2, to, 'ε');
    fill(node.left,  s1, a1, states, transitions);
    fill(node.right, s2, a2, states, transitions);

  } else if (node.type === 'CONCAT') {
    const mid = newId();
    addState(mid);
    fill(node.left,  from, mid, states, transitions);
    fill(node.right, mid,  to,  states, transitions);

  } else if (node.type === 'STAR') {
    const s1 = newId(), a1 = newId();
    addState(s1); addState(a1);
    addTrans(from, s1, 'ε'); addTrans(from, to, 'ε');
    addTrans(a1,  s1, 'ε'); addTrans(a1,  to, 'ε');
    fill(node.child, s1, a1, states, transitions);

  } else if (node.type === 'OPT') {
    addTrans(from, to, 'ε');
    fill(node.child, from, to, states, transitions);

  } else if (node.type === 'PLUS') {
    // Fix num3 keda kolo tammam  ya noor 
    const mid = newId();
    addState(mid);
    fill(node.child, from, mid, states, transitions);  
    fill({ type: 'STAR', child: node.child },           
         mid, to, states, transitions);
  }
}