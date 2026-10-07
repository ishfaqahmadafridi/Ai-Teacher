# Continuous integration

`Application CI` runs on every pull request, pushes to main/dev/develop, and manual dispatch.
Frontend jobs run independently: full ESLint, TypeScript, the executable auth/query regression suite,
Next.js production build, and a production npm vulnerability audit (high/critical findings fail).
Legacy frontend `.test.ts` files need a test runner configuration and are not covered by this regression command.

Django runs configuration checks, migration drift detection, migrations, and users/dashboard/classroom tests.
FastAPI runs its unittest suite from the correct backend folder. Backend jobs check Python syntax,
dependency compatibility, and known dependency vulnerabilities with pip-audit. Tests use SQLite,
empty AI credentials, and offline Hugging Face settings; they do not validate a live LLM response,
a production database, or browser end-to-end flows.

Actions are pinned to commit SHAs, tokens have read-only repository permissions, checkout does not
persist credentials, jobs have timeouts, and superseded runs are cancelled. Independent matrix
checks continue when another check fails. Dependabot checks npm, both Python projects, and Actions weekly.

The `CI / Quality gate` check fails if any required group fails, is skipped, or is cancelled.
To enforce this during merging, add it as a required status check in GitHub Settings → Rules → Rulesets
for the protected branch. The workflow itself does not configure repository merge permissions.

Read each individual matrix job's log for errors. A green gate means the checks above passed, not
that every possible bug or vulnerability has been ruled out. No failing checks are ignored.

Local commands:

```sh
cd frontend
npm ci
npm run lint
npm run typecheck
npm run test:regressions
npm run build
npm audit --omit=dev --audit-level=high
```

```sh
cd backend/django_app
python manage.py check --settings=config.settings.test
python manage.py makemigrations --check --dry-run --settings=config.settings.test
python manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test
```

The React 19 peer conflict is resolved by using Emoji Mart's native picker instead of its React wrapper.
Shadcn is a development CLI and is declared as a dev dependency. Next.js and transitive runtime
packages have been upgraded to clear the high/critical npm production audit gate. Low-severity
KaTeX advisory chains remain visible in npm's report; the configured threshold is high.

The Python audit exports every installed package's public PEP 440 version for advisory lookup;
Torch's `+cpu` build label is removed, but Torch itself is retained. A regression test verifies this.
No dependency or advisory is ignored. ChromaDB was replaced by FAISS cosine retrieval with FastEmbed
ONNX embeddings. Django and FastAPI share the same collection, model, and atomic pickle-free snapshot.
The default API runtime no longer installs Torch or Transformers; the optional fine-tuned model loader
has separate requirements in `backend/django_app/requirements/local-model.txt`.
Shared tests cover ranking, snapshot round trips, model mismatch, invalid vectors, and failed writes.

To rebuild retrieval, place the publisher's College Physics 2e PDF at the configured `CLASSROOM_PDF_PATH`
and run `python manage.py embed_pdf --rebuild` from `backend/django_app` with network access for the
initial model download. `CLASSROOM_VECTOR_INDEX_PATH`, `CLASSROOM_EMBED_CACHE_PATH`, and
`CLASSROOM_EMBED_THREADS` configure storage and CPU usage. PDF, model cache, and generated snapshots
are excluded from Git. Previous Chroma files are preserved and are no longer read.
The source is [OpenStax College Physics 2e](https://openstax.org/details/books/college-physics-2e);
follow the publisher's current license when distributing the source or derived index.
