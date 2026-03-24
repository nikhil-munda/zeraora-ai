import os
import sys

from langchain_text_splitters import RecursiveCharacterTextSplitter

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from embeddings.embedder import create_embeddings
from loaders.reddit_loader import load_reddit_posts
from vector.qdrant_client import store_vectors


def ingest_reddit(
    subreddit: str,
    query: str = None,
    *,
    source_id: str = "reddit-source",
    user_id: str = "anonymous",
) -> dict:
    """Ingest Reddit posts from a subreddit with optional search query."""
    normalized_subreddit = subreddit.strip()
    if normalized_subreddit.startswith("r/"):
        normalized_subreddit = normalized_subreddit[2:]
    if not normalized_subreddit:
        raise ValueError("Subreddit is required")

    print("Fetching Reddit posts...")
    documents = load_reddit_posts(normalized_subreddit, query=query)

    if not documents:
        raise ValueError(f"No Reddit posts found for subreddit r/{normalized_subreddit}")

    print(f"Loaded {len(documents)} posts")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
    )

    all_chunks: list[str] = []
    all_metadata: list[dict] = []

    for doc in documents:
        metadata = doc.metadata or {}
        title = str(metadata.get("title") or "").strip()
        body = str(doc.page_content or "").strip()

        combined_text = "\n\n".join(part for part in [title, body] if part).strip()
        if not combined_text:
            continue

        chunks = splitter.split_text(combined_text)
        all_chunks.extend(chunks)
        all_metadata.extend([metadata] * len(chunks))

    if not all_chunks:
        raise ValueError(f"No chunks created for subreddit r/{normalized_subreddit}")

    print(f"Created {len(all_chunks)} chunks")

    embeddings = create_embeddings(all_chunks)
    print(f"Generated {len(embeddings)} embeddings")

    stored_vectors = 0
    for chunk, embedding, metadata in zip(all_chunks, embeddings, all_metadata):
        stored_vectors += store_vectors(
            [chunk],
            [embedding],
            source="reddit",
            subreddit=normalized_subreddit,
            post_url=str(metadata.get("url") or ""),
            author=str(metadata.get("author") or "unknown"),
            file_name=str(metadata.get("title") or f"r/{normalized_subreddit}"),
            source_id=source_id,
            user_id=user_id,
        )

    print(f"Stored {stored_vectors} vectors")

    return {
        "subreddit": normalized_subreddit,
        "posts_loaded": len(documents),
        "chunks_created": len(all_chunks),
        "embeddings_generated": len(embeddings),
        "stored_vectors": stored_vectors,
    }


def process_reddit_posts(
    subreddit: str,
    *,
    query: str | None = None,
    source_id: str,
    user_id: str,
) -> dict:
    """Compatibility wrapper following existing pipeline naming patterns."""
    return ingest_reddit(
        subreddit,
        query=query,
        source_id=source_id,
        user_id=user_id,
    )
