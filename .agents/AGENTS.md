# AI Teacher — Project Agent Rules

> **MANDATORY**: Every AI agent — Gemini, Claude, Codex, Cursor, GPT-4, or any other — **MUST** read, understand, and follow every rule in this file **before writing a single line of code** in this repository.
> Breaking these rules is NOT acceptable at any level. These are senior engineering standards.

---

## 🚨 STRICT SCOPE RULE — MUST BE READ BEFORE EVERY CODE CHANGE

1. **Only do exactly what is explicitly asked for in the message. Nothing more, nothing less.**
2. If asked for "splitting" (splitting a component/file/function), only split it. Do NOT change design, styling, colors, spacing, layout, sizes, positions, or structure of anything else. Do not "improve" or "clean up" anything not mentioned.
3. If a specific part is named (example: "sidebar"), only touch that part. Do NOT modify, restyle, resize, move, or reformat the header, main content, or any other section/component/file not named.
4. If a specific element inside a part is named (example: "the settings button inside the sidebar"), only change that exact element. Do not touch other buttons, icons, text, colors, or spacing near it, even if they look related.
5. **Never change design, layout, position, size, color, font, spacing, icons, or structure unless explicitly told to change that specific thing.**
6. Never rename variables, functions, classes, files, or IDs unless explicitly asked for a rename.
7. Never delete, reorder, or restructure code, comments, or files unless explicitly asked for it.
8. Never add new features, libraries, refactors, or "best practice" changes on your own. Do not act on assumptions or guesses about what the user "probably wants."
9. Do not give suggestions, recommendations, or opinions about whether a change should be made or not, unless explicitly asked. Just do the exact task and stop.
10. If a request is ambiguous or could affect more than the exact thing named, **stop and ask before making any change**. Do not proceed on your own judgment.
11. After making a change, only the exact thing asked for should be different. Everything else in the code/design must remain byte-for-byte identical to before — same position, same color, same icon, same size.
12. If you are not 100% sure something is included in the request, treat it as **NOT included** and leave it untouched.
13. Do not take any action, edit, decision, or recommendation without explicit instruction. Wait for the exact command every time.
14. When asked to add new code or a new feature (example: a new button in the dashboard that does a specific task), write it with proper structure, split exactly like the rest of the project:
   - Use proper TypeScript types/interfaces — never `any`.
   - Follow the existing project architecture and folder structure exactly — do not invent a new structure.
   - Put each concern in its correct place: components in the `components/` folder, state logic in custom hooks or Zustand store, UI primitives from ShadCN used correctly, shared state/providers in Context API, reusable logic in `hooks/`, helper functions in `utilities/`, network calls in the API layer.
   - Do not put everything in one file. Do not mix unrelated logic together.
   - Match the naming conventions, import style, and patterns already used in the existing codebase.
   - New code must fit in cleanly with existing files — not add a separate or inconsistent style.

---

## 🛑 Pre-Code Checklist (Required Before Writing Any Code)

Every agent must answer YES to every item below before starting:

- [ ] Did I read this entire AGENTS.md file?
- [ ] Do I know which app/feature this code belongs to (`users`, `dashboard`, `classroom`)?
- [ ] Did I identify the correct folder (component, hook, service, serializer, utility, constant, type)?
- [ ] Am I following the Three-Layer rule (view → service → serializer)?
- [ ] Does every new folder I create have an `__init__.py`?
- [ ] Does every new Django view have `@extend_schema`?
- [ ] Does every new third-party package get pinned in `requirements/base.txt`?
- [ ] Are all logger names using `logging.getLogger(__name__)`?
- [ ] Is all real business logic in `services/` — NOT in `views/`?
- [ ] Is all static/mock data in `constants/` — NOT inside a component or view?

---

## Part 1 — Frontend Architecture Rules

### Five-Folder Rule

Every file in any frontend feature (`classroom`, `dashboard`, `auth`) belongs to exactly ONE of five folders:

