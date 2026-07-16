# Security Rules

> Read this before touching settings.py, .env, authentication, CORS, API keys, or any endpoint.

---

## Rule 1 — Secrets Are NEVER in Source Code

**Absolute rule. No exceptions.**

```python
# ✅ CORRECT
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# ❌ NEVER — even for "just testing"
SECRET_KEY = 'django-insecure-2cha278l)51x=a@nw4l&...'
GEMINI_API_KEY = 'AIzaSy...'
```

If a secret is committed to Git, it is compromised — even if you delete it in the next commit. Git history is permanent.

---

## Rule 2 — `DEBUG`, `ALLOWED_HOSTS`, `CORS` Are Environment-Specific

| Setting | Development | Production |
|---|---|---|
| `DEBUG` | `True` (via `.env`) | `False` (via host env var) |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | `yourdomain.com` |
| `CORS_ALLOW_ALL_ORIGINS` | `True` (auto, when DEBUG=True) | `False` |
| `CORS_ALLOWED_ORIGINS` | Not needed | Exact frontend origin |

---

## Rule 3 — `.env` Is Never Committed to Git

The `.gitignore` must always include:
```
.env
.env.local
.env.*.local
*.key
```

The `.env.example` file IS committed — it documents what is needed without containing real values.

---

## Rule 4 — API Keys Are Read from `os.getenv()` — Always Checked

When reading an API key, always log a warning if it is missing:

```python
# ✅ CORRECT
def get_llm():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise RuntimeError(
            'GEMINI_API_KEY is not set. Add it to backend/.env'
        )
    ...

# ❌ WRONG — silent failure, confusing errors later
def get_llm():
    api_key = os.getenv('GEMINI_API_KEY')
    _llm = ChatGoogleGenerativeAI(google_api_key=api_key, ...)  # fails with cryptic error
```

---

## Rule 5 — `Access-Control-Allow-Origin: *` Only for SSE Endpoints

The SSE endpoint (`ExplainView`) sets `Access-Control-Allow-Origin: *` because browsers require this for `EventSource`. This is acceptable only on that endpoint. All other endpoints rely on the global CORS settings.

```python
# ✅ Only on the SSE streaming endpoint
response['Access-Control-Allow-Origin'] = '*'

# ❌ Do not add this header to non-streaming endpoints
```

---

## Rule 6 — New Endpoints Need Rate Limiting in Production

Currently the API has no rate limiting (it uses `AllowAny` permissions). Before deploying to production, add:

```python
# requirements: pip install django-ratelimit
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def post(self, request):
    ...
```

Or use a reverse proxy (nginx, Cloudflare) to enforce request limits.

---

## Rule 7 — Session IDs Are Never Trusted Blindly

The `session_id` field from the request is used as a dictionary key. Never use it as a file path, SQL column without parameterization, or shell argument.

```python
# ✅ CORRECT — used only as a dict key
history = get_session(session_id)

# ❌ WRONG — shell injection risk
os.system(f'rm -rf /sessions/{session_id}')

# ❌ WRONG — path traversal risk
open(f'/data/{session_id}.json').read()
```

---

## Security Checklist

Before submitting any change that touches settings, env, or auth:

- [ ] No secrets in any Python or TypeScript file
- [ ] All new env vars added to `.env.example` with description
- [ ] `DEBUG`, `ALLOWED_HOSTS`, `CORS` read from env vars
- [ ] Any new API key usage validates with `if not api_key: raise RuntimeError(...)`
- [ ] `Access-Control-Allow-Origin: *` only on SSE endpoints
- [ ] `.env` is in `.gitignore`
