# AI Teacher: Student Context, Course Memory and Teaching System Design

Status: approved direction, not implemented. Written 2026-11-27 after reviewing the code.
Related: [plan.md](plan.md) (university teaching phases: planner, segments, visuals, labs).
This document covers **who the student is, what they study, what they learned before, and how
exactly that reaches the AI**, for every track (school, FSc, A Level, university, medical).

Core rule: **The database remembers the student. Code resolves the teaching context. One subject
specialist teaches. The grader grades. The learning record tracks progress.**

---

## 1. Problems this design fixes (verified in code)

| # | Problem | Evidence |
|---|---|---|
| P1 | Doubt replies can leak the answer of the pending check | `services/lesson_evaluation.py` sends `expected_concepts` to the model that also writes the doubt reply |
| P2 | Every request carries every subject's rules | subject paragraphs in `prompts/teaching_quality_prompt.py` are sent to maths, physics and medicine classes alike |
| P3 | Subject is free text | `CourseModel.subject_field` is a plain `CharField`; no stable ID, no aliases |
| P4 | Level is generic | `services/student_teaching_context.py` sends a label such as "High school"; no track, board, programme or syllabus |
| P5 | No memory between classes | chat history is per class `session_id` (max 40 messages); Day 1 `LectureNote` is saved but never given to Day 2 |
| P6 | Outline may be invented | `dashboard/services/course_outline_service.py` drafts an outline with the LLM when the student gives none |
| P7 | Progress is not learning | `LessonProgress` stores a section index only; no mastery per learning outcome |
| P8 | Context budget is tight | fixed teaching prompt is 11,387 of 19,456 estimated input tokens (58%) before history or references |
| P9 | Quality is not measured | no fixed evaluation set, no score per change, no provider comparison |
| P10 | Two agent systems | `fastapi_app/app/agents` LangGraph (tutor, solver, grader...) is not called by Django or the frontend |

Already good and kept: attendance-checked scheduled classes (`dashboard/services/scheduled_curriculum.py`),
explicit curriculum coverage checks (`services/curriculum_coverage.py`), durable background jobs
(`services/lesson_jobs.py`, Celery), conservative token budgeting (`services/prompt_budget.py`),
Gemini → Groq fallback, licence-aware images.

---

## 2. Architecture

```
                        ┌──────────────── PostgreSQL (source of truth) ────────────────┐
                        │ StudentProfile  Course→Subject  CurriculumVersion→Outcomes   │
                        │ SharedLecture(+versions)  LearningSession  LessonSummary     │
                        │ MasteryRecord  SubjectProfile/TrackProfile(+versions)        │
                        └───────────────▲──────────────────────────────┬───────────────┘
                                        │ write                        │ read (cache-aside)
 Student ─► Django view (routing only) ─┤                              ▼
                                        │                 Redis cache (profiles, card, syllabus slice)
                                        │                              │
                                        │            ┌─────────────────▼─────────────────┐
                                        │            │ 1. Teaching Context Resolver (code)│
                                        │            │  track · subject id · level ·      │
                                        │            │  syllabus slice · mode ·           │
                                        │            │  this topic's mastery · last class │
                                        │            └─────────────────┬─────────────────┘
                                        │            ┌─────────────────▼─────────────────┐
                                        │            │ 2. Prompt Assembler (code)         │
                                        │            │  base → track → ONE subject →      │
                                        │            │  syllabus → student → task         │
                                        │            │  per-layer token budget            │
                                        │            └─────────────────┬─────────────────┘
                                        │                              ▼
                                        │      3. Shared Lecture Library ── hit ──► reuse (0 LLM calls)
                                        │                              │ miss
                                        │      4. Planner → Segment Writer → subject code checks
                                        │         → accuracy review (once, on first generation) → save version
                                        │                              ▼
                                        │      5. Personal LearningSession (pace, extra examples, doubts)
                                        │                              ▼
                                        │      6. Student input → Intent Router
                                        │         ├ answer → Grader (has answer key)
                                        │         ├ doubt  → Doubt Teacher (NO answer key)
                                        │         └ big doubt → mini-lesson
                                        │                              ▼
                                        └──── 7. Mastery update + LessonSummary (code, from records)
```

