# Zeraora AI Frontend

Next.js 14 App Router frontend for Zeraora AI.

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- JWT auth in browser + cookie support for middleware route protection

## Setup

From repository root:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment Variables

`frontend/.env.local.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Scripts

- `npm run dev` start development server
- `npm run build` build for production
- `npm run start` run production build
- `npm run lint` run Next.js lint

## App Areas

- Public: login/register pages
- Protected: dashboard routes guarded by middleware
- Admin: role-based admin page
- Features: chat, sources, history, settings

## Authentication Notes

- Token is stored in `localStorage` and cookie (`zeraora-ai-token`).
- Next.js middleware reads the cookie to protect routes.
