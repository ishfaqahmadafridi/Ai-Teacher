"""
apps/dashboard/urls.py

URL routing configuration for the Dashboard feature app.
"""
from django.urls import path
from apps.dashboard.views import SearchView

urlpatterns = [
    path("search/", SearchView.as_view(), name="dashboard-search"),
]
