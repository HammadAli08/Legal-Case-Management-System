from pydantic import BaseModel, Field
from typing import List, Optional

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
    details: Optional[dict] = None

class CaseClassificationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Case text to classify")

class CaseClassificationResponse(BaseModel):
    category: str
    confidence: Optional[float] = None

class CasePrioritizationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Case text to prioritize")

class CasePrioritizationResponse(BaseModel):
    priority: str
    confidence: Optional[float] = None

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    chat_history: List[ChatMessage] = []

class SourceDocument(BaseModel):
    index: int
    content: str
    metadata: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDocument] = []
