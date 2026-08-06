# State Management Rules

> Read this before using Redux, Zustand, Context, or local state.

---

## Choosing the Right State Manager

| Situation | Use |
|---|---|
| State shared across 3+ hooks and 3+ components in the same feature | **Redux Toolkit** |
| State is simple, local to a single feature, read by 1-2 components | **Zustand** |
| State that depends purely on user interaction within a single component | **`useState`** |
| State that needs to survive re-renders but not persist | **`useRef`** |
| Theme, locale, or auth state needed anywhere | **React Context** |

### Current project decisions (do not change without discussion):

| Feature | Store | Reason |
|---|---|---|
| `classroom` | Redux (`classroomSlice`) | Multi-hook, multi-component shared state (8+ hooks read it) |
| `ask` | Zustand (`askStore`) | Simple linear chat, only AskLayout reads it |
| Global UI (theme, sidebar) | Redux (`uiStore`) | Used by providers across the app |

---

## Redux Rules

### 1. Only One Slice Per Feature

Each feature gets exactly one Redux slice. Do not split a feature's state into multiple slices.

```
✅ features/classroom/state/classroomSlice.ts   ← single slice for classroom
❌ features/classroom/state/voiceSlice.ts       ← separate slice for something within classroom
❌ features/classroom/state/diagramSlice.ts     ← another sub-slice — use one
```

### 2. The Redux Store Only Registers Slices — No Logic

```typescript
// ✅ CORRECT — store/index.ts is configuration only
export const store = configureStore({
  reducer: {
    classroom: classroomReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// ❌ WRONG — business logic in the store file
export const store = configureStore({
  reducer: {
    classroom: (state, action) => {    // ← logic in store file
      ...
    }
  },
});
```

### 3. Non-Serializable State Belongs in `useRef`, Not Redux

The `serializableCheck: false` setting is currently required because `SpeechSynthesisVoice` objects (voice objects) are in Redux state. **This is a known trade-off**. When adding new state, prefer serializable data.

```typescript
// ✅ CORRECT — voice objects are browser APIs, not serializable
// Store serialized representation in Redux; actual objects in useRef
const voices: SerializedVoice[] = [];  // ← only label/voiceURI, not the browser object

// ❌ WRONG — adding more browser APIs to Redux state
const recognition: SpeechRecognition = null;  // ← browser API in Redux — avoid
```

### 4. Every Reducer Has a Typed PayloadAction

See `references/typescript-rules.md` — Rule 5.

### 5. `resetClassroomState` Must Preserve Voice State

The `resetClassroomState` reducer preserves `voices` and `selectedVoice` because voice enumeration is expensive (requires browser API call on mount). Do not remove this:

```typescript
// ✅ CORRECT — from classroomSlice.ts
resetClassroomState(state) {
  Object.assign(state, {
    ...initialState,
    voices: state.voices,            // ← preserved
    selectedVoice: state.selectedVoice,  // ← preserved
  });
},
```

---

## Zustand Rules

### 1. Store File Lives in `features/<feature>/state/`

```
✅ features/ask/state/askStore.ts
❌ store/askStore.ts   ← wrong, not in feature folder
```

### 2. Zustand Stores Are Exported as a Named Hook

```typescript
// ✅ CORRECT
export const useAskStore = create<AskState>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
}));

// Usage
const { messages, addMessage } = useAskStore();
```

### 3. Zustand Does Not Replace Redux for Complex Cross-Hook State

If more than 2 custom hooks in the same feature read from the same Zustand store, migrate to Redux.

---

## Context API Rules

### 1. Context for Truly Global State Only

Use React Context only for:
- Theme (`ThemeContext` in `shared/context/`)
- Auth state (if added)
- Locale/language

Do NOT use Context for feature-specific state. Use Redux or Zustand instead.

### 2. Context Files Live in `shared/context/`

```
✅ shared/context/ThemeContext.tsx
❌ features/classroom/context/ThemeContext.tsx   ← theme is global, not classroom-specific
```

---

## State Checklist

Before adding any new state, verify:

- [ ] Is this state feature-specific or global? (feature → Redux/Zustand, global → Context)
- [ ] Is Redux already used in this feature? (if yes, add to the existing slice, do not add a new store)
- [ ] Is the new state serializable? (if not, document WHY serializableCheck must stay disabled)
- [ ] Is `resetClassroomState` updated if new state is added to classroomSlice?
- [ ] Typed with `PayloadAction<T>` if using Redux?