| Folder | Contains | Examples |
|--------|----------|----------|
| `components/` | Pure UI — ZERO state, ZERO Redux | `StudentsCard.tsx`, `NavTabList.tsx` |
| `hooks/` | All state, selectors, handlers, side effects | `useStudentsCard.ts`, `useSearch.ts` |
| `utilities/` | Pure helper functions — no React, no Redux | `styleUtils.ts`, `keyboardUtils.ts` |
| `constants/` | Static data, defaults, config arrays | `sidebarConstants.ts`, `boardConstants.ts` |
| `types/` | TypeScript interfaces and type aliases | `sidebar.types.ts`, `topbar.types.ts` |

### Component Rules

1. **`memo()` wrapper** — `export const Foo = memo(function Foo({ ... }) { ... });`
2. **`displayName` required** — `Foo.displayName = 'Foo';`
3. **Zero state in components** — All `useState`, `useSelector`, `useDispatch`, `useRouter` go in a custom hook
4. **No inline interfaces** — All prop interfaces in `types/<area>.types.ts`, imported with `import type`
5. **No inline static data** — Arrays and defaults in `constants/<area>Constants.ts`
6. **No `<div role="button">`** — Always use `<button type="button">`
7. **Barrel exports required** — Every folder has `index.ts` that exports everything

### Type Import Rule

```typescript
// ✅ CORRECT
import type { StudentsCardProps } from '../../types/sidebar.types';

// ❌ WRONG — inline interface
export interface StudentsCardProps { ... }

// ❌ WRONG — imports from local shim
import type { StudentsCardProps } from './sidebar.types';
```

### Constants Rule

```typescript
// ✅ CORRECT — constants/sidebarConstants.ts
export const MOCK_STUDENTS: StudentRecord[] = [ ... ];

// ❌ WRONG — mock data inside component
const mockStudents = [ { id: '1', ... } ]; // inside StudentsModal.tsx
```

### Utilities Rule

- Canonical folder is `utilities/` — NOT `utils/`
- `utils/index.ts` is a backward-compat shim only — do NOT add new files to `utils/`
- Utilities are pure functions: no React hooks, no Redux, no side effects

### Styles Rule

```
src/styles/
├── globals.css          # Entry point — imports Tailwind + sub-sheets
├── theme.css            # @theme design tokens — colors, fonts, spacing
├── base.css             # Resets
├── glassmorphism.css    # Glass UI utilities
├── animations.css       # Keyframe animations
└── overrides.css        # Browser/vendor overrides
```

- Feature CSS → `features/<feature>/styles/<feature>.css`
- Design tokens → `theme.css` ONLY
- Shadcn components → `src/components/ui/` — never modify, extend via wrappers

### Custom Hook Pattern

```typescript
// ✅ CORRECT
'use client';
import { useState, useCallback } from 'react';
import { DEFAULT_ATTENDANCE_SUMMARY } from '../constants/sidebarConstants';

export function useStudentsCard(options: UseStudentsCardOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const total = options.totalCount ?? DEFAULT_ATTENDANCE_SUMMARY.total;
  const toggleExpand = useCallback(() => setIsExpanded(p => !p), []);
  return { isExpanded, total, toggleExpand };
}
```

---

## Part 2 — Backend Django Rules

### Feature App Structure Rule

Every Django feature is a **dedicated app** under `apps/`. Never mix features.

```
backend/django_app/apps/
├── users/       # Auth, login, signup, profile, token utilities ONLY
├── dashboard/   # Search, courses, assignments, live classes ONLY
└── classroom/   # AI tutor, RAG pipeline, LLM inference, prompts ONLY
```

> ❌ WRONG — `teacher/`, `academic_core/`, or any monolith folder
> ✅ CORRECT — every feature owns its dedicated `apps/<feature>/` directory

### Package `__init__.py` Rule

Every folder containing Python files MUST have `__init__.py`. This includes the root:

