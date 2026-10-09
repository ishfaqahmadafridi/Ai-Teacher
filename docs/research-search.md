# Local research search

SearXNG finds links and snippets from configured upstream engines. It is not an
LLM and does not validate facts or read every page. DuckDuckGo is supported as an
upstream engine; default engine availability can change.

## Start SearXNG

Install/start Docker Desktop first. From the repository root:

```sh
export SEARXNG_SECRET="$(openssl rand -hex 32)"
docker compose -f infra/searxng-compose.yml up -d
curl --get 'http://localhost:8888/search' --data-urlencode 'q=linear momentum examples' --data-urlencode 'format=json'
```

The secret signs SearXNG data; it is not an API key. Do not commit it. Keep it in
an ignored environment file for a stable local deployment. `SEARXNG_IMAGE` can
select a tested image tag/digest; the default latest image is for initial local
setup and has not been runtime verified here. The service is localhost-only;
its limiter is disabled for private local use, not public deployment.

The classroom agent is not connected yet. Its backend HTTP tool would call:
`GET http://127.0.0.1:8888/search?q=...&format=json`.
When the backend runs inside Docker, use
`http://host.docker.internal:8888` on Docker Desktop. Store that address as
`SEARXNG_URL` in the ignored backend environment file. Browser/frontend calls
should go through the authenticated backend, not directly to search providers.

OpenAlex uses its own API endpoint and `OPENALEX_API_KEY`; it is a separate tool,
not the next hop after SearXNG. Regenerate any key shared in chat. Never put keys
into frontend code, tracked configuration, or logs.

## Recommended research workflow

Question -> cached evidence -> bounded parallel search tools -> deduplicate and
rank sources -> retrieve permitted source text -> answer with citations.
Use LangGraph to coordinate this bounded workflow, not an unlimited search loop.
Call only relevant tools, reuse topic-level evidence, deduplicate concurrent
identical searches, and cap requests, response sizes and LLM tokens. Do not share
private student conversations across users. Treat retrieved text as untrusted
evidence rather than agent instructions.

Search/provider failure should produce an honest fallback using existing course
material. Free software and API allowances do not guarantee zero operating cost,
accuracy, or 1,000 concurrent uncached searches. Production needs queued jobs,
shared Redis caching, provider-specific rate limits, PostgreSQL persistence,
monitoring and measured load tests. Upstream blocking cannot be fixed simply by
adding more workers.

Configuration parsing and file paths were checked. Docker installation, image
pull/start, live searches and classroom integration remain unverified/unimplemented.

References:
- https://docs.searxng.org/admin/installation-docker.html
- https://docs.searxng.org/dev/search_api.html
- https://docs.searxng.org/dev/engines/online/duckduckgo.html
- https://help.openalex.org/api/authentication/
