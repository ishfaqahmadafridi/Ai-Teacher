# Saved lecture notes

Successful authenticated `/api/ask/` answers become immutable `LectureNote` records.
The content is copied from the validated answer; preparing notes does not summarize,
translate or invoke an LLM. Each account/session/content hash identifies a version.
A new or corrected answer creates a new version. Repeated identical answers in the
same session reuse the existing record. Unavailable/fallback answers are not notes.

The Notes panel uses TanStack Query to list the account's most recent 50 saved
answers, including previous browser sessions. It shows the actual key points,
explanations, formulas, annotations and available research references. These are
prepared answer notes, not proof that the student listened to every section.

## Storage and exports

- `LectureNote`: owned lesson snapshot, source language, version, session and date.
- `NoteTranslation`: one validated cached translation per note version/language.
- `NoteFigure`: section index and private Django storage file reference.
- Images: bounded PNG files beneath `CLASSROOM_MEDIA_ROOT`; the default is the
  ignored `backend/django_app/private-media` directory. No public media route is
  added. Production can configure Django storage with a private object-storage
  backend. Deleting an owning note removes its files after the transaction commits.

Rendered classroom canvases are captured after a section begins, uploaded through
an authenticated ownership check, normalized by Pillow and saved once per section.
Capture failures do not stop teaching. Only diagrams actually rendered in a canvas
can be captured; plain text boards and missing/unsupported scenes are not invented
as graphs. Figures are shown in notes and embedded in Word/print output once saved.
Cross-origin browser restrictions may prevent a canvas screenshot; the original
text/formulas remain available. External image licensing is not inferred or verified
by the snapshot mechanism. Source attribution should be supplied by the lesson.

DOCX exports are genuine Open XML documents generated with pinned `python-docx`.
Headings, explanations, formulas, citations and saved PNGs are reused without any
inference. Urdu/Arabic paragraphs have RTL properties; formulas remain LTR.
Complex-script runs use Arial with system font fallback. Actual glyph/font rendering
still depends on the installed fonts and Word/browser. PDF uses a safe DOM-built
print window; choose Save as PDF. No text is inserted as executable HTML.

Export generation is synchronous and creates the file from the saved version each
time; it uses zero LLM tokens, but still uses CPU/storage I/O. Shared document caching
and queued exports are future production optimizations, not implemented guarantees.

## Translation costs and failure handling

Original language: no provider call. Translation is only requested by the explicit
Load or create translation action. The first successful translation is saved;
subsequent requests reuse it with `extra_llm_tokens: 0`. Downloads never implicitly
translate. Supported target codes come from Django language metadata; custom names
are resolved by the frontend's existing `iso-639-1` library. Unsupported languages
return validation errors rather than unrelated canned text.

New translation sends the saved text once, without sending images or source lists.
The existing Gemini integration defaults to configurable Gemini 2.5 Flash-Lite for
translation (thinking is off by default), with a bounded output budget and zero automatic
provider retries. Section count, requested language and numeric literals are checked;
formulas and source references are copied unchanged from the original. These checks
are safeguards, not proof of translation meaning or correctness in every language.

A database uniqueness constraint and processing lease prevent simultaneous requests
for the same translation from both calling the provider while the lease is active.
Provider/validation failure marks the request failed and leaves originals intact.
Expired leases can be reclaimed after a crashed worker. Updates include the lease
value so a stale request cannot overwrite a newer result. The default lease exceeds
the usual configured model timeout; deployments that increase that timeout must
increase the lease appropriately. New requests are throttled at the API layer.

Configuration (defaults; no credentials belong in tracked files):

```ini
NOTES_TRANSLATION_MODEL=gemini-2.5-flash-lite
NOTES_TRANSLATION_MAX_CHARACTERS=12000
NOTES_TRANSLATION_MAX_TOKENS=4096
NOTES_TRANSLATION_LEASE_SECONDS=180
NOTES_TRANSLATION_REQUEST_RATE=3/min
# CLASSROOM_MEDIA_ROOT=/private/storage/lecture-assets
```

Budget bounds are validated at startup. Local throttling/cache uses the configured
Django cache; production must use shared cache/storage and PostgreSQL and measure
concurrency. This implementation is not a verified thousand-user load result.

## Local setup and verification

```sh
cd backend/django_app
.venv/bin/python -m pip install -r requirements/base.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py test apps.classroom.tests --settings=config.settings.test
```

Authenticated conversation history is now namespaced by account before inference;
clearing a session uses that same namespace. Public request serializers reject
reserved internal account-history identifiers so guests cannot address them directly. Previous unscoped conversation history
is not automatically attached to an account. Saved notes remain after history clear.

Tests check saved answer versions, account isolation, real Word file parsing, RTL
properties, image validation/embedding, translation reuse, duplicate admission,
failed translation recovery and zero-inference source downloads. Provider output is
mocked in automated tests. Frontend checks cover schema validation, print HTML safety,
blocked windows, object URL cleanup and diagram-capture cleanup.

Implementation references:
- https://python-docx.readthedocs.io/en/latest/user/quickstart.html
- https://docs.langchain.com/oss/python/integrations/chat/google_generative_ai

- https://ai.google.dev/gemini-api/docs/thinking