```
apps/__init__.py                       ✅ REQUIRED
apps/dashboard/__init__.py             ✅ REQUIRED
apps/dashboard/models/__init__.py      ✅ REQUIRED
apps/dashboard/views/__init__.py       ✅ REQUIRED
apps/dashboard/services/__init__.py    ✅ REQUIRED
apps/dashboard/utilities/__init__.py   ✅ REQUIRED
apps/dashboard/constants/__init__.py   ✅ REQUIRED
```

> ❌ WRONG — a folder with Python files but no `__init__.py` silently fails at runtime

### Three-Layer Architecture Rule

```
REQUEST → views/ → services/ → serializers/ → RESPONSE
```

| Layer | Folder | Hard Rules |
|-------|--------|------------|
| **Routing** | `views/` | ≤ 100 lines. Validate input, call service, return response. ZERO ORM queries. |
| **Logic** | `services/` | ALL business logic, ALL ORM queries, ALL caching. Never call ORM from views. |
| **Schema** | `serializers/` | Validate and transform ALL data in and out. Never skip serializer validation. |

```python
# ✅ CORRECT view
class SearchView(APIView):
    def get(self, request):
        serializer = SearchRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        results = perform_global_search(**serializer.validated_data)  # service call
        return Response(results)

# ❌ WRONG view — ORM query directly in view
class SearchView(APIView):
    def get(self, request):
        courses = CourseModel.objects.filter(title__icontains=q)  # ← FORBIDDEN
        return Response(...)
```

### Migration Ownership Rule

ORM models belong to **exactly one** app. Migrations only contain models from that owner.

```python
# ✅ CORRECT — apps/dashboard/migrations/0001_initial.py
# Contains: CourseModel, AssignmentModel, LiveClassModel (all owned by dashboard)

# ❌ WRONG — apps/classroom/migrations/0001_initial.py
# Contains: CourseModel ← belongs to dashboard, not classroom!
```

> When an app uses no ORM models (e.g. classroom uses ChromaDB), its migration MUST have empty `operations = []`

### File Naming Rule

All files must be named after the **feature app they belong to** — never after a deleted or renamed app.

```
# ✅ CORRECT
apps/classroom/admin/classroom_admin.py
apps/classroom/prompts/classroom_prompts.py

# ❌ WRONG — old app name leaked into new structure
apps/classroom/admin/teacher_admin.py
apps/classroom/prompts/teacher_prompts.py
```

### Utilities Placement Rule

Utility functions (pure helpers) go in `utilities/` — NOT in `views/`.

```python
# ✅ CORRECT
apps/users/utilities/token_utils.py      # generate_user_tokens()
apps/dashboard/utilities/query_utils.py  # sanitize_query()

# ❌ WRONG
apps/users/views/token_utils.py          # This is not a view!
```

### OpenAPI Documentation Rule

**Every new API view MUST have `@extend_schema`.** No exceptions.

```python
# ✅ CORRECT
from drf_spectacular.utils import extend_schema, OpenApiParameter

class SearchView(APIView):
    @extend_schema(
        summary="Global dashboard search",
        tags=["dashboard"],
        parameters=[OpenApiParameter("q", str, description="Search query")],
        responses={200: SearchGroupedResultsSerializer},
    )
    def get(self, request): ...

# ❌ WRONG — view with no OpenAPI decorator
class SearchView(APIView):
    def get(self, request): ...
```

Swagger UI → `GET /api/docs/` | ReDoc → `GET /api/redoc/`

### Logger Naming Rule

```python
# ✅ CORRECT — always use __name__
logger = logging.getLogger(__name__)
# Resolves to: 'apps.dashboard.services.search_service'

# ❌ WRONG — hardcoded legacy names
logger = logging.getLogger('academic_core')
logger = logging.getLogger('teacher')
logger = logging.getLogger('physics_teacher')
```

### Serializer Usage Rule

Views must ALWAYS call the serializer — never read raw `request.data` directly.

