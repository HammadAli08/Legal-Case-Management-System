from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Configuration
    API_TITLE: str = "Legal AI API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "AI-Powered Legal Case Management & Precedent Search"
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    # Qdrant Configuration
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION: str = "legal_precedents"
    
    # Groq Configuration
    GROQ_API_KEY: str
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    
    # ML Model Paths (relative to backend directory)
    CLASSIFICATION_PIPELINE: str = "models/case_classification/voting_pipeline.pkl"
    CLASSIFICATION_ENCODER: str = "models/case_classification/label_encoder.pkl"
    PRIORITIZATION_PIPELINE: str = "models/case_prioritization/stacking_pipeline.pkl"
    PRIORITIZATION_ENCODER: str = "models/case_prioritization/label_encoder.pkl"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
