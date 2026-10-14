"""Serve only normalized public educational assets by content identifier."""
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from apps.classroom.services.visual_assets import asset_path


class VisualAssetView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(tags=['classroom'], responses={200: bytes})
    def get(self, request, digest):
        try:
            path = asset_path(digest)
            response = FileResponse(path.open('rb'), content_type='image/png')
        except (ValueError, FileNotFoundError):
            raise Http404 from None
        response['Cache-Control'] = 'public, max-age=31536000, immutable'
        response['X-Content-Type-Options'] = 'nosniff'
        return response
