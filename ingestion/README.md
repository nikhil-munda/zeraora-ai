# Ingestion Pipeline

This directory contains ingestion and retrieval utilities used by the backend.

## Current Capabilities

- PDF text extraction with `pdfplumber`
- Website extraction with `requests` + `beautifulsoup4`
- GitHub repository extraction with `GitPython`
- Recursive chunking for long documents
- Local embeddings with `sentence-transformers`
- Qdrant storage with `user_id` and `source_id` metadata filters
- CLI scripts for backend integration:
	- `cli/ingest_pdf.py`
	- `cli/ingest_website.py`
	- `cli/ingest_github.py`
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

Query Context:

```bash
python cli/query_context.py \
	"What changed recently?" \
	--user-id user-123 \
	--limit 8
```
