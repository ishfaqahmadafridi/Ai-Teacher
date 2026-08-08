"""
Teacher model_loader package.
Exposes singleton model loading and retrieval interface.
"""
from .loader import load_model, get_model, is_model_loaded
from .extractor import extract_model_archive

__all__ = ['load_model', 'get_model', 'is_model_loaded', 'extract_model_archive']
