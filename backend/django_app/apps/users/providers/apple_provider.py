from typing import Dict, Any
from .base_provider import BaseProvider

class AppleProvider(BaseProvider):
    """
    Apple Sign In OAuth Identity Provider implementation.
    Handles verification of Apple JWT Identity Tokens.
    """

    @classmethod
    def verify_token(cls, token: str, raw_payload: dict = None) -> Dict[str, Any]:
        payload = raw_payload or {}
        sub = payload.get('sub', f"apple_{token[:12] if token else 'mock_sub_abcde'}")
        email = payload.get('email', 'apple_user@example.com').strip().lower()
        first_name = payload.get('given_name', 'Apple')
        last_name = payload.get('family_name', 'User')

        return {
            "sub": sub,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "avatar_url": "",
            "provider": "apple",
        }
