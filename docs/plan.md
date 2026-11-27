# AI Teacher: Professor-Level Teaching Plan

Status: proposal, nothing in this plan is implemented unless the "Current state" table says so.
Owner decisions still needed are listed in section 10.
Related docs: [adaptive-teaching-plan.md](adaptive-teaching-plan.md), [anatomy-3d-models.md](anatomy-3d-models.md),
[research-search.md](research-search.md), [visual-teaching.md](visual-teaching.md).

## 1. Goal in one paragraph

Turn the classroom from "an AI that generates a short lesson" into "a professor that teaches a full class":
plan the lecture like a subject expert, teach it in modules with the right visual for every step,
let students explore and ask doubts at any time, check understanding without leaking answers,
and do it accurately, reliably and cheaply enough to run every day. Classes can be 15, 30 or 60 minutes
(60 is the default for university and medical courses).

Guiding rule: **use an LLM only where reasoning or writing is needed.** Structure, timing, visuals,
simulations, maths checks, storage and reuse are deterministic code.

## 2. Current state (inspected 2026-11-26)

| Area | What exists today | Gap |
|---|---|---|
| Lesson generation | One LLM call writes the whole lesson as JSON (`inference/pipeline.py`, `services/teaching_quality.py`), then structure checks + one AI review, up to 3 attempts | One call cannot write a deep lesson: ~250-650 words (2-4 min). Any failure discards the whole lesson and shows a 20-word fallback |
| Structure rules | Concept blocks, teaching steps, checks, discussion windows (`services/teaching_structure.py`), automatic repair of label slips (`utilities/teaching_metadata.py`), depth floor | Rules are for a single short lesson, not modules of an hour |
| Background jobs | Durable `LessonJob` with single-flight, retries, circuit breaker (`services/lesson_jobs.py`) | Generates one lesson; no "start after module 1, write the rest in background" |
| Progress | `LessonProgress`, `LessonAttempt`, resume of pending question | Section index only; no module/segment model |
| Checks and grading | Rubric grading with expected concepts (`services/lesson_evaluation.py`); detects a student question | The grading model also writes the doubt answer and sees the answer key, so it leaks answers |
| Doubts | Timed discussion windows (`services/lesson_discussion.py`) | No mini-lesson for big doubts; no "park off-topic doubt" |
| Visuals, physics | Gravity, projectile, electric field, wave, atom, circuit scenes (Three.js / React Three Fiber) | Few student-controlled parameters |
| Visuals, structures | Tree, polynomial, schematic, assembly (bridge, beam, piston, engine parts, pulley, molecule) | Assemblies are simple; no exploded views or motion |
| Visuals, anatomy | 3D viewer for heart, brain, skeleton with part focus (`AnatomyVisual.tsx`) | **No `.glb` model files in the repo** (2D fallback shows); only 7 brain parts |
| Images | Wikimedia Commons + Openverse with licence metadata (`research_images.py`, `openverse_images.py`) | One image decision per lesson, not per step |
| Research | Tavily + OpenAlex evidence with caching (`research_search.py`); keys exist for NCBI/PubMed, arXiv, Crossref, Wikipedia | PubMed, OpenStax, PhET, Sketchfab, video not connected |
| Maths | KaTeX formulas, polynomial plots | No symbolic/numeric checking of calculations |
| Code | Nothing | No safe code execution |
| Notes | Lecture notes, figures, DOCX export, translation | Built from one short lesson |
| Audio | Local speech for English (`lesson_audio.py`) | One hour of speech per class; audio not reused |
| Providers | Gemini primary, Groq fallback on 429/503 (fixed: retired model replaced with `openai/gpt-oss-120b`) | Free-tier rate limits hit during tests |
| Subject methods | One paragraph per subject inside `prompts/teaching_quality_prompt.py` (physics, maths, medicine, biology, computing, "other") | Not a registry: no versioning, no stage emphasis, no per-subject visuals, assessments or accuracy checks; no chemistry, engineering or humanities profiles |
| Video | Nothing | No video search, relevance check, timestamps or "what to observe" |
| Platform | Django (records, lesson services), FastAPI app with a LangGraph intent router (`fastapi_app/app/agents`), LangGraph research graph (`classroom/agents/research`), Celery, Redis, PostgreSQL | Lesson generation runs in Django services; where the new orchestrator lives is a decision (section 10) |

