# On-AI Ingestion Service

> ⚠️ This module is a placeholder for **STEP 2** of the On-AI platform.

## Planned Features

- **PDF ingestion** — Parse and chunk PDF documents
- **Web scraping** — Extract content from URLs
- **Notion sync** — Connect to Notion workspaces
- **Embedding pipeline** — Generate vector embeddings via OpenAI/local models
- **Vector storage** — Store embeddings in Pinecone / pgvector / Chroma

## Architecture (planned)

```
ingestion/
├── src/
│   ├── loaders/          # Source-specific loaders (pdf, web, notion)
│   ├── chunkers/         # Text chunking strategies
│   ├── embedders/        # Embedding model integrations
│   ├── stores/           # Vector store adapters
│   └── pipelines/        # End-to-end ingestion pipelines
├── package.json
└── tsconfig.json
```

This service will expose a set of REST endpoints to trigger ingestion jobs
and stream progress back to the dashboard.
