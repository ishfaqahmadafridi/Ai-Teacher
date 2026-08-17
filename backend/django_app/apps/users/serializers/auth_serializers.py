from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user account via registration form.
    Validates input fields, handles password hashing, and returns created user.
    """
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    country_code = serializers.CharField(required=False, allow_blank=True, default="+92")
    mobile = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'country_code',
            'mobile',
            'password',
        ]

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate_username(self, value):
        normalized_username = value.strip()
        if User.objects.filter(username__iexact=normalized_username).exists():
            raise serializers.ValidationError("This username is already taken.")
        return normalized_username

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class GoogleAuthSerializer(serializers.Serializer):
    """
    Serializer for Google OAuth token authentication payload.
    Accepts id_token or code from Google OAuth popup / consent flow.
    """
    id_token = serializers.CharField(required=True, help_text="Google ID Token from OAuth client")
    access_token = serializers.CharField(required=False, allow_blank=True, help_text="Optional Google Access Token")
