import os
import uuid
from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import ResponseHandlingException
from qdrant_client.http.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

EMBEDDING_SIZE = 384
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION", "documents")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")


def get_client() -> QdrantClient:
    return QdrantClient(url=QDRANT_URL)


def _handle_qdrant_error(error: Exception) -> RuntimeError:
    return RuntimeError(
        f"Qdrant is unavailable at {QDRANT_URL}. Start Qdrant and retry. Original error: {error}"
    )


def setup_collection() -> None:
    """Ensure the collection exists."""
    client = get_client()
    try:
        if not client.collection_exists(COLLECTION_NAME):
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=EMBEDDING_SIZE, distance=Distance.COSINE),
            )
    except ResponseHandlingException as error:
        raise _handle_qdrant_error(error) from error


def store_vectors(
    chunks: list[str],
    embeddings: list[list[float]],
    *,
    source: str = "pdf",
    url: str | None = None,
    repo: str | None = None,
    repo_url: str | None = None,
    file_name: str | None = None,
    file_path: str | None = None,
    video_url: str | None = None,
    title: str | None = None,
    subreddit: str | None = None,
    post_url: str | None = None,
    author: str | None = None,
    source_id: str,
    user_id: str,
) -> int:
    """Store chunks and their vectors in Qdrant."""
    setup_collection()
    client = get_client()

    points = []
    for chunk, vector in zip(chunks, embeddings):
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload={
                "text": chunk,
                "source": source,
                "file_name": file_name,
                "url": url,
                "repo": repo,
                "repo_url": repo_url,
                "file_path": file_path or file_name,
                "video_url": video_url,
                "title": title,
                "subreddit": subreddit,
                "post_url": post_url,
                "author": author,
                "source_id": source_id,
                "user_id": user_id,
            },
        )
        points.append(point)

    try:
        client.upsert(collection_name=COLLECTION_NAME, points=points)
    except ResponseHandlingException as error:
        raise _handle_qdrant_error(error) from error
    return len(points)


def search_vectors(query_embedding: list[float], *, user_id: str, limit: int = 5) -> list[dict]:
    """Search Qdrant using a user-scoped filter."""
    setup_collection()
    client = get_client()
    query_filter = Filter(must=[FieldCondition(key="user_id", match=MatchValue(value=user_id))])
    try:
        if hasattr(client, "query_points"):
            response = client.query_points(
                collection_name=COLLECTION_NAME,
                query=query_embedding,
                query_filter=query_filter,
                limit=limit,
                with_payload=True,
            )
            results = response.points
        else:
            results = client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_embedding,
                query_filter=query_filter,
                limit=limit,
                with_payload=True,
            )
    except ResponseHandlingException as error:
        raise _handle_qdrant_error(error) from error

    matches = []
    for result in results:
        payload = result.payload or {}
        matches.append(
            {
                "text": payload.get("text", ""),
                "file_name": payload.get("file_name", "unknown"),
                "source_id": payload.get("source_id", ""),
                "score": float(result.score),
            }
        )

    return matches
