---
name: ai-teacher:rules
description: "Master engineering rules for the AI Teacher project. Every AI agent (Claude, Gemini, Codex, Cursor, Copilot, or any other) MUST read and follow these rules before writing any code, creating any file, or modifying any folder in this repository. Rules cover: screaming feature-based architecture, component decomposition, custom hooks, TypeScript discipline, constants, utilities, styles folder, shadcn usage, accessibility, Django services layer, security, testing requirements, naming conventions, import paths, state management, and anti-patterns to avoid."
argument-hint: "[area] e.g. frontend | backend | testing | security | components | hooks | types"
license: MIT
metadata:
  author: AI Teacher Team
  version: "2.0.0"
---

# AI Teacher — Agent Engineering Rules

> **MANDATORY**: Every AI agent MUST read this file AND the relevant reference files before generating any code.
> Ignorance of these rules is not acceptable. They exist to prevent degradation of a production-grade codebase.

---

## 🔴 CRITICAL: Read First

Before writing ANY code, answer these three questions:

1. **Which feature does this belong to?** → `intro`, `ask`, or `classroom`
2. **Is it feature-specific or genuinely shared?** → Feature-specific goes inside the feature folder. Shared goes in `shared/`.
3. **Does a similar pattern already exist?** → Read the existing file first. Extend the pattern, do not invent a new one.

---

## Quick Reference — Rule Set Index

| Area | Reference File | Must Read When |
|------|---------------|----------------|
| Folder Structure | `references/folder-structure.md` | Creating any new file or folder |
| TypeScript Rules | `references/typescript-rules.md` | Writing any `.ts` or `.tsx` file |
| Frontend Components | `references/frontend-components.md` | Creating React components or hooks |
| State Management | `references/state-management.md` | Using Redux or Zustand |
| Backend Django | `references/backend-rules.md` | Modifying any Python file |
| Testing | `references/testing-rules.md` | Writing or skipping tests |
| Security | `references/security-rules.md` | Touching settings, env, auth, or API |
| Naming Conventions | `references/naming-conventions.md` | Naming any file, function, or variable |
| Anti-Patterns | `references/anti-patterns.md` | Always — these are never acceptable |

---

## Non-Negotiable Rules (Apply Everywhere)

### RULE 1 — Read Before You Write
Before creating a file, read the existing file in the same feature folder that is most similar to what you are about to create. Match its structure, import style, and naming exactly.

### RULE 2 — Feature Owns Everything
If a file serves only one feature, it lives inside that feature's folder. No exceptions.
```
✅ features/classroom/hooks/useChunkPlayer.ts
❌ hooks/useChunkPlayer.ts   ← wrong, not shared
```

### RULE 3 — Five-Folder Rule (Frontend Feature Modules)
Every file in a feature belongs to exactly ONE of five folders:

| Folder | Contains |
|--------|----------|
| `components/` | Pure UI templates — zero useState/useSelector |
| `hooks/` | All state, selectors, event handlers, side effects |
| `utilities/` | Pure helper functions (no React, no Redux) |
| `constants/` | Static mock data, default values, config arrays |
| `types/` | TypeScript interfaces and type aliases |

### RULE 4 — No Inline Interfaces
Component prop interfaces NEVER go inside component files. They go in `types/<area>.types.ts`.
```typescript
// ✅ CORRECT
import type { StudentsCardProps } from '../../types/sidebar.types';

// ❌ WRONG
export interface StudentsCardProps { ... }  // inside StudentsCard.tsx
```

### RULE 5 — No State in Components
Components must be 100% pure presentation. All `useState`, `useSelector`, `useDispatch`, `useRouter` calls go in a custom hook in `hooks/`.

### RULE 6 — Static Data Belongs in Constants
Mock data arrays, default values, and configuration lists NEVER live in component files.
```typescript
// ✅ CORRECT — constants/sidebarConstants.ts
export const MOCK_STUDENTS: StudentRecord[] = [ ... ];

// ❌ WRONG — inside StudentsModal.tsx
const mockStudents = [ ... ];
```

### RULE 7 — No Magic Numbers or Hardcoded Strings
All configuration values go in `constants/` or `utilities/` inside the feature.

### RULE 8 — Every Component Uses memo() and displayName
```tsx
export const Foo = memo(function Foo({ ... }: FooProps) { ... });
Foo.displayName = 'Foo';
```

### RULE 9 — No `<div role="button">` (Accessibility)
Always use native `<button type="button">`. Divs are not keyboard-focusable.

### RULE 10 — Barrel Index Files Are Required
Every folder (`hooks/`, `types/`, `constants/`, `utilities/`, each component sub-group) MUST have an `index.ts` that exports everything inside it.

### RULE 11 — No Secrets in Code
Environment-specific values ALWAYS come from environment variables.

### RULE 12 — `utils/` Is a Shim — Do Not Add Files to It
The canonical utilities folder is `utilities/`. The `utils/index.ts` only exists as a compatibility re-export shim. All new utility code goes in `utilities/`.

### RULE 13 — Shadcn Components Live in `src/components/ui/`
Never modify shadcn source files. Extend them via wrapper components.

---

## Sub-skill Routing

| Task | Reference File |
|------|---------------|
| Adding a new feature folder | `references/folder-structure.md` |
| Writing a React component | `references/frontend-components.md` |
| Writing a custom hook | `references/frontend-components.md` |
| Adding to Redux store | `references/state-management.md` |
| Writing a Django view | `references/backend-rules.md` |
| Extracting a Django service | `references/backend-rules.md` |
| Writing tests | `references/testing-rules.md` |
| Touching `.env` or `settings.py` | `references/security-rules.md` |
| Naming anything | `references/naming-conventions.md` |
| Reviewing your own output | `references/anti-patterns.md` |
