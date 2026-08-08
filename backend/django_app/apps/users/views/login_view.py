from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone
from ..serializers import UserSerializer
from .token_utils import generate_user_tokens

User = get_user_model()

class LoginView(APIView):
    """
    API view to authenticate an existing user.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        if user and user.check_password(password):
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            tokens = generate_user_tokens(user)
            user_data = UserSerializer(user).data
            return Response({
                "user": user_data,
                "access": tokens["access"],
                "refresh": tokens["refresh"],
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)