```python
# ✅ CORRECT
serializer = AskRequestSerializer(data=request.data)
if not serializer.is_valid():
    return Response(serializer.errors, status=400)
question = serializer.validated_data["question"]

# ❌ WRONG — bypasses validation
question = request.data.get("question", "").strip()
```

### Dead Code Rule

**Never leave dead files, placeholder endpoints, or unused shims in the codebase.**

```python
# ❌ WRONG — dead placeholder endpoint
@router.post("/predict")
async def run_inference(payload: dict):
    return {"message": "Inference endpoint ready"}  # does nothing — DELETE IT

# ❌ WRONG — unnecessary shim file
# inference/prompts.py that just re-exports from prompts/ — DELETE IT
from apps.classroom.prompts import SYSTEM_PROMPT  # redundant shim
```

### AppConfig Registration Rule

```python
# ✅ CORRECT — full AppConfig path in INSTALLED_APPS
INSTALLED_APPS = [
    'apps.dashboard.apps.DashboardConfig',
    'apps.classroom.apps.ClassroomConfig',
]

# ❌ WRONG — bare string
INSTALLED_APPS = ['apps.dashboard']
```

### requirements.txt Rule

Every new package MUST be pinned exactly in `requirements/base.txt`.

```
# ✅ CORRECT
drf-spectacular==0.30.0

# ❌ WRONG — unpinned
drf-spectacular
```

---

## Part 3 — FastAPI Rules

### Responsibility Boundary Rule

FastAPI owns ONLY real-time and async operations. Everything else stays in Django.

| Django (`port 8000`) | FastAPI (`port 8001`) |
|----------------------|-----------------------|
| Auth, login, JWT | SSE streaming AI responses |
| Dashboard search (ORM) | WebSocket live classroom |
| Admin panel | Async RAG + LLM inference |
| Session management | Health check + RAG status |

> ❌ WRONG — duplicating ORM models or auth in FastAPI
> ✅ CORRECT — FastAPI calls only async services (LLM + ChromaDB via `asyncio.to_thread`)

### FastAPI Folder Structure Rule

```
fastapi_app/app/
├── api/v1/endpoints/   # Route handlers ONLY — call services, return responses
├── services/           # Async business logic — llm_service, rag_service
├── schemas/            # Pydantic models for all request/response types
└── core/               # Config + security
```

### FastAPI Endpoint Rules

1. **All request/response schemas** must use typed Pydantic `BaseModel` — never `payload: dict`
2. **All blocking I/O** (ChromaDB, sentence-transformers) must run in `asyncio.to_thread()`
3. **Streaming endpoints** must return `StreamingResponse` with `media_type="text/event-stream"`
4. **WebSocket endpoints** must catch `WebSocketDisconnect` and log the disconnection
5. **No placeholder endpoints** — if it has `# TODO` and returns a static string, delete it

---

## Part 4 — Universal Rules (All Agents, All Code)

### No Docstring Left Behind

```python
# ✅ CORRECT — docstring matches the file's actual content
"""
apps/classroom/admin/classroom_admin.py
Django Admin registrations for the Classroom feature app.
"""

# ❌ WRONG — docstring references deleted or renamed app
"""
teacher/admin/teacher_admin.py    ← old app name still in docstring!
"""
```

### No Mixing of Concerns

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| ORM query in a view | ORM query in a service |
| Business logic in a serializer | Business logic in a service |
| Utility function in a views/ folder | Utility function in utilities/ |
| Mock data in a component | Mock data in constants/ |
| State in a React component | State in a custom hook |

### Shared Code Rule

Code shared between Django and FastAPI belongs in `backend/shared/`:

```
backend/shared/
├── constants.py    # PROJECT_NAME, DEFAULT_PAGE_SIZE
└── enums.py        # UserRole enum
```

> Do NOT duplicate shared constants in both Django and FastAPI separately.

---

## Full Reference

See `.claude/skills/ai-teacher-rules/SKILL.md` for the complete engineering reference covering TypeScript patterns, state management, testing strategy, security, and anti-patterns.
