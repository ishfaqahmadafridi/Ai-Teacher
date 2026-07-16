# Testing Rules

> A feature is NOT complete without tests. Tests are not optional.

---

## The Rule: Every File You Create Needs a Test

| What you create | Minimum test required |
|---|---|
| A new Django view | Test 400 on missing/empty input + 200 with correct response shape |
| A new service function | Test happy path + at least one edge case + error case |
| A frontend constant | Test array is non-empty + every item has required fields |
| A new TypeScript type | Type-level compile check + runtime shape assertion |
| A new custom hook | Test cleanup (cancelled RAF, removed listeners) on unmount |
| A new Zod schema | Test valid input passes + invalid input throws |

---

## Backend Testing Rules (Django)

### File Location
```
<app>/tests/
├── __init__.py             ← required for test discovery
├── test_views.py           ← endpoint tests
└── test_<service>.py       ← unit tests for service functions
```

### Always Mock the LLM
```python
# ✅ CORRECT — fast, offline, no API costs
@patch('physics_teacher.views.stream_teaching_phases')
def test_valid_question_returns_streaming_response(self, mock_stream):
    mock_stream.return_value = iter(['data: [DONE]\n\n'])
    response = self.client.post('/api/physics-teacher/explain/', ...)
    self.assertEqual(response.status_code, 200)

# ❌ WRONG — makes real API call, costs money, fails offline
def test_valid_question_returns_streaming_response(self):
    response = self.client.post('/api/physics-teacher/explain/', ...)
    # This calls the real Gemini API — never do this in unit tests
```

### Use `TestCase` for View Tests, `SimpleTestCase` for Pure Functions
```python
# ✅ Views — need a database/test client
class ExplainViewTests(TestCase):
    def test_missing_question_returns_400(self):
        ...

# ✅ Pure functions — no database needed, faster
class ExtractJsonObjectTests(SimpleTestCase):
    def test_parses_clean_json(self):
        ...
```

### Required View Test Pattern
```python
class MyViewTests(TestCase):
    def test_missing_required_field_returns_400(self):     # ← always test validation
    def test_empty_required_field_returns_400(self):       # ← always test empty string
    def test_400_response_contains_error_field(self):      # ← always test response shape
    def test_valid_input_returns_200(self):                # ← always test success
    def test_correct_response_shape_on_success(self):      # ← always test success shape
```

### Required Service Test Pattern
```python
class MyServiceTests(SimpleTestCase):
    def test_happy_path(self):           # ← valid input, expected output
    def test_edge_case_empty_input(self): # ← boundary condition
    def test_malformed_input_raises(self): # ← error handling
    def test_default_values_applied(self): # ← setdefault / fallback logic
```

---

## Frontend Testing Rules (TypeScript / Jest)

### File Location
```
features/<feature>/tests/
└── <feature>.test.ts
```

### Constant Shape Tests — Always Required
```typescript
// ✅ Every constant must have shape tests
describe('CATEGORIES constant', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it('every item should have a label and icon', () => {
    CATEGORIES.forEach((item) => {
      expect(typeof item.label).toBe('string');
      expect(typeof item.icon).toBe('string');
    });
  });
});
```

### Type Contract Tests — Compile + Runtime
```typescript
// Type-level test: if this compiles, the interface contract is correct
it('DiagramCommand should accept a valid object', () => {
  const cmd: DiagramCommand = { action: 'highlight', target: 'earth' };
  expect(cmd.action).toBe('highlight');
});
```

### Hook Tests — Always Test Cleanup
```typescript
// Every hook that uses RAF, EventSource, SpeechSynthesis, or addEventListener
// must be tested for proper cleanup on unmount
it('should cancel animation frame on unmount', () => {
  global.cancelAnimationFrame = jest.fn();
  const id = requestAnimationFrame(() => {});
  cancelAnimationFrame(id);
  expect(cancelAnimationFrame).toHaveBeenCalledWith(id);
});
```

---

## Test Naming Convention

Test names must be full English sentences that describe what the test verifies:

```python
# ✅ CORRECT — reads like a specification
def test_missing_question_returns_400(self):
def test_extract_json_raises_on_malformed_input(self):
def test_clear_nonexistent_session_does_not_raise(self):

# ❌ WRONG — cryptic, says nothing
def test_1(self):
def test_view(self):
def test_error(self):
```

---

## Running Tests

```bash
# Backend — run all tests
cd backend && python3 manage.py test --verbosity=2

# Backend — run one app
cd backend && python3 manage.py test physics_teacher.tests --verbosity=2

# Frontend — run all tests (when Jest is configured)
cd frontend && npm test

# Both — must have zero failures before any PR
```

---

## Test Coverage Targets

| App/Feature | Target |
|---|---|
| `physics_teacher` views | 100% of endpoints tested |
| `physics_teacher` services | All public functions tested |
| `teacher` views | 100% of endpoints tested |
| `teacher` services | All public functions tested |
| `features/intro` | Constants + types tested |
| `features/ask` | Zod schema + service tested |
| `features/classroom` | Redux slice actions + service tested |
