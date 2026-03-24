import os
from typing import Any

from langchain_community.document_loaders import RedditPostsLoader
from langchain_core.documents import Document


def _get_reddit_credentials() -> tuple[str, str, str]:
    client_id = os.getenv("REDDIT_CLIENT_ID", "").strip()
    client_secret = os.getenv("REDDIT_CLIENT_SECRET", "").strip()
    user_agent = os.getenv("REDDIT_USER_AGENT", "").strip()

    if not client_id or not client_secret or not user_agent:
        raise ValueError(
            "Missing Reddit credentials. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, and REDDIT_USER_AGENT."
        )

    return client_id, client_secret, user_agent


def _build_loader_kwargs(subreddit: str, query: str | None) -> dict[str, Any]:
    client_id, client_secret, user_agent = _get_reddit_credentials()
    kwargs: dict[str, Any] = {
        "client_id": client_id,
        "client_secret": client_secret,
        "user_agent": user_agent,
        "subreddit": subreddit,
    }
    if query:
        kwargs["search_query"] = query
    return kwargs


def load_reddit_posts(subreddit: str, query: str | None = None) -> list[Document]:
    """Load Reddit posts from a subreddit, optionally filtered by a search query."""
    normalized_subreddit = subreddit.strip()
    if normalized_subreddit.startswith("r/"):
        normalized_subreddit = normalized_subreddit[2:]
    if not normalized_subreddit:
        raise ValueError("Subreddit is required")

    kwargs = _build_loader_kwargs(normalized_subreddit, query)
    search_query = kwargs.get("search_query")

    # LangChain community has had minor kwarg naming differences across versions,
    # so we attempt common constructor variants for compatibility.
    attempts: list[dict[str, Any]] = [
        dict(kwargs),
        {
            **{k: v for k, v in kwargs.items() if k != "search_query"},
            "query": search_query,
        },
        {
            **{k: v for k, v in kwargs.items() if k != "search_query"},
            "search": search_query,
        },
    ]

    last_error: Exception | None = None
    for attempt in attempts:
        attempt = {k: v for k, v in attempt.items() if v is not None}
        try:
            loader = RedditPostsLoader(**attempt)
            documents = loader.load()
            return documents
        except Exception as error:
            last_error = error

    raise ValueError(f"Failed to load Reddit posts for r/{normalized_subreddit}: {last_error}") from last_error
