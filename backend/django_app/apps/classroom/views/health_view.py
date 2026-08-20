"""
API View for server health checking.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.classroom.rag import is_ready as is_rag_ready


class HealthView(APIView):
    """GET /api/health/ — Returns server health, model status, and RAG readiness."""

    def get(self, request):
        rag_active = is_rag_ready()
        return Response(
            {
                "status": "ready",
                "model": "gemini-2.5-flash",
                "rag": {
                    "active": rag_active,
                    "dataset": "college-physics-2e",
                    "status": "active" if rag_active else "initializing_or_fallback",
                },
            },
            status=status.HTTP_200_OK,
        )
