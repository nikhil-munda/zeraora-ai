# On-AI — AI Knowledge Platform

A production-ready monorepo for the **On-AI** platform, an intelligent knowledge system designed to support multi-source RAG (Retrieval-Augmented Generation).

## Structure

```
on-ai/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind + Shadcn UI
├── backend/           # Node.js + Express + TypeScript + MongoDB
├── ingestion/         # (Coming soon) Data ingestion pipelines
├── docker/            # Dockerfiles
└── docker-compose.yml # Local development orchestration
```

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind, Shadcn UI |
| Backend   | Node.js, Express, TypeScript          |
| Database  | MongoDB (Mongoose)                    |
| Auth      | JWT + bcrypt                          |

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (or use Docker Compose)

### 1. Start with Docker (Recommended)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
docker-compose up -d
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

### 2. Manual Setup

**Backend**
```bash
cd backend
cp .env.example .env    # Fill in your values
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## API Routes

| Method | Endpoint         | Auth Required | Description          |
|--------|------------------|---------------|----------------------|
| POST   | /auth/register   | No            | Register new user    |
| POST   | /auth/login      | No            | Login, get JWT token |
| GET    | /auth/me         | Yes           | Get current user     |

## Roadmap

- [x] STEP 1 — Auth system & base app structure
- [ ] STEP 2 — Multi-source RAG pipeline
- [ ] STEP 3 — AI chat interface
- [ ] STEP 4 — Knowledge base management
