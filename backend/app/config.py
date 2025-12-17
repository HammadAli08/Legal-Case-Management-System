from functools import lru_cache
from typing import List, Any, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- Pydantic Settings Configuration ---
    # Defines the source of environment variables (.env file)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Ignore extra fields like RAILWAY_ variables
    )

    # --- API Configuration ---
    API_TITLE: str = "Legal AI API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "AI-Powered Legal Case Management & Precedent Search"
    
    # --- CORS ---
    # Changed to simple str to prevent Pydantic JSON parsing errors
    # We will handle the splitting if needed, but main.py currently uses wildcard "*"
    ALLOWED_ORIGINS: str = "*"
    
    # --- Qdrant Configuration (Made Optional to prevent Startup Crashes) ---
    QDRANT_URL: str = ""
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION: str = "legal_precedents"
    
    # --- LLM and Embedding Configuration (Made Optional) ---
    GROQ_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = "" 
    GROQ_MODEL: str = "mixtral-8x7b-32768"
    
    # --- ML Model Paths ---
    CLASSIFICATION_PIPELINE: str = "models/case_classification/voting_pipeline.pkl"
    CLASSIFICATION_ENCODER: str = "models/case_classification/label_encoder.pkl"
    PRIORITIZATION_PIPELINE: str = "models/case_prioritization/stacking_pipeline.pkl"
    PRIORITIZATION_ENCODER: str = "models/case_prioritization/label_encoder.pkl"
    
@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached instance of the Settings object.
    """
    return Settings()