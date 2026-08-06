# AI Teacher — Project Agent Rules

> **MANDATORY**: Every AI agent (Claude, Gemini, Codex, Cursor, or any other) MUST follow these rules before writing any code in this repository.

---

## Architecture: Five-Folder Rule

Every file in a feature (`classroom`, `ask`, `intro`) belongs to exactly ONE of five folders:

| Folder | Contains | Examples |
|--------|----------|----------|
| `components/` | Pure UI templates — ZERO state or Redux calls | `StudentsCard.tsx`, `NavTabList.tsx` |
| `hooks/` | All state, selectors, event handlers, side effects | `useStudentsCard.ts`, `useNavTabList.ts` |
| `utilities/` | Pure helper functions (no React, no Redux) | `styleUtils.ts`, `keyboardUtils.ts` |
| `constants/` | Static mock data, defaults, config arrays | `sidebarConstants.ts`, `boardConstants.ts` |
| `types/` | TypeScript interfaces and type aliases | `sidebar.types.ts`, `topbar.types.ts` |

---

## Component Rules

1. **Use `memo()` wrapper** — `export const Foo = memo(function Foo({ ... }) { ... });`
2. **Set `displayName`** — `Foo.displayName = 'Foo';`
3. **Zero state in components** — All `useState`, `useSelector`, `useDispatch`, `useRouter` go in a custom hook
4. **No inline interfaces** — Prop interfaces go in `types/<area>.types.ts`, imported with `import type`
5. **No inline static data** — Arrays and defaults go in `constants/<area>Constants.ts`
6. **No `<div role="button">`** — Always use native `<button type="button">`
7. **Barrel exports required** — Every folder has an `index.ts` that exports everything

---

## Type Import Rule

```typescript
// ✅ CORRECT
import type { StudentsCardProps } from '../../types/sidebar.types';

// ❌ WRONG — inline interface in component file
export interface StudentsCardProps { ... }

// ❌ WRONG — imports from local shim instead of canonical types
import type { StudentsCardProps } from './sidebar.types';
```

The files `components/<sub>/sidebar.types.ts`, `topbar.types.ts`, etc. are backward-compat shims. Always import from `../../types/` directly.

---

## Constants Rule

```typescript
// ✅ CORRECT — constants/sidebarConstants.ts
export const MOCK_STUDENTS: StudentRecord[] = [ ... ];
export const DEFAULT_ATTENDANCE_SUMMARY = { total: 32, present: 28, absent: 4 };

// ❌ WRONG — mock data inside a component file
const mockStudents = [ { id: '1', ... } ]; // ← inside StudentsModal.tsx
```

---

## Utilities Rule

- The canonical folder is `utilities/` (NOT `utils/`)
- `utils/index.ts` is a shim that re-exports from `utilities/` — do NOT add new files to `utils/`
- Utilities are pure functions: no React hooks, no Redux, no side effects

---

## Styles Rule

```
src/styles/
├── globals.css         # Entry point — imports Tailwind + sub-stylesheets
├── theme.css           # @theme design tokens (colors, fonts, spacing)
├── base.css            # Resets
├── glassmorphism.css   # Glass UI utilities
├── animations.css      # Keyframe animations
└── overrides.css       # Browser/vendor overrides
```

- Feature CSS → `features/<feature>/styles/<feature>.css`
- Design tokens → `theme.css` only
- Shadcn components → `src/components/ui/` (never modify, extend via wrappers)

---

## Custom Hook Pattern

```typescript
// ✅ CORRECT
'use client';
import { useState, useCallback } from 'react';
import { DEFAULT_ATTENDANCE_SUMMARY } from '../constants/sidebarConstants';

export function useStudentsCard(options: UseStudentsCardOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const total = options.totalCount ?? DEFAULT_ATTENDANCE_SUMMARY.total;
  const toggleExpand = useCallback(() => setIsExpanded((p) => !p), []);
  return { isExpanded, total, toggleExpand };
}
```

---

## Full Reference

See `.claude/skills/ai-teacher-rules/SKILL.md` and its `references/` folder for the complete engineering rules covering folder structure, TypeScript, state management, backend Django, testing, security, naming, and anti-patterns.
