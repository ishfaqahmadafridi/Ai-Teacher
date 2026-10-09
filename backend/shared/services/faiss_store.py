"""Local cosine retrieval with FAISS and atomic, pickle-free NumPy snapshots."""
import json
import os
from pathlib import Path
import tempfile

import faiss
import numpy as np


class FaissCollection:
    """Immutable textbook vectors and their source passages."""

    def __init__(self, documents, embeddings, metadatas, embedding_model):
        vectors = np.array(embeddings, dtype=np.float32, order="C", copy=True)
        if vectors.ndim != 2 or not vectors.shape[0] or not vectors.shape[1]:
            raise ValueError("Embeddings must be a nonempty matrix")
        if len(documents) != len(vectors) or len(metadatas) != len(vectors):
            raise ValueError("Passages, metadata, and vector counts must match")
        if not np.isfinite(vectors).all():
            raise ValueError("Embeddings must be finite")
        if not all(isinstance(text, str) for text in documents):
            raise ValueError("Passages must be strings")
        self.documents = list(documents)
        self.metadatas = list(metadatas)
        self.embedding_model = embedding_model
        faiss.normalize_L2(vectors)
        self.vectors = vectors
        self.index = faiss.IndexFlatIP(vectors.shape[1])
        self.index.add(vectors)

    def count(self):
        return self.index.ntotal

    def query(self, query_embeddings, n_results, include=None):
        if n_results <= 0:
            return {"documents": [[] for _ in query_embeddings]}
        queries = np.array(query_embeddings, dtype=np.float32, order="C", copy=True)
        if queries.ndim != 2 or queries.shape[1] != self.index.d:
            raise ValueError("Query dimensions must match the embedding model")
        if not np.isfinite(queries).all():
            raise ValueError("Query embeddings must be finite")
        faiss.normalize_L2(queries)
        _, positions = self.index.search(queries, min(n_results, self.count()))
        return {"documents": [[self.documents[int(i)] for i in row if i >= 0] for row in positions]}

    def save(self, path):
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(dir=path.parent, suffix=".npz", delete=False) as stream:
                temporary = Path(stream.name)
                np.savez_compressed(
                    stream, vectors=self.vectors, documents=np.asarray(self.documents, dtype=str),
                    metadata=np.asarray(json.dumps(self.metadatas)),
                    embedding_model=np.asarray(self.embedding_model),
                )
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)

    @classmethod
    def load(cls, path, embedding_model):
        with np.load(path, allow_pickle=False) as snapshot:
            if snapshot["embedding_model"].item() != embedding_model:
                raise ValueError("Embedding model changed; rebuild the index")
            return cls(snapshot["documents"].tolist(), snapshot["vectors"],
                       json.loads(snapshot["metadata"].item()), embedding_model)
