"""Environment-configurable research request budgets."""
import os

PROVIDERS = ('tavily', 'openalex')
PROVIDER_RESULT_LIMIT = int(os.getenv('RESEARCH_PROVIDER_RESULT_LIMIT', '3'))
HTTP_TIMEOUT = float(os.getenv('RESEARCH_HTTP_TIMEOUT', '8'))
MAX_RESPONSE_BYTES = int(os.getenv('RESEARCH_MAX_RESPONSE_BYTES', '1000000'))
CACHE_SECONDS = int(os.getenv('RESEARCH_CACHE_SECONDS', '3600'))
