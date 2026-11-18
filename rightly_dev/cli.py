"""Start and check Rightly services from the project virtual environment."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

from rightly_dev.env_sync import ensure_brew_env, load_dotenv_into_environ
from rightly_dev.infra_local import start_local_stack

ROOT = Path(__file__).resolve().parent.parent
COLIMA_SOCK = Path.home() / ".colima" / "default" / "docker.sock"
DOCKER_CLI_CONFIG = ROOT / ".docker-cli"


def _run(cmd: list[str], *, cwd: Path | None = None, check: bool = True, extra_env: dict[str, str] | None = None) -> int:
    print(f"\n→ {' '.join(cmd)}", flush=True)
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)
    completed = subprocess.run(cmd, cwd=cwd or ROOT, check=False, env=env)
    if check and completed.returncode != 0:
        sys.exit(completed.returncode)
    return completed.returncode


def _require(cmd: str) -> None:
    if shutil.which(cmd) is None:
        print(f"Missing required program on PATH: {cmd}", file=sys.stderr)
        sys.exit(1)


def cmd_setup(_: argparse.Namespace) -> None:
    """Copy env templates and install Node deps (Python deps come from `.venv`)."""
    ensure_brew_env()
    env = ROOT / ".env"
    fe_env = ROOT / "frontend" / ".env"
    if not fe_env.exists():
        shutil.copy(ROOT / "frontend" / ".env.example", fe_env)
        print("Created frontend/.env")
    ve = ROOT / ".venv"
    if not ve.exists():
        print("No .venv found. Run: python3 -m venv .venv && .venv/bin/pip install -e .", file=sys.stderr)
        sys.exit(1)
    _require("npm")
    _run(["npm", "install"], cwd=ROOT / "frontend")


def _compose_argv() -> list[str] | None:
    if shutil.which("docker-compose"):
        return ["docker-compose"]
    if shutil.which("docker"):
        probe = subprocess.run(["docker", "compose", "version"], capture_output=True, text=True)
        if probe.returncode == 0:
            return ["docker", "compose"]
    return None


def _docker_env() -> dict[str, str] | None:
    extra: dict[str, str] = {}
    if COLIMA_SOCK.exists():
        extra["DOCKER_HOST"] = f"unix://{COLIMA_SOCK}"
    if DOCKER_CLI_CONFIG.exists():
        extra["DOCKER_CONFIG"] = str(DOCKER_CLI_CONFIG)
    return extra or None


def cmd_infra_docker(_: argparse.Namespace) -> None:
    compose = _compose_argv()
    if compose is None:
        print("docker compose is not available.", file=sys.stderr)
        sys.exit(1)
    env = _docker_env()
    _run(compose + ["up", "-d"], extra_env=env)
    _run(compose + ["ps"], check=False, extra_env=env)


def cmd_infra(_: argparse.Namespace) -> None:
    """Docker Compose when usable; otherwise Homebrew Postgres + Redis + Mailpit."""
    compose = _compose_argv()
    daemon_ok = COLIMA_SOCK.exists() or Path("/var/run/docker.sock").exists()
    if compose and daemon_ok:
        try:
            cmd_infra_docker(_)
            return
        except SystemExit:
            pass
    if compose and not daemon_ok:
        print("Docker CLI found but no daemon — using Homebrew stack.")
    elif compose is None:
        print("Docker Compose not installed — using Homebrew stack.")
    else:
        print("Docker Compose failed — using Homebrew stack.")
    print("Tip: after Colima + pull issues, verification uploads use filesystem storage in .env\n")
    start_local_stack()


def cmd_infra_local(_: argparse.Namespace) -> None:
    start_local_stack()


def cmd_infra_down(_: argparse.Namespace) -> None:
    if shutil.which("docker"):
        _run(["docker", "compose", "down"])
        return
    if shutil.which("brew") is None:
        print("Nothing to stop (no docker or brew).", file=sys.stderr)
        sys.exit(1)
    print("Stopping Homebrew redis (postgres left running — shared machine service).")
    subprocess.run(["brew", "services", "stop", "redis"], check=False)


def cmd_api(_: argparse.Namespace) -> None:
    ensure_brew_env()
    load_dotenv_into_environ()
    _require("mvn")
    _run(["mvn", "spring-boot:run"], cwd=ROOT / "backend-java", check=False)


def cmd_ui(_: argparse.Namespace) -> None:
    _require("npm")
    _run(["npm", "run", "dev"], cwd=ROOT / "frontend", check=False)


def cmd_test_java(_: argparse.Namespace) -> None:
    _require("mvn")
    _run(["mvn", "test"], cwd=ROOT / "backend-java")


def cmd_ai(_: argparse.Namespace) -> None:
    """Sprint 4 placeholder — requires `pip install -e \".[ai]\"`."""
    try:
        import uvicorn  # noqa: F401
    except ImportError:
        print('Install AI extras first: .venv/bin/pip install -e ".[ai]"', file=sys.stderr)
        sys.exit(1)
    _run(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--reload",
            "--port",
            "8090",
        ],
        cwd=ROOT / "backend-ai",
        check=False,
    )


def cmd_doctor(_: argparse.Namespace) -> None:
    in_venv = sys.prefix != getattr(sys, "base_prefix", sys.prefix)
    print(f"Python: {sys.executable}")
    print(f"Inside .venv: {in_venv}")
    for name in ("docker", "brew", "mvn", "java", "npm", "node", "psql", "redis-cli"):
        path = shutil.which(name)
        print(f"{name}: {path or 'NOT FOUND'}")
    if shutil.which("docker") is None:
        print("\nNo Docker → use: rightly infra  (Homebrew Postgres + Redis)")
    if not in_venv:
        print("\nTip: source .venv/bin/activate  (or use .venv/bin/rightly ...)")


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="rightly",
        description="Run Rightly from the project .venv (infra, API, UI).",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("setup", help="Create .env files and npm install").set_defaults(func=cmd_setup)
    sub.add_parser("infra", help="data services (Docker, or Homebrew if no Docker)").set_defaults(func=cmd_infra)
    sub.add_parser("infra-docker", help="docker compose up -d only").set_defaults(func=cmd_infra_docker)
    sub.add_parser("infra-local", help="Homebrew Postgres + Redis only").set_defaults(func=cmd_infra_local)
    sub.add_parser("infra-down", help="docker compose down or stop local redis").set_defaults(func=cmd_infra_down)
    sub.add_parser("api", help="Spring Boot on :8081").set_defaults(func=cmd_api)
    sub.add_parser("ui", help="Vite dev server on :5173").set_defaults(func=cmd_ui)
    sub.add_parser("test-java", help="mvn test in backend-java").set_defaults(func=cmd_test_java)
    sub.add_parser("ai", help="FastAPI placeholder on :8090 (Sprint 4)").set_defaults(func=cmd_ai)
    sub.add_parser("doctor", help="Check tools and venv").set_defaults(func=cmd_doctor)

    args = parser.parse_args()
    os.chdir(ROOT)
    args.func(args)


if __name__ == "__main__":
    main()