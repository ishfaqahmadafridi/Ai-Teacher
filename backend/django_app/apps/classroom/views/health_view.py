"""
API View for server health checking.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.classroom.rag import is_ready as is_rag_ready
from apps.classroom.constants import GEMINI_MODEL, RAG_SOURCE
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers


class HealthView(APIView):
    """GET /api/health/ — Returns server health, model status, and RAG readiness."""

    @extend_schema(tags=["classroom"], responses=inline_serializer(
        name="ClassroomHealth", fields={
            "status": serializers.CharField(), "model": serializers.CharField(),
            "rag": serializers.DictField(),
        },
    ))
    def get(self, request):
        rag_active = is_rag_ready()
        return Response(
            {
                "status": "ready",
                "model": GEMINI_MODEL,
                "rag": {
                    "active": rag_active,
                    "dataset": RAG_SOURCE,
                    "status": "active" if rag_active else "initializing_or_fallback",
                },
            },
            status=status.HTTP_200_OK,
        )
