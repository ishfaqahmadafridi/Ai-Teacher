"""
Thread-safe singleton model loader for fine-tuned physics transformer models.
"""
import logging
import threading
from teacher.model_loader.extractor import MODEL_DIR, extract_model_archive

logger = logging.getLogger(__name__)

try:
    import torch
except Exception as e:
    logger.error("PyTorch import failed. Ensure a compatible torch build is installed.")
    torch = None

_model = None
_tokenizer = None
_lock = threading.Lock()
_loaded = False


def load_model():
    """Load the fine-tuned physics model and tokenizer (thread-safe singleton)."""
    global _model, _tokenizer, _loaded

    if _loaded:
        return _model, _tokenizer

    with _lock:
        if _loaded:
            return _model, _tokenizer

        extract_model_archive()
        logger.info(f"Loading physics model from: {MODEL_DIR}")

        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer

            _tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
            if _tokenizer.pad_token is None:
                _tokenizer.pad_token = _tokenizer.eos_token

            _model = AutoModelForCausalLM.from_pretrained(str(MODEL_DIR))

            if torch is not None:
                device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                try:
                    _model.to(device)
                    logger.info(f"Model moved to device: {device}")
                except Exception as e:
                    logger.warning(f"Could not move model to device: {e}")

            _model.eval()

            _loaded = True
            logger.info("✅ Physics model loaded successfully.")

        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise RuntimeError(f"Model loading failed: {e}")

    return _model, _tokenizer


def get_model():
    """Return the already-loaded model and tokenizer."""
    if not _loaded:
        return load_model()
    return _model, _tokenizer


def is_model_loaded():
    """Return True if model is already loaded."""
    return _loaded
