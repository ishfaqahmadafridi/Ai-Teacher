"""Validated registration, login, and OAuth inputs."""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from apps.users.constants import DEFAULT_COUNTRY_CODE
from apps.users.services.validation_service import identity_exists

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    country_code = serializers.CharField(required=False, default=DEFAULT_COUNTRY_CODE)
    mobile = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=20)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email", "country_code", "mobile", "password"]

    def validate_email(self, value):
        value = value.strip().lower()
        if identity_exists("email", value):
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if identity_exists("username", value):
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_mobile(self, value):
        value = value or None
        if value and identity_exists("mobile", value):
            raise serializers.ValidationError("This mobile number is already registered.")
        return value

    def validate(self, attrs):
        try:
            validate_password(attrs["password"], User(**{k: v for k, v in attrs.items() if k != "password"}))
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": exc.messages}) from exc
        return attrs


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(trim_whitespace=False)


class RegisteredTokenRefreshSerializer(TokenRefreshSerializer):
    """Reject refresh tokens whose database account has been deleted."""

    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed("The account no longer exists. Please register first.") from exc
