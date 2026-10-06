"""Apple sign-in is unavailable until a verified provider flow is configured."""
from rest_framework.exceptions import APIException
from .base_provider import BaseProvider


class AppleProvider(BaseProvider):
    @classmethod
    def verify_token(cls, token: str, raw_payload=None):
        error = APIException("Apple sign-in is not configured.")
        error.status_code = 503
        raise error
