"""Verify text-only inference without downloading model artifacts."""
import unittest
from types import SimpleNamespace
from unittest.mock import patch

import numpy as np

from shared.constants import MINILM_DIMENSIONS, MINILM_MAX_TOKENS, MINILM_MODEL_NAME
from shared.services.text_embedding import MiniLMTextEmbedding


class TextEmbeddingTests(unittest.TestCase):
    def setUp(self):
        self.download = patch('shared.services.text_embedding.hf_hub_download', side_effect=lambda **kw: kw['filename'])
        self.tokenizer_patch = patch('shared.services.text_embedding.Tokenizer')
        self.session_patch = patch('shared.services.text_embedding.ort.InferenceSession')
        self.download.start()
        self.addCleanup(self.download.stop)
        self.tokenizer = self.tokenizer_patch.start().from_file.return_value
        self.addCleanup(self.tokenizer_patch.stop)
        self.session = self.session_patch.start().return_value
        self.addCleanup(self.session_patch.stop)
        self.session.get_inputs.return_value = [SimpleNamespace(name=n) for n in ('input_ids', 'attention_mask')]
        self.session.get_outputs.return_value = [SimpleNamespace(name='embeddings')]
        self.model = MiniLMTextEmbedding(MINILM_MODEL_NAME, 2, '/tmp/model-cache')

    def test_padding_is_excluded_from_pooling_and_vectors_are_normalized(self):
        self.tokenizer.encode_batch.return_value = [SimpleNamespace(ids=[1, 0], attention_mask=[1, 0], type_ids=[0, 0])]
        output = np.zeros((1, 2, MINILM_DIMENSIONS), dtype=np.float32)
        output[0, 0, :2] = [3, 4]
        output[0, 1, :] = 100
        self.session.run.return_value = [output]
        vector = next(self.model.query_embed('question'))
        np.testing.assert_allclose(vector[:2], [.6, .8])
        np.testing.assert_array_equal(vector[2:], 0)
        self.tokenizer.enable_truncation.assert_called_once_with(max_length=MINILM_MAX_TOKENS)
        self.assertNotIn('token_type_ids', self.session.run.call_args.args[1])

    def test_empty_input_and_invalid_batch_size(self):
        self.assertEqual(list(self.model.embed([])), [])
        with self.assertRaises(ValueError):
            list(self.model.embed(['question'], batch_size=0))

    def test_invalid_model_rejected_before_download(self):
        with self.assertRaises(ValueError):
            MiniLMTextEmbedding('different-model', 2, '/tmp/model-cache')

    def test_nonfinite_output_rejected(self):
        self.tokenizer.encode_batch.return_value = [SimpleNamespace(ids=[1], attention_mask=[1], type_ids=[0])]
        self.session.run.return_value = [np.full((1, MINILM_DIMENSIONS), np.nan)]
        with self.assertRaises(ValueError):
            list(self.model.embed('question'))
