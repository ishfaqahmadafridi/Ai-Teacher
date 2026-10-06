"""Validated register user endpoint."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from apps.users.serializers import UserRegisterSerializer, AuthResponseSerializer
from apps.users.services import register_user
from apps.users.utilities import generate_user_tokens


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(tags=["auth"], request=UserRegisterSerializer, responses={201: AuthResponseSerializer})
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = register_user(serializer.validated_data)
        data = {"user": user, **generate_user_tokens(user)}
        return Response(AuthResponseSerializer(data).data, status=status.HTTP_201_CREATED)
