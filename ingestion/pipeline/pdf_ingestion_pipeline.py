import os
import sys

# Add the parent directory to Python path if running directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from loaders.pdf_loader import load_pdf
from chunking.text_chunker import split_text
from embeddings.embedder import create_embeddings
from vector.qdrant_client import store_vectors

def process_pdf(file_path: str, *, source_id: str, user_id: str, file_name: str | None = None) -> dict:
    """Pipeline to ingest PDF documents."""
    text = load_pdf(file_path)
    if not text:
        raise ValueError("No text extracted from PDF")

    chunks = split_text(text)
    if not chunks:
        raise ValueError("No chunks created from extracted PDF text")

    embeddings = create_embeddings(chunks)
    resolved_file_name = file_name or os.path.basename(file_path)
    stored_points = store_vectors(
        chunks,
        embeddings,
        file_name=resolved_file_name,
        source_id=source_id,
        user_id=user_id,
    )

    return {
        "file_name": resolved_file_name,
        "characters": len(text),
        "chunks": len(chunks),
        "embeddings": len(embeddings),
        "stored_points": stored_points,
    }