Why a **modular monolith in Django**: the classroom, jobs, attendance and records already run there.
A new service would add network hops, duplicated models and two deployment paths with no scaling need
today. Modules stay separated by folders and public service functions so a module can be extracted later.

---

## 3. Data model

Ownership: **shared** (same for every matching student) vs **personal** (one student).

| Entity | Shared/Personal | Key fields | Notes |
|---|---|---|---|
| `StudentProfile` (extend `User`) | personal | track, country, province, board_or_university, programme, class_year, session_year, language, goal | edited by the student; missing fields stay empty, never guessed |
| `Subject` | shared | id (stable slug), parent_id, name, aliases[] | taxonomy: `medicine.anatomy.neuroanatomy`; aliases map "Bio", "Biology", "Life Sciences" |
| `Course` (extend `CourseModel`) | personal | subject_id, curriculum_version_id (nullable), outline_origin | origin: student_upload, library, discovered, ai_draft |
| `CurriculumVersion` | shared | country, board, programme, class_year, subject_id, edition, source_url, source_tier, status, last_checked | immutable after verification |
| `Chapter`, `Topic`, `LearningOutcome` | shared | outcome code, description, cognitive level, periods, depth note | outcome code is the join key for everything |
| `TrackProfile`, `SubjectProfile` | shared | version, layer text, stage emphasis, visual kinds, checks, assessment styles | data, editable by admin, versioned |
| `SharedLecture`, `LectureSegment` | shared | lecture_key, version, generation record | never contains personal data |
| `LearningSession` | personal | user, course, shared_lecture version, position, personal additions | replaces per-student copy of the lecture |
| `LessonSummary` | personal | user, course, session, outcomes_covered, weak_outcomes, open_doubts, lecture version | built by code from records (section 5) |
| `MasteryRecord` | personal | user, outcome code, state, evidence[] | state machine in section 6 |

Curriculum status: `draft` → `unverified` → `student_confirmed` → `expert_verified` → `retired`.
Student confirmation means "matches my course", never "officially verified". An LLM may extract
outcomes from a found document; it may never invent outcomes and mark them verified.

Versioning rule: a verified curriculum, profile or shared lecture is never edited. Change = new version.
A student mid-course keeps their version; moving to a new one is an explicit course-update action.

Lecture key (small on purpose, so lectures are actually reused):
`(subject_id, topic/outcome set, curriculum_version, track_profile_version, subject_profile_version,
level, language, prompt_version, schema_version)`. Duration is handled by selecting segments, pace and
extra examples by the personal session, so they are **not** in the key. Model and settings are recorded
on the lecture for traceability, not used as key.

---

## 4. Main flows

### 4.1 Onboarding and course setup (once)
1. Onboarding saves the profile (extend the existing steps in `features/onboarding`: add track, board or
   university, programme, class or year, goal).
2. Course creation resolves `subject_id` via aliases; unknown → general subject, flagged for the admin.
3. Table of contents:
   - student uploads or types it → small model parses to the schema (input treated as untrusted data)
     → match against the curriculum library → student confirms → saved;
   - not given and the library has it → linked, no LLM, no search;
   - not given and not in the library → `curriculum_discovery` Celery job (allow-listed official domains
     only, deduplicated per board/class/subject/edition) → `unverified` → student confirms;
   - all of the above fail → existing AI outline draft, labelled `ai_draft`, never `verified`.
4. Timetable is built from the outline exactly as today (`SavedTimetable`).

### 4.2 Starting a class
1. Join and attendance check (existing `scheduled_curriculum`).
2. Resolver loads (cache-aside): profile, course subject, track and subject profiles, the syllabus slice
   for this class, mastery of this class's outcomes and their prerequisites, the last 1-2 `LessonSummary`
   records **of this course only**.
