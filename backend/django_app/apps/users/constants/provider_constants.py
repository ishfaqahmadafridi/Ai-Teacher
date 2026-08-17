"""
Auth Provider & Constants definitions for Users App.
"""

AUTH_PROVIDER_EMAIL = 'email'
AUTH_PROVIDER_GOOGLE = 'google'
AUTH_PROVIDER_MICROSOFT = 'microsoft'
AUTH_PROVIDER_APPLE = 'apple'

AUTH_PROVIDER_CHOICES = (
    (AUTH_PROVIDER_EMAIL, 'Email / Password'),
    (AUTH_PROVIDER_GOOGLE, 'Google OAuth'),
    (AUTH_PROVIDER_MICROSOFT, 'Microsoft OAuth'),
    (AUTH_PROVIDER_APPLE, 'Apple OAuth'),
)

DEFAULT_COUNTRY_CODE = '+92'
