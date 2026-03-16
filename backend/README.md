# Zeraora AI Backend

Express + TypeScript API for authentication, source ingestion orchestration, chat, history, and user settings.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT auth
- Python bridge for ingestion/retrieval workflows

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Default server URL: `http://localhost:5000`

## Environment Variables

Example values are provided in `.env.example`.

Required for normal operation:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`

Optional or defaulted:

- `JWT_EXPIRES_IN` default `7d`
- `GROQ_MODEL` default `openai/gpt-oss-120b`
- `PYTHON_BIN` default `python3`
- `QDRANT_URL` default `http://localhost:6333`
- `QDRANT_COLLECTION` default `documents`

## Scripts

- `npm run dev` start dev server with auto-reload
- `npm run build` compile to `dist/`
- `npm run start` run compiled server
- `npm run type-check` TypeScript checks only

## Routes

Public:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`

Protected (Bearer token):

- `GET /auth/me`
- `POST /chat`
- `GET /sources`
- `POST /sources/pdf`
- `POST /sources/website`
- `POST /sources/github`
- `GET /history`
- `GET /history/:id`
- `DELETE /history/:id`
- `GET /settings`
- `PUT /settings`

## Notes

- CORS uses `FRONTEND_URL` or defaults to `http://localhost:3000`.
- Source ingestion endpoints call Python CLI scripts and store vectors in Qdrant.
