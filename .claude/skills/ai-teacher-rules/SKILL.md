---
name: ai-teacher:rules
description: "Master engineering rules for the AI Teacher project. Every AI agent (Claude, Gemini, Codex, Cursor, Copilot, or any other) MUST read and follow these rules before writing any code, creating any file, or modifying any folder in this repository. Rules cover: screaming feature-based architecture, TypeScript discipline, Django services layer, security, testing requirements, naming conventions, import paths, state management, and anti-patterns to avoid."
argument-hint: "[area] e.g. frontend | backend | testing | security"
license: MIT
metadata:
  author: AI Teacher Team
  version: "1.0.0"
---

# AI Teacher — Agent Engineering Rules

> **MANDATORY**: Every AI agent MUST read this file AND the relevant reference files before generating any code.
> Ignorance of these rules is not acceptable. They exist to prevent degradation of a 9.5/10 production-grade codebase.

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

### RULE 3 — No Magic Numbers or Hardcoded Strings
All configuration values go in a `constants/` or `utilities/` file inside the feature.
```
✅ CLASSROOM_LAYOUT.teacher.positions.left   (from classroomConfig.ts)
❌ x = -3.0   ← hardcoded in a component
```

### RULE 4 — No Secrets in Code
Environment-specific values ALWAYS come from environment variables.
```
✅ os.environ.get('GEMINI_API_KEY')
❌ api_key = "AIzaSy..."   ← never
```

### RULE 5 — Every New Feature Needs Tests
A feature is not complete without at least:
- Backend: view tests + service/helper unit tests
- Frontend: constant shape tests + type contract tests

### RULE 6 — Types Go in types/ Not in Components
Never define an interface or type inside a component file if it is used by more than one file.
```
✅ import type { DiagramCommand } from '../types/classroom.types'
❌ interface DiagramCommand { ... }   ← inside a component file
```

### RULE 7 — Import from Barrel Files
When a `types/index.ts` barrel file exists, import from it.
```
✅ import type { DiagramCommand } from '@/features/classroom/types'
✅ import type { DiagramCommand } from '@/features/classroom/types/classroom.types'   (also ok)
❌ import type { DiagramCommand } from '@/features/classroom/types/classroom.types'   (if barrel exists, prefer it)
```

### RULE 8 — Document the WHY, Not the WHAT
Every file must have a module docstring. Comments explain WHY a decision was made, not what the code does.
```python
# ✅ WHY comment
# Session history is stored in-memory here, not Redis, because this is a
# single-process development server. See session_service.py for the Redis swap guide.

# ❌ WHAT comment (obvious from the code)
# Store the session in the dictionary
_sessions[session_id] = history
```

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
