# Teaching prompt and context budget

Verified 5 November 2026.

The shared teaching policy is shorter while retaining teaching sequence, trust boundaries, languages, graded checks, timed concept Q&A, visual bounds and JSON output requirements. Image rules now live once in the shared visual policy. The unused RAG suffix and separate duplicate image policy were removed. Assembly details are included only for registered model names found in the question, saved course context or most recent conversation turn. Generic/translated topics retain schematic, image, formula and scene capabilities. Scheduled and research instructions remain conditional on their corresponding reference data.

For “Explain roots” with no history or references, the assembled system policy fell from 9,738 characters in committed HEAD to 6,115 characters (37.2%). Conservative UTF-8 estimates were 9,764 and 6,137 respectively (37.1%). This comparison is against committed HEAD, not an exact snapshot of all previous uncommitted changes. It is not a provider tokenizer measurement or a live teaching-quality evaluation.

Request controls:

- Operational context cap: `CLASSROOM_CONTEXT_TOKENS=32768`.
- Reserved and enforced generation output: `CLASSROOM_OUTPUT_TOKENS=8192`.
- Local safety margin: 1,024 tokens.
- History allowance: `CLASSROOM_HISTORY_TOKENS=4096`; oldest turns are dropped without leaving an orphan assistant message. Stored history is unchanged.
- Optional reference allowance: `CLASSROOM_REFERENCE_TOKENS=8192`. Optional image metadata, textbook excerpts and whole trailing research sources can be removed. Retained source numbers are not renumbered, and trimmed input is marked as incomplete.
- The latest question, student context and saved curriculum are never cut to fit. If mandatory input cannot fit, generation returns the existing fallback with `context_budget_exceeded` metadata before provider invocation. An oversized independent curriculum review is also rejected, rather than silently omitting review evidence.
- Available SDK model-profile input/output limits further reduce the operational limits. When Groq fallback is enabled, its configured `CLASSROOM_GROQ_CONTEXT_TOKENS` cap also applies. These are conservative application caps, not automatically discovered advertised model capacities; operators must verify unknown/custom models before changing them.

`model_info.prompt_budget` reports the conservative UTF-8 estimate, context cap, output reserve, margin and dropped context counts, plus actual provider input/output usage when returned. Local accounting uses LangChain's existing approximate counter with one UTF-8 byte per token and message overhead; it deliberately overestimates common English text and avoids extra remote counting requests. It cannot guarantee exact token accounting for every provider or future model. Logs record counts without prompt/student text.

Validation covers conditional assembly details, retained recent-topic context, intact curriculum/current question, old-turn removal, multilingual input, whole source retention, SDK/fallback caps, mandatory overflow before generation/history mutation and secondary-review overflow. Existing teaching, curriculum, visual and quota-fallback tests pass. No frontend changes or database migration are needed for this prompt update. Restart the backend and lesson workers to load the updated policy and environment settings.
