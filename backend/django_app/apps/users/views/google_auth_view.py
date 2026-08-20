from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone
from ..serializers import GoogleAuthSerializer, UserSerializer
from ..providers import GoogleProvider
from apps.users.utilities import generate_user_tokens

User = get_user_model()

class GoogleAuthView(APIView):
    """
    Production Google OAuth Authentication View.
    Delegates token verification to GoogleProvider and executes database user upsert.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        id_token = serializer.validated_data.get('id_token')
        raw_payload = request.data.get('google_payload', {})

        # Step 1 & 2: Verify token & extract normalized profile via GoogleProvider
        google_profile = GoogleProvider.verify_token(id_token, raw_payload=raw_payload)

        google_sub = google_profile['sub']
        email = google_profile['email']
        first_name = google_profile['first_name']
        last_name = google_profile['last_name']
        avatar_url = google_profile['avatar_url']

        # Step 3: Database Upsert (Check if existing or new user)
        user = User.objects.filter(google_id=google_sub).first()
        if not user:
            user = User.objects.filter(email=email).first()

        if user:
            # Existing User: Update last login & profile picture
            user.google_id = google_sub
            if avatar_url:
                user.avatar_url = avatar_url
            user.last_login = timezone.now()
            user.save(update_fields=['google_id', 'avatar_url', 'last_login'])
        else:
            # New User: Create User with null password and google provider
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                google_id=google_sub,
                auth_provider='google',
                avatar_url=avatar_url,
                is_verified=True,
                last_login=timezone.now(),
            )
            user.set_unusable_password()
            user.save()

        # Step 4: Generate Application JWT tokens and return user profile
        tokens = generate_user_tokens(user)
        user_data = UserSerializer(user).data

        return Response({
            "user": user_data,
            "access": tokens["access"],
            "refresh": tokens["refresh"],
            "message": "Google authentication successful."
        }, status=status.HTTP_200_OK)
