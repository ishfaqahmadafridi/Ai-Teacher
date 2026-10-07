"""
Django management command to build FAISS vector database from textbook PDF.

Usage:
    python manage.py embed_pdf
"""
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Initialize and build the FAISS vector database from the College Physics PDF.'

    def add_arguments(self, parser):
        parser.add_argument("--rebuild", action="store_true", help="Re-embed the source PDF and atomically replace the index.")

    def handle(self, *args, **options):
        self.stdout.write("Loading PDF and embedding it with the local ONNX model...")

        try:
            from apps.classroom.rag import get_collection
            if options.get("rebuild"):
                from apps.classroom.rag.loader import build_from_pdf
                collection = build_from_pdf()
            else:
                collection, embedding_model = get_collection()
            if collection is None:
                raise CommandError("RAG collection unavailable; check the PDF path and dependencies.")
            chunk_count = collection.count()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully initialized FAISS collection with {chunk_count} chunks!\n"
                    "Vector database is ready for classroom query operations."
                )
            )
        except Exception as e:
            raise CommandError(f"Failed to build embedding collection: {e}")
