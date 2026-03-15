# Ingestion Pipeline

This directory contains the PDF ingestion and retrieval utilities used by the backend.

## Current Capabilities

- PDF text extraction with `pdfplumber`
- Recursive chunking for long documents
- Local embeddings with `sentence-transformers`
- Qdrant storage with `user_id` and `source_id` metadata filters
- CLI scripts for backend integration:
	- `cli/ingest_pdf.py`
	- `cli/query_context.py`

## Setup

```bash
cd ingestion
pip install -r requirements.txt
```

Environment variables:

- `QDRANT_URL` defaults to `http://localhost:6333`
- `QDRANT_COLLECTION` defaults to `documents`
