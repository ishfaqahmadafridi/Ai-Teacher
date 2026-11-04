# Live subject lecture checks — 28 October 2026

**Follow-up:** The failures below were subsequently addressed and retested. See [lecture visual fixes and current limits](lecture-visual-fixes-verification.md). This report preserves the original failing evidence.

**Verdict: the feature does not reliably deliver the requested lecture visuals yet.** Live generation exposed failures that the earlier seeded renderer tests did not cover. No production fixes were applied during this verification task.

Four real Gemini lectures were generated, validated by the existing Django pipeline, saved in an isolated database, and opened in the actual Next.js classroom. Narration was controlled through a speech substitute to inspect each step. These were actual provider responses, not prepared lesson fixtures. Gemini succeeded on all four calls; Groq fallback was not needed or live-tested. The local harness disabled automatic generation retries and used a 20-second provider timeout.

| Subject/example | Live generation | Classroom result | Verdict |
| --- | --- | --- | --- |
| Physics: fixed pulley and rope | Four chunks, 3762 reported tokens | Missing `diagram.action` causes frontend response validation to fail. Assembly fields are also misplaced outside `diagram.visual`. No lecture diagram appears. | Fail |
| Medical: blood circulation | Four chunks, 5227 reported tokens | Steps 1–3 show the labelled circulation diagram and advance focus. Step 0's requested image is unavailable. Diagram text is small/truncated. | Partial |
| Biology: plant water transport | Four chunks, 4089 reported tokens | Step 1 shows the water-transport schematic, but Leaves and Atmosphere overlap. Images requested in steps 0 and 2 are unavailable. | Partial |
| Mechanical: piston/cylinder/rod | Four chunks, 3393 reported tokens | Narration plays, but all assembly instructions are flattened outside `diagram.visual`. The 3D piston never appears. | Fail |

All four generated lectures contained an understanding question. Their inclusion does not establish instructional quality or student understanding.

## Reproduced defects

1. **Backend/frontend validation mismatch blocks physics playback.** `AnswerDiagramField` accepts a dictionary without validating the required frontend `action` enum. The physics response lacks it in three chunks, so `classroomAnswerSchema` rejects the response. The browser displays the validation error rather than the lecture.
2. **Flat assembly payloads silently lose 3D delivery.** The model supplied `diagram.kind`, `diagram.model` and `diagram.focus`. The backend normalizes flat tree/polynomial data, but not flat assembly/schematic data. Validated assembly instructions must live under `diagram.visual`. Mechanical data passes frontend parsing because it has actions, but no model is rendered; image discovery is attempted instead and fails in this run. Physics has this defect in addition to its missing actions.
3. **Valid schematic coordinates can create overlapping nodes.** Biology's Leaves and Atmosphere centers differ by 94 SVG units, while nodes are 110 units wide. They overlap by 16 units, hiding the connection. Bounds/ID validation does not prevent this layout collision.
4. **Image coverage remains unreliable.** The medical introduction and two biology steps requested images but returned `visual_status=unavailable`, `visual_reason=no_usable_asset`. This run does not establish the underlying provider/network cause or that the images are universally unavailable.

Relevant implementation: `serializers/diagram_fields.py`, `validators/classroom.schema.ts`, `hooks/useSchematicVisual.ts`. These remain unresolved findings, not claimed fixes.

## Rope-specific control

A separate **renderer control** took the actual physics narration and corrected only its data envelope in the temporary test harness: `action=none`, with the assembly under `diagram.visual`. This was saved as a separate note explicitly titled “Rope renderer control (correct contract).” It is not counted as a successful unmodified physics lecture.

That control visibly rendered the pulley, both hanging rope segments, the curved rope section, and the load, with the rope highlighted and labelled. A new durable geometry regression verifies that the curve meets both hanging segments and the loaded segment meets the load. This passes for the conceptual model; it does not test moving ropes, tension, effort arrows or a physical simulation.

The initial control snapshot was taken before lazy loading completed; it was discarded and rerun with explicit waits for the canvas and highlighted rope. The final screenshot was visually inspected. The hidden SVG fallback markup inside the canvas is not counted as a displayed 2D diagram.

## Tests and evidence

- Targeted backend visual/provider tests: **14 passed**.
- Targeted visual frontend tests: **10 passed**, including the added rope continuity check.
- Full frontend regression suite: **138 passed**.
- ESLint on the changed test: passed.
- Four actual subject browser checks plus the separate rope renderer control completed; no uncaught browser exceptions were recorded. The handled physics validation error and missing visuals are still failures.

Evidence:

- [Actual generated responses](artifacts/subject-live-results.json)
- [Frontend contract results](artifacts/subject-contract-results.json)
- [Per-step browser results](artifacts/subject-browser-results.json)
- [Physics failure](artifacts/subject-physics.png)
- [Medical diagram](artifacts/subject-medical-1.png)
- [Biology overlap](artifacts/subject-biology-1.png)
- [Missing mechanical model](artifacts/subject-mechanical-1.png)
- [Successful rope renderer control](artifacts/subject-rope_control-0.png)

This is one generated lecture per requested subject, not a reliability benchmark or comprehensive scientific/clinical validation. Speech output was simulated; real audio, Redis/Celery job transport, grading and multi-user load were not tested. No existing student data was used. Temporary notes live only in the isolated SQLite database. The existing frontend server was left running and the temporary test backend was stopped. The local browser harness is not a CI job. Saved evidence contains no API keys or test authentication tokens.
