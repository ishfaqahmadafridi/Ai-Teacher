# Anti-Patterns

> These are patterns that have been seen in codebases like this one and caused real problems. They are NEVER acceptable.

---

## Frontend Anti-Patterns

### ❌ AP-1: Feature Logic in Global Folders

```
❌ src/services/classroomService.ts    ← classroom-specific in global folder
❌ src/types/classroom.types.ts        ← classroom-specific in global folder
❌ src/hooks/useChunkPlayer.ts         ← classroom-specific in global folder
❌ src/utils/imageUtils.ts             ← classroom-specific in global folder
```

**Why it's bad**: When a feature is removed or refactored, you have to hunt across the entire src/ tree. Teams argue about what belongs in `utils/`. Files grow without ownership.

**Fix**: Everything feature-specific goes in `features/<feature>/`.

---

### ❌ AP-2: TypeScript Types Defined Inside Components

```typescript
// ❌ WRONG — type defined in a component file
// features/classroom/components/DiagramCanvas.tsx
interface DiagramCommand {
  action: string;
  target?: string;
}

export function DiagramCanvas() { ... }
```

**Why it's bad**: The type cannot be reused by other files without importing from a component. Two developers define the same type independently and they diverge.

**Fix**: Types go in `features/<feature>/types/<feature>.types.ts`.

---

### ❌ AP-3: `useEffect` Without Cleanup

```typescript
// ❌ WRONG — memory leak and multiple RAF chains after navigation
useEffect(() => {
  requestAnimationFrame(tick);
  window.addEventListener('resize', handleResize);
  // no return cleanup function
}, []);
```

**Why it's bad**: Every time the component mounts, a new RAF chain starts. After 10 navigations, 10 separate animation loops are running. The browser crawls.

**Fix**: Always return `() => { cancelAnimationFrame(id); removeEventListener(...) }`.

---

### ❌ AP-4: Stale Closures in `onend`/`onerror` Callbacks

```typescript
// ❌ WRONG — isPaused is captured at creation time and never updates
utterance.onend = () => {
  if (!isPaused) {          // ← always reads the initial value of isPaused
    speakChunk(index + 1);
  }
};
```

**Why it's bad**: Pause never works. The callback always reads the value from when the component first rendered.

**Fix**: Use `pausedRef.current` pattern (see `references/typescript-rules.md` Rule 8).

---

### ❌ AP-5: `any` Type

```typescript
// ❌ WRONG
function parseResponse(data: any): TeachingResponse {
  return data as TeachingResponse;
}
```

**Why it's bad**: Completely bypasses TypeScript. Runtime crashes with "cannot read property of undefined" instead of compile-time errors.

**Fix**: Use `unknown` + Zod schema validation.

---

### ❌ AP-6: `import` Instead of `import type`

```typescript
// ❌ WRONG — value import for something that is only a type
import { DiagramCommand } from '../types/classroom.types';
```

**Why it's bad**: Type imports should not appear in compiled JS output. Value imports do. This inflates bundle size slightly and can cause circular dependency issues.

**Fix**: `import type { DiagramCommand } from '../types/classroom.types'`

---

### ❌ AP-7: Redux State with Browser API Objects

```typescript
// ❌ WRONG — SpeechRecognition is a browser API, not serializable
interface ClassroomState {
  recognition: SpeechRecognition | null;   // ← browser object in Redux
}
```

**Why it's bad**: Redux DevTools cannot serialize it. Time-travel debugging breaks. Causes `serializableCheck` warnings (or requires disabling checks globally).

**Fix**: Store only serializable IDs/URIs in Redux. Store the actual browser object in a `useRef`.

---

## Backend Anti-Patterns

### ❌ AP-8: Business Logic in `views.py`

```python
# ❌ WRONG — LLM call, JSON parsing, fallback logic all inside the view
class ExplainView(APIView):
    def post(self, request):
        llm = ChatGoogleGenerativeAI(...)
        full_text = ""
        for chunk in llm.stream(messages):
            full_text += chunk.content
        parsed = json.loads(full_text)      # ← belongs in streaming_service.py
        ...
```

**Why it's bad**: Cannot unit test the LLM logic without making real API calls. Adding a second endpoint with similar logic requires copy-pasting. Views become 600+ lines.

**Fix**: Delegate to `services/<app>_service.py`.

---

### ❌ AP-9: System Prompts Embedded in Views or Services

```python
# ❌ WRONG — 288-line prompt string inside views.py
PHYSICS_TEACHER_SYSTEM_PROMPT = """
You are Prof. Gemini...
[288 lines of rules and examples]
"""

class ExplainView(APIView):
    ...
```

**Why it's bad**: The prompt becomes impossible to find. Updating it requires understanding the view code. Cannot A/B test different prompts. File grows to 600+ lines.

**Fix**: Prompts go in `<app>/prompts/teaching_prompt.py`.

---

### ❌ AP-10: Hardcoded Secrets

```python
# ❌ NEVER — even in a "temporary" local branch
SECRET_KEY = 'django-insecure-2cha278l)51x=...'
GEMINI_API_KEY = 'AIzaSy...'
DEBUG = True
ALLOWED_HOSTS = ['*']
```

**Why it's bad**: Git history is public and permanent. Even a private repo that becomes public exposes all historical secrets.

**Fix**: `os.environ.get('VAR_NAME', 'dev-only-default')`.

---

### ❌ AP-11: In-Memory Session Store Without Thread Safety

```python
# ❌ WRONG — race condition in multi-threaded server
_sessions: dict = {}

def get_session(session_id):
    return _sessions[session_id]    # ← KeyError possible from concurrent writes

def save_session(session_id, history):
    _sessions[session_id] = history # ← no lock
```

**Why it's bad**: Two requests for the same session_id can write simultaneously, causing data corruption or KeyError.

**Fix**: Use `threading.Lock()` as in `teacher/services/session_service.py`.

---

### ❌ AP-12: Empty Test Files

```python
# ❌ WRONG — file exists but has no tests
# teacher/tests.py
from django.test import TestCase

# Create your tests here.
```

**Why it's bad**: Gives false confidence that testing is "done". CI passes without actually verifying anything.

**Fix**: Every test file must have at least 3 real test methods testing different scenarios.

---

### ❌ AP-13: Unpinned Dependencies in `requirements.txt`

```
# ❌ WRONG — different versions install on different days
langchain>=0.1.0
langchain-community>=0.0.1
```

**Why it's bad**: `pip install` on a new machine 6 months later pulls a version with breaking changes. The app that worked yesterday fails to start.

**Fix**: Pin to exact version: `langchain==1.3.4`.

---

## Quick Anti-Pattern Checklist

Before submitting any code change, scan for:

- [ ] No feature types/hooks/services in global `src/` folders
- [ ] No TypeScript types defined inside component files
- [ ] No `useEffect` without a cleanup function
- [ ] No `any` — use `unknown` + Zod
- [ ] No `import { ... }` for type-only imports
- [ ] No secrets or `DEBUG=True` hardcoded in Python
- [ ] No business logic in `views.py`
- [ ] No prompt strings embedded in service or view files
- [ ] No empty test files — every file has at least 3 real tests
- [ ] No unpinned `>=` versions in `requirements.txt` for non-platform packages
