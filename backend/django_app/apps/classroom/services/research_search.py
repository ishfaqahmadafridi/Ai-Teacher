"""Fixed-provider, bounded HTTP retrieval; never fetch arbitrary result URLs."""
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from apps.classroom.agents.research.state import Evidence


from apps.classroom.constants.research import MAX_RESPONSE_BYTES, HTTP_TIMEOUT, PROVIDER_RESULT_LIMIT


def _request(url, *, payload=None, headers=None):
    request = Request(url, data=json.dumps(payload).encode() if payload else None,
                      headers={'Content-Type': 'application/json', **(headers or {})})
    with urlopen(request, timeout=HTTP_TIMEOUT) as response:
        raw = response.read(MAX_RESPONSE_BYTES + 1)
    if len(raw) > MAX_RESPONSE_BYTES:
        raise ValueError('Provider response exceeds limit')
    data = json.loads(raw)
    if not isinstance(data, dict) or not isinstance(data.get('results'), list):
        raise ValueError('Invalid provider response shape')
    return data


def search_provider(provider, question):
    if provider == 'tavily':
        key = os.getenv('TAVILY_API_KEY')
        if not key:
            return []
        data = _request('https://api.tavily.com/search',
                        headers={'Authorization': f'Bearer {key}'},
                        payload={'query': question, 'search_depth': 'basic', 'max_results': PROVIDER_RESULT_LIMIT,
                                 'include_answer': False, 'include_raw_content': False})
        records = [{'title': r.get('title', ''), 'url': r.get('url', ''),
                    'excerpt': r.get('content', '')} for r in data.get('results', [])[:PROVIDER_RESULT_LIMIT] if isinstance(r, dict)]
    elif provider == 'openalex':
        key = os.getenv('OPENALEX_API_KEY')
        if not key:
            return []
        query = urlencode({'search': question, 'per-page': PROVIDER_RESULT_LIMIT,
                           'select': 'id,display_name,doi', 'api_key': key})
        data = _request(f'https://api.openalex.org/works?{query}')
        records = [{'title': r.get('display_name', ''), 'url': r.get('doi') or r.get('id'),
                    'excerpt': ''} for r in data.get('results', [])[:PROVIDER_RESULT_LIMIT] if isinstance(r, dict)]
    else:
        raise ValueError('Unknown research provider')
    evidence = []
    for record in records:
        try:
            evidence.append(Evidence(**{**record, 'title': record['title'][:500],
                                        'excerpt': record['excerpt'][:2000],
                                        'provider': provider}).model_dump(mode='json'))
        except (ValueError, TypeError):
            continue
    return evidence
