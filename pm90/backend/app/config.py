from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PM90 API"
    api_prefix: str = "/api"
    environment: str = "development"
    database_url: str = "sqlite:///./pm90.db"
    jwt_secret: str = "pm90-dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000"
    ai_provider: str = "fallback"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"
    seed_demo_user: bool = True
    seed_community_users: bool = True
    demo_user_email: str = "demo@pm90.app"
    demo_user_password: str = "Demo123!"
    demo_user_name: str = "PM90 Demo User"
    frontend_base_url: str = "http://localhost:3000"
    default_daily_xp: int = 80
    pdf_title: str = "PM90 Export"
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
