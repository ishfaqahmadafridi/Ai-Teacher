"""
Model archive extraction utility for zip archives.
"""
import logging
import zipfile
from pathlib import Path

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parents[3]
MODEL_DIR = ROOT_DIR / "backend" / "model"
MODEL_ZIP = ROOT_DIR / "fine_tuned_physics_model.zip"


def extract_model_archive():
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
