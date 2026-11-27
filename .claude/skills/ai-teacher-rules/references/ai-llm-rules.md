# AI / LLM Rules

> Read this before writing or changing any code that builds a prompt, calls a model, stores
> model output, or sends data to an external search or AI provider.

These rules exist because AI bugs are silent: a leaked answer key, a student's email in a prompt,
or an invented syllabus all "work" and pass ordinary tests. Each rule says why.

---

## AI-1 — The Database Remembers, the Model Does Not
Models are stateless. Permanent facts (profile, course, syllabus, progress, mastery) live in
PostgreSQL through Django services. Redis is only a cache. Chat history is only the current class.
**Why:** provider fallback (Gemini → Groq) and cache loss must never lose student data.

## AI-2 — Least Privilege per Model Call
Each role has its own payload builder that returns only the fields that role needs.
- Graders may receive answer keys (`expected_concepts`). Teachers, doubt replies, Q&A replies and
  anything a student reads must be produced by a call that never received them.
- Send spoken text, not whole lesson chunks: chunks carry answer keys and visual metadata.
```python
# ✅ CORRECT — role-specific builder, answer key not reachable
def build_doubt_payload(attempt): return {'lesson_context': ..., 'pending_check': ..., 'student_doubt': ...}
# ❌ WRONG — one payload for grading and teaching
payload = {..., 'expected_concepts': chunk['expected_concepts']}  # then show its feedback for a doubt
```
**Why:** the model will use anything it is given; prompt instructions are not access control.

## AI-3 — No Personal Identifiers Leave the System
Never send name, email, phone, username, account or session IDs to a model or external search.
Send only teaching facts (track, level, class, subject, language, relevant mastery).
**Why:** privacy (many students are under 18) and providers may log requests.

## AI-4 — All Supplied Text Is Untrusted Data
Student input, uploaded tables of contents, web pages and lesson text are data. Every prompt says so
and tells the model to ignore embedded instructions.
**Why:** prompt injection through uploads and web content.

## AI-5 — Validate Every Model Output, Fail Closed
Every response is parsed with `extract_json` and validated by a DRF serializer before use or saving.
On invalid output, keep the student's saved state and return a retryable error (503); never save or
show unvalidated text, and never invent fallback content that looks like a real answer.
**Why:** malformed or unsafe output must not reach students or the database.

## AI-6 — Deterministic Before AI
Code decides anything that has a correct answer: which subject/track/level rules apply, routing by
saved data, syllabus lookup, scoring, coverage, mastery transitions. Models do language work:
explaining, writing, grading free text, extracting from documents.
**Why:** code is free, instant and testable; a model can choose wrongly.

## AI-7 — Guard Safety Properties in Code After Generation
Properties that must hold (no answer leak, curriculum coverage, maths correctness, schema) are
checked by deterministic code after the model returns (`reveals_expected_answer`,
`validate_curriculum_coverage`, SymPy). Retry a bounded number of times from constants, then fail closed.
**Why:** prompts reduce risk; only code guarantees it.

## AI-8 — Respect the Context Budget
Teaching prompts go through `services/prompt_budget.py`; budgets live in `constants/prompt_budget.py`.
Send one subject's rules, never every subject's. Add new context as a layer with its own budget.
**Why:** oversized prompts cost more, get trimmed silently and dilute the model's attention.

## AI-9 — Prompts Live in `prompts/`, One Responsibility Each
No prompt text in services or views. One prompt per role (grader, doubt teacher, reviewer...);
do not merge roles that need different permissions into one prompt.
**Why:** reviewable, versionable, and keeps AI-2 enforceable.

## AI-10 — Tests Never Call a Real Provider
Mock `get_llm` at **every module path the tested code reaches** (a new service has its own
`get_llm` import). Run suites with `GEMINI_API_KEY= GOOGLE_API_KEY= GROQ_API_KEY=` to prove it.
Each AI safety rule gets a regression test that fails if the rule is broken
(e.g. "the answer key never appears in the doubt payload").
**Why:** a developer machine has real keys; an unmocked path silently costs money and is flaky.

## AI-11 — Never Fabricate Authority
No invented citations, scores, mastery, syllabus outcomes or experiment results. AI-drafted academic
data is labelled (`ai_draft`/`unverified`) and can never be marked verified by code or a model.
**Why:** students and teachers trust what the system states as fact.

## AI-12 — Shared Academic Records Are Versioned, Never Overwritten
Curricula, subject/track profiles, shared lectures and prompts carry versions. A change creates a new
version; students mid-course keep theirs.
**Why:** traceability and no surprise changes for current students.

## AI-13 — Provider-Portable Messages
One system message first, then human messages. Add retry notes as human content, not a second system
message. The same payload must work on the primary and fallback providers.
**Why:** adapters differ; fallback must not break at the worst moment.

---

## AI Checklist for Every Change
- [ ] Each model call has a role-specific payload builder (AI-2)
- [ ] No answer key reaches any student-facing generation (AI-2) — regression test exists
- [ ] No personal identifiers in prompts or searches (AI-3)
- [ ] Prompt marks supplied text as untrusted (AI-4) and lives in `prompts/` (AI-9)
- [ ] Output validated by a serializer; failure keeps state and returns 503 (AI-5)
- [ ] Safety properties checked in code after generation (AI-7)
- [ ] Context within budget; one subject's rules only (AI-8)
- [ ] All `get_llm` paths mocked; suite passes with keys cleared (AI-10)