3. Lecture Library lookup by key; miss → generate (plan.md Phase 2) in the background after module 1.
4. A personal `LearningSession` is created pointing at the shared lecture version.

### 4.3 During class
- Student text → Intent Router (small model, cheap rules first) → Grader **or** Doubt Teacher.
- The Doubt Teacher's input is built by a function that cannot read the answer key (least privilege by
  construction, tested).
- Personal extras (slower pace, extra example) are generated into the session, not the shared lecture.

### 4.4 After class (code, no LLM required)
`LessonSummary` is built from records:

| Field | Source |
|---|---|
| outcomes_covered | `curriculum_coverage` results for the delivered segments |
| weak_outcomes | `LessonAttempt` grading (misconception, unclear) |
| completed | `LessonProgress` / session position |
| open_doubts | saved doubt turns not resolved |
| lecture_version | the shared lecture version used |

An LLM may optionally write a one-line human summary of discussion, but never sets weakness or mastery.

---

## 5. Context engineering

Layer order (static first, so provider prompt caching can reuse the prefix):

| Layer | Content | Budget (estimated tokens) |
|---|---|---|
| Base | JSON contract, safety, untrusted-data rule | fixed, measured |
| Track | FSc / university / medical rules | ≤ 600 |
| Subject | one `SubjectProfile` only | ≤ 800 |
| Syllabus slice | this class's outcomes and prerequisites | ≤ 1,500 |
| Student | track, class, language, pace, this topic's mastery | ≤ 400 |
| Previous classes | last 1-2 `LessonSummary` of this course | ≤ 600 |
| History | current class chat | ≤ 4,096 (existing) |
| References | textbook / research (only when needed) | ≤ 8,192 (existing) |
| Task | the request | required |

Never sent: name, email, phone, account IDs, other courses' data, full mastery history.

Budget fixes:
1. Remove the all-subjects paragraph (P2); subject text comes only from the selected profile.
2. Per-segment generation needs about 1,000 output tokens, so the segment writer reserves about 4,096
   instead of 12,288 (that frees about 8k of input space); single-shot paths keep their current reserve.
3. Count tokens with the provider counter where available; keep the conservative estimate as fallback.
4. Trim order when over budget: references → history → previous classes → never the required layers.
5. Log per request: layer sizes, trimmed layers, provider, model, tokens in/out, latency, cost estimate.

---

## 6. Mastery rules

| State | Enter when |
|---|---|
| not_started | default |
| introduced | the outcome was taught in a delivered segment |
| practising | at least one graded attempt |
| developing | at least one correct graded answer |
| mastered | 2 correct graded answers on different days, the latest not followed by a misconception |

Attendance or finishing a lesson never sets `developing` or `mastered`. A later misconception moves the
state back to `practising`. Every change stores its evidence (attempt IDs).

---

## 7. Weaknesses and their design answer, by role

### Senior software engineer
| Weakness | Answer |
|---|---|
| Answer leak (P1) | split grader and doubt teacher; payload builders per role; regression test that fails if any expected concept reaches the doubt prompt, including history, fallback and retry paths |
| Free-text subject (P3) | `Subject` taxonomy with aliases; resolver uses IDs only |
| Silent overwrite of curriculum | immutable versions, status workflow, explicit course migration |
| Two agent systems (P10) | document FastAPI graph as not in the classroom path; reuse tested pieces (safety, solver) inside Django; decide merge or removal later |
| Hard to trace a bad lecture | every lecture stores profile, curriculum, prompt, schema and model versions |
| Cross-student leakage | all personal queries scoped by `user` and `course`; isolation tests |
| Minors' data (FSc students are 16-17) | consent at onboarding, data export and delete, minimal fields, no personal data to AI or search |
| Untrusted uploads and web pages | treat as data, strict serializers on every LLM output, no automatic verification |

