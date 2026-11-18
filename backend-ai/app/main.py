"""Sprint 4 AI assistant placeholder — run via `rightly ai` from the project .venv."""

from fastapi import FastAPI

app = FastAPI(title="Rightly AI", version="0.0.1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "UP", "sprint": "4-placeholder"}