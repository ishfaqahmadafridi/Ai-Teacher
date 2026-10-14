# Verified visual delivery

A discovered URL is never marked ready until its raster image is downloaded, decoded and normalized. Openverse originals are resolved through the provider's record endpoint rather than its unreliable thumbnail endpoint. Downloads accept HTTPS from approved media hosts, reject private IP destinations and unapproved redirects, bound response size and timeout, and reject unsupported formats/dimensions. Pillow verifies and decodes the actual bytes before converting them to PNG.

Normalized public licensed assets are addressed by their SHA-256 content hash under `CLASSROOM_MEDIA_ROOT/verified-visuals`. `/api/visual-assets/<hash>` serves only those files. Attribution and source remain in each saved lesson. These public assets contain no student records. The asset route accepts either trailing-slash form to prevent Next.js/Django redirect loops. Redis caches usable discovered assets. Production Compose shares a persistent media volume across API and lesson workers; multi-host deployments require shared storage configuration and validation.

Trees and polynomial graphs use bounded declarative data in `diagram.visual`. DRF validates structure and numerical ranges; frontend SVG rendering performs no generated code execution. Tree data has one root, unique IDs, valid parent links and no cycles. Polynomial coefficients are in ascending power order and evaluated numerically. This covers trees and polynomial graphs, not arbitrary simulations or anatomy 3D. Flat model output is normalized into the same validated contract. Circuit parameters take precedence over image queries.

Missing images receive one bounded query refinement. `VISUAL_QUERY_LIMIT` is configurable (maximum 20), and skipped queries carry `visual_reason=budget_exceeded`. Browser image errors show an explicit message. Stored assets are reused in note previews and DOCX exports without another LLM call. Native SVG figures continue through the existing browser figure capture.

To queue repair of an old saved note:

```sh
cd backend/django_app
.venv/bin/python manage.py repair_lesson_visuals --note-id <note-uuid>
```

The task runs on the lessons queue and creates a new note version. Original narration and history remain unchanged. Successful repair results are deduplicated through the shared cache and the existing note-version constraint. There is no automatic bulk repair or unbounded background provider traffic.

## Verification on 2026-10-14

- 125 Django classroom tests pass, including decoding, stored HTTP delivery, normalization and saved-version repair.
- 67 frontend regression tests pass; TypeScript and focused ESLint pass. Focused backend Pyright has zero errors.
- Chromium verified the exact circuit, loaded biology image, tree and polynomial graph using actual generated lesson responses. Authentication/job transport and speech were stubbed for those four reproducible visual checks; image requests were real.
- Real authenticated browser testing reached the API and queued worker. Gemini returned HTTP 429 RESOURCE_EXHAUSTED; a fresh authenticated lesson could not be verified. Temporary test account/token were removed.
- The brain DOCX contained all four stored images.
- Production YAML parses, but Docker runtime and multi-host storage have not been tested.

Screenshots: [biology](visual-test-evidence/biology.png), [tree](visual-test-evidence/tree.png), [parabola](visual-test-evidence/parabola.png), [circuit](visual-test-evidence/circuit.png).

Successful delivery and metadata relevance do not establish scientific correctness of every asset. Provider availability, model quotas, unsupported visual types and subject coverage remain practical limits. No default topic pictures were added.

## Quota-independent routine visuals

Normal lesson generation now supplies the visual requirements in its existing AI call. The pipeline no longer invokes recovery planning automatically. Image selection uses conservative exact-term metadata matching and rejects multiple matches. Query refinement removes nonessential search qualifiers using normal Python code. These routine steps use zero extra LLM tokens; this reduces quota dependence but can reject relevant images whose metadata uses synonyms or a different language. Explicit saved-note repair may still invoke AI planning. Missing requirements, ambiguous matches, retrieval failure and budget exhaustion have distinct UI messages.

## Retrieval control-flow review

Relevance is now checked before a provider's candidates are accepted. Irrelevant or invalid candidates do not prevent trying the next provider. Multiple relevant candidates are ranked rather than rejected; a controlled anatomical equivalence map normalizes alveoli/alveolus and capillaries/capillary while still requiring both concepts. Openverse descriptions/tags are retained. Missing individual concept queries are derived from actual lesson headings. Explicit visual priorities take precedence over derived queries within the bounded search budget. Asset validation logs report named rejection reasons.

Live lungs/airways and alveoli/capillaries queries on 2026-10-14 still returned no qualifying stored asset after these changes. Wikimedia failed; matching does not invent coverage for incomplete images. These failing live queries have not passed browser verification, and the problem must not be described as fully solved.
