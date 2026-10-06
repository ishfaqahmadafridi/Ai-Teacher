"""Authenticate against real accounts and persist registration atomically."""
from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed, ValidationError

from apps.users.providers import GoogleProvider

User = get_user_model()


def register_user(validated_data):
    try:
        with transaction.atomic():
            return User.objects.create_user(**validated_data)
    except IntegrityError as exc:
        raise ValidationError("Email, username, or mobile is already registered.") from exc


def login_user(email, password):
    candidate = User.objects.filter(email__iexact=email).first()
    if candidate is None:
        User().set_password(password)
        raise AuthenticationFailed("Invalid email or password.")
    # Use Django's backend so inactive accounts and password checks are handled consistently.
    user = authenticate(username=candidate.username, password=password)
    if user is None:
        raise AuthenticationFailed("Invalid email or password.")
    user.last_login = timezone.now()
    user.save(update_fields=["last_login", "updated_at"])
    return user


def google_login(id_token, **kwargs):
    profile = GoogleProvider.verify_token(id_token)
    try:
        with transaction.atomic():
            user = User.objects.select_for_update().filter(google_id=profile["sub"]).first()
            if user is None:
                user = User.objects.select_for_update().filter(email__iexact=profile["email"]).first()
            if user:
                if not user.is_active:
                    raise AuthenticationFailed("This account is inactive.")
                if user.google_id and user.google_id != profile["sub"]:
                    raise AuthenticationFailed("Google account does not match the linked account.")
                user.google_id = profile["sub"]
                user.is_verified = True
                if not user.first_name:
                    user.first_name = profile["first_name"]
                if not user.last_name:
                    user.last_name = profile["last_name"]
                if profile["avatar_url"]:
                    user.avatar_url = profile["avatar_url"]
                user.last_login = timezone.now()
                user.save()
            else:
                raise AuthenticationFailed("No registered account matches this Google sign-in. Please register first.")
            return user
    except IntegrityError as exc:
        raise ValidationError("Account details conflict with an existing account. Please sign in again.") from exc
