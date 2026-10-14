# Visual subject verification — 2026-10-14

## Scope

Four real Gemini lesson-generation runs, followed by one bounded image-query repair attempt and Chromium checks of the real frontend. Browser authentication, lesson-job HTTP responses and speech were stubbed; responses came from the real generated lessons. External image requests were not mocked. This is a frontend integration check, not a fully authenticated end-to-end test or audible-speech test.

| Subject and example | Backend result after repair | Chromium result |
| --- | --- | --- |
| Physics: Ohm's law | Circuit; 2 parameterized steps, 4 formulas | Circuit visible |
| Biology: human brain | 2 selected image URLs; 4 unavailable queries | Image element visible, image did not load |
| Computer science: binary search tree | 0 selected images; 9 unavailable steps | Unavailable message visible |
| Mathematics: quadratic function | 0 selected images; 7 unavailable steps; 5 formula fields | Unavailable message visible; no graph or formula observed during the sampled playback |

119 Django classroom tests and 66 frontend regression tests passed. No page exceptions occurred in the four browser checks. Passing these tests does not establish successful visual delivery.

## Confirmed failures

- Wikimedia requests failed with connection reset by peer.
- A selected Openverse thumbnail returned HTTP 424. Chromium could not load it with or without anonymous cross-origin mode. Metadata selection therefore did not prove asset availability.
- The bounded repair improved brain-image discovery but did not solve binary-search-tree or parabola coverage.
- Only six distinct queries are searched per lesson; additional queries are reported unavailable.
- General diagram/graph generation is not implemented. Formula fields do not provide a plotted parabola or a binary-search-tree diagram.

## Changes made during verification

Added one batched query refinement and one additional search/selection attempt, with accounted token usage and a regression test. Restarted the local lesson worker. No default images were added.

## Remaining work

Validate image bytes before marking an asset ready; persist usable licensed assets instead of relying solely on remote thumbnails. Handle broken images explicitly in the frontend. Add validated deterministic graph/tree rendering for subjects whose relevant images cannot be retrieved. Then repeat authenticated API-to-browser tests, including step synchronization and notes reuse.
