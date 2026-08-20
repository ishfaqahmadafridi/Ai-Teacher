"""
Django management command to build ChromaDB vector database from textbook PDF.

Usage:
    python manage.py embed_pdf
"""
import os
from django.core.management.base import BaseCommand, CommandError
from dotenv import load_dotenv


class Command(BaseCommand):
    help = 'Initialize and build the ChromaDB vector database from the College Physics PDF.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Loading environment variables..."))
        load_dotenv()

        if not os.getenv("GEMINI_API_KEY"):
            raise CommandError("GEMINI_API_KEY not found in environment! Please ensure it is set in .env")

        self.stdout.write(self.style.SUCCESS("GEMINI_API_KEY is configured."))
        self.stdout.write("Starting PDF loading and embedding process...")
        self.stdout.write("Note: This is a one-time operation that will embed the textbook PDF.")
        self.stdout.write("It makes external API calls to Google's embedding model and may take a few minutes.")

        try:
            from apps.classroom.rag import get_collection
            collection, embedding_model = get_collection()
            chunk_count = collection.count()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully initialized ChromaDB collection with {chunk_count} chunks!\n"
                    "Vector database is ready for classroom query operations."
                )
            )
        except Exception as e:
            raise CommandError(f"Failed to build embedding collection: {e}")
