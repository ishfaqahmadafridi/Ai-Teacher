"""Optional bounded retrieval for chat; small talk does not need a textbook lookup."""
import asyncio
import logging
import re
from app.constants.streaming import RETRIEVAL_TIMEOUT_SECONDS, SMALL_TALK_PATTERN
from app.services.rag_service import search

logger = logging.getLogger(__name__)


async def get_stream_context(question: str) -> str:
    if re.fullmatch(SMALL_TALK_PATTERN, question, flags=re.IGNORECASE):
        return ''
    try:
        return await asyncio.wait_for(search(question, top_k=3), timeout=RETRIEVAL_TIMEOUT_SECONDS)
    except Exception:
        logger.warning('Optional chat retrieval unavailable; continuing without textbook context')
        return ''
