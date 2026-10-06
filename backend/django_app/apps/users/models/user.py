from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower
from ..constants import AUTH_PROVIDER_CHOICES, AUTH_PROVIDER_EMAIL, DEFAULT_COUNTRY_CODE

class User(AbstractUser):
    """
    Custom User model for AI Teacher platform.
    Stores account identity, contact details, verified Google identity, and persistent profile preferences.
    """
    email = models.EmailField(unique=True, help_text="Primary email address for user authentication.")
    country_code = models.CharField(max_length=10, default=DEFAULT_COUNTRY_CODE, help_text="Country dial code (e.g. +92, +93, +91).")
    mobile = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text="User mobile contact number.")
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True, help_text="Google OAuth unique sub identifier.")
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDER_CHOICES, default=AUTH_PROVIDER_EMAIL, help_text="Method used for initial account registration.")
    avatar_url = models.TextField(null=True, blank=True, help_text="Profile image URL or uploaded image data.")
    cover_url = models.TextField(blank=True, default="")
    bio = models.TextField(blank=True, default="")
    grade_level = models.CharField(max_length=150, blank=True, default="")
    preferred_language = models.CharField(max_length=100, blank=True, default="")
    dob = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, default="")
    timezone = models.CharField(max_length=100, blank=True, default="")
    education_level = models.CharField(max_length=50, blank=True, default="")
    academic_year = models.CharField(max_length=50, blank=True, default="")
    selected_interests = models.JSONField(default=list, blank=True)
    onboarding_completed = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False, help_text="Indicates whether the account email or mobile is verified.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(AbstractUser.Meta):
        abstract = False
        constraints = [
            models.UniqueConstraint(Lower("email"), name="users_email_case_insensitive_unique"),
            models.UniqueConstraint(Lower("username"), name="users_username_case_insensitive_unique"),
        ]

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()
