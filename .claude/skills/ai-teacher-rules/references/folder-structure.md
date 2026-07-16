# Folder Structure Rules

> Read this before creating any new file or folder in this repository.

---

## The Golden Rule — Screaming Architecture

The folder structure must **scream** its domain. A new engineer who opens the project must know exactly where every file belongs within 10 seconds.

```
features/classroom/   → "This is the classroom teaching screen"
features/ask/         → "This is the student Q&A screen"
features/intro/       → "This is the onboarding/intro screen"
```

---

## Frontend Structure (Canonical — Do Not Deviate)

```
frontend/src/
│
├── app/                          # NEXT.JS ROUTING ONLY
│   ├── layout.tsx                # Root layout — no logic
│   ├── page.tsx                  # Renders IntroScreen only
│   ├── classroom/
│   │   └── page.tsx              # Renders ClassroomLayout only
│   └── ask/
│       └── page.tsx              # Renders AskLayout only
│
├── config/                       # Build-time configuration
│   └── env.ts                    # Validated env vars
│
├── features/                     # SELF-CONTAINED FEATURE MODULES
│   ├── intro/
│   │   ├── components/           # UI components (IntroScreen, HeroSection, etc.)
│   │   ├── constants/            # Feature constants (categories.ts)
│   │   │   └── index.ts          # Barrel export ← REQUIRED
│   │   ├── hooks/                # Feature hooks (useParticleCanvas)
│   │   ├── styles/               # Feature-local CSS (intro.css)
│   │   ├── tests/                # Feature tests (intro.test.ts) ← REQUIRED
│   │   └── types/                # Feature types (intro.types.ts)
│   │       └── index.ts          # Barrel export ← REQUIRED
│   │
│   ├── ask/
│   │   ├── components/
│   │   ├── hooks/                # useAskSession.ts
│   │   ├── services/             # askService.ts (API calls)
│   │   ├── state/                # askStore.ts (Zustand)
│   │   ├── tests/
│   │   ├── types/
│   │   │   └── index.ts          # Barrel export ← REQUIRED
│   │   └── validators/           # ask.schema.ts (Zod)
│   │
│   └── classroom/
│       ├── components/
│       │   ├── board/            # Sub-group: board stages
│       │   ├── teacher/          # Sub-group: teacher animations
│       │   └── sidebar/          # Sub-group: sidebar
│       ├── hooks/                # useChunkPlayer, useClassroomApi, useVoiceInput
│       ├── services/             # classroomService.ts
│       ├── state/                # classroomSlice.ts (Redux)
│       ├── tests/
│       ├── types/
│       │   └── index.ts          # Barrel export ← REQUIRED
│       ├── utilities/            # classroomConfig.ts, imageUtils.ts
│       └── validators/           # classroom.schema.ts (Zod)
│
├── hooks/                        # GENUINELY SHARED HOOKS ONLY
│   └── useAppStore.ts            # Typed Redux dispatch/selector
│
├── lib/                          # GENUINELY SHARED UTILITIES
│   └── apiClient.ts              # Axios instance with base URL
│
├── shared/                       # GENUINELY SHARED UI
│   ├── components/
│   │   ├── providers/            # Redux, Theme, Voice providers
│   │   └── FormulaBlock.tsx      # Shared LaTeX renderer
│   ├── context/                  # ThemeContext
│   └── types/                    # Types used across 2+ features
│
└── store/                        # REDUX STORE CONFIG ONLY
    ├── index.ts                  # configureStore — no business logic
    └── uiStore.ts                # Global UI state (theme, mobile sidebar)
```

---

## Backend Structure (Canonical — Do Not Deviate)

```
backend/
│
├── config/                       # Django project config
│   ├── settings.py               # Reads ALL values from env vars — no hardcoding
│   ├── urls.py
│   └── wsgi.py
│
├── teacher/                      # Teacher (Ask) Feature
│   ├── services/
│   │   ├── __init__.py           # Barrel exports
│   │   ├── llm_service.py        # LLM init, JSON parsing, fallback
│   │   └── session_service.py    # Session history store (Redis-swappable)
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_views.py         # View endpoint tests
│   │   └── test_inference.py     # Service unit tests
│   ├── apps.py
│   ├── inference.py              # Orchestrator only (calls services)
│   ├── rag.py                    # RAG search (single responsibility)
│   ├── serializers.py
│   ├── urls.py
│   └── views.py                  # Thin routing only
│
├── physics_teacher/              # Physics Teacher (Classroom) Feature
│   ├── prompts/
│   │   ├── __init__.py           # Barrel exports
│   │   └── teaching_prompt.py    # System prompt + RAG template
│   ├── services/
│   │   ├── __init__.py           # Barrel exports
│   │   └── streaming_service.py  # LLM, JSON helpers, SSE generator
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_views.py         # View endpoint tests
│   │   └── test_streaming_service.py  # Service unit tests
│   ├── apps.py
│   ├── urls.py
│   └── views.py                  # Thin routing only (~85 lines)
│
├── .env.example                  # Documents all required env vars
├── .env                          # NOT committed to Git
└── requirements.txt              # All packages pinned to == versions
```

---

## Decision Rules: Where Does a New File Go?

### Ask yourself:

**Q: Is this file only used by one feature?**
→ YES → Put it inside that feature's folder.
→ NO → Put it in `shared/`, `hooks/`, or `lib/` only if used by 2+ features.

**Q: Is this a React component?**
→ Goes in `features/<feature>/components/`

**Q: Is this a custom hook?**
→ Single feature → `features/<feature>/hooks/`
→ Used across features → `hooks/` (global, must use `useAppStore.ts` pattern)

**Q: Is this a TypeScript type/interface?**
→ Single feature → `features/<feature>/types/<feature>.types.ts`
→ Cross-feature → `shared/types/`

**Q: Is this an API call / fetch / axios request?**
→ `features/<feature>/services/<feature>Service.ts`

**Q: Is this a Django view?**
→ Views must be thin. All business logic goes in `<app>/services/`.

**Q: Is this a configuration constant?**
→ Single feature → `features/<feature>/constants/`
→ Global → `config/`

---

## Rules for Adding a New Feature

When adding a new feature (e.g., `quiz`), create ALL of these folders immediately, even if some start empty:

```
features/quiz/
├── components/       # At minimum: QuizLayout.tsx
├── hooks/            # At minimum: useQuiz.ts stub
├── services/         # At minimum: quizService.ts stub
├── state/            # At minimum: quizSlice.ts or quizStore.ts
├── tests/            # At minimum: quiz.test.ts with one shape test
├── types/            # At minimum: quiz.types.ts + index.ts barrel
└── validators/       # At minimum: quiz.schema.ts stub
```

Partial feature folders (missing tests, types, or services) are **not acceptable**.

---

## Anti-Pattern: What NOT to Do

```
❌ src/types/classroom.types.ts        ← global types folder for feature-specific types
❌ src/services/classroomService.ts    ← global services folder for feature-specific service
❌ src/hooks/useChunkPlayer.ts         ← global hooks folder for feature-specific hook
❌ src/utils/imageUtils.ts             ← global utils for a feature utility
❌ backend/teacher/views.py with 600+ lines  ← logic in views, not in services
❌ backend/physics_teacher/views.py embedding the system prompt ← prompt not in prompts/
```
