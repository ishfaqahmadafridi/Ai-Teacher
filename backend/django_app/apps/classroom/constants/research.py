"""Environment-configurable research request budgets."""
import os
import math
from django.core.exceptions import ImproperlyConfigured


def research_budget(name, default, *, maximum, integer=True):
    """Reject invalid budgets at startup rather than allowing unbounded requests."""
    try:
        value = (int if integer else float)(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        raise ImproperlyConfigured(f'{name} must be a positive numeric budget') from None
    if not math.isfinite(value) or not 0 < value <= maximum:
        raise ImproperlyConfigured(f'{name} must be greater than zero and at most {maximum}')
    return value

PROVIDERS = ('tavily', 'openalex')
TAVILY_SEARCH_URL = 'https://api.tavily.com/search'
OPENALEX_WORKS_URL = 'https://api.openalex.org/works'
EVIDENCE_TITLE_LIMIT = 500
EVIDENCE_EXCERPT_LIMIT = 2000
PROVIDER_RESULT_LIMIT = int(research_budget('RESEARCH_PROVIDER_RESULT_LIMIT', 3, maximum=10))
HTTP_TIMEOUT = research_budget('RESEARCH_HTTP_TIMEOUT', 8, maximum=30, integer=False)
MAX_RESPONSE_BYTES = research_budget('RESEARCH_MAX_RESPONSE_BYTES', 1000000, maximum=5000000)
CACHE_SECONDS = research_budget('RESEARCH_CACHE_SECONDS', 3600, maximum=86400)

WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php'
IMAGE_RESULT_LIMIT = 3
IMAGE_WIDTH = 960
IMAGE_MIME_TYPES = ('image/jpeg', 'image/png', 'image/svg+xml')
IMAGE_USER_AGENT = 'AiTeacher/1.0 (educational image discovery; https://github.com/ishfaqahmadafridi/Ai-Teacher)'

OPENVERSE_API_URL = 'https://api.openverse.org/v1'
VISUAL_QUERY_LIMIT = int(research_budget('VISUAL_QUERY_LIMIT', 6, maximum=20))
VISUAL_SEARCH_WORKERS = 3
VISUAL_TERM_EQUIVALENTS = {'alveoli': 'alveolus', 'alveolar': 'alveolus', 'capillaries': 'capillary', 'lungs': 'lung', 'airways': 'airway'}
VISUAL_QUERY_QUALIFIERS = frozenset(('a', 'an', 'the', 'of', 'and', 'with', 'for', 'in', 'diagram', 'diagrams', 'labelled', 'labeled', 'illustration', 'image', 'overall', 'associated'))
MAX_IMAGE_BYTES = 8 * 1024 * 1024
MAX_IMAGE_PIXELS = 20_000_000
VISUAL_MEDIA_HOSTS = ('upload.wikimedia.org', 'staticflickr.com', 'images.metmuseum.org')
