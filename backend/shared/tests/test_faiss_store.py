"""Exercise real cosine retrieval and safe index persistence without model downloads."""
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from shared.services.faiss_store import FaissCollection


class FaissCollectionTests(unittest.TestCase):
    def setUp(self):
        self.collection = FaissCollection(
            ["gravity", "light", "opposite"], [[10, 0], [0, 2], [-1, 0]],
            [{"page": i} for i in range(3)], "test-model",
        )

    def test_cosine_ranking_multiple_queries_and_result_limit(self):
        results = self.collection.query([[1, 0], [0, 9]], n_results=20)
        self.assertEqual(results["documents"][0], ["gravity", "light", "opposite"])
        self.assertEqual(results["documents"][1][0], "light")
        self.assertEqual(len(results["documents"][1]), 3)

    def test_snapshot_round_trip_and_model_change(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "index.npz"
            self.collection.save(path)
            restored = FaissCollection.load(path, "test-model")
            self.assertEqual(restored.count(), 3)
            self.assertEqual(restored.metadatas, self.collection.metadatas)
            self.assertEqual(restored.query([[1, 0]], 1)["documents"], [["gravity"]])
            with self.assertRaises(ValueError):
                FaissCollection.load(path, "different-model")

    def test_failed_save_preserves_previous_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "index.npz"
            self.collection.save(path)
            original = path.read_bytes()
            with patch("shared.services.faiss_store.os.replace", side_effect=OSError("disk error")):
                with self.assertRaises(OSError):
                    self.collection.save(path)
            self.assertEqual(path.read_bytes(), original)
            self.assertEqual(list(Path(directory).iterdir()), [path])

    def test_invalid_vectors_and_mismatched_passages_are_rejected(self):
        for embeddings, documents in [([[float("nan"), 1]], ["a"]), ([[1, 0]], [])]:
            with self.assertRaises(ValueError):
                FaissCollection(documents, embeddings, [{}], "test-model")
        for query in [[[1]], [[float("inf"), 0]]]:
            with self.assertRaises(ValueError):
                self.collection.query(query, 1)

    def test_zero_results(self):
        self.assertEqual(self.collection.query([[1, 0]], 0), {"documents": [[]]})