Evidence from real runs ("explain the mid brain"):
- Current pipeline: every run ended in the 20-word fallback (drafts of 225-650 words rejected).
- Plan-then-write prototype: 5 parts, 1,229 words, about 9 minutes, 9,275 tokens, 65 s, with slips:
  repeated examples across parts and one anatomical inaccuracy. This is the basis of Phase 2.

## 3. Target architecture

```
 Student request / scheduled class
              │
              ▼
 ┌──────────────────────────┐   cache hit → reuse saved lecture (no LLM)
 │ Lecture Library lookup   │──────────────────────────────────────────────┐
 └──────────┬───────────────┘                                              │
            ▼ miss                                                         │
 ┌──────────────────────────┐  small model, 1 call                         │
 │ Lecture Planner          │  modules → segments, goals, visual intents,  │
 │ (subject profile + level)│  checks, case/experiment slot                │
 └──────────┬───────────────┘                                              │
            ▼                                                              │
 ┌──────────────────────────┐  deterministic + small model                 │
 │ Plan Validator / Review  │  coverage, order, timing, prerequisites      │
 └──────────┬───────────────┘                                              │
            ▼  module 1 now, rest in LessonJob background                   │
 ┌──────────────────────────┐  main model, 1 call per segment              │
 │ Segment Writer           │  explanation, mechanism steps, example,      │
 │ (+ "already covered")    │  visual spec, check                          │
 └──────────┬───────────────┘                                              │
            ▼                                                              │
 ┌──────────────────────────┐  code: schema, length, maths (SymPy),        │
 │ Segment Checks           │  visual IDs; small model: accuracy           │
 └──────────┬───────────────┘  failed segment → rewrite that segment only  │
            ▼                                                              │
 ┌──────────────────────────┐                                              │
 │ Visual Resolver (code)   │  3D model / simulation / schematic / image / │
 │                          │  formula / code runner, licence checked      │
 └──────────┬───────────────┘                                              │
            ▼                                                              │
      Saved lecture (versioned, reviewed flag) ◄──────────────────────────┘
            │
            ▼
 Classroom playback ── student input ──► Intent Router (small model)
                                         ├─ answer   → Grader (small model, has answer key)
                                         ├─ doubt    → Doubt Teacher (main model, NO answer key)
                                         ├─ big doubt→ Mini-lesson (Segment Writer, 2-3 segments)
                                         └─ off-topic→ parked for end-of-class Q&A
```

Components that are **not** LLMs: lecture timing, schedule assembly, visual resolution, simulations,
maths verification, code sandbox, caching, progress, audio caching.

## 4. Key design decisions

1. **Plan, then write each segment.** Depth comes from the number of segments, not from one long reply.
   A segment is about 3 spoken minutes (350-450 words). A 60-minute class is 3-4 modules × 3-4 segments.
2. **Subject profiles, not one prompt.** Every subject has its own versioned `TeachingMethodProfile`
   (section 4a): the professor's concept sequence, stage emphasis, examples and practicals, visual
   kinds, assessment styles, level adaptations and accuracy checks. It is an expandable registry
   (data, not hardcoded prompt text). Stages that do not fit a topic are skipped, never forced.
3. **Level changes depth, not length.** Beginner, intermediate, advanced and research levels change the
   segment brief (prerequisites, terminology, derivations, evidence) while the timing stays the same.
4. **Grading and teaching are separate.** Only the grader sees expected answers. The doubt teacher gets
   lesson context without the answer key and a rule not to solve the pending check.
