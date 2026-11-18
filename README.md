# Rightly Platform

Rightly is a legal advocacy and psychological support platform for Bangladesh, built as a four-sprint MVC stack: **Spring Boot** (model/controller), **React/Vite** (view), and **FastAPI** (AI — Sprint 4).

## Sprint 1 scope (this repo phase)

- Docker data services (Postgres/pgvector, Redis, MinIO, Mailpit)
- Spring Boot API on port **8081** (auth, verification, directory, dashboard)
- Flyway migrations V1–V4

## Prerequisites

- **Docker Desktop** (or OrbStack) — provides Postgres, Redis, MinIO, and Mailpit via Compose
- **JDK 21+** and **Maven 3.9+**
- **Node.js 20+** and npm (for the React app)

## Quick start (3 terminals)

**Terminal 1 — data services** (run once per machine session):

```bash
cd /Users/zawadishmam/Developer/CSE370
cp .env.example .env   # first time only
docker compose up -d
docker compose ps      # all services should be healthy / up
```

**Terminal 2 — Spring Boot API:**

```bash
cd backend-java
mvn spring-boot:run
```

Wait until you see `Tomcat started on port 8081`, then check: http://localhost:8081/api/health

**Terminal 3 — React frontend:**

```bash
cd frontend
cp .env.example .env   # first time only
npm install            # first time only
npm run dev
```

Open http://localhost:5173

### Local URLs

| Service | URL |
|--------|-----|
| **App (UI)** | http://localhost:5173 |
| API | http://localhost:8081 |
| Health | http://localhost:8081/api/health |
| Swagger | http://localhost:8081/swagger-ui.html |
| Mailpit (OTP emails) | http://localhost:8025 |
| MinIO console | http://localhost:9001 (user/pass from `.env`) |

### Quick smoke test

1. Home page loads directory counts from the API (after backend is up).
2. **Get Started** → register with your email → open Mailpit → copy OTP → verify.
3. **Verify** → upload NID image + selfie → status becomes **VERIFIED** on dashboard.
4. **Directory** → filter by Dhaka / specialty → see the three seeded professionals.

## Tests

```bash
cd backend-java && mvn test
```

## Project layout

- `backend-java/` — Spring Boot MVC API
- `backend-ai/` — FastAPI assistant (Sprint 4 placeholder)
- `nginx/` — reverse proxy (Sprint 4 placeholder)
- `frontend/` — React + Vite view layer

See [ARCHITECTURE.md](./ARCHITECTURE.md) for layer boundaries and [docs/DATA_FLOW_SPRINT1.md](./docs/DATA_FLOW_SPRINT1.md) for Sprint 1 end-to-end data flows per feature.

## Sprints (from SRS §5)

1. Core setup, auth, verification, directory
2. Messaging, scheduling, WebRTC
3. Community, SOS, evidence vault
4. AI assistant, Nginx, end-to-end walkthrough