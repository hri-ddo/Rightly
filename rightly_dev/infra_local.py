"""Start Postgres/Redis via Homebrew when Docker is unavailable."""

from __future__ import annotations

import shutil
import socket
import subprocess
import sys

from rightly_dev.env_sync import ensure_brew_env

POSTGRES_FORMULAE = ("postgresql@17", "postgresql@16", "postgresql@15", "postgresql@14", "postgresql")


def _brew_listed(formula: str) -> bool:
    return subprocess.run(
        ["brew", "list", formula],
        capture_output=True,
        text=True,
    ).returncode == 0


def _port_open(host: str, port: int) -> bool:
    try:
        with socket.create_connection((host, port), timeout=1.0):
            return True
    except OSError:
        return False


def _brew_services_start(formula: str) -> None:
    print(f"\n→ brew services start {formula}")
    completed = subprocess.run(["brew", "services", "start", formula], check=False)
    if completed.returncode != 0:
        print(f"Failed to start {formula}. Try: brew install {formula}", file=sys.stderr)
        sys.exit(completed.returncode)


def start_postgres() -> str:
    for formula in POSTGRES_FORMULAE:
        if _brew_listed(formula):
            _brew_services_start(formula)
            return formula
    print(
        "PostgreSQL not found. Install with:\n"
        "  brew install postgresql@17 pgvector\n"
        "Then create DB/user (see README — Local infra without Docker).",
        file=sys.stderr,
    )
    sys.exit(1)


def start_redis() -> None:
    if not _brew_listed("redis"):
        print("Redis not found. Install with: brew install redis", file=sys.stderr)
        sys.exit(1)
    _brew_services_start("redis")


def start_optional_mailpit() -> None:
    if _brew_listed("mailpit"):
        _brew_services_start("mailpit")
        print("Mailpit UI: http://localhost:8025")
        return
    print(
        "Mailpit not installed (OTP emails). Either:\n"
        "  brew install mailpit && brew services start mailpit\n"
        "  or install Docker Desktop and run: rightly infra-docker"
    )


def print_storage_note() -> None:
    if _port_open("127.0.0.1", 9000):
        print("MinIO on :9000 — set RIGHTLY_STORAGE_DRIVER=minio in .env if you use Docker MinIO.")
        return
    print("Verification uploads use local disk (RIGHTLY_STORAGE_DRIVER=filesystem in .env).")


def start_local_stack() -> None:
    if shutil.which("brew") is None:
        print(
            "Docker is not installed and Homebrew was not found.\n"
            "Install Docker Desktop (recommended) or Homebrew, then retry.",
            file=sys.stderr,
        )
        sys.exit(1)

    print("Starting local infra via Homebrew (no Docker).")
    ensure_brew_env()
    pg = start_postgres()
    print(f"PostgreSQL formula: {pg}")
    start_redis()
    start_optional_mailpit()
    print_storage_note()

    if _port_open("127.0.0.1", 5432):
        print("Postgres: port 5432 OK")
    else:
        print("Postgres: port 5432 not reachable yet — wait a few seconds and run: rightly doctor", file=sys.stderr)
    if _port_open("127.0.0.1", 6379):
        print("Redis: port 6379 OK")
    else:
        print("Redis: port 6379 not reachable yet", file=sys.stderr)