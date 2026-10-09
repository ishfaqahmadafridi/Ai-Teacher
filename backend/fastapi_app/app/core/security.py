"""Token verification fails closed when the deployment has no signing key."""
import jwt
from app.core.config import settings

def verify_token(token: str) -> dict | None:
    if not settings.SECRET_KEY.strip():
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None
