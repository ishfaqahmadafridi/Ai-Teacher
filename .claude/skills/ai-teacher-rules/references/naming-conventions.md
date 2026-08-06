# Naming Conventions

> Read this before naming any file, folder, function, variable, component, or hook.

---

## Frontend Naming

### Files and Folders

| Type | Convention | Example |
|---|---|---|
| React Component | PascalCase | `IntroScreen.tsx`, `DiagramCanvas.tsx` |
| Custom Hook | camelCase, `use` prefix | `useChunkPlayer.ts`, `useParticleCanvas.ts` |
| TypeScript types file | camelCase, `.types.ts` suffix | `classroom.types.ts`, `ask.types.ts` |
| Zod schema file | camelCase, `.schema.ts` suffix | `classroom.schema.ts`, `ask.schema.ts` |
| Service file | camelCase, `Service.ts` suffix | `classroomService.ts`, `askService.ts` |
| Redux slice | camelCase, `Slice.ts` suffix | `classroomSlice.ts` |
| Zustand store | camelCase, `Store.ts` suffix | `askStore.ts` |
| Constants file | camelCase | `categories.ts`, `classroomConfig.ts` |
| Utility file | camelCase, `Utils.ts` suffix | `imageUtils.ts` |
| Test file | matches source, `.test.ts` suffix | `intro.test.ts`, `classroomSlice.test.ts` |
| CSS module | camelCase, `.css` suffix | `intro.css` |
| Barrel file | always `index.ts` | `index.ts` |

### React Components

```typescript
// ✅ CORRECT — PascalCase, named export
export function DiagramCanvas() { ... }

// ✅ CORRECT — PascalCase, default export (for Next.js pages)
export default function ClassroomPage() { ... }

// ❌ WRONG — camelCase component name
export function diagramCanvas() { ... }
```

### Custom Hooks

```typescript
// ✅ CORRECT — camelCase with use prefix, returns named object
export function useChunkPlayer() {
  return { play, pause, resume, stop };
}

// ❌ WRONG — no use prefix (React will not treat it as a hook)
export function chunkPlayer() { ... }

// ❌ WRONG — returns array (ambiguous, prefer named object)
export function useChunkPlayer() {
  return [play, pause, resume, stop];
}
```

### TypeScript Types and Interfaces

```typescript
// ✅ CORRECT — PascalCase
interface DiagramCommand { ... }
type DiagramType = 'gravity' | 'wave';

// ❌ WRONG — camelCase
interface diagramCommand { ... }
type diagramType = string;
```

### Constants

```typescript
// ✅ CORRECT — SCREAMING_SNAKE_CASE for module-level constants
export const CLASSROOM_LAYOUT = { ... } as const;
export const CATEGORIES = [...];

// ✅ CORRECT — camelCase for local variables
const teacherPosition = 'left';

// ❌ WRONG — camelCase for exported module constants
export const classroomLayout = { ... };
```

### Redux Actions

Redux Toolkit auto-generates action names in the format `sliceName/actionName`. Follow this:

```typescript
// ✅ CORRECT — reducer name = what it sets/does, camelCase verb
reducers: {
  setInputText(state, action) { ... }
  addChalkboardPoint(state, action) { ... }
  resetClassroomState(state) { ... }
}

// ❌ WRONG — ambiguous or past tense
reducers: {
  updateText(state, action) { ... }    // too generic
  textUpdated(state, action) { ... }   // past tense
  handleInputChange(state, action) { ... }  // handler name, not state name
}
```

---

## Backend Naming (Python)

### Files and Folders

| Type | Convention | Example |
|---|---|---|
| Module | snake_case | `streaming_service.py`, `session_service.py` |
| Class | PascalCase | `ExplainView`, `TeacherConfig` |
| Function | snake_case | `get_llm()`, `extract_json_object()`, `stream_teaching_phases()` |
| Constant | SCREAMING_SNAKE_CASE | `PHYSICS_TEACHER_SYSTEM_PROMPT`, `MAX_HISTORY_LENGTH` |
| Test file | `test_` prefix | `test_views.py`, `test_streaming_service.py` |
| Test class | `PascalCase + Tests` | `ExplainViewTests`, `ExtractJsonObjectTests` |
| Test method | `test_` prefix, full sentence | `test_missing_question_returns_400` |

### Service Functions — Public vs Private

```python
# ✅ CORRECT — public function (no underscore), testable, importable
def extract_json_object(text: str) -> dict:
    ...

# ✅ CORRECT — private helper used only within the same file
def _apply_teacher_position_defaults(phases: list) -> None:
    ...

# ❌ WRONG — business logic is private when it should be testable
def _extract_json_object(text: str) -> dict:   # ← cannot test without accessing private
    ...
```

### URL Patterns

```python
# ✅ CORRECT — kebab-case URL paths
urlpatterns = [
    path('physics-teacher/explain/', ExplainView.as_view(), name='explain'),
    path('physics-teacher/health/', HealthView.as_view(), name='health'),
]

# ❌ WRONG — underscores in URLs (non-standard for REST)
path('physics_teacher/explain/', ...)
```

### Test Method Names — Must Be Full English Sentences

```python
# ✅ CORRECT — reads like a specification document
def test_missing_question_returns_400(self): ...
def test_extract_json_raises_on_no_json(self): ...
def test_save_session_caps_at_max_history(self): ...

# ❌ WRONG
def test_400(self): ...
def test_parse(self): ...
def test2(self): ...
```

---

## Summary Table

| Thing | Frontend | Backend |
|---|---|---|
| Files | `PascalCase.tsx` / `camelCase.ts` | `snake_case.py` |
| Classes | `PascalCase` | `PascalCase` |
| Functions | `camelCase` | `snake_case` |
| Hooks | `useCamelCase` | — |
| Constants | `SCREAMING_SNAKE_CASE` | `SCREAMING_SNAKE_CASE` |
| Test files | `name.test.ts` | `test_name.py` |
| Test classes | — | `NameTests(TestCase)` |
| Test methods | `it('full sentence', ...)` | `test_full_sentence(self)` |
