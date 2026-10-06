"""Database-backed profile response and validated profile edits."""
import base64
import binascii
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from apps.users.services.validation_service import identity_exists

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    role = serializers.SerializerMethodField()

    def get_role(self, user) -> str:
        return "admin" if user.is_staff or user.is_superuser else "student"

    class Meta:
        model = User
        fields = [
            "id", "first_name", "last_name", "full_name", "username", "email",
            "country_code", "mobile", "auth_provider", "avatar_url", "cover_url",
            "is_verified", "created_at", "role", "bio", "grade_level", "preferred_language",
            "dob", "country", "timezone", "education_level", "academic_year",
            "selected_interests", "onboarding_completed",
        ]
        read_only_fields = fields


class ProfileUpdateSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=2_000_000)
    cover_url = serializers.CharField(required=False, allow_blank=True, max_length=2_000_000)
    mobile = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=20)
    selected_interests = serializers.ListField(
        child=serializers.CharField(max_length=150), max_length=100, required=False
    )

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "country_code", "mobile", "avatar_url",
                  "cover_url", "bio", "grade_level", "preferred_language", "dob", "country",
                  "timezone", "education_level", "academic_year", "selected_interests",
                  "onboarding_completed"]
        extra_kwargs = {"bio": {"max_length": 5000}}

    def validate_email(self, value):
        value = value.strip().lower()
        if identity_exists("email", value, self.instance):
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_mobile(self, value):
        value = value or None
        if value and identity_exists("mobile", value, self.instance):
            raise serializers.ValidationError("This mobile number is already registered.")
        return value

    def validate_timezone(self, value):
        if value:
            try:
                ZoneInfo(value)
            except ZoneInfoNotFoundError as exc:
                raise serializers.ValidationError("Unknown timezone.") from exc
        return value

    def validate_avatar_url(self, value):
        return self._validate_image(value)

    def validate_cover_url(self, value):
        return self._validate_image(value)

    def _validate_image(self, value):
        if not value:
            return value
        if value.startswith("/images/") and ".." not in value:
            return value
        if value.startswith("data:"):
            header, separator, encoded = value.partition(",")
            if not separator or header not in (
                "data:image/png;base64", "data:image/jpeg;base64",
                "data:image/gif;base64", "data:image/webp;base64",
            ):
                raise serializers.ValidationError("Unsupported image format.")
            try:
                base64.b64decode(encoded, validate=True)
            except (ValueError, binascii.Error) as exc:
                raise serializers.ValidationError("Invalid image data.") from exc
        else:
            try:
                URLValidator(schemes=["http", "https"])(value)
            except DjangoValidationError as exc:
                raise serializers.ValidationError("Invalid image URL.") from exc
        return value


class AuthResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    access = serializers.CharField()
    refresh = serializers.CharField()
