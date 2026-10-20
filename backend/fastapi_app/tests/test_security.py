"""Verify environment credential handling without real keys or network calls."""
import secrets
import unittest
from unittest.mock import patch

import jwt
from app.core.config import Settings
from app.core.security import verify_token


class SecurityTests(unittest.TestCase):
    def test_configuration_has_no_default_credentials(self):
        with patch.dict('os.environ', {}, clear=True):
            settings = Settings(_env_file=None)
        self.assertEqual(settings.SECRET_KEY, '')
        self.assertEqual(settings.DB_PASSWORD, '')

    def test_unconfigured_signing_key_never_calls_jwt_decode(self):
        with patch('app.core.security.settings.SECRET_KEY', ''), patch('app.core.security.jwt.decode') as decode:
            self.assertIsNone(verify_token('invalid'))
        decode.assert_not_called()

    def test_configured_signing_key_verifies_token(self):
        key = secrets.token_urlsafe(32)
        token = jwt.encode({'sub': 'test-user'}, key, algorithm='HS256')
        with patch('app.core.security.settings.SECRET_KEY', key):
            self.assertEqual(verify_token(token)['sub'], 'test-user')

    def test_wrong_signing_key_rejects_token(self):
        token = jwt.encode({'sub': 'test-user'}, secrets.token_urlsafe(32), algorithm='HS256')
        with patch('app.core.security.settings.SECRET_KEY', secrets.token_urlsafe(32)):
            self.assertIsNone(verify_token(token))


    def test_refresh_token_is_not_an_access_identity(self):
        from app.core.security import access_identity
        with patch('app.core.security.verify_token', return_value={'token_type': 'refresh', 'exp': 9999999999, 'user_id': 1}):
            self.assertIsNone(access_identity('token'))

    def test_missing_expiry_is_rejected(self):
        from app.core.security import access_identity
        with patch('app.core.security.verify_token', return_value={'token_type': 'access', 'user_id': 1}):
            self.assertIsNone(access_identity('token'))

    def test_session_identity_is_account_scoped(self):
        from app.core.security import private_session
        self.assertNotEqual(private_session('1', 'shared'), private_session('2', 'shared'))

    def test_http_authentication_fails_before_streaming(self):
        from fastapi import FastAPI, Depends
        from fastapi.testclient import TestClient
        from app.core.security import require_access_token
        app = FastAPI()
        @app.get('/protected', dependencies=[Depends(require_access_token)])
        def protected():
            return {'ok': True}
        self.assertEqual(TestClient(app).get('/protected').status_code, 401)


    def test_database_credentials_are_url_encoded(self):
        from urllib.parse import urlsplit, unquote
        settings = Settings(DB_USER='test@user', DB_PASSWORD='not-a-secret@:/')
        parsed = urlsplit(settings.ASYNC_DATABASE_URL)
        self.assertEqual(unquote(parsed.username), settings.DB_USER)
        self.assertEqual(unquote(parsed.password), settings.DB_PASSWORD)

    def test_default_cors_is_not_wildcard(self):
        with patch.dict('os.environ', {}, clear=True):
            self.assertNotIn('*', Settings().BACKEND_CORS_ORIGINS)

    def test_explicit_shared_env_loads_signing_key_without_builtin_credentials(self):
        from pathlib import Path
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as folder, patch.dict('os.environ', {}, clear=True):
            shared = Path(folder) / '.env'
            shared.write_text('DJANGO_SECRET_KEY=test-only-shared-secret\nIGNORED_SERVICE_SETTING=value\n')
            config = Settings(_env_file=shared)
            self.assertEqual(config.SECRET_KEY, 'test-only-shared-secret')

    def test_environment_signing_key_overrides_env_file(self):
        from pathlib import Path
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as folder, patch.dict('os.environ', {'DJANGO_SECRET_KEY': 'process-key'}, clear=True):
            shared = Path(folder) / '.env'
            shared.write_text('DJANGO_SECRET_KEY=file-key\n')
            self.assertEqual(Settings(_env_file=shared).SECRET_KEY, 'process-key')
