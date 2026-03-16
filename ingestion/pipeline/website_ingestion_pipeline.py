import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from loaders.website_loader import load_website
from chunking.text_chunker import split_text
from embeddings.embedder import create_embeddings
from vector.qdrant_client import store_vectors


def process_website(
    url: str,
    *,
    source_id: str,
    user_id: str,
    file_name: str | None = None,
) -> dict:
    """Pipeline to ingest website content."""
    text = load_website(url)
    if not text:
        raise ValueError("No text extracted from website")

    chunks = split_text(text)
    if not chunks:
        raise ValueError("No chunks created from extracted website text")

    embeddings = create_embeddings(chunks)
    resolved_file_name = file_name or url

    stored_points = store_vectors(
        chunks,
        embeddings,
        source="website",
        url=url,
        file_name=resolved_file_name,
        source_id=source_id,
        user_id=user_id,
    )

    return {
        "url": url,
        "file_name": resolved_file_name,
        "characters": len(text),
        "chunks": len(chunks),
        "embeddings": len(embeddings),
        "stored_points": stored_points,
    }
