import os
import sys
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_text_splitters import RecursiveCharacterTextSplitter

from loaders.github_loader import load_github_repo_documents
from embeddings.embedder import create_embeddings
from vector.qdrant_client import store_vectors

logger = logging.getLogger(__name__)


def process_github_repo(repo_url: str, *, source_id: str, user_id: str) -> dict:
    """Pipeline to ingest GitHub repository content."""
    max_files = int(os.getenv("GITHUB_INGEST_MAX_FILES", "1000"))
    max_chunks = int(os.getenv("GITHUB_INGEST_MAX_CHUNKS", "20000"))

    logger.info("Cloning repository: %s", repo_url)
    documents = load_github_repo_documents(repo_url, max_files=max_files)

    if not documents:
        raise ValueError("No documents extracted from repository")

    logger.info("Loaded %s files", len(documents))

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
    )

    total_chunks_created = 0
    total_embeddings_generated = 0
    total_vectors_stored = 0

    for doc in documents:
        text = (doc.page_content or "").strip()
        if not text:
            continue

        metadata = doc.metadata or {}
        file_path = metadata.get("path", "unknown")

        chunks = splitter.split_text(text)
        if not chunks:
            continue

        remaining_capacity = max_chunks - total_chunks_created
        if remaining_capacity <= 0:
            logger.warning("Reached max chunk limit (%s). Stopping ingestion early.", max_chunks)
            break
        if len(chunks) > remaining_capacity:
            chunks = chunks[:remaining_capacity]

        total_chunks_created += len(chunks)

        embeddings = create_embeddings(chunks)
        total_embeddings_generated += len(embeddings)

        stored = store_vectors(
            chunks,
            embeddings,
            source="github",
            repo_url=repo_url,
            file_name=file_path,
            file_path=file_path,
            source_id=source_id,
            user_id=user_id,
        )
        total_vectors_stored += stored

    logger.info("Created %s chunks", total_chunks_created)
    logger.info("Generated %s embeddings", total_embeddings_generated)
    logger.info("Stored %s vectors in Qdrant", total_vectors_stored)

    return {
        "repo_url": repo_url,
        "files_loaded": len(documents),
        "chunks_created": total_chunks_created,
        "embeddings_generated": total_embeddings_generated,
        "stored_vectors": total_vectors_stored,
        "files": len(documents),
        "chunks": total_chunks_created,
        "embeddings": total_embeddings_generated,
        "stored_points": total_vectors_stored,
    }
