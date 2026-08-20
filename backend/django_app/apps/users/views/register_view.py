from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..serializers import UserRegisterSerializer, UserSerializer
from apps.users.utilities import generate_user_tokens

class RegisterView(APIView):
    """
    API view to register a new user account.
    Validates form data, saves user to database, and returns user object with auth tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = generate_user_tokens(user)
            user_data = UserSerializer(user).data
            return Response(
                {
                    "user": user_data,
                    "access": tokens["access"],
                    "refresh": tokens["refresh"],
                    "message": "User registered successfully."
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
