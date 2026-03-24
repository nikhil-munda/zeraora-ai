import logging
import uuid

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from pipeline.github_ingestion_pipeline import process_github_repo
from pipeline.reddit_ingestion_pipeline import process_reddit_posts
from pipeline.youtube_ingestion_pipeline import process_youtube_video

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

app = FastAPI(title="Zeraora-AI Ingestion Service", version="1.0.0")


class GithubIngestRequest(BaseModel):
    repo_url: str
    source_id: str | None = None
    user_id: str | None = None


class YoutubeIngestRequest(BaseModel):
    url: str
    source_id: str | None = None
    user_id: str | None = None


class RedditIngestRequest(BaseModel):
    subreddit: str
    query: str | None = None
    source_id: str | None = None
    user_id: str | None = None


@app.post("/ingest/github")
def ingest_github(payload: GithubIngestRequest) -> dict:
    source_id = payload.source_id or f"github-{uuid.uuid4().hex[:12]}"
    user_id = payload.user_id or "anonymous"

    try:
        result = process_github_repo(
            payload.repo_url,
            source_id=source_id,
            user_id=user_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"GitHub ingestion failed: {error}") from error

    return {
        "success": True,
        "result": result,
    }


@app.post("/ingest/youtube")
def ingest_youtube(payload: YoutubeIngestRequest) -> dict:
    source_id = payload.source_id or f"youtube-{uuid.uuid4().hex[:12]}"
    user_id = payload.user_id or "anonymous"

    try:
        result = process_youtube_video(
            payload.url,
            source_id=source_id,
            user_id=user_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"YouTube ingestion failed: {error}") from error

    return {
        "success": True,
        "result": result,
    }


@app.post("/ingest/reddit")
def ingest_reddit(payload: RedditIngestRequest) -> dict:
    source_id = payload.source_id or f"reddit-{uuid.uuid4().hex[:12]}"
    user_id = payload.user_id or "anonymous"

    try:
        result = process_reddit_posts(
            payload.subreddit,
            query=payload.query,
            source_id=source_id,
            user_id=user_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Reddit ingestion failed: {error}") from error

    return {
        "success": True,
        "result": result,
    }


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
