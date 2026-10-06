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

Initial local verification found 22 existing ESLint errors and 29 production npm dependency
vulnerabilities (17 high and 2 critical). These checks currently fail; the workflow deliberately
reports them. Address the findings before expecting the quality gate to pass. Vulnerability counts
can change as advisories are updated.