5. **Lecture Library.** A finished lecture is stored by (topic, level, language, duration, subject
   profile, prompt version) and reused by other students. Audio is cached with it.
   This is the largest cost saving.
6. **Fail small.** Validation and retry happen per segment. A student never receives a 20-word fallback
   for a whole class; at worst one segment is replaced by a short labelled summary.
7. **Honest content.** Generated visuals and simulations are labelled; experiments are marked as
   published, standard practical, virtual simulation, or hypothetical. No invented citations or results.
   Lectures are "AI-generated, unreviewed" until an authorised teacher approves them where required.
8. **Visuals serve an approved concept.** Visual, 3D, animation, video and simulation steps receive a
   segment's already-checked teaching content and only represent it; they never invent scientific
   content. Every visual answers a teaching question (section 4b), and 3D is used only when it helps
   more than a 2D diagram.

## 4a. Senior professor framework and subject profiles

Universal lecture framework (the planner picks stages and time per stage from the subject profile):

1. Introduction and real-world connection (why it matters, what problem it solves)
2. Prerequisite check; briefly teach missing foundations
3. Conceptual explanation, simple first, then building to the student's level
4. Visual demonstration (the right kind, section 4b)
5. Deep technical explanation (mechanism, components, equations, derivations, evidence)
6. Worked examples and real applications
7. Practical demonstration (experiment, code, case, simulation or video)
8. Common mistakes and misconceptions, and why they happen
9. Understanding checks during the lesson, not only at the end
10. Assessment and recap

`TeachingMethodProfile` fields: subject, version, teaching objectives and explanation style, required
concept sequence, stage emphasis (weights for the 10 stages), example and practical types, visual
kinds and asset needs, assessment styles, level adaptations, accuracy checks.

| Subject | Professor method (concept sequence) | Main visuals | Accuracy check |
|---|---|---|---|
| Physics | phenomenon → law → formula, variables, units, assumptions → derivation → numericals easy→hard → experiment/simulation → technology | vectors, fields, waves, circuits, rays, simulations | SymPy units and results |
| Mathematics | problem/idea → symbols → simple examples → why it works → derivation/proof → step-by-step solving → alternative methods, common mistakes → harder problems | graphs, coordinate planes, constructions, 3D shapes, transformations | SymPy every step |
| Biology | organism/organ/process → structure → function of each part → how parts work together → process in sequence → genetics/ecology/physiology links → lab observation | labelled anatomy, 3D organs, cells, microscope images, process animations | reviewer + references at advanced level |
| Chemistry | substance/phenomenon → atoms, bonding, electron arrangement → structure → mechanism step by step → balancing → stoichiometry → lab application and safety | 3D molecules, orbitals, periodic table, reaction animations, virtual lab | balance and stoichiometry by code |
| Computer science | problem → concept → algorithm/architecture → code step by step → run and show real output → errors, debugging, optimisation → small project → industry use | flowcharts, memory and data-structure diagrams, execution animation, code runner | code actually executed in sandbox |
| Mechanical engineering | engineering problem → machine and components → how each works → forces, motion, energy, materials → assembly → failure, maintenance, design → calculations | 3D assemblies, exploded views, mechanisms, stress/flow/thermal demos | calculations by code |
| Electrical/electronics | concept → components and properties → connections → V, I, R → step-by-step analysis → waveforms → problems and simulation | schematics, animated current, oscilloscope waveforms, circuit simulator | circuit solved by code |
| Medicine | normal anatomy/physiology → disease or clinical problem → causes, mechanism, symptoms → structure-function-pathology → investigations and findings → clinical case → diagnosis and management from guidelines | 3D anatomy, organ systems, pathology and imaging, physiology animations | references; teacher review flag |

Later profiles (Phase 9): statistics, economics, accounting, geography, history, psychology, civil
engineering, architecture, environmental science, law, each with its own method, visuals and checks.

## 4b. Visual types and selection

