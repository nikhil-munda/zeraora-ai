# Ingestion Pipeline

This directory contains ingestion and retrieval utilities used by the backend.

## Current Capabilities

- PDF text extraction with `pdfplumber`
- Website extraction with `requests` + `beautifulsoup4`
- GitHub repository extraction with `langchain_community.document_loaders.GithubFileLoader`
- YouTube transcript extraction with `langchain_community.document_loaders.YoutubeLoader`
- Recursive chunking for long documents
- Local embeddings with `sentence-transformers`
- Qdrant storage with `user_id` and `source_id` metadata filters
- FastAPI endpoint for GitHub ingestion: `POST /ingest/github`
- CLI scripts for backend integration:
	- `cli/ingest_pdf.py`
	- `cli/ingest_website.py`
	- `cli/ingest_github.py`
	- `cli/ingest_youtube.py`
	- `cli/query_context.py`

## Setup

```bash
cd ingestion
pip install -r requirements.txt
```

Environment variables:

- `QDRANT_URL` defaults to `http://localhost:6333`
- `QDRANT_COLLECTION` defaults to `documents`

## Pipeline Modules

- `pipeline/pdf_ingestion_pipeline.py`
- `pipeline/website_ingestion_pipeline.py`
- `pipeline/github_ingestion_pipeline.py`
- `pipeline/youtube_ingestion_pipeline.py`

## CLI Examples

Ingest PDF:

```bash
python cli/ingest_pdf.py \
	/absolute/path/to/file.pdf \
	--source-id source-123 \
	--user-id user-123 \
	--file-name file.pdf
```

Ingest Website:

```bash
python cli/ingest_website.py \
	https://example.com \
	--source-id source-123 \
	--user-id user-123 \
	--file-name https://example.com
```

Ingest GitHub Repository:

```bash
python cli/ingest_github.py \
	https://github.com/owner/repo \
	--source-id source-123 \
	--user-id user-123
```

Ingest YouTube Video:

```bash
python cli/ingest_youtube.py \
	https://www.youtube.com/watch?v=VIDEO_ID \
	--source-id source-123 \
	--user-id user-123
```

Query Context:

```bash
python cli/query_context.py \
	"What changed recently?" \
	--user-id user-123 \
	--limit 8
```

## FastAPI Endpoint

Start the ingestion API:

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Ingest a GitHub repository:

```bash
curl -X POST http://localhost:8001/ingest/github \
	-H "Content-Type: application/json" \
	-d '{"repo_url":"https://github.com/langchain-ai/langchain"}'
```

Ingest a YouTube video:

```bash
curl -X POST http://localhost:8001/ingest/youtube \
	-H "Content-Type: application/json" \
	-d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID"}'
```
