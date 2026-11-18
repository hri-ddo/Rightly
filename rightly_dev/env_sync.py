"""Keep local .env aligned with documented brew-only defaults."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / ".env"
EXAMPLE = ROOT / ".env.example"

BREW_DEFAULTS = {
    "RIGHTLY_STORAGE_DRIVER": "filesystem",
    "RIGHTLY_UPLOAD_DIR": "./uploads",
    "MAIL_HOST": "localhost",
    "MAIL_PORT": "1025",
}


def load_dotenv_into_environ() -> None:
    """Export key=value pairs from `.env` into os.environ for child processes."""
    import os

    if not ENV.exists():
        return
    for line in ENV.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def ensure_brew_env() -> None:
    if not ENV.exists() and EXAMPLE.exists():
        ENV.write_text(EXAMPLE.read_text(encoding="utf-8"), encoding="utf-8")
        print(f"Created {ENV.name} from .env.example")

    lines = ENV.read_text(encoding="utf-8").splitlines() if ENV.exists() else []
    present = {line.split("=", 1)[0] for line in lines if "=" in line and not line.strip().startswith("#")}
    changed = False
    for key, value in BREW_DEFAULTS.items():
        if key not in present:
            lines.append(f"{key}={value}")
            changed = True
    if changed:
        ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"Updated {ENV.name} with Homebrew dev defaults (filesystem uploads + Mailpit SMTP).")