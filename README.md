# ON-AI — AI Knowledge Platform

A monorepo for an AI-powered knowledge platform with authenticated PDF ingestion, Qdrant-backed retrieval, and Groq chat completions.

## Project Structure

```
on-ai/
├── frontend/       # Next.js 14 App Router (TypeScript + Tailwind + Shadcn UI)
├── backend/        # Express + TypeScript REST API
├── ingestion/      # RAG ingestion pipeline (Step 2 — coming soon)
├── docker/         # Dockerfiles for frontend & backend
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Python 3.10+
- Qdrant running at `http://localhost:6333`

### Manual

**Backend:**
```bash
cd backend
cp .env.example .env    # edit JWT_SECRET + MONGODB_URI
npm install
npm run dev             # http://localhost:5000
```

Required backend environment variables:

- `GROQ_API_KEY`
- `GROQ_MODEL` defaults to `openai/gpt-oss-120b`
- `PYTHON_BIN` defaults to `python3`
- `QDRANT_URL` defaults to `http://localhost:6333`

**Ingestion:**
```bash
cd ingestion
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev             # http://localhost:3000
```

### Docker Compose

```bash
JWT_SECRET=your-secret docker compose up -d
```

## API

| Method | Route           | Auth          | Description         |
|--------|-----------------|---------------|---------------------|
| POST   | /auth/register  | —             | Register new user   |
| POST   | /auth/login     | —             | Login, returns JWT  |
| GET    | /auth/me        | Bearer token  | Get current user    |
| POST   | /sources/pdf    | Bearer token  | Upload and index PDF |
| GET    | /sources        | Bearer token  | List indexed sources |
| POST   | /chat           | Bearer token  | Ask grounded RAG question |

## Current Flow
- Upload a PDF from the Sources page
- The backend invokes the Python ingestion pipeline
- Chunks and embeddings are stored in Qdrant with per-user metadata
- Chat retrieves relevant chunks and sends a grounded prompt to Groq using `openai/gpt-oss-120b`
