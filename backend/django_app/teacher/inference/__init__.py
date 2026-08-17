"""
Teacher inference package.
Exposes key generation functions for external modules.
"""
from .pipeline import generate_answer, clear_session

__all__ = ['generate_answer', 'clear_session']
