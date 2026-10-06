"""Persist the authenticated user's profile without accepting identity overrides."""
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from rest_framework.exceptions import ValidationError

User = get_user_model()


def update_profile(user, validated_data):
    try:
        with transaction.atomic():
            current = User.objects.select_for_update().get(pk=user.pk)
            if "email" in validated_data and validated_data["email"] != current.email:
                current.is_verified = False
            for field, value in validated_data.items():
                setattr(current, field, value)
            current.save()
            return current
    except IntegrityError as exc:
        raise ValidationError("Email or mobile is already in use.") from exc
