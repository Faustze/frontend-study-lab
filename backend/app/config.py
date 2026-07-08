from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://studylab:studylab@localhost:5432/studylab"

    @field_validator("database_url")
    @classmethod
    def _force_asyncpg_scheme(cls, url: str) -> str:
        """Hosting platforms (Railway, Render, Heroku) hand out
        postgres:// or postgresql:// URLs; SQLAlchemy needs the
        async driver spelled out."""
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                return "postgresql+asyncpg://" + url[len(prefix):]
        return url

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expires_days: int = 7

    # Where to send the user after a successful OAuth callback
    frontend_url: str = "http://localhost:5173"

    allowed_origins: str = "http://localhost:5173,http://localhost:5174"

    google_client_id: str = ""
    google_client_secret: str = ""
    twitch_client_id: str = ""
    twitch_client_secret: str = ""
    discord_client_id: str = ""
    discord_client_secret: str = ""

    # Enables POST /api/auth/dev-login (mock user without OAuth).
    # Never enable in production.
    dev_login_enabled: bool = False

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
