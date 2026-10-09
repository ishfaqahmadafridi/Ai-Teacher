"""
Django AppConfig for the Classroom feature app.

On startup (ready()), launches a background thread that:
  1. Loads ONNX embedding model (cached after first run)
  2. Loads existing FAISS index OR builds it from the PDF

This ensures the first API request is NEVER blocked by RAG initialisation.
"""
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class ClassroomConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.classroom"
    verbose_name = "Classroom AI Engine"

    def ready(self):
        """
        Called by Django once all apps are loaded.
        Start RAG background init here — safe, non-blocking.
        """
        import os
        import sys
        from django.conf import settings
        # Skip management commands; initialize in production WSGI/ASGI workers too.
        if any(command in sys.argv for command in (
            "test", "migrate", "makemigrations", "check", "collectstatic", "embed_pdf", "spectacular", "worker", "beat", "shell",
        )):
            return
        if "runserver" in sys.argv and "--noreload" not in sys.argv and os.environ.get("RUN_MAIN") != "true":
            return
        if not getattr(settings, "CLASSROOM_RAG_AUTOSTART", True):
            return

        try:
            from apps.classroom.rag import start_background_init
            start_background_init()
        except Exception as e:
            logger.warning(f"[ClassroomConfig] Could not start RAG background init: {e}")
