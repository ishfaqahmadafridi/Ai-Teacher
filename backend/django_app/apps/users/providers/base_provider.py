from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseProvider(ABC):
    """
    Abstract Base Class for Social OAuth Providers (Google, Microsoft, Apple).
    Enforces a strict unified contract across all external identity providers.
    """

    @abstractmethod
    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verifies external OAuth token/credential and returns normalized user identity dictionary:
        {
            "sub": str,
            "email": str,
            "first_name": str,
            "last_name": str,
            "avatar_url": str,
        }
        """
        pass
