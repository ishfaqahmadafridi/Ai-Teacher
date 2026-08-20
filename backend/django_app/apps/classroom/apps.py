"""
Django AppConfig for the Classroom feature app.

On startup (ready()), launches a background thread that:
  1. Loads sentence-transformers model (~80 MB, cached after first run)
  2. Loads existing ChromaDB collection OR builds it from the PDF

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
        if os.environ.get("RUN_MAIN") != "true":
            return

        try:
            from apps.classroom.rag import start_background_init
            start_background_init()
        except Exception as e:
            logger.warning(f"[ClassroomConfig] Could not start RAG background init: {e}")
