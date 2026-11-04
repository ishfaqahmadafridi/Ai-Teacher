# Connected concepts and subject-aware teaching quality

5 November 2026.

New teaching generation now validates the lesson's teaching structure and runs a separate model review before saving or publishing it. Saved legacy notes remain readable. This change does not certify every possible topic or establish clinical accuracy.

## New generation requirements

A full lesson contains a goal/introduction, ordered concept blocks, substantive explanations and examples/applications for each block, a graded practice check, a standalone timed concept-Q&A invitation and a final recap. Explanations, examples and practice share a stable `concept_id`; every full-lesson chunk has one `teaching_step`. Concepts cannot jump between disconnected blocks, examples/practice cannot precede their explanation, and graded checks cannot sit directly beside Q&A invitations. Invitation speech must match `discussion_prompt`.

`lesson_mode` distinguishes full lessons, focused replies, necessary clarification and quizzes. Trusted saved quizzes cannot be relabelled as teaching lessons, and complete scheduled teaching cannot be relabelled as a focused reply. A review also checks whether the requested mode actually fits the student's task. Existing saved responses are not retrospectively required to contain new metadata.

Only unambiguous missing metadata is inferred: an existing discussion invitation identifies a discussion step, an existing question identifies a practice step, and an explicit introduction/recap envelope identifies a full lesson. No missing question, example or explanation is fabricated locally.

Subject-aware policy covers physics (conditions, units, reasoning and worked numericals), mathematics (domains, justified steps and worked examples), medicine (structures, functions, mechanisms and contextual clinical limits), biology (processes, classifications and relationships where relevant), computing (traces, edge cases and complexity where relevant), and appropriate discipline-specific explanation for other subjects. It avoids forcing a physics/numerical template onto every field or demanding advanced depth from beginners.

## Independent review and bounded repair

A separate invocation reviews actual narration for request fit, small concepts, connections, subject depth, examples, accuracy, visual alignment and assessment. Every passed finding must quote real narration. Small-concept, example and assessment evidence must cite the corresponding teaching stage; assessment evidence must cite a question. Missing/duplicated checks, invented quotes and failed judgments reject the draft.

One regeneration is allowed using bounded diagnostic feedback. Each request and review is checked against the model context cap. Review output uses `CLASSROOM_QUALITY_REVIEW_TOKENS`, default 4096; the allowance includes provider reasoning tokens. Review tokens are counted before parsing, including malformed review output. No failed draft enters saved lesson history or creates a new lecture note. Failure returns the existing unavailable-lesson response with unsuccessful quality metadata.

A model review is an additional quality gate, not an independent subject expert or a proof of correctness. The generation and review use separate invocations of the configured model. Additional invocations increase latency and quota usage; provider errors can prevent completion.

## Verification

Run:

```sh
backend/django_app/.venv/bin/python backend/django_app/manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test
```

**327 backend regression tests passed**, including authenticated HTTP/database tests. No frontend behavior was changed by this follow-up.

Tests cover valid connected blocks, missing invitations/examples, disconnected ordering, metadata normalization without invented content, quiz/clarification compatibility, required full scope, invalid or fabricated reviewer evidence, bounded repair, token accounting, preservation of legacy notes, and authenticated HTTP publication/rejection with real database persistence.

Live synthetic samples were also attempted for physics, medicine, biology, mathematics and computing. Early runs exposed concept-ID misuse, missing stage/root metadata and review truncation; the implementation was corrected. Some runs hit primary-provider quota limits and an unavailable configured fallback. These failed attempts must not be reported as successful subject validation. The local live logs and final sample report record the actual outcomes; no physical audio, image retrieval/rendering, clinical expert review, or 1,000-user load test was performed as part of this change.

The earlier 37% prompt-size reduction report describes the preceding compact-policy revision. This change adds explicit concept-structure and subject-depth rules; that historical percentage is not a measurement of the current expanded teaching policy. Existing token/context caps remain enforced.

Final live outcome: physics passed structure and the separate model review in one generation attempt (23.36 seconds; 9,601 total generation/review tokens). The final medical sample was rejected after two attempts; a subsequent diagnostic encountered primary HTTP 429 and fallback HTTP 404. Biology, mathematics and computing do not have a successful final live result. See [the honest result summary](artifacts/teaching-quality-results.json).

The implementation is split into generation/repair orchestration (`services/teaching_quality.py`), structural validation (`services/teaching_structure.py`), model/evidence review (`services/teaching_review.py`), and metadata normalization (`utilities/teaching_metadata.py`). Original function/class bodies and public imports were preserved. All 59 relevant split-regression tests passed.
