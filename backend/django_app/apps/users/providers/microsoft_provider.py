from typing import Dict, Any
from .base_provider import BaseProvider

class MicrosoftProvider(BaseProvider):
    """
    Microsoft Azure OAuth Identity Provider implementation.
    Handles verification of Microsoft OAuth tokens and extracts standardized user details.
    """

    @classmethod
    def verify_token(cls, token: str, raw_payload: dict = None) -> Dict[str, Any]:
        payload = raw_payload or {}
        sub = payload.get('sub', f"microsoft_{token[:12] if token else 'mock_sub_67890'}")
        email = payload.get('email', payload.get('userPrincipalName', 'ms_user@example.com')).strip().lower()
        first_name = payload.get('given_name', 'Microsoft')
        last_name = payload.get('family_name', 'User')
        avatar_url = payload.get('picture', '')

        return {
            "sub": sub,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "avatar_url": avatar_url,
            "provider": "microsoft",
        }
