"""Verify Google identity using the provider's signed token, never client profile data."""
from django.conf import settings
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from rest_framework.exceptions import AuthenticationFailed, APIException
from .base_provider import BaseProvider


class GoogleProvider(BaseProvider):
    @classmethod
    def verify_token(cls, token: str, raw_payload=None):
        client_id = settings.GOOGLE_OAUTH_CLIENT_ID
        if not client_id:
            error = APIException("Google sign-in is not configured.")
            error.status_code = 503
            raise error
        try:
            payload = id_token.verify_oauth2_token(token, Request(), audience=client_id)
        except (ValueError, GoogleAuthError) as exc:
            raise AuthenticationFailed("Invalid Google identity token.") from exc
        if not payload.get("sub") or not payload.get("email") or payload.get("email_verified") is not True:
            raise AuthenticationFailed("Google account requires a verified email.")
        return {"sub": payload["sub"], "email": payload["email"].strip().lower(),
                "first_name": payload.get("given_name", ""), "last_name": payload.get("family_name", ""),
                "avatar_url": payload.get("picture", ""), "provider": "google"}
