"""One bounded graph: cached evidence, parallel tools, and normalized sources."""
import hashlib
from concurrent.futures import ThreadPoolExecutor
from django.core.cache import cache
from langgraph.graph import StateGraph, START, END
from .state import ResearchState
from apps.classroom.constants.research import PROVIDERS, CACHE_SECONDS, PROVIDER_RESULT_LIMIT


def _collect(state):
    from apps.classroom.services.research_search import search_provider
    evidence, errors = [], []
    with ThreadPoolExecutor(max_workers=len(PROVIDERS)) as executor:
        jobs = {name: executor.submit(search_provider, name, state['question'])
                for name in PROVIDERS}
        for provider, job in jobs.items():
            try:
                evidence.extend(job.result())
            except Exception:
                # Do not log provider exception strings: URLs may contain keys.
                errors.append(provider)
    seen, unique = set(), []
    for item in evidence:
        if item['url'] not in seen:
            seen.add(item['url'])
            unique.append(item)
    return {'evidence': unique[:len(PROVIDERS) * PROVIDER_RESULT_LIMIT], 'errors': errors}


def _build_graph():
    graph = StateGraph(ResearchState)
    graph.add_node('collect', _collect)
    graph.add_edge(START, 'collect')
    graph.add_edge('collect', END)
    return graph.compile()


_graph = _build_graph()


def research_evidence(question):
    key = 'research:v1:' + hashlib.sha256(question.strip().casefold().encode()).hexdigest()
    try:
        cached = cache.get(key)
    except Exception:
        cached = None
    if cached is not None:
        return cached
    result = _graph.invoke({'question': question, 'evidence': [], 'errors': []},
                           config={'recursion_limit': 4})
    if result['evidence']:
        try:
            cache.set(key, result, timeout=CACHE_SECONDS)
        except Exception:
            pass  # Evidence remains usable when cache infrastructure is unavailable.
    return result
