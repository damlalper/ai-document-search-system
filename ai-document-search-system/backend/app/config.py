"""
Application Configuration
Loads environment variables using pydantic-settings
"""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application Info
    app_name: str = "AI Document Search System"
    app_version: str = "1.0.0"
    debug: bool = True

    # Groq API Configuration
    groq_api_key: str

    # Data Storage Paths
    data_dir: Path = Path("./data")
    upload_dir: Path = Path("./data/uploads")
    extracted_dir: Path = Path("./data/extracted")
    metadata_file: Path = Path("./data/metadata.json")

    # Search Settings
    max_search_results: int = 10
    tfidf_max_features: int = 1000

    # LLM Settings
    default_model: str = "llama3-8b-8192"
    max_tokens: int = 1024
    temperature: float = 0.7

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()
