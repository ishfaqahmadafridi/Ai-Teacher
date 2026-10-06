from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import RegisterView, LoginView, GoogleAuthView, ProfileView

urlpatterns = [
    path("refresh/", TokenRefreshView.as_view(), name="auth_refresh"),
    path("logout/", TokenBlacklistView.as_view(), name="auth_logout"),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('google/', GoogleAuthView.as_view(), name='auth_google'),
    path('me/', ProfileView.as_view(), name='auth_me'),
]
