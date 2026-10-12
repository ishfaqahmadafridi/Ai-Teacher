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


from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

_bearer = HTTPBearer(auto_error=False)


def access_identity(token):
    claims = verify_token(token)
    if not claims or claims.get('token_type') != 'access' or not claims.get('exp'):
        return None
    identity = claims.get('user_id')
    return str(identity) if isinstance(identity, (str, int)) and str(identity).strip() else None


def require_access_token(credentials: HTTPAuthorizationCredentials | None = Depends(_bearer)):
    identity = access_identity(credentials.credentials) if credentials else None
    if identity is None:
        raise HTTPException(status_code=401, detail='A valid access token is required.', headers={'WWW-Authenticate': 'Bearer'})
    return identity


def private_session(identity, session_id):
    import hashlib
    return 'account:' + hashlib.sha256(f'{identity}:{session_id}'.encode()).hexdigest()
