"""Fetch and persist the currently authenticated user's profile."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from apps.users.serializers import UserSerializer, ProfileUpdateSerializer
from apps.users.services import update_profile


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["auth"], responses=UserSerializer)
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    @extend_schema(tags=["auth"], request=ProfileUpdateSerializer, responses=UserSerializer)
    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = update_profile(request.user, serializer.validated_data)
        return Response(UserSerializer(user).data)
