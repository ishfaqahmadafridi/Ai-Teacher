"""Text-only MiniLM inference with the same pinned ONNX artifacts as the existing index."""
from itertools import islice
from pathlib import Path
from typing import Iterable, Iterator

import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from tokenizers import Tokenizer

from shared.constants import (
    MINILM_MODEL_NAME, MINILM_REPOSITORY, MINILM_REVISION,
    MINILM_MAX_TOKENS, MINILM_DIMENSIONS,
)


class MiniLMTextEmbedding:
    """Run tokenization and inference without FastEmbed's optional image-model stack."""

    def __init__(self, model_name: str, threads: int, cache_dir: str):
        if model_name != MINILM_MODEL_NAME:
            raise ValueError(f'Text retrieval supports {MINILM_MODEL_NAME}; rebuild and configure an adapter before changing models.')
        if threads < 1:
            raise ValueError('Embedding thread count must be positive.')
        paths = {name: hf_hub_download(repo_id=MINILM_REPOSITORY, filename=name,
                 revision=MINILM_REVISION, cache_dir=str(Path(cache_dir)))
                 for name in ('tokenizer.json', 'model.onnx')}
        self.tokenizer = Tokenizer.from_file(paths['tokenizer.json'])
        self.tokenizer.enable_truncation(max_length=MINILM_MAX_TOKENS)
        self.tokenizer.enable_padding(pad_id=0, pad_type_id=0, pad_token='[PAD]')
        options = ort.SessionOptions()
        options.intra_op_num_threads = threads
        options.inter_op_num_threads = 1
        self.session = ort.InferenceSession(paths['model.onnx'], sess_options=options,
                                            providers=['CPUExecutionProvider'])
        self.input_names = {item.name for item in self.session.get_inputs()}
        self.output_name = self.session.get_outputs()[0].name

    def embed(self, texts: Iterable[str] | str, batch_size: int = 32) -> Iterator[np.ndarray]:
        if batch_size < 1:
            raise ValueError('Embedding batch size must be positive.')
        documents = iter([texts] if isinstance(texts, str) else texts)
        while batch := list(islice(documents, batch_size)):
            encoded = self.tokenizer.encode_batch(batch)
            inputs = {
                'input_ids': np.asarray([item.ids for item in encoded], dtype=np.int64),
                'attention_mask': np.asarray([item.attention_mask for item in encoded], dtype=np.int64),
                'token_type_ids': np.asarray([item.type_ids for item in encoded], dtype=np.int64),
            }
            output = np.asarray(self.session.run([self.output_name],
                {name: value for name, value in inputs.items() if name in self.input_names})[0], dtype=np.float32)
            # Mask padding before mean pooling, preserving existing MiniLM vectors.
            if output.ndim == 3:
                mask = inputs['attention_mask'][..., None].astype(np.float32)
                vectors = (output * mask).sum(axis=1) / np.maximum(mask.sum(axis=1), 1)
            else:
                vectors = output
            if vectors.shape != (len(batch), MINILM_DIMENSIONS) or not np.isfinite(vectors).all():
                raise ValueError('The embedding model returned invalid vectors.')
            norms = np.linalg.norm(vectors, axis=1, keepdims=True)
            yield from vectors / np.where(norms == 0, 1, norms)

    def query_embed(self, query: str) -> Iterator[np.ndarray]:
        yield from self.embed([query])
