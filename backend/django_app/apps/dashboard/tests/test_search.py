"""
apps/dashboard/tests/test_search.py

Unit and API integration tests for Dashboard search functionality.
"""
from django.test import TestCase
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.dashboard.services import perform_global_search
from apps.dashboard.serializers import SearchGroupedResultsSerializer
from apps.dashboard.models import CourseModel, AssignmentModel, LiveClassModel


class DashboardSearchServiceTests(TestCase):
    """Unit tests for perform_global_search service function."""

    def setUp(self):
        cache.clear()

    def test_empty_query_returns_zero_count(self):
        res = perform_global_search("")
        self.assertEqual(res["totalCount"], 0)
        self.assertEqual(len(res["courses"]), 0)

    def test_spaces_only_returns_zero_count(self):
        res = perform_global_search("   ")
        self.assertEqual(res["totalCount"], 0)

    def test_valid_query_matches_courses(self):
        res = perform_global_search("science")
        self.assertGreater(res["totalCount"], 0)
        self.assertTrue(any("Science" in c["title"] for c in res["courses"]))

    def test_orm_model_search(self):
        CourseModel.objects.create(
            title="Advanced Quantum Mechanics",
            subject_field="Physics",
            course_code="PHYS-501",
            progress_percent=90,
        )
        res = perform_global_search("Quantum")
        self.assertGreaterEqual(res["totalCount"], 1)
        self.assertTrue(any("Quantum" in c["title"] for c in res["courses"]))

    def test_caching_layer(self):
        res1 = perform_global_search("calculus")
        cache_key = "search:v1:calculus:10"
        self.assertIsNotNone(cache.get(cache_key))
        res2 = perform_global_search("calculus")
        self.assertEqual(res1["totalCount"], res2["totalCount"])


class DashboardSearchSerializerTests(TestCase):
    """Unit tests for SearchGroupedResultsSerializer."""

    def test_serializer_validation(self):
        payload = {
            "query": "physics",
            "courses": [
                {
                    "id": "c1",
                    "type": "course",
                    "title": "Physics 101",
                    "subtitle": "PHYS-101 • Physics",
                    "badgeText": "Course",
                    "actionPayload": {"targetTab": "dashboard"},
                }
            ],
            "assignments": [],
            "liveClasses": [],
            "topics": [],
            "totalCount": 1,
        }
        serializer = SearchGroupedResultsSerializer(data=payload)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["query"], "physics")


class DashboardSearchViewTests(TestCase):
    """Integration tests for GET /api/search/ API endpoint."""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

    def test_missing_q_param_returns_400(self):
        response = self.client.get("/api/search/")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_empty_q_param_returns_400(self):
        response = self.client.get("/api/search/?q=")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_valid_query_returns_200_and_correct_shape(self):
        response = self.client.get("/api/search/?q=math")
        self.assertEqual(response.status_code, 200)
        self.assertIn("query", response.data)
        self.assertIn("courses", response.data)
        self.assertIn("assignments", response.data)
        self.assertIn("liveClasses", response.data)
        self.assertIn("topics", response.data)
        self.assertIn("totalCount", response.data)
        self.assertEqual(response.data["query"], "math")
