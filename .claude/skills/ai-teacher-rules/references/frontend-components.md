# Frontend Components & Custom Hook Rules

> Read this before creating or modifying any React component, hook, or utility in the frontend.

---

## 1. The Five-Folder Rule (MANDATORY)

Every classroom feature file belongs in exactly ONE of these five folders. No exceptions.

| Folder | What Goes There | Example |
|--------|----------------|---------|
| `components/` | Pure UI presentation and composition ONLY | `StudentsCard.tsx` |
| `hooks/` | State, selectors, event handlers, side effects | `useStudentsCard.ts` |
| `utilities/` | Pure helper functions (no React, no Redux) | `getTopicItemRowStyles()` |
| `constants/` | Static mock data, default values, config arrays | `MOCK_STUDENTS`, `DEFAULT_NAV_TABS` |
| `types/` | TypeScript interface and type definitions | `sidebar.types.ts` |

---

## 2. Component Rules (CRITICAL)

### 2a. Every component MUST:
- Use `memo()` wrapper: `export const Foo = memo(function Foo({ ... }) { ... });`
- Set `displayName`: `Foo.displayName = 'Foo';`
- Contain ZERO `useState`, `useSelector`, `useDispatch`, `useAppSelector`, `useRouter` calls
- Import its prop interface from `../../types/<area>.types.ts` — NEVER define interfaces inline
- Import types with `import type { ... }` not `import { ... }`

### 2b. Sub-component decomposition rules:
- If a section of JSX is rendered conditionally or repeated in a list → extract it as a standalone sub-component
- If a component exceeds ~80–100 lines → split it
- Each sub-component gets its own `.tsx` file in the same folder
- Each sub-component is exported from the folder's `index.ts` barrel file

```tsx
// ✅ CORRECT — Pure presentation component
'use client';

import { memo } from 'react';
import { useStudentsCard } from '../../hooks/useStudentsCard';
import { StudentsCardHeader } from './StudentsCardHeader';
import { StudentSummaryRow } from './StudentSummaryRow';
import type { StudentsCardProps } from '../../types/sidebar.types';

export const StudentsCard = memo(function StudentsCard({
  presentCount,
  totalCount,
  absentCount,
}: StudentsCardProps) {
  const { isExpanded, total, present, absent, toggleExpand } = useStudentsCard({
    presentCount,
    totalCount,
    absentCount,
  });

  return (
    <div className="bg-[#2e5bff]/10 border border-[#2e5bff]/20 rounded-xl overflow-hidden shadow-sm">
      <StudentsCardHeader
        presentCount={present}
        totalCount={total}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />
      {isExpanded && (
        <div className="px-3 pb-3 pt-2 space-y-2">
          <StudentSummaryRow label="Total Students" count={total} variant="total" />
          <StudentSummaryRow label="Present Students" count={present} variant="present" />
          <StudentSummaryRow label="Absent Students" count={absent} variant="absent" />
        </div>
      )}
    </div>
  );
});

StudentsCard.displayName = 'StudentsCard';
```

```tsx
// ❌ WRONG — State, inline interfaces, and logic inside the component
'use client';

import { memo, useState, useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';

interface StudentsCardProps { ... }  // ← WRONG: type defined in component

export const StudentsCard = memo(function StudentsCard() {
  const [isExpanded, setIsExpanded] = useState(true);   // ← WRONG: state in component
  const points = useAppSelector((s) => s.classroom.chalkboardPoints); // ← WRONG: selector in component
  ...
});
```

---

## 3. Custom Hook Rules

### 3a. Every custom hook MUST:
- Live in `src/features/<feature>/hooks/<hookName>.ts`
- Be named `use<PascalCase>` without exception
- Be exported from `hooks/index.ts` barrel file
- Handle ONE concern only (one component = one hook)

### 3b. What belongs in a custom hook:
- `useAppSelector` / `useAppDispatch` calls
- `useUIStore` / Zustand store calls
- `useRouter` / navigation calls
- `useState`, `useEffect`, `useMemo`, `useCallback` logic
- Event handler functions (`handleClick`, `handleClose`, etc.)
- Computed derived values from state

```typescript
// ✅ CORRECT — Custom hook encapsulates all non-UI logic
'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_ATTENDANCE_SUMMARY } from '../constants/sidebarConstants';

export function useStudentsCard(options: UseStudentsCardOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const total = options.totalCount ?? DEFAULT_ATTENDANCE_SUMMARY.total;
  const present = options.presentCount ?? DEFAULT_ATTENDANCE_SUMMARY.present;
  const absent = options.absentCount ?? DEFAULT_ATTENDANCE_SUMMARY.absent;

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return { isExpanded, total, present, absent, toggleExpand };
}
```

---

## 4. Types Rules

### 4a. Interface placement:
- ALL component prop interfaces go in `src/features/<feature>/types/<area>.types.ts`
- NEVER define an interface or type alias inside a component `.tsx` or hook `.ts` file
- Re-export from `types/index.ts` barrel file

### 4b. Local `*.types.ts` shim files in component folders:
- The files like `components/sidebar/sidebar.types.ts` are allowed ONLY as re-export shims: `export * from '../../types/sidebar.types';`
- These shims exist for backward compatibility. New code ALWAYS imports directly from `../../types/sidebar.types`

