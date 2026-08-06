"""
Singleton model loader for the fine-tuned physics model.
Loads once at Django startup and reuses the model across API requests.
"""
import logging
import threading
import zipfile
from pathlib import Path

logger = logging.getLogger(__name__)

try:
    import torch
except Exception as e:
    logger.error("PyTorch import failed. Ensure a compatible torch build is installed.")
    torch = None

ROOT_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = ROOT_DIR / "backend" / "model"
MODEL_ZIP = ROOT_DIR / "fine_tuned_physics_model.zip"

_model = None
_tokenizer = None
_lock = threading.Lock()
_loaded = False


def _extract_model_archive():
    """Extract the root zip archive into the backend model folder if needed."""
    if MODEL_DIR.exists() and any(MODEL_DIR.iterdir()):
        return

    if not MODEL_ZIP.exists():
        raise FileNotFoundError(
            f"Model folder not found at {MODEL_DIR} and archive not found at {MODEL_ZIP}"
        )

    logger.info(f"Extracting model archive from {MODEL_ZIP} to {MODEL_DIR}")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(MODEL_ZIP, "r") as archive:
        archive.extractall(MODEL_DIR)
    logger.info("✅ Model archive extracted successfully.")


def load_model():
    """Load the fine-tuned physics model and tokenizer (thread-safe singleton)."""
    global _model, _tokenizer, _loaded

    if _loaded:
        return _model, _tokenizer

    with _lock:
        if _loaded:
            return _model, _tokenizer

        _extract_model_archive()
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
    return _loaded
