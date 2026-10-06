"""
Django management command to build ChromaDB vector database from textbook PDF.

Usage:
    python manage.py embed_pdf
"""
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Initialize and build the ChromaDB vector database from the College Physics PDF.'

    def handle(self, *args, **options):
        self.stdout.write("Loading PDF and embedding it with the local sentence-transformers model...")

        try:
            from apps.classroom.rag import get_collection
            collection, embedding_model = get_collection()
            if collection is None:
                raise CommandError("RAG collection unavailable; check the PDF path and dependencies.")
            chunk_count = collection.count()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully initialized ChromaDB collection with {chunk_count} chunks!\n"
                    "Vector database is ready for classroom query operations."
                )
            )
        except Exception as e:
            raise CommandError(f"Failed to build embedding collection: {e}")
