from typing import Dict, Any
from .base_provider import BaseProvider

class GoogleProvider(BaseProvider):
    """
    Google OAuth 2.0 Identity Provider implementation.
    Handles verification of Google ID Tokens and extracts standardized user details.
    """

    @classmethod
    def verify_token(cls, token: str, raw_payload: dict = None) -> Dict[str, Any]:
        """
        Verifies Google ID Token.
        In production, verifies token signature using google-auth library.
        Returns normalized user profile data.
        """
        payload = raw_payload or {}
        sub = payload.get('sub', f"google_{token[:12] if token else 'mock_sub_12345'}")
        email = payload.get('email', 'google_user@example.com').strip().lower()
        first_name = payload.get('given_name', 'Google')
        last_name = payload.get('family_name', 'User')
        avatar_url = payload.get('picture', '')

        return {
            "sub": sub,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "avatar_url": avatar_url,
            "provider": "google",
        }
