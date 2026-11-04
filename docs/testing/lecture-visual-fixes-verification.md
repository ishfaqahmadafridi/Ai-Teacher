# Lecture visual fixes — 28 October 2026

The original physics playback failure, missing piston model and biology node overlap are repaired. Four newly generated sample lectures also displayed their visuals through all 16 steps in Chromium. This is a bounded functional result, not a guarantee for every future AI response.

## Causes and changes

| Failure | Cause | Fix |
| --- | --- | --- |
| Physics lecture rejected | Backend accepted missing actions that frontend required | Normalize missing/unsupported actions to `none` before output |
| Pulley/piston absent | AI placed assembly fields directly in `diagram` | Normalize all supported flat visual formats into validated `diagram.visual` |
| Old saved lectures still broken | Stored answers bypassed input normalization during reads | Apply the same diagram validation/normalization on representation; stored narration is unchanged |
| Biology nodes overlap | Valid normalized coordinates did not ensure enough space | Preserve separated placements; use a bounded deterministic grid when node boxes collide |
| New response-format failures during retest | Text-mode generation could produce malformed/inconsistent JSON | Request JSON MIME output from Gemini, retaining serializer validation |
| Biology quiz diagram discarded | AI used `focus: "none"` for no highlight | Normalize `none`/`all` sentinels to omitted focus; actual unknown part IDs remain invalid |
| Missing illustrations | Wikimedia connection reset and Openverse timeout in diagnostics | Allow an explicitly supplied, validated per-step fallback diagram and label it as a simplified substitute |

The prompt now shows a complete nested diagram envelope, requires actions, explains omitted focus, and requests a complete relevant `fallback_visual` for image-dependent steps. The application never creates arbitrary anatomical geometry from failed image searches or carries a different step's visual across automatically.

## Verification

- Full Django users/dashboard/classroom suite: **271 passed**.
- Full frontend regressions: **141 passed**.
- TypeScript: passed.
- Full ESLint: zero errors; 16 existing warnings outside changed code.
- Whitespace validation: passed.

Regression coverage includes flat assembly/schematic normalization, missing/invalid actions, old-answer representation without mutation, stale image-failure metadata, fallback validation, image-outage selection, no cross-step fallback reuse, no-focus sentinels, JSON client configuration, preserved valid coordinates and collision-free placement at the 12-node limit.

### Original saved-response replay

The original four provider responses were reopened through the updated API without changing their stored narration/diagram data. Physics now plays and shows the pulley/rope; mechanical shows the cylinder/piston/rod. The original Leaves/Atmosphere overlap is gone. Existing image-dependent medical/biology steps without fallback data remain unavailable; no automatic bulk rewrite or invented image was applied.

### Fresh provider responses and browser replay

The same four prompts were submitted again. Physics and mechanical produced four-step lessons with approved 3D models. An intermediate medical response was incomplete and biology failed validation; those were not counted as passes. Medical and biology were retried after enabling JSON output, and both returned four-step lessons with one understanding question. Biology's final question used a no-focus sentinel; its actual captured response was revalidated through the final serializer after that normalization fix, without changing its narrated content.

The four actual responses were saved through the real note service in an isolated SQLite database and inspected step by step in the actual Next.js classroom. Every one of the 16 steps had a visible model or schematic; no unavailable status, overlapping node boxes or uncaught browser exceptions were recorded. Pulley focus moved to the rope; piston focus moved between cylinder, rod and piston; medical and biology schematics displayed throughout. Camera rendering used software WebGL in Chromium; narration timing used a speech substitute.

A fifth, clearly labelled **controlled image outage** used actual biology narration and its validated schematic as `fallback_visual`, with empty image-provider results injected at the service boundary. The real API/UI displayed the diagram and the exact notice “Image unavailable. Showing a simplified diagram.” This is a fault-injection test, not successful external image retrieval.

## Evidence

- [Final per-step browser results](artifacts/fix-final-browser-results.json)
- [Original-response replay](artifacts/fix-replay-results.json)
- [Final validated provider responses](artifacts/subject-fixed-normalized-results.json)
- [Image connectivity diagnostics](artifacts/image-diagnostics.json)
- [Pulley/rope](artifacts/fixed-physics-1.png), [piston rod](artifacts/fixed-mechanical-1.png)
- [Medical](artifacts/fixed-medical-1.png), [biology](artifacts/fixed-biology-0.png)
- [Original biology overlap repaired](artifacts/replay-biology-1.png)
- [Image-outage fallback notice](artifacts/fixed-image_fallback-0.png)

## Remaining limits

External image-provider connectivity was not fixed or bypassed. A missing image without an explicitly supplied fallback still reports unavailability. Older notes may need explicit repair/regeneration to gain fallbacks. New AI output can still violate other constraints and is validated rather than blindly executed. The four samples do not establish scientific/clinical accuracy or generation reliability at scale. Live Groq failover was not exercised because Gemini handled the successful calls.

Real speaker output, grading, Redis/Celery dispatch and concurrent usage were not tested in these browser scenarios. The temporary browser harness is not installed as a CI job. Only synthetic test records were used. The temporary backend was stopped and the existing frontend server left running. No credentials were included in the evidence.

Restart Django and lesson workers to load the updated LLM configuration and serializers.
