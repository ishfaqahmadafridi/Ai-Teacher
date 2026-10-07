"""Shared retrieval behavior and non-blocking readiness regression tests."""
import unittest
from unittest.mock import patch

from app.services import rag_service
from shared.services.faiss_store import FaissCollection


class RagServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_search_uses_shared_query_embeddings_and_collection(self):
        collection = FaissCollection(["gravity", "light"], [[1, 0], [0, 1]], [{}, {}], "test")
        with patch.object(rag_service, "_get_collection", return_value=collection):
            with patch("apps.classroom.rag.embedder.embed_query", return_value=[1, 0]) as encode:
                result = await rag_service.search("gravity", top_k=1)
        self.assertEqual(result, "gravity")
        encode.assert_called_once_with("gravity")

    async def test_invalid_search_does_not_initialize_index(self):
        with patch.object(rag_service, "_get_collection") as initialize:
            self.assertEqual(await rag_service.search("   "), "")
            self.assertEqual(await rag_service.search("gravity", top_k=0), "")
        initialize.assert_not_called()

    async def test_unavailable_index_returns_empty_context(self):
        with patch.object(rag_service, "_get_collection", return_value=None):
            self.assertEqual(await rag_service.search("gravity"), "")

    async def test_health_reads_readiness_without_initializing_index(self):
        from app.api.v1.endpoints.health import health_check
        with patch.object(rag_service, "is_ready", return_value=False):
            with patch.object(rag_service, "_get_collection") as initialize:
                response = await health_check()
        self.assertFalse(response.rag_ready)
        initialize.assert_not_called()
