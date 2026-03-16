import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from loaders.github_loader import load_github_repo
from chunking.text_chunker import split_text
from embeddings.embedder import create_embeddings
from vector.qdrant_client import store_vectors

def process_github_repo(repo_url: str, *, source_id: str, user_id: str) -> dict:
    """Pipeline to ingest GitHub repository content."""
    repo_name = repo_url.rstrip('/').split('/')[-1]
    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]

    documents = load_github_repo(repo_url)

    if not documents:
        raise ValueError("No documents extracted from repository")

    total_chunks = 0
    total_embeddings = 0
    total_stored = 0

    for doc in documents:
        file_path = doc["file_path"]
        text = doc["text"]

        chunks = split_text(text)
        if not chunks:
            continue

        total_chunks += len(chunks)

        embeddings = create_embeddings(chunks)
        total_embeddings += len(embeddings)

        stored = store_vectors(
            chunks,
            embeddings,
            source="github",
            url=None,
            repo=repo_name,
            repo_url=repo_url,
            file_name=file_path,
            source_id=source_id,
            user_id=user_id,
        )
        total_stored += stored

    return {
        "repo": repo_name,
        "repo_url": repo_url,
        "files": len(documents),
        "chunks": total_chunks,
        "embeddings": total_embeddings,
        "stored_points": total_stored,
    }
