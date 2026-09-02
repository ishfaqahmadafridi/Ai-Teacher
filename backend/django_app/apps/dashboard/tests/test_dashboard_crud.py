"""
apps/dashboard/tests/test_dashboard_crud.py

Tests for Courses, Live Classes, and Overview CRUD APIs and Database Persistence.
"""

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.dashboard.models.dashboard_models import LiveClassModel, CourseModel


class DashboardCRUDAPITest(TestCase):
    """Integration test suite for Dashboard CRUD operations."""

    def setUp(self):
        self.client = APIClient()

    def test_list_live_classes(self):
        """GET /api/dashboard/live-classes/ returns 200 with list of classes."""
        response = self.client.get("/api/dashboard/live-classes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 2)

    def test_create_live_class_success(self):
        """POST /api/dashboard/live-classes/ persists a new live session in database."""
        payload = {
            "title": "Quantum Physics Masterclass",
            "subject": "Physics & Quantum Mechanics",
            "instructor_name": "Dr. Sarah Jenkins",
            "time_formatted": "Monday at 11:00 AM",
            "is_live": False,
        }
        response = self.client.post("/api/dashboard/live-classes/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Quantum Physics Masterclass")

        # Verify ORM database commit
        persisted = LiveClassModel.objects.filter(title="Quantum Physics Masterclass").first()
        self.assertIsNotNone(persisted)
        self.assertEqual(persisted.instructor_name, "Dr. Sarah Jenkins")

    def test_create_live_class_invalid_payload(self):
        """POST /api/dashboard/live-classes/ with missing title returns 400 Bad Request."""
        payload = {
            "subject": "Physics",
            "instructor_name": "Dr. Test",
        }
        response = self.client.post("/api/dashboard/live-classes/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
