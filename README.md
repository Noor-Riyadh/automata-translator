<div align="center">

# 🤖 Universal Automata Translator & Simulator

**A web-based tool that accepts any formal language representation and automatically generates the other four equivalent forms — with live interactive visualization.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)


[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-emerald?style=for-the-badge&color=10b981)](https://automata-translator.vercel.app/)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Open_Issue-red?style=for-the-badge&color=ef4444)](https://github.com/Noor-Riyadh/automata-translator/issues)
[![Course](https://img.shields.io/badge/🎓_CS416-Future_University-blue?style=for-the-badge&color=3b82f6)](https://fue.edu.eg)
</div>

---

## 📖 Overview

The **Universal Automata Translator & Simulator (UAT)** is a Theory of Computing educational tool built for **CS416 at Future University in Egypt**. It implements the complete formal language pipeline — converting between all five representations of a regular language and visualizing each automaton interactively.

### The Five Representations

| # | Representation | Description |
|---|---|---|
| 1 | **Regular Expression** | Algebraic notation e.g. `(a\|b)*abb` |
| 2 | **English Phrase** | Human-readable e.g. "Starts with ab" |
| 3 | **NFA** | Non-deterministic Finite Automaton with ε-transitions |
| 4 | **DFA** | Deterministic Finite Automaton |
| 5 | **CFG** | Right-linear Context-Free Grammar |

---

## ✨ Features

-  **Full Pipeline** — RE → NFA → DFA → Minimized DFA → CFG → RE
-  **English Input** — 6 supported phrase templates mapped to REs
-  **Interactive Canvas** — Live automaton diagrams with dagre auto-layout
-  **Step Simulator** — Trace string acceptance state by state
-  **Results Panel** — Accepted strings, CFG rules, RE output side by side
-  **Theory Wiki** — 6-tab reference guide covering DFA, NFA, TG/GTG, Thompson's Construction, RE, and CFG
-  **Golden Test Suite** — Automated tests against 4 pre-built reference machines
-  **Example Machines** — Load ends-in-ab, even-even, divisible-by-3, palindrome instantly

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- Git ≥ 2.40

### Installation

```bash
# Clone the repository
git clone https://github.com/Noor-Riyadh/automata-translator.git

# Enter the project directory
cd automata-translator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Run Tests

```bash
npm run test
```

---

## 🏗️ Architecture

```
src/
├── engine/                 # Core algorithms (Members 1 & 2)
│   ├── lexer.js            # RE tokenizer + recursive descent parser
│   ├── thompson.js         # Thompson's Construction (RE → NFA)
│   ├── englishToRE.js      # English phrase → RE template mapper
│   ├── subset.js           # Subset Construction (NFA → DFA)
│   ├── minimize.js         # Table-Filling minimization (Myhill-Nerode)
│   ├── stringGen.js        # BFS string generator
│   ├── cfgBuilder.js       # DFA → Right-linear CFG
│   └── stateElim.js        # GNFA State Elimination (DFA → RE)
│
├── canvas/                 # Interactive visualization (Member 3)
│   └── AutomataCanvas.jsx  # dagre-powered React canvas
│
├── wiki/                   # Theory reference + tests (Member 4)
│   ├── TheoryWiki.jsx      # 6-tab theory guide
│   ├── TestSuite.js        # Golden test cases (Vitest)
│   └── machines/           # Pre-built AutomataObject JSON files
│       ├── ends_in_ab.json
│       ├── even_even.json
│       ├── divisible_by_3.json
│       └── palindrome.json
│
├── App.jsx                 # Main application + pipeline wiring
└── main.jsx                # React entry point
```

---

## 🔬 Algorithms Implemented

| Algorithm | File | Complexity |
|---|---|---|
| Thompson's Construction | `thompson.js` | O(n) states |
| Subset Construction | `subset.js` | O(2ⁿ) worst case |
| Table-Filling (Myhill-Nerode) | `minimize.js` | O(n² \|Σ\|) |
| BFS String Generation | `stringGen.js` | O(b^d) |
| Right-Linear CFG | `cfgBuilder.js` | O(n + m) |
| GNFA State Elimination | `stateElim.js` | O(n³) |

---

## 🧪 Supported English Phrases

| Pattern | Example Input | Generated RE |
|---|---|---|
| Starts with X | "Starts with ab" | `ab(a\|b)*` |
| Ends with X | "Ends with ba" | `(a\|b)*ba` |
| Contains substring X | "Contains substring aba" | `(a\|b)*aba(a\|b)*` |
| Exactly length N | "Exactly length 3" | `(a\|b)(a\|b)(a\|b)` |
| Even number of X | "Even number of a" | `(aa)*` |
| Even-even language | "even-even language" | `(aa\|bb\|(ab\|ba)(aa\|bb)*(ab\|ba))*` |

---

## 👥 Team

| Member | Role | Responsibilities |
|---|---|---|
| **Noor Riyadh** | Team Lead & Engine Core | `subset.js`, `minimize.js`, `stringGen.js`, `cfgBuilder.js`, `stateElim.js`, integration |
| **Manar Azzam** | Engine Input Layer | `lexer.js`, `thompson.js`, `englishToRE.js` |
| **Rawan Ayman** | Canvas & UI | `AutomataCanvas.jsx`, `App.jsx`, three-panel layout |
| **Hala** | Wiki & Testing | `TheoryWiki.jsx`, `TestSuite.js`, machine JSON files |

---

## 📚 Course Information

- **Course:** CS416 — Theory of Computing
- **Instructor:** Assoc. Prof. Osama Fathy
- **Institution:** Future University in Egypt — Faculty of Computers & IT
- **Semester:** Spring 2026

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** — Frontend framework and build tool
- **Tailwind CSS** — Utility-first styling
- **dagre** — Automatic graph layout for automata diagrams
- **Vitest** — Unit testing framework

---

## 📄 License

This project was built for academic purposes as part of CS416 coursework at Future University in Egypt.