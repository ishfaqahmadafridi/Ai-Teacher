# Dynamic concept visuals

New lessons do not use a fixed topic/image catalog. The teaching generation emits a focused `diagram.image_query` for each concept requiring an illustration. Backend code searches that query through Wikimedia, falling back to Openverse. Searches are bounded to six distinct concepts per lesson, with three concurrent searches, request timeouts and metadata-size limits. Successful discovery is cached; cached content is retrieved content, not a predefined topic default.

One additional small LLM selection call chooses relevant numbered candidates for the lesson. Unknown indices and unrelated/unselected candidates are not displayed. Selection token usage is included in the response. Matching titles/descriptions does not verify the scientific accuracy of an image. Each selected image is assigned only to the requesting teaching step; it does not carry over automatically. Authors, licence and source remain attached to saved notes. Old saved lessons and their local images remain readable.

Queries with no selected image receive one batched LLM refinement and one additional search/selection attempt. There is no unbounded retry loop. Repair tokens are counted with visual selection tokens. This improves recall but cannot guarantee provider availability or coverage.

The frontend supports Wikimedia and Openverse thumbnails and shows a visual-unavailable message when retrieval fails. General anatomy 3D and diagram generation are not implemented. No claim of universal topic coverage is made. Live subject checks on 2026-10-14 retrieved two brain images after repair; binary-search-tree and parabola searches still returned no selected images. Wikimedia connections were reset by the peer. Physics produced a calculated circuit without needing an external picture.

See [verified visual delivery](visual-delivery.md) for the newer stored-image path, structured renderers, repair command and verification results.
