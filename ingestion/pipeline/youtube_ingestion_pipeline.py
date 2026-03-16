import os
import sys

from langchain_text_splitters import RecursiveCharacterTextSplitter

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from embeddings.embedder import create_embeddings
from loaders.youtube_loader import load_youtube_transcript
from vector.qdrant_client import store_vectors


def ingest_youtube_video(
    url: str,
    *,
    source_id: str = "youtube-source",
    user_id: str = "anonymous",
) -> dict:
    """Ingest a YouTube video transcript into Qdrant."""
    print("Loading YouTube transcript...")
    documents = load_youtube_transcript(url)

    transcript_parts: list[str] = []
    video_title = "Untitled YouTube Video"

    for doc in documents:
        text = (doc.page_content or "").strip()
        if text:
            transcript_parts.append(text)
        if video_title == "Untitled YouTube Video":
            metadata = doc.metadata or {}
            video_title = metadata.get("title") or metadata.get("video_title") or video_title

    transcript_text = "\n\n".join(transcript_parts).strip()
    if not transcript_text:
        raise ValueError("Transcript text is empty for this YouTube video")

    print(f"Transcript length: {len(transcript_text)} characters")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
    )
    chunks = splitter.split_text(transcript_text)
    if not chunks:
        raise ValueError("No chunks created from transcript")

    print(f"Created {len(chunks)} chunks")

    embeddings = create_embeddings(chunks)
    print(f"Generated {len(embeddings)} embeddings")

    stored_vectors = store_vectors(
        chunks,
        embeddings,
        source="youtube",
        video_url=url,
        title=video_title,
        file_name=video_title,
        source_id=source_id,
        user_id=user_id,
    )

    print(f"Stored {stored_vectors} vectors in Qdrant")

    return {
        "video_url": url,
        "transcript_length": len(transcript_text),
        "chunks_created": len(chunks),
        "embeddings_generated": len(embeddings),
        "stored_vectors": stored_vectors,
    }


def process_youtube_video(url: str, *, source_id: str, user_id: str) -> dict:
    """Compatibility wrapper following existing pipeline naming."""
    return ingest_youtube_video(url, source_id=source_id, user_id=user_id)