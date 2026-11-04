"""
Classroom inference package.
Exposes key generation functions for external modules.
"""
from .pipeline import generate_answer
from apps.classroom.services.session_service import clear_session

__all__ = ['generate_answer', 'clear_session']
