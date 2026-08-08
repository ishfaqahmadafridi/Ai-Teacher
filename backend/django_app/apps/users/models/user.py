from django.contrib.auth.models import AbstractUser
from django.db import models
from ..constants import AUTH_PROVIDER_CHOICES, AUTH_PROVIDER_EMAIL, DEFAULT_COUNTRY_CODE

class User(AbstractUser):
    """
    Custom User model for AI Teacher platform.
    Supports email, username, full name, country code, mobile, and Social OAuth (Google, Microsoft, Apple) authentication.
    """
    email = models.EmailField(unique=True, help_text="Primary email address for user authentication.")
    country_code = models.CharField(max_length=10, default=DEFAULT_COUNTRY_CODE, help_text="Country dial code (e.g. +92, +93, +91).")
    mobile = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text="User mobile contact number.")
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True, help_text="Google OAuth unique sub identifier.")
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDER_CHOICES, default=AUTH_PROVIDER_EMAIL, help_text="Method used for initial account registration.")
    avatar_url = models.URLField(max_length=500, null=True, blank=True, help_text="Profile picture URL from OAuth provider.")
    is_verified = models.BooleanField(default=False, help_text="Indicates whether the account email or mobile is verified.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
