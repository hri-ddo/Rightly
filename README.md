# Rightly Platform

Legal advocacy and mental-health support platform for Bangladesh (CSE370 MVP). **Spring Boot** (API), **React/Vite** (UI), **FastAPI** (AI — Sprint 4).

**Repository:** https://github.com/hri-ddo/Rightly

---

## Requirements

Install these on your machine before cloning. Versions below are what we target in development.

| Requirement | Version | Used for |
|-------------|---------|----------|
| **Python** | 3.11+ | `.venv`, `rightly` dev CLI |
| **JDK** | 21+ | Spring Boot (`backend-java`) |
| **Maven** | 3.9+ | Build/run API |
| **Node.js** | 20+ | React app (`frontend`) |
| **npm** | 10+ (bundled with Node) | Frontend deps |
| **PostgreSQL** | 16+ with **pgvector** | App database |
| **Redis** | 7+ | OTP codes, cache |

**Pick one way to run data services:**

| Path | Extra installs | Best for |
|------|----------------|----------|
| **A — Docker Compose** | Docker Desktop, OrbStack, or Colima + `docker-compose` | Full stack: Postgres, Redis, **MinIO**, Mailpit in containers |
| **B — Homebrew (macOS)** | `brew install postgresql@17 redis mailpit` (+ pgvector) | No Docker; verification files stored on **local disk** |

On path B, set in `.env` (done automatically by `rightly infra`):

```bash
RIGHTLY_STORAGE_DRIVER=filesystem
RIGHTLY_UPLOAD_DIR=./uploads
```

Path A with MinIO: `RIGHTLY_STORAGE_DRIVER=minio` (default in `.env.example` if you remove the filesystem lines).

---

## Quick start (any new developer)

### 1. Clone and enter the repo

```bash
git clone https://github.com/hri-ddo/Rightly.git
cd Rightly
```

### 2. Python virtualenv and CLI

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -e .
rightly setup                      # copies .env + frontend/.env, runs npm install
rightly doctor                     # sanity-check PATH tools
```

### 3. Data layer

**Option A — Docker (recommended if you have a working Docker daemon):**

```bash
rightly infra-docker               # or: rightly infra (auto-picks Docker when available)
```

**Option B — Homebrew (macOS, no Docker):**

```bash
brew install postgresql@17 redis mailpit
brew install pgvector              # extension for Postgres
brew services start postgresql@17 redis mailpit
rightly infra                      # starts brew services + writes dev defaults to .env
```

**One-time Postgres database** (path B only — adjust user/password to match `.env`):

```bash
createuser -s rightly || true
psql postgres -c "ALTER USER rightly WITH PASSWORD 'rightly';"
createdb -O rightly rightly 2>/dev/null || true
psql rightly -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
psql rightly -c 'CREATE EXTENSION IF NOT EXISTS vector;'
```

### 4. Run the app (three terminals)

Activate `.venv` in each terminal:

```bash
source .venv/bin/activate
```

| Terminal | Command | URL |
|----------|---------|-----|
| 1 | `rightly infra` | (once per session; skip if already up) |
| 2 | `rightly api` | http://localhost:8081 |
| 3 | `rightly ui` | http://localhost:5173 |

Open **http://localhost:5173** in the browser.

`rightly api` loads variables from **`.env`** into the JVM (JWT, database URL, storage driver, mail, etc.).

### 5. Smoke test

1. http://localhost:8081/api/health → `postgres` and `redis` **UP**
2. Home page shows directory counts (after API is up)
3. **Get Started** → register with email → OTP in **http://localhost:8025** (Mailpit)
4. **Verify** → upload NID + selfie → **VERIFIED** on dashboard (filesystem or MinIO)
5. **Directory** → filter by district/specialty

---

## Environment files

| File | Committed? | Purpose |
|------|------------|---------|
| `.env.example` | Yes | Template for root env |
| `.env` | **No** (gitignored) | Your local secrets and overrides |
| `frontend/.env.example` | Yes | `VITE_API_URL` |
| `frontend/.env` | **No** | Points UI at `http://localhost:8081/api` |

After `rightly setup`, compare your `.env` with `.env.example`. For local Homebrew dev, keep `RIGHTLY_STORAGE_DRIVER=filesystem` unless MinIO is running.

Key variables:

| Variable | Typical local value |
|----------|---------------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/rightly` |
| `REDIS_URL` | `redis://localhost:6379` |
| `JWT_SECRET` | Long random string (32+ chars) |
| `MAIL_HOST` / `MAIL_PORT` | `localhost` / `1025` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |
| `VITE_API_URL` (frontend) | `http://localhost:8081/api` |

---

## Local URLs

| Service | URL |
|--------|-----|
| **Web app** | http://localhost:5173 |
| REST API | http://localhost:8081 |
| Health | http://localhost:8081/api/health |
| Swagger | http://localhost:8081/swagger-ui.html |
| Mailpit (OTP) | http://localhost:8025 |
| MinIO console (Docker only) | http://localhost:9001 (`minioadmin` / `minioadmin` from `.env`) |

---

## CLI reference (`rightly`)

All commands assume `source .venv/bin/activate`.

| Command | Description |
|---------|-------------|
| `rightly setup` | `.env` files + `npm install` |
| `rightly doctor` | Check docker, brew, java, mvn, node |
| `rightly infra` | Docker Compose if possible, else Homebrew stack |
| `rightly infra-docker` | Docker Compose only |
| `rightly infra-local` | Homebrew Postgres + Redis + Mailpit |
| `rightly infra-down` | `docker compose down` or stop brew redis |
| `rightly api` | Spring Boot on **8081** |
| `rightly ui` | Vite dev server on **5173** |
| `rightly test-java` | `mvn test` in `backend-java` |

Sprint 4 placeholder: `pip install -e ".[ai]"` then `rightly ai` → http://localhost:8090/health

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Missing required program: docker` | Use `rightly infra` (Homebrew fallback) or install Docker/Colima |
| `Port 8081 already in use` | Stop the old API: `lsof -t -i:8081 \| xargs kill`, then `rightly api` |
| Home **network error** | API not running or wrong `frontend/.env` `VITE_API_URL` |
| No OTP email | Start Mailpit; open http://localhost:8025 |
| Verification upload fails | Path B: ensure `RIGHTLY_STORAGE_DRIVER=filesystem`. Path A: start MinIO via Docker |
| Postgres connection refused | `brew services start postgresql@17` or `docker compose up -d postgres` |
| `mvn` / `java` not found | Install JDK 21+ and Maven, add to PATH |

---

## Tests

```bash
source .venv/bin/activate
rightly test-java
```

---

## Project layout

| Path | Role |
|------|------|
| `.venv/` | Python env (gitignored) |
| `rightly_dev/` | `rightly` CLI (`pip install -e .`) |
| `backend-java/` | Spring Boot API, Flyway migrations |
| `frontend/` | React + Vite UI |
| `backend-ai/` | FastAPI (Sprint 4; same `.venv`) |
| `docker-compose.yml` | Postgres, Redis, MinIO, Mailpit |
| `docs/DATA_FLOW_SPRINT1.md` | Sprint 1 data flows (plain English) |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for MVC boundaries.

---

## Sprint roadmap (SRS §5)

1. **Current:** Auth, verification, directory, safety UI  
2. Messaging & video  
3. Community, SOS, vault  
4. AI assistant, Nginx, full walkthrough