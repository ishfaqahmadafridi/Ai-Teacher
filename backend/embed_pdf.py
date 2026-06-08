"""
embed_pdf.py

Helper script to initialize and build the ChromaDB vector database from the 
College Physics 2e textbook PDF. Running this script embeds the entire book 
and stores it locally. Once complete, future API requests to the classroom 
explain endpoint will be instant, avoiding 60s Axios timeouts.
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Configure logging to show progress on the console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

def main():
    # 1. Load environment variables
    logger.info("Loading environment variables from .env...")
    load_dotenv()
    
    if not os.getenv("GEMINI_API_KEY"):
        logger.error("GEMINI_API_KEY not found in environment! Please ensure it is set in backend/.env")
        sys.exit(1)
        
    logger.info("GEMINI_API_KEY is configured.")

    # 2. Add current directory to python path to resolve imports correctly
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.append(current_dir)
        
    # 3. Trigger the RAG collection build
    try:
        from teacher.rag import get_collection
        logger.info("Starting PDF loading and embedding process...")
        logger.info("Note: This is a one-time operation that will embed the entire 260+ MB PDF.")
        logger.info("It makes external API calls to Google's embedding model and will take 2-4 minutes.")
        
        # get_collection() internally calls _build_collection() if no existing chroma_db exists.
        collection, embedding_model = get_collection()
        
        chunk_count = collection.count()
        logger.info(f"[SUCCESS] Successfully initialized ChromaDB collection with {chunk_count} chunks!")
        logger.info("Vector database is now warmed up and ready. You can now use the classroom interface.")
        
    except Exception as e:
        logger.exception(f"[ERROR] Failed to build embedding collection: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
