# Rightly Architecture (concise)

## MVC boundaries

| Layer | Location | Responsibility |
|-------|----------|------------------|
| **Model** | `backend-java/.../model/{entity,repository,service}` | Domain state, persistence, business rules |
| **Controller** | `backend-java/.../controller` (+ `dto`) | HTTP mapping, validation, status codes |
| **Middleware** | `backend-java/.../middleware` | Cross-cutting security filters, global errors |
| **View** | `frontend/` (planned) | UI only; no business rules |

Supporting packages: `config` (beans, security, CORS), `util` (JWT, cookies, OTP hash), `constant` (Redis keys, cookie names).

## Authentication (FR-01)

- OTP stored hashed in Redis (`rightly:otp:{userId}`), not in Postgres.
- Session JWT in httpOnly `RIGHTLY_SESSION`; CSRF token in `RIGHTLY_CSRF` + `X-CSRF-Token` on mutating requests.

## Verification (FR-02)

- NID/selfie objects in MinIO under `verification/{userId}/`.
- `LocalIdentityVerifier` approves when both objects exist and selfie MIME is an image.

## Directory (FR-10/11)

- `professional_profiles` joined to `users` for role filters.
- Unfiltered page-0 directory cached in Redis for 60s.

## Data stores

- **Postgres**: users, profiles, future messaging/community/AI tables (Flyway V1–V4).
- **Redis**: OTP, rate limits, directory cache.
- **MinIO**: verification and (later) evidence uploads.

## Infrastructure

`docker-compose.yml` provides Postgres (pgvector), Redis, MinIO (+ bucket init), and Mailpit. Nginx single-origin routing arrives in Sprint 4.

**Local dev:** One Python virtualenv at **`.venv/`** installs the `rightly` CLI (`pip install -e .`) to start Compose, the Java API, and the frontend. Future FastAPI code in `backend-ai/` uses the same `.venv` (`pip install -e ".[ai]"`).