| Type | Use when | Must provide |
|---|---|---|
| 1. Image or labelled diagram | parts, labels, location, relationships, structures | caption, labels, what to observe, licence |
| 2. Interactive 3D model | spatial structure students should rotate, isolate, inspect | selectable parts with metadata; the teacher explains the selected part |
| 3. Animation (fixed process) | a process unfolds over time (blood flow, cell division, engine cycle) | step timeline synced to narration; pause, replay, slow down, inspect a step |
| 4. Simulation (student changes inputs) | cause and effect between variables (F=ma, Ohm's law, graphs) | controls, the teacher explains why the result changed |
| 5. Real video | students must see a real thing happen (experiment, procedure, machine) | trusted source, relevance check, timestamps, what to observe, a question afterwards |

Every visual must answer: what to look at, what it represents, how it works, why it matters, and
what the student should understand after seeing it. Examples of the selection rule:

| Teaching content | Selected visuals |
|---|---|
| Heart structure | labelled image + interactive 3D |
| Blood circulation | 3D animation + labelled diagram |
| Newton's second law | force diagram + simulation |
| Quadratic equations | step-by-step graph + equation steps |
| DNA replication | molecular animation + labelled diagram |
| SQL joins | table diagram + live SQL execution |
| Engine operation | exploded 3D model + real engine video |
| Electric circuits | circuit diagram + circuit simulator |

## 5. Phased delivery

Each phase ends with backend tests, frontend tests, contract checks and a **real end-to-end run with
printed lecture output**. A phase is done only when its exit criteria are demonstrated.

### Phase 1: Doubt handling (small, fixes a live bug)
- Intent router (small model): answer / doubt / big doubt / off-topic / clarification.
- Doubt teacher on the main model, using lesson context, never the answer key.
- Big doubts get a 2-3 segment mini-lesson, then resume at the same check.
- Off-topic doubts are parked and answered in the end-of-class Q&A.
- Checks: 1st wrong answer → hint, 2nd → full explanation and continue.
- Reuses: `lesson_evaluation.py`, `lesson_discussion.py`, `LessonAttempt`, `useInputBar.ts`.
- Exit: "what is the brain?" during a midbrain check gets a real explanation that does not contain
  the expected concepts; grading accuracy unchanged in tests.

### Phase 2: Lecture planner and segment writer
- New: `LecturePlan` (modules, segments, goals, visual intents, checks) and `LectureSegment` records.
- Planner prompt + level profiles, and the `TeachingMethodProfile` registry (section 4a) for the first
  five subjects: physics, mathematics, biology, chemistry, computer science. Medicine reuses the
  current medical rules until its profile is added. Profiles replace the per-subject paragraph in
  `teaching_quality_prompt.py`.
- Segment writer receives the plan and an "already covered" digest to stop repetition.
- Per-segment checks: schema, 350-450 words, no markdown, visual IDs exist, one accuracy review.
- Code adds opening, transitions, discussion windows and recap (not the LLM).
- Reuses: `teaching_structure.py` rules per segment, `prompt_budget.py`, Gemini/Groq gateway.
- Exit: "explain the mid brain" (university level) produces 8-15 minutes for a 15-minute slot with no
  repeated examples, every segment passing checks; full-lesson fallback rate below 2% over 20 runs.
  Projectile motion, quadratic equations, SN2 reaction and binary search produce visibly different
  plans that follow their subject's concept sequence (tested, not assumed).

### Phase 3: One-hour class format and background generation
- Duration templates: 15 / 30 / 60 / 90 minutes, mapped to modules, checks, Q&A, case and summary.
- Module 1 is written first; the class starts; later modules are written in `LessonJob` background work.
- Progress moves to (module, segment, step); refresh resumes exactly.
- Final assessment (3-5 questions) and revision notes generated from the saved lecture.
- Reuses: `lesson_jobs.py`, `LessonProgress`, lecture notes + DOCX export.
- Exit: a 60-minute midbrain class starts in under 45 s, never stalls waiting for a module,
  and resumes correctly after a page refresh.

### Phase 4: Visual per segment
- Visual Resolver chooses for every segment using the subject profile and the selection rule in
  section 4b: image/diagram, 3D model, animation, simulation, video, formula, or none.
- Every visual carries caption, labels, "what to observe" and why it is shown (section 4b); a visual
  without them is not published.
- Anatomy: add sub-parts (e.g. colliculi, substantia nigra, red nucleus, cerebral peduncles), and
  produce real `.glb` files from Z-Anatomy per [anatomy-3d-models.md](anatomy-3d-models.md)
  (manual Blender work, licence CC BY-SA, medical review of labels).
- Images per segment from Wikimedia/Openverse with licence shown.
- Mechanism steps drive highlights/arrows in sync with narration (pause, replay, slow down).
- Exit: every segment of the midbrain class shows a matching visual; 3D focus follows narration.

### Phase 5: Interactive simulations and maths
- Student controls on existing scenes: projectile angle/speed, mass/force, circuit voltage/resistance,
  wave frequency, field charges; the teacher explains why the result changed.
- Maths: SymPy checks every generated calculation and derivation step before publishing.
- Interactive graphs and 3D surfaces for mathematics.
- Exit: physics and electrical acceptance criteria (section 9, items 2 and 4) demonstrated.

### Phase 6: Engineering, chemistry and computing labs
- Mechanical: exploded assemblies, moving parts (gears, piston cycle), fault-diagnosis scenarios.
- Chemistry: 3D molecules beyond the current three, reaction step animations, lab safety steps.
- Computing: sandboxed code runner (separate isolated service, time/memory limits, no network),
  step-through algorithm visualisations (arrays, trees, graphs).
- Exit: section 9 items 3, 5 and 6 demonstrated.

### Phase 7: Research and resource agents
- Add PubMed/NIH (key exists), OpenStax, PhET, GeoGebra, Wolfram Demonstrations and Open Source
  Physics (each embedded only as its licence and terms allow), Sketchfab (download only permitted
  licences), NASA, and a video provider with timestamps.
- Video agent: search the exact topic; prefer universities, institutions and trusted scientific
  publishers; check relevance from the content (transcript/description), never from a title match
  alone; pick timestamps; state what to observe; pause at key moments where the player allows; ask
  a question about what was observed.
- Each resource is linked to a segment with "what to observe" and licence metadata.
- Advanced/research levels cite real sources for research claims; no source → say so.
- Exit: an advanced midbrain class cites at least 3 real, resolvable references.

### Phase 8: Lecture Library, review workflow and cost controls
- Store and reuse lectures and audio; version by prompt/profile version.
- Teacher review and approval flag, edits saved as a new version.
- Metrics per lecture: tokens, cost, generation time, fallback rate, student check results.
- Exit: the second student requesting the same class causes zero generation calls.

### Phase 9: Subject expansion and professor intelligence
- Profiles for mechanical, electrical and medicine are completed in Phases 4-6; this phase adds
  statistics, economics, accounting, geography, history, psychology, civil engineering,
  architecture, environmental science and law (section 4a), each with its own visuals and checks.
- Misconception detection from students' check answers feeds back into stage 8 of the framework.
- Each new profile is tested with a subject expert and real students before release.
- Exit: every released profile passes its live evaluation topic and an expert review.

## 6. Providers and infrastructure needed

| Need | Option | Note |
|---|---|---|
| Main writer model | Gemini 2.5 Flash (current) | Overload (503) seen in tests; Groq fallback |
| Small model | Gemini 2.5 Flash-Lite (current) | Router, planner, grader, accuracy review |
| Fallback | Groq `openai/gpt-oss-120b` | Free tier rate-limits parallel calls; needs paid tier or a queue |
| 3D anatomy | Z-Anatomy `.glb` exports | Manual export, CC BY-SA, medical review |
| Maths | SymPy (backend) | Deterministic, no LLM |
| Code execution | Isolated sandbox service | New infrastructure; security review required |
| Video | A video search API (key needed) | Licence and timestamp handling |
| Simulations | PhET, GeoGebra, Wolfram Demonstrations, Open Source Physics | Check licence and embedding terms before use |
| Speech | Current local TTS (English) | Production TTS and languages still undecided |
| Queue/cache | Redis (configured) | Shared rate limits and Lecture Library cache |

## 7. Cost model (estimates, to be measured in Phase 2)

- 60-minute lecture: about 5,500-6,000 spoken words; roughly 45,000-60,000 tokens to plan, write and
  check once (prototype: 9,275 tokens for about 9 minutes).
- With the Lecture Library, that cost is paid once per (topic, level, language, duration), not per student.
- Per-student cost is doubts and grading only (small calls).
- Audio for an hour is the largest recurring cost unless cached per lecture.

## 8. Testing strategy

- Unit tests for every new service, router decision, plan/segment validator and visual resolver.
- Contract tests between Django serializers and frontend Zod schemas (existing pattern).
- Replay tests with recorded model outputs, so CI never calls a paid provider.
- A scripted live evaluation set (for example: midbrain, projectile motion, four-stroke engine,
  RC circuit, SN2 reaction, binary search) run after each phase, printing lecture metrics:
  minutes, segments, repetition, visuals per segment, failed segments, tokens, time.
- Manual checks: audio, 3D interaction, resume after refresh, medical label review.
- Subject-method tests: the same planner on topics from different subjects must follow each
  subject's concept sequence and visual kinds.
- Lessons are tested with real students and subject experts before a profile is released.

## 9. Acceptance criteria → phase

| Criterion (from the brief) | Phase |
|---|---|
| 1. Medical: explore anatomy, understand pathways | 2, 4 |
| 2. Physics: interactive simulation + equations | 5 |
| 3. Mechanical: explore machine, operation, fault diagnosis | 6 |
| 4. Electrical: circuits and interactive experiments | 5 |
| 5. Chemistry: molecules and reactions | 6 |
| 6. Computing: run and modify code, see algorithms | 6 |
| 7. Doubts never reveal pending answers | 1 |
| 8. Advanced students get research-based depth | 2, 7 |
| 9. Students interact, not only watch | 4, 5, 6 |
| 10. Accurate, coherent, reusable, cost-efficient | 2, 8 |
| 11. Each subject taught with its own method | 2, 9 |
| 12. No random images or irrelevant videos; every visual explained | 4, 7 |
| 13. No fake experiments, invented results or citations | 2, 7 |

## 10. Risks and decisions needed

Risks:
- AI factual slips in medical content (seen in the prototype). Mitigation: per-segment accuracy
  review, references at advanced level, unreviewed label, teacher approval.
- Provider overload and free-tier limits. Mitigation: per-segment retries, queue, paid tier.
- Realistic 3D for every subject is not achievable with generated assets; it depends on licensed
  models. Where none exists, a labelled schematic or image is used and the limit is stated.
- Code execution is a security boundary and must be isolated from the main backend.

Decisions for the owner:
1. Class lengths to offer (proposal: 15 / 30 / 60, default 60 for university and medical).
2. Lecture reuse across students (proposal: yes).
3. Teacher approval before students see medical lectures (proposal: show with "unreviewed" label).
4. Budget for paid model tier, video API and production TTS.
5. Who produces and medically reviews the 3D anatomy models.
6. Start order (proposal: Phase 1, then Phase 2). The subject-profile brief suggests profiles first;
   proposal is to keep the live doubt bug first and build profiles inside Phase 2, where the planner
   that uses them is built.
7. Where the teaching orchestrator lives (proposal: keep it in Django services, which already run
   lesson generation and jobs; move to the FastAPI app only if it needs to scale separately).
