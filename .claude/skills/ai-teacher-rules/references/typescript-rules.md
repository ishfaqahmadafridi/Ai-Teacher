# TypeScript Rules

> Read this before writing any `.ts` or `.tsx` file in this project.

---

## 1. Types Belong in `types/` — Never Inline in Components

If an interface or type is used by more than one file, it MUST live in the feature's `types/` folder.

```typescript
// ✅ CORRECT — type defined in its own file, exported cleanly
// features/classroom/types/classroom.types.ts
export interface DiagramCommand {
  action: 'none' | 'highlight' | 'rotate' | 'zoom' | 'show_formula' | 'pause_and_explain';
  target?: string;
  speed?: 'slow' | 'fast';
  formula?: string;
}

// ✅ CORRECT — imported from barrel
import type { DiagramCommand } from '@/features/classroom/types';

// ❌ WRONG — type defined inside a component
// features/classroom/components/DiagramCanvas.tsx
interface DiagramCommand {   // ← never do this for shared types
  action: string;
}
```

---

## 2. Always Use `import type` for Type-Only Imports

Type imports are erased at compile time. Using `import type` makes this explicit and enables tree-shaking.

```typescript
// ✅ CORRECT
import type { DiagramCommand, DiagramType } from '../types/classroom.types';
import type { RootState } from '@/store';

// ❌ WRONG — value import for something that is only a type
import { DiagramCommand } from '../types/classroom.types';
```

---

## 3. Use `as const` for Configuration Objects

Configuration objects with fixed values must use `as const` so TypeScript infers the narrowest literal types.

```typescript
// ✅ CORRECT
export const CLASSROOM_LAYOUT = {
  teacher: {
    positions: { left: -3.0, right: 3.0, center: 0 },
  },
} as const;

// Derive types from the const — never duplicate
export type TeacherXPosition =
  (typeof CLASSROOM_LAYOUT.teacher.positions)[keyof typeof CLASSROOM_LAYOUT.teacher.positions];

// ❌ WRONG — manually declaring a type that duplicates the const
type TeacherXPosition = -3.0 | 3.0 | 0;  // can get out of sync
```

---

## 4. Typed Redux Hooks — Always Use `useAppDispatch` and `useAppSelector`

Never use raw `useDispatch` or `useSelector` from react-redux.

```typescript
// ✅ CORRECT — typed hooks from the global hooks file
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';

// ❌ WRONG — untyped, loses RootState inference
import { useDispatch, useSelector } from 'react-redux';
```

---

## 5. PayloadAction\<T\> for All Redux Reducers

Every Redux reducer action must have a typed payload.

```typescript
// ✅ CORRECT
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

reducers: {
  setDiagramType(state, action: PayloadAction<DiagramType>) {
    state.diagramType = action.payload;
  },
}

// ❌ WRONG — payload is any
reducers: {
  setDiagramType(state, action) {
    state.diagramType = action.payload;
  },
}
```

---

## 6. Zod Schemas for All External Data

Any data coming from the API (JSON response from Gemini/Django) MUST be validated with a Zod schema before use in the app.

```typescript
// ✅ CORRECT — features/classroom/validators/classroom.schema.ts
import { z } from 'zod';

export const DiagramCommandSchema = z.object({
  action: z.enum(['none', 'highlight', 'rotate', 'zoom', 'show_formula', 'pause_and_explain']),
  target: z.string().optional(),
  speed: z.enum(['slow', 'fast']).optional(),
  formula: z.string().optional(),
});

export const TeachingResponseSchema = z.object({
  topic: z.string(),
  language: z.string(),
  diagram_type: z.string(),
  phases: z.array(PhaseSchema),
});
```

---

## 7. No `any` — Use `unknown` Instead

If you genuinely do not know the type, use `unknown` and narrow it with a type guard.

```typescript
// ✅ CORRECT
function parseResponse(data: unknown): TeachingResponse {
  return TeachingResponseSchema.parse(data);  // Zod narrows it
}

// ❌ WRONG
function parseResponse(data: any): TeachingResponse {
  return data as TeachingResponse;  // bypasses all type safety
}
```

---

## 8. Stale Closure Pattern with `useRef` in Hooks

When a `useCallback` inside a hook depends on a value that changes but should not be in the dependency array, use a ref to mirror the value.

```typescript
// ✅ CORRECT — from useChunkPlayer.ts
const pausedRef = useRef(isPaused);

useEffect(() => {
  pausedRef.current = isPaused;    // sync ref with state
}, [isPaused]);

// Use ref inside callback — never sees stale value
utterance.onend = () => {
  if (!pausedRef.current) {        // ← reads from ref, not stale closure
    speakChunkRef.current(index + 1);
  }
};
```

---

## 9. Cleanup in useEffect — Always Return a Cleanup Function

Every `useEffect` that starts a subscription, animation loop, event listener, or speech synthesis MUST return a cleanup function.

```typescript
// ✅ CORRECT
useEffect(() => {
  const id = requestAnimationFrame(tick);
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(id);               // ← cleanup RAF
    window.removeEventListener('resize', handleResize);  // ← cleanup listener
  };
}, []);

// ❌ WRONG — memory leak, event listeners stack on every render
useEffect(() => {
  requestAnimationFrame(tick);
  window.addEventListener('resize', handleResize);
  // no cleanup
}, []);
```

---

## 10. Barrel Exports — Every `types/` and `constants/` Folder Has an `index.ts`

```typescript
// features/classroom/types/index.ts
export type {
  DiagramCommand,
  DiagramType,
  Phase,
  TeachingResponse,
  ClassroomState,
} from './classroom.types';
```

This allows consumers to import from the folder path, not the concrete file:
```typescript
import type { DiagramCommand } from '@/features/classroom/types';  // ← clean
```

---

## TypeScript Checklist for Every File

Before submitting any `.ts` or `.tsx` file, verify:

- [ ] All types defined in `types/<feature>.types.ts`, not inline
- [ ] All imports are `import type` for type-only imports
- [ ] No `any` — use `unknown` + Zod or a type guard
- [ ] Const objects use `as const`
- [ ] Redux reducers use `PayloadAction<T>`
- [ ] `useEffect` returns a cleanup function if it starts any async or subscription
- [ ] Barrel `index.ts` exists in the `types/` folder
