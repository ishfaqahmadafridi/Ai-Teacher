from django.urls import path
from .views import RegisterView, LoginView, GoogleAuthView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('google/', GoogleAuthView.as_view(), name='auth_google'),
    path('me/', ProfileView.as_view(), name='auth_me'),
]
