"""
physics_teacher/services/__init__.py
"""
from .streaming_service import (
    get_llm,
    strip_markdown_fences,
    extract_json_object,
    build_fallback_response,
    stream_teaching_phases,
)

__all__ = [
    'get_llm',
    'strip_markdown_fences',
    'extract_json_object',
    'build_fallback_response',
    'stream_teaching_phases',
]
