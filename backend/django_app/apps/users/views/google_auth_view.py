"""Validated google login endpoint."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from apps.users.serializers import GoogleAuthSerializer, AuthResponseSerializer
from apps.users.services import google_login
from apps.users.utilities import generate_user_tokens


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_authenticate_header(self, request):
        return 'Bearer realm="api"'

    @extend_schema(tags=["auth"], request=GoogleAuthSerializer, responses={200: AuthResponseSerializer})
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = google_login(**serializer.validated_data)
        data = {"user": user, **generate_user_tokens(user)}
        return Response(AuthResponseSerializer(data).data, status=status.HTTP_200_OK)
