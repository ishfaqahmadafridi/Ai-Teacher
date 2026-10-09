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
            settings = Settings()
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
