"""
Django AppConfig for the teacher app.

On startup (ready()), launches a background thread that:
  1. Loads sentence-transformers model (~80 MB, cached after first run)
  2. Loads existing ChromaDB collection OR builds it from the PDF

This ensures the first API request is NEVER blocked by RAG initialisation.
"""
import threading
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class TeacherConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "teacher"
    verbose_name = "AI Physics Teacher"

    def ready(self):
        """
        Called by Django once all apps are loaded.
        Start RAG background init here — safe, non-blocking.

        Note: Django calls ready() twice in dev mode (autoreloader runs two processes).
        The _ready flag inside rag.py ensures the build only happens once per process.
        """
        # Guard against double-execution in Django dev server autoreloader
        import os
        if os.environ.get("RUN_MAIN") != "true":
            # Skip in the parent watcher process — only run in the actual worker
            return

        try:
            from teacher.rag import start_background_init
            start_background_init()
        except Exception as e:
            logger.warning(f"[TeacherConfig] Could not start RAG background init: {e}")