Layer rules (project `ai-teacher:rules`): views route; services hold logic (`teaching_context.py`,
`prompt_assembler.py`, `lesson_summary.py`, `mastery.py`, `curriculum_lookup.py`, `curriculum_discovery.py`);
prompts hold text; constants hold budgets and allow-lists; serializers validate in and out; barrels export.

### Senior web developer
| Weakness | Answer |
|---|---|
| Profile is incomplete | new onboarding step for track/board/programme/class/goal; editable later on the profile page |
| Student cannot see what the system knows | course page shows syllabus source and status chip (finding, please confirm, confirmed, unverified, AI draft) |
| Long background work | job status via the existing polling pattern (`useScheduledClass`); the page stays usable |
| No continuity in the class UI | class opening card: "Last class: ... Today: ... You found ... hard" from `LessonSummary` |
| Contract drift | Zod schemas mirror serializers; contract tests (existing pattern) |
| Heavy 3D and media | lazy-load 3D and video only when a segment needs them |
| Urdu and English | language preference respected; RTL handled for Urdu text |
| Accessibility | native buttons, focus order, captions on every visual (project rules) |

### Senior AI engineer
| Weakness | Answer |
|---|---|
| Quality not measured (P9) | fixed evaluation set (about 20 topics per track, both providers), rubric scores (accuracy, syllabus coverage, depth, repetition, leakage), run before merging prompt or profile changes; LLM-judge scores calibrated against teacher ratings |
| Provider differences | same set run on Gemini and Groq; provider recorded per lecture; fallback quality tracked |
| Context pressure (P8) | section 5 budgets, provider token counting, logged layer sizes |
| Reviewer cost | review once when a shared lecture is first generated (cost shared by all students); code checks first (SymPy, units, balancing, sandbox, coverage); skip LLM review for small personal extras |
| Hallucinated syllabus or facts | outcomes only from documents; references required at advanced level; medical lectures labelled unreviewed until an expert approves |
| Model choice per task | small model: router, grader, planner, parser, reviewer; main model: segment writer, doubt teacher; fallback: Groq |
| Prompt changes break things | prompts and profiles versioned; version in lecture key; evaluation gate |

---

## 8. Delivery order and acceptance

| Step | Build | Accepted when |
|---|---|---|
| 0 | Fix doubt answer leak | failing regression test written first, then passes; doubt reply contains no expected concept |
| 1 | Profile fields, `LessonSummary`, `MasteryRecord` | saved once; summary built from records only; per-course isolation test |
| 2 | Subject taxonomy and profile registry | aliases resolve; unknown → general profile, flagged |
| 3 | Context Resolver | correct track, subject, level and slice for FSc maths and MBBS anatomy fixtures |
| 4 | Prompt Assembler + budgets + token logging | maths prompt has no physics/medicine text; layer sizes within budget; logs present |
| 5 | Isolation and privacy tests | no name/email/IDs in prompts; student A data never in student B context |
| 6 | Curriculum library, versions, statuses, intake | no invented or overwritten syllabus; student confirmation ≠ verification |
| 7 | Shared lecture library + personal session | identical keys reuse; different level/language never shares; old versions kept |
| 8 | Mastery states in class flow | transitions follow section 6 with evidence |
| 9 | Conditional visuals | approved assets first; external search only when needed |
| 10 | Curriculum discovery and research agents | allow-listed sources only; runs once per board/class/subject |
| 11 | Evaluation harness | scores per track and provider reported; required before prompt/profile merges |

Every step: backend and frontend tests, contract tests, and a real end-to-end run with printed output.

Proposed service targets (to confirm with real measurements): class start under 45 s on a library miss
and under 3 s on a hit; doubt reply under 10 s; full-lesson fallback under 2%; zero answer leaks in the
evaluation set.

---

## 9. Decisions for the owner

1. Mastery rule thresholds (proposal in section 6).
2. Who performs expert review for medical and syllabus records.
3. Allow-list of official domains per country and board.
4. Consent wording and data retention for students under 18.
5. Paid model tier and budget for evaluation runs.
6. Future of the FastAPI agent graph (keep separate, merge or remove).
