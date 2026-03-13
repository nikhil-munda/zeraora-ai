# ON-AI — AI Knowledge Platform

A production-ready monorepo for an AI-powered knowledge platform with multi-source RAG support (coming in later steps).

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

### Manual

**Backend:**
```bash
cd backend
cp .env.example .env    # edit JWT_SECRET + MONGODB_URI
npm install
npm run dev             # http://localhost:5000
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

## Step 2 (Planned)
- Multi-source document ingestion pipeline
- RAG with vector search
- AI chat interface
