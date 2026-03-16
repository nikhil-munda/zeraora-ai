from urllib.parse import parse_qs, urlparse

from langchain_community.document_loaders import YoutubeLoader
from langchain_core.documents import Document


def _is_supported_youtube_url(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    if host in {"youtube.com", "www.youtube.com", "m.youtube.com"}:
        return parsed.path == "/watch" and "v" in parse_qs(parsed.query)
    if host == "youtu.be":
        return bool(parsed.path.strip("/"))
    return False


def load_youtube_transcript(url: str) -> list[Document]:
    """Load transcript text and metadata from a YouTube video URL."""
    if not _is_supported_youtube_url(url):
        raise ValueError("Invalid YouTube URL. Use a full watch URL or youtu.be link.")

    try:
        loader = YoutubeLoader.from_youtube_url(url, add_video_info=True)
        documents = loader.load()
    except Exception:
        # Some videos fail metadata resolution; retry transcript-only extraction.
        loader = YoutubeLoader.from_youtube_url(url, add_video_info=False)
        documents = loader.load()

    if not documents:
        raise ValueError("No transcript documents were loaded from YouTube")

    return documents