# Zeraora AI

Zeraora AI is an AI-powered knowledge platform for ingesting and querying your content with grounded answers.

- Brand style: `ZeraoraAI`
- GitHub repository style: `zeraora-ai`
- Product name style: `Zeraora AI`

This monorepo includes:
- a Next.js frontend
- an Express + TypeScript backend
- a Python ingestion pipeline using Qdrant for vector search

## Documentation

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
- Ingestion: [ingestion/README.md](ingestion/README.md)

## Project Structure

```
zeraora-ai/
├── frontend/       # Next.js 14 App Router (TypeScript + Tailwind + Shadcn UI)
├── backend/        # Express + TypeScript REST API
├── ingestion/      # RAG ingestion pipeline
├── docker/         # Dockerfiles for frontend & backend
└── docker-compose.yml
```

## Quick Start

### Clone

```bash
git clone https://github.com/nikhil-munda/zeraora-ai.git
cd zeraora-ai
```

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Python 3.10+
- Qdrant running at `http://localhost:6333`

### Manual

Install workspace dependencies:

```bash
npm install
```

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

Default frontend API target is `http://localhost:5000` via `NEXT_PUBLIC_API_URL`.

Run both apps from the repo root (two terminals):

```bash
npm run dev:backend
npm run dev:frontend
```

### Docker Compose

```bash
JWT_SECRET=your-secret docker compose up -d
```

## API

| Method | Route           | Auth          | Description         |
|--------|-----------------|---------------|---------------------|
| GET    | /health         | —             | Health check        |
| POST   | /auth/register  | —             | Register new user   |
| POST   | /auth/login     | —             | Login, returns JWT  |
| GET    | /auth/me        | Bearer token  | Get current user    |
| POST   | /sources/pdf    | Bearer token  | Upload and index PDF |
| POST   | /sources/website| Bearer token  | Crawl and index a website |
| POST   | /sources/github | Bearer token  | Index a GitHub repository |
| GET    | /sources        | Bearer token  | List indexed sources |
| POST   | /chat           | Bearer token  | Ask grounded RAG question |
| GET    | /history        | Bearer token  | List chat history   |
| GET    | /history/:id    | Bearer token  | Get one history item |
| DELETE | /history/:id    | Bearer token  | Delete one history item |
| GET    | /settings       | Bearer token  | Get user settings   |
| PUT    | /settings       | Bearer token  | Update user settings |

## Ingestion And Chat Flow
- Add sources from the Sources page (PDF, Website, GitHub)
- The backend invokes the Python ingestion pipeline
- Chunks and embeddings are stored in Qdrant with per-user metadata
- Chat retrieves user-scoped context and sends a grounded prompt to Groq (`openai/gpt-oss-120b`)

## Development Commands

From repository root:

```bash
npm run dev:backend
npm run dev:frontend
npm run build:backend
npm run build:frontend
```