### 4c. Import syntax:
```typescript
// ✅ CORRECT
import type { StudentsCardProps } from '../../types/sidebar.types';

// ❌ WRONG — interface in component
export interface StudentsCardProps { ... }

// ❌ WRONG — local types path that bypasses central types/
import type { StudentsCardProps } from './sidebar.types';
```

---

## 5. Constants Rules

### 5a. What belongs in `constants/`:
- Mock/demo data arrays (e.g., `MOCK_STUDENTS`, `DEFAULT_LESSON_TOPICS`)
- Default values and fallbacks (e.g., `DEFAULT_ATTENDANCE_SUMMARY`)
- Static configuration lists (e.g., `DEFAULT_NAV_TABS`)

### 5b. Naming:
- All constants UPPER_SNAKE_CASE
- Group by feature area: `boardConstants.ts`, `sidebarConstants.ts`, `inputConstants.ts`

### 5c. Example:
```typescript
// ✅ CORRECT — constants/sidebarConstants.ts
export const DEFAULT_ATTENDANCE_SUMMARY: AttendanceSummary = {
  total: 32,
  present: 28,
  absent: 4,
};

export const MOCK_STUDENTS: StudentRecord[] = [
  { id: '1', name: 'Alex Johnson', rollNumber: 'ST-101', status: 'present', avatarBg: 'bg-blue-600' },
  ...
];

// ❌ WRONG — data defined inside a component file
const mockStudents = [ { id: '1', ... } ]; // ← inside StudentsModal.tsx
```

---

## 6. Utilities Rules

### 6a. What belongs in `utilities/`:
- Pure functions (no React hooks, no Redux calls, no side effects)
- Style class name calculators (e.g., `getTopicItemRowStyles`, `getStudentSummaryVariantStyles`)
- String formatters (e.g., `renderFormattedFormula`)
- Keyboard event handler factories (e.g., `createEnterKeyHandler`)
- Image URL validators (e.g., `isImageUrl`, `safeImageSrc`)

### 6b. Files:
- `styleUtils.ts` — class name / variant style calculators
- `keyboardUtils.ts` — keyboard event handlers
- `formulaUtils.tsx` — math formula tokenizers (may contain JSX)
- `imageUtils.ts` — image URL helpers
- `classroomConfig.ts` — 3D scene & layout constants

### 6c. IMPORTANT — `utils/` vs `utilities/`:
- The canonical folder is `utilities/`. Do NOT create a new `utils/` folder.
- `utils/index.ts` is a shim that re-exports `../utilities` for backward compatibility only.
- All new utility functions go in `utilities/`.

---

## 7. Barrel Index Files (REQUIRED)

Every folder MUST have an `index.ts` that exports everything in that folder:

```typescript
// ✅ hooks/index.ts
export { useClassroomLayout } from './useClassroomLayout';
export { useFloatingInteractionBar } from './useFloatingInteractionBar';
export { useStudentsCard } from './useStudentsCard';
export { useStudentsModal } from './useStudentsModal';
// ... all hooks

// ✅ types/index.ts
export * from './board.types';
export * from './sidebar.types';
export * from './topbar.types';
// ... all type files

// ✅ constants/index.ts
export * from './boardConstants';
export * from './sidebarConstants';
export * from './inputConstants';
```

---

## 8. Accessibility Rules (WCAG AA)

- Never use `<div role="button">` — always use native `<button type="button">`
- All buttons MUST have `aria-label` or visible text labels
- Disabled interactive elements MUST have `aria-disabled={true}` and `disabled` attribute
- Focus ring styles MUST be preserved: `focus-visible:ring-1 focus-visible:ring-[#2e5bff]`
- Never remove focus outlines with `outline-none` without replacing with `focus-visible:` equivalent

---

## 9. Styles Folder Architecture

```
src/styles/
├── globals.css         # Entry point — imports Tailwind + all sub-stylesheets
├── theme.css           # Tailwind v4 @theme design tokens (colors, fonts, spacing)
├── base.css            # Base resets and typography defaults
├── glassmorphism.css   # Glass floating UI utilities
├── animations.css      # Keyframe animations
└── overrides.css       # Browser vendor-specific overrides
```

- Feature-specific CSS goes in `features/<feature>/styles/<feature>.css`
- Global design token changes go ONLY in `theme.css`
- Never put component-specific styles in `globals.css`

---

## 10. Shadcn Components

- Shadcn UI components live in `src/components/ui/` (auto-generated by `shadcn add`)
- Import shadcn components with `import { Button } from '@/components/ui/button'`
- Never modify shadcn source files directly — extend them via wrapper components
- Shadcn theme tokens are configured via CSS variables in `globals.css` `:root {}` block

---

## Component Creation Checklist

Before declaring any component or hook complete:

- [ ] Component uses `memo()` wrapper
- [ ] Component sets `displayName`
- [ ] Component has ZERO `useState`/`useSelector`/`useRouter` — those are in a hook
- [ ] Prop interface is in `src/features/<feature>/types/<area>.types.ts`
- [ ] All static mock data is in `src/features/<feature>/constants/<area>Constants.ts`
- [ ] All pure helper functions are in `src/features/<feature>/utilities/`
- [ ] Component is exported from its folder's `index.ts` barrel
- [ ] All buttons use `type="button"` and have `aria-label` or visible text
- [ ] All `disabled` states set both `disabled` attribute and `aria-disabled`
- [ ] No `<div role="button">` — always native `<button>`
