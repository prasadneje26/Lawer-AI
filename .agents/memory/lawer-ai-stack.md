---
name: Lawer-AI Stack
description: Architecture and key decisions for the Lawer-AI 2.0 platform
---

## Architecture
- Frontend: React 19 + Vite 8 + TypeScript + Tailwind CSS v4 (port 5000, host 0.0.0.0)
- Backend: FastAPI + SQLAlchemy + PostgreSQL (port 8000, host localhost)
- Two workflows: "Start application" (webview, port 5000) and "Backend API" (console, no waitForPort)

## Key Paths
- Frontend: `/frontend/` — Vite config uses `allowedHosts: true` and proxy `/api` → `localhost:8000`
- Backend: `/backend/` — main.py, routers/, services/, models/
- DB: Uses `DATABASE_URL` env var (Replit PostgreSQL already configured)
- Demo users seeded via `cd backend && python seed.py`

## Demo Credentials
- Lawyer: demo@lawer.ai / demo123
- Admin: admin@lawer.ai / admin123

**Why:** Backend uses localhost (not 0.0.0.0) to avoid port conflicts. Replit's workflow health checker can't reach localhost ports, so backend workflow runs without `waitForPort`.
