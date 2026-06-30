"""
Configuration — loads from environment variables
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Mannobot"
    DEBUG: bool = True
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str = "sqlite:///./mannobot.db"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # AI (OpenRouter)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "meta-llama/llama-3.3-70b-instruct:free"

    # WhatsApp (WAHA)
    WAHA_URL: str = "http://localhost:3000"
    WAHA_API_KEY: str = ""

    # n8n
    N8N_WEBHOOK_URL: str = ""

    # Defaults
    WAHA_SESSION_NAME: str = "mannobot"

    class Config:
        env_file = ".env"


settings = Settings()
