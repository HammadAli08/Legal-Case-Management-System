from functools import lru_cache
from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- Pydantic Settings Configuration ---
    # Defines the source of environment variables (.env file)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    # --- API Configuration ---
    API_TITLE: str = "Legal AI API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "AI-Powered Legal Case Management & Precedent Search"
    
    # --- CORS ---
    # In a production environment, you should replace ["*"] with a list of specific origins.
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [origin.strip() for origin in v.split(",")]
        elif isinstance(v, list):
            return v
        return v
    
    # --- Qdrant Configuration (Required Fields) ---
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION: str = "legal_precedents"
    
    # --- LLM and Embedding Configuration (Required Fields) ---
    GROQ_API_KEY: str
    HUGGINGFACE_API_KEY: str # Added this as it was used in main.py
    GROQ_MODEL: str = "mixtral-8x7b-32768" # Default changed to match a common Groq model
    
    # --- ML Model Paths (relative to backend directory) ---
    CLASSIFICATION_PIPELINE: str = "models/case_classification/voting_pipeline.pkl"
    CLASSIFICATION_ENCODER: str = "models/case_classification/label_encoder.pkl"
    PRIORITIZATION_PIPELINE: str = "models/case_prioritization/stacking_pipeline.pkl"
    PRIORITIZATION_ENCODER: str = "models/case_prioritization/label_encoder.pkl"
    
@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached instance of the Settings object, loading values
    from environment variables or the .env file specified in model_config.
    """
    return Settings()

# Example usage (optional, for local testing):
# if __name__ == "__main__":
#     settings = get_settings()
#     print(f"API Title: {settings.API_TITLE}")
#     print(f"Qdrant URL: {settings.QDRANT_URL}")
#     # Note: Do not print sensitive API keys in a real application's output!