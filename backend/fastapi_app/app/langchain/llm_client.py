"""
fastapi_app/app/langchain/llm_client.py
LangChain ChatGoogleGenerativeAI client wrapper for Gemini 2.5 Flash.
"""
import os
import logging
from shared.constants import DEFAULT_LLM_MODEL, DEFAULT_LLM_TEMPERATURE

logger = logging.getLogger(__name__)


def get_langchain_llm(temperature: float = DEFAULT_LLM_TEMPERATURE, streaming: bool = True):
    """
    Returns configured LangChain ChatGoogleGenerativeAI instance.
    """
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        api_key = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
        if not api_key:
            logger.warning("[LangChain LLM Client] GEMINI_API_KEY not set. Operating in graceful offline fallback mode.")
            return None

        return ChatGoogleGenerativeAI(
            model=DEFAULT_LLM_MODEL,
            google_api_key=api_key,
            temperature=temperature,
            streaming=streaming,
            max_retries=2,
            request_timeout=30.0,
        )
    except Exception as e:
        logger.error(f"[LangChain LLM Client] Could not initialize Gemini model: {e}")
        return None
