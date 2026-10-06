from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class AuthFlowTests(TestCase):
    password = 'Secure-Learning-Password-938!'

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='student_one', email='student@example.com', password=self.password,
            first_name='Ayesha', last_name='Khan', mobile='3007654321', country_code='+92',
        )

    def login(self):
        response = self.client.post('/api/auth/login/', {
            'email': '  STUDENT@example.com  ', 'password': self.password,
        }, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        return response.data

    def test_login_returns_real_identity_and_signed_tokens(self):
        data = self.login()
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['user']['first_name'], 'Ayesha')
        self.assertEqual(data['user']['mobile'], '3007654321')
        self.assertEqual(str(AccessToken(data['access'])['user_id']), str(self.user.pk))
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_login)
        self.assertNotIn('password', data['user'])

    def test_profile_uses_authenticated_user_and_not_requested_id(self):
        other = User.objects.create_user(username='other', email='other@example.com', password=self.password)
        token = self.login()['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(f'/api/auth/me/?user_id={other.pk}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.user.pk)
        self.assertEqual(response.data['email'], self.user.email)

    def test_mock_and_unauthenticated_tokens_are_rejected(self):
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer mock_access_token_user_{self.user.pk}')
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)

    def test_invalid_login_and_inactive_user(self):
        response = self.client.post('/api/auth/login/', {'email': self.user.email, 'password': 'wrong'}, format='json')
        self.assertEqual(response.status_code, 401)
        self.user.is_active = False
        self.user.save()
        response = self.client.post('/api/auth/login/', {'email': self.user.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, 401)

    @patch('apps.users.views.login_view.generate_user_tokens')
    def test_unregistered_email_cannot_sign_in_or_create_an_account(self, tokens):
        before = User.objects.count()
        response = self.client.post('/api/auth/login/', {
            'email': 'unregistered@example.com', 'password': self.password,
        }, format='json')
        self.assertEqual(response.status_code, 401)
        self.assertNotIn('access', response.data)
        self.assertNotIn('refresh', response.data)
        self.assertEqual(User.objects.count(), before)
        tokens.assert_not_called()

    def test_deleted_account_cannot_reuse_saved_access_or_refresh_tokens(self):
        data = self.login()
        self.user.delete()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {data['access']}")
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)
        response = self.client.post('/api/auth/refresh/', {'refresh': data['refresh']}, format='json')
        self.assertEqual(response.status_code, 401)

    def test_invalid_request_has_field_errors(self):
        for payload in ({}, {'email': 'bad', 'password': self.password}, {'email': []}):
            response = self.client.post('/api/auth/login/', payload, format='json')
            self.assertEqual(response.status_code, 400)

    def test_refresh_rotates_token_and_logout_revokes_it(self):
        data = self.login()
        refreshed = self.client.post('/api/auth/refresh/', {'refresh': data['refresh']}, format='json')
        self.assertEqual(refreshed.status_code, 200)
        self.assertNotEqual(refreshed.data['refresh'], data['refresh'])
        reused = self.client.post('/api/auth/refresh/', {'refresh': data['refresh']}, format='json')
        self.assertEqual(reused.status_code, 401)
        logout = self.client.post('/api/auth/logout/', {'refresh': refreshed.data['refresh']}, format='json')
        self.assertEqual(logout.status_code, 200)
        after_logout = self.client.post('/api/auth/refresh/', {'refresh': refreshed.data['refresh']}, format='json')
        self.assertEqual(after_logout.status_code, 401)

    def test_register_persists_identity_and_hashed_password(self):
        response = self.client.post('/api/auth/register/', {
            'first_name': 'Ali', 'last_name': 'Ahmed', 'username': 'new_student',
            'email': ' NEW@example.com ', 'password': self.password, 'mobile': '',
        }, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        saved = User.objects.get(email='new@example.com')
        self.assertTrue(saved.check_password(self.password))
        self.assertNotEqual(saved.password, self.password)
        self.assertIsNone(saved.mobile)
        self.assertEqual(response.data['user']['first_name'], 'Ali')

    def test_registration_rejects_weak_password(self):
        response = self.client.post('/api/auth/register/', {
            'first_name': 'Ali', 'last_name': 'Ahmed', 'username': 'new_student',
            'email': 'new@example.com', 'password': '12345678',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.data)

    def test_duplicate_email_is_rejected_ignoring_case(self):
        response = self.client.post('/api/auth/register/', {
            'first_name': 'Ali', 'last_name': 'Ahmed', 'username': 'new_student',
            'email': 'STUDENT@example.com', 'password': self.password,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        with self.assertRaises(IntegrityError), transaction.atomic():
            User.objects.create_user(username='third', email='STUDENT@example.com', password=self.password)

    def test_profile_edits_and_onboarding_survive_fresh_login(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.login()['access']}")
        response = self.client.patch('/api/auth/me/', {
            'first_name': 'Updated', 'last_name': 'Student', 'email': 'updated@example.com',
            'mobile': '', 'bio': 'Learning mathematics', 'grade_level': 'University',
            'preferred_language': 'Urdu', 'country': 'Pakistan', 'timezone': 'Asia/Karachi',
            'dob': '2000-01-01', 'education_level': 'undergraduate', 'academic_year': 'junior',
            'selected_interests': ['Physics'], 'onboarding_completed': True,
            'avatar_url': 'https://example.com/avatar.png', 'cover_url': '/images/profile_cover.png',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.client.credentials()
        login = self.client.post('/api/auth/login/', {'email': 'updated@example.com', 'password': self.password}, format='json')
        self.assertEqual(login.status_code, 200)
        profile = login.data['user']
        self.assertEqual(profile['first_name'], 'Updated')
        self.assertEqual(profile['selected_interests'], ['Physics'])
        self.assertTrue(profile['onboarding_completed'])
        self.assertEqual(profile['timezone'], 'Asia/Karachi')
        self.assertIsNone(profile['mobile'])
        self.assertEqual(profile['dob'], '2000-01-01')

    def test_profile_cannot_update_other_account_or_privileges(self):
        other = User.objects.create_user(username='other', email='other@example.com', password=self.password)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.login()['access']}")
        response = self.client.patch('/api/auth/me/', {'id': other.pk, 'is_staff': True, 'is_verified': True,
                                                    'first_name': 'Mine'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        other.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Mine')
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_verified)
        self.assertEqual(other.first_name, '')

    def test_profile_validation_rejects_invalid_timezone_and_duplicate_email(self):
        User.objects.create_user(username='other', email='other@example.com', password=self.password)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.login()['access']}")
        for payload in ({'timezone': 'invalid'}, {'email': 'OTHER@example.com'}, {'selected_interests': 'Physics'}):
            response = self.client.patch('/api/auth/me/', payload, format='json')
            self.assertEqual(response.status_code, 400)


class GoogleAuthTests(TestCase):
    @override_settings(GOOGLE_OAUTH_CLIENT_ID='configured-client')
    @patch('apps.users.providers.google_provider.id_token.verify_oauth2_token')
    def test_verified_provider_claims_are_used_instead_of_client_payload(self, verify):
        User.objects.create_user(username='registered', email='real@example.com', password='Existing-password-938!')
        verify.return_value = {'sub': 'real-sub', 'email': 'real@example.com', 'email_verified': True,
                               'given_name': 'Real', 'family_name': 'User', 'picture': 'https://example.com/avatar.png'}
        response = self.client.post('/api/auth/google/', {
            'id_token': 'verified-token', 'google_payload': {'email': 'forged@example.com'},
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.json()['user']['email'], 'real@example.com')
        self.assertTrue(User.objects.get(email='real@example.com').check_password('Existing-password-938!'))
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(verify.call_args.kwargs['audience'], 'configured-client')

    @override_settings(GOOGLE_OAUTH_CLIENT_ID='configured-client')
    @patch('apps.users.providers.google_provider.id_token.verify_oauth2_token')
    def test_verified_google_token_does_not_register_an_unknown_user(self, verify):
        verify.return_value = {'sub': 'unknown-sub', 'email': 'unknown@example.com', 'email_verified': True}
        response = self.client.post('/api/auth/google/', {'id_token': 'verified'}, content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertFalse(User.objects.exists())
        self.assertNotIn('access', response.json())

    @override_settings(GOOGLE_OAUTH_CLIENT_ID='configured-client')
    @patch('apps.users.providers.google_provider.id_token.verify_oauth2_token', side_effect=ValueError('bad signature'))
    def test_invalid_token_cannot_create_a_user(self, verify):
        response = self.client.post('/api/auth/google/', {'id_token': 'forged'}, content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertFalse(User.objects.exists())

    @override_settings(GOOGLE_OAUTH_CLIENT_ID='')
    def test_unconfigured_google_returns_service_error(self):
        response = self.client.post('/api/auth/google/', {'id_token': 'anything'}, content_type='application/json')
        self.assertEqual(response.status_code, 503)
        self.assertFalse(User.objects.exists())
