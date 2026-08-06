"""
physics_teacher/views.py

AI Physics Teacher — HTTP routing layer only.

All LLM logic, JSON parsing, and SSE generation live in:
    physics_teacher/services/streaming_service.py

All prompt text lives in:
    physics_teacher/prompts/teaching_prompt.py

Endpoints:
    POST /api/physics-teacher/explain/   — SSE stream of teaching phases
    GET  /api/physics-teacher/health/    — API health check
"""

import os
import logging

from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from physics_teacher.services import stream_teaching_phases

logger = logging.getLogger(__name__)


class ExplainView(APIView):
    """
    POST /api/physics-teacher/explain/

    Returns a Server-Sent Events (SSE) stream.

    Events:
        data: {"status": "thinking"}          -- immediate heartbeat
        data: {"result": { ...phases... }}    -- complete teaching response
        data: [DONE]                          -- stream complete

    Request body:
        {
            "question": "what is projectile motion",
            "language": "en"   // optional, defaults to "en"
        }
    """

    def post(self, request):
        student_question = request.data.get('question', '').strip()
        if not student_question:
            return Response(
                {
                    'error': "Field 'question' is required and cannot be empty.",
                    'hint': 'Send: { "question": "what is projectile motion" }',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        language = request.data.get('language', 'en').strip().lower()

        logger.info(
            f"[ExplainView] SSE stream requested: "
            f"question='{student_question[:80]}' language='{language}'"
        )

        response = StreamingHttpResponse(
            stream_teaching_phases(student_question, language),
            content_type='text/event-stream',
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        response['Access-Control-Allow-Origin'] = '*'
        return response


class HealthView(APIView):
    """
    GET /api/physics-teacher/health/

    Confirms the physics_teacher app is running and Gemini key is configured.
    """

    def get(self, request):
        api_key_configured = bool(os.getenv('GEMINI_API_KEY'))
        return Response(
            {
                'status': 'ready' if api_key_configured else 'missing_api_key',
                'app': 'physics_teacher',
                'model': 'gemini-2.5-flash',
                'rag': 'college-physics-2e (sentence-transformers local)',
                'streaming': True,
                'api_key_configured': api_key_configured,
            },
            status=status.HTTP_200_OK,
        )